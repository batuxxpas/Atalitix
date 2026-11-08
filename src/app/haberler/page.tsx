import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { NewsLead, NewsCard } from "@/components/news/NewsCards";
import { getNewsList, NEWS_TYPES, NEWS_PAGE_SIZE, type NewsType } from "@/lib/news";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Haberler",
  description: "Atalitix'ten haberler, etkinlikler ve ERP, veri ve dijital dönüşüm gündemine dair değerlendirmeler.",
  alternates: { canonical: "/haberler" },
};

type SearchParams = Promise<{ tur?: string; sayfa?: string }>;

export default async function NewsIndexPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const tur = NEWS_TYPES.some((t) => t.key === sp.tur) ? (sp.tur as NewsType) : undefined;
  const page = Math.max(1, parseInt(sp.sayfa || "1") || 1);

  const { items, total } = await getNewsList({ tur, page });
  const pages = Math.max(1, Math.ceil(total / NEWS_PAGE_SIZE));
  const [lead, ...rest] = items;
  const activeHint = NEWS_TYPES.find((t) => t.key === tur)?.hint ?? "Atalitix'ten gelişmeler ve sektör gündemi";

  const qs = (p: { tur?: string; sayfa?: number }) => {
    const params = new URLSearchParams();
    if (p.tur) params.set("tur", p.tur);
    if (p.sayfa && p.sayfa > 1) params.set("sayfa", String(p.sayfa));
    const s = params.toString();
    return s ? `/haberler?${s}` : "/haberler";
  };

  const filters = [{ key: undefined, label: "Tümü" }, ...NEWS_TYPES.map((t) => ({ key: t.key, label: t.label }))];

  return (
    <>
      <Header />
      <main className="pt-20 bg-white">
        <section className="container pt-14 md:pt-20 pb-24 md:pb-32">
          {/* Breadcrumb */}
          <nav aria-label="Konum" className="text-[13px] text-[var(--ink-muted)] mb-10">
            <Link href="/" className="link-underline">Ana sayfa</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-[var(--ink)]">Haberler</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-6">
            <div>
              <p className="section-label mb-6">Haberler</p>
              <h1 className="display text-[2.6rem] md:text-[3.4rem]">Gündem</h1>
            </div>

            {/* Filters */}
            <nav aria-label="Haber türü" className="flex flex-wrap gap-x-8 gap-y-2">
              {filters.map((f) => {
                const active = f.key === tur;
                return (
                  <Link
                    key={f.label}
                    href={qs({ tur: f.key })}
                    aria-current={active ? "page" : undefined}
                    className={`relative pb-2 text-[15px] transition-colors ${active ? "text-[var(--ink)]" : "text-[var(--ink-muted)] hover:text-[var(--ink)]"}`}
                  >
                    {f.label}
                    {active && <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-[var(--brand-blue)]" />}
                  </Link>
                );
              })}
            </nav>
          </div>
          <p className="text-[14px] text-[var(--ink-muted)] mb-10">{activeHint}</p>

          {items.length === 0 ? (
            <div className="border-t border-[var(--rule-strong)] pt-10">
              <p className="font-serif text-[1.3rem] text-[var(--ink)]">Bu başlıkta henüz haber yok.</p>
              <Link href="/haberler" className="mt-4 inline-block text-[14px] text-[var(--brand-navy-700)] link-underline">Tüm haberlere dön</Link>
            </div>
          ) : (
            <>
              {page === 1 && lead && <NewsLead item={lead} showType={!tur} />}
              {(page === 1 ? rest : items).length > 0 && (
                <ul className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
                  {(page === 1 ? rest : items).map((n) => (
                    <li key={n.id}><NewsCard item={n} showType={!tur} /></li>
                  ))}
                </ul>
              )}
            </>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <nav aria-label="Sayfalar" className="mt-16 flex items-center justify-between border-t border-[var(--rule-strong)] pt-6 text-[14px]">
              {page > 1 ? (
                <Link href={qs({ tur, sayfa: page - 1 })} className="link-underline text-[var(--ink)]">← Daha yeni haberler</Link>
              ) : <span />}
              <span className="tabular-nums text-[var(--ink-muted)]">{page} / {pages}</span>
              {page < pages ? (
                <Link href={qs({ tur, sayfa: page + 1 })} className="link-underline text-[var(--ink)]">Daha eski haberler →</Link>
              ) : <span />}
            </nav>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
