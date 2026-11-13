"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { InViewMask, FadeIn } from "@/components/motion";
import { StepLine, BackToSolutions } from "@/components/ui/StepLine";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

// Eğitim Kataloğu (ATAlitiX)
const CATALOG = [
  {
    title: "Endüstri 4.0'dan Yapay Zekâ Çağına",
    sub: "Dijital Dönüşüm ve Teknoloji Farkındalığı",
    duration: "1 gün",
    body: "Endüstri 4.0'dan günümüz yapay zekâ çağına teknolojik dönüşüm ele alınır. ERP, MES, IoT, RPA, Dijital İkiz, veri analitiği, yapay zekâ ve Agentic AI kavramları “nedir, ne değildir, hangi iş probleminde kullanılır?” yaklaşımıyla açıklanır. Türkiye ve dünyadan gerçek iyi uygulamalar ile başarısız/pahalı proje örnekleri üzerinden teknoloji yatırımlarının iş süreçlerine etkisi değerlendirilir.",
  },
  {
    title: "Önce Süreç, Sonra Araç",
    sub: "Süreç, ERP ve Kurumsal Sistem Mimarisi",
    duration: "6 saat",
    body: "Kurumsal dijitalleşmeye teknoloji seçimiyle değil, süreç analiziyle başlanması ele alınır. Süreç haritalama, darboğaz ve veri ihtiyaçlarının belirlenmesi; ERP'nin işletmedeki rolü; ERP–MES–WMS–CRM–BI–RPA ve IoT ilişkisi; master data, entegrasyon, kurumsal sistem mimarisi ve ERP seçiminde yapılan kritik hatalar uygulamalı örneklerle anlatılır.",
  },
  {
    title: "Dijital Dönüşüm Yol Haritası",
    sub: "Dijital Olgunluktan Proje Portföyüne",
    duration: "4 saat",
    body: "Kurumların dijital dönüşümde mevcut konumlarını objektif biçimde değerlendirmeleri ve doğru yatırımları önceliklendirmeleri hedeflenir. Müşteri, yönetişim, insan, operasyon, teknoloji ve inovasyon boyutlarında dijital olgunluk; benchmark, gap analizi, hızlı kazanım projeleri, proje önceliklendirme, iş değeri–uygulanabilirlik analizi ve dönüşüm yol haritası ele alınır.",
  },
  {
    title: "Yapay Zekâya Hazır Kurum",
    sub: "AI Use Case, Veri ve Değer Yönetimi",
    duration: "4 saat",
    body: "Kurumlarda yapay zekâ kullanımına başlamadan önce cevaplanması gereken temel sorular ele alınır: Veri yeterli ve tutarlı mı? İş problemi doğru tanımlandı mı? AI gerçekten gerekli mi? Kullanım senaryosu hangi değeri yaratacak? Proje sahibi ve ekip belli mi? İnsan onayı nerede olacak? Katılımcılar AI use-case seçimi, veri hazırlığı, maliyet–fayda, uygulanabilirlik ve AI readiness yaklaşımını öğrenir.",
  },
  {
    title: "Sorumlu ve Güvenilir Yapay Zekâ",
    sub: "Risk, Yönetişim ve İnsan Denetimi",
    duration: "2 / 4 saat",
    body: "Yapay zekânın kurumsal kullanımında ortaya çıkan veri güvenliği, gizlilik, önyargı, yanlış karar, açıklanabilirlik, fikri mülkiyet, sorumluluk ve otonomi riskleri ele alınır. Responsible AI, Trustworthy AI, AI Governance, AI Policy, risk sınıflandırması, human-in-the-loop / human-on-the-loop, audit trail ve kurumsal sorumluluk modelleri gerçek vakalar üzerinden incelenir.",
  },
  {
    title: "Agentic AI",
    sub: "Araçtan Otonom Aktöre",
    duration: "2 / 4 saat",
    body: "Geleneksel ve üretken yapay zekâdan; hedef alan, plan yapan, araç kullanan ve eyleme geçebilen AI ajanlarına geçiş anlatılır. AI Agent ve Agentic AI farkı; görev ayrıştırma, API ve araç kullanımı, çoklu ajan sistemleri, insan gözetimi, otonomi seviyeleri, sorumluluk zinciri ve kurumsal kullanım senaryoları değerlendirilir.",
  },
  {
    title: "Odoo ERP Demo Day",
    sub: "Bir İşletmenin Uçtan Uca Dijital Yolculuğu",
    duration: "3–4 saat",
    tag: "Uygulamalı",
    body: "ERP kavramı teorik anlatımdan çıkarılarak canlı Odoo ERP ortamında gösterilir. Örnek bir üretim işletmesinde müşteri talebinden başlayarak teklif, satış siparişi, satınalma, stok, MRP, üretim, iş merkezleri, kalite, bakım, sevkiyat, faturalama, maliyet ve dashboard süreçleri uçtan uca canlandırılır. Katılımcılar ERP sistemlerinin işletmede süreçleri ve veriyi nasıl bütünleştirdiğini doğrudan deneyimler.",
  },
];

const JOURNEY = [
  { title: "Teknolojiyi Anla" },
  { title: "Süreci Tasarla" },
  { title: "Olgunluğu Ölç" },
  { title: "Değer Üret" },
  { title: "Riski Yönet" },
  { title: "Yeni Nesil AI'a Hazırlan", key: true },
];

const FORMATS = ["Yönetici oturumu", "Departman atölyesi", "Uygulamalı çalışma", "Eğitim + çıktı paketi"];

