"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { InViewMask, FadeIn } from "@/components/motion";
import { StepLine, BackToSolutions } from "@/components/ui/StepLine";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

// Sunum s.8 — olgunluk boyutları (Bennur Hanım'ın sıralamasıyla)
const DIMENSIONS = [
  { name: "İnsan", desc: "Yetkinlik, adaptasyon, öğrenme" },
  { name: "Yönetişim", desc: "Politika, risk, sahiplik" },
  { name: "İnovasyon", desc: "Fikir, portföy, kültür" },
  { name: "Teknoloji", desc: "Mimari, entegrasyon, güvenlik" },
  { name: "Müşteri", desc: "Deneyim, kanal, veri" },
  { name: "Operasyon", desc: "Süreç, verimlilik, kalite" },
];

// Illustrative profile only (0–5 scale) — labelled as an example on the chart
const CURRENT = [3, 2, 2.5, 3, 3.5, 2.5];
const TARGET = [4, 3.5, 3.5, 4.5, 4.5, 4];

const PORTFOLIO_FLOW = [
  { title: "Skor & boşluk analizi", desc: "Boyut bazlı seviye" },
  { title: "Fırsat haritası", desc: "Süreç / veri / teknoloji" },
  { title: "Öncelik matrisi", desc: "Etki • efor • risk", key: true },
  { title: "Yol haritası", desc: "0–3 / 3–6 / 6–12 ay" },
  { title: "Değer takibi", desc: "KPI ve aksiyon döngüsü" },
];

const PROJECT_GROUPS = [
  { title: "Hızlı kazanımlar", desc: "Rapor standardı, manuel iş azaltımı, temel otomasyon" },
  { title: "Mimari ihtiyaçlar", desc: "ERP kapsamı, entegrasyon, veri modeli, güvenlik" },
  { title: "Yapay zekâ fırsatları", desc: "Kullanım senaryosu seçimi, pilot, kullanıcı kabulü, yönetişim" },
];

const OUTPUTS = ["Mevcut durum fotoğrafı", "Boyut bazlı güçlü ve gelişim alanları", "Öncelikli proje önerileri", "0–12 ay dönüşüm adımları"];

// Sunum s.10 — 2.1
const FUNNEL = [
  { title: "Fikir havuzu", desc: "Departman görüşmeleri, manuel işler, raporlama boşlukları" },
  { title: "Değer filtresi", desc: "Hacim, tekrar, hata riski, veri erişimi, standartlaşma" },
  { title: "Öncelik skoru", desc: "İş değeri, uygulanabilirlik, KVKK/güvenlik, kullanıcı kabulü" },
  { title: "Backlog & pilot", desc: "RPA, dashboard, low-code/no-code, AI aracı, otomasyon akışı" },
];

const DECISION_STACK = [
  { title: "Veri kaynakları", desc: "ERP, üretim, planlama, finans, satış, stok, kalite" },
  { title: "KPI sözlüğü", desc: "Performans göstergelerinin ortak tanımı" },
  { title: "Dashboard", desc: "Yönetim ve operasyon ekranları" },
  { title: "Aksiyon takibi", desc: "Sorumluluk, termin ve kapanış döngüsü" },
  { title: "Tahminleme", desc: "İleri analitik ve öngörü modelleri" },
];

/* ---------- Radar chart ---------- */

const RC = 200; // centre
const RMAX = 140;
const angle = (i: number) => (-90 + i * (360 / DIMENSIONS.length)) * (Math.PI / 180);
const point = (i: number, v: number) => ({ x: RC + (RMAX * v / 5) * Math.cos(angle(i)), y: RC + (RMAX * v / 5) * Math.sin(angle(i)) });
const polygon = (values: number[]) => values.map((v, i) => { const p = point(i, v); return `${p.x.toFixed(1)},${p.y.toFixed(1)}`; }).join(" ");

