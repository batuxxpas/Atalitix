/** Pure helpers & types for the news module — safe to import from client components. */

export type NewsType = "bizden" | "dunyadan";

export interface News {
  id: string;
  slug?: string | null;
  tur: NewsType;
  baslik: string;
  ozet: string | null;
  icerik?: string | null;
  kaynak_adi: string | null;
  link: string | null;
  gorsel_url?: string | null;
  tarih: string;
}

export const NEWS_TYPES: { key: NewsType; label: string; hint: string }[] = [
  { key: "bizden", label: "Bizden Haberler", hint: "Etkinlikler, projeler ve Atalitix'ten gelişmeler" },
  { key: "dunyadan", label: "Dünyadan Haberler", hint: "ERP, teknoloji ve dijital dönüşüm gündemi" },
];

export const NEWS_PAGE_SIZE = 9;

const TR_MAP: Record<string, string> = {
  ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", â: "a", î: "i", û: "u",
  Ç: "c", Ğ: "g", İ: "i", I: "i", Ö: "o", Ş: "s", Ü: "u", Â: "a", Î: "i", Û: "u",
};

/** Turkish-aware URL slug: "Yeni web sitemiz yayında" → "yeni-web-sitemiz-yayinda" */
export function slugify(text: string): string {
  return (
    text
      .replace(/[çğıöşüâîûÇĞİIÖŞÜÂÎÛ]/g, (c) => TR_MAP[c] ?? c)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "haber"
  );
}

/** Public URL of a news item (falls back to the id until slugs exist). */
export function newsHref(n: Pick<News, "id" | "slug">): string {
  return `/haberler/${n.slug || n.id}`;
}

export function formatNewsDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return iso;
  }
}

/** Only real web links are rendered as links. */
export function safeHref(link: string | null | undefined): string | null {
  if (!link) return null;
  try {
    const u = new URL(link);
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : null;
  } catch {
    return null;
  }
}
