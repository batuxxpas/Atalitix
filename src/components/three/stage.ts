import * as THREE from "three";
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { iconSvg } from "./icons";

export const COLORS = {
  navy: new THREE.Color("#0b1a4f"),
  navy700: new THREE.Color("#13256e"),
  navy600: new THREE.Color("#22357f"),
  blue: new THREE.Color("#1d6cf2"),
  blue400: new THREE.Color("#6f9dff"),
  blue200: new THREE.Color("#c4d7ff"),
  blue100: new THREE.Color("#e3ecff"),
  steel: new THREE.Color("#a9b6d3"),
  paper: new THREE.Color("#f4f6fa"),
  white: new THREE.Color("#ffffff"),
};

export const ease = {
  outCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  inOutCubic: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  outBack: (t: number) => {
    const c1 = 1.5, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  /** progress of a timed step: 0 before `start`, 1 after `start + dur` */
  step: (t: number, start: number, dur: number) => Math.min(1, Math.max(0, (t - start) / dur)),
};

/** Critically-damped-ish spring (semi-implicit Euler). Mutates and returns the state's value. */
export function spring(st: { x: number; v: number }, target: number, dt: number, k = 170, c = 19) {
  st.v += (k * (target - st.x) - c * st.v) * dt;
  st.x += st.v * dt;
  return st.x;
}
export const springState = (x = 0) => ({ x, v: 0 });

/** "r,g,b" string for canvas gradients from a hex colour. */
export function rgbString(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}

/** Department colours — validated categorical set (colour-blind safe as neighbours on the ring). */
export const DEPT = {
  finans: "#0E9F75",
  satinalma: "#7357D6",
  stok: "#0A93A5",
  uretim: "#E0553D",
  satis: "#1D6CF2",
  ik: "#B5389E",
} as const;

/* ---------- Materials: satin / gloss finishes lit by a studio environment ---------- */
export const mat = {
  satin: (color: THREE.Color | string, o: Partial<THREE.MeshPhysicalMaterialParameters> = {}) =>
    new THREE.MeshPhysicalMaterial({ color, roughness: 0.42, metalness: 0, clearcoat: 0.6, clearcoatRoughness: 0.25, ...o }),
  gloss: (color: THREE.Color | string, o: Partial<THREE.MeshPhysicalMaterialParameters> = {}) =>
    new THREE.MeshPhysicalMaterial({ color, roughness: 0.22, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.08, ...o }),
  glow: (color: THREE.Color | string, intensity = 1.6) =>
    new THREE.MeshStandardMaterial({ color: "#000000", emissive: color, emissiveIntensity: intensity, roughness: 1 }),
};

export function roundedBox(w: number, h: number, d: number, r: number, material: THREE.Material, segments = 6) {
  const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, segments, Math.min(r, w / 2, h / 2, d / 2)), material);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

/** Soft radial "ambient occlusion" disc for under objects (reads as a contact shadow on white). */
export function softShadow(radius: number, opacity = 0.18, squash = 1) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, "rgba(11,26,79,1)");
  grd.addColorStop(0.55, "rgba(11,26,79,0.45)");
  grd.addColorStop(1, "rgba(11,26,79,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(radius * 2, radius * 2 * squash), new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity, depthWrite: false }));
  m.rotation.x = -Math.PI / 2;
  m.renderOrder = -1;
  return m;
}

/** Soft blue glow sprite (normal blending so it also reads on white). */
export function glowSprite(size: number, color = "29,108,242", opacity = 1) {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, `rgba(${color},1)`);
  grd.addColorStop(0.25, `rgba(${color},0.55)`);
  grd.addColorStop(1, `rgba(${color},0)`);
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, opacity, depthWrite: false }));
  s.scale.setScalar(size);
  return s;
}

/**
 * A tube along a curve whose light travels along it (uv.x = 0 → 1).
 * `draw` reveals the line, `out`/`back` are travelling highlights in both directions.
 */
