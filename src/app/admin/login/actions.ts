"use server";

import { cookies } from "next/headers";
import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";
import { getAdminClient } from "@/lib/admin/auth";
import { ADMIN_COOKIE, ADMIN_SESSION_MAX_AGE, createSessionToken } from "@/lib/admin/session";

const GENERIC_ERROR = "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.";

function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return `scrypt$${salt.toString("base64")}$${hash.toString("base64")}`;
}

/** Verifies scrypt hashes; also accepts legacy plain-text rows (upgraded on success). */
function verifyPassword(password: string, stored: string): { ok: boolean; legacy: boolean } {
  if (stored.startsWith("scrypt$")) {
    const [, salt, hash] = stored.split("$");
    const expected = Buffer.from(hash ?? "", "base64");
    if (!salt || expected.length === 0) return { ok: false, legacy: false };
    const actual = scryptSync(password, Buffer.from(salt, "base64"), expected.length);
    return { ok: timingSafeEqual(expected, actual), legacy: false };
  }
  const a = Buffer.from(stored);
  const b = Buffer.from(password);
  return { ok: a.length === b.length && timingSafeEqual(a, b), legacy: true };
}

export async function loginAdminUser(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Lütfen e-posta ve şifrenizi girin." };
  }

  const supabase = getAdminClient();
  const { data, error } = await supabase.from("admin_users").select("*").eq("email", email).maybeSingle();
  if (error || !data) return { error: GENERIC_ERROR };

  const column = typeof data.password === "string" ? "password" : "password_hash";
  const stored = String(data[column] ?? "");
  if (!stored) return { error: GENERIC_ERROR };

  const { ok, legacy } = verifyPassword(password, stored);
  if (!ok) return { error: GENERIC_ERROR };

  // One-time upgrade: replace the plain-text password with a salted scrypt hash
  if (legacy) {
    await supabase.from("admin_users").update({ [column]: hashPassword(password) }).eq("id", data.id);
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, await createSessionToken(String(data.id)), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
  });

  return { success: true };
}
