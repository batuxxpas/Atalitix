import { requireAdmin, getAdminClient } from "@/lib/admin/auth";
import { createNews, toggleNews, deleteNews } from "./actions";

export const revalidate = 0;

type Row = {
  id: string;
  tur: "bizden" | "dunyadan";
  baslik: string;
  ozet: string | null;
  kaynak_adi: string | null;
  link: string | null;
  tarih: string;
  is_active: boolean;
};

const input = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400";
const label = "block text-xs font-semibold text-slate-600 mb-1.5";

export default async function AdminNewsPage() {
  await requireAdmin();
  const { data, error } = await getAdminClient()
    .from("haberler")
    .select("*")
    .order("tarih", { ascending: false });

  const rows = (data ?? []) as Row[];
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-900">Haberler</h2>
      <p className="text-slate-500 text-sm mt-1 mb-8">
        Ana sayfadaki &quot;Bizden Haberler&quot; ve &quot;Dünyadan Haberler&quot; sekmeleri buradan yönetilir. Yayındaki haber yoksa bölüm sitede görünmez.
      </p>

      {error && (
        <div className="mb-8 rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
          Haberler tablosu bulunamadı. Supabase SQL Editor&apos;de <code className="font-mono">supabase/2026-11-08-guvenlik-ve-haberler.sql</code> dosyasının çalıştırılması gerekiyor.
        </div>
      )}

      {/* New item */}
      <form action={createNews} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-10 space-y-4">
        <h3 className="font-semibold text-slate-900">Yeni haber ekle</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={label} htmlFor="tur">Tür</label>
            <select id="tur" name="tur" className={input} defaultValue="bizden">
              <option value="bizden">Bizden Haberler</option>
              <option value="dunyadan">Dünyadan Haberler</option>
            </select>
          </div>
          <div>
            <label className={label} htmlFor="tarih">Tarih</label>
            <input id="tarih" name="tarih" type="date" defaultValue={today} className={input} />
          </div>
          <div>
            <label className={label} htmlFor="kaynak_adi">Kaynak adı (opsiyonel)</label>
            <input id="kaynak_adi" name="kaynak_adi" placeholder="örn. Harvard Business Review" className={input} />
          </div>
        </div>
        <div>
          <label className={label} htmlFor="baslik">Başlık *</label>
          <input id="baslik" name="baslik" required className={input} placeholder="Haber başlığı" />
        </div>
        <div>
          <label className={label} htmlFor="ozet">Kısa özet</label>
          <textarea id="ozet" name="ozet" rows={3} className={`${input} resize-y`} placeholder="2-3 cümlelik özet" />
        </div>
        <div>
          <label className={label} htmlFor="link">Bağlantı (opsiyonel)</label>
          <input id="link" name="link" type="url" className={input} placeholder="https://..." />
        </div>
        <button type="submit" className="rounded-lg bg-[#0b1a4f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1d6cf2] transition-colors">
          Yayınla
        </button>
      </form>

      {/* List */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm divide-y divide-slate-100">
        {rows.length === 0 && <p className="p-6 text-sm text-slate-500">Henüz haber yok.</p>}
        {rows.map((r) => (
          <div key={r.id} className="flex flex-col md:flex-row md:items-start gap-4 p-5">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className={`text-[11px] font-semibold rounded px-2 py-0.5 ${r.tur === "bizden" ? "bg-indigo-50 text-indigo-700" : "bg-sky-50 text-sky-700"}`}>
                  {r.tur === "bizden" ? "Bizden" : "Dünyadan"}
                </span>
                <span className="text-xs text-slate-400">{new Date(r.tarih).toLocaleDateString("tr-TR")}</span>
                {!r.is_active && <span className="text-[11px] font-semibold rounded px-2 py-0.5 bg-slate-100 text-slate-500">Yayında değil</span>}
              </div>
              <p className="font-semibold text-slate-900">{r.baslik}</p>
              {r.ozet && <p className="text-sm text-slate-500 mt-1 line-clamp-2">{r.ozet}</p>}
            </div>
            <div className="flex gap-2 shrink-0">
              <form action={toggleNews}>
                <input type="hidden" name="id" value={r.id} />
                <input type="hidden" name="is_active" value={String(r.is_active)} />
                <button className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                  {r.is_active ? "Yayından kaldır" : "Yayınla"}
                </button>
              </form>
              <form action={deleteNews}>
                <input type="hidden" name="id" value={r.id} />
                <button className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50">
                  Sil
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
