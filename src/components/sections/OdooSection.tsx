"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { InViewMask, FadeIn } from "@/components/motion";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const DRAW = [0.65, 0, 0.35, 1] as const;

const APPS = [
  { name: "Muhasebe & Finans", desc: "Hesap planı, faturalama, banka mutabakatı ve finansal raporlar" },
  { name: "Satış & CRM", desc: "Fırsat, teklif ve sipariş yönetimi tek akışta" },
  { name: "Satınalma", desc: "Talep, teklif karşılaştırma ve tedarikçi yönetimi" },
  { name: "Envanter & Depo", desc: "Çoklu depo, lot/seri takibi ve rota kurguları" },
  { name: "Üretim (MRP)", desc: "Ürün ağacı, iş emirleri ve kapasite planlama" },
  { name: "Kalite & Bakım", desc: "Kontrol noktaları ve ekipman bakım süreçleri" },
  { name: "Proje & Hizmet", desc: "Görev, zaman çizelgesi ve saha hizmeti takibi" },
  { name: "İnsan Kaynakları", desc: "Personel, izin ve masraf süreçleri" },
];

const PHASES = [
  { title: "Analiz", desc: "Mevcut süreçler, hedefler ve Odoo uyum (fit-gap) analizi." },
  { title: "Kurgu", desc: "Süreçlerin Odoo üzerinde tasarımı, kapsam ve proje planı." },
  { title: "Yapılandırma", desc: "Modül ayarları; gerekiyorsa özel modül geliştirme." },
  { title: "Veri & Test", desc: "Ana veri aktarımı ve kullanıcı kabul testleri." },
  { title: "Canlıya Geçiş", desc: "Kullanıcı eğitimleri ve kontrollü geçiş planı." },
  { title: "İyileştirme", desc: "Yeni ihtiyaçlar, raporlama ve versiyon yükseltmeleri." },
];

const REASONS = [
  { title: "Önce süreç, sonra modül", desc: "Odoo'yu ekranlardan değil, iş akışınızdan başlayarak kurgularız; gereksiz uyarlamadan kaçınırız." },
  { title: "Sahayı bilen ekip", desc: "Üretim, otomotiv ve planlama geçmişimiz sayesinde operasyonun gerçek ihtiyacını konuşuruz." },
  { title: "Standart dışı ihtiyaca doğru çözüm", desc: "Odoo'ya sığmayan işleri entegrasyon, otomasyon veya özel geliştirmeyle doğru katmanda çözeriz." },
];

