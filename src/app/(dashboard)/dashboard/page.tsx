import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui";

export const metadata = {
  title: "Dashboard",
  description: "Atalitix Dashboard - Genel bakış ve analitik verileri",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Dummy stats - gerçek verilerle değiştirilecek
  const stats = [
    {
      title: "Toplam Kullanıcı",
      value: "2,451",
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      title: "Aktif Oturumlar",
      value: "1,234",
      change: "+5.2%",
      changeType: "positive" as const,
    },
    {
      title: "Gelir",
      value: "₺45,231",
      change: "+18.3%",
      changeType: "positive" as const,
    },
    {
      title: "Dönüşüm Oranı",
      value: "%3.2",
      change: "-0.4%",
      changeType: "negative" as const,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">
          Hoş geldin, {user.email}! İşte genel bir bakış.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} variant="glass" hover>
            <CardHeader>
              <CardDescription>{stat.title}</CardDescription>
              <CardTitle className="text-2xl mt-1">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <span
                className={`text-sm font-medium ${
                  stat.changeType === "positive"
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {stat.change}
              </span>
              <span className="text-xs text-slate-500 ml-1">
                geçen aya göre
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" variant="glass">
          <CardHeader>
            <CardTitle>Son Aktiviteler</CardTitle>
            <CardDescription>Son 7 gündeki işlem geçmişi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 border-b border-slate-800/50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-400" />
                    <div>
                      <p className="text-sm text-white">
                        Yeni kullanıcı kaydı #{i}
                      </p>
                      <p className="text-xs text-slate-500">2 saat önce</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">Detay →</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle>Hızlı İşlemler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                "Yeni Proje Oluştur",
                "Rapor İndir",
                "Kullanıcı Ekle",
                "Ayarları Düzenle",
              ].map((action) => (
                <button
                  key={action}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all border border-slate-800/50 hover:border-indigo-500/30"
                >
                  {action}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
