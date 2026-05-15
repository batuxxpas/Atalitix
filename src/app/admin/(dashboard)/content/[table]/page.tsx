import { createClient } from "@/lib/supabase/server";

import { EditableTable } from "./EditableTable";

export const revalidate = 0;

export default async function GenericContentPage({ params }: { params: Promise<{ table: string }> }) {
  const resolvedParams = await params;
  const tableName = resolvedParams.table;
  const supabase = await createClient();
  
  // Fetch data
  const { data, error } = await (supabase.from(tableName) as any).select("*").order("id", { ascending: true });

  if (error || !data) {
    return (
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">İçerik Yönetimi: {tableName}</h2>
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Tablo verisi alınamadı veya tablo bulunamadı. Lütfen Supabase tarafında tablonun varlığından emin olun.
        </div>
      </div>
    );
  }

  // Get column names from the first row
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="max-w-full mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 capitalize">Tablo: {tableName.replace(/_/g, ' ')}</h2>
          <p className="text-slate-500 text-sm mt-1">Bu sayfadan site içeriklerini doğrudan düzenleyebilirsin.</p>
        </div>
        <a href="https://supabase.com/dashboard/project/_" target="_blank" rel="noreferrer" className="bg-[#2d3a8c] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4f5ecb] transition-colors whitespace-nowrap">
          Gelişmiş Düzenleme (Supabase)
        </a>
      </div>
      
      <EditableTable tableName={tableName} columns={columns} initialData={data} />
    </div>
  );
}