/** Thin seal with a check — drawn on view. Generic mark, not a vendor logo. */
function Seal({ play }: { play: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className="h-14 w-14 shrink-0" aria-hidden="true">
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

function Roadmap() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const n = PHASES.length;

  return (
    <div ref={ref} className="relative">
      {/* Line (desktop horizontal / mobile vertical) */}
      <motion.div
        className="hidden lg:block absolute left-0 right-0 top-[7px] h-px origin-left bg-[var(--rule-strong)]"
        initial={{ scaleX: 0 }} animate={{ scaleX: inView ? 1 : 0 }}
        transition={{ duration: 1.8, ease: DRAW }}
      />
      <motion.div
        className="lg:hidden absolute left-[7px] top-2 bottom-2 w-px origin-top bg-[var(--rule-strong)]"
        initial={{ scaleY: 0 }} animate={{ scaleY: inView ? 1 : 0 }}
        transition={{ duration: 1.8, ease: DRAW }}
      />
      {inView && <span className="process-pulse hidden lg:block absolute top-[4px] left-0 h-[7px] w-[7px] rounded-full bg-[var(--brand-blue)]" aria-hidden="true" />}

      <ol className="relative grid grid-cols-1 gap-8 lg:grid-cols-6 lg:gap-6">
        {PHASES.map((p, i) => {
          const delay = 0.3 + (i / n) * 1.5;
          const live = i === 4; // go-live gets the filled marker
          return (
            <li key={p.title} className="relative pl-9 lg:pl-0">
              <motion.span
                className={`absolute left-0 lg:static block h-[15px] w-[15px] rounded-full border border-[var(--brand-navy)] ${live ? "bg-[var(--brand-navy)]" : "bg-[var(--paper)]"}`}
                initial={{ scale: 0 }} animate={{ scale: inView ? 1 : 0 }}
                transition={{ delay, type: "spring", stiffness: 300, damping: 20 }}
              />
              <motion.div
                className="lg:pt-6 lg:pr-3"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 10 }}
                transition={{ delay: delay + 0.1, duration: 0.7, ease: EASE_OUT }}
              >
                <p className="text-[12px] tabular-nums text-[var(--ink-muted)] mb-1.5">{String(i + 1).padStart(2, "0")}</p>
                <h4 className="font-serif text-[1.15rem] leading-tight text-[var(--ink)] mb-1.5">{p.title}</h4>
                <p className="text-[13.5px] leading-relaxed text-[var(--ink-muted)]">{p.desc}</p>
              </motion.div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function OdooSection() {
  const sealRef = useRef<HTMLDivElement>(null);
  const sealInView = useInView(sealRef, { once: true, margin: "-60px" });

  return (
    <section id="odoo" className="relative bg-[var(--paper)] py-20 md:py-28">
      <div className="container">
        {/* Intro + certification */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-end">
          <div className="lg:col-span-7">
            <FadeIn className="mb-6">
              <p className="section-label">ERP alternatifleri · Odoo</p>
            </FadeIn>
            <InViewMask>
              <h2 className="section-title">
                Kurumsal ERP&apos;lerin yanında, ölçeğinize uygun bir <em className="text-[var(--brand-blue)]">alternatif</em>: Odoo.
              </h2>
            </InViewMask>
            <FadeIn delay={0.1} className="mt-6">
              <p className="text-[15.5px] leading-relaxed text-[var(--ink-body)] max-w-xl">
                SAP gibi kurumsal ERP projelerinde süreç kurgusu ve proje yönetimi desteği verirken, ihtiyaca ve ölçeğe göre Odoo&apos;yu da güçlü bir seçenek olarak değerlendiririz. Odoo tercih edildiğinde analizden canlıya geçişe kadar projeyi sertifikalı ekibimizle yürütürüz.
              </p>
            </FadeIn>
          </div>

          <FadeIn delay={0.15} className="lg:col-span-5">
            <div ref={sealRef} className="flex items-start gap-5 border-t border-[var(--rule-strong)] pt-6">
              <Seal play={sealInView} />
              <div>
                <p className="font-serif text-[1.25rem] text-[var(--ink)] leading-tight">Odoo sertifikalı danışmanlık</p>
                <p className="mt-2 text-[14px] leading-relaxed text-[var(--ink-muted)]">
                  Kurulum, uyarlama, veri aktarımı ve özel modül geliştirmeyi sertifikalı ekibimizle yürütürüz.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Apps */}
        <div className="mt-16 md:mt-20">
          <FadeIn>
            <h3 className="text-[13px] font-medium text-[var(--ink-muted)] mb-6">Uyguladığımız Odoo uygulamaları</h3>
          </FadeIn>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8">
            {APPS.map((a, i) => (
              <motion.li
                key={a.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: (i % 4) * 0.07, ease: EASE_OUT }}
                className="group border-t border-[var(--rule-strong)] py-5"
              >
                <p className="font-serif text-[1.1rem] text-[var(--ink)] transition-colors group-hover:text-[var(--brand-blue)]">{a.name}</p>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--ink-muted)]">{a.desc}</p>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Roadmap */}
        <div className="mt-16 md:mt-24">
          <FadeIn className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-10">
            <h3 className="font-serif text-xl md:text-[1.4rem] text-[var(--ink)]">Odoo proje yol haritası</h3>
            <p className="text-[12px] tracking-[0.1em] uppercase text-[var(--ink-muted)]">Analizden canlıya</p>
          </FadeIn>
          <Roadmap />
        </div>

        {/* Why */}
        <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-x-10">
          {REASONS.map((r, i) => (
            <FadeIn key={r.title} delay={i * 0.1} className="border-t border-[var(--rule-strong)] py-6">
              <h4 className="font-serif text-[1.2rem] text-[var(--ink)] mb-2">{r.title}</h4>
              <p className="text-[14px] leading-relaxed text-[var(--ink-muted)]">{r.desc}</p>
            </FadeIn>
          ))}
        </div>

        {/* CTA */}
        <FadeIn className="mt-14 md:mt-20 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 border-t border-[var(--rule-strong)] pt-10">
          <p className="font-serif text-[1.3rem] md:text-[1.55rem] leading-snug text-[var(--ink)] max-w-2xl">
            Hangi ERP&apos;nin size uygun olduğunu birlikte değerlendirelim; Odoo doğru seçimse kapsamı birlikte netleştirelim.
          </p>
          <a href="#iletisim" className="btn-primary shrink-0 self-start lg:self-auto">
            ERP görüşmesi planla
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M5 12h14M13 6l6 6-6 6" /></svg>
          </a>
        </FadeIn>

        <p className="mt-10 text-[12px] text-[var(--ink-muted)]/80">Odoo, Odoo S.A.&apos;nın tescilli markasıdır.</p>
      </div>
    </section>
  );
}
