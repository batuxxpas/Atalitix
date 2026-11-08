"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { InViewMask, FadeIn } from "@/components/motion";

export interface NewsItem {
  id: string;
  tur: "bizden" | "dunyadan";
  baslik: string;
  ozet: string | null;
  kaynak_adi: string | null;
  link: string | null;
  gorsel_url?: string | null;
  tarih: string;
}

const TABS = [
  { key: "bizden", label: "Bizden Haberler", hint: "Etkinlikler, projeler ve Atalitix'ten gelişmeler" },
  { key: "dunyadan", label: "Dünyadan Haberler", hint: "ERP, teknoloji ve dijital dönüşüm gündemi" },
] as const;

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return iso;
  }
}

function safeHref(link: string | null): string | null {
  if (!link) return null;
  try {
    const u = new URL(link);
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : null;
  } catch {
    return null;
  }
}

/** Image with a slow zoom on hover — no frame, just the picture. */
function Cover({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`relative aspect-[16/9] overflow-hidden bg-[var(--paper)] ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
      />
    </div>
  );
}

function StoryLink({ item, children }: { item: NewsItem; children: React.ReactNode }) {
  const href = safeHref(item.link);
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block">{children}</a>
  ) : (
    <div>{children}</div>
  );
}

function LeadStory({ item }: { item: NewsItem }) {
  const href = safeHref(item.link);
  return (
    <article className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 border-t border-[var(--rule-strong)] pt-8">
      {item.gorsel_url && (
        <div className="lg:col-span-7">
          <StoryLink item={item}>
            <Cover src={item.gorsel_url} alt={item.baslik} />
          </StoryLink>
        </div>
      )}
      <div className={item.gorsel_url ? "lg:col-span-5 lg:pt-2" : "lg:col-span-9"}>
        <time dateTime={item.tarih} className="block text-[13px] tabular-nums text-[var(--ink-muted)] mb-3">{formatDate(item.tarih)}</time>
        <StoryLink item={item}>
          <h3 className="font-serif text-[1.7rem] md:text-[2rem] leading-tight text-[var(--ink)] transition-colors group-hover:text-[var(--brand-blue)]">{item.baslik}</h3>
        </StoryLink>
        {item.ozet && <p className="mt-4 text-[15.5px] leading-relaxed text-[var(--ink-body)]">{item.ozet}</p>}
        {(item.kaynak_adi || href) && (
          <p className="mt-5 text-[13px] text-[var(--ink-muted)]">
            {item.kaynak_adi && <span>Kaynak: {item.kaynak_adi}</span>}
            {href && (
              <a href={href} target="_blank" rel="noopener noreferrer" className="link-underline ml-3 text-[var(--brand-navy-700)]">Habere git ↗</a>
            )}
          </p>
        )}
      </div>
    </article>
  );
}

export function NewsSection({ items }: { items: NewsItem[] }) {
  const available = TABS.filter((t) => items.some((i) => i.tur === t.key));
  const [active, setActive] = useState<string>(available[0]?.key ?? "bizden");
  if (available.length === 0) return null;

  const list = items.filter((i) => i.tur === active).slice(0, 4);
  const tab = TABS.find((t) => t.key === active)!;

  return (
    <section id="haberler" className="relative bg-white py-20 md:py-28 border-t border-[var(--rule)]">
      <div className="container">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-10 md:mb-12">
          <div>
            <FadeIn className="mb-6">
              <p className="section-label">Haberler</p>
            </FadeIn>
            <InViewMask>
              <h2 className="section-title">Gündem</h2>
            </InViewMask>
          </div>

          {/* Tabs — plain text with an underline marker */}
          <div role="tablist" aria-label="Haber türü" className="flex gap-8">
            {available.map((t) => (
              <button
                key={t.key}
                role="tab"
                aria-selected={active === t.key}
                onClick={() => setActive(t.key)}
                className={`relative pb-2 text-[15px] transition-colors ${
                  active === t.key ? "text-[var(--ink)]" : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
                }`}
              >
                {t.label}
                {active === t.key && (
                  <motion.span layoutId="news-tab" className="absolute left-0 right-0 -bottom-px h-[2px] bg-[var(--brand-blue)]" />
                )}
              </button>
            ))}
          </div>
        </div>

        <p className="text-[14px] text-[var(--ink-muted)] mb-8">{tab.hint}</p>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
          >
            {/* Lead story */}
            {list[0] && <LeadStory item={list[0]} />}

            {/* More stories */}
            {list.length > 1 && (
              <ul className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
                {list.slice(1).map((n, i) => (
                  <motion.li
                    key={n.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: EASE_OUT }}
                    className="group border-t border-[var(--rule-strong)] pt-5"
                  >
                    <StoryLink item={n}>
                      {n.gorsel_url && <Cover src={n.gorsel_url} alt={n.baslik} className="mb-5" />}
                      <time dateTime={n.tarih} className="block text-[12.5px] tabular-nums text-[var(--ink-muted)] mb-2">{formatDate(n.tarih)}</time>
                      <h3 className="font-serif text-[1.25rem] leading-snug text-[var(--ink)] transition-colors group-hover:text-[var(--brand-blue)]">{n.baslik}</h3>
                      {n.ozet && <p className="mt-2 text-[14px] leading-relaxed text-[var(--ink-muted)] line-clamp-3">{n.ozet}</p>}
                    </StoryLink>
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
