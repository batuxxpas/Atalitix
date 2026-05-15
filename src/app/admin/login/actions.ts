"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function loginAdminUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Lütfen e-posta ve şifrenizi girin." };
  }

  const supabase = await createClient();
  
  // Custom admin_users tablosundan kontrol et
  const { data, error } = await (supabase
    .from("admin_users") as any)
    .select("*")
    .eq("email", email)
    .single();

  if (error || !data) {
    return { error: "Giriş başarısız. Lütfen bilgilerinizi kontrol edin." };
  }

  // Şifre kontrolü (Şimdilik düz metin kontrolü, ileride bcrypt eklenebilir)
  if (data.password_hash !== password) {
    return { error: "Giriş başarısız. Lütfen bilgilerinizi kontrol edin." };
  }

  // Başarılıysa özel bir admin token cookie'si oluştur
  const cookieStore = await cookies();
  cookieStore.set("admin_token", data.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 hafta
  });

  return { success: true };
}
