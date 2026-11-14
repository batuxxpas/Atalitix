"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { FadeIn, WordReveal } from "@/components/motion";
import { NewsLead, NewsCard } from "@/components/news/NewsCards";
import { NEWS_TYPES, type News } from "@/lib/news-utils";

export type NewsItem = News;

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Home-page teaser of the news module; full list lives at /haberler. */
export function NewsSection({ items }: { items: News[] }) {
  const available = NEWS_TYPES.filter((t) => items.some((i) => i.tur === t.key));
  const [active, setActive] = useState<string>(available[0]?.key ?? "bizden");
  if (available.length === 0) return null;

  const list = items.filter((i) => i.tur === active).slice(0, 4);
  const tab = NEWS_TYPES.find((t) => t.key === active)!;

  return (
    <section id="haberler" className="relative bg-white py-20 md:py-28 border-t border-[var(--rule)]">
      <div className="container">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-10 md:mb-12">
          <div>
            <FadeIn className="mb-6">
              <p className="section-label">Haberler</p>
            </FadeIn>
            <WordReveal as="h2" className="section-title">
              Gündem
            </WordReveal>
          </div>

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
            {list[0] && <NewsLead item={list[0]} />}
            {list.length > 1 && (
              <ul className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
                {list.slice(1).map((n) => (
                  <li key={n.id}><NewsCard item={n} /></li>
                ))}
              </ul>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-14 flex justify-end border-t border-[var(--rule)] pt-6">
          <Link href={`/haberler?tur=${active}`} className="text-[15px] font-medium text-[var(--brand-navy-700)] link-underline">
            Tüm {tab.label.toLocaleLowerCase("tr-TR")} →
          </Link>
        </div>
      </div>
    </section>
  );
}
