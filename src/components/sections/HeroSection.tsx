"use client";

import { useRef } from "react";
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
}

interface HeroSectionProps {
  hero: HeroData;
  processSteps: ProcessStep[];
  processCategories: ProcessCategory[];
}

export function HeroSection({ hero, processSteps, processCategories }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { isEditorMode } = useEditor();

  // Stagger variants for the left column
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section ref={sectionRef} className="relative pt-28 pb-16 grid-bg overflow-hidden">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left side - Text */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-8">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]" style={{ animation: "pulse-dot 2s ease-in-out infinite" }} />
              <InlineEditable section="hero" field="badge_text" defaultValue={hero.badge_text} tagName="span" className="text-sm font-medium text-slate-600" />
            </motion.div>

            {/* Title */}
            <motion.h1 variants={itemVariants} className="text-5xl md:text-[3.5rem] lg:text-[4rem] font-extrabold leading-[1.05] tracking-tight text-slate-900 mb-8">
              <InlineEditable section="hero" field="title_line1" defaultValue={hero.title_line1} tagName="span" />
              <br />
              <InlineEditable section="hero" field="title_line2" defaultValue={hero.title_line2} tagName="span" />{" "}
              <InlineEditable section="hero" field="title_highlight" defaultValue={hero.title_highlight} tagName="span" className="text-[var(--color-primary)]" />
              <br />
              <InlineEditable section="hero" field="title_line3" defaultValue={hero.title_line3} tagName="span" />
              <br />
              <InlineEditable section="hero" field="title_line4" defaultValue={hero.title_line4} tagName="span" />
            </motion.h1>

            {/* Description */}
            <motion.div variants={itemVariants} className="mb-4 max-w-lg">
              <InlineEditable section="hero" field="description" defaultValue={hero.description} tagName="p" className="text-base text-slate-500 leading-relaxed" />
            </motion.div>
            <motion.div variants={itemVariants} className="mb-8 max-w-lg">
              <InlineEditable section="hero" field="description2" defaultValue={hero.description2} tagName="p" className="text-base text-slate-500 leading-relaxed" />
            </motion.div>

            {/* Tagline */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 mb-8 inline-flex flex-col max-w-md shadow-sm hover:shadow-md transition-shadow">
              <InlineEditable section="hero" field="tagline" defaultValue={hero.tagline} tagName="p" className="text-lg font-bold italic text-slate-800 w-full" />
              <InlineEditable section="hero" field="tagline_sub" defaultValue={hero.tagline_sub} tagName="p" className="text-sm text-slate-400 mt-1 w-full" />
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4">
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#cozumler" 
                onClick={(e) => isEditorMode && e.preventDefault()}
                className="btn-primary"
              >
                <InlineEditable section="hero" field="cta_primary_text" defaultValue={hero.cta_primary_text} tagName="span" />
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#deneyim" 
                onClick={(e) => isEditorMode && e.preventDefault()}
                className="btn-outline"
              >
                <InlineEditable section="hero" field="cta_secondary_text" defaultValue={hero.cta_secondary_text} tagName="span" />
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right side - Process Map */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <AtalitixGraphicMap steps={processSteps} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