function CatalogRow({ item, index, open, onToggle }: { item: (typeof CATALOG)[number]; index: number; open: boolean; onToggle: () => void }) {
  const id = `egitim-${index + 1}`;
  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: EASE_OUT }}
      className="border-b border-[var(--rule)]"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={id}
        className="group grid w-full grid-cols-12 items-baseline gap-x-4 gap-y-1 py-5 text-left"
      >
        <span className={`col-span-2 sm:col-span-1 text-[13px] tabular-nums transition-colors ${open ? "text-[var(--brand-blue)]" : "text-[var(--ink-muted)]"}`}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="col-span-10 sm:col-span-8">
          <span className={`font-serif text-[1.2rem] md:text-[1.3rem] leading-snug transition-colors ${open ? "text-[var(--brand-blue)]" : "text-[var(--ink)] group-hover:text-[var(--brand-blue)]"}`}>
            {item.title}
          </span>
          {item.tag && (
            <span className="ml-3 align-middle text-[11px] font-medium tracking-[0.06em] uppercase text-[var(--brand-navy-700)]">· {item.tag}</span>
          )}
          <span className="block mt-0.5 text-[14px] text-[var(--ink-muted)]">{item.sub}</span>
        </span>
        <span className="col-span-10 col-start-3 sm:col-span-3 sm:col-start-auto flex items-center justify-between sm:justify-end gap-6 text-[14px] text-[var(--ink-body)]">
          <span className="tabular-nums">{item.duration}</span>
          <span className={`relative h-3.5 w-3.5 shrink-0 transition-transform duration-300 ${open ? "rotate-45" : ""}`} aria-hidden="true">
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[var(--ink)]" />
            <span className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-[var(--ink)]" />
          </span>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <p className="pb-6 sm:pl-[8.33%] pr-4 max-w-3xl text-[15px] leading-relaxed text-[var(--ink-body)]">{item.body}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

/** Çözüm 3 — Dijital Eğitim ve Kullanıcı Adaptasyonu + Eğitim Kataloğu. */
export function EducationSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="egitim" className="relative bg-[var(--paper)] py-20 md:py-28">
      <div className="container">
        <BackToSolutions number="3" title="Dijital Eğitim ve Kullanıcı Adaptasyonu" />
        <div className="max-w-3xl">
          <FadeIn className="mb-6">
            <p className="section-label">3 · Dijital Eğitim ve Kullanıcı Adaptasyonu</p>
          </FadeIn>
          <InViewMask>
            <h2 className="section-title">
              Eğitim, dönüşümün ayrı bir aktivitesi değil; tasarlanan süreçlerin <em className="text-[var(--brand-blue)]">sürdürülebilir kullanım</em> desteğidir.
            </h2>
          </InViewMask>
          <FadeIn delay={0.1} className="mt-6">
            <p className="text-[15.5px] leading-relaxed text-[var(--ink-body)]">
              Eğitimlerimiz “Önce Süreç, Sonra Araç” prensibine dayanır. Kavramsal anlatımın ötesinde; gerçek sanayi ve otomotiv uygulamaları, Türkiye ve dünyadan iyi uygulama ve başarısız proje örnekleri, vaka çalışmaları ve katılımcıların kendi süreçlerine yönelik uygulamalarla ilerler.
            </p>
          </FadeIn>
        </div>

        {/* Journey */}
        <div className="mt-14 md:mt-16">
          <FadeIn className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-10">
            <h3 className="font-serif text-xl md:text-[1.4rem] text-[var(--ink)]">Gelişim yolculuğu</h3>
            <p className="text-[12px] tracking-[0.1em] uppercase text-[var(--ink-muted)]">Bağımsız veya bütünleşik program</p>
          </FadeIn>
          <StepLine steps={JOURNEY} surface="paper" />
        </div>

        {/* Catalog */}
        <div id="egitim-katalogu" className="mt-20 md:mt-24">
          <FadeIn className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-6">
            <h3 className="font-serif text-[1.6rem] md:text-[1.9rem] text-[var(--ink)]">Eğitim kataloğu</h3>
            <p className="text-[13px] text-[var(--ink-muted)]">Ayrıntı için eğitimin üzerine tıklayın</p>
          </FadeIn>
          <ul className="border-t border-[var(--rule-strong)]">
            {CATALOG.map((item, i) => (
              <CatalogRow key={item.title} item={item} index={i} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
            ))}
          </ul>
        </div>

        {/* Formats + trainer */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-12 gap-x-12 gap-y-10">
          <FadeIn className="md:col-span-7">
            <h4 className="text-[13px] font-medium text-[var(--ink-muted)] mb-4">Eğitim formatları</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6">
              {FORMATS.map((f) => (
                <p key={f} className="border-t border-[var(--rule-strong)] py-4 font-serif text-[1.05rem] text-[var(--ink)]">{f}</p>
              ))}
            </div>
            <p className="mt-4 text-[13.5px] leading-relaxed text-[var(--ink-muted)] max-w-xl">
              Odoo ERP Demo Day, kurumsal sistem ve süreç eğitimlerinin uygulamalı tamamlayıcısı olarak konumlandırılabilir.
            </p>
          </FadeIn>
          <FadeIn delay={0.1} className="md:col-span-5">
            <h4 className="text-[13px] font-medium text-[var(--ink-muted)] mb-4">Eğitmen</h4>
            <div className="border-t border-[var(--rule-strong)] pt-4">
              <p className="font-serif text-[1.25rem] text-[var(--ink)]">Bennur Güner Yılmaz</p>
              <p className="mt-1 text-[14px] text-[var(--ink-muted)]">ATAlitiX · Founder & Managing Partner</p>
              <p className="mt-0.5 text-[13px] tracking-[0.04em] text-[var(--ink-muted)]">ERP · AI · Digital Transformation</p>
              <a href="#iletisim" className="mt-5 inline-block text-[14px] text-[var(--brand-navy-700)] link-underline">Eğitim talebi için iletişim →</a>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
