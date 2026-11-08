"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, getAdminClient } from "@/lib/admin/auth";

function clean(v: FormDataEntryValue | null): string | null {
  const s = String(v ?? "").trim();
  return s.length ? s : null;
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

  await getAdminClient().from("haberler").insert({
    tur,
    baslik,
    ozet: clean(formData.get("ozet")),
    kaynak_adi: clean(formData.get("kaynak_adi")),
    link,
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
