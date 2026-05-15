"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function markAsRead(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  const supabase = await createClient();
  // @ts-ignore
  const { error } = await (supabase.from("iletisim_talepleri") as any)
    .update({ is_read: true })
    .eq("id", id);

  if (!error) {
    revalidatePath("/admin/contacts");
    revalidatePath("/admin"); // Dashboard'daki okunmamış bildirimini de güncelle
  }
}
