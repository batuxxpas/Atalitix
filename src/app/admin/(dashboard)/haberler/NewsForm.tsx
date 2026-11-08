import type { News } from "@/lib/news-utils";

const input = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400";
const label = "block text-xs font-semibold text-slate-600 mb-1.5";

/** Shared create/edit form for news items (server component, posts to a server action). */
export function NewsForm({
  action,
  item,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  item?: Partial<News> & { id?: string };
  submitLabel: string;
}) {
  const today = new Date().toISOString().slice(0, 10);
  return (
    <form action={action} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
      {item?.id && <input type="hidden" name="id" value={item.id} />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={label} htmlFor="tur">Tür</label>
          <select id="tur" name="tur" className={input} defaultValue={item?.tur ?? "bizden"}>
            <option value="bizden">Bizden Haberler</option>
            <option value="dunyadan">Dünyadan Haberler</option>
          </select>
        </div>
        <div>
          <label className={label} htmlFor="tarih">Tarih</label>
          <input id="tarih" name="tarih" type="date" defaultValue={item?.tarih ?? today} className={input} />
        </div>
        <div>
          <label className={label} htmlFor="kaynak_adi">Kaynak adı (opsiyonel)</label>
          <input id="kaynak_adi" name="kaynak_adi" defaultValue={item?.kaynak_adi ?? ""} placeholder="örn. Harvard Business Review" className={input} />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="baslik">Başlık *</label>
        <input id="baslik" name="baslik" required defaultValue={item?.baslik ?? ""} className={input} placeholder="Haber başlığı" />
      </div>

      <div>
        <label className={label} htmlFor="ozet">Kısa özet</label>
        <textarea id="ozet" name="ozet" rows={2} defaultValue={item?.ozet ?? ""} className={`${input} resize-y`} placeholder="Listelerde ve paylaşımlarda görünen 1-2 cümle" />
      </div>

      <div>
        <label className={label} htmlFor="icerik">Haber metni</label>
        <textarea id="icerik" name="icerik" rows={12} defaultValue={item?.icerik ?? ""} className={`${input} resize-y font-mono text-[13px] leading-relaxed`} placeholder={"Paragraflar arasında bir boş satır bırakın.\n\n## Ara başlık\n- Madde\n- Madde"} />
        <p className="mt-1.5 text-xs text-slate-400">
          Boş satır = yeni paragraf · <code className="font-mono">## </code> ile başlayan satır = ara başlık · <code className="font-mono">- </code> ile başlayan satırlar = madde listesi
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={label} htmlFor="gorsel">{item?.gorsel_url ? "Görseli değiştir" : "Görsel yükle"} (JPG, PNG, WebP · en fazla 5 MB)</label>
          <input id="gorsel" name="gorsel" type="file" accept="image/jpeg,image/png,image/webp" className={`${input} file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-slate-700`} />
        </div>
        <div>
          <label className={label} htmlFor="gorsel_url">…veya görsel bağlantısı</label>
          <input id="gorsel_url" name="gorsel_url" type="url" defaultValue={item?.gorsel_url ?? ""} className={input} placeholder="https://..." />
        </div>
      </div>
      {item?.gorsel_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.gorsel_url} alt="Mevcut görsel" className="h-28 rounded-lg border border-slate-200 object-cover" />
      )}
      <p className="text-xs text-slate-400 -mt-1">En iyi görünüm için 16:9 yatay görsel (örn. 1600×900) kullanın.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={label} htmlFor="link">Haber/kaynak bağlantısı (opsiyonel)</label>
          <input id="link" name="link" type="url" defaultValue={item?.link ?? ""} className={input} placeholder="https://..." />
        </div>
        <div>
          <label className={label} htmlFor="slug">Sayfa adresi (boş bırakılırsa başlıktan üretilir)</label>
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 pl-3 text-sm text-slate-400 focus-within:ring-2 focus-within:ring-indigo-500/30">
            /haberler/
            <input id="slug" name="slug" defaultValue={item?.slug ?? ""} className="w-full rounded-r-lg bg-white px-2 py-2.5 text-slate-900 focus:outline-none" placeholder="yeni-haber" />
          </div>
        </div>
      </div>

      <button type="submit" className="rounded-lg bg-[#0b1a4f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1d6cf2] transition-colors">
        {submitLabel}
      </button>
    </form>
  );
}
