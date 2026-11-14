import * as THREE from "three";
import { COLORS, mat, roundedBox, ease } from "./stage";

/**
 * Small animated models that stand on each ERP module tile.
 * Each builder returns a group (origin = tile top centre, footprint ≈ 1.7 × 1.7)
 * and an `update(t, boost)` that animates it; `boost` (0..1) speeds things up on hover.
 */
export interface Diorama {
  group: THREE.Group;
  update: (t: number, boost: number) => void;
}

export function makePalette() {
  return {
    white: mat.satin("#ffffff"),
    paper: mat.satin("#edf1f8"),
    navy: mat.gloss(COLORS.navy),
    navy6: mat.gloss(COLORS.navy600),
    blue: mat.gloss(COLORS.blue),
    blue4: mat.satin(COLORS.blue400),
    blue2: mat.satin(COLORS.blue200),
    steel: mat.satin(COLORS.steel, { metalness: 0.45, roughness: 0.32 }),
    glow: mat.glow(COLORS.blue, 1.4),
  };
}
type Palette = ReturnType<typeof makePalette>;

const mesh = (geo: THREE.BufferGeometry, m: THREE.Material) => {
  const x = new THREE.Mesh(geo, m);
  x.castShadow = true;
  x.receiveShadow = true;
  return x;
};

/* Finans — coin stacks growing, a new coin drops onto the tallest one */
function finans(P: Palette): Diorama {
  const g = new THREE.Group();
  const coinGeo = new THREE.CylinderGeometry(0.21, 0.21, 0.07, 40);
  const counts = [3, 5, 8];
  const tops: number[] = [];
  counts.forEach((n, s) => {
    const x = -0.46 + s * 0.46;
    for (let k = 0; k < n; k++) {
      const c = mesh(coinGeo, k % 2 ? P.blue4 : P.blue);
      c.position.set(x, 0.035 + k * 0.078, s === 1 ? -0.18 : 0.12);
      g.add(c);
    }
    tops.push(0.035 + n * 0.078);
  });
  const dropMat = P.blue.clone();
  const drop = mesh(coinGeo, dropMat);
  g.add(drop);
  // a slim card behind the coins: a bank statement
  const card = roundedBox(0.95, 0.62, 0.05, 0.03, P.white);
  card.position.set(-0.05, 0.31, -0.62);
  card.rotation.x = -0.12;
  g.add(card);
  for (let r = 0; r < 3; r++) {
    const line = new THREE.Mesh(new THREE.BoxGeometry(r === 0 ? 0.5 : 0.7 - r * 0.12, 0.035, 0.01), r === 0 ? P.navy : P.blue2);
    line.position.set(-0.05 - (r === 0 ? 0.1 : 0), 0.46 - r * 0.11, -0.59);
    line.rotation.x = -0.12;
    g.add(line);
  }
  return {
    group: g,
    update: (t, boost) => {
      const period = 2.4 - boost * 0.9;
      const f = (t % period) / period;
      const fall = ease.step(f, 0, 0.35);
      const y = tops[2] + 0.04 + (1 - ease.outCubic(fall)) * 0.9;
      drop.position.set(0.46, y, 0.12);
      drop.rotation.z = (1 - fall) * 0.6;
      drop.scale.setScalar(f > 0.86 ? Math.max(0.001, 1 - (f - 0.86) / 0.14) : Math.min(1, f * 8));
    },
  };
}

/* Satınalma — delivery truck, wheels turning, road lines passing */
function satinalma(P: Palette): Diorama {
  const g = new THREE.Group();
  const truck = new THREE.Group();
  g.add(truck);
  const chassis = mesh(new THREE.BoxGeometry(1.36, 0.07, 0.42), P.navy);
  chassis.position.set(0, 0.17, 0);
  truck.add(chassis);
  const box = roundedBox(0.92, 0.52, 0.54, 0.06, P.white);
  box.position.set(-0.2, 0.47, 0);
  truck.add(box);
  const stripe = mesh(new THREE.BoxGeometry(0.93, 0.07, 0.55), P.blue);
  stripe.position.set(-0.2, 0.36, 0);
  truck.add(stripe);
  const cab = roundedBox(0.36, 0.42, 0.52, 0.08, P.blue);
  cab.position.set(0.48, 0.41, 0);
  truck.add(cab);
  const glass = roundedBox(0.04, 0.16, 0.44, 0.015, P.navy);
  glass.position.set(0.66, 0.5, 0);
  truck.add(glass);
  const wheelGeo = new THREE.CylinderGeometry(0.115, 0.115, 0.09, 28);
  wheelGeo.rotateX(Math.PI / 2);
  const hubGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.1, 16);
  hubGeo.rotateX(Math.PI / 2);
  const wheels: THREE.Mesh[] = [];
  for (const x of [-0.42, 0.46]) for (const z of [-0.25, 0.25]) {
    const w = mesh(wheelGeo, P.navy);
    w.position.set(x, 0.115, z);
    w.add(new THREE.Mesh(hubGeo, P.steel));
    truck.add(w);
    wheels.push(w);
  }
  truck.position.x = -0.04;
  // road dashes
  const dashGeo = new THREE.BoxGeometry(0.26, 0.012, 0.05);
  const dashes = Array.from({ length: 5 }, () => {
    const d = new THREE.Mesh(dashGeo, P.blue2);
    d.position.set(0, 0.006, 0.52);
    g.add(d);
    return d;
  });
  let travel = 0;
  return {
    group: g,
    update: (t, boost) => {
      travel += 0.012 + boost * 0.02;
      wheels.forEach((w) => (w.rotation.z = -travel * 6));
      truck.position.y = Math.abs(Math.sin(t * 9)) * 0.008;
      dashes.forEach((d, i) => {
        const p = ((i / dashes.length - travel * 0.4) % 1 + 1) % 1;
        d.position.x = 0.8 - p * 1.6;
        d.scale.x = Math.min(1, Math.min(p, 1 - p) * 8);
      });
    },
  };
}

