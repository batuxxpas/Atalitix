"use client";

import { motion } from "framer-motion";
import { InViewMask, FadeIn } from "@/components/motion";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const COLUMNS = [
  {
    heading: "ERP içinde",
    sub: "Standart, kurumsal ve denetlenebilir süreçler",
    items: [
      "Finans ve muhasebe",
      "Satınalma ve tedarik",
      "Stok ve depo yönetimi",
      "Üretim planlama ve maliyet",
      "Satış ve dağıtım",
      "İnsan kaynakları",
    ],
  },
  {
    heading: "ERP dışında",
    sub: "Esnek, hızlı ve şirkete özel çözümler",
    items: [
      "Saha ve mobil veri toplama",
      "Onay ve iş akışları",
      "Sistemler arası entegrasyon",
      "Yönetim raporları ve KPI panelleri",
      "Rutin işlerin otomasyonu",
      "Şirkete özel uygulamalar",
    ],
  },
];

/** Where each need belongs: the line Atalitix draws for every client. */
export function ErpScopeSection() {
  return (
    <section id="kapsam" className="relative bg-[var(--paper)] py-24 md:py-36">
      <div className="container">
        <div className="max-w-3xl mb-16 md:mb-24">
          <FadeIn className="mb-6">
            <p className="section-label">Kapsam</p>
          </FadeIn>
          <InViewMask>
            <h2 className="section-title">
              Her ihtiyaç ERP&apos;ye sığmaz. Her ihtiyaç da ERP dışında çözülmemeli.
            </h2>
          </InViewMask>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2">
          {/* Centre divider draws downward */}
          <motion.div
            className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px origin-top bg-[var(--rule-strong)]"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
            aria-hidden="true"
          />

          {COLUMNS.map((col, c) => (
            <div key={col.heading} className={c === 0 ? "md:pr-14 lg:pr-20" : "mt-16 md:mt-0 md:pl-14 lg:pl-20"}>
              <FadeIn delay={0.1 + c * 0.15}>
                <h3 className="font-serif text-[2rem] md:text-[2.4rem] leading-tight text-[var(--ink)]">
                  {c === 1 ? <em className="text-[var(--brand-blue)]">{col.heading}</em> : col.heading}
                </h3>
                <p className="mt-2 text-[15px] text-[var(--ink-muted)]">{col.sub}</p>
              </FadeIn>

              <ul className="mt-10 border-t border-[var(--rule-strong)]">
                {col.items.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: c === 0 ? -10 : 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.7, delay: 0.2 + i * 0.07 + c * 0.1, ease: EASE_OUT }}
                    className="flex items-baseline gap-5 border-b border-[var(--rule)] py-5 text-[17px] text-[var(--ink)]"
                  >
                    <span className="w-6 shrink-0 text-[13px] tabular-nums text-[var(--ink-muted)]">{String(i + 1).padStart(2, "0")}</span>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <FadeIn delay={0.2} className="mt-16 md:mt-24 max-w-3xl">
          <p className="font-serif text-[1.5rem] md:text-[1.85rem] leading-snug text-[var(--ink)]">
            Sınırı her şirket için yeniden çizeriz: süreç, maliyet ve sürdürülebilirlik birlikte değerlendirilir; çözüm doğru katmana yerleşir.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
