"use client";

import { useRef } from "react";
import { motion, Variants, useInView } from "framer-motion";
import { InlineEditable, useEditor } from "@/components/editor";
import { useIntroReady, MaskLine } from "@/components/motion";

interface ProcessStep {
  step_number: number;
  title: string;
  description: string;
}

interface ProcessCategory {
  category_tag: string;
  title: string;
  description: string;
}

interface HeroData {
  badge_text: string;
  title_line1: string;
  title_line2: string;
  title_highlight: string;
  title_line3: string;
  title_line4: string;
  description: string;
  description2: string;
  tagline: string;
  tagline_sub: string;
  cta_primary_text: string;
  cta_secondary_text: string;
  map_title: string;
  map_badge: string;
}

interface HeroSectionProps {
  hero: HeroData;
  processSteps: ProcessStep[];
  processCategories: ProcessCategory[];
}

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export function HeroSection({ hero, processSteps: initialSteps }: HeroSectionProps) {
  const { isEditorMode, data } = useEditor();
  const introReady = useIntroReady();
  const show = isEditorMode || introReady;
  const steps: ProcessStep[] = isEditorMode && data?.processSteps ? data.processSteps : initialSteps;

  const fade: Variants = {
    hidden: { opacity: 0, y: 14 },
    visible: (d: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.9, delay: d, ease: EASE_OUT } }),
  };
  const anim = (d: number) => ({
    variants: fade,
    custom: d,
    initial: isEditorMode ? false : ("hidden" as const),
    animate: show ? "visible" : "hidden",
  });

  return (
    <section className="relative bg-white">
      <div className="container pt-16 md:pt-24 lg:pt-28">
        {/* Eyebrow */}
        <motion.div {...anim(0.05)} className="mb-10 md:mb-14">
          <span className="section-label">
            <InlineEditable section="hero" field="badge_text" defaultValue={hero.badge_text} tagName="span" />
          </span>
        </motion.div>

        {/* Headline */}
        <h1 className="display text-[2.9rem] sm:text-[4rem] lg:text-[5.6rem] max-w-5xl">
          <MaskLine show={show} delay={0.1} instant={isEditorMode}>
            <InlineEditable section="hero" field="title_line1" defaultValue={hero.title_line1} tagName="span" />
          </MaskLine>
          <MaskLine show={show} delay={0.2} instant={isEditorMode}>
            <InlineEditable section="hero" field="title_line2" defaultValue={hero.title_line2} tagName="span" />{" "}
            <InlineEditable section="hero" field="title_highlight" defaultValue={hero.title_highlight} tagName="span" className="italic text-[var(--brand-blue)]" />
            <InlineEditable section="hero" field="title_line3" defaultValue={hero.title_line3} tagName="span" />
          </MaskLine>
          <MaskLine show={show} delay={0.3} instant={isEditorMode}>
            <InlineEditable section="hero" field="title_line4" defaultValue={hero.title_line4} tagName="span" />
          </MaskLine>
        </h1>

        {/* Rule */}
        <motion.div
          className="mt-14 md:mt-20 h-px origin-left bg-[var(--rule)]"
          initial={isEditorMode ? false : { scaleX: 0 }}
          animate={show ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.3, delay: 0.45, ease: [0.65, 0, 0.35, 1] }}
        />

        {/* Copy + actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-10 md:pt-12">
          <motion.div {...anim(0.6)} className="lg:col-span-5">
            <InlineEditable section="hero" field="description" defaultValue={hero.description} tagName="p" className="lead" />
          </motion.div>
          <motion.div {...anim(0.7)} className="lg:col-span-4">
            <InlineEditable section="hero" field="description2" defaultValue={hero.description2} tagName="p" className="text-[15.5px] leading-relaxed text-[var(--ink-muted)]" />
          </motion.div>
          <motion.div {...anim(0.8)} className="lg:col-span-3 flex flex-col items-start gap-5">
            <a href="#cozumler" onClick={(e) => isEditorMode && e.preventDefault()} className="btn-primary">
              <InlineEditable section="hero" field="cta_primary_text" defaultValue={hero.cta_primary_text} tagName="span" />
            </a>
            <a href="#deneyim" onClick={(e) => isEditorMode && e.preventDefault()} className="btn-outline">
              <InlineEditable section="hero" field="cta_secondary_text" defaultValue={hero.cta_secondary_text} tagName="span" />
            </a>
          </motion.div>
        </div>
      </div>

      {/* Process line — the operating map, drawn as a single line */}
      <div className="container pt-24 md:pt-32 pb-24 md:pb-28">
        <motion.div {...anim(0.9)} className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-10 md:mb-12">
          <InlineEditable section="hero" field="map_title" defaultValue={hero.map_title} tagName="p" className="font-serif text-2xl md:text-[1.75rem] text-[var(--ink)]" />
          <InlineEditable section="hero" field="map_badge" defaultValue={hero.map_badge} tagName="p" className="text-sm tracking-[0.08em] uppercase text-[var(--ink-muted)]" />
        </motion.div>
        <ProcessLine steps={steps} play={show} instant={isEditorMode} />
      </div>
    </section>
  );
}

