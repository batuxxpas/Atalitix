import * as THREE from "three";
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";

/** True when the browser can create a WebGL context. */
export function webglAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export const COLORS = {
  navy: new THREE.Color("#0b1a4f"),
  navy700: new THREE.Color("#13256e"),
  blue: new THREE.Color("#1d6cf2"),
  blue400: new THREE.Color("#6f9dff"),
  paper: new THREE.Color("#f3f4f7"),
  white: new THREE.Color("#ffffff"),
};

export const ease = {
  outCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  outBack: (t: number) => {
    const c1 = 1.4, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  /** progress of a timed step: 0 before `start`, 1 after `start + dur` */
  step: (t: number, start: number, dur: number) => Math.min(1, Math.max(0, (t - start) / dur)),
};

export interface Stage {
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  renderer: THREE.WebGLRenderer;
  /** Everything that should turn with the pointer goes in here. */
  root: THREE.Group;
  /** Pointer position in the host, -1..1 (smoothed). */
  pointer: { x: number; y: number; inside: boolean; ndc: THREE.Vector2 };
  /** Start the render loop. `frame(t)` gets seconds since start; returns a stop function. */
  run: (frame: (t: number, dt: number) => void) => void;
  dispose: () => void;
}

/**
 * Isometric "architectural model" stage: orthographic camera, soft daylight with
 * contact shadows, crisp HTML labels (site fonts) and a loop that sleeps off-screen.
 */
export function createStage(host: HTMLDivElement, opts: { viewSize: number; elevation?: number; azimuth?: number }): Stage {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.style.cssText = "display:block;width:100%;height:100%";
  host.appendChild(renderer.domElement);

  const labels = new CSS2DRenderer();
  labels.domElement.style.cssText = "position:absolute;inset:0;pointer-events:none";
  host.appendChild(labels.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 200);
  const az = ((opts.azimuth ?? 45) * Math.PI) / 180;
  const dist = 30;
  const elev = opts.elevation ?? 0.62; // radians above the ground plane
  camera.position.set(Math.sin(az) * Math.cos(elev) * dist, Math.sin(elev) * dist, Math.cos(az) * Math.cos(elev) * dist);
  camera.lookAt(0, 0, 0);

  // Soft daylight
  scene.add(new THREE.HemisphereLight(0xffffff, 0xdfe5f2, 2.2));
  const sun = new THREE.DirectionalLight(0xffffff, 2.2);
  sun.position.set(-6, 14, 8);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -12; sun.shadow.camera.right = 12;
  sun.shadow.camera.top = 12; sun.shadow.camera.bottom = -12;
  sun.shadow.radius = 6;
  sun.shadow.bias = -0.0005;
  scene.add(sun);

  // Invisible floor that only receives the shadow
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ opacity: 0.07 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.001;
  floor.receiveShadow = true;
  scene.add(floor);

  const root = new THREE.Group();
  scene.add(root);

  const resize = () => {
    const w = host.clientWidth || 1, h = host.clientHeight || 1;
    renderer.setSize(w, h, false);
    labels.setSize(w, h);
    // Narrow screens: pull the camera back a little so labels stay inside the frame
    const a = w / h, s = opts.viewSize * (w < 420 ? 1.28 : w < 640 ? 1.12 : 1);
    if (a >= 1) { camera.left = (-s * a) / 2; camera.right = (s * a) / 2; camera.top = s / 2; camera.bottom = -s / 2; }
    else { camera.left = -s / 2; camera.right = s / 2; camera.top = s / (2 * a); camera.bottom = -s / (2 * a); }
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(host);

  // Pointer (smoothed in the loop)
  const pointer = { x: 0, y: 0, inside: false, ndc: new THREE.Vector2(-9, -9) };
  const target = { x: 0, y: 0 };
  const onMove = (e: PointerEvent) => {
    const r = host.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
    const ny = -(((e.clientY - r.top) / r.height) * 2 - 1);
    target.x = nx; target.y = ny;
    pointer.ndc.set(nx, ny);
    pointer.inside = true;
  };
  const onLeave = () => { target.x = 0; target.y = 0; pointer.inside = false; pointer.ndc.set(-9, -9); };
  host.addEventListener("pointermove", onMove);
  host.addEventListener("pointerleave", onLeave);

  // Loop that sleeps while off-screen
  let visible = false, raf = 0, frameFn: ((t: number, dt: number) => void) | null = null;
  const clock = new THREE.Clock(false);
  const tick = () => {
    raf = 0;
    if (!visible || !frameFn) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    pointer.x += (target.x - pointer.x) * Math.min(1, dt * 4);
    pointer.y += (target.y - pointer.y) * Math.min(1, dt * 4);
    frameFn(clock.elapsedTime, dt);
    renderer.render(scene, camera);
    labels.render(scene, camera);
    raf = requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) {
      if (!clock.running) clock.start();
      else clock.getDelta(); // don't jump after being off-screen
      if (!raf) raf = requestAnimationFrame(tick);
    }
  }, { rootMargin: "100px" });
  io.observe(host);

  return {
    scene, camera, renderer, root, pointer,
    run: (frame) => { frameFn = frame; if (visible && !raf) raf = requestAnimationFrame(tick); },
    dispose: () => {
      cancelAnimationFrame(raf);
      io.disconnect(); ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose()); else mat?.dispose?.();
        if (o instanceof CSS2DObject) o.element.remove();
      });
      renderer.dispose();
      renderer.domElement.remove();
      labels.domElement.remove();
    },
  };
}

/** Crisp HTML label anchored to a 3D point (uses the site's fonts). */
export function label(text: string, className: string): CSS2DObject {
  const el = document.createElement("div");
  el.className = className;
  el.textContent = text;
  return new CSS2DObject(el);
}

/** A box with drafting-style outline (architectural model look). */
export function outlinedBox(w: number, h: number, d: number, color: THREE.Color, edgeColor: THREE.Color, edgeOpacity = 0.4, roughness = 0.85) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mat = new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.02 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: edgeColor, transparent: true, opacity: edgeOpacity }));
  mesh.add(edges);
  return { mesh, mat, edges };
}

/**
 * Anchors a label so its text extends away from the centre on screen
 * (left-side labels end at the point, right-side labels start at it).
 * `azimuthDeg` must match the stage camera.
 */
export function anchorOutward(obj: CSS2DObject, x: number, z: number, azimuthDeg: number) {
  const az = (azimuthDeg * Math.PI) / 180;
  const sx = x * Math.cos(az) - z * Math.sin(az); // screen-right component
  obj.center.set(sx > 0.4 ? 0 : sx < -0.4 ? 1 : 0.5, 0.5);
}
