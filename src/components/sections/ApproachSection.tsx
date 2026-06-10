"use client";

import { useRef, useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";

function AnimatedCounter({ from, to }: { from: number; to: number }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.1, rootMargin: "-100px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    const node = nodeRef.current;
    if (!started || !node) return;

    const duration = 2500; // ms
    const startTime = performance.now();

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    let rafId: number;
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = from + (to - from) * easeOut(progress);
      node.textContent = Math.round(current).toString();

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [started, from, to]);

  return <span ref={nodeRef}>{from}</span>;
}

interface ApproachStep {
  step_number: number;
  title: string;
  description: string;
}

interface ExperienceItem {
  step_number: number;
  title: string;
}

interface ApproachSectionProps {
  approachSteps: ApproachStep[];
  experienceItems: ExperienceItem[];
}

export function ApproachSection({ approachSteps, experienceItems }: ApproachSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const expRef = useRef<HTMLDivElement>(null);

  const staggerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const slideRightVariants: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const slideLeftVariants: Variants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="section-dark">
      <section ref={sectionRef} id="yaklasim" className="py-24 overflow-hidden">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={slideRightVariants}
            >
              <p className="section-label text-indigo-400 mb-4">YAKLAŞIM</p>
              <h2 className="section-title-light mb-6">Dijital dönüşüm yolculuğu, önce süreç tasarımıdır.</h2>
              <p className="text-slate-400 leading-relaxed">
                ERP, AI, RPA veya low-code araçları ancak doğru süreç mimarisiyle değer üretir. Bu yüzden çalışmaya araçtan değil; iş akışı, rol, veri, karar noktası ve ölçülebilir faydadan başlarız.
              </p>
            </motion.div>
            
            <motion.div 
              variants={staggerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-3"
            >
              {approachSteps.map((step) => (
                <motion.div 
                  key={step.step_number} 
                  variants={slideLeftVariants}
                  className="card-dark flex items-start gap-5"
                >
                  <div className="step-circle-light">{step.step_number}</div>
                  <div>
                    <h4 className="text-base font-bold text-white mb-1">{step.title}</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <div ref={expRef} />
      <section id="deneyim" className="py-24 border-t border-slate-800 overflow-hidden">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={slideRightVariants}
            >
              <div className="text-7xl md:text-8xl font-black text-white mb-4 leading-none flex items-center">
                <AnimatedCounter from={0} to={20} />
                <motion.span 
                  initial={{ opacity: 0, scale: 0 }} 
                  whileInView={{ opacity: 1, scale: 1 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: 2.5, type: "spring" }}
                  className="text-[var(--color-primary)] ml-1"
                >
                  +
                </motion.span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-6">Yıllık üretim, otomotiv, planlama ve bilgi teknolojileri deneyimi.</h2>
              <p className="text-slate-400 leading-relaxed">Atalitix&apos;in uzmanlığı; üretim sahası, otomotiv operasyonları, planlama disiplini ve bilgi teknolojileri geçmişinin birleşiminden gelir.</p>
            </motion.div>
            
            <motion.div 
              variants={staggerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {experienceItems.map((item) => (
                <motion.div 
                  key={item.step_number} 
                  variants={fadeUpVariants}
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(30, 41, 59, 0.8)", transition: { duration: 0.2 } }}
                  className="card-dark"
                >
                  <div className="step-circle mb-4">{String(item.step_number).padStart(2, "0")}</div>
                  <p className="text-sm font-semibold text-white leading-relaxed">{item.title}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
