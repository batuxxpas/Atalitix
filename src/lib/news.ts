import { createClient } from "@/lib/supabase/server";
import { NEWS_PAGE_SIZE, type News, type NewsType } from "./news-utils";

export * from "./news-utils";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getNewsList(opts: { tur?: NewsType; page?: number; limit?: number } = {}) {
  const supabase = await createClient();
  const limit = opts.limit ?? NEWS_PAGE_SIZE;
  const page = Math.max(1, opts.page ?? 1);
  let q = supabase
    .from("haberler")
    .select("*", { count: "exact" })
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);
  if (opts.tur) q = q.eq("tur", opts.tur);
  const { data, count, error } = await q;
  if (error) return { items: [] as News[], total: 0 };
  return { items: (data ?? []) as unknown as News[], total: count ?? 0 };
}

/** Looks a news item up by slug, or by id (old links / before slugs existed). */
export async function getNews(key: string): Promise<News | null> {
  const supabase = await createClient();
  const decoded = decodeURIComponent(key);
  if (UUID_RE.test(decoded)) {
    const { data } = await supabase.from("haberler").select("*").eq("id", decoded).eq("is_active", true).maybeSingle();
    if (data) return data as unknown as News;
  }
  const { data, error } = await supabase.from("haberler").select("*").eq("slug", decoded).eq("is_active", true).maybeSingle();
  if (error) return null;
  return (data as unknown as News) ?? null;
}

export async function getRelatedNews(current: News, limit = 3): Promise<News[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("haberler")
    .select("*")
    .eq("is_active", true)
    .neq("id", current.id)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as unknown as News[];
}
