"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createStage, chip, softShadow, flowTube, mat, COLORS, ease } from "./stage";
import { drawIcon } from "./icons";

const RING_R = 3.25;
const HEX_R = 0.68;
const UNIT = 0.52; // height per maturity level
const FILL = 0.84; // slab share of a level (rest is the gap)
const BASE_R = 5.5;
const TOP = 0.3; // base top
const LEVEL_COLORS = ["#d4e3ff", "#a3c0ff", "#6c9cfa", "#3a78ee", "#1a5fd8"].map((c) => new THREE.Color(c));
const ICON_KEYS: Record<string, string> = {
  "İnsan": "insan", "Yönetişim": "yonetisim", "İnovasyon": "inovasyon",
  "Teknoloji": "teknoloji", "Müşteri": "musteri", "Operasyon": "operasyon",
};

function hexShape(r: number) {
  const s = new THREE.Shape();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
    if (i === 0) s.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    else s.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  s.closePath();
  return s;
}

/** Vertical hex prism, unit height, bottom at y = 0. */
function hexPrism(r: number) {
  const g = new THREE.ExtrudeGeometry(hexShape(r), { depth: 1, bevelEnabled: false });
  g.rotateX(-Math.PI / 2);
  return g;
}

/** Splits [from, to] into per-level pieces: [level index, start fraction, end fraction]. */
function pieces(from: number, to: number) {
  const out: [number, number, number][] = [];
  for (let L = Math.floor(from); L < Math.ceil(to); L++) {
    const a = Math.max(from, L) - L, b = Math.min(to, L + 1) - L;
    if (b - a > 0.01) out.push([L, a, b]);
  }
  return out;
}

const fmt = (n: number) => String(n).replace(".", ",");

/** Round icon badge rendered to a texture (normal + active versions). */
function badge(icon: string, active: boolean) {
  const S = 512, c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d")!;
  g.shadowColor = "rgba(11,26,79,0.28)";
  g.shadowBlur = 36;
  g.shadowOffsetY = 12;
  g.beginPath(); g.arc(S / 2, S / 2 - 8, S * 0.36, 0, Math.PI * 2);
  g.fillStyle = active ? "#1d6cf2" : "#ffffff";
  g.fill();
  g.shadowColor = "transparent";
  g.lineWidth = 6;
  g.strokeStyle = active ? "rgba(255,255,255,0.35)" : "rgba(29,108,242,0.22)";
  g.stroke();
  drawIcon(g, icon, S * 0.33, S * 0.33 - 8, S * 0.34, active ? "#ffffff" : "#1d6cf2", 2);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 16;
  return t;
}

/**
 * Maturity model — six hexagonal columns built from level blocks (1–5),
 * glass volumes up to the 12-month target, icon badges, and a 3D "radar" web
 * across the current levels. Linked both ways with the dimension list.
 */
