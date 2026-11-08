"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, getAdminClient, isEditableTable } from "@/lib/admin/auth";

export async function updateTableRow(tableName: string, id: string, data: Record<string, unknown>) {
  await requireAdmin();
  if (!isEditableTable(tableName)) return { error: "Bu tablo düzenlenemez." };

  const { error } = await getAdminClient().from(tableName).update(data).eq("id", id);
  if (error) {
    console.error("Update error:", error);
    return { error: error.message };
  }
  revalidatePath("/");
  return { success: true };
}
