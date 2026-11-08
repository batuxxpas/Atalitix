import Link from "next/link";
import Image from "next/image";

const SERVICES = [
  "ERP Danışmanlığı",
  "Dijitalleşme Yol Haritası",
  "Süreç Tasarımı",
  "Veri Görselleştirme",
  "Non-ERP Otomasyon",
  "Danışmanlık & Eğitim",
];

const COMPANY = [
  { title: "Hizmetler", href: "#cozumler" },
  { title: "Yaklaşım", href: "#yaklasim" },
  { title: "Deneyim", href: "#deneyim" },
  { title: "İletişim", href: "#iletisim" },
];

export function Footer() {
  return (
    <footer className="relative bg-[var(--color-bg-soft)] border-t border-slate-200">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-5">
            <Image src="/atalitixlogo.png" alt="Atalitix" width={150} height={40} className="h-9 w-auto object-contain mb-5" />
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
              Atalitix; ERP danışmanlığı, süreç tasarımı, veri görselleştirme ve süreç otomasyonu ile şirketlerin iş süreçlerini ölçülebilir ve sürdürülebilir hale getiren teknoloji danışmanlık markasıdır.
            </p>
            <p className="font-mono text-xs text-slate-400 mt-6">From dATA to Intelligence.</p>
          </div>

          <nav aria-label="Hizmetler" className="md:col-span-3">
            <h4 className="font-mono text-[11px] font-medium tracking-wider uppercase text-slate-400 mb-4">Hizmetler</h4>
            <ul className="space-y-2.5">
              {SERVICES.map((item) => (
                <li key={item}>
                  <Link href="#cozumler" className="text-sm text-slate-600 hover:text-[var(--brand-blue)] transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Kurumsal" className="md:col-span-2">
            <h4 className="font-mono text-[11px] font-medium tracking-wider uppercase text-slate-400 mb-4">Kurumsal</h4>
            <ul className="space-y-2.5">
              {COMPANY.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-sm text-slate-600 hover:text-[var(--brand-blue)] transition-colors">
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-2">
            <h4 className="font-mono text-[11px] font-medium tracking-wider uppercase text-slate-400 mb-4">İletişim</h4>
            <address className="not-italic space-y-2.5">
              <p className="text-sm font-semibold text-[var(--brand-navy)]">Bennur Güner Yılmaz</p>
              <a href="tel:+905053752992" className="block text-sm text-slate-600 hover:text-[var(--brand-blue)] transition-colors">
                +90 505 375 2992
              </a>
              <a href="mailto:bennur.yilmaz@atalitix.com" className="block text-sm text-slate-600 hover:text-[var(--brand-blue)] transition-colors break-all">
                bennur.yilmaz@atalitix.com
              </a>
            </address>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} Atalitix. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Gizlilik Politikası</Link>
            <Link href="#" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Kullanım Şartları</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
