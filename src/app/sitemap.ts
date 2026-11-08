import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { SITE_CONFIG } from "@/lib/constants";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base: MetadataRoute.Sitemap = [
    { url: SITE_CONFIG.url, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_CONFIG.url}/haberler`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];

  // Published news pages
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { data } = await supabase.from("haberler").select("id,slug,tarih").eq("is_active", true).order("tarih", { ascending: false });
    for (const n of (data ?? []) as { id: string; slug?: string | null; tarih: string }[]) {
      base.push({
        url: `${SITE_CONFIG.url}/haberler/${n.slug || n.id}`,
        lastModified: new Date(n.tarih),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  } catch {
    // News table unavailable — keep the static entries
  }

  return base;
}
