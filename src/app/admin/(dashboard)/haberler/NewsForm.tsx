"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { ImagePlus, Trash2, Loader2 } from "lucide-react";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { isHtml, legacyToHtml, type News } from "@/lib/news-utils";

const input = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400";
const label = "block text-xs font-semibold text-slate-600 mb-1.5";
const card = "rounded-xl border border-slate-200 bg-white p-5";

function SubmitButton({ label: text }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0b1a4f] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1d6cf2] disabled:opacity-60"
    >
      {pending && <Loader2 size={16} className="animate-spin" />}
      {pending ? "Kaydediliyor…" : text}
    </button>
  );
}

/** Cover image picker: click or drag & drop, with preview and remove. */
function CoverPicker({ current }: { current?: string | null }) {
  const [preview, setPreview] = useState<string | null>(current ?? null);
  const [removed, setRemoved] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const takeFile = (file: File | undefined) => {
    if (!file || !fileRef.current) return;
    const dt = new DataTransfer();
    dt.items.add(file);
    fileRef.current.files = dt.files;
    setPreview(URL.createObjectURL(file));
    setRemoved(false);
  };

  return (
    <div>
      <input
        ref={fileRef}
        type="file"
        name="gorsel"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => takeFile(e.target.files?.[0])}
      />
      <input type="hidden" name="gorsel_kaldir" value={removed ? "1" : ""} />

      {preview && !removed ? (
        <div className="group relative overflow-hidden rounded-lg border border-slate-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Kapak önizleme" className="aspect-video w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 flex gap-2 bg-gradient-to-t from-black/60 to-transparent p-2.5">
            <button type="button" onClick={() => fileRef.current?.click()} className="rounded-md bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-white">
              Değiştir
            </button>
            <button
              type="button"
              onClick={() => { setRemoved(true); if (fileRef.current) fileRef.current.value = ""; }}
              className="flex items-center gap-1 rounded-md bg-white/95 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-white"
            >
              <Trash2 size={13} /> Kaldır
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); takeFile(e.dataTransfer.files?.[0]); }}
          className={`flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed text-sm transition-colors ${
            dragging ? "border-indigo-400 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-500 hover:border-indigo-300 hover:bg-slate-50"
          }`}
        >
          <ImagePlus size={24} />
          <span className="font-semibold">Görsel seç veya buraya sürükle</span>
          <span className="text-xs text-slate-400">JPG, PNG, WebP · en fazla 5 MB · yatay görsel önerilir</span>
        </button>
      )}
    </div>
  );
}

