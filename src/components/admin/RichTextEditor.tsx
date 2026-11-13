"use client";

import { useRef, useState } from "react";
import { useEditor, useEditorState, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle, FontSize, Color } from "@tiptap/extension-text-style";
import { Placeholder } from "@tiptap/extensions";
import {
  Bold, Italic, Underline, Strikethrough, List, ListOrdered, Quote, Link as LinkIcon, Unlink,
  ImagePlus, AlignLeft, AlignCenter, AlignRight, AlignJustify, Undo2, Redo2, Minus,
  RemoveFormatting, Palette, Loader2, Check, X,
} from "lucide-react";

const SIZES = [
  { label: "Küçük", value: "15px" },
  { label: "Normal", value: "" },
  { label: "Büyük", value: "20px" },
  { label: "Çok büyük", value: "24px" },
];

const COLORS = [
  { label: "Varsayılan", value: "" },
  { label: "Lacivert", value: "#0b1a4f" },
  { label: "Mavi", value: "#1d6cf2" },
  { label: "Gri", value: "#6b7183" },
  { label: "Yeşil", value: "#15803d" },
  { label: "Kırmızı", value: "#b91c1c" },
];

function Btn({ onClick, active, disabled, title, children }: { onClick: () => void; active?: boolean; disabled?: boolean; title: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()} // keep the text selection
      onClick={onClick}
      className={`flex h-9 min-w-9 items-center justify-center rounded-md px-2 text-slate-600 transition-colors disabled:opacity-30 ${
        active ? "bg-indigo-100 text-indigo-700" : "hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <span className="mx-1 h-6 w-px bg-slate-200" aria-hidden="true" />;
}

function Toolbar({ editor, onUploadImage }: { editor: Editor; onUploadImage: (file: File) => Promise<string | null> }) {
  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      block: e.isActive("heading", { level: 2 }) ? "h2" : e.isActive("heading", { level: 3 }) ? "h3" : "p",
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      underline: e.isActive("underline"),
      strike: e.isActive("strike"),
      bullet: e.isActive("bulletList"),
      ordered: e.isActive("orderedList"),
      quote: e.isActive("blockquote"),
      link: e.isActive("link"),
      align: (["center", "right", "justify"].find((a) => e.isActive({ textAlign: a })) ?? "left") as string,
      size: (e.getAttributes("textStyle").fontSize as string) || "",
      color: (e.getAttributes("textStyle").color as string) || "",
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });

  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [colorOpen, setColorOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const chain = () => editor.chain().focus();

  const applyLink = () => {
    const url = linkUrl.trim();
    if (!url) chain().extendMarkRange("link").unsetLink().run();
    else chain().extendMarkRange("link").setLink({ href: /^(https?:|mailto:|tel:)/i.test(url) ? url : `https://${url}` }).run();
    setLinkOpen(false);
  };

  const pickImage = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    const url = await onUploadImage(file);
    setUploading(false);
    if (url) chain().setImage({ src: url, alt: "" }).run();
    else alert("Görsel yüklenemedi. JPG, PNG veya WebP formatında ve en fazla 5 MB olmalı.");
  };

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-white/95 px-2 py-1.5 backdrop-blur">
      <Btn title="Geri al" onClick={() => chain().undo().run()} disabled={!s.canUndo}><Undo2 size={16} /></Btn>
      <Btn title="Yinele" onClick={() => chain().redo().run()} disabled={!s.canRedo}><Redo2 size={16} /></Btn>
      <Sep />

      <select
        title="Metin türü"
        value={s.block}
        onChange={(e) => {
          const v = e.target.value;
          if (v === "p") chain().setParagraph().run();
          else chain().setHeading({ level: v === "h2" ? 2 : 3 }).run();
        }}
        className="h-9 rounded-md border border-slate-200 bg-white px-2 text-sm text-slate-700 hover:border-slate-300 focus:outline-none"
      >
        <option value="p">Normal metin</option>
        <option value="h2">Başlık</option>
        <option value="h3">Alt başlık</option>
      </select>

      <select
        title="Yazı boyutu"
        value={s.size}
        onChange={(e) => (e.target.value ? chain().setFontSize(e.target.value).run() : chain().unsetFontSize().run())}
        className="ml-1 h-9 rounded-md border border-slate-200 bg-white px-2 text-sm text-slate-700 hover:border-slate-300 focus:outline-none"
      >
        {SIZES.map((o) => <option key={o.label} value={o.value}>{o.label}</option>)}
      </select>
      <Sep />

      <Btn title="Kalın" onClick={() => chain().toggleBold().run()} active={s.bold}><Bold size={16} /></Btn>
      <Btn title="İtalik" onClick={() => chain().toggleItalic().run()} active={s.italic}><Italic size={16} /></Btn>
      <Btn title="Altı çizili" onClick={() => chain().toggleUnderline().run()} active={s.underline}><Underline size={16} /></Btn>
      <Btn title="Üstü çizili" onClick={() => chain().toggleStrike().run()} active={s.strike}><Strikethrough size={16} /></Btn>

      {/* Colour */}
      <div className="relative">
        <Btn title="Yazı rengi" onClick={() => setColorOpen((o) => !o)} active={!!s.color}>
          <Palette size={16} />
          <span className="ml-1 h-3 w-3 rounded-full border border-slate-300" style={{ background: s.color || "#3c4256" }} />
        </Btn>
        {colorOpen && (
          <div className="absolute left-0 top-10 z-20 w-44 rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg">
            {COLORS.map((c) => (
              <button
                key={c.label}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  if (c.value) chain().setColor(c.value).run();
                  else chain().unsetColor().run();
                  setColorOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                <span className="h-4 w-4 rounded-full border border-slate-300" style={{ background: c.value || "#3c4256" }} />
                {c.label}
                {s.color === c.value && <Check size={14} className="ml-auto text-indigo-600" />}
              </button>
            ))}
          </div>
        )}
      </div>
      <Sep />

      <Btn title="Sola hizala" onClick={() => chain().setTextAlign("left").run()} active={s.align === "left"}><AlignLeft size={16} /></Btn>
      <Btn title="Ortala" onClick={() => chain().setTextAlign("center").run()} active={s.align === "center"}><AlignCenter size={16} /></Btn>
      <Btn title="Sağa hizala" onClick={() => chain().setTextAlign("right").run()} active={s.align === "right"}><AlignRight size={16} /></Btn>
      <Btn title="İki yana yasla" onClick={() => chain().setTextAlign("justify").run()} active={s.align === "justify"}><AlignJustify size={16} /></Btn>
      <Sep />

      <Btn title="Madde listesi" onClick={() => chain().toggleBulletList().run()} active={s.bullet}><List size={16} /></Btn>
      <Btn title="Numaralı liste" onClick={() => chain().toggleOrderedList().run()} active={s.ordered}><ListOrdered size={16} /></Btn>
      <Btn title="Alıntı" onClick={() => chain().toggleBlockquote().run()} active={s.quote}><Quote size={16} /></Btn>
      <Btn title="Ayraç çizgisi" onClick={() => chain().setHorizontalRule().run()}><Minus size={16} /></Btn>
      <Sep />

      {/* Link */}
      <div className="relative">
        <Btn
          title={s.link ? "Bağlantıyı düzenle" : "Bağlantı ekle"}
          active={s.link}
          onClick={() => {
            setLinkUrl((editor.getAttributes("link").href as string) || "");
            setLinkOpen((o) => !o);
          }}
        >
          <LinkIcon size={16} />
        </Btn>
        {linkOpen && (
          <div className="absolute left-0 top-10 z-20 flex w-80 items-center gap-1.5 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
            <input
              autoFocus
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); applyLink(); }
                if (e.key === "Escape") setLinkOpen(false);
              }}
              placeholder="www.ornek.com"
              className="h-9 flex-1 rounded-md border border-slate-200 px-2 text-sm focus:outline-none focus:border-indigo-400"
            />
            <button type="button" onClick={applyLink} className="h-9 rounded-md bg-indigo-600 px-3 text-sm font-semibold text-white hover:bg-indigo-700">Ekle</button>
            <button type="button" onClick={() => setLinkOpen(false)} title="Kapat" className="h-9 px-1.5 text-slate-400 hover:text-slate-700"><X size={16} /></button>
          </div>
        )}
      </div>
      {s.link && <Btn title="Bağlantıyı kaldır" onClick={() => chain().extendMarkRange("link").unsetLink().run()}><Unlink size={16} /></Btn>}

      <Btn title="Metnin içine görsel ekle" onClick={() => fileRef.current?.click()} disabled={uploading}>
        {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
      </Btn>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => { pickImage(e.target.files?.[0]); e.target.value = ""; }}
      />
      <Sep />
      <Btn title="Biçimlendirmeyi temizle" onClick={() => chain().unsetAllMarks().clearNodes().run()}><RemoveFormatting size={16} /></Btn>
    </div>
  );
}