function ProcessLine({ steps, play, instant }: { steps: ProcessStep[]; play: boolean; instant: boolean }) {
  const n = Math.max(steps.length, 1);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  // ERP is the core of the map — give its marker weight
  const isCore = (s: ProcessStep) => /^erp alan/i.test((s.title || "").replace(/<[^>]*>/g, "").trim());

  return (
    <motion.div
      ref={ref}
      className="relative"
      initial={instant ? false : "hidden"}
      animate={instant || (play && inView) ? "visible" : "hidden"}
    >
      {/* Horizontal line (desktop) */}
      <motion.div
        className="hidden md:block absolute left-0 right-0 top-[7px] h-px origin-left bg-[var(--rule-strong)]"
        variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 1.6, ease: [0.65, 0, 0.35, 1] } } }}
      />
      {/* Vertical line (mobile) */}
      <motion.div
        className="md:hidden absolute left-[7px] top-2 bottom-2 w-px origin-top bg-[var(--rule-strong)]"
        variants={{ hidden: { scaleY: 0 }, visible: { scaleY: 1, transition: { duration: 1.6, ease: [0.65, 0, 0.35, 1] } } }}
      />

      <ol
        className="relative grid grid-cols-1 gap-10 md:gap-8 md:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]"
        style={{ ["--cols" as string]: n } as React.CSSProperties}
      >
        {steps.map((step, i) => {
          const delay = 0.35 + (i / n) * 1.3;
          const core = isCore(step);
          return (
            <li key={step.step_number ?? i} className="relative pl-9 md:pl-0">
              <motion.span
                className={`absolute left-0 md:static block h-[15px] w-[15px] rounded-full border ${
                  core ? "bg-[var(--brand-navy)] border-[var(--brand-navy)]" : "bg-white border-[var(--brand-navy)]"
                }`}
                variants={{ hidden: { scale: 0 }, visible: { scale: 1, transition: { delay, type: "spring", stiffness: 300, damping: 20 } } }}
              />
              <motion.div
                className="md:pt-7 md:pr-6"
                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { delay: delay + 0.1, duration: 0.8, ease: EASE_OUT } } }}
              >
                <p className="text-[13px] text-[var(--ink-muted)] mb-2 tabular-nums">{String(step.step_number ?? i + 1).padStart(2, "0")}</p>
                <InlineEditable section="processSteps" field="title" index={i} defaultValue={step.title} tagName="h3" className="font-serif text-[1.5rem] leading-tight text-[var(--ink)] mb-3" />
                <InlineEditable section="processSteps" field="description" index={i} defaultValue={step.description} tagName="p" className="text-[15px] leading-relaxed text-[var(--ink-muted)]" />
              </motion.div>
            </li>
          );
        })}
      </ol>
    </motion.div>
  );
}
