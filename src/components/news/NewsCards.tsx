import Link from "next/link";
import React from "react";
import { type News, newsHref, formatNewsDate } from "@/lib/news-utils";

/** Cover image with a slow zoom on hover — no frame, just the picture. */
export function NewsCover({ src, alt, className = "", priority = false }: { src: string; alt: string; className?: string; priority?: boolean }) {
  // The whole picture is always visible (square/portrait social images are not cropped);
  // the remaining space is filled with a soft, blurred copy of the same image.
  return (
    <div className={`relative aspect-[16/9] overflow-hidden bg-[var(--paper)] outline outline-1 -outline-offset-1 outline-[var(--rule)] ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" aria-hidden="true" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-2xl" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="absolute inset-0 h-full w-full object-contain transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
      />
    </div>
  );
}

function TypeTag({ tur }: { tur: News["tur"] }) {
  return (
    <span className="text-[12px] text-[var(--brand-navy-700)]">
      {tur === "bizden" ? "Bizden" : "Dünyadan"}
    </span>
  );
}

/** Large lead story: image left, text right. */
export function NewsLead({ item, showType = false }: { item: News; showType?: boolean }) {
  const href = newsHref(item);
  return (
    <article className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 border-t border-[var(--rule-strong)] pt-8">
      {item.gorsel_url && (
        <Link href={href} className="lg:col-span-7 block" tabIndex={-1} aria-hidden="true">
          <NewsCover src={item.gorsel_url} alt="" priority />
        </Link>
      )}
      <div className={item.gorsel_url ? "lg:col-span-5 lg:pt-2" : "lg:col-span-9"}>
        <p className="flex items-center gap-3 text-[13px] tabular-nums text-[var(--ink-muted)] mb-3">
          <time dateTime={item.tarih}>{formatNewsDate(item.tarih)}</time>
          {showType && <><span aria-hidden="true">·</span><TypeTag tur={item.tur} /></>}
        </p>
        <h3 className="font-serif text-[1.7rem] md:text-[2rem] leading-tight text-[var(--ink)]">
          <Link href={href} className="transition-colors group-hover:text-[var(--brand-blue)]">{item.baslik}</Link>
        </h3>
        {item.ozet && <p className="mt-4 text-[15.5px] leading-relaxed text-[var(--ink-body)]">{item.ozet}</p>}
        <Link href={href} className="mt-6 inline-flex items-center gap-2 text-[14px] font-medium text-[var(--brand-navy-700)] link-underline">
          Haberi oku <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

/** Grid card: image, date, title, summary. */
export function NewsCard({ item, showType = false }: { item: News; showType?: boolean }) {
  const href = newsHref(item);
  return (
    <article className="group border-t border-[var(--rule-strong)] pt-5 h-full">
      <Link href={href} className="block">
        {item.gorsel_url && <NewsCover src={item.gorsel_url} alt="" className="mb-5" />}
        <p className="flex items-center gap-3 text-[12.5px] tabular-nums text-[var(--ink-muted)] mb-2">
          <time dateTime={item.tarih}>{formatNewsDate(item.tarih)}</time>
          {showType && <><span aria-hidden="true">·</span><TypeTag tur={item.tur} /></>}
        </p>
        <h3 className="font-serif text-[1.25rem] leading-snug text-[var(--ink)] transition-colors group-hover:text-[var(--brand-blue)]">{item.baslik}</h3>
        {item.ozet && <p className="mt-2 text-[14px] leading-relaxed text-[var(--ink-muted)] line-clamp-3">{item.ozet}</p>}
      </Link>
    </article>
  );
}

/**
 * Renders the article body from plain text — never as raw HTML.
 * Blank line = new paragraph · "## " = subheading · lines starting "- " = bullet list
 */
export function NewsBody({ text }: { text: string }) {
  const blocks = text.replace(/\r\n/g, "\n").split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        if (block.startsWith("## ")) {
          const [head, ...rest] = block.split("\n");
          return (
            <React.Fragment key={i}>
              <h2 className="font-serif text-[1.45rem] md:text-[1.6rem] leading-snug text-[var(--ink)] pt-4">{head.slice(3)}</h2>
              {rest.length > 0 && <Block lines={rest} />}
            </React.Fragment>
          );
        }
        return <Block key={i} lines={block.split("\n")} />;
      })}
    </div>
  );
}

function Block({ lines }: { lines: string[] }) {
  const isList = lines.every((l) => /^\s*[-•]\s+/.test(l));
  if (isList) {
    return (
      <ul className="border-t border-[var(--rule)]">
        {lines.map((l, j) => (
          <li key={j} className="flex gap-4 border-b border-[var(--rule)] py-3 text-[16.5px] leading-relaxed text-[var(--ink-body)]">
            <span className="mt-[0.7em] h-px w-4 shrink-0 bg-[var(--brand-blue)]" aria-hidden="true" />
            <span>{l.replace(/^\s*[-•]\s+/, "")}</span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <p className="text-[17px] leading-[1.8] text-[var(--ink-body)]">
      {lines.map((l, j) => (
        <React.Fragment key={j}>
          {j > 0 && <br />}
          {l}
        </React.Fragment>
      ))}
    </p>
  );
}
