"use client";

import { useState } from "react";
import { updateTableRow } from "./actions";
import { useRouter } from "next/navigation";

// Teknik SQL sütun isimlerini Türkçe ve anlaşılır hale getiren yardımcı fonksiyon
const formatColumnName = (col: string) => {
  const map: Record<string, string> = {
    is_active: "Aktif Mi?",
    sort_order: "Sıralama",
    title: "Başlık",
    title_line1: "Başlık (1. Satır)",
    title_line2: "Başlık (2. Satır)",
    title_line3: "Başlık (3. Satır)",
    title_line4: "Başlık (4. Satır)",
    title_highlight: "Vurgulu Başlık",
    description: "Açıklama",
    description2: "Açıklama (2. Bölüm)",
    tagline: "Slogan",
    tagline_sub: "Alt Slogan",
    cta_primary_text: "Birincil Buton Yazısı",
    cta_secondary_text: "İkincil Buton Yazısı",
    map_title: "Harita Başlığı",
    map_badge: "Harita Rozeti",
    badge_text: "Rozet Yazısı",
    icon_svg: "İkon Kodu (SVG)",
    step_number: "Adım Sayısı",
    category_id: "Kategori No",
    name: "İsim",
    content: "İçerik",
  };
  
  if (map[col]) return map[col];
  
  // Bilinmeyen sütunlar için alt çizgileri boşluk yap ve kelimelerin ilk harfini büyüt
  return col.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export function EditableTable({ tableName, columns, initialData }: { tableName: string, columns: string[], initialData: any[] }) {
  const [data, setData] = useState(initialData);
  const [editingId, setEditingId] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  // Kullanıcının görmesine ve düzenlemesine gerek olmayan sistem sütunları
  const hiddenColumns = ["id", "created_at", "updated_at"];
  const visibleColumns = columns.filter((col) => !hiddenColumns.includes(col));

  const handleEditClick = (row: any) => {
    setEditingId(row.id);
    setEditFormData(row);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleChange = (col: string, value: any) => {
    setEditFormData((prev: any) => ({ ...prev, [col]: value }));
  };

  const handleSave = async (id: any) => {
    setSaving(true);
    const updateData = { ...editFormData };
    delete updateData.id;
    delete updateData.created_at;
    delete updateData.updated_at;
    
    const res = await updateTableRow(tableName, id, updateData);
    if (res.error) {
      alert("Hata oluştu: " + res.error);
    } else {
      setData(data.map((r) => (r.id === id ? { ...r, ...updateData } : r)));
      setEditingId(null);
      router.refresh();
    }
    setSaving(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
      <table className="min-w-full text-left text-sm text-slate-600">
        <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 text-xs uppercase font-semibold tracking-wider">
          <tr>
            <th className="px-6 py-4 whitespace-nowrap w-24">İşlemler</th>
            {visibleColumns.map((col) => (
              <th key={col} className="px-6 py-4 whitespace-nowrap">{formatColumnName(col)}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((row: any, i: number) => {
            const isEditing = editingId === row.id;

            return (
              <tr key={row.id || i} className={`transition-all duration-200 ${isEditing ? 'bg-blue-50/40 ring-1 ring-blue-100 inset-0' : 'hover:bg-slate-50'}`}>
                <td className="px-6 py-4 whitespace-nowrap align-top pt-5">
                  {isEditing ? (
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => handleSave(row.id)} 
                        disabled={saving}
                        className="text-white bg-[#2d3a8c] hover:bg-[#4f5ecb] px-3 py-1.5 rounded font-medium transition-all shadow-sm disabled:opacity-50 text-xs w-full"
                      >
                        {saving ? "KAYDEDİLİYOR..." : "KAYDET"}
                      </button>
                      <button 
                        onClick={handleCancel}
                        disabled={saving}
                        className="text-slate-600 hover:text-slate-900 bg-slate-200 hover:bg-slate-300 px-3 py-1.5 rounded font-medium transition-colors text-xs w-full"
                      >
                        İPTAL
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleEditClick(row)}
                      className="text-blue-600 hover:text-white border border-blue-200 hover:bg-blue-600 px-4 py-1.5 rounded font-medium transition-all text-xs"
                    >
                      Düzenle
                    </button>
                  )}
                </td>
                
                {visibleColumns.map((col) => {
                  let val = isEditing ? editFormData[col] : row[col];
                  const isBoolean = typeof row[col] === "boolean";
                  const isObject = typeof row[col] === "object" && row[col] !== null;

                  if (isEditing) {
                    if (isBoolean) {
                      return (
                        <td key={col} className="px-6 py-4 align-top pt-5">
                          <select 
                            value={val ? "true" : "false"} 
                            onChange={(e) => handleChange(col, e.target.value === "true")}
                            className="border border-blue-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-slate-700 shadow-sm"
                          >
                            <option value="true">Evet, Aktif</option>
                            <option value="false">Hayır, Pasif</option>
                          </select>
                        </td>
                      );
                    }
                    if (isObject) {
                      return (
                        <td key={col} className="px-6 py-4 align-top pt-5 text-xs text-rose-500 font-medium">
                          Gelişmiş Veri (Düzenlenemez)
                        </td>
                      );
                    }
                    return (
                      <td key={col} className="px-6 py-4 align-top pt-5">
                        {String(row[col] || "").length > 50 || col.includes("description") || col.includes("content") || col.includes("svg") ? (
                          <textarea
                            value={val || ""}
                            onChange={(e) => handleChange(col, e.target.value)}
                            className="border border-blue-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 w-full min-w-[280px] h-28 text-sm text-slate-800 shadow-sm leading-relaxed"
                          />
                        ) : (
                          <input
                            type={typeof row[col] === "number" ? "number" : "text"}
                            value={val || ""}
                            onChange={(e) => handleChange(col, typeof row[col] === "number" ? Number(e.target.value) : e.target.value)}
                            className="border border-blue-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 w-full min-w-[200px] text-sm text-slate-800 shadow-sm"
                          />
                        )}
                      </td>
                    );
                  }

                  // Okuma Modu Gösterimi
                  if (isBoolean) {
                    return (
                      <td key={col} className="px-6 py-4 align-top pt-5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${val ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          {val ? "Aktif" : "Pasif"}
                        </span>
                      </td>
                    );
                  }
                  if (isObject) val = "Veri Kümesi";
                  
                  return (
                    <td key={col} className="px-6 py-4 align-top pt-5">
                      <div className="max-w-xs xl:max-w-md line-clamp-3 leading-relaxed text-slate-700" title={String(val)}>
                        {String(val || "-")}
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
          {!data.length && (
            <tr>
              <td colSpan={visibleColumns.length + 1} className="px-6 py-16 text-center text-slate-500 bg-slate-50">
                <p className="font-medium text-base mb-1">Veri Bulunamadı</p>
                <p className="text-sm">Bu tabloda henüz içerik yok.</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
