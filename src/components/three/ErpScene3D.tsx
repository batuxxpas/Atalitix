"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createStage, chip, roundedBox, softShadow, glowSprite, flowTube, mat, COLORS, ease } from "./stage";
import { DIORAMAS, makePalette } from "./dioramas";
import { drawIcon } from "./icons";

const MODULES = [
  { name: "Finans", key: "finans" },
  { name: "Satınalma", key: "satinalma" },
  { name: "Stok", key: "stok" },
  { name: "Üretim", key: "uretim" },
  { name: "Satış", key: "satis" },
  { name: "İK", key: "ik" },
];
// The flexible non-ERP layer floats in the gaps between modules
const OUTER = [
  { name: "Saha verisi", icon: "saha", angle: -60, link: 1 },
  { name: "Onay akışları", icon: "onay", angle: 60, link: 2 },
  { name: "Entegrasyon", icon: "entegrasyon", angle: 120, link: 4 },
  { name: "KPI panelleri", icon: "kpi", angle: 240, link: 5 },
];

const PLATE_R = 6.5;
const MOD_R = 4.35;
const TILE = 1.95;
const PLATE_TOP = 0.34;
const TILE_TOP = PLATE_TOP + 0.24;
const OUT_R = 6.85;
const PERIOD = 2.8;

const deg = (d: number) => (d * Math.PI) / 180;

