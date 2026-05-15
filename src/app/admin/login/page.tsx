"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { loginAdminUser } from "./actions";

export default function AdminLogin() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await loginAdminUser(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.success) {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] w-full max-w-md border border-slate-100 mx-4">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-6">
            <Image
              src="/atalitixlogo.png"
              alt="Atalitix Logo"
              width={200}
              height={60}
              className="h-12 w-auto object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Panel</h1>
          <p className="text-slate-500 text-sm mt-2">Yönetim sistemine giriş yapın</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              E-posta
            </label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all bg-slate-50 focus:bg-white"
              placeholder="admin@atalitix.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Şifre
            </label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all bg-slate-50 focus:bg-white"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2d3a8c] text-white font-semibold py-3.5 rounded-xl hover:bg-[#4f5ecb] transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none flex justify-center items-center mt-2"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Giriş Yap"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