/* Stok — racking with parcels; a new parcel slides into the empty slot */
function stok(P: Palette): Diorama {
  const g = new THREE.Group();
  const postGeo = new THREE.BoxGeometry(0.05, 0.92, 0.05);
  for (const x of [-0.56, 0.56]) for (const z of [-0.3, 0.3]) {
    const p = mesh(postGeo, P.steel);
    p.position.set(x, 0.46, z);
    g.add(p);
  }
  const shelfGeo = new THREE.BoxGeometry(1.2, 0.04, 0.66);
  for (const y of [0.04, 0.47, 0.9]) {
    const s = mesh(shelfGeo, P.navy6);
    s.position.y = y;
    g.add(s);
  }
  const parcel = (m: THREE.Material) => {
    const b = roundedBox(0.3, 0.3, 0.42, 0.04, m);
    const tape = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.305, 0.425), P.blue2);
    b.add(tape);
    return b;
  };
  const mats = [P.white, P.paper, P.white];
  [[-0.36, 0.21], [0, 0.21], [0.36, 0.21], [-0.36, 0.64], [0, 0.64]].forEach(([x, y], i) => {
    const b = parcel(mats[i % 3]);
    b.position.set(x, y, 0);
    g.add(b);
  });
  const moving = parcel(P.blue4);
  g.add(moving);
  return {
    group: g,
    update: (t, boost) => {
      const period = 3.2 - boost * 1.2;
      const f = (t % period) / period;
      const inP = ease.inOutCubic(ease.step(f, 0, 0.32));
      moving.position.set(0.36, 0.64, 0.9 - inP * 0.9);
      moving.scale.setScalar(f > 0.88 ? Math.max(0.001, 1 - (f - 0.88) / 0.12) : Math.min(1, f * 10));
    },
  };
}

/* Üretim — saw-tooth factory hall, lit windows, chimney, turning gear */
function uretim(P: Palette): Diorama {
  const g = new THREE.Group();
  const hall = roundedBox(1.12, 0.44, 0.66, 0.04, P.white);
  hall.position.set(-0.16, 0.22, -0.05);
  g.add(hall);
  const tooth = new THREE.Shape();
  tooth.moveTo(0, 0); tooth.lineTo(0.37, 0); tooth.lineTo(0, 0.24); tooth.closePath();
  const toothGeo = new THREE.ExtrudeGeometry(tooth, { depth: 0.66, bevelEnabled: false });
  toothGeo.translate(0, 0, -0.33);
  for (let i = 0; i < 3; i++) {
    const r = mesh(toothGeo, i === 1 ? P.blue : P.blue4);
    r.position.set(-0.72 + i * 0.37, 0.44, -0.05);
    g.add(r);
  }
  const windows = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.07, 0.01), P.glow);
  windows.position.set(-0.16, 0.25, 0.285);
  g.add(windows);
  const door = roundedBox(0.2, 0.24, 0.02, 0.01, P.navy);
  door.position.set(0.24, 0.12, 0.28);
  g.add(door);
  const chimney = mesh(new THREE.CylinderGeometry(0.065, 0.085, 0.62, 20), P.navy);
  chimney.position.set(0.22, 0.75, -0.24);
  g.add(chimney);
  const smoke = Array.from({ length: 3 }, () => {
    const m = new THREE.MeshStandardMaterial({ color: "#dfe7f6", roughness: 1, transparent: true, opacity: 0, depthWrite: false });
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), m);
    g.add(s);
    return { s, m };
  });
  // gear
  const gs = new THREE.Shape();
  const teeth = 10, ro = 0.3, ri = 0.24;
  for (let i = 0; i < teeth * 2; i++) {
    const a0 = (i / (teeth * 2)) * Math.PI * 2, a1 = ((i + 1) / (teeth * 2)) * Math.PI * 2;
    const r = i % 2 ? ri : ro;
    if (i === 0) gs.moveTo(Math.cos(a0) * r, Math.sin(a0) * r);
    gs.lineTo(Math.cos(a0) * r, Math.sin(a0) * r);
    gs.lineTo(Math.cos(a1) * r, Math.sin(a1) * r);
  }
  const hole = new THREE.Path();
  hole.absarc(0, 0, 0.08, 0, Math.PI * 2, true);
  gs.holes.push(hole);
  const gearGeo = new THREE.ExtrudeGeometry(gs, { depth: 0.08, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.012, bevelSegments: 2, curveSegments: 6 });
  gearGeo.translate(0, 0, -0.04);
  const gear = mesh(gearGeo, P.navy6);
  gear.position.set(0.66, 0.31, 0.22);
  gear.rotation.y = -0.35;
  g.add(gear);
  let spin = 0;
  return {
    group: g,
    update: (t, boost) => {
      spin += 0.012 + boost * 0.03;
      gear.rotation.z = spin;
      (P.glow as THREE.MeshStandardMaterial).emissiveIntensity = 1.2 + Math.sin(t * 2.4) * 0.25 + boost * 0.6;
      smoke.forEach((p, i) => {
        const f = ((t * (0.35 + boost * 0.3) + i / 3) % 1);
        p.s.position.set(0.22 + f * 0.18, 1.1 + f * 0.75, -0.24 - f * 0.1);
        p.s.scale.setScalar(0.6 + f * 1.4);
        p.m.opacity = Math.sin(f * Math.PI) * 0.85;
      });
    },
  };
}

