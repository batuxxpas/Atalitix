"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function markAsRead(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  const supabase = await createClient();
  const { error } = await supabase
    .from("iletisim_talepleri")
    .update({ is_read: true } as any)
    .eq("id", id);

  if (!error) {
    revalidatePath("/admin/contacts");
    revalidatePath("/admin"); // Dashboard'daki okunmamış bildirimini de güncelle
  }
}