/** Fine engraved markings on the base plate (rings, ticks). */
function plateTexture() {
  const S = 1024, c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d")!;
  const k = S / 2 / PLATE_R;
  g.translate(S / 2, S / 2);
  g.strokeStyle = "rgba(11,26,79,0.10)";
  g.lineWidth = 2;
  for (const r of [1.85, 3.1, 5.65]) { g.beginPath(); g.arc(0, 0, r * k, 0, Math.PI * 2); g.stroke(); }
  g.setLineDash([6, 10]);
  g.strokeStyle = "rgba(29,108,242,0.28)";
  g.beginPath(); g.arc(0, 0, MOD_R * k, 0, Math.PI * 2); g.stroke();
  g.setLineDash([]);
  g.strokeStyle = "rgba(11,26,79,0.16)";
  for (let i = 0; i < 120; i++) {
    const a = (i / 120) * Math.PI * 2, long = i % 10 === 0;
    const r0 = (PLATE_R - (long ? 0.42 : 0.24)) * k, r1 = (PLATE_R - 0.1) * k;
    g.beginPath(); g.moveTo(Math.cos(a) * r0, Math.sin(a) * r0); g.lineTo(Math.cos(a) * r1, Math.sin(a) * r1); g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/** Text/icon decal drawn on a canvas (crisp, site font). */
function decal(draw: (g: CanvasRenderingContext2D, S: number) => void, size = 512) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  draw(c.getContext("2d")!, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/**
 * ERP platform model — a product-render style scene:
 * a stacked ERP core with lit seams, six module tiles each carrying a small animated model
 * (factory, truck, racking, chart, team, coins), flowing data lines in both directions,
 * and the flexible non-ERP layer as floating glass cards.
 */
export default function ErpScene3D({ play = true }: { play?: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playRef = useRef(play);
  useEffect(() => { playRef.current = play; }, [play]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const stage = createStage(host, { width: 14.2, height: 11.6, azimuth: 38, elevation: 0.78, target: [0, 1.0, 0.1] });
    const { root, camera, pointer, scene } = stage;
    const P = makePalette();

    /* Base: layered disc with engraved markings and a soft contact shadow */
    const ao = softShadow(PLATE_R + 1.6, 0.2);
    ao.position.y = 0.002;
    scene.add(ao);
    const base = new THREE.Group();
    root.add(base);
    const under = new THREE.Mesh(new THREE.CylinderGeometry(PLATE_R + 0.2, PLATE_R + 0.2, 0.1, 160), mat.satin(COLORS.blue100));
    under.position.y = 0.05;
    under.receiveShadow = true;
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(PLATE_R, PLATE_R + 0.06, 0.24, 160), mat.satin("#ffffff", { roughness: 0.5 }));
    plate.position.y = 0.1 + 0.12;
    plate.castShadow = true;
    plate.receiveShadow = true;
    const deck = new THREE.Mesh(new THREE.CircleGeometry(PLATE_R - 0.01, 160), new THREE.MeshStandardMaterial({ map: plateTexture(), transparent: true, roughness: 0.9, depthWrite: false }));
    deck.rotation.x = -Math.PI / 2;
    deck.position.y = PLATE_TOP + 0.002;
    deck.receiveShadow = true;
    base.add(under, plate, deck);

    /* Core: three stacked slabs with lit seams, ERP engraved on top */
    const core = new THREE.Group();
    root.add(core);
    const seamMat = mat.glow(COLORS.blue, 1.5);
    const coreParts: { m: THREE.Object3D; y: number; d: number }[] = [];
    const addCore = (m: THREE.Object3D, y: number, d: number) => { m.position.y = y; core.add(m); coreParts.push({ m, y, d }); };
    addCore(roundedBox(2.5, 0.34, 2.5, 0.12, P.navy), PLATE_TOP + 0.17, 0.15);
    addCore(roundedBox(2.38, 0.06, 2.38, 0.03, seamMat), PLATE_TOP + 0.37, 0.25);
    addCore(roundedBox(2.3, 0.34, 2.3, 0.12, P.navy6), PLATE_TOP + 0.57, 0.33);
    addCore(roundedBox(2.18, 0.06, 2.18, 0.03, seamMat), PLATE_TOP + 0.77, 0.43);
    addCore(roundedBox(2.1, 0.3, 2.1, 0.1, P.navy), PLATE_TOP + 0.95, 0.5);
    const coreTopY = PLATE_TOP + 1.1;
    const fontSerif = getComputedStyle(document.body).getPropertyValue("--font-serif").trim() || "Georgia, serif";
    const ercTex = decal((g, S) => {
      g.fillStyle = "#ffffff";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.font = `400 ${S * 0.36}px ${fontSerif}`;
      g.fillText("ERP", S / 2, S / 2 + S * 0.02);
      g.strokeStyle = "rgba(111,157,255,0.55)";
      g.lineWidth = S * 0.006;
      g.strokeRect(S * 0.12, S * 0.12, S * 0.76, S * 0.76);
    });
    const ercDecal = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.8), new THREE.MeshBasicMaterial({ map: ercTex, transparent: true, depthWrite: false }));
    ercDecal.rotation.x = -Math.PI / 2;
    ercDecal.position.y = coreTopY + 0.002;
    core.add(ercDecal);
    coreParts.push({ m: ercDecal, y: coreTopY + 0.002, d: 0.5 });
    // redraw once the web font is ready
    document.fonts?.ready.then(() => {
      const g = (ercTex.image as HTMLCanvasElement).getContext("2d")!;
      const S = (ercTex.image as HTMLCanvasElement).width;
      g.clearRect(0, 0, S, S);
      g.fillStyle = "#ffffff"; g.textAlign = "center"; g.textBaseline = "middle";
      g.font = `400 ${S * 0.36}px ${fontSerif}`;
      g.fillText("ERP", S / 2, S / 2 + S * 0.02);
      g.strokeStyle = "rgba(111,157,255,0.55)"; g.lineWidth = S * 0.006;
      g.strokeRect(S * 0.12, S * 0.12, S * 0.76, S * 0.76);
      ercTex.needsUpdate = true;
    });
    // Tick ring hovering above the core
    const haloTex = decal((g, S) => {
      g.translate(S / 2, S / 2);
      g.strokeStyle = "rgba(29,108,242,0.9)";
      g.lineCap = "round";
      for (let i = 0; i < 72; i++) {
        const a = (i / 72) * Math.PI * 2;
        const long = i % 6 === 0;
        g.lineWidth = long ? 5 : 3;
        const r0 = S * (long ? 0.4 : 0.43), r1 = S * 0.47;
        g.beginPath(); g.moveTo(Math.cos(a) * r0, Math.sin(a) * r0); g.lineTo(Math.cos(a) * r1, Math.sin(a) * r1); g.stroke();
      }
    });
    const halo = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 3.4), new THREE.MeshBasicMaterial({ map: haloTex, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }));
    halo.rotation.x = -Math.PI / 2;
    halo.position.y = coreTopY + 0.5;
    root.add(halo);
    const coreGlow = glowSprite(4.2, "29,108,242", 0);
    coreGlow.position.y = coreTopY + 0.2;
    root.add(coreGlow);

    // Ripples running out across the plate on every data cycle
    const ripples = [0, 0.5].map(() => {
      const m = new THREE.MeshBasicMaterial({ color: COLORS.blue, transparent: true, opacity: 0, depthWrite: false });
      const r = new THREE.Mesh(new THREE.RingGeometry(0.97, 1, 128), m);
      r.rotation.x = -Math.PI / 2;
      r.position.y = PLATE_TOP + 0.004;
      root.add(r);
      return { r, m };
    });

    /* Modules */
    const modules = MODULES.map((def, i) => {
      const a = deg(i * 60 - 90);
      const x = Math.cos(a) * MOD_R, z = Math.sin(a) * MOD_R;
      const grp = new THREE.Group();
      grp.position.set(x, 0, z);
      grp.userData.idx = i;
      root.add(grp);
      const lipMat = mat.satin(COLORS.blue200);
      const lip = roundedBox(TILE + 0.08, 0.08, TILE + 0.08, 0.06, lipMat);
      lip.position.y = PLATE_TOP + 0.04;
      const tile = roundedBox(TILE, 0.18, TILE, 0.09, mat.satin("#ffffff"));
      tile.position.y = PLATE_TOP + 0.08 + 0.09;
      grp.add(lip, tile);
      const d = DIORAMAS[def.key](P);
      d.group.position.y = TILE_TOP;
      d.group.rotation.y = deg(-8);
      grp.add(d.group);

      // tile ripple on arrival
      const tm = new THREE.MeshBasicMaterial({ color: COLORS.blue, transparent: true, opacity: 0, depthWrite: false });
      const tr = new THREE.Mesh(new THREE.RingGeometry(0.96, 1, 64), tm);
      tr.rotation.x = -Math.PI / 2;
      tr.position.y = TILE_TOP + 0.004;
      grp.add(tr);

      const lab = chip(def.name, { icon: def.key, above: true });
      lab.position.set(0, TILE_TOP + 1.55, 0);
      grp.add(lab);
      stage.track(lab);

      // Flow line core ↔ module (arc)
      const start = new THREE.Vector3(Math.cos(a) * 1.25, PLATE_TOP + 0.95, Math.sin(a) * 1.25);
      const end = new THREE.Vector3(Math.cos(a) * (MOD_R - 1.05), TILE_TOP + 0.08, Math.sin(a) * (MOD_R - 1.05));
      const mid = start.clone().lerp(end, 0.5).setY(PLATE_TOP + 2.0);
      const flow = flowTube(new THREE.QuadraticBezierCurve3(start, mid, end), 0.034);
      flow.uniforms.uPhase.value = i * 0.17;
      root.add(flow.mesh);

      return { grp, tile, lipMat, d, lab, flow, tm, tr, lift: 0, boost: 0, flash: 0, lastCycle: -1 };
    });

    /* Non-ERP layer: floating glass cards with an icon, dashed links to a module */
    const glassMat = new THREE.MeshPhysicalMaterial({ color: "#d3e2ff", roughness: 0.1, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.04, transparent: true, opacity: 0.88, envMapIntensity: 1.5 });
    const outer = OUTER.map((o, i) => {
      const a = deg(o.angle);
      const x = Math.cos(a) * OUT_R, z = Math.sin(a) * OUT_R;
      const grp = new THREE.Group();
      grp.position.set(x, 1.85, z);
      grp.scale.setScalar(0.001);
      root.add(grp);
      const card = roundedBox(1.1, 0.12, 0.84, 0.05, glassMat);
      card.castShadow = false;
      grp.add(card);
      const icoTex = decal((g, S) => drawIcon(g, o.icon, S * 0.18, S * 0.18, S * 0.64, "#1d6cf2", 1.9), 256);
      const ico = new THREE.Mesh(new THREE.PlaneGeometry(0.66, 0.66), new THREE.MeshBasicMaterial({ map: icoTex, transparent: true, depthWrite: false }));
      ico.rotation.x = -Math.PI / 2;
      ico.position.y = 0.065;
      grp.add(ico);
      const lab = chip(o.name, { variant: "outer", above: true });
      lab.position.set(0, 0.5, 0);
      grp.add(lab);
      stage.track(lab);

      const m = modules[o.link].grp.position;
      const from = new THREE.Vector3(m.x, TILE_TOP + 0.9, m.z);
      const to = new THREE.Vector3(x, 1.8, z);
      const ctrl = from.clone().lerp(to, 0.5).setY(2.7);
      const link = flowTube(new THREE.QuadraticBezierCurve3(from, ctrl, to), 0.018, 48);
      link.uniforms.uDash.value = 1;
      link.uniforms.uBase.value = 0.4;
      link.uniforms.uRest.value = COLORS.blue.clone();
      link.uniforms.uSpeed.value = 0.3;
      link.uniforms.uPhase.value = i * 0.31;
      root.add(link.mesh);
      return { grp, lab, link, phase: i * 1.4 };
    });

    /* Hover */
    const raycaster = new THREE.Raycaster();
    const hitTargets = modules.map((m) => m.grp);
    let hovered = -1;

    let startAt = -1;
    stage.run((t) => {
      if (startAt < 0 && playRef.current) startAt = t;
      const s = startAt < 0 ? 0 : t - startAt;

      root.rotation.y = Math.sin(t * 0.12) * 0.05;

      // Entrance: plate → core stack → tiles → models → flows → outer layer
      const pb = ease.outCubic(ease.step(s, 0, 0.9));
      base.scale.setScalar(0.85 + 0.15 * pb);
      base.position.y = (1 - pb) * -0.3;
      (ao.material as THREE.MeshBasicMaterial).opacity = 0.2 * pb;
      coreParts.forEach((c) => {
        const p = ease.outBack(ease.step(s, 0.25 + c.d * 0.9, 0.7));
        c.m.position.y = c.y + (1 - p) * 2.2;
        c.m.visible = p > 0.001;
      });
      seamMat.emissiveIntensity = 1.3 + Math.sin(t * 2.2) * 0.25;
      const hp = ease.step(s, 1.2, 0.9);
      (halo.material as THREE.MeshBasicMaterial).opacity = 0.75 * hp;
      halo.rotation.z = t * 0.12;
      halo.position.y = coreTopY + 0.45 + Math.sin(t * 1.1) * 0.06;
      coreGlow.material.opacity = 0.22 * hp + Math.sin(t * 2.2) * 0.03;

      // Hover detection
      hovered = -1;
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

      // Data cycle
      const ds = s - 2.0;
      ripples.forEach((r, k) => {
        if (ds <= 0) { r.m.opacity = 0; return; }
        const f = ((ds / PERIOD) + k * 0.5) % 1;
        r.r.scale.setScalar(1.3 + f * (PLATE_R - 1.5));
        r.m.opacity = 0.32 * (1 - f) * ease.step(ds, 0, 1);
      });

      modules.forEach((m, i) => {
        const pr = ease.outBack(ease.step(s, 0.6 + i * 0.09, 0.8));
        const isH = hovered === i;
        m.lift += ((isH ? 0.28 : 0) - m.lift) * 0.14;
        m.boost += ((isH ? 1 : 0) - m.boost) * 0.1;
        m.grp.position.y = (1 - pr) * 2.6 + m.lift;
        m.grp.visible = pr > 0.001;
        const dp = ease.outBack(ease.step(s, 1.1 + i * 0.1, 0.8));
        m.d.group.scale.setScalar(Math.max(0.001, dp * 1.3));
        m.d.update(t, m.boost);
        m.lab.element.style.opacity = String(ease.step(s, 1.3 + i * 0.08, 0.5));
        m.lab.element.classList.toggle("is-active", isH);

        // flow line
        m.flow.uniforms.uTime.value = t;
        m.flow.uniforms.uDraw.value = ease.inOutCubic(ease.step(s, 1.5 + i * 0.07, 0.9));
        m.flow.uniforms.uBoost.value = m.boost * 0.6;
        m.flow.uniforms.uSpeed.value = 0.36 + m.boost * 0.3;

        // arrival flash: comet reaches the module end
        if (ds > 0) {
          const head = ((t * m.flow.uniforms.uSpeed.value + m.flow.uniforms.uPhase.value) % 1) * 1.35;
          const cycle = Math.floor(t * m.flow.uniforms.uSpeed.value + m.flow.uniforms.uPhase.value);
          if (head >= 1 && m.lastCycle !== cycle) { m.flash = 1; m.lastCycle = cycle; }
        }
        m.flash *= 0.95;
        const rf = 1 - m.flash;
        m.tr.scale.setScalar(0.5 + rf * 0.55);
        m.tm.opacity = m.flash * 0.6;
        m.lipMat.emissive.copy(COLORS.blue).multiplyScalar(0.45 * m.flash + m.boost * 0.5);
      });

      outer.forEach((o, i) => {
        const po = ease.outBack(ease.step(s, 1.9 + i * 0.12, 0.7));
        o.grp.scale.setScalar(Math.max(0.001, po));
        o.grp.position.y = 1.85 + Math.sin(t * 1.05 + o.phase) * 0.09;
        o.grp.rotation.y = Math.sin(t * 0.6 + o.phase) * 0.12;
        o.grp.rotation.z = Math.sin(t * 0.8 + o.phase) * 0.04;
        o.lab.element.style.opacity = String(ease.step(s, 2.1 + i * 0.1, 0.5));
        o.link.uniforms.uTime.value = t;
        o.link.uniforms.uDraw.value = ease.inOutCubic(ease.step(s, 2.1 + i * 0.1, 0.8));
      });
    });

    return () => stage.dispose();
  }, []);

  return <div ref={hostRef} className="relative h-full w-full" />;
}
