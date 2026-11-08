"use client";

import React from "react";
import { motion, Variants, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { InlineEditable, useEditor } from "@/components/editor";

interface ProcessStep {
  step_number: number;
  title: string;
  description: string;
}

interface AtalitixGraphicMapProps {
  steps: ProcessStep[];
  mapTitle?: string;
  mapBadge?: string;
  /** Start the build-up animation (synced with the intro). */
  play?: boolean;
}

type Tone = "base" | "core" | "flex" | "insight";

/**
 * Enterprise architecture diagram.
 * With the standard 4 steps it renders as:
 *   [ İş Süreci ]
 *        │
 *   [ ERP Alanı ] [ ERP Dışı Alan ]
 *        │
 *   [ Görünürlük ]
 * Any other count falls back to a vertical stack.
 */
export function AtalitixGraphicMap({ steps: initialSteps, mapTitle, mapBadge, play = true }: AtalitixGraphicMapProps) {
  const { isEditorMode, data } = useEditor();
  const reduce = useReducedMotion();

  // Subtle 3D tilt toward the cursor
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-5, 5]), { stiffness: 120, damping: 18 });
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [4, -4]), { stiffness: 120, damping: 18 });
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce || isEditorMode) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { px.set(0); py.set(0); };
  const steps: ProcessStep[] = isEditorMode && data?.processSteps ? data.processSteps : initialSteps;

  const isArchitecture = steps.length === 4;
  const rows: number[][] = isArchitecture ? [[0], [1, 2], [3]] : steps.map((_, i) => [i]);
  const toneFor = (i: number): Tone => {
    if (!isArchitecture) return i === 0 ? "core" : "base";
    return (["base", "core", "flex", "insight"] as Tone[])[i];
  };

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.16, delayChildren: 0.7 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div style={{ perspective: 1400 }} onMouseMove={onMove} onMouseLeave={onLeave}>
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative rounded-2xl border border-slate-200 bg-white shadow-[0_30px_70px_-30px_rgba(11,26,79,0.35)] overflow-hidden"
    >
      {/* Panel header */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-[var(--color-bg-soft)] px-5 py-3.5 md:px-6">
        <div className="min-w-0">
          <InlineEditable
            section="hero"
            field="map_badge"
            defaultValue={mapBadge || "ATALİTİX MAP"}
            tagName="p"
            className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-[var(--brand-blue)]"
          />
          <InlineEditable
            section="hero"
            field="map_title"
            defaultValue={mapTitle || "Sahadan sisteme, sistemden karara"}
            tagName="p"
            className="mt-0.5 text-sm font-semibold text-[var(--brand-navy)] truncate"
          />
        </div>
        <div className="hidden sm:flex items-center gap-2 shrink-0 rounded-md border border-slate-200 bg-white px-2.5 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" style={{ animation: "pulse-dot 2.4s ease-in-out infinite" }} />
          <span className="font-mono text-[10px] tracking-wider text-slate-500 uppercase">Mimari</span>
        </div>
      </div>

      {/* Diagram */}
      <motion.div
        variants={container}
        initial={isEditorMode ? false : "hidden"}
        animate={play || isEditorMode ? "visible" : "hidden"}
        className="relative p-5 md:p-6"
      >
        {rows.map((row, r) => {
          const next = rows[r + 1];
          return (
            <React.Fragment key={r}>
              <div className={`grid gap-3 ${row.length > 1 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
                {row.map((i) => (
                  <motion.div key={steps[i]?.step_number ?? i} variants={item}>
                    <LayerCard step={steps[i]} index={i} tone={toneFor(i)} />
                  </motion.div>
                ))}
              </div>
              {next && (
                <motion.div variants={item}>
                  <Connector from={row.length} to={next.length} />
                </motion.div>
              )}
            </React.Fragment>
          );
        })}
      </motion.div>
    </motion.div>
    </div>
  );
}

function LayerCard({ step, index, tone }: { step: ProcessStep; index: number; tone: Tone }) {
  const styles: Record<Tone, string> = {
    base: "bg-white border border-slate-200",
    core: "bg-[var(--brand-navy-700)] border border-[var(--brand-navy-700)] text-white",
    flex: "bg-[var(--brand-blue-50)] border border-dashed border-[var(--brand-blue)]/50",
    insight: "bg-white border border-slate-200",
  };
  const isDark = tone === "core";

  return (
    <div className={`relative h-full rounded-xl p-4 md:p-5 transition-shadow hover:shadow-[0_10px_24px_-14px_rgba(11,26,79,0.35)] ${styles[tone]}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          <span
            className={`font-mono text-[11px] font-medium ${isDark ? "text-[var(--brand-blue-400)]" : "text-[var(--brand-blue)]"}`}
          >
            {String(step?.step_number ?? index + 1).padStart(2, "0")}
          </span>
          <InlineEditable
            section="processSteps"
            field="title"
            index={index}
            defaultValue={step?.title || ""}
            tagName="h3"
            className={`text-[15px] font-semibold leading-tight ${isDark ? "text-white" : "text-[var(--brand-navy)]"}`}
          />
        </div>
        <LayerGlyph tone={tone} />
      </div>
      <InlineEditable
        section="processSteps"
        field="description"
        index={index}
        defaultValue={step?.description || ""}
        tagName="p"
        className={`text-[13px] leading-relaxed ${isDark ? "text-slate-300" : "text-slate-500"}`}
      />
    </div>
  );
}

function LayerGlyph({ tone }: { tone: Tone }) {
  const common = "w-5 h-5 shrink-0";
  if (tone === "core") {
    // stacked database / system core
    return (
      <svg className={`${common} text-[var(--brand-blue-400)]`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
        <ellipse cx="12" cy="5.5" rx="7" ry="2.5" />
        <path d="M5 5.5v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-6M5 11.5v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-6" />
      </svg>
    );
  }
  if (tone === "flex") {
    // modular blocks
    return (
      <svg className={`${common} text-[var(--brand-blue)]`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" strokeDasharray="2 2" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" strokeDasharray="2 2" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
      </svg>
    );
  }
  if (tone === "insight") {
    // KPI bars
    return (
      <svg className={`${common} text-[var(--brand-blue)]`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden="true">
        <path d="M4 20h16" />
        <path d="M7 16v-4M12 16V8M17 16v-7" />
      </svg>
    );
  }
  // workflow
  return (
    <svg className={`${common} text-slate-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="6" height="5" rx="1" />
      <rect x="15" y="15" width="6" height="5" rx="1" />
      <path d="M6 9v4a2 2 0 002 2h7" />
    </svg>
  );
}

/**
 * Connector between rows with travelling data packets.
 * Built from divs (not a stretched SVG) so dots stay round at any width.
 * Split: 1 → 2 columns, merge: 2 → 1. On mobile the split row stacks, so it collapses to a straight line.
 */
function Connector({ from, to }: { from: number; to: number }) {
  const split = from === 1 && to === 2;
  const merge = from === 2 && to === 1;
  const line = "absolute bg-[repeating-linear-gradient(to_bottom,#b9c7e3_0_3px,transparent_3px_6px)] w-px";
  const hline = "absolute h-px bg-[repeating-linear-gradient(to_right,#b9c7e3_0_3px,transparent_3px_6px)]";
  const L = "calc(25% - 3px)";
  const R = "calc(75% + 3px)";

  const Straight = (
    <div className="relative h-8">
      <span className={`${line} left-1/2 top-0 bottom-0`} />
      <span className="packet left-1/2" style={{ ["--travel" as string]: "32px" }} />
    </div>
  );

  if (!split && !merge) return <div aria-hidden="true">{Straight}</div>;

  return (
    <div aria-hidden="true">
      <div className="sm:hidden">{Straight}</div>
      <div className="relative h-8 hidden sm:block">
        {split ? (
          <>
            <span className={`${line} left-1/2 top-0 h-1/2`} />
            <span className={`${hline} top-1/2`} style={{ left: L, right: `calc(100% - ${R})` }} />
            <span className={`${line} top-1/2 bottom-0`} style={{ left: L }} />
            <span className={`${line} top-1/2 bottom-0`} style={{ left: R }} />
            <span className="packet left-1/2" style={{ ["--travel" as string]: "16px", animationDuration: "0.9s" }} />
            <span className="packet" style={{ left: L, top: "50%", ["--travel" as string]: "16px", animationDelay: "0.45s", animationDuration: "0.9s" }} />
            <span className="packet" style={{ left: R, top: "50%", ["--travel" as string]: "16px", animationDelay: "0.6s", animationDuration: "0.9s" }} />
          </>
        ) : (
          <>
            <span className={`${line} top-0 h-1/2`} style={{ left: L }} />
            <span className={`${line} top-0 h-1/2`} style={{ left: R }} />
            <span className={`${hline} top-1/2`} style={{ left: L, right: `calc(100% - ${R})` }} />
            <span className={`${line} left-1/2 top-1/2 bottom-0`} />
            <span className="packet" style={{ left: L, ["--travel" as string]: "16px", animationDuration: "0.9s" }} />
            <span className="packet" style={{ left: R, ["--travel" as string]: "16px", animationDelay: "0.2s", animationDuration: "0.9s" }} />
            <span className="packet left-1/2" style={{ top: "50%", ["--travel" as string]: "16px", animationDelay: "0.5s", animationDuration: "0.9s" }} />
          </>
        )}
      </div>
    </div>
  );
}