function Radar({ active }: { active: number | null }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <figure className="w-full max-w-[460px] mx-auto">
      <svg ref={ref} viewBox="0 0 400 400" className="w-full h-auto overflow-visible" role="img" aria-label="Örnek dijital olgunluk profili: altı boyutta mevcut durum ve 12 aylık hedef">
        {/* Grid */}
        {[1, 2, 3, 4, 5].map((lvl) => (
          <polygon key={lvl} points={polygon(DIMENSIONS.map(() => lvl))} fill="none" stroke="var(--brand-navy)" strokeOpacity={lvl === 5 ? 0.22 : 0.08} />
        ))}
        {DIMENSIONS.map((_, i) => {
          const p = point(i, 5);
          return <line key={i} x1={RC} y1={RC} x2={p.x} y2={p.y} stroke={active === i ? "var(--brand-blue)" : "var(--brand-navy)"} strokeOpacity={active === i ? 0.9 : 0.12} strokeWidth={active === i ? 1.5 : 1} style={{ transition: "all .3s" }} />;
        })}

        {/* Target (dashed) */}
        <motion.polygon
          points={polygon(TARGET)}
          fill="none" stroke="var(--brand-blue)" strokeWidth={1.5} strokeDasharray="5 5"
          initial={{ opacity: 0, scale: 0.6 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.1, delay: 0.7, ease: EASE_OUT }}
          style={{ transformOrigin: `${RC}px ${RC}px` }}
        />
        {/* Current */}
        <motion.polygon
          points={polygon(CURRENT)}
          fill="var(--brand-navy)" fillOpacity={0.12} stroke="var(--brand-navy)" strokeWidth={1.8}
          initial={{ opacity: 0, scale: 0.2 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.1, delay: 0.2, ease: EASE_OUT }}
          style={{ transformOrigin: `${RC}px ${RC}px` }}
        />
        {CURRENT.map((v, i) => {
          const p = point(i, v);
          return (
            <motion.circle
              key={i} cx={p.x} cy={p.y} r={active === i ? 6 : 4}
              fill={active === i ? "var(--brand-blue)" : "#fff"} stroke="var(--brand-navy)" strokeWidth={1.5}
              initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}}
              transition={{ delay: 0.9 + i * 0.06, type: "spring", stiffness: 300, damping: 20 }}
              style={{ transformOrigin: `${p.x}px ${p.y}px`, transition: "r .3s, fill .3s" }}
            />
          );
        })}

        {/* Labels */}
        {DIMENSIONS.map((d, i) => {
          const p = point(i, 5.75);
          const cos = Math.cos(angle(i));
          const anchor = cos > 0.3 ? "start" : cos < -0.3 ? "end" : "middle";
          return (
            <text key={d.name} x={p.x} y={p.y} textAnchor={anchor} dominantBaseline="central"
              fontSize={15} fill={active === i ? "var(--brand-blue)" : "var(--brand-navy)"} style={{ transition: "fill .3s" }}>
              {d.name}
            </text>
          );
        })}
      </svg>
      <figcaption className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-1 text-[12.5px] text-[var(--ink-muted)]">
        <span className="inline-flex items-center gap-2"><span className="h-2.5 w-4 bg-[var(--brand-navy)]/20 border border-[var(--brand-navy)]" />Mevcut durum</span>
        <span className="inline-flex items-center gap-2"><span className="h-0 w-5 border-t-[1.5px] border-dashed border-[var(--brand-blue)]" />12 ay hedefi</span>
        <span className="italic">Örnek profil</span>
      </figcaption>
    </figure>
  );
}

/* ---------- Funnel (2.1) ---------- */

function Funnel() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref} className="space-y-3">
      {FUNNEL.map((f, i) => {
        const width = 100 - i * 11;
        return (
          <div key={f.title} className="grid grid-cols-12 items-center gap-4">
            <div className="col-span-12 sm:col-span-6">
              <motion.div
                className={`h-11 origin-left flex items-center px-4 whitespace-nowrap text-[13.5px] font-medium ${i === FUNNEL.length - 1 ? "bg-[var(--brand-navy)] text-white" : "bg-[var(--brand-navy)]/[0.08] text-[var(--ink)]"}`}
                style={{ width: `${width}%` }}
                initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.15 + i * 0.15, ease: EASE_OUT }}
              >
                <span className="tabular-nums mr-3 opacity-60">{String(i + 1).padStart(2, "0")}</span>
                {f.title}
              </motion.div>
            </div>
            <motion.p
              className="col-span-12 sm:col-span-6 text-[14px] leading-relaxed text-[var(--ink-muted)]"
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.15 }}
            >
              {f.desc}
            </motion.p>
          </div>
        );
      })}
    </div>
  );
}