export default function MaturityScene3D({
  names, current, target, active, onActive,
}: {
  names: string[]; current: number[]; target: number[];
  active: number | null; onActive: (i: number | null) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(active);
  const onActiveRef = useRef(onActive);
  useEffect(() => {
    activeRef.current = active;
    onActiveRef.current = onActive;
  }, [active, onActive]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const stage = createStage(host, { width: 11.4, height: 9.4, azimuth: 30, elevation: 0.74, target: [0, 1.25, 0.1] });
    const { root, camera, pointer, scene } = stage;
    const n = names.length;

    /* Base */
    const ao = softShadow(BASE_R + 1.5, 0.2);
    scene.add(ao);
    const base = new THREE.Group();
    root.add(base);
    const under = new THREE.Mesh(hexPrism(BASE_R + 0.22), mat.satin(COLORS.blue100));
    under.scale.y = 0.1;
    under.receiveShadow = true;
    const plate = new THREE.Mesh(hexPrism(BASE_R), mat.satin("#ffffff", { roughness: 0.5 }));
    plate.scale.y = TOP - 0.1;
    plate.position.y = 0.1;
    plate.castShadow = true;
    plate.receiveShadow = true;
    // Deck markings: level hexes + spokes
    const S = 2048, cv = document.createElement("canvas");
    cv.width = cv.height = S;
    const g = cv.getContext("2d")!;
    const k = S / 2 / BASE_R;
    g.translate(S / 2, S / 2);
    const hexPath = (r: number) => {
      g.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
        // canvas y runs opposite to the shape's y after rotation
        if (i === 0) g.moveTo(Math.cos(a) * r * k, -Math.sin(a) * r * k); else g.lineTo(Math.cos(a) * r * k, -Math.sin(a) * r * k);
      }
      g.closePath();
    };
    g.strokeStyle = "rgba(11,26,79,0.10)"; g.lineWidth = 3;
    [1.45, BASE_R - 0.4].forEach((r) => { hexPath(r); g.stroke(); });
    g.setLineDash([12, 20]); g.strokeStyle = "rgba(29,108,242,0.3)";
    hexPath(RING_R + 1.0); g.stroke();
    for (let i = 0; i < n; i++) {
      const a = ((i * 360) / n - 90) * (Math.PI / 180);
      g.beginPath(); g.moveTo(Math.cos(a) * 1.2 * k, Math.sin(a) * 1.2 * k); g.lineTo(Math.cos(a) * (RING_R - HEX_R - 0.1) * k, Math.sin(a) * (RING_R - HEX_R - 0.1) * k); g.stroke();
    }
    g.setLineDash([]);
    const deckTex = new THREE.CanvasTexture(cv);
    deckTex.colorSpace = THREE.SRGBColorSpace;
    deckTex.anisotropy = 16;
    const deck = new THREE.Mesh(new THREE.PlaneGeometry(BASE_R * 2, BASE_R * 2), new THREE.MeshStandardMaterial({ map: deckTex, transparent: true, roughness: 0.9, depthWrite: false }));
    deck.rotation.x = -Math.PI / 2;
    deck.position.y = TOP + 0.002;
    deck.receiveShadow = true;
    base.add(under, plate, deck);

    // Hub: navy hex with a lit seam and a turning tick ring
    const hub = new THREE.Group();
    root.add(hub);
    const hubBody = new THREE.Mesh(hexPrism(0.95), mat.gloss("#3a78ee"));
    hubBody.scale.y = 0.34;
    hubBody.position.y = TOP;
    hubBody.castShadow = true;
    const seamMat = mat.glow(new THREE.Color("#a9c8ff"), 1.3);
    const seam = new THREE.Mesh(hexPrism(0.9), seamMat);
    seam.scale.y = 0.05;
    seam.position.y = TOP + 0.34;
    const hubTop = new THREE.Mesh(hexPrism(0.86), mat.gloss(COLORS.blue));
    hubTop.scale.y = 0.16;
    hubTop.position.y = TOP + 0.39;
    hubTop.castShadow = true;
    hub.add(hubBody, seam, hubTop);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.012, 6, 120), mat.glow(COLORS.blue400, 1));
    ring.rotation.x = Math.PI / 2;
    ring.position.y = TOP + 0.7;
    hub.add(ring);

    /* Columns */
    const unitPrism = hexPrism(HEX_R);
    const ghostPrism = hexPrism(HEX_R + 0.04);
    const ghostEdges = new THREE.EdgesGeometry(ghostPrism, 30);
    const levelMats = LEVEL_COLORS.map((c) => mat.satin(c, { roughness: 0.32, clearcoat: 0.9 }));
    const yOf = (lv: number) => TOP + Math.floor(lv) * UNIT + (lv - Math.floor(lv)) * UNIT * FILL;

    const cols = names.map((name, i) => {
      const a = ((i * 360) / n - 90) * (Math.PI / 180);
      const x = Math.cos(a) * RING_R, z = Math.sin(a) * RING_R;
      const grp = new THREE.Group();
      grp.position.set(x, 0, z);
      grp.userData.idx = i;
      root.add(grp);

      const slabs = pieces(0, current[i]).map(([L, f0, f1], j) => {
        const m = levelMats[L].clone();
        const s = new THREE.Mesh(unitPrism, m);
        s.castShadow = true;
        s.receiveShadow = true;
        const y = TOP + L * UNIT + f0 * UNIT * FILL;
        const h = (f1 - f0) * UNIT * FILL;
        s.position.y = y;
        s.scale.y = 0.001;
        grp.add(s);
        return { s, m, y, h, order: j, base: LEVEL_COLORS[L] };
      });
      const gm = new THREE.MeshPhysicalMaterial({ color: COLORS.blue200, roughness: 0.12, clearcoat: 1, transparent: true, opacity: 0, depthWrite: false });
      const gmesh = new THREE.Mesh(ghostPrism, gm);
      const em = new THREE.LineBasicMaterial({ color: COLORS.blue, transparent: true, opacity: 0 });
      gmesh.add(new THREE.LineSegments(ghostEdges, em));
      gmesh.position.y = yOf(current[i]) + 0.02;
      gmesh.scale.y = Math.max(0.001, yOf(target[i]) - yOf(current[i]) - 0.04);
      grp.add(gmesh);
      const ghosts = [{ gm, em }];

      const icon = ICON_KEYS[name] || "operasyon";
      const texN = badge(icon, false), texA = badge(icon, true);
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texN, transparent: true, depthWrite: false }));
      const badgeY = yOf(Math.max(current[i], target[i])) + 0.7;
      sprite.position.y = badgeY;
      sprite.scale.setScalar(0.001);
      sprite.renderOrder = 5;
      grp.add(sprite);

      const lab = chip(name, { variant: "module", meta: `${fmt(current[i])} → ${fmt(target[i])}`, side: true });
      lab.position.set(Math.cos(a) * 0.62, badgeY, Math.sin(a) * 0.62);
      grp.add(lab);
      stage.track(lab);

      return { grp, slabs, ghosts, sprite, texN, texA, lab, badgeY, glow: 0, lift: 0, isA: false };
    });

    /* Radar web across the current levels */
    const topPoint = (i: number, lv: number) => {
      const a = ((i * 360) / n - 90) * (Math.PI / 180);
      return new THREE.Vector3(Math.cos(a) * RING_R, yOf(lv) + 0.03, Math.sin(a) * RING_R);
    };
    const loop = (vals: number[]) => {
      const p = new THREE.CurvePath<THREE.Vector3>();
      for (let i = 0; i < n; i++) p.add(new THREE.LineCurve3(topPoint(i, vals[i]), topPoint((i + 1) % n, vals[(i + 1) % n])));
      return p;
    };
    const web = flowTube(loop(current), 0.03, 240);
    web.uniforms.uBase.value = 0.85;
    web.uniforms.uRest.value = COLORS.blue.clone();
    web.uniforms.uColor.value = new THREE.Color("#ffffff");
    web.uniforms.uSpeed.value = 0.12;
    root.add(web.mesh);
    // translucent fan under the current web
    const fanPos: number[] = [];
    const hubC = new THREE.Vector3(0, TOP + 0.62, 0);
    for (let i = 0; i < n; i++) {
      const p0 = topPoint(i, current[i]), p1 = topPoint((i + 1) % n, current[(i + 1) % n]);
      fanPos.push(hubC.x, hubC.y, hubC.z, p0.x, p0.y, p0.z, p1.x, p1.y, p1.z);
    }
    const fanGeo = new THREE.BufferGeometry();
    fanGeo.setAttribute("position", new THREE.Float32BufferAttribute(fanPos, 3));
    const fanMat = new THREE.MeshBasicMaterial({ color: COLORS.blue, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false });
    const fan = new THREE.Mesh(fanGeo, fanMat);
    fan.renderOrder = 1;
    root.add(fan);

    /* Hover ↔ list */
    const raycaster = new THREE.Raycaster();
    const targets = cols.map((c) => c.grp);
    let lastHover: number | null = null;

    let startAt = -1;
    stage.run((t) => {
      if (startAt < 0) startAt = t;
      const s = t - startAt;
      root.rotation.y = Math.sin(t * 0.12) * 0.05;

      let hover: number | null = null;
      if (pointer.inside) {
        raycaster.setFromCamera(pointer.ndc, camera);
        const hit = raycaster.intersectObjects(targets, true)[0];
        if (hit) {
          let o: THREE.Object3D | null = hit.object;
          while (o && o.userData.idx === undefined) o = o.parent;
          if (o) hover = o.userData.idx as number;
        }
      }
      if (pointer.inside && hover !== lastHover) { lastHover = hover; onActiveRef.current(hover); }
      if (!pointer.inside && lastHover !== null) { lastHover = null; onActiveRef.current(null); }
      host.style.cursor = hover !== null ? "pointer" : "";

      const pb = ease.outCubic(ease.step(s, 0, 0.8));
      base.scale.setScalar(0.85 + 0.15 * pb);
      base.position.y = (1 - pb) * -0.3;
      (ao.material as THREE.MeshBasicMaterial).opacity = 0.2 * pb;
      const hp = ease.outBack(ease.step(s, 0.25, 0.7));
      hub.position.y = (1 - hp) * 1.6;
      hub.visible = hp > 0.001;
      ring.rotation.z = t * 0.3;
      ring.position.y = TOP + 0.7 + Math.sin(t * 1.2) * 0.05;
      seamMat.emissiveIntensity = 1.2 + Math.sin(t * 2) * 0.25;

      const act = activeRef.current;
      cols.forEach((c, i) => {
        const isA = act === i;
        c.glow += ((isA ? 1 : 0) - c.glow) * 0.12;
        c.lift += ((isA ? 0.18 : 0) - c.lift) * 0.12;
        c.grp.position.y = c.lift;
        // level blocks drop in one by one
        c.slabs.forEach((sl) => {
          const p = ease.outBack(ease.step(s, 0.5 + i * 0.1 + sl.order * 0.16, 0.55));
          sl.s.scale.y = Math.max(0.001, sl.h * Math.min(1, p));
          sl.s.position.y = sl.y + (1 - Math.min(1, p)) * 0.9;
          sl.s.visible = p > 0.001;
          sl.m.emissive.copy(COLORS.blue).multiplyScalar(c.glow * 0.35);
        });
        const gp = ease.step(s, 1.6 + i * 0.08, 0.7);
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.8 - i * 0.6);
        c.ghosts.forEach((gh) => {
          gh.gm.opacity = gp * (0.2 + pulse * 0.08 + c.glow * 0.2);
          gh.em.opacity = gp * (0.45 + c.glow * 0.45);
        });
        const bp = ease.outBack(ease.step(s, 1.8 + i * 0.08, 0.6));
        c.sprite.scale.setScalar(Math.max(0.001, bp * (0.95 + c.glow * 0.18)));
        c.sprite.position.y = c.badgeY + Math.sin(t * 1.4 + i) * 0.05;
        if (isA !== c.isA) { c.isA = isA; c.sprite.material.map = isA ? c.texA : c.texN; c.sprite.material.needsUpdate = true; }
        c.lab.element.style.opacity = String(ease.step(s, 1.2 + i * 0.08, 0.5));
        c.lab.element.classList.toggle("is-active", isA);
      });

      const wp = ease.inOutCubic(ease.step(s, 2.0, 1.2));
      web.uniforms.uDraw.value = wp;
      web.uniforms.uTime.value = t;
      fanMat.opacity = 0.1 * ease.step(s, 2.6, 0.8);
    });

    return () => {
      cols.forEach((c) => { c.texN.dispose(); c.texA.dispose(); });
      stage.dispose();
    };
  }, [names, current, target]);

  return <div ref={hostRef} className="relative h-full w-full" />;
}
