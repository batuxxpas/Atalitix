import { socialEmbed } from "./news-utils";

/**
 * Reads the public link-preview metadata (Open Graph) of a page — the same data
 * WhatsApp/Slack use to show a preview. Identifies itself honestly; no impersonation.
 * Server-only.
 */

const UA = "AtalitixLinkPreview/1.0 (+https://atalitix.com)";
const MAX_HTML_BYTES = 2 * 1024 * 1024;

export interface LinkPreview {
  platform: "LinkedIn" | "Instagram" | null;
  image?: string;
  description?: string;
  siteName?: string;
  publishedTime?: string;
}

/** Only public web addresses — never localhost, raw IPs or internal names. */
export function isSafePublicUrl(raw: string): URL | null {
  let u: URL;
  try { u = new URL(raw); } catch { return null; }
  if (u.protocol !== "https:" && u.protocol !== "http:") return null;
  const h = u.hostname.toLowerCase();
  if (h === "localhost" || h.endsWith(".local") || h.endsWith(".internal") || !h.includes(".")) return null;
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(h) || h.includes(":") || h.startsWith("[")) return null;
  return u;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(parseInt(n, 10)))
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}

function meta(html: string, prop: string): string | undefined {
  const re1 = new RegExp(`<meta[^>]+(?:property|name)=["']${prop}["'][^>]*content=["']([^"']*)["']`, "i");
  const re2 = new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${prop}["']`, "i");
  const m = html.match(re1) || html.match(re2);
  const v = m ? decodeEntities(m[1]).trim() : "";
  return v || undefined;
}

async function fetchHtml(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml", "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8" },
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
      cache: "no-store",
    });
    if (!res.ok || !res.body) return null;
    if (res.url && !isSafePublicUrl(res.url)) return null;
    // Read at most MAX_HTML_BYTES
    const reader = res.body.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (size < MAX_HTML_BYTES) {
      const { done, value } = await reader.read();
      if (done || !value) break;
      chunks.push(value);
      size += value.length;
    }
    reader.cancel().catch(() => {});
    return new TextDecoder("utf-8").decode(Buffer.concat(chunks));
  } catch {
    return null;
  }
}

/**
 * Instagram's link preview (og:image) is a 640×640 centre crop. Its official embed page
 * carries the original picture in full aspect ratio with a srcset up to 2048 px — take the
 * largest version from there.
 */
function instagramFullImage(embedHtml: string): string | undefined {
  const tag = embedHtml.match(/<img[^>]+class="[^"]*EmbeddedMediaImage[^"]*"[^>]*>/i)?.[0];
  if (!tag) return undefined;
  const srcset = tag.match(/srcset="([^"]+)"/i)?.[1];
  if (srcset) {
    const best = decodeEntities(srcset)
      .split(",")
      .map((part) => {
        const [u, w] = part.trim().split(/\s+/);
        return { u, w: parseInt(w) || 0 };
      })
      .filter((c) => c.u?.startsWith("https://"))
      .sort((a, b) => b.w - a.w);
    // Largest version up to 1440 px (sharp on the site, small enough to store)
    const pick = best.find((c) => c.w <= 1440) ?? best[best.length - 1];
    if (pick) return pick.u;
  }
  const src = tag.match(/src="([^"]+)"/i)?.[1];
  return src ? decodeEntities(src) : undefined;
}

/**
 * Full caption from Instagram's official embed page, with its paragraph breaks
 * (the og:description is flattened and prefixed with like/comment counts).
 */
function instagramCaption(embedHtml: string): string | undefined {
  const m = embedHtml.match(/class="Caption">([\s\S]*?)(?:<div class="CaptionComments"|<\/div>)/i);
  if (!m) return undefined;
  const text = decodeEntities(
    m[1]
      .replace(/<a[^>]*class="CaptionUsername"[^>]*>[\s\S]*?<\/a>/i, "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, ""),
  )
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return text || undefined;
}

/** Instagram descriptions look like: '12 likes, 1 comments - atalitix on 5 November 2026: "caption…".' */
function cleanInstagramCaption(desc: string): string {
  const m = desc.match(/:\s*["“]([\s\S]+?)["”]\.?\s*$/);
  return (m ? m[1] : desc).trim();
}

export async function getLinkPreview(raw: string): Promise<LinkPreview | null> {
  const url = isSafePublicUrl(raw);
  if (!url) return null;
  const embed = socialEmbed(raw);
  const platform = embed?.platform ?? null;

  // LinkedIn answers unknown clients only on its official embed page
  const candidates = platform === "LinkedIn" && embed ? [embed.src, url.toString()] : [url.toString()];

  for (const candidate of candidates) {
    const html = await fetchHtml(candidate);
    if (!html) continue;

    let image = meta(html, "og:image") ?? meta(html, "og:image:url") ?? meta(html, "twitter:image");
    let description = meta(html, "og:description") ?? meta(html, "description") ?? meta(html, "twitter:description");

    if (platform === "LinkedIn" && !image) {
      const img = html.match(/<img[^>]+src=["'](https:\/\/media\.licdn\.com\/dms\/image\/[^"']+)["']/i);
      if (img) image = decodeEntities(img[1]);
    }
    if (platform === "Instagram" && description) description = cleanInstagramCaption(description);
    if (platform === "Instagram" && embed) {
      const embedHtml = await fetchHtml(embed.src);
      const full = embedHtml ? instagramFullImage(embedHtml) : undefined;
      if (full) image = full;
      const caption = embedHtml ? instagramCaption(embedHtml) : undefined;
      if (caption) description = caption;
    }
    if (image) {
      try { image = new URL(image, candidate).toString(); } catch { image = undefined; }
    }

    if (image || description) {
      return {
        platform,
        image,
        description: description?.slice(0, 2000),
        siteName: platform ?? meta(html, "og:site_name") ?? url.hostname.replace(/^www\./, ""),
        publishedTime: meta(html, "article:published_time"),
      };
    }
  }
  return { platform };
}

/** Downloads a preview image (public URL, image type, ≤ maxBytes). */
export async function downloadImage(raw: string, maxBytes: number): Promise<{ data: Buffer; type: string } | null> {
  if (!isSafePublicUrl(raw)) return null;
  try {
    const res = await fetch(raw, { headers: { "User-Agent": UA }, redirect: "follow", signal: AbortSignal.timeout(15000), cache: "no-store" });
    const type = (res.headers.get("content-type") || "").split(";")[0].trim();
    if (!res.ok || !["image/jpeg", "image/png", "image/webp"].includes(type)) return null;
    const len = Number(res.headers.get("content-length") || 0);
    if (len > maxBytes) return null;
    const data = Buffer.from(await res.arrayBuffer());
    return data.length <= maxBytes ? { data, type } : null;
  } catch {
    return null;
  }
}
