"use client";

import { useRef } from "react";
import { motion, Variants, useInView, useScroll, useTransform } from "framer-motion";
import { InlineEditable, useEditor } from "@/components/editor";
import { useIntroReady, MaskLine } from "@/components/motion";
import { ErpVisual } from "@/components/three/ErpVisual";

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

  // Gentle depth: copy and map drift at different speeds as the hero scrolls away
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const copyY = useTransform(heroP, [0, 1], [0, -40]);

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

  // Split the motto at its first comma into two headline lines
  const mottoText = (hero.tagline || "Veriden zekâya, süreçten değere.").replace(/<[^>]*>/g, "").trim();
  const cut = mottoText.indexOf(",");
  const motto = cut > -1
    ? { first: mottoText.slice(0, cut + 1), second: mottoText.slice(cut + 1).trim() }
    : { first: mottoText, second: "" };

  return (
    <section className="relative bg-white">
      <div ref={heroRef} className="container pt-12 md:pt-16 lg:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left — copy */}
          <motion.div className="lg:col-span-6" style={isEditorMode ? undefined : { y: copyY }}>
            <motion.div {...anim(0.05)} className="mb-8">
              <span className="section-label">
                <InlineEditable section="hero" field="badge_text" defaultValue={hero.badge_text} tagName="span" />
              </span>
            </motion.div>

            {/* Brand motto is the headline: "Veriden zekâya, süreçten değere." */}
            <h1 className="display text-[2.7rem] sm:text-[3.4rem] lg:text-[4.1rem]">
              {isEditorMode ? (
                <InlineEditable section="hero" field="tagline" defaultValue={hero.tagline} tagName="span" />
              ) : (
                <>
                  <MaskLine show={show} delay={0.1}>{motto.first}</MaskLine>
                  {motto.second && (
                    <MaskLine show={show} delay={0.22}>
                      <em className="text-[var(--brand-blue)]">{motto.second}</em>
                    </MaskLine>
                  )}
                </>
              )}
            </h1>
            <motion.div {...anim(0.4)}>
              <InlineEditable section="hero" field="tagline_sub" defaultValue={hero.tagline_sub} tagName="p" className="mt-4 font-serif italic text-[1.15rem] md:text-[1.3rem] text-[var(--ink-muted)]" />
            </motion.div>

            <motion.div
              className="mt-8 mb-8 h-px max-w-md origin-left bg-[var(--rule)]"
              initial={isEditorMode ? false : { scaleX: 0 }}
              animate={show ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1.2, delay: 0.45, ease: [0.65, 0, 0.35, 1] }}
            />

            {/* Statement: what we do */}
            <motion.p {...anim(0.5)} className="font-serif text-[1.35rem] md:text-[1.55rem] leading-snug text-[var(--ink)] max-w-xl">
              <InlineEditable section="hero" field="title_line1" defaultValue={hero.title_line1} tagName="span" />{" "}
              <InlineEditable section="hero" field="title_line2" defaultValue={hero.title_line2} tagName="span" />
              <InlineEditable section="hero" field="title_highlight" defaultValue={hero.title_highlight} tagName="span" />
              <InlineEditable section="hero" field="title_line3" defaultValue={hero.title_line3} tagName="span" />
              <InlineEditable section="hero" field="title_line4" defaultValue={hero.title_line4} tagName="span" />
            </motion.p>

            <motion.div {...anim(0.6)} className="mt-5 max-w-xl">
              <InlineEditable section="hero" field="description" defaultValue={hero.description} tagName="p" className="text-[15.5px] leading-relaxed text-[var(--ink-body)]" />
            </motion.div>

            <motion.div {...anim(0.7)} className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a href="#cozumler" onClick={(e) => isEditorMode && e.preventDefault()} className="btn-primary">
                <InlineEditable section="hero" field="cta_primary_text" defaultValue={hero.cta_primary_text} tagName="span" />
              </a>
              <a href="#deneyim" onClick={(e) => isEditorMode && e.preventDefault()} className="btn-outline">
                <InlineEditable section="hero" field="cta_secondary_text" defaultValue={hero.cta_secondary_text} tagName="span" />
              </a>
            </motion.div>
          </motion.div>

          {/* Right — ERP module map */}
          <motion.div
            className="lg:col-span-6"
            initial={isEditorMode ? false : { opacity: 0 }}
            animate={show ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <ErpVisual play={show} />
          </motion.div>
        </div>
      </div>

      {/* Process line — the operating map, drawn as a single line */}
      <div className="container pt-20 md:pt-24 pb-20 md:pb-24">
        <motion.div {...anim(0.9)} className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-10 md:mb-12">
          <InlineEditable section="hero" field="map_title" defaultValue={hero.map_title} tagName="p" className="font-serif text-xl md:text-[1.4rem] text-[var(--ink)]" />
          <InlineEditable section="hero" field="map_badge" defaultValue={hero.map_badge} tagName="p" className="text-[12px] tracking-[0.1em] uppercase text-[var(--ink-muted)]" />
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
      {/* Travelling pulse once the line is drawn */}
      {!instant && play && inView && (
        <span className="process-pulse hidden md:block absolute top-[4px] left-0 h-[7px] w-[7px] rounded-full bg-[var(--brand-blue)]" aria-hidden="true" />
      )}
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
                <InlineEditable section="processSteps" field="title" index={i} defaultValue={step.title} tagName="h3" className="font-serif text-[1.2rem] leading-tight text-[var(--ink)] mb-2" />
                <InlineEditable section="processSteps" field="description" index={i} defaultValue={step.description} tagName="p" className="text-[14px] leading-relaxed text-[var(--ink-muted)]" />
              </motion.div>
            </li>
          );
        })}
      </ol>
    </motion.div>
  );
}
