"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  createStage, chip, roundedBox, softShadow, glowSprite, flowTube, mat, spring, springState, rgbString,
  COLORS, DEPT, ease,
} from "./stage";
import { DIORAMAS, makePalette } from "./dioramas";

const MODULES = [
  { name: "Finans", key: "finans" },
  { name: "Satınalma", key: "satinalma" },
  { name: "Stok", key: "stok" },
  { name: "Üretim", key: "uretim" },
  { name: "Satış", key: "satis" },
  { name: "İK", key: "ik" },
] as const;

const PLATE_R = 6.5;
const MOD_R = 4.35;
const TILE = 1.95;
const PLATE_TOP = 0.34;
const TILE_TOP = PLATE_TOP + 0.24;
const INTRO = 2.8; // seconds of camera move at the start
const TOUR_STEP = 3.4; // seconds per module in the idle tour

const deg = (d: number) => (d * Math.PI) / 180;

function canvasTexture(size: number, draw: (g: CanvasRenderingContext2D, S: number) => void) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  draw(c.getContext("2d")!, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 16;
  return t;
}

/**
 * ERP platform model.
 * A stacked ERP core, six department tiles (each with its own colour and a small working model),
 * data packets travelling core → department along arcs. When idle, the scene tours the departments
 * one by one; hovering takes over the focus.
 */
