"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, getAdminClient } from "@/lib/admin/auth";

export async function markAsRead(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  if (!id) return;

  const { error } = await getAdminClient()
    .from("iletisim_talepleri")
    .update({ is_read: true })
    .eq("id", id);

  if (!error) {
    revalidatePath("/admin/contacts");
    revalidatePath("/admin"); // Dashboard'daki okunmamış bildirimini de güncelle
  }
}
