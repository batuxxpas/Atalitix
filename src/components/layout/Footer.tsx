import Link from "next/link";
import Image from "next/image";

const SERVICES = [
  "ERP Danışmanlığı",
  "Odoo Uygulamaları",
  "Dijitalleşme Yol Haritası",
  "Süreç Tasarımı",
  "Veri Görselleştirme",
  "Non-ERP Otomasyon",
  "Danışmanlık & Eğitim",
];

const COMPANY = [
  { title: "Hizmetler", href: "#cozumler" },
  { title: "Kapsam", href: "#kapsam" },
  { title: "Yaklaşım", href: "#yaklasim" },
  { title: "Deneyim", href: "#deneyim" },
  { title: "Haberler", href: "#haberler" },
  { title: "İletişim", href: "#iletisim" },
];

export function Footer() {
  return (
    <footer className="relative bg-white border-t border-[var(--rule)]">
      <div className="container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-5">
            <Image src="/atalitixlogo.png" alt="Atalitix" width={150} height={40} className="h-9 w-auto object-contain mb-5" />
            <p className="text-[var(--ink-body)] text-[15px] max-w-sm leading-relaxed">
              Atalitix; ERP danışmanlığı, süreç tasarımı, veri görselleştirme ve süreç otomasyonu ile şirketlerin iş süreçlerini ölçülebilir ve sürdürülebilir hale getiren teknoloji danışmanlık markasıdır.
            </p>
            <p className="font-serif italic text-[1.1rem] text-[var(--ink)] mt-6">Veriden zekâya, süreçten değere.</p>
            <p className="text-[13px] tracking-[0.04em] text-[var(--ink-muted)] mt-1">From dATA to Intelligence.</p>
          </div>

          <nav aria-label="Hizmetler" className="md:col-span-3">
            <h4 className="text-[13px] font-medium text-[var(--ink-muted)] mb-5">Hizmetler</h4>
            <ul className="space-y-3">
              {SERVICES.map((item) => (
                <li key={item}>
                  <Link href="#cozumler" className="link-underline text-[15px] text-[var(--ink)] hover:text-[var(--brand-blue)]">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Kurumsal" className="md:col-span-2">
            <h4 className="text-[13px] font-medium text-[var(--ink-muted)] mb-5">Kurumsal</h4>
            <ul className="space-y-3">
              {COMPANY.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="link-underline text-[15px] text-[var(--ink)] hover:text-[var(--brand-blue)]">
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-2">
            <h4 className="text-[13px] font-medium text-[var(--ink-muted)] mb-5">İletişim</h4>
            <address className="not-italic space-y-2.5">
              <p className="font-serif text-[17px] text-[var(--ink)]">Bennur Güner Yılmaz</p>
              <a href="tel:+905053752992" className="block link-underline text-[15px] text-[var(--ink)] hover:text-[var(--brand-blue)]">
                +90 505 375 2992
              </a>
              <a href="mailto:bennur.yilmaz@atalitix.com" className="block link-underline text-[15px] text-[var(--ink)] hover:text-[var(--brand-blue)] break-all">
                bennur.yilmaz@atalitix.com
              </a>
            </address>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--rule)]">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[13px] text-[var(--ink-muted)]">© {new Date().getFullYear()} Atalitix. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-[13px] text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors">Gizlilik Politikası</Link>
            <Link href="#" className="text-[13px] text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors">Kullanım Şartları</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
