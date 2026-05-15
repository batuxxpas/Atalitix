"use client";

import { useEffect, useRef, useState } from "react";

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
  const [visible, setVisible] = useState(false);
  const [expVisible, setExpVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const expRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setExpVisible(true); },
      { threshold: 0.15 }
    );
    if (expRef.current) obs.observe(expRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="section-dark">
      <section ref={sectionRef} id="yaklasim" className="py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className={visible ? "animate-fade-in-left" : "opacity-0"}>
              <p className="section-label text-indigo-400 mb-4">YAKLAŞIM</p>
              <h2 className="section-title-light mb-6">Dijital dönüşüm yolculuğu, önce süreç tasarımıdır.</h2>
              <p className="text-slate-400 leading-relaxed">
                ERP, AI, RPA veya low-code araçları ancak doğru süreç mimarisiyle değer üretir. Bu yüzden çalışmaya araçtan değil; iş akışı, rol, veri, karar noktası ve ölçülebilir faydadan başlarız.
              </p>
            </div>
            <div className="space-y-3">
              {approachSteps.map((step, idx) => (
                <div key={step.step_number} className={`card-dark flex items-start gap-5 ${visible ? "animate-fade-in-right" : "opacity-0"}`} style={{ animationDelay: `${0.2 + idx * 0.12}s` }}>
                  <div className="step-circle-light">{step.step_number}</div>
                  <div>
                    <h4 className="text-base font-bold text-white mb-1">{step.title}</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div ref={expRef} />
      <section id="deneyim" className="py-24 border-t border-slate-800">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className={expVisible ? "animate-fade-in-left" : "opacity-0"}>
              <div className="text-7xl md:text-8xl font-black text-white mb-4 leading-none">20+</div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-6">Yıllık üretim, otomotiv, planlama ve bilgi teknolojileri deneyimi.</h2>
              <p className="text-slate-400 leading-relaxed">Atalitix&apos;in uzmanlığı; üretim sahası, otomotiv operasyonları, planlama disiplini ve bilgi teknolojileri geçmişinin birleşiminden gelir.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {experienceItems.map((item, idx) => (
                <div key={item.step_number} className={`card-dark ${expVisible ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: `${0.2 + idx * 0.1}s` }}>
                  <div className="step-circle mb-4">{String(item.step_number).padStart(2, "0")}</div>
                  <p className="text-sm font-semibold text-white leading-relaxed">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