/* Satış — bar chart rising, trend arrow above */
function satis(P: Palette): Diorama {
  const g = new THREE.Group();
  const H = [0.32, 0.52, 0.74, 1.0];
  const mats = [P.blue2, P.blue4, P.blue, P.navy];
  const barGeo = new THREE.BoxGeometry(0.22, 1, 0.22);
  barGeo.translate(0, 0.5, 0);
  const bars = H.map((h, i) => {
    const b = mesh(barGeo, mats[i]);
    b.position.set(-0.51 + i * 0.34, 0, 0.05);
    b.scale.y = h;
    g.add(b);
    return b;
  });
  const pts = H.map((h, i) => new THREE.Vector3(-0.51 + i * 0.34, h + 0.2, 0.05));
  const path = new THREE.CurvePath<THREE.Vector3>();
  for (let i = 0; i < pts.length - 1; i++) path.add(new THREE.LineCurve3(pts[i], pts[i + 1]));
  const trend = mesh(new THREE.TubeGeometry(path, 40, 0.024, 8, false), P.blue);
  g.add(trend);
  const head = mesh(new THREE.ConeGeometry(0.07, 0.17, 20), P.blue);
  const dir = pts[3].clone().sub(pts[2]).normalize();
  head.position.copy(pts[3]).addScaledVector(dir, 0.06);
  head.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  g.add(head);
  const dots = pts.map((p) => {
    const d = mesh(new THREE.SphereGeometry(0.045, 16, 12), P.white);
    d.position.copy(p);
    g.add(d);
    return d;
  });
  return {
    group: g,
    update: (t, boost) => {
      bars.forEach((b, i) => {
        const k = 1 + Math.sin(t * (1.7 + boost) - i * 0.7) * (0.05 + boost * 0.05);
        b.scale.y = H[i] * k;
        dots[i].position.y = H[i] * k + 0.2;
      });
    },
  };
}

/* İK — a small team, nodding in turn, on a turning ring */
function ik(P: Palette): Diorama {
  const g = new THREE.Group();
  const bodyGeo = new THREE.CapsuleGeometry(0.13, 0.2, 8, 20);
  const headGeo = new THREE.SphereGeometry(0.11, 24, 18);
  const people = [
    { x: 0, z: -0.12, m: P.navy, s: 1.12 },
    { x: -0.45, z: 0.14, m: P.blue, s: 1 },
    { x: 0.45, z: 0.14, m: P.blue4, s: 1 },
  ].map((p) => {
    const grp = new THREE.Group();
    const body = mesh(bodyGeo, p.m);
    body.position.y = 0.23;
    const head = mesh(headGeo, p.m);
    head.position.y = 0.58;
    grp.add(body, head);
    grp.scale.setScalar(p.s);
    grp.position.set(p.x, 0, p.z);
    g.add(grp);
    return grp;
  });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.66, 0.014, 8, 96), P.blue4);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.02;
  g.add(ring);
  const beads = Array.from({ length: 3 }, () => {
    const b = mesh(new THREE.SphereGeometry(0.04, 12, 10), P.blue);
    g.add(b);
    return b;
  });
  let turn = 0;
  return {
    group: g,
    update: (t, boost) => {
      turn += 0.008 + boost * 0.02;
      people.forEach((p, i) => (p.position.y = Math.max(0, Math.sin(t * 2.2 - i * 1.4)) * 0.07));
      beads.forEach((b, i) => {
        const a = turn + (i / 3) * Math.PI * 2;
        b.position.set(Math.cos(a) * 0.66, 0.02, Math.sin(a) * 0.66);
      });
    },
  };
}

export const DIORAMAS: Record<string, (P: Palette) => Diorama> = { finans, satinalma, stok, uretim, satis, ik };
