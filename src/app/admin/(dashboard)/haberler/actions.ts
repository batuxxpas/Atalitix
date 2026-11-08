"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, getAdminClient } from "@/lib/admin/auth";
import { slugify } from "@/lib/news-utils";

function clean(v: FormDataEntryValue | null): string | null {
  const s = String(v ?? "").trim();
  return s.length ? s : null;
}

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

/** Uploads an image to the public "haberler" bucket and returns its public URL. */
async function uploadImage(file: File): Promise<string | null> {
  const ext = IMAGE_TYPES[file.type];
  if (!ext || file.size === 0 || file.size > MAX_IMAGE_BYTES) return null;
  const path = `yuklemeler/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const storage = getAdminClient().storage.from("haberler");
  const { error } = await storage.upload(path, Buffer.from(await file.arrayBuffer()), {
    contentType: file.type,
    cacheControl: "31536000",
  });
  if (error) {
    console.error("Görsel yüklenemedi:", error.message);
    return null;
  }
  return storage.getPublicUrl(path).data.publicUrl;
}

/** Returns a slug not used by another news item. */
async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const db = getAdminClient();
  for (let i = 1; i < 50; i++) {
    const candidate = i === 1 ? base : `${base}-${i}`;
    let q = db.from("haberler").select("id").eq("slug", candidate).limit(1);
    if (excludeId) q = q.neq("id", excludeId);
    const { data, error } = await q;
    if (error) return candidate; // slug column not created yet
    if (!data?.length) return candidate;
  }
  return `${base}-${Date.now()}`;
}

/** Reads and validates the shared form. Returns null when required fields are missing. */
async function readForm(formData: FormData, excludeId?: string) {
  const baslik = clean(formData.get("baslik"));
  const tur = clean(formData.get("tur"));
  if (!baslik || (tur !== "bizden" && tur !== "dunyadan")) return null;

  let link = clean(formData.get("link"));
  if (link && !/^https?:\/\//i.test(link)) link = null;

  // Image: an uploaded file wins over a pasted URL
  let gorsel_url = clean(formData.get("gorsel_url"));
  if (gorsel_url && !/^https:\/\//i.test(gorsel_url)) gorsel_url = null;
  const file = formData.get("gorsel");
  if (file instanceof File && file.size > 0) {
    gorsel_url = (await uploadImage(file)) ?? gorsel_url;
  }

  const slug = await uniqueSlug(slugify(clean(formData.get("slug")) ?? baslik), excludeId);

  return {
    tur,
    baslik,
    ozet: clean(formData.get("ozet")),
    icerik: clean(formData.get("icerik")),
    kaynak_adi: clean(formData.get("kaynak_adi")),
    link,
    gorsel_url,
    slug,
    tarih: clean(formData.get("tarih")) ?? new Date().toISOString().slice(0, 10),
  };
}

/** Until the detail-page columns exist, retry without them instead of failing. */
function withoutDetailColumns<T extends Record<string, unknown>>(row: T) {
  const { slug: _slug, icerik: _icerik, ...rest } = row;
  void _slug; void _icerik;
  return rest;
}

function refresh() {
  revalidatePath("/");
  revalidatePath("/haberler", "layout");
  revalidatePath("/admin/haberler", "layout");
}

export async function createNews(formData: FormData) {
  await requireAdmin();
  const row = await readForm(formData);
  if (!row) return;
  const db = getAdminClient();
  const { error } = await db.from("haberler").insert(row);
  if (error?.code === "PGRST204") await db.from("haberler").insert(withoutDetailColumns(row));
  else if (error) console.error("Haber eklenemedi:", error.message);
  refresh();
}

export async function updateNews(formData: FormData) {
  await requireAdmin();
  const id = clean(formData.get("id"));
  if (!id) return;
  const row = await readForm(formData, id);
  if (!row) return;
  const db = getAdminClient();
  const { error } = await db.from("haberler").update(row).eq("id", id);
  if (error?.code === "PGRST204") await db.from("haberler").update(withoutDetailColumns(row)).eq("id", id);
  else if (error) console.error("Haber güncellenemedi:", error.message);
  refresh();
  redirect("/admin/haberler");
}

export async function toggleNews(formData: FormData) {
  await requireAdmin();
  const id = clean(formData.get("id"));
  if (!id) return;
  const next = formData.get("is_active") !== "true";
  await getAdminClient().from("haberler").update({ is_active: next }).eq("id", id);
  refresh();
}

export async function deleteNews(formData: FormData) {
  await requireAdmin();
  const id = clean(formData.get("id"));
  if (!id) return;
  await getAdminClient().from("haberler").delete().eq("id", id);
  refresh();
}
