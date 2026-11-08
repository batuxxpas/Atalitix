const ITEMS = [
  "ERP Danışmanlığı",
  "Süreç Tasarımı",
  "Sistem Entegrasyonu",
  "Özel Yazılım",
  "Veri Görselleştirme",
  "Süreç Otomasyonu",
  "Proje Yönetimi",
];

/** Slow, infinite band of capabilities — alternating solid / outlined type. */
export function CapabilityMarquee() {
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {ITEMS.map((item, i) => (
        <div key={item} className="flex items-center">
          <span
            className={`whitespace-nowrap px-6 md:px-8 text-3xl md:text-5xl font-bold tracking-[-0.03em] ${
              i % 2 === 0 ? "text-[var(--brand-navy)]" : "text-outline"
            }`}
          >
            {item}
          </span>
          <span className="h-2 w-2 shrink-0 rotate-45 bg-[var(--brand-blue)]" />
        </div>
      ))}
    </div>
  );

  return (
    <section aria-label="Uzmanlık alanları" className="marquee relative border-y border-slate-200 bg-white py-7 md:py-9 overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
