"use client";

import { useEffect, useRef, useState } from "react";
import { AtalitixGraphicMap } from "@/components/ui";

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
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <section ref={sectionRef} className="relative pt-28 pb-16 grid-bg overflow-hidden">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left side - Text */}
          <div className={`${visible ? "animate-fade-in-left" : "opacity-0"}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-8">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]" style={{ animation: "pulse-dot 2s ease-in-out infinite" }} />
              <span className="text-sm font-medium text-slate-600">{hero.badge_text}</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-[3.5rem] lg:text-[4rem] font-extrabold leading-[1.05] tracking-tight text-slate-900 mb-8">
              {hero.title_line1}
              <br />
              {hero.title_line2}{" "}
              <span className="text-[var(--color-primary)]">{hero.title_highlight}</span>
              <br />
              {hero.title_line3}
              <br />
              {hero.title_line4}
            </h1>

            {/* Description */}
            <p className="text-base text-slate-500 leading-relaxed mb-4 max-w-lg">
              {hero.description}
            </p>
            <p className="text-base text-slate-500 leading-relaxed mb-8 max-w-lg">
              {hero.description2}
            </p>

            {/* Tagline */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-8 inline-block max-w-md">
              <p className="text-lg font-bold italic text-slate-800">{hero.tagline}</p>
              <p className="text-sm text-slate-400 mt-1">{hero.tagline_sub}</p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <a href="#cozumler" className="btn-primary">
                {hero.cta_primary_text}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a href="#deneyim" className="btn-outline">
                {hero.cta_secondary_text}
              </a>
            </div>
          </div>

          {/* Right side - Process Map */}
          <div className={`${visible ? "animate-fade-in-right delay-200" : "opacity-0"}`}>
            <AtalitixGraphicMap steps={processSteps} />
          </div>
        </div>
      </div>
    </section>
  );
}
