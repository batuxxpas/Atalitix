"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const DRAW = [0.65, 0, 0.35, 1] as const;

export interface Step {
  title: string;
  desc?: string;
  /** Emphasised step: filled marker and stronger description. */
  key?: boolean;
}

/**
 * A single line that draws itself, with markers for each step.
 * Horizontal on desktop, vertical on mobile. Used across the solution detail sections.
 */
export function StepLine({ steps, surface = "white", numbered = true }: { steps: Step[]; surface?: "white" | "paper"; numbered?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const n = Math.max(steps.length, 1);
  const hollow = surface === "paper" ? "bg-[var(--paper)]" : "bg-white";

  return (
    <div ref={ref} className="relative">
      <motion.div
        className="hidden lg:block absolute left-0 right-0 top-[7px] h-px origin-left bg-[var(--rule-strong)]"
        initial={{ scaleX: 0 }} animate={{ scaleX: inView ? 1 : 0 }}
        transition={{ duration: 1.6, ease: DRAW }}
      />
      <motion.div
        className="lg:hidden absolute left-[7px] top-2 bottom-2 w-px origin-top bg-[var(--rule-strong)]"
        initial={{ scaleY: 0 }} animate={{ scaleY: inView ? 1 : 0 }}
        transition={{ duration: 1.6, ease: DRAW }}
      />
      {inView && <span className="process-pulse hidden lg:block absolute top-[4px] left-0 h-[7px] w-[7px] rounded-full bg-[var(--brand-blue)]" aria-hidden="true" />}

      <ol
        className="relative grid grid-cols-1 gap-8 lg:gap-6 lg:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]"
        style={{ ["--cols" as string]: n } as React.CSSProperties}
      >
        {steps.map((s, i) => {
          const delay = 0.3 + (i / n) * 1.3;
          return (
            <li key={s.title} className="relative pl-9 lg:pl-0">
              <motion.span
                className={`absolute left-0 lg:static block h-[15px] w-[15px] rounded-full border border-[var(--brand-navy)] ${s.key ? "bg-[var(--brand-navy)]" : hollow}`}
                initial={{ scale: 0 }} animate={{ scale: inView ? 1 : 0 }}
                transition={{ delay, type: "spring", stiffness: 300, damping: 20 }}
              />
              <motion.div
                className="lg:pt-6 lg:pr-4"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 10 }}
                transition={{ delay: delay + 0.1, duration: 0.7, ease: EASE_OUT }}
              >
                {numbered && <p className="text-[12px] tabular-nums text-[var(--ink-muted)] mb-1.5">{String(i + 1).padStart(2, "0")}</p>}
                <h4 className="font-serif text-[1.15rem] leading-tight text-[var(--ink)] mb-1.5">{s.title}</h4>
                {s.desc && (
                  <p className={`text-[13.5px] leading-relaxed ${s.key ? "text-[var(--brand-navy-700)] font-medium" : "text-[var(--ink-muted)]"}`}>{s.desc}</p>
                )}
              </motion.div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** Small link back to the solutions overview, shown at the top of each detail section. */
export function BackToSolutions({ number, title, dark = false }: { number: string; title: string; dark?: boolean }) {
  return (
    <a
      href="#cozumler"
      className={`group mb-8 inline-flex items-center gap-2 text-[13px] transition-colors ${dark ? "text-slate-400 hover:text-white" : "text-[var(--ink-muted)] hover:text-[var(--ink)]"}`}
    >
      <span className="transition-transform group-hover:-translate-y-0.5" aria-hidden="true">↑</span>
      Çözüm alanları
      <span aria-hidden="true">/</span>
      <span className={dark ? "text-white" : "text-[var(--ink)]"}>Çözüm {number} · {title}</span>
    </a>
  );
}
