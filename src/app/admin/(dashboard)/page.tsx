import { createClient } from "@/lib/supabase/server";

export const revalidate = 0; // Disable caching for admin

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch stats
  const [
    { count: contactsCount },
    { count: unreadContactsCount },
    { data: recentContacts }
  ] = await Promise.all([
    supabase.from("iletisim_talepleri").select("*", { count: "exact", head: true }),
    supabase.from("iletisim_talepleri").select("*", { count: "exact", head: true }).eq("is_read", false),
    supabase.from("iletisim_talepleri").select("*").order("created_at", { ascending: false }).limit(5)
  ]);

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Genel Bakış</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Toplam İletişim</p>
              <h3 className="text-2xl font-bold text-slate-900">{contactsCount || 0}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Okunmamış Mesajlar</p>
              <h3 className="text-2xl font-bold text-slate-900">{unreadContactsCount || 0}</h3>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-4">Son Talepler</h3>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">İsim</th>
              <th className="px-6 py-4">Şirket</th>
              <th className="px-6 py-4">Tarih</th>
              <th className="px-6 py-4">Durum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {recentContacts?.map((contact) => (
              <tr key={contact.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{contact.full_name}</div>
                  <div className="text-slate-500 text-xs">{contact.email}</div>
                </td>
                <td className="px-6 py-4">{contact.company || "-"}</td>
                <td className="px-6 py-4">{new Date(contact.created_at).toLocaleDateString("tr-TR")}</td>
                <td className="px-6 py-4">
                  {contact.is_read ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">Okundu</span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">Yeni</span>
                  )}
                </td>
              </tr>
            ))}
            {!recentContacts?.length && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">Henüz iletişim talebi bulunmuyor.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
