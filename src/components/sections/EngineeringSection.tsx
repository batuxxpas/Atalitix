"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

type Tok = [string, string?];

// Token colours on the navy editor background
const C = {
  com: "text-slate-500 italic",
  kw: "text-[#7fa8ff]",
  fn: "text-white",
  prop: "text-[#c3cff5]",
  str: "text-[#7ee2b8]",
  pun: "text-slate-400",
};

/** Illustrative pipeline: field → validation → ERP → automation → KPI. */
const CODE: Tok[][] = [
  [["// Sahadan sisteme, sistemden karara", C.com]],
  [["const ", C.kw], ["siparisAkisi", C.fn], [" = ", C.pun], ["surec", C.fn], ["(", C.pun], ['"siparis-onay"', C.str], [")", C.pun]],
  [["  .", C.pun], ["kaynak", C.prop], ["(", C.pun], ["saha", C.fn], [".", C.pun], ["mobilForm", C.prop], [")", C.pun]],
  [["  .", C.pun], ["dogrula", C.prop], ["(", C.pun], ["kurallar", C.fn], [".", C.pun], ["stokVeKredi", C.prop], [")", C.pun]],
  [["  .", C.pun], ["aktar", C.prop], ["(", C.pun], ["erp", C.fn], [".", C.pun], ["satis", C.prop], [".", C.pun], ["siparis", C.prop], [")", C.pun]],
  [["  .", C.pun], ["tetikle", C.prop], ["(", C.pun], ["otomasyon", C.fn], [".", C.pun], ["sevkPlanlama", C.prop], [")", C.pun]],
  [["  .", C.pun], ["raporla", C.prop], ["(", C.pun], ["kpi", C.fn], [".", C.pun], ["teslimPerformansi", C.prop], [");", C.pun]],
  [[""]],
  [["await ", C.kw], ["siparisAkisi", C.fn], [".", C.pun], ["yayinla", C.prop], ["({ ", C.pun], ["ortam", C.prop], [": ", C.pun], ['"canli"', C.str], [" });", C.pun]],
];

const OUTPUT = [
  "Saha formu doğrulandı",
  "ERP satış siparişi oluşturuldu",
  "Sevk planlama tetiklendi",
  "KPI paneli güncellendi",
];

const CAPABILITIES = [
  {
    title: "Sistem Entegrasyonu",
    desc: "ERP, saha uygulamaları ve iş sistemleri arasında güvenilir, izlenebilir veri akışı.",
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h8m0 0l-3-3m3 3l-3 3M16 17H8m0 0l3 3m-3-3l3-3" />,
  },
  {
    title: "Özel Modül & Uygulama",
    desc: "Low-code/no-code veya özel yazılımla, süreçlerinize göre kurgulanmış ekranlar ve iş akışları.",
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 8l-4 4 4 4M15 8l4 4-4 4M13 6l-2 12" />,
  },
  {
    title: "Raporlama Katmanı",
    desc: "Operasyon ve yönetim verisini tek kaynaktan KPI ve dashboard ekranlarına taşıyan yapı.",
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M4 20h16M7 16v-5M12 16V7M17 16v-3" />,
  },
];

function CodeWindow() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const reduce = useReducedMotion();
  const [typedLines, setLines] = useState(0);
  const [typedOut, setOut] = useState(0);
  // Reduced motion: show everything at once
  const lines = reduce ? CODE.length : typedLines;
  const out = reduce ? OUTPUT.length : typedOut;

  useEffect(() => {
    if (!inView || reduce) return;
    let l = 0, o = 0;
    const id = setInterval(() => {
      if (l < CODE.length) setLines(++l);
      else if (o < OUTPUT.length) setOut(++o);
      else clearInterval(id);
    }, 170);
    return () => clearInterval(id);
  }, [inView, reduce]);

  const typing = lines < CODE.length;

  return (
    <div ref={ref} className="relative rounded-2xl bg-[var(--brand-navy-900)] border border-white/10 shadow-[0_40px_90px_-40px_rgba(6,15,51,0.8)] overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-white/10 px-4">
        <div className="flex">
          <span className="font-mono text-[11.5px] text-white px-3 py-3 border-b-2 border-[var(--brand-blue)]">siparis-akisi.ts</span>
          <span className="font-mono text-[11.5px] text-slate-500 px-3 py-3 hidden sm:inline">kpi-panel.sql</span>
        </div>
        <span className="font-mono text-[10.5px] text-slate-500 tracking-wider">atalitix / entegrasyon</span>
      </div>

      {/* Code */}
      <pre className="font-mono text-[12.5px] md:text-[13px] leading-[1.85] px-4 md:px-5 py-5 overflow-x-auto min-h-[300px]">
        {CODE.map((line, i) => (
          <div key={i} className={`flex transition-opacity duration-200 ${i < lines ? "opacity-100" : "opacity-0"}`}>
            <span className="w-7 shrink-0 select-none text-right pr-4 text-slate-600">{i + 1}</span>
            <code className="whitespace-pre">
              {line.map(([t, c], j) => <span key={j} className={c}>{t}</span>)}
              {typing && i === lines - 1 && <span className="caret" />}
            </code>
          </div>
        ))}
      </pre>

      {/* Terminal */}
      <div className="border-t border-white/10 bg-black/20 px-4 md:px-5 py-4 min-h-[132px]">
        <p className="font-mono text-[11px] text-slate-500 mb-2">$ atalitix run siparis-akisi</p>
        {OUTPUT.slice(0, out).map((o) => (
          <motion.p
            key={o}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-mono text-[12px] text-slate-300 leading-6"
          >
            <span className="text-[#7ee2b8]">✓</span> {o}
          </motion.p>
        ))}
      </div>
    </div>
  );
}

export function EngineeringSection() {
  return (
    <section id="muhendislik" className="relative py-24 md:py-28 bg-white overflow-hidden">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <p className="section-label mb-4">MÜHENDİSLİK</p>
            <h2 className="section-title mb-5">Hazır kalıplar değil, işinize göre kurgulanan sistemler.</h2>
            <p className="text-slate-500 leading-relaxed mb-10">
              ERP&apos;nin standart gücünü korur; ERP dışında kalan ihtiyaçlar için entegrasyon, özel modül ve raporlama katmanlarını şirketinizin gerçek iş akışına göre tasarlayıp hayata geçiririz.
            </p>

            <ul className="divide-y divide-slate-200 border-y border-slate-200">
              {CAPABILITIES.map((c, i) => (
                <motion.li
                  key={c.title}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                  className="group flex gap-4 py-5"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-[var(--brand-blue)] transition-colors group-hover:bg-[var(--brand-navy-700)] group-hover:border-[var(--brand-navy-700)] group-hover:text-white">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} aria-hidden="true">{c.icon}</svg>
                  </span>
                  <div>
                    <h3 className="font-semibold text-[var(--brand-navy)]">{c.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed mt-1">{c.desc}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <CodeWindow />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
