"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, getAdminClient } from "@/lib/admin/auth";

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

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin/haberler");
}

export async function createNews(formData: FormData) {
  await requireAdmin();
  const baslik = clean(formData.get("baslik"));
  const tur = clean(formData.get("tur"));
  if (!baslik || (tur !== "bizden" && tur !== "dunyadan")) return;

  const link = clean(formData.get("link"));
  if (link && !/^https?:\/\//i.test(link)) return; // only real web links

  // Image: an uploaded file wins over a pasted URL
  let gorsel_url = clean(formData.get("gorsel_url"));
  if (gorsel_url && !/^https:\/\//i.test(gorsel_url)) gorsel_url = null;
  const file = formData.get("gorsel");
  if (file instanceof File && file.size > 0) {
    gorsel_url = (await uploadImage(file)) ?? gorsel_url;
  }

  await getAdminClient().from("haberler").insert({
    tur,
    baslik,
    ozet: clean(formData.get("ozet")),
    kaynak_adi: clean(formData.get("kaynak_adi")),
    link,
    gorsel_url,
    tarih: clean(formData.get("tarih")) ?? new Date().toISOString().slice(0, 10),
  });
  refresh();
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
