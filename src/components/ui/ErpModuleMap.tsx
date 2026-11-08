"use client";

import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/**
 * ERP module map — the core system in the middle, standard modules on the
 * inner ring, the flexible non-ERP layer on the dashed outer ring.
 * Pure SVG, no boxes. Draws itself in, then data pulses along the spokes.
 */

const C = 260; // centre
const R_CORE = 64;
const R_INNER = 150;
const R_OUTER = 228;

const MODULES = ["Finans", "Satınalma", "Stok", "Üretim", "Satış", "İK"];
const OUTER = [
  { label: "Saha verisi", angle: -45, link: 0 },
  { label: "Onay akışları", angle: 45, link: 2 },
  { label: "Entegrasyon", angle: 135, link: 3 },
  { label: "KPI panelleri", angle: 225, link: 5 },
];

const rad = (deg: number) => (deg * Math.PI) / 180;
const pt = (r: number, deg: number) => ({ x: C + r * Math.cos(rad(deg)), y: C + r * Math.sin(rad(deg)) });
const moduleAngle = (i: number) => -90 + i * 60;

function labelProps(deg: number, r: number) {
  const p = pt(r, deg);
  const cos = Math.cos(rad(deg));
  const sin = Math.sin(rad(deg));
  const anchor = cos > 0.3 ? "start" : cos < -0.3 ? "end" : "middle";
  const dy = sin > 0.3 ? "0.9em" : sin < -0.3 ? "-0.35em" : "0.35em";
  return { x: p.x, y: p.y, textAnchor: anchor as "start" | "end" | "middle", dy };
}

const DRAW = [0.65, 0, 0.35, 1] as const;