export function flowTube(curve: THREE.Curve<THREE.Vector3>, radius: number, segments = 80) {
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uDraw: { value: 0 },
      uBase: { value: 0.3 },
      uSpeed: { value: 0.38 },
      uPhase: { value: 0 },
      uBoost: { value: 0 },
      uDash: { value: 0 },
      uColor: { value: COLORS.blue.clone() },
      uRest: { value: COLORS.blue400.clone() },
      uBack: { value: COLORS.navy.clone() },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime, uDraw, uBase, uSpeed, uPhase, uBoost, uDash;
      uniform vec3 uColor, uRest, uBack;
      varying vec2 vUv;
      float comet(float head, float x, float len) {
        float d = head - x;
        return d >= 0.0 && d <= len ? pow(1.0 - d / len, 2.0) : 0.0;
      }
      void main() {
        float x = vUv.x;
        if (x > uDraw) discard;
        float dash = uDash > 0.5 ? step(0.45, fract(x * 22.0 - uTime * 1.2)) : 1.0;
        float h1 = fract(uTime * uSpeed + uPhase) * 1.35;
        float h2 = 1.0 - fract(uTime * uSpeed * 0.8 + uPhase + 0.5) * 1.35;
        float a = comet(h1, x, 0.32);
        float b = comet(x, h2, 0.22) * 0.7;
        float base = uBase * dash * (1.0 + uBoost * 2.5);
        vec3 col = mix(uRest, uColor, clamp(a + uBoost, 0.0, 1.0));
        col = mix(col, uBack, b * (1.0 - a));
        float alpha = clamp(base + a * (0.95) + b * 0.75, 0.0, 1.0);
        gl_FragColor = vec4(col, alpha);
        #include <colorspace_fragment>
      }
    `,
  });
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, segments, radius, 8, false), material);
  mesh.renderOrder = 2;
  return { mesh, material, uniforms: material.uniforms };
}

/* ---------- Labels ---------- */

/** Glass chip label (HTML, site fonts) anchored to a 3D point. */
export function chip(text: string, opts: { icon?: string; variant?: "module" | "outer" | "dim"; meta?: string; above?: boolean; side?: boolean; color?: string } = {}): CSS2DObject {
  const el = document.createElement("div");
  el.className = `tl-chip tl-chip--${opts.variant || "module"}${opts.side ? " tl-chip--meta-hover" : ""}`;
  el.innerHTML =
    (opts.icon ? `<span class="tl-chip__ico">${iconSvg(opts.icon, 13, 2)}</span>` : "") +
    `<span class="tl-chip__txt">${text}</span>` +
    (opts.meta ? `<span class="tl-chip__meta">${opts.meta}</span>` : "");
  el.style.opacity = "0";
  if (opts.color) el.style.setProperty("--c", opts.color);
  const obj = new CSS2DObject(el);
  if (opts.above) obj.center.set(0.5, 1); // sits on top of its point
  else obj.userData.auto = true; // anchored away from the centre each fit pass
  if (opts.side) obj.userData.side = true; // only left / right of its point
  return obj;
}

export interface Stage {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  root: THREE.Group;
  lite: boolean;
  /** Pointer position in the host, -1..1 (smoothed) and raw NDC for raycasting. */
  pointer: { x: number; y: number; inside: boolean; ndc: THREE.Vector2 };
  /** -1 (host below the fold) … 0 (centred) … 1 (scrolled past), smoothed */
  scroll: { p: number };
  /** Offsets the scene can animate: orbit angles (rad), distance multiplier, look-at shift. */
  rig: { az: number; el: number; dist: number; tx: number; ty: number; tz: number };
  /** Labels the camera keeps inside the frame. */
  track: (...objs: CSS2DObject[]) => void;
  run: (frame: (t: number, dt: number) => void) => void;
  dispose: () => void;
}

/**
 * Product-render stage: long-lens perspective camera, studio environment reflections,
 * soft shadows, HTML labels that are kept inside the frame, and a loop that sleeps off-screen.
 */
export function createStage(
  host: HTMLDivElement,
  opts: { width: number; height: number; azimuth: number; elevation: number; target?: [number, number, number]; fov?: number },
): Stage {
  const lite = window.innerWidth < 768 || (navigator.hardwareConcurrency || 8) <= 4;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  // Supersample: render above the screen's pixel density, then step down only if frames get slow
  const dpr = window.devicePixelRatio || 1;
  const minPR = Math.min(Math.max(dpr, 1), 2);
  let pixelRatio = lite ? Math.min(Math.max(dpr, 1.5), 2.5) : Math.min(Math.max(dpr * 1.5, 2), 3);
  renderer.setPixelRatio(pixelRatio);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.domElement.style.cssText = "display:block;width:100%;height:100%";
  host.appendChild(renderer.domElement);

  const labels = new CSS2DRenderer();
  labels.domElement.style.cssText = "position:absolute;inset:0;pointer-events:none";
  host.appendChild(labels.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new RoomEnvironment();
  const env = pmrem.fromScene(envScene, 0.04).texture;
  scene.environment = env;
  scene.environmentIntensity = 0.9;

  const camera = new THREE.PerspectiveCamera(opts.fov ?? 24, 1, 0.5, 200);
  const target = new THREE.Vector3(...(opts.target ?? [0, 0.6, 0]));

  // Key light with soft shadows + gentle fill
  scene.add(new THREE.HemisphereLight(0xffffff, 0xe4ebf8, 1.35));
  const sun = new THREE.DirectionalLight(0xffffff, 2.2);
  sun.position.set(-7, 16, 9);
  sun.castShadow = true;
  sun.shadow.mapSize.set(lite ? 2048 : 4096, lite ? 2048 : 4096);
  const sc = sun.shadow.camera;
  sc.left = -11; sc.right = 11; sc.top = 11; sc.bottom = -11; sc.near = 1; sc.far = 50;
  sun.shadow.radius = 5;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.02;
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0xcfe0ff, 0.9);
  rim.position.set(9, 6, -10);
  scene.add(rim);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ opacity: 0.045 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.002;
  floor.receiveShadow = true;
  scene.add(floor);

  const root = new THREE.Group();
  scene.add(root);

  /* Framing: fit the given world-space box at the target, then labels can pull back the zoom */
  let baseDist = 30;
  let fitZoom = 1;
  // The zoom is only adjusted while the scene settles (and briefly after a resize), never in
  // response to hover — otherwise a growing label would zoom out, lose the hover and loop.
  const clock = { t: 0 };
  let fitUntil = Infinity; // set once the camera rig has come to rest
  let rigRested = false;
  const resize = () => {
    const w = host.clientWidth || 1, h = host.clientHeight || 1;
    renderer.setSize(w, h, false);
    labels.setSize(w, h);
    camera.aspect = w / h;
    const tv = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
    baseDist = Math.max(opts.height / (2 * tv), opts.width / (2 * tv * camera.aspect));
    fitZoom = 1;
    camera.zoom = 1;
    camera.updateProjectionMatrix();
    fitCountdown = 0;
    fitUntil = Math.max(fitUntil, clock.t + 2.5);
  };
  let fitCountdown = 0;
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(host);

  /* Pointer */
  const pointer = { x: 0, y: 0, inside: false, ndc: new THREE.Vector2(-9, -9) };
  const ptarget = { x: 0, y: 0 };
  const onMove = (e: PointerEvent) => {
    const r = host.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
    const ny = -(((e.clientY - r.top) / r.height) * 2 - 1);
    ptarget.x = nx; ptarget.y = ny;
    pointer.ndc.set(nx, ny);
    pointer.inside = true;
  };
  const onLeave = () => { ptarget.x = 0; ptarget.y = 0; pointer.inside = false; pointer.ndc.set(-9, -9); };
  host.addEventListener("pointermove", onMove);
  host.addEventListener("pointerleave", onLeave);

  const scroll = { p: 0 };
  const rig = { az: 0, el: 0, dist: 1, tx: 0, ty: 0, tz: 0 };
  const look = new THREE.Vector3();
  const tracked: CSS2DObject[] = [];
  const v = new THREE.Vector3();
  const o = new THREE.Vector3();

  /** Keeps tracked labels inside the frame and pointing away from the centre. */
  const fitLabels = () => {
    if (!tracked.length) return;
    const hr = host.getBoundingClientRect();
    if (!hr.width) return;
    // anchor direction: away from the projected scene centre
    o.copy(target).setY(0).project(camera);
    for (const l of tracked) {
      if (!l.userData.auto) continue;
      l.getWorldPosition(v).project(camera);
      const dx = (v.x - o.x) * hr.width, dy = (v.y - o.y) * hr.height;
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len, uy = dy / len;
      if (l.userData.side) l.center.set(ux >= 0 ? 0 : 1, 0.5);
      else l.center.set(ux > 0.35 ? 0 : ux < -0.35 ? 1 : 0.5, uy > 0.55 ? 1 : uy < -0.55 ? 0 : 0.5);
    }
    if (clock.t > fitUntil) return;
    // wait for the intro camera move to finish before framing
    const atRest = Math.abs(rig.az) < 0.002 && Math.abs(rig.el) < 0.002 && Math.abs(rig.dist - 1) < 0.002;
    if (!atRest) return;
    if (!rigRested) { rigRested = true; fitUntil = clock.t + 2.5; }
    // overflow → zoom out a little; plenty of room → ease back to the base framing.
    // Measured in the widest state (hover-only details shown) so hovering never overflows.
    const margin = 16;
    labels.domElement.classList.add("tl-fit");
    const cx = hr.left + hr.width / 2, cy = hr.top + hr.height / 2;
    let need = Infinity;
    for (const l of tracked) {
      if (l.element.style.display === "none") continue;
      const r = l.element.getBoundingClientRect();
      if (!r.width) continue;
      const ex = Math.max(cx - r.left, r.right - cx);
      const ey = Math.max(cy - r.top, r.bottom - cy);
      need = Math.min(need, (hr.width / 2 - margin) / ex, (hr.height / 2 - margin) / ey);
    }
    labels.domElement.classList.remove("tl-fit");
    if (!isFinite(need)) return;
    if (need < 1) fitZoom = Math.max(0.55, fitZoom * need * 0.99);
    else if (need > 1.04 && fitZoom < 1) fitZoom = Math.min(1, fitZoom * Math.min(need * 0.99, 1.1));
  };

  /* Loop that sleeps while off-screen */
  let visible = false, raf = 0, frameFn: ((t: number, dt: number) => void) | null = null;
  let last = -1;
  let elapsed = 0;
  let frames = 0, slowAcc = 0, slowN = 0;
  const tick = (now: number) => {
    raf = 0;
    if (!visible || !frameFn) return;
    const dt = last < 0 ? 0.016 : Math.min((now - last) / 1000, 0.05);
    last = now;
    elapsed += dt;
    clock.t = elapsed;
    pointer.x += (ptarget.x - pointer.x) * Math.min(1, dt * 3.5);
    pointer.y += (ptarget.y - pointer.y) * Math.min(1, dt * 3.5);
    const r = host.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const sp = THREE.MathUtils.clamp((vh / 2 - (r.top + r.height / 2)) / vh, -1, 1);
    scroll.p += (sp - scroll.p) * Math.min(1, dt * 5);

    frameFn(elapsed, dt);

    // Camera orbit: base angle + scene rig (intro / focus) + pointer + scroll
    const az = THREE.MathUtils.degToRad(opts.azimuth) + rig.az + pointer.x * 0.16 + scroll.p * 0.22;
    const el = opts.elevation + rig.el - pointer.y * 0.05 + scroll.p * 0.1;
    const dist = baseDist * rig.dist;
    look.set(target.x + rig.tx, target.y + rig.ty, target.z + rig.tz);
    camera.position.set(
      look.x + Math.sin(az) * Math.cos(el) * dist,
      look.y + Math.sin(el) * dist,
      look.z + Math.cos(az) * Math.cos(el) * dist,
    );
    camera.lookAt(look);
    if (Math.abs(camera.zoom - fitZoom) > 0.0005) {
      camera.zoom += (fitZoom - camera.zoom) * Math.min(1, dt * 6);
      camera.updateProjectionMatrix();
    }
    renderer.render(scene, camera);
    labels.render(scene, camera);
    if (++frames % 3 === 0 || fitCountdown++ < 3) fitLabels();
    // Adaptive resolution: if the device can't keep ~50 fps, step the pixel ratio down
    if (frames > 90) {
      slowAcc += dt; slowN++;
      if (slowN === 60) {
        if (slowAcc / slowN > 0.021 && pixelRatio > minPR) {
          pixelRatio = Math.max(minPR, pixelRatio - 0.5);
          renderer.setPixelRatio(pixelRatio);
          renderer.setSize(host.clientWidth || 1, host.clientHeight || 1, false);
        }
        slowAcc = 0; slowN = 0;
      }
    }
    raf = requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !raf) {
      last = -1;
      raf = requestAnimationFrame(tick);
    }
  }, { rootMargin: "120px" });
  io.observe(host);

  return {
    scene, camera, renderer, root, pointer, scroll, rig, lite,
    track: (...objs) => { tracked.push(...objs); },
    run: (frame) => { frameFn = frame; if (visible && !raf) raf = requestAnimationFrame(tick); },
    dispose: () => {
      cancelAnimationFrame(raf);
      io.disconnect(); ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      scene.traverse((obj) => {
        const m = obj as THREE.Mesh;
        m.geometry?.dispose?.();
        const mt = m.material as THREE.Material | THREE.Material[] | undefined;
        const list = Array.isArray(mt) ? mt : mt ? [mt] : [];
        list.forEach((x) => {
          const mm = x as THREE.MeshStandardMaterial;
          mm.map?.dispose?.();
          mm.alphaMap?.dispose?.();
          x.dispose();
        });
        if (obj instanceof CSS2DObject) obj.element.remove();
      });
      env.dispose();
      pmrem.dispose();
      envScene.traverse((obj) => {
        const m = obj as THREE.Mesh;
        m.geometry?.dispose?.();
        (m.material as THREE.Material | undefined)?.dispose?.();
      });
      renderer.dispose();
      renderer.domElement.remove();
      labels.domElement.remove();
    },
  };
}
