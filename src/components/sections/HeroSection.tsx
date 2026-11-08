"use client";

import { AtalitixGraphicMap } from "@/components/ui";
import { motion, Variants } from "framer-motion";
import { InlineEditable, useEditor } from "@/components/editor";

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
  experience_years?: string;
}

interface HeroSectionProps {
  hero: HeroData;
  processSteps: ProcessStep[];
  processCategories: ProcessCategory[];
}

export function HeroSection({ hero, processSteps }: HeroSectionProps) {
  const { isEditorMode } = useEditor();
  const years = parseInt(hero?.experience_years || "20") || 20;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
  };

  const highlights = [
    { value: `${years}+`, label: "Yıllık sektör ve BT deneyimi" },
    { value: "Uçtan uca", label: "Süreçten sisteme danışmanlık" },
    { value: "ERP + Non-ERP", label: "Bütünleşik çözüm mimarisi" },
    { value: "KPI odaklı", label: "Ölçülebilir iş değeri" },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Blueprint grid, fading out toward the bottom */}
      <div
        className="absolute inset-0 blueprint-bg pointer-events-none"
        style={{
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 0%, #000 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 0%, #000 40%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      <div className="container relative pt-12 md:pt-20 pb-16 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left — copy */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-6 flex flex-col"
          >
            <motion.div variants={itemVariants} className="mb-7">
              <span className="inline-flex items-center gap-2.5 rounded-md border border-slate-200 bg-white px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-sm bg-[var(--brand-blue)]" />
                <InlineEditable
                  section="hero"
                  field="badge_text"
                  defaultValue={hero.badge_text}
                  tagName="span"
                  className="font-mono text-[11px] font-medium tracking-wider uppercase text-slate-600"
                />
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-[2.6rem] sm:text-5xl lg:text-[3.6rem] font-bold leading-[1.05] tracking-[-0.03em] text-[var(--brand-navy)] mb-7"
            >
              <InlineEditable section="hero" field="title_line1" defaultValue={hero.title_line1} tagName="span" />
              <br />
              <InlineEditable section="hero" field="title_line2" defaultValue={hero.title_line2} tagName="span" />{" "}
              <InlineEditable section="hero" field="title_highlight" defaultValue={hero.title_highlight} tagName="span" className="text-[var(--brand-blue)]" />
              <InlineEditable section="hero" field="title_line3" defaultValue={hero.title_line3} tagName="span" />
              <br />
              <InlineEditable section="hero" field="title_line4" defaultValue={hero.title_line4} tagName="span" />
            </motion.h1>

            <motion.div variants={itemVariants} className="max-w-xl space-y-3 mb-8">
              <InlineEditable section="hero" field="description" defaultValue={hero.description} tagName="p" className="text-[17px] text-slate-600 leading-relaxed" />
              <InlineEditable section="hero" field="description2" defaultValue={hero.description2} tagName="p" className="text-[15px] text-slate-500 leading-relaxed" />
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 mb-10">
              <a href="#cozumler" onClick={(e) => isEditorMode && e.preventDefault()} className="btn-primary">
                <InlineEditable section="hero" field="cta_primary_text" defaultValue={hero.cta_primary_text} tagName="span" />
              </a>
              <a href="#deneyim" onClick={(e) => isEditorMode && e.preventDefault()} className="btn-outline">
                <InlineEditable section="hero" field="cta_secondary_text" defaultValue={hero.cta_secondary_text} tagName="span" />
              </a>
            </motion.div>

            <motion.div variants={itemVariants} className="border-l-2 border-[var(--brand-blue)] pl-4">
              <InlineEditable section="hero" field="tagline" defaultValue={hero.tagline} tagName="p" className="text-base font-semibold text-[var(--brand-navy)]" />
              <InlineEditable section="hero" field="tagline_sub" defaultValue={hero.tagline_sub} tagName="p" className="font-mono text-xs text-slate-400 mt-1" />
            </motion.div>
          </motion.div>

          {/* Right — architecture diagram */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="lg:col-span-6"
          >
            <AtalitixGraphicMap steps={processSteps} mapTitle={hero.map_title} mapBadge={hero.map_badge} />
          </motion.div>
        </div>

        {/* Highlights strip */}
        <motion.dl
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mt-16 md:mt-20 grid grid-cols-2 lg:grid-cols-4 rounded-xl border border-slate-200 bg-white overflow-hidden"
        >
          {highlights.map((h, i) => (
            <div
              key={h.label}
              className={`p-5 md:p-6 ${i % 2 === 1 ? "border-l" : ""} ${i >= 2 ? "border-t lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""} border-slate-200`}
            >
              <dt className="sr-only">{h.label}</dt>
              <dd className="text-xl md:text-2xl font-bold tracking-tight text-[var(--brand-navy)]">{h.value}</dd>
              <dd className="mt-1 text-[13px] text-slate-500">{h.label}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