export function ErpModuleMap({ play = true }: { play?: boolean }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<number | null>(null);
  const on = play && inView;

  return (
    <figure className="relative w-full max-w-[600px] mx-auto">
      <svg
        ref={ref}
        viewBox="-70 -30 660 580"
        className="w-full h-auto overflow-visible select-none"
        role="img"
        aria-label="ERP modül haritası: merkezde ERP, çevresinde finans, satınalma, stok, üretim, satış ve insan kaynakları modülleri, dış katmanda saha verisi, onay akışları, entegrasyon ve KPI panelleri."
      >
        <style>{`
          @keyframes erp-dash { to { stroke-dashoffset: -60; } }
          .erp-orbit { animation: erp-dash 6s linear infinite; }
          @media (prefers-reduced-motion: reduce) { .erp-orbit { animation: none; } }
        `}</style>

        {/* Outer ring — flexible layer */}
        <motion.circle
          cx={C} cy={C} r={R_OUTER}
          fill="none" stroke="var(--brand-blue)" strokeOpacity={0.45} strokeWidth={1}
          strokeDasharray="3 7"
          className="erp-orbit"
          initial={{ opacity: 0 }}
          animate={{ opacity: on ? 1 : 0 }}
          transition={{ duration: 1.2, delay: 0.9 }}
        />

        {/* Inner ring — ERP modules */}
        <motion.circle
          cx={C} cy={C} r={R_INNER}
          fill="none" stroke="var(--brand-navy)" strokeOpacity={0.22} strokeWidth={1}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: on ? 1 : 0 }}
          transition={{ duration: 1.4, delay: 0.2, ease: DRAW }}
          style={{ rotate: -90, transformOrigin: `${C}px ${C}px` }}
        />

        {/* Spokes core → modules */}
        {MODULES.map((_, i) => {
          const a = pt(R_CORE + 6, moduleAngle(i));
          const b = pt(R_INNER, moduleAngle(i));
          const active = hover === i;
          return (
            <motion.line
              key={`s${i}`}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={active ? "var(--brand-blue)" : "var(--brand-navy)"}
              strokeOpacity={active ? 1 : 0.3}
              strokeWidth={active ? 1.5 : 1}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: on ? 1 : 0 }}
              transition={{ duration: 0.7, delay: 0.5 + i * 0.08, ease: DRAW }}
              style={{ transition: "stroke 0.3s, stroke-opacity 0.3s" }}
            />
          );
        })}

        {/* Links inner module → outer layer */}
        {OUTER.map((o, i) => {
          const a = pt(R_INNER, moduleAngle(o.link));
          const b = pt(R_OUTER, o.angle);
          return (
            <motion.line
              key={`l${i}`}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke="var(--brand-blue)" strokeOpacity={0.5} strokeWidth={1} strokeDasharray="2 4"
              initial={{ opacity: 0 }}
              animate={{ opacity: on ? 1 : 0 }}
              transition={{ duration: 0.8, delay: 1.3 + i * 0.1 }}
            />
          );
        })}

        {/* Data pulses along the spokes */}
        {on && !reduce &&
          MODULES.map((_, i) => {
            const a = pt(R_CORE + 6, moduleAngle(i));
            const b = pt(R_INNER, moduleAngle(i));
            const outward = i % 2 === 0;
            const d = outward ? `M${a.x},${a.y} L${b.x},${b.y}` : `M${b.x},${b.y} L${a.x},${a.y}`;
            return (
              <circle key={`p${i}`} r={2.6} fill="var(--brand-blue)" opacity={0}>
                <animateMotion dur="2.4s" begin={`${1.6 + i * 0.4}s`} repeatCount="indefinite" path={d} />
                <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.8;1" dur="2.4s" begin={`${1.6 + i * 0.4}s`} repeatCount="indefinite" />
              </circle>
            );
          })}

        {/* Core */}
        <motion.g
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: on ? 1 : 0.6, opacity: on ? 1 : 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: `${C}px ${C}px` }}
        >
          <circle cx={C} cy={C} r={R_CORE + 14} fill="none" stroke="var(--brand-navy)" strokeOpacity={0.12} />
          <circle cx={C} cy={C} r={R_CORE} fill="var(--brand-navy)" />
          <text x={C} y={C} textAnchor="middle" dominantBaseline="central" className="font-serif" fontSize={36} fill="#fff" letterSpacing="-0.5">ERP</text>
        </motion.g>

        {/* Module nodes + labels */}
        {MODULES.map((m, i) => {
          const deg = moduleAngle(i);
          const p = pt(R_INNER, deg);
          const lp = labelProps(deg, R_INNER + 20);
          const active = hover === i;
          return (
            <motion.g
              key={m}
              initial={{ opacity: 0 }}
              animate={{ opacity: on ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.8 + i * 0.08 }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: "default" }}
            >
              <circle cx={p.x} cy={p.y} r={22} fill="transparent" />
              <circle
                cx={p.x} cy={p.y} r={active ? 8 : 6}
                fill={active ? "var(--brand-blue)" : "#fff"}
                stroke={active ? "var(--brand-blue)" : "var(--brand-navy)"}
                strokeWidth={1.5}
                style={{ transition: "r 0.3s, fill 0.3s, stroke 0.3s" }}
              />
              <text {...lp} fontSize={18} fill={active ? "var(--brand-blue)" : "var(--brand-navy)"} style={{ transition: "fill 0.3s" }}>
                {m}
              </text>
            </motion.g>
          );
        })}

        {/* Outer layer nodes + labels */}
        {OUTER.map((o, i) => {
          const p = pt(R_OUTER, o.angle);
          const lp = labelProps(o.angle, R_OUTER + 16);
          return (
            <motion.g
              key={o.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: on ? 1 : 0 }}
              transition={{ duration: 0.6, delay: 1.4 + i * 0.1 }}
            >
              <rect x={p.x - 5} y={p.y - 5} width={10} height={10} transform={`rotate(45 ${p.x} ${p.y})`} fill="var(--brand-blue)" />
              <text {...lp} fontSize={16} fill="var(--ink-muted)">{o.label}</text>
            </motion.g>
          );
        })}
      </svg>

      {/* Legend */}
      <motion.figcaption
        className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[13px] text-[var(--ink-muted)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: on ? 1 : 0 }}
        transition={{ delay: 1.8, duration: 0.6 }}
      >
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full border-[1.5px] border-[var(--brand-navy)]" /> ERP modülleri
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rotate-45 bg-[var(--brand-blue)]" /> ERP dışı katman
        </span>
      </motion.figcaption>
    </figure>
  );
}
