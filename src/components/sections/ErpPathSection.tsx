"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { InViewMask, FadeIn } from "@/components/motion";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const DRAW = [0.65, 0, 0.35, 1] as const;

// Sunum s.7 — "Süreç tasarımından ERP kapsamına"
const FLOW = [
  { title: "Süreç haritası", desc: "Uçtan uca akış, rol ve veri" },
  { title: "ERP kapsamı", desc: "Modül, onay, entegrasyon" },
  { title: "Kavramsal tasarım", desc: "Hedef işleyiş ve süreç notları" },
  { title: "Alternatif değerlendirme", desc: "Odoo, SAP, Logo, Canias vb.", key: true },
  { title: "Proje planı", desc: "Kapsam, faz, kaynak ve risk" },
];

const OUTPUTS = [
  "ERP kapsam dokümanı",
  "Modül ve entegrasyon matrisi",
  "Kavramsal süreç tasarımı",
  "Fazlandırılmış proje planı",
];

const ODOO_APPS = [
  "Muhasebe & Finans",
  "Satış & CRM",
  "Satınalma",
  "Envanter & Depo",
  "Üretim (MRP)",
  "Kalite & Bakım",
  "Proje & Hizmet",
  "İnsan Kaynakları",
];

/** Thin seal with a check — drawn on view. Generic mark, not a vendor logo. */
function Seal({ play }: { play: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className="h-12 w-12 shrink-0" aria-hidden="true">
      <motion.circle
        cx="32" cy="32" r="29" fill="none" stroke="var(--brand-navy)" strokeWidth="1.2"
        initial={{ pathLength: 0 }} animate={{ pathLength: play ? 1 : 0 }}
        transition={{ duration: 1.2, ease: DRAW }}
        style={{ rotate: -90, transformOrigin: "32px 32px" }}
      />
      <motion.circle
        cx="32" cy="32" r="23" fill="none" stroke="var(--brand-blue)" strokeWidth="1" strokeDasharray="2 3"
        initial={{ opacity: 0 }} animate={{ opacity: play ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      />
      <motion.path
        d="M22 33 l7 7 l14 -16" fill="none" stroke="var(--brand-blue)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: play ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.9, ease: DRAW }}
      />
    </svg>
  );
}

function Flow() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const n = FLOW.length;

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

      <ol className="relative grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-6">
        {FLOW.map((s, i) => {
          const delay = 0.3 + (i / n) * 1.3;
          return (
            <li key={s.title} className="relative pl-9 lg:pl-0">
              <motion.span
                className={`absolute left-0 lg:static block h-[15px] w-[15px] rounded-full border border-[var(--brand-navy)] ${s.key ? "bg-[var(--brand-navy)]" : "bg-white"}`}
                initial={{ scale: 0 }} animate={{ scale: inView ? 1 : 0 }}
                transition={{ delay, type: "spring", stiffness: 300, damping: 20 }}
              />
              <motion.div
                className="lg:pt-6 lg:pr-4"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 10 }}
                transition={{ delay: delay + 0.1, duration: 0.7, ease: EASE_OUT }}
              >
                <p className="text-[12px] tabular-nums text-[var(--ink-muted)] mb-1.5">{String(i + 1).padStart(2, "0")}</p>
                <h4 className="font-serif text-[1.15rem] leading-tight text-[var(--ink)] mb-1.5">{s.title}</h4>
                <p className={`text-[13.5px] leading-relaxed ${s.key ? "text-[var(--brand-navy-700)] font-medium" : "text-[var(--ink-muted)]"}`}>{s.desc}</p>
              </motion.div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** Çözüm 1.1 (ERP kapsamı) ve 1.2 (Odoo) — sunum s.7 temel alınmıştır. */
export function ErpPathSection() {
  const sealRef = useRef<HTMLDivElement>(null);
  const sealInView = useInView(sealRef, { once: true, margin: "-60px" });

  return (
    <section id="erp" className="relative bg-[var(--paper)] py-20 md:py-28">
      <div className="container">
        {/* 1.1 — header */}
        <div className="max-w-3xl">
          <FadeIn className="mb-6">
            <p className="section-label">1.1 · ERP Kapsamı ve Kavramsal Tasarım</p>
          </FadeIn>
          <InViewMask>
            <h2 className="section-title">
              ERP kararı, ürün listesinden önce <em className="text-[var(--brand-blue)]">süreç mimarisi</em> ve operasyon hedefleri üzerinden verilir.
            </h2>
          </InViewMask>
        </div>

        {/* 1.1 — flow */}
        <div className="mt-14 md:mt-16">
          <FadeIn className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-10">
            <h3 className="font-serif text-xl md:text-[1.4rem] text-[var(--ink)]">Süreç tasarımından ERP kapsamına</h3>
            <p className="text-[12px] tracking-[0.1em] uppercase text-[var(--ink-muted)]">Doğru ERP yolu</p>
          </FadeIn>
          <Flow />
        </div>

        {/* 1.1 — principle + outputs */}
        <div className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-10">
          <FadeIn className="border-t border-[var(--rule-strong)] pt-6">
            <h4 className="font-serif text-[1.3rem] text-[var(--ink)] mb-3">Ürün değil, doğru ERP yolu</h4>
            <p className="text-[15px] leading-relaxed text-[var(--ink-body)]">
              Odoo ve diğer ERP alternatifleri; süreç uyumu, bütçe, entegrasyon, kullanıcı profili ve ölçeklenebilirlik üzerinden değerlendirilir. Amaç tek bir ürünü satmak değil, doğru ERP yolunu tasarlamaktır.
            </p>
          </FadeIn>
          <FadeIn delay={0.1} className="border-t border-[var(--rule-strong)] pt-6">
            <h4 className="font-serif text-[1.3rem] text-[var(--ink)] mb-3">Somut çıktı</h4>
            <ul>
              {OUTPUTS.map((o, i) => (
                <li key={o} className="flex items-baseline gap-4 border-b border-[var(--rule)] py-3 text-[15px] text-[var(--ink)]">
                  <span className="w-6 shrink-0 text-[12px] tabular-nums text-[var(--ink-muted)]">{String(i + 1).padStart(2, "0")}</span>
                  {o}
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>

        {/* 1.2 — Odoo */}
        <div id="odoo" className="mt-20 md:mt-28 border-t border-[var(--rule-strong)] pt-12 md:pt-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          <div className="lg:col-span-5">
            <FadeIn className="mb-5">
              <p className="section-label">1.2 · Odoo</p>
            </FadeIn>
            <InViewMask>
              <h3 className="font-serif text-[1.7rem] md:text-[2rem] leading-tight text-[var(--ink)]">
                Odoo doğru yol olduğunda, <em className="text-[var(--brand-blue)]">sertifikalı</em> ekiple uygulama.
              </h3>
            </InViewMask>
            <FadeIn delay={0.1} className="mt-5">
              <p className="text-[15px] leading-relaxed text-[var(--ink-body)]">
                Kapsam çalışması Odoo&apos;yu işaret ettiğinde; kurulum, uyarlama, veri aktarımı, kullanıcı eğitimi ve canlıya geçişi sertifikalı ekibimizle yürütürüz.
              </p>
            </FadeIn>
            <FadeIn delay={0.15} className="mt-8">
              <div ref={sealRef} className="flex items-center gap-4">
                <Seal play={sealInView} />
                <p className="font-serif text-[1.1rem] text-[var(--ink)]">Odoo sertifikalı danışmanlık</p>
              </div>
            </FadeIn>
          </div>

          <div className="lg:col-span-7">
            <FadeIn>
              <h4 className="text-[13px] font-medium text-[var(--ink-muted)] mb-4">Uyguladığımız Odoo uygulamaları</h4>
            </FadeIn>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
              {ODOO_APPS.map((a, i) => (
                <motion.li
                  key={a}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.55, delay: (i % 4) * 0.06, ease: EASE_OUT }}
                  className="group border-t border-[var(--rule-strong)] py-4 font-serif text-[1.08rem] text-[var(--ink)] transition-colors hover:text-[var(--brand-blue)]"
                >
                  {a}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA */}
        <FadeIn className="mt-14 md:mt-20 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 border-t border-[var(--rule-strong)] pt-10">
          <p className="font-serif text-[1.25rem] md:text-[1.45rem] leading-snug text-[var(--ink)] max-w-2xl">
            Hangi ERP&apos;nin size uygun olduğunu süreçlerinizden başlayarak birlikte değerlendirelim.
          </p>
          <a href="#iletisim" className="btn-primary shrink-0 self-start lg:self-auto">
            ERP görüşmesi planla
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M5 12h14M13 6l6 6-6 6" /></svg>
          </a>
        </FadeIn>

        <p className="mt-10 text-[12px] text-[var(--ink-muted)]/80">Odoo, SAP, Logo ve Canias ilgili sahiplerinin tescilli markalarıdır.</p>
      </div>
    </section>
  );
}
