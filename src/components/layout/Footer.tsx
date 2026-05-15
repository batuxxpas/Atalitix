import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-[var(--color-dark)] text-white py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Image src="/atalitixlogo.png" alt="Atalitix" width={140} height={40} className="h-9 w-auto object-contain mb-4" />
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              Atalitix, şirketlerin iş süreçlerini ERP, yapay zekâ, veri analitiği ve otomasyon teknolojileriyle daha akıllı, ölçülebilir ve sürdürülebilir hale getiren teknoloji ve danışmanlık markasıdır.
            </p>
            <p className="text-slate-500 text-xs mt-6 italic">
              Veriden zekâya, süreçten değere. From dATA to Intelligence.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Çözümler</h4>
            <ul className="space-y-2.5">
              {["ERP Danışmanlığı", "Dijitalleşme Yol Haritası", "Veri Görselleştirme", "Non-ERP Otomasyon", "Süreç Tasarımı", "Danışmanlık"].map((item) => (
                <li key={item}>
                  <Link href="#cozumler" className="text-sm text-slate-400 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">İletişim</h4>
            <ul className="space-y-2.5">
              <li className="text-sm text-slate-400">info@atalitix.com</li>
              <li>
                <a href="#iletisim" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Görüşme Planla
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">© {new Date().getFullYear()} Atalitix. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Gizlilik Politikası</Link>
            <Link href="#" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Kullanım Şartları</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