/**
 * Word-like editor for news bodies. Keeps its HTML in a hidden input named `name`,
 * so it posts with the surrounding <form> like any other field.
 */
export function RichTextEditor({
  name,
  initialHtml,
  onUploadImage,
  onChange,
  placeholder = "Haberinizi buraya yazın…",
}: {
  name: string;
  initialHtml: string;
  onUploadImage: (file: File) => Promise<string | null>;
  onChange?: (html: string) => void;
  placeholder?: string;
}) {
  const [html, setHtml] = useState(initialHtml);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
      }),
      Image.configure({ inline: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      FontSize,
      Color,
      Placeholder.configure({ placeholder }),
    ],
    content: initialHtml,
    editorProps: {
      attributes: { class: "news-prose news-editor min-h-[340px] px-6 py-5 focus:outline-none" },
    },
    onUpdate: ({ editor: e }) => {
      const next = e.isEmpty ? "" : e.getHTML();
      setHtml(next);
      onChange?.(next);
    },
  });

  const words = useEditorState({
    editor,
    selector: ({ editor: e }) => (e ? e.getText().trim().split(/\s+/).filter(Boolean).length : 0),
  });

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-500/20">
      {editor ? <Toolbar editor={editor} onUploadImage={onUploadImage} /> : <div className="h-12 border-b border-slate-200 bg-slate-50" />}
      <EditorContent editor={editor} />
      <div className="flex justify-between border-t border-slate-100 bg-slate-50 px-4 py-2 text-xs text-slate-400">
        <span>İpucu: yazıyı seçip üstteki düğmelerle biçimlendirin.</span>
        <span>{words ?? 0} kelime</span>
      </div>
      <input type="hidden" name={name} value={html} />
    </div>
  );
}
