"use client";

import Link from "next/link";

/** Global error boundary — calm, on-brand, and without exposing technical details. */
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="min-h-screen bg-white flex items-center">
      <div className="container py-24">
        <div className="max-w-2xl">
          <p className="section-label mb-6">Bir sorun oluştu</p>
          <h1 className="display text-[2.4rem] md:text-[3.2rem]">
            Sayfa şu anda <em className="text-[var(--brand-blue)]">yüklenemedi.</em>
          </h1>
          <p className="mt-6 text-[16px] leading-relaxed text-[var(--ink-muted)] max-w-lg">
            Geçici bir sorun olabilir. Lütfen tekrar deneyin; sorun sürerse bize iletişim formundan veya e-postayla ulaşabilirsiniz.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <button type="button" onClick={reset} className="btn-primary">Tekrar dene</button>
            <Link href="/" className="btn-outline">Ana sayfa</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
