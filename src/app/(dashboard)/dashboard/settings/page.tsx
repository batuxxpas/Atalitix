import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui";

export const metadata = {
  title: "Ayarlar",
  description: "Hesap ve uygulama ayarları",
};

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Ayarlar</h1>
        <p className="text-slate-400 mt-1">Hesap ve uygulama ayarlarınızı yönetin</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card variant="glass">
          <CardHeader>
            <CardTitle>Profil Bilgileri</CardTitle>
            <CardDescription>Ad, e-posta ve avatar ayarları</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">
              Profil düzenleme formu buraya eklenecek
            </p>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle>Güvenlik</CardTitle>
            <CardDescription>Şifre ve iki faktörlü doğrulama</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">
              Güvenlik ayarları buraya eklenecek
            </p>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle>Bildirimler</CardTitle>
            <CardDescription>E-posta ve uygulama içi bildirim tercihleri</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">
              Bildirim ayarları buraya eklenecek
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
