import Link from "next/link";
import { requireAdmin, getAdminClient } from "@/lib/admin/auth";
import { newsHref, type News } from "@/lib/news-utils";
import { createNews, toggleNews, deleteNews } from "./actions";
import { NewsForm } from "./NewsForm";

export const revalidate = 0;

type Row = News & { is_active: boolean };

export default async function AdminNewsPage() {
  await requireAdmin();
  const { data, error } = await getAdminClient()
    .from("haberler")
    .select("*")
    .order("tarih", { ascending: false });

  const rows = (data ?? []) as unknown as Row[];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Haberler</h2>
          <p className="text-slate-500 text-sm mt-1">
            Sitedeki <Link href="/haberler" target="_blank" className="text-indigo-600 hover:underline">/haberler</Link> sayfası ve ana sayfadaki Gündem bölümü buradan yönetilir.
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
          Haberler tablosuna erişilemedi ({error.message}). <code className="font-mono">supabase/2026-11-08-haber-modulu.sql</code> dosyasının SQL Editor&apos;de çalıştırılması gerekiyor.
        </div>
      )}

      {/* List */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm divide-y divide-slate-100">
        {rows.length === 0 && <p className="p-6 text-sm text-slate-500">Henüz haber yok.</p>}
        {rows.map((r) => (
          <div key={r.id} className="flex flex-col md:flex-row md:items-start gap-4 p-5">
            {r.gorsel_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={r.gorsel_url} alt="" className="h-20 w-36 shrink-0 rounded-lg object-cover border border-slate-200" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className={`text-[11px] font-semibold rounded px-2 py-0.5 ${r.tur === "bizden" ? "bg-indigo-50 text-indigo-700" : "bg-sky-50 text-sky-700"}`}>
                  {r.tur === "bizden" ? "Bizden" : "Dünyadan"}
                </span>
                <span className="text-xs text-slate-400">{new Date(r.tarih).toLocaleDateString("tr-TR")}</span>
                {!r.is_active && <span className="text-[11px] font-semibold rounded px-2 py-0.5 bg-slate-100 text-slate-500">Yayında değil</span>}
                {!r.icerik && <span className="text-[11px] font-semibold rounded px-2 py-0.5 bg-amber-50 text-amber-700">Metin yok</span>}
              </div>
              <p className="font-semibold text-slate-900">{r.baslik}</p>
              {r.ozet && <p className="text-sm text-slate-500 mt-1 line-clamp-2">{r.ozet}</p>}
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <Link href={`/admin/haberler/${r.id}`} className="rounded-lg border border-indigo-200 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50">
                Düzenle
              </Link>
              {r.is_active && (
                <Link href={newsHref(r)} target="_blank" className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                  Görüntüle ↗
                </Link>
              )}
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

      {/* New item */}
      <h3 className="mt-12 mb-4 text-lg font-bold text-slate-900">Yeni haber ekle</h3>
      <NewsForm action={createNews} submitLabel="Yayınla" />
    </div>
  );
}