export default function ErpScene3D({ play = true }: { play?: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playRef = useRef(play);
  useEffect(() => { playRef.current = play; }, [play]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const stage = createStage(host, { width: 14.0, height: 11.2, azimuth: 38, elevation: 0.78, target: [0, 1.0, 0.1] });
    const { root, camera, pointer, scene, rig } = stage;

    /* Base: plain layered disc, two hairline rings, soft contact shadow */
    const ao = softShadow(PLATE_R + 1.6, 0.18);
    ao.position.y = 0.002;
    scene.add(ao);
    const base = new THREE.Group();
    root.add(base);
    const under = new THREE.Mesh(new THREE.CylinderGeometry(PLATE_R + 0.2, PLATE_R + 0.2, 0.1, 160), mat.satin(COLORS.blue100));
    under.position.y = 0.05;
    under.receiveShadow = true;
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(PLATE_R, PLATE_R + 0.06, 0.24, 160), mat.satin("#ffffff", { roughness: 0.5 }));
    plate.position.y = 0.22;
    plate.castShadow = true;
    plate.receiveShadow = true;
    const deckTex = canvasTexture(2048, (g, S) => {
      const k = S / 2 / PLATE_R;
      g.translate(S / 2, S / 2);
      g.strokeStyle = "rgba(11,26,79,0.08)";
      g.lineWidth = 3;
      for (const r of [1.85, PLATE_R - 0.4]) { g.beginPath(); g.arc(0, 0, r * k, 0, Math.PI * 2); g.stroke(); }
    });
    const deck = new THREE.Mesh(new THREE.CircleGeometry(PLATE_R - 0.01, 160), new THREE.MeshStandardMaterial({ map: deckTex, transparent: true, roughness: 0.9, depthWrite: false }));
    deck.rotation.x = -Math.PI / 2;
    deck.position.y = PLATE_TOP + 0.002;
    deck.receiveShadow = true;
    base.add(under, plate, deck);

    /* Core: blue stack, white top engraved "ERP", light seams */
    const core = new THREE.Group();
    root.add(core);
    const seamMat = mat.glow(new THREE.Color("#a9c8ff"), 1.3);
    const coreParts: { m: THREE.Object3D; y: number; d: number; st: { x: number; v: number } }[] = [];
    const addCore = (m: THREE.Object3D, y: number, d: number) => { core.add(m); coreParts.push({ m, y, d, st: springState(2.6) }); };
    addCore(roundedBox(2.5, 0.34, 2.5, 0.12, mat.gloss(COLORS.blue)), PLATE_TOP + 0.17, 0.2);
    addCore(roundedBox(2.38, 0.06, 2.38, 0.03, seamMat), PLATE_TOP + 0.37, 0.3);
    addCore(roundedBox(2.3, 0.34, 2.3, 0.12, mat.gloss("#4d8ff7")), PLATE_TOP + 0.57, 0.4);
    addCore(roundedBox(2.18, 0.06, 2.18, 0.03, seamMat), PLATE_TOP + 0.77, 0.5);
    addCore(roundedBox(2.1, 0.3, 2.1, 0.1, mat.satin("#ffffff", { roughness: 0.55, clearcoat: 0.3 })), PLATE_TOP + 0.95, 0.6);
    const coreTopY = PLATE_TOP + 1.1;
    const fontSerif = getComputedStyle(document.body).getPropertyValue("--font-serif").trim() || "Georgia, serif";
    const drawErp = (g: CanvasRenderingContext2D, S: number) => {
      g.clearRect(0, 0, S, S);
      g.fillStyle = "#0b1a4f";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.font = `400 ${S * 0.36}px ${fontSerif}`;
      g.fillText("ERP", S / 2, S / 2 + S * 0.02);
    };
    const erpTex = canvasTexture(1024, drawErp);
    document.fonts?.ready.then(() => { drawErp((erpTex.image as HTMLCanvasElement).getContext("2d")!, 1024); erpTex.needsUpdate = true; });
    const erpDecal = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.8), new THREE.MeshBasicMaterial({ map: erpTex, transparent: true, depthWrite: false }));
    erpDecal.rotation.x = -Math.PI / 2;
    addCore(erpDecal, coreTopY + 0.002, 0.6);
    const coreGlow = glowSprite(4.4, "29,108,242", 0);
    coreGlow.position.y = coreTopY + 0.2;
    root.add(coreGlow);
    // one soft ripple per data cycle
    const rippleMat = new THREE.MeshBasicMaterial({ color: COLORS.blue, transparent: true, opacity: 0, depthWrite: false });
    const ripple = new THREE.Mesh(new THREE.RingGeometry(0.985, 1, 160), rippleMat);
    ripple.rotation.x = -Math.PI / 2;
    ripple.position.y = PLATE_TOP + 0.004;
    root.add(ripple);

    /* Departments */
    const modules = MODULES.map((def, i) => {
      const hex = DEPT[def.key];
      const color = new THREE.Color(hex);
      const a = deg(i * 60 - 90);
      const x = Math.cos(a) * MOD_R, z = Math.sin(a) * MOD_R;
      const grp = new THREE.Group();
      grp.position.set(x, 0, z);
      grp.userData.idx = i;
      root.add(grp);
      const lipMat = mat.satin(color.clone().lerp(new THREE.Color("#ffffff"), 0.7));
      const lip = roundedBox(TILE + 0.08, 0.08, TILE + 0.08, 0.06, lipMat);
      lip.position.y = PLATE_TOP + 0.04;
      const tile = roundedBox(TILE, 0.18, TILE, 0.09, mat.satin("#ffffff"));
      tile.position.y = PLATE_TOP + 0.17;
      grp.add(lip, tile);
      const d = DIORAMAS[def.key](makePalette(hex));
      d.group.position.y = TILE_TOP;
      d.group.rotation.y = deg(-8);
      grp.add(d.group);

      const ringMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, depthWrite: false });
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.96, 1, 96), ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = TILE_TOP + 0.004;
      grp.add(ring);

      const lab = chip(def.name, { icon: def.key, above: true, color: hex });
      lab.position.set(0, TILE_TOP + 1.55, 0);
      grp.add(lab);
      stage.track(lab);

      // arc core → department, light travels in the department colour
      const start = new THREE.Vector3(Math.cos(a) * 1.25, PLATE_TOP + 0.95, Math.sin(a) * 1.25);
      const end = new THREE.Vector3(Math.cos(a) * (MOD_R - 1.05), TILE_TOP + 0.08, Math.sin(a) * (MOD_R - 1.05));
      const curve = new THREE.QuadraticBezierCurve3(start, start.clone().lerp(end, 0.5).setY(PLATE_TOP + 2.0), end);
      const flow = flowTube(curve, 0.03);
      flow.uniforms.uPhase.value = i * 0.17;
      flow.uniforms.uColor.value = color.clone();
      flow.uniforms.uRest.value = color.clone().lerp(new THREE.Color("#ffffff"), 0.55);
      flow.uniforms.uBack.value = new THREE.Color("#ffffff");
      flow.uniforms.uBase.value = 0.38;
      root.add(flow.mesh);

      // data packet riding the head of the light
      const packet = new THREE.Mesh(new THREE.SphereGeometry(0.085, 20, 16), new THREE.MeshBasicMaterial({ color }));
      packet.add(glowSprite(0.75, rgbString(hex), 0.6));
      packet.visible = false;
      root.add(packet);

      return {
        hex, grp, d, lab, flow, curve, packet, lipMat, ring, ringMat,
        drop: springState(2.6), lift: springState(0), size: springState(0),
        focus: 0, flash: 0, lastCycle: -1, ph: 0,
      };
    });

    /* Interaction */
    const raycaster = new THREE.Raycaster();
    const hitTargets = modules.map((m) => m.grp);
    let tourIdx = -1, tourNext = INTRO + 0.8, lastFocus = -1;
    const camFocus = { x: springState(), z: springState() };

    let startAt = -1;
    stage.run((t, dt) => {
      if (startAt < 0 && playRef.current) startAt = t;
      const s = startAt < 0 ? 0 : t - startAt;

      // Hover
      let hovered = -1;
      if (pointer.inside) {
        raycaster.setFromCamera(pointer.ndc, camera);
        const hit = raycaster.intersectObjects(hitTargets, true)[0];
        if (hit) {
          let o: THREE.Object3D | null = hit.object;
          while (o && o.userData.idx === undefined) o = o.parent;
          if (o) hovered = o.userData.idx as number;
        }
      }
      host.style.cursor = hovered >= 0 ? "pointer" : "";

      // Idle tour: one department at a time; pointer in the scene takes over
      if (pointer.inside) {
        if (hovered >= 0) lastFocus = hovered;
        tourIdx = -1;
        tourNext = s + 2.2;
      } else if (s >= tourNext) {
        tourIdx = (Math.max(tourIdx, lastFocus) + 1) % modules.length;
        lastFocus = tourIdx;
        tourNext = s + TOUR_STEP;
      }
      const focus = hovered >= 0 ? hovered : tourIdx;

      // Camera: cinematic arrival, then a gentle lean toward the focused department
      const ip = ease.inOutCubic(ease.step(s, 0, INTRO));
      const fm = focus >= 0 ? modules[focus].grp.position : null;
      const fx = spring(camFocus.x, fm ? fm.x * 0.07 : 0, dt, 40, 12);
      const fz = spring(camFocus.z, fm ? fm.z * 0.07 : 0, dt, 40, 12);
      const fd = 1;
      rig.az = (1 - ip) * deg(-42);
      rig.el = (1 - ip) * 0.32;
      rig.dist = (1 + (1 - ip) * 0.45) * fd;
      rig.tx = fx;
      rig.tz = fz;
      root.rotation.y = Math.sin(t * 0.12) * 0.04;

      // Entrance
      const pb = ease.outCubic(ease.step(s, 0, 0.9));
      base.scale.setScalar(0.85 + 0.15 * pb);
      base.position.y = (1 - pb) * -0.3;
      (ao.material as THREE.MeshBasicMaterial).opacity = 0.18 * pb;
      coreParts.forEach((c) => {
        c.m.position.y = c.y + spring(c.st, s > c.d ? 0 : 2.6, dt, 150, 15);
        c.m.visible = s > c.d;
      });
      seamMat.emissiveIntensity = 1.2 + Math.sin(t * 2.2) * 0.25;
      coreGlow.material.opacity = 0.2 * ease.step(s, 1.2, 0.9) + Math.sin(t * 2.2) * 0.03;

      const ds = s - 2.0;
      if (ds > 0) {
        const f = (ds / 2.8) % 1;
        ripple.scale.setScalar(1.3 + f * (PLATE_R - 1.5));
        rippleMat.opacity = 0.22 * (1 - f) * ease.step(ds, 0, 1);
      }

      modules.forEach((m, i) => {
        const appear = 0.7 + i * 0.1;
        const isF = focus === i;
        m.focus += ((isF ? 1 : 0) - m.focus) * Math.min(1, dt * 5);
        m.grp.position.y = spring(m.drop, s > appear ? 0 : 2.6, dt, 120, 14) + spring(m.lift, isF ? 0.26 : 0, dt, 160, 13);
        m.grp.visible = s > appear;
        const size = spring(m.size, s > appear + 0.35 ? 1.3 : 0, dt, 140, 12);
        m.d.group.scale.setScalar(Math.max(0.001, size));
        m.d.update(t, Math.max(m.focus, m.flash * 0.5));

        const labIn = ease.step(s, appear + 0.5, 0.5);
        m.lab.element.style.opacity = String(labIn * (focus >= 0 && !isF ? 0.55 : 1));
        m.lab.element.classList.toggle("is-active", isF);

        // flow + packet
        const u = m.flow.uniforms;
        m.ph += dt * (0.36 + m.focus * 0.22); // own clock so a speed change never jumps
        u.uTime.value = m.ph;
        u.uSpeed.value = 1;
        u.uDraw.value = ease.inOutCubic(ease.step(s, 1.5 + i * 0.07, 0.9));
        u.uBoost.value = m.focus * 0.5;
        const raw = m.ph + u.uPhase.value;
        const head = (raw % 1) * 1.35;
        m.packet.visible = ds > 0 && head < 1 && u.uDraw.value >= 1;
        if (m.packet.visible) {
          m.packet.position.copy(m.curve.getPointAt(head));
          m.packet.scale.setScalar(1 + m.focus * 0.35);
        }
        const cycle = Math.floor(raw);
        if (ds > 0 && head >= 1 && m.lastCycle !== cycle) { m.flash = 1; m.lastCycle = cycle; }
        m.flash *= Math.pow(0.05, dt);

        // arrival: tile ring + lip glow in the department colour
        m.ring.scale.setScalar(0.55 + (1 - m.flash) * 0.5);
        m.ringMat.opacity = m.flash * 0.7;
        m.lipMat.emissive.set(m.hex).multiplyScalar(0.35 * m.flash + m.focus * 0.4);
      });
    });

    return () => stage.dispose();
  }, []);

  return <div ref={hostRef} className="relative h-full w-full" />;
}
