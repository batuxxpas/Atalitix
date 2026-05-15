"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Input, Card, CardContent } from "@/components/ui";
import { APP_NAME } from "@/lib/constants";
import type { FormState } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>({
    status: "idle",
    message: null,
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState({ status: "loading", message: null });

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setFormState({ status: "error", message: error.message });
      return;
    }

    setFormState({ status: "success", message: "Giriş başarılı!" });
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
            A
          </div>
          <h1 className="text-2xl font-bold text-white">
            {APP_NAME}&apos;e Giriş Yap
          </h1>
          <p className="text-slate-400 mt-2">
            Hesabınıza giriş yaparak devam edin
          </p>
        </div>

        {/* Form */}
        <Card variant="glass">
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="E-posta"
                type="email"
                placeholder="ornek@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Şifre"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {formState.status === "error" && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {formState.message}
                </div>
              )}

              {formState.status === "success" && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                  {formState.message}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                isLoading={formState.status === "loading"}
              >
                Giriş Yap
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                Hesabınız yok mu?{" "}
                <Link
                  href="/register"
                  className="text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  Kayıt Ol
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
