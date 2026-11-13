import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header, Footer } from "@/components/layout";
import { NewsCover, NewsCard, NewsBody } from "@/components/news/NewsCards";
import { SocialEmbedFrame } from "@/components/news/SocialEmbedFrame";
import { getNews, getRelatedNews, newsHref, formatNewsDate, safeHref, isHtml, socialEmbed } from "@/lib/news";
import { sanitizeNewsHtml } from "@/lib/sanitize";
import { SITE_CONFIG } from "@/lib/constants";
import { SocialLinks } from "@/components/ui/SocialLinks";

export const revalidate = 60;

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNews(slug);
  if (!news) return { title: "Haber bulunamadı" };
  const description = news.ozet ?? undefined;
  return {
    title: news.baslik,
    description,
    alternates: { canonical: newsHref(news) },
    openGraph: {
      type: "article",
      title: news.baslik,
      description,
      publishedTime: news.tarih,
      url: newsHref(news),
      images: news.gorsel_url ? [{ url: news.gorsel_url, width: 1800, height: 1013, alt: news.baslik }] : undefined,
    },
    twitter: { card: "summary_large_image", title: news.baslik, description, images: news.gorsel_url ? [news.gorsel_url] : undefined },
  };
}

export default async function NewsDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const news = await getNews(slug);
  if (!news) notFound();

  const related = await getRelatedNews(news);
  const source = safeHref(news.link);
  const embed = socialEmbed(news.link);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: news.baslik,
    description: news.ozet ?? undefined,
    datePublished: news.tarih,
    image: news.gorsel_url ? [news.gorsel_url] : undefined,
    publisher: { "@type": "Organization", name: "Atalitix", logo: { "@type": "ImageObject", url: `${SITE_CONFIG.url}/atalitixlogo.png` } },
    mainEntityOfPage: `${SITE_CONFIG.url}${newsHref(news)}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c") }} />
      <Header />
      <main className="pt-20 bg-white">
        <article>
          {/* Head */}
          <header className="container pt-14 md:pt-20">
            <nav aria-label="Konum" className="text-[13px] text-[var(--ink-muted)] mb-10">
              <Link href="/" className="link-underline">Ana sayfa</Link>
              <span className="mx-2" aria-hidden="true">/</span>
              <Link href="/haberler" className="link-underline">Haberler</Link>
              <span className="mx-2" aria-hidden="true">/</span>
              <Link href={`/haberler?tur=${news.tur}`} className="link-underline">{news.tur === "bizden" ? "Bizden Haberler" : "Dünyadan Haberler"}</Link>
            </nav>

            <div className="max-w-3xl">
              <p className="flex items-center gap-3 text-[13px] tabular-nums text-[var(--ink-muted)] mb-5">
                <span className="section-label !text-[13px]">{news.tur === "bizden" ? "Bizden" : "Dünyadan"}</span>
                <span aria-hidden="true">·</span>
                <time dateTime={news.tarih}>{formatNewsDate(news.tarih)}</time>
              </p>
              <h1 className="display text-[2.2rem] md:text-[3rem] leading-[1.08]">{news.baslik}</h1>
              {news.ozet && <p className="mt-6 font-serif text-[1.25rem] md:text-[1.4rem] leading-snug text-[var(--ink-muted)]">{news.ozet}</p>}
            </div>
          </header>

          {/* Cover — for social posts the embedded post itself is the visual */}
          {news.gorsel_url && !embed && (
            <div className="container mt-12 md:mt-14">
              <NewsCover src={news.gorsel_url} alt={news.baslik} priority />
            </div>
          )}

          <div className="container mt-12 md:mt-16">
            {embed ? (
              /* Social post: text on the left, the post itself on the right */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                <div className="lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:sticky lg:top-28">
                  <SocialEmbedFrame embed={embed} title={news.baslik} />
                </div>
                <div className="lg:col-span-6 lg:col-start-1 lg:row-start-1 max-w-[40rem]">
                  {news.icerik &&
                    (isHtml(news.icerik) ? (
                      <div className="news-prose" dangerouslySetInnerHTML={{ __html: sanitizeNewsHtml(news.icerik) }} />
                    ) : (
                      <NewsBody text={news.icerik} />
                    ))}

                  {(news.kaynak_adi || (source && !embed)) && (
                    <p className="mt-10 border-t border-[var(--rule)] pt-5 text-[14px] text-[var(--ink-muted)]">
                      {news.kaynak_adi && <span>Kaynak: {news.kaynak_adi}</span>}
                      {source && !embed && (
                        <a href={source} target="_blank" rel="noopener noreferrer" className="link-underline ml-3 text-[var(--brand-navy-700)]">
                          Kaynağa git ↗
                        </a>
                      )}
                    </p>
                  )}

                  <div className="mt-12 border-t border-[var(--rule-strong)] pt-8">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <Link href="/haberler" className="text-[14px] text-[var(--ink)] link-underline">← Tüm haberler</Link>
                      <div className="flex items-center gap-3 text-[13px] text-[var(--ink-muted)]">
                        <span>Takip edin</span>
                        <SocialLinks variant="icons" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 lg:col-start-3 max-w-[44rem]">
                  {news.icerik &&
                    (isHtml(news.icerik) ? (
                      <div className="news-prose" dangerouslySetInnerHTML={{ __html: sanitizeNewsHtml(news.icerik) }} />
                    ) : (
                      <NewsBody text={news.icerik} />
                    ))}

                  {(news.kaynak_adi || (source && !embed)) && (
                    <p className="mt-10 border-t border-[var(--rule)] pt-5 text-[14px] text-[var(--ink-muted)]">
                      {news.kaynak_adi && <span>Kaynak: {news.kaynak_adi}</span>}
                      {source && !embed && (
                        <a href={source} target="_blank" rel="noopener noreferrer" className="link-underline ml-3 text-[var(--brand-navy-700)]">
                          Kaynağa git ↗
                        </a>
                      )}
                    </p>
                  )}

                  <div className="mt-12 border-t border-[var(--rule-strong)] pt-8">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <Link href="/haberler" className="text-[14px] text-[var(--ink)] link-underline">← Tüm haberler</Link>
                      <div className="flex items-center gap-3 text-[13px] text-[var(--ink-muted)]">
                        <span>Takip edin</span>
                        <SocialLinks variant="icons" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Related */}
        {related.length > 0 && (
          <section aria-label="Diğer haberler" className="bg-[var(--paper)] mt-24 md:mt-32 py-20 md:py-24">
            <div className="container">
              <div className="flex items-baseline justify-between gap-6 mb-10">
                <h2 className="section-title">Diğer haberler</h2>
                <Link href="/haberler" className="text-[14px] text-[var(--brand-navy-700)] link-underline whitespace-nowrap">Tümünü gör →</Link>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-12">
                {related.map((n) => (
                  <li key={n.id}><NewsCard item={n} showType /></li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
