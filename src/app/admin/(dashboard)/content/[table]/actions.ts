"use server";
import { createClient } from "@/lib/supabase/server";

export async function updateTableRow(tableName: string, id: any, data: any) {
  const supabase = await createClient();
  const { error } = await (supabase.from(tableName) as any).update(data).eq("id", id);
  if (error) {
    console.error("Update error:", error);
    return { error: error.message };
  }
  return { success: true };
}
