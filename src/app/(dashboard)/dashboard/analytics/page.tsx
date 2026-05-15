import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui";

export const metadata = {
  title: "Analitik",
  description: "Detaylı analitik raporları ve grafikleri",
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Analitik</h1>
        <p className="text-slate-400 mt-1">
          Detaylı analitik verilerinizi inceleyin
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="glass">
          <CardHeader>
            <CardTitle>Ziyaretçi İstatistikleri</CardTitle>
            <CardDescription>
              Aylık ziyaretçi trendleri
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-slate-600">
              <p className="text-sm">Grafik alanı - Chart kütüphanesi eklenecek</p>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle>Kullanıcı Dağılımı</CardTitle>
            <CardDescription>Aktif vs pasif kullanıcılar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-slate-600">
              <p className="text-sm">Grafik alanı - Chart kütüphanesi eklenecek</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
