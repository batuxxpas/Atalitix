import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin, getAdminClient } from "@/lib/admin/auth";
import { newsHref, type News } from "@/lib/news-utils";
import { updateNews } from "../actions";
import { NewsForm } from "../NewsForm";

export const revalidate = 0;

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const { data } = await getAdminClient().from("haberler").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const item = data as unknown as News & { is_active: boolean };

  return (
    <div className="max-w-5xl mx-auto">
      <Link href="/admin/haberler" className="text-sm text-slate-500 hover:text-slate-800">← Haberler</Link>
      <div className="mt-3 mb-6 flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-900">Haberi düzenle</h2>
        {item.is_active && (
          <Link href={newsHref(item)} target="_blank" className="text-sm font-semibold text-indigo-600 hover:underline">
            Sitede görüntüle ↗
          </Link>
        )}
      </div>
      <NewsForm action={updateNews} item={item} submitLabel="Değişiklikleri kaydet" />
    </div>
  );
}
