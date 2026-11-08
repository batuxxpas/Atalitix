import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { ADMIN_COOKIE, verifySessionToken } from "./session";

/** Tables the admin panel may read and edit. Everything else is refused. */
export const EDITABLE_TABLES = [
  "ana_sayfa_icerik",
  "cozumler",
  "cozum_alt_basliklari",
  "deneyim_maddeleri",
  "haberler",
  "isletim_haritasi_adimlari",
  "isletim_haritasi_kategorileri",
  "teknoloji_etiketleri",
  "yaklasim_adimlari",
] as const;

export function isEditableTable(name: string): boolean {
  return (EDITABLE_TABLES as readonly string[]).includes(name);
}

/**
 * Guard for admin pages and server actions.
 * Server actions are public HTTP endpoints, so every one of them must call this.
 */
export async function requireAdmin(): Promise<string> {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  const uid = await verifySessionToken(token);
  if (!uid) redirect("/admin/login");
  return uid;
}

/** Service-role client — bypasses RLS. Server only, and only after requireAdmin(). */
export function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_SERVICE_ROLE_KEY tanımlı değil.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
