"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
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
export function AtalitixGraphicMap({ steps: initialSteps, mapTitle, mapBadge }: AtalitixGraphicMapProps) {
  const { isEditorMode, data } = useEditor();
  const steps: ProcessStep[] = isEditorMode && data?.processSteps ? data.processSteps : initialSteps;

  const isArchitecture = steps.length === 4;
  const rows: number[][] = isArchitecture ? [[0], [1, 2], [3]] : steps.map((_, i) => [i]);
  const toneFor = (i: number): Tone => {
    if (!isArchitecture) return i === 0 ? "core" : "base";
    return (["base", "core", "flex", "insight"] as Tone[])[i];
  };

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.35 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white shadow-[0_24px_60px_-24px_rgba(11,26,79,0.25)] overflow-hidden">
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
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
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
              {next && <Connector from={row.length} to={next.length} />}
            </React.Fragment>
          );
        })}
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

/** Thin connector between rows; splits or merges when column counts differ. */
function Connector({ from, to }: { from: number; to: number }) {
  const split = from === 1 && to === 2;
  const merge = from === 2 && to === 1;
  const flow = { strokeDasharray: "4 4", animation: "flow-x 1.2s linear infinite" } as React.CSSProperties;

  let d = "M50 0 V28";
  if (split) d = "M50 0 V12 M25 12 H75 M25 12 V28 M75 12 V28";
  if (merge) d = "M25 0 V16 M75 0 V16 M25 16 H75 M50 16 V28";

  return (
    <div className="relative h-7" aria-hidden="true">
      {/* On mobile the split row stacks, so only draw a straight line */}
      <svg className={`absolute inset-0 w-full h-full ${split || merge ? "hidden sm:block" : ""}`} viewBox="0 0 100 28" preserveAspectRatio="none">
        <path d={d} fill="none" stroke="#c7d3ea" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        <path d={d} fill="none" stroke="var(--brand-blue)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" style={flow} />
      </svg>
      {(split || merge) && (
        <svg className="absolute inset-0 w-full h-full sm:hidden" viewBox="0 0 100 28" preserveAspectRatio="none">
          <path d="M50 0 V28" fill="none" stroke="var(--brand-blue)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" style={flow} />
        </svg>
      )}
    </div>
  );
}
