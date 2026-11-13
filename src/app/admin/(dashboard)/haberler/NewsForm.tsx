"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { ImagePlus, Trash2, Loader2, Link2, CheckCircle2, Info } from "lucide-react";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { isHtml, legacyToHtml, type News } from "@/lib/news-utils";
import type { LinkPreviewResult } from "./actions";

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

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Plain text (e.g. an Instagram caption) → editor paragraphs. */
function textToHtml(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

/**
 * Cover image: shows the current/auto image, or a drop zone.
 * An uploaded file wins; otherwise `gorsel_url` carries an automatically fetched image.
 */
function CoverPicker({ current, autoUrl, onClearAuto }: { current?: string | null; autoUrl: string | null; onClearAuto: () => void }) {
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [removed, setRemoved] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const shown = removed ? null : filePreview ?? autoUrl ?? current ?? null;

  const takeFile = (file: File | undefined) => {
    if (!file || !fileRef.current) return;
    const dt = new DataTransfer();
    dt.items.add(file);
    fileRef.current.files = dt.files;
    setFilePreview(URL.createObjectURL(file));
    setRemoved(false);
  };

  const remove = () => {
    setRemoved(true);
    setFilePreview(null);
    if (fileRef.current) fileRef.current.value = "";
    onClearAuto();
  };

  return (
    <div>
      <input ref={fileRef} type="file" name="gorsel" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => takeFile(e.target.files?.[0])} />
      <input type="hidden" name="gorsel_url" value={!removed && !filePreview && autoUrl ? autoUrl : ""} />
      <input type="hidden" name="gorsel_kaldir" value={removed ? "1" : ""} />

      {shown ? (
        <div className="relative overflow-hidden rounded-lg border border-slate-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={shown} alt="Kapak önizleme" className="aspect-video w-full bg-slate-100 object-contain" />
          {autoUrl && !filePreview && !removed && (
            <span className="absolute left-2 top-2 rounded-md bg-white/95 px-2 py-1 text-[11px] font-semibold text-emerald-700">Bağlantıdan alındı</span>
          )}
          <div className="absolute inset-x-0 bottom-0 flex gap-2 bg-gradient-to-t from-black/60 to-transparent p-2.5">
            <button type="button" onClick={() => fileRef.current?.click()} className="rounded-md bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-white">
              Değiştir
            </button>
            <button type="button" onClick={remove} className="flex items-center gap-1 rounded-md bg-white/95 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-white">
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
  previewLink,
  item,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  uploadImage: (formData: FormData) => Promise<{ url?: string; error?: string }>;
  previewLink: (link: string) => Promise<LinkPreviewResult>;
  item?: Partial<News> & { id?: string };
  submitLabel: string;
}) {
  const today = new Date().toISOString().slice(0, 10);

  const [tur, setTur] = useState<string>(item?.tur ?? "bizden");
  const [link, setLink] = useState(item?.link ?? "");
  const [ozet, setOzet] = useState(item?.ozet ?? "");
  const [kaynak, setKaynak] = useState(item?.kaynak_adi ?? "");
  const [tarih, setTarih] = useState(item?.tarih ?? today);
  const [body, setBody] = useState(item?.icerik ? (isHtml(item.icerik) ? item.icerik : legacyToHtml(item.icerik)) : "");
  const [editorKey, setEditorKey] = useState(0);
  const [autoImage, setAutoImage] = useState<string | null>(null);
  const [status, setStatus] = useState<{ kind: "loading" | "ok" | "info"; text: string } | null>(null);
  const lastFetched = useRef<string>(item?.link ?? "");

  const hasCover = !!item?.gorsel_url;

  const fetchPreview = async (raw: string) => {
    const value = raw.trim();
    if (!/^https?:\/\/\S+\.\S+/i.test(value) || value === lastFetched.current) return;
    lastFetched.current = value;
    setStatus({ kind: "loading", text: "Bağlantıdaki görsel ve metin alınıyor…" });

    const res = await previewLink(value);
    const filled: string[] = [];

    // Never silently replace a cover the editor already chose
    if (res.imageUrl && !hasCover) { setAutoImage(res.imageUrl); filled.push("görsel"); }
    if (res.description && !ozet.trim()) {
      setOzet(res.description.length > 220 ? res.description.slice(0, 217).replace(/\s+\S*$/, "") + "…" : res.description);
      filled.push("kısa özet");
    }
    if (res.description && !res.platform && !body.replace(/<[^>]*>/g, "").trim()) {
      setBody(textToHtml(res.description));
      setEditorKey((k) => k + 1);
      filled.push("haber metni");
    }
    if (res.siteName && !res.platform && !kaynak.trim()) { setKaynak(res.siteName); filled.push("kaynak adı"); }
    if (res.date) { setTarih(res.date); filled.push("tarih"); }
    if (res.platform === "LinkedIn" || res.platform === "Instagram") {
      if (tur !== "bizden" && !item?.id) setTur("bizden");
    }

    if (filled.length) setStatus({ kind: "ok", text: `Bağlantıdan alındı: ${filled.join(", ")}. Dilediğiniz gibi düzenleyebilirsiniz.` });
    else setStatus({ kind: "info", text: res.error ?? "Doldurulacak yeni bilgi bulunamadı; mevcut alanlar korunmuştur." });
  };

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

        {/* Paste a link → fill the form */}
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900" htmlFor="link">
            <Link2 size={16} className="text-indigo-600" />
            LinkedIn, Instagram veya haber bağlantısı
            <span className="font-normal text-slate-400">· isteğe bağlı</span>
          </label>
          <div className="flex gap-2">
            <input
              id="link"
              name="link"
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              onPaste={(e) => { const v = e.clipboardData.getData("text"); setTimeout(() => fetchPreview(v), 0); }}
              onBlur={() => fetchPreview(link)}
              placeholder="Bağlantıyı buraya yapıştırın"
              className={`${input} bg-white`}
            />
            <button
              type="button"
              onClick={() => { lastFetched.current = ""; fetchPreview(link); }}
              disabled={!link.trim() || status?.kind === "loading"}
              className="shrink-0 rounded-lg border border-indigo-200 bg-white px-4 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 disabled:opacity-40"
            >
              Bilgileri getir
            </button>
          </div>
          {status ? (
            <p className={`mt-2.5 flex items-start gap-2 text-xs leading-relaxed ${status.kind === "ok" ? "text-emerald-700" : status.kind === "info" ? "text-amber-700" : "text-slate-500"}`}>
              {status.kind === "loading" ? <Loader2 size={14} className="mt-px shrink-0 animate-spin" /> : status.kind === "ok" ? <CheckCircle2 size={14} className="mt-px shrink-0" /> : <Info size={14} className="mt-px shrink-0" />}
              {status.text}
            </p>
          ) : (
            <p className="mt-2.5 text-xs leading-relaxed text-slate-500">
              Bağlantıyı yapıştırdığınızda görsel ve metin otomatik gelir; başlığı siz yazarsınız. LinkedIn ve Instagram paylaşımları haberin içinde de gösterilir.
            </p>
          )}
        </div>

        <div>
          <label className={label} htmlFor="ozet">Kısa özet</label>
          <textarea
            id="ozet"
            name="ozet"
            rows={2}
            value={ozet}
            onChange={(e) => setOzet(e.target.value)}
            className={`${input} resize-y`}
            placeholder="Haber listelerinde ve sosyal medya paylaşımlarında görünen 1-2 cümle"
          />
        </div>

        <div>
          <span className={label}>Haber metni</span>
          <RichTextEditor key={editorKey} name="icerik" initialHtml={body} onChange={setBody} onUploadImage={onUploadImage} />
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
          <input id="tarih" name="tarih" type="date" value={tarih} onChange={(e) => setTarih(e.target.value)} className={input} />

          <div className="mt-5">
            <SubmitButton label={submitLabel} />
          </div>
        </div>

        <div className={card}>
          <p className="mb-3 text-sm font-semibold text-slate-900">Kapak görseli</p>
          <CoverPicker current={item?.gorsel_url} autoUrl={autoImage} onClearAuto={() => setAutoImage(null)} />
        </div>

        <details className={`${card} group`} open={!!kaynak}>
          <summary className="cursor-pointer list-none text-sm font-semibold text-slate-900 flex items-center justify-between">
            Kaynak adı
            <span className="text-xs font-normal text-slate-400 group-open:hidden">Başka bir siteden haberse</span>
          </summary>
          <div className="mt-4">
            <input id="kaynak_adi" name="kaynak_adi" value={kaynak} onChange={(e) => setKaynak(e.target.value)} placeholder="örn. Dünya Gazetesi" className={input} />
          </div>
        </details>

        <details className={card}>
          <summary className="cursor-pointer list-none text-sm font-semibold text-slate-500">Gelişmiş ayarlar</summary>
          <div className="mt-4">
            <label className={label} htmlFor="slug">Sayfa adresi</label>
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 pl-3 text-xs text-slate-400">
              /haberler/
              <input id="slug" name="slug" defaultValue={item?.slug ?? ""} className="w-full rounded-r-lg bg-white px-2 py-2.5 text-sm text-slate-900 focus:outline-none" placeholder="boş bırakılırsa başlıktan oluşur" />
            </div>
          </div>
        </details>
      </aside>
    </form>
  );
}
