import Link from "next/link";
import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import { logoutAdmin } from "./actions";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex font-sans">
      {/* Sidebar */}
      <aside className="w-[280px] bg-[#FAFAFA] text-slate-600 flex-shrink-0 hidden md:flex flex-col border-r border-slate-200 shadow-sm z-20">
        <div className="h-20 flex items-center px-8 border-b border-slate-200 bg-white/50">
          <Image 
            src="/atalitixlogo.png" 
            alt="Atalitix Logo" 
            width={160} 
            height={40} 
            className="h-9 w-auto object-contain drop-shadow-sm"
          />
        </div>
        <nav className="p-5 space-y-1.5 flex-1 overflow-y-auto custom-scrollbar">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white text-indigo-600 font-semibold text-sm border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Dashboard
          </Link>
          <Link href="/admin/contacts" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium text-sm transition-all group">
            <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            İletişim Talepleri
          </Link>
          <Link href="/admin/haberler" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium text-sm transition-all group">
            <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
            Haberler
          </Link>
          
          <div className="pt-6 pb-2">
            <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">SİTE YÖNETİMİ</p>
          </div>
          <Link href="/admin/editor" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-50 text-emerald-600 font-semibold text-sm transition-all border border-emerald-100 hover:bg-emerald-100 hover:shadow-[0_2px_15px_rgba(16,185,129,0.1)] group relative overflow-hidden">
            <div className="absolute inset-0 bg-emerald-100/50 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            <span className="relative z-10">Görsel Editör (Canlı)</span>
            <div className="absolute right-3 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </Link>

          <div className="pt-6 pb-2">
            <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">VERİTABANI TABLOLARI</p>
          </div>
          {[
            { name: "Ana Sayfa İçerik", path: "ana_sayfa_icerik" },
            { name: "Çözümler", path: "cozumler" },
            { name: "Çözüm Alt Başlıkları", path: "cozum_alt_basliklari" },
            { name: "Deneyim Maddeleri", path: "deneyim_maddeleri" },
            { name: "Harita Adımları", path: "isletim_haritasi_adimlari" },
            { name: "Harita Kategorileri", path: "isletim_haritasi_kategorileri" },
            { name: "Yaklaşım Adımları", path: "yaklasim_adimlari" }
          ].map((table) => (
            <Link key={table.path} href={`/admin/content/${table.path}`} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-sm transition-all group">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-indigo-400 transition-colors" />
              {table.name}
            </Link>
          ))}
        </nav>
        <div className="p-5 border-t border-slate-200 space-y-2 bg-slate-50/50">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-sm transition-all group">
            <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Siteye Dön
          </Link>
          
          <form action={logoutAdmin}>
            <button type="submit" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 text-sm transition-all group">
              <svg className="w-5 h-5 text-slate-400 group-hover:text-rose-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Çıkış Yap
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8 shadow-sm">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-slate-900">Admin Panel</h1>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
