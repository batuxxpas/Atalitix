"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createStage, label, anchorOutward, COLORS, ease } from "./stage";

const RING_R = 3.25;
const COL_R = 0.74;
const UNIT = 0.5; // height per maturity level
const COLUMN = new THREE.Color("#2a3b86");

/**
 * "Maturity model": six hexagonal columns on a hexagonal base, one per dimension.
 * Solid height = current level, blue wireframe = 12-month target.
 * Linked both ways with the dimension list (hover a column or a list row).
 */
export default function MaturityScene3D({
  names,
  current,
  target,
  active,
  onActive,
}: {
  names: string[];
  current: number[];
  target: number[];
  active: number | null;
  onActive: (i: number | null) => void;
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
    const stage = createStage(host, { viewSize: 12.6, elevation: 0.62, azimuth: 30 });
    const { root, camera, pointer } = stage;
    const n = names.length;

    // Hexagonal base + level rings
    const base = new THREE.Mesh(new THREE.CylinderGeometry(5.3, 5.3, 0.14, 6), new THREE.MeshStandardMaterial({ color: COLORS.paper, roughness: 1 }));
    base.position.y = 0.07;
    base.rotation.y = Math.PI / 6;
    base.receiveShadow = true;
    root.add(base);
    const baseEdges = new THREE.LineSegments(new THREE.EdgesGeometry(base.geometry), new THREE.LineBasicMaterial({ color: COLORS.navy, transparent: true, opacity: 0.16 }));
    base.add(baseEdges);

    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.3, 6), new THREE.MeshStandardMaterial({ color: COLORS.navy, roughness: 0.6 }));
    hub.position.y = 0.29;
    hub.rotation.y = Math.PI / 6;
    hub.castShadow = true;
    root.add(hub);

    const unitGeo = new THREE.CylinderGeometry(COL_R, COL_R, 1, 6);
    unitGeo.translate(0, 0.5, 0); // grow from the bottom
    const unitEdges = new THREE.EdgesGeometry(unitGeo);

    const cols = names.map((name, i) => {
      const a = ((i * 360) / n - 90) * (Math.PI / 180);
      const x = Math.cos(a) * RING_R, z = Math.sin(a) * RING_R;
      const mat = new THREE.MeshStandardMaterial({ color: COLUMN, roughness: 0.62, metalness: 0.02 });
      const col = new THREE.Mesh(unitGeo, mat);
      col.position.set(x, 0.14, z);
      col.rotation.y = Math.PI / 6;
      col.scale.y = 0.001;
      col.castShadow = true;
      col.receiveShadow = true;
      const edges = new THREE.LineSegments(unitEdges, new THREE.LineBasicMaterial({ color: COLORS.blue400, transparent: true, opacity: 0.45 }));
      col.add(edges);
      root.add(col);

      // Target: dashed blue wireframe column
      const tgtMat = new THREE.LineDashedMaterial({ color: COLORS.blue, dashSize: 0.16, gapSize: 0.09, transparent: true, opacity: 0 });
      const tgt = new THREE.LineSegments(unitEdges, tgtMat);
      tgt.computeLineDistances();
      tgt.position.set(x, 0.14, z);
      tgt.rotation.y = Math.PI / 6;
      tgt.scale.set(1.04, Math.max(0.001, target[i] * UNIT), 1.04);
      root.add(tgt);

      // Label just outside the column, at the base
      const lab = label(name, "tl-module");
      const lr = RING_R + 1.25;
      const lx = Math.cos(a) * lr, lz = Math.sin(a) * lr;
      lab.position.set(lx, 0.2, lz);
      anchorOutward(lab, lx, lz, 30);
      root.add(lab);

      return { col, mat, edges, tgtMat, lab, h: current[i] * UNIT, glow: 0 };
    });

    const raycaster = new THREE.Raycaster();
    const colMeshes: THREE.Object3D[] = cols.map((c) => c.col);
    let lastHover: number | null = null;

    let startAt = -1;
    stage.run((t) => {
      if (startAt < 0) startAt = t;
      const s = t - startAt;
      root.rotation.y = Math.sin(t * 0.14) * 0.07 + pointer.x * 0.2;

      // Hover from the canvas → tell the list
      let hover: number | null = null;
      if (pointer.inside) {
        raycaster.setFromCamera(pointer.ndc, camera);
        const hit = raycaster.intersectObjects(colMeshes, false)[0];
        if (hit) hover = colMeshes.indexOf(hit.object);
      }
      if (pointer.inside && hover !== lastHover) { lastHover = hover; onActiveRef.current(hover); }
      if (!pointer.inside && lastHover !== null) { lastHover = null; onActiveRef.current(null); }

      const act = activeRef.current;
      cols.forEach((c, i) => {
        const pr = ease.outBack(ease.step(s, 0.3 + i * 0.12, 1.0));
        c.col.scale.y = Math.max(0.001, c.h * pr);
        c.tgtMat.opacity = (act === i ? 1 : 0.9) * ease.step(s, 1.3 + i * 0.08, 0.6);
        c.glow += ((act === i ? 1 : 0) - c.glow) * 0.14;
        c.mat.color.copy(COLUMN).lerp(COLORS.blue, c.glow);
        (c.edges.material as THREE.LineBasicMaterial).opacity = 0.45 + c.glow * 0.4;
        c.lab.element.classList.toggle("is-active", act === i);
      });
    });

    return () => stage.dispose();
  }, [names, current, target]);

  return <div ref={hostRef} className="relative h-full w-full overflow-hidden" />;
}
