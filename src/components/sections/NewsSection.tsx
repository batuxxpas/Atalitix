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

export function NewsSection({ items }: { items: NewsItem[] }) {
  const available = TABS.filter((t) => items.some((i) => i.tur === t.key));
  const [active, setActive] = useState<string>(available[0]?.key ?? "bizden");
  if (available.length === 0) return null;

  const list = items.filter((i) => i.tur === active).slice(0, 6);
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

        <p className="text-[14px] text-[var(--ink-muted)] mb-6">{tab.hint}</p>

        <AnimatePresence mode="wait">
          <motion.ul
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            className="border-t border-[var(--rule-strong)]"
          >
            {list.map((n) => {
              const href = safeHref(n.link);
              const Title = (
                <h3 className="font-serif text-[1.3rem] md:text-[1.45rem] leading-snug text-[var(--ink)] transition-colors group-hover:text-[var(--brand-blue)]">
                  {n.baslik}
                </h3>
              );
              return (
                <li key={n.id} className="group border-b border-[var(--rule)]">
                  <div className="grid grid-cols-12 gap-x-6 gap-y-2 py-7">
                    <time dateTime={n.tarih} className="col-span-12 md:col-span-3 text-[13px] tabular-nums text-[var(--ink-muted)] md:pt-1.5">
                      {formatDate(n.tarih)}
                    </time>
                    <div className="col-span-12 md:col-span-9">
                      {href ? (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="block">
                          {Title}
                        </a>
                      ) : (
                        Title
                      )}
                      {n.ozet && <p className="mt-2 text-[15px] leading-relaxed text-[var(--ink-body)] max-w-2xl">{n.ozet}</p>}
                      {(n.kaynak_adi || href) && (
                        <p className="mt-3 text-[13px] text-[var(--ink-muted)]">
                          {n.kaynak_adi && <span>Kaynak: {n.kaynak_adi}</span>}
                          {href && (
                            <a href={href} target="_blank" rel="noopener noreferrer" className="link-underline ml-3 text-[var(--brand-navy-700)]">
                              Habere git ↗
                            </a>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </motion.ul>
        </AnimatePresence>
      </div>
    </section>
  );
}
