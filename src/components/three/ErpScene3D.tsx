"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createStage, label, outlinedBox, anchorOutward, COLORS, ease } from "./stage";

const MODULES = ["Finans", "Satınalma", "Stok", "Üretim", "Satış", "İK"];
// Non-ERP layer sits in the gaps between two modules
const OUTER = [
  { name: "Saha verisi", angle: -60, link: 1 },
  { name: "Onay akışları", angle: 60, link: 2 },
  { name: "Entegrasyon", angle: 120, link: 3 },
  { name: "KPI panelleri", angle: 240, link: 5 },
];

const PLATE_R = 7.1;
const CORE = 2.5;
const MOD_R = 4.6;
const TILE = 1.55;
const TILE_H = 0.34;
const OUT_R = 6.7;
const PERIOD = 2.6; // data pulse cycle

const deg = (d: number) => (d * Math.PI) / 180;

/**
 * "ERP platform model": an isometric architectural-model scene.
 * Core in the middle, six module tiles around it, the flexible non-ERP layer floating
 * at the edge; data pulses travel core → module and make the module light up on arrival.
 */
export default function ErpScene3D({ play = true }: { play?: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playRef = useRef(play);
  useEffect(() => { playRef.current = play; }, [play]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const stage = createStage(host, { viewSize: 13.6, elevation: 0.7, azimuth: 45 });
    const { root, camera, pointer } = stage;

    // Base plate (paper-coloured disc with a fine rim line)
    const plate = new THREE.Mesh(
      new THREE.CylinderGeometry(PLATE_R, PLATE_R, 0.14, 128),
      new THREE.MeshStandardMaterial({ color: COLORS.paper, roughness: 1 }),
    );
    plate.position.y = 0.07;
    plate.receiveShadow = true;
    root.add(plate);
    const rim = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(Array.from({ length: 129 }, (_, i) => new THREE.Vector3(Math.cos((i / 128) * Math.PI * 2) * PLATE_R, 0.142, Math.sin((i / 128) * Math.PI * 2) * PLATE_R))),
      new THREE.LineBasicMaterial({ color: COLORS.navy, transparent: true, opacity: 0.18 }),
    );
    root.add(rim);
    // Inner reference ring through the modules
    const ring = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(Array.from({ length: 129 }, (_, i) => new THREE.Vector3(Math.cos((i / 128) * Math.PI * 2) * MOD_R, 0.145, Math.sin((i / 128) * Math.PI * 2) * MOD_R))),
      new THREE.LineBasicMaterial({ color: COLORS.navy, transparent: true, opacity: 0 }),
    );
    root.add(ring);

    // Core
    const core = outlinedBox(CORE, 1, CORE, COLORS.navy, COLORS.blue400, 0.55, 0.6);
    core.mesh.scale.y = 0.001;
    root.add(core.mesh);
    const coreLabel = label("ERP", "tl-core");
    coreLabel.position.set(0, 0.6, 0);
    core.mesh.add(coreLabel);

    // Modules + connectors + packets
    const modules = MODULES.map((name, i) => {
      const a = deg(i * 60 - 90);
      const x = Math.cos(a) * MOD_R, z = Math.sin(a) * MOD_R;
      const tile = outlinedBox(TILE, TILE_H, TILE, COLORS.white, COLORS.navy, 0.38);
      tile.mesh.position.set(x, -1, z);
      tile.mesh.rotation.y = -a;
      root.add(tile.mesh);
      const lab = label(name, "tl-module");
      lab.position.set(0, 0.62, 0);
      tile.mesh.add(lab);

      const start = new THREE.Vector3(Math.cos(a) * (CORE / 2 + 0.15), 0.16, Math.sin(a) * (CORE / 2 + 0.15));
      const end = new THREE.Vector3(Math.cos(a) * (MOD_R - TILE / 2 - 0.1), 0.16, Math.sin(a) * (MOD_R - TILE / 2 - 0.1));
      const lineMat = new THREE.LineBasicMaterial({ color: COLORS.navy, transparent: true, opacity: 0 });
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([start, end]), lineMat);
      root.add(line);

      const packet = new THREE.Mesh(new THREE.SphereGeometry(0.11, 20, 20), new THREE.MeshBasicMaterial({ color: COLORS.blue, transparent: true, opacity: 0 }));
      root.add(packet);

      return { name, tile, lab, line, lineMat, packet, start, end, flash: 0, lift: 0, lastCycle: -1, baseY: TILE_H / 2 + 0.14 };
    });

    // Non-ERP layer: floating blue blocks with dashed links
    const outer = OUTER.map((o, i) => {
      const a = deg(o.angle);
      const x = Math.cos(a) * OUT_R, z = Math.sin(a) * OUT_R;
      const blk = outlinedBox(0.8, 0.22, 0.8, COLORS.blue, COLORS.navy, 0.35, 0.55);
      blk.mesh.position.set(x, 1.05, z);
      blk.mesh.rotation.y = deg(45);
      blk.mesh.scale.setScalar(0.001);
      root.add(blk.mesh);
      // Label pushed outward along the radius so it never sits on a module label
      const lab = label(o.name, "tl-outer");
      if (host.clientWidth < 520) {
        // Narrow screens: label above the block so it never runs off the edge
        lab.position.set(x, 1.75, z);
      } else {
        const lx = Math.cos(a) * (OUT_R + 0.75), lz = Math.sin(a) * (OUT_R + 0.75);
        lab.position.set(lx, 1.05, lz);
        anchorOutward(lab, lx, lz, 45);
      }
      root.add(lab);

      const m = modules[o.link];
      const from = new THREE.Vector3(m.tile.mesh.position.x, TILE_H + 0.14, m.tile.mesh.position.z);
      const dashMat = new THREE.LineDashedMaterial({ color: COLORS.blue, dashSize: 0.16, gapSize: 0.14, transparent: true, opacity: 0 });
      const dash = new THREE.Line(new THREE.BufferGeometry().setFromPoints([from, new THREE.Vector3(x, 1.0, z)]), dashMat);
      dash.computeLineDistances();
      root.add(dash);
      return { blk, dashMat, phase: i * 1.3 };
    });

    // Hover: raycast module tiles
    const raycaster = new THREE.Raycaster();
    let hovered = -1;
    const tileMeshes: THREE.Object3D[] = modules.map((m) => m.tile.mesh);

    let startAt = -1;
    stage.run((t) => {
      if (startAt < 0 && playRef.current) startAt = t;
      const s = startAt < 0 ? 0 : t - startAt; // timeline seconds

      // Gentle idle sway + pointer parallax
      root.rotation.y = Math.sin(t * 0.16) * 0.08 + pointer.x * 0.22;

      // Entrance
      const pc = ease.outBack(ease.step(s, 0.15, 0.9));
      core.mesh.scale.y = Math.max(0.001, pc);
      core.mesh.position.y = 0.14 + (pc * 1) / 2;
      (ring.material as THREE.LineBasicMaterial).opacity = 0.1 * ease.step(s, 0.6, 0.8);

      // Hover detection
      hovered = -1;
      if (pointer.inside) {
        raycaster.setFromCamera(pointer.ndc, camera);
        const hit = raycaster.intersectObjects(tileMeshes, false)[0];
        if (hit) hovered = tileMeshes.indexOf(hit.object);
      }

      modules.forEach((m, i) => {
        const pr = ease.outBack(ease.step(s, 0.45 + i * 0.09, 0.8));
        m.lift += ((hovered === i ? 0.32 : 0) - m.lift) * 0.15;
        m.tile.mesh.position.y = -1 + (m.baseY + 1) * pr + m.lift;
        m.lineMat.opacity = (hovered === i ? 0.95 : 0.24) * ease.step(s, 1.0 + i * 0.06, 0.6);
        m.lineMat.color.copy(hovered === i ? COLORS.blue : COLORS.navy);
        m.lab.element.classList.toggle("is-active", hovered === i);

        // Data pulse core → module
        const ts = s - 1.8 - i * 0.43;
        if (ts > 0) {
          const cycle = Math.floor(ts / PERIOD);
          const f = (ts % PERIOD) / PERIOD;
          const travel = Math.min(1, f / 0.7);
          m.packet.position.lerpVectors(m.start, m.end, ease.outCubic(travel));
          (m.packet.material as THREE.MeshBasicMaterial).opacity = f < 0.7 ? Math.min(1, f * 8) : 0;
          if (f >= 0.7 && m.lastCycle !== cycle) { m.flash = 1; m.lastCycle = cycle; }
        }
        m.flash *= 0.94;
        m.tile.mat.emissive.copy(COLORS.blue).multiplyScalar(0.55 * m.flash + (hovered === i ? 0.18 : 0));
      });

      outer.forEach((o, i) => {
        const po = ease.outBack(ease.step(s, 1.25 + i * 0.12, 0.7));
        o.blk.mesh.scale.setScalar(Math.max(0.001, po));
        o.blk.mesh.position.y = 1.05 + Math.sin(t * 1.1 + o.phase) * 0.08;
        o.dashMat.opacity = 0.55 * ease.step(s, 1.5 + i * 0.1, 0.6);
      });
    });

    return () => stage.dispose();
  }, []);

  return <div ref={hostRef} className="relative h-full w-full overflow-hidden" />;
}
