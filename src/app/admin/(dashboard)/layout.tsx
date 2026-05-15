import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { logoutAdmin } from "./actions";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <span className="text-xl font-bold tracking-tight text-white">{APP_NAME} Admin</span>
        </div>
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 font-medium text-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Dashboard
          </Link>
          <Link href="/admin/contacts" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 font-medium text-sm transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            İletişim Talepleri
          </Link>
          
          <div className="pt-4 pb-1">
            <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">İçerik Yönetimi</p>
          </div>
          {[
            { name: "Ana Sayfa İçerik", path: "ana_sayfa_icerik" },
            { name: "Çözümler", path: "cozumler" },
            { name: "Deneyim Maddeleri", path: "deneyim_maddeleri" },
            { name: "Harita Adımları", path: "isletim_haritasi_adimlari" },
            { name: "Harita Kategorileri", path: "isletim_haritasi_kategorileri" },
            { name: "Teknoloji Etiketleri", path: "teknoloji_etiketleri" },
            { name: "Yaklaşım Adımları", path: "yaklasim_adimlari" }
          ].map((table) => (
            <Link key={table.path} href={`/admin/content/${table.path}`} className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
              {table.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-sm transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Siteye Dön
          </Link>
          <form action={logoutAdmin}>
            <button type="submit" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-rose-400 hover:text-white hover:bg-rose-500/20 text-sm transition-colors text-left">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
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