/** Shared create/edit form for news items. */
export function NewsForm({
  action,
  uploadImage,
  item,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  uploadImage: (formData: FormData) => Promise<{ url?: string; error?: string }>;
  item?: Partial<News> & { id?: string };
  submitLabel: string;
}) {
  const [tur, setTur] = useState<string>(item?.tur ?? "bizden");
  const today = new Date().toISOString().slice(0, 10);
  const initialHtml = item?.icerik ? (isHtml(item.icerik) ? item.icerik : legacyToHtml(item.icerik)) : "";

  const onUploadImage = async (file: File) => {
    const fd = new FormData();
    fd.append("gorsel", file);
    const res = await uploadImage(fd);
    return res.url ?? null;
  };

  return (
    <form action={action} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {item?.id && <input type="hidden" name="id" value={item.id} />}
      <input type="hidden" name="tur" value={tur} />

      {/* Main column */}
      <div className="lg:col-span-8 space-y-5">
        <div>
          <label className="sr-only" htmlFor="baslik">Başlık</label>
          <input
            id="baslik"
            name="baslik"
            required
            defaultValue={item?.baslik ?? ""}
            placeholder="Haber başlığı"
            className="w-full rounded-xl border border-slate-200 bg-white px-5 py-4 text-2xl font-semibold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
          />
        </div>

        <div>
          <label className={label} htmlFor="ozet">Kısa özet</label>
          <textarea
            id="ozet"
            name="ozet"
            rows={2}
            defaultValue={item?.ozet ?? ""}
            className={`${input} resize-y`}
            placeholder="Haber listelerinde ve sosyal medya paylaşımlarında görünen 1-2 cümle"
          />
        </div>

        <div>
          <span className={label}>Haber metni</span>
          <RichTextEditor name="icerik" initialHtml={initialHtml} onUploadImage={onUploadImage} />
        </div>
      </div>

      {/* Sidebar */}
      <aside className="lg:col-span-4 space-y-5">
        <div className={card}>
          <p className="mb-3 text-sm font-semibold text-slate-900">Yayın</p>
          <span className={label}>Haber türü</span>
          <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
            {[
              { key: "bizden", text: "Bizden" },
              { key: "dunyadan", text: "Dünyadan" },
            ].map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTur(t.key)}
                aria-pressed={tur === t.key}
                className={`rounded-md py-2 text-sm font-semibold transition-colors ${tur === t.key ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
              >
                {t.text}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-slate-400">
            {tur === "bizden" ? "Etkinlikler, projeler ve şirketten gelişmeler" : "Sektör ve teknoloji gündemi"}
          </p>

          <label className={`${label} mt-4`} htmlFor="tarih">Yayın tarihi</label>
          <input id="tarih" name="tarih" type="date" defaultValue={item?.tarih ?? today} className={input} />

          <div className="mt-5">
            <SubmitButton label={submitLabel} />
          </div>
        </div>

        <div className={card}>
          <p className="mb-3 text-sm font-semibold text-slate-900">Kapak görseli</p>
          <CoverPicker current={item?.gorsel_url} />
        </div>

        <div className={card}>
          <p className="mb-1 text-sm font-semibold text-slate-900">LinkedIn / Instagram paylaşımı</p>
          <p className="mb-3 text-xs leading-relaxed text-slate-400">
            Paylaşımın linkini yapıştırın; paylaşım haberin içinde LinkedIn veya Instagram görünümüyle gösterilir. Başka bir haber sitesinin linkini de ekleyebilirsiniz.
          </p>
          <input id="link" name="link" type="url" defaultValue={item?.link ?? ""} className={input} placeholder="https://www.linkedin.com/posts/..." />
          <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
            LinkedIn&apos;de paylaşımın sağ üstündeki <b>…</b> menüsünden <b>&quot;Gönderinin bağlantısını kopyala&quot;</b>, Instagram&apos;da <b>Paylaş → Bağlantıyı kopyala</b>.
          </p>
        </div>

        <details className={`${card} group`} open={!!item?.kaynak_adi}>
          <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900 flex items-center justify-between">
            Kaynak adı
            <span className="text-xs font-normal text-slate-400 group-open:hidden">Başka bir siteden haberse</span>
          </summary>
          <div className="mt-4">
            <input id="kaynak_adi" name="kaynak_adi" defaultValue={item?.kaynak_adi ?? ""} placeholder="örn. Dünya Gazetesi" className={input} />
          </div>
        </details>

        <details className={card}>
          <summary className="cursor-pointer list-none text-sm font-semibold text-slate-500">Gelişmiş ayarlar</summary>
          <div className="mt-4 space-y-3">
            <div>
              <label className={label} htmlFor="slug">Sayfa adresi</label>
              <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 pl-3 text-xs text-slate-400">
                /haberler/
                <input id="slug" name="slug" defaultValue={item?.slug ?? ""} className="w-full rounded-r-lg bg-white px-2 py-2.5 text-sm text-slate-900 focus:outline-none" placeholder="boş bırakılırsa başlıktan oluşur" />
              </div>
            </div>
            <div>
              <label className={label} htmlFor="gorsel_url">Kapak için görsel bağlantısı</label>
              <input id="gorsel_url" name="gorsel_url" type="url" defaultValue="" className={input} placeholder="https://... (dosya yüklemek yerine)" />
            </div>
          </div>
        </details>
      </aside>
    </form>
  );
}
