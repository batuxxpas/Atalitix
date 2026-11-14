"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { WordReveal } from "@/components/motion";

interface Step {
  title: string;
  description: string;
}

/**
 * Desktop "Yaklaşım": the section pins to the screen and the steps travel sideways
 * while the visitor keeps scrolling down. Big outlined numerals fill in as each step
 * reaches the centre; a rail at the bottom shows overall progress.
 */
export function ApproachHorizontal({ steps, label, title, desc }: { steps: Step[]; label: string; title: string; desc: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [active, setActive] = useState(0);
  const [started, setStarted] = useState(false);
  const n = steps.length;

  // How far the track must travel = its width beyond the visible area
  useEffect(() => {
    const measure = () => {
      if (!trackRef.current || !viewportRef.current) return;
      setDistance(Math.max(0, trackRef.current.scrollWidth - viewportRef.current.clientWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    if (viewportRef.current) ro.observe(viewportRef.current);
    return () => ro.disconnect();
  }, [n]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setActive(Math.min(n - 1, Math.max(0, Math.round(p * (n - 1)))));
    setStarted(p > 0.03);
  });

  return (
    <section
      ref={sectionRef}
      className="relative bg-[var(--brand-navy-900)] text-white"
      style={{ height: `calc(100vh + ${distance}px)` }}
      aria-label={label}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-20">
        <div className="container">
          {/* Heading */}
          <div className="grid grid-cols-12 gap-16 items-end">
            <div className="col-span-7">
              <p className="section-label !text-slate-400 mb-5">{label}</p>
              <WordReveal as="h2" className="section-title-light">{title}</WordReveal>
            </div>
            <p className="col-span-5 text-[15px] leading-relaxed text-slate-300/80">{desc}</p>
          </div>

          {/* Track */}
          <div ref={viewportRef} className="mt-14 xl:mt-16">
            <motion.div ref={trackRef} style={{ x }} className="flex w-max">
              {steps.map((s, i) => {
                const on = i === active;
                const done = i < active;
                return (
                  <article
                    key={i}
                    className="relative w-[clamp(360px,33vw,500px)] shrink-0 border-l border-white/10 pl-8 pr-12 first:border-l-0 first:pl-0"
                  >
                    <span
                      className="block font-serif text-[clamp(5.5rem,9vw,8.5rem)] leading-[0.85] tabular-nums transition-[color,-webkit-text-stroke-color] duration-700"
                      style={{
                        color: on ? "var(--brand-blue-400)" : "transparent",
                        WebkitTextStroke: `1px ${on ? "var(--brand-blue-400)" : done ? "rgba(111,157,255,.55)" : "rgba(255,255,255,.28)"}`,
                      }}
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className={`mt-6 font-serif text-[1.65rem] leading-tight transition-colors duration-500 ${on ? "text-white" : "text-white/55"}`}>
                      {s.title}
                    </h3>
                    <p className={`mt-3 max-w-sm text-[15px] leading-relaxed transition-colors duration-500 ${on ? "text-slate-300" : "text-slate-400/60"}`}>
                      {s.description}
                    </p>
                  </article>
                );
              })}
            </motion.div>
          </div>

          {/* Progress rail */}
          <div className="mt-14 xl:mt-16">
            <p className={`mb-4 text-[11px] tracking-[0.14em] uppercase text-slate-400 transition-opacity duration-500 ${started ? "opacity-0" : "opacity-100"}`} aria-hidden="true">
              Kaydırmaya devam edin →
            </p>
            <div className="relative h-px bg-white/15">
              <motion.div className="absolute inset-0 origin-left bg-[var(--brand-blue)]" style={{ scaleX: scrollYProgress }} />
            </div>
            <div className="mt-4 flex justify-between text-[12px] tabular-nums">
              {steps.map((s, i) => (
                <span key={i} className={`transition-colors duration-500 ${i <= active ? "text-white" : "text-slate-500"}`}>
                  {String(i + 1).padStart(2, "0")} · {s.title}
                </span>
              ))}
            </div>
          </div>
        </div>


      </div>
    </section>
  );
}