/** Çözüm 2 (Dijital Olgunluk Değerlendirme) ve 2.1 — sunum s.8–10. */
export function MaturitySection() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="olgunluk" className="relative bg-white py-20 md:py-28">
      <div className="container">
        <BackToSolutions number="2" title="Dijital Olgunluk Değerlendirme" />
        <div className="max-w-3xl">
          <FadeIn className="mb-6">
            <p className="section-label">2 · Dijital Olgunluk Değerlendirme</p>
          </FadeIn>
          <InViewMask>
            <h2 className="section-title">
              Dönüşüm; <em className="text-[var(--brand-blue)]">olgunluk fotoğrafı</em> ve uygulanabilir bir proje portföyü üzerinden tasarlanır.
            </h2>
          </InViewMask>
        </div>

        {/* Dimensions + radar */}
        <div className="mt-14 md:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6">
            <FadeIn>
              <p className="text-[15.5px] leading-relaxed text-[var(--ink-body)] max-w-xl">
                İnsan, yönetişim, inovasyon, teknoloji, müşteri ve operasyon olgunluğu görünür hale gelir. Değerlendirme yalnızca seviye ölçmez; hangi projelerin önce başlatılacağını görünür kılar.
              </p>
            </FadeIn>
            <ul className="mt-8 border-t border-[var(--rule-strong)]" onMouseLeave={() => setActive(null)}>
              {DIMENSIONS.map((d, i) => (
                <motion.li
                  key={d.name}
                  onMouseEnter={() => setActive(i)}
                  initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease: EASE_OUT }}
                  className="flex items-baseline gap-5 border-b border-[var(--rule)] py-3.5 cursor-default"
                >
                  <span className={`w-6 shrink-0 text-[12px] tabular-nums transition-colors ${active === i ? "text-[var(--brand-blue)]" : "text-[var(--ink-muted)]"}`}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={`font-serif text-[1.1rem] w-32 shrink-0 transition-colors ${active === i ? "text-[var(--brand-blue)]" : "text-[var(--ink)]"}`}>{d.name}</span>
                  <span className="text-[14px] text-[var(--ink-muted)]">{d.desc}</span>
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6">
            <Radar active={active} />
          </div>
        </div>

        {/* Measurement → portfolio */}
        <div className="mt-20 md:mt-24">
          <FadeIn className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-10">
            <h3 className="font-serif text-xl md:text-[1.4rem] text-[var(--ink)]">Ölçümden proje portföyüne</h3>
            <p className="text-[12px] tracking-[0.1em] uppercase text-[var(--ink-muted)]">Değerlendirme rapor olarak kalmaz</p>
          </FadeIn>
          <StepLine steps={PORTFOLIO_FLOW} />
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-12 gap-x-12 gap-y-10">
          <FadeIn className="md:col-span-7">
            <h4 className="text-[13px] font-medium text-[var(--ink-muted)] mb-4">Örnek proje grupları</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8">
              {PROJECT_GROUPS.map((g) => (
                <div key={g.title} className="border-t border-[var(--rule-strong)] py-4">
                  <p className="font-serif text-[1.1rem] text-[var(--ink)]">{g.title}</p>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--ink-muted)]">{g.desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={0.1} className="md:col-span-5">
            <h4 className="text-[13px] font-medium text-[var(--ink-muted)] mb-4">Çıktılar</h4>
            <ul className="border-t border-[var(--rule-strong)]">
              {OUTPUTS.map((o, i) => (
                <li key={o} className="flex items-baseline gap-4 border-b border-[var(--rule)] py-3 text-[15px] text-[var(--ink)]">
                  <span className="w-6 shrink-0 text-[12px] tabular-nums text-[var(--ink-muted)]">{String(i + 1).padStart(2, "0")}</span>
                  {o}
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>

        {/* 2.1 */}
        <div id="firsatlar" className="mt-20 md:mt-28 border-t border-[var(--rule-strong)] pt-12 md:pt-14">
          <div className="max-w-3xl">
            <FadeIn className="mb-5">
              <p className="section-label">2.1 · Veri, AI ve Otomasyon Fırsatları</p>
            </FadeIn>
            <InViewMask>
              <h3 className="font-serif text-[1.7rem] md:text-[2rem] leading-tight text-[var(--ink)]">
                Fikirler çoktur; değer üreten fırsatlar <em className="text-[var(--brand-blue)]">süreç etkisi, veri hazırlığı</em> ve uygulanabilirlikle seçilir.
              </h3>
            </InViewMask>
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-7">
              <h4 className="text-[13px] font-medium text-[var(--ink-muted)] mb-5">Fikirden pilota</h4>
              <Funnel />
            </div>
            <FadeIn delay={0.1} className="lg:col-span-5">
              <h4 className="text-[13px] font-medium text-[var(--ink-muted)] mb-5">Veri ve karar destek mimarisi</h4>
              <ol className="border-t border-[var(--rule-strong)]">
                {DECISION_STACK.map((l, i) => (
                  <li key={l.title} className="flex gap-4 border-b border-[var(--rule)] py-3.5">
                    <span className="w-6 shrink-0 pt-0.5 text-[12px] tabular-nums text-[var(--brand-blue)]">{i + 1}</span>
                    <div>
                      <p className="font-serif text-[1.05rem] text-[var(--ink)]">{l.title}</p>
                      <p className="mt-0.5 text-[13.5px] text-[var(--ink-muted)]">{l.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
