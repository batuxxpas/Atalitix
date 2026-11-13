import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { createNews, uploadEditorImage, previewLinkForNews } from "../actions";
import { NewsForm } from "../NewsForm";

export const revalidate = 0;

export default async function NewNewsPage() {
  await requireAdmin();
  return (
    <div className="max-w-6xl mx-auto">
      <Link href="/admin/haberler" className="text-sm text-slate-500 hover:text-slate-800">← Haberler</Link>
      <h2 className="mt-3 mb-6 text-2xl font-bold text-slate-900">Yeni haber</h2>
      <NewsForm action={createNews} uploadImage={uploadEditorImage} previewLink={previewLinkForNews} submitLabel="Yayınla" />
    </div>
  );
}
