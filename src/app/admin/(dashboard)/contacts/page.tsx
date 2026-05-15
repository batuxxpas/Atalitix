import { createClient } from "@/lib/supabase/server";
import { markAsRead } from "./actions";

export const revalidate = 0;

export default async function AdminContactsPage() {
  const supabase = await createClient();
  const { data: contacts } = await supabase.from("iletisim_talepleri").select("*").order("created_at", { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">İletişim Talepleri</h2>
          <p className="mt-2 text-sm text-slate-500">Müşterilerden gelen tüm mesajları buradan yönetebilirsiniz.</p>
        </div>
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
          <span className="text-sm font-medium text-slate-700">
            {contacts?.filter(c => !c.is_read).length || 0} Okunmamış Mesaj
          </span>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-5">Durum / Gönderen</th>
                <th className="px-6 py-5">İletişim Bilgileri</th>
                <th className="px-6 py-5">Şirket</th>
                <th className="px-6 py-5">Tarih</th>
                <th className="px-6 py-5">Mesaj İçeriği</th>
                <th className="px-6 py-5 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contacts?.map((contact) => (
                <tr key={contact.id} className={`group transition-all duration-200 ${!contact.is_read ? 'bg-blue-50/50 hover:bg-blue-50' : 'hover:bg-slate-50'}`}>
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-3">
                      {!contact.is_read && (
                        <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]"></div>
                      )}
                      <div>
                        <div className={`font-semibold ${!contact.is_read ? 'text-slate-900' : 'text-slate-600'}`}>{contact.full_name}</div>
                        {!contact.is_read && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white mt-1 uppercase tracking-tighter">YENİ</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-slate-900 font-medium">{contact.email}</div>
                    <div className="text-slate-500 text-xs mt-1 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      {contact.phone || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium border border-slate-200">
                      {contact.company || "Belirtilmemiş"}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-slate-500 text-xs">
                    {new Date(contact.created_at).toLocaleString("tr-TR", { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-5">
                    <div className="max-w-xs text-slate-700 leading-relaxed italic" title={contact.message}>
                      "{contact.message?.length > 100 ? `${contact.message.substring(0, 100)}...` : contact.message}"
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    {!contact.is_read ? (
                      <form action={markAsRead}>
                        <input type="hidden" name="id" value={contact.id} />
                        <button 
                          type="submit"
                          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95"
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          Okundu Yap
                        </button>
                      </form>
                    ) : (
                      <span className="inline-flex items-center text-slate-400 text-xs font-medium">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        Okundu
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {!contacts?.length && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                      <p className="text-slate-500 font-medium">Henüz bir mesaj almadınız.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
