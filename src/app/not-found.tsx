import Link from "next/link";
import Image from "next/image";

/** 404 — in the site's own editorial style. */
export default function NotFound() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      <div className="container pt-8">
        <Link href="/" aria-label="Atalitix - Ana Sayfa">
          <Image src="/atalitixlogo.png" alt="Atalitix" width={160} height={45} className="h-9 w-auto" priority />
        </Link>
      </div>
      <div className="container flex-1 flex items-center py-24">
        <div className="max-w-2xl">
          <p className="section-label mb-6">404</p>
          <h1 className="display text-[2.4rem] md:text-[3.2rem]">
            Aradığınız sayfa <em className="text-[var(--brand-blue)]">bulunamadı.</em>
          </h1>
          <p className="mt-6 text-[16px] leading-relaxed text-[var(--ink-muted)] max-w-lg">
            Sayfa taşınmış veya kaldırılmış olabilir. Ana sayfadan devam edebilir ya da güncel haberlerimize göz atabilirsiniz.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link href="/" className="btn-primary">Ana sayfaya dön</Link>
            <Link href="/haberler" className="btn-outline">Haberler</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
