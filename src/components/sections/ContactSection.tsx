"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { InViewMask, FadeIn } from "@/components/motion";

export function ContactSection() {
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", company: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    const supabase = createClient();
    const { error } = await (supabase.from("iletisim_talepleri") as any).insert([form]);
    if (error) { setStatus("error"); return; }
    setStatus("success");
    setForm({ full_name: "", email: "", phone: "", company: "", message: "" });
  };

  const label = "block text-[13px] font-medium text-[var(--ink-muted)]";

  return (
    <section id="iletisim" className="relative bg-[var(--paper)] py-20 md:py-28">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16">
          {/* Left — intro & direct contact */}
          <div className="lg:col-span-5">
            <FadeIn className="mb-6">
              <p className="section-label">İletişim</p>
            </FadeIn>
            <InViewMask className="mb-8">
              <h2 className="section-title">Görüşme planlayın.</h2>
            </InViewMask>
            <FadeIn delay={0.1}>
              <p className="text-[15px] leading-relaxed text-[var(--ink-muted)] max-w-md">
                Kısa bir keşif çalışmasıyla süreç, sistem, veri ve olgunluk yapınızı değerlendirip ilk fırsat haritasını çıkarabiliriz.
              </p>
            </FadeIn>

            {/* Birlikte nasıl başlayabiliriz? (sunum s.12) */}
            <FadeIn delay={0.15} className="mt-10">
              <p className="text-[13px] font-medium text-[var(--ink-muted)] mb-3">Birlikte nasıl başlayabiliriz?</p>
              <ol className="relative">
                <span className="absolute left-[11px] top-3 bottom-3 w-px bg-[var(--rule-strong)]" aria-hidden="true" />
                {["Tanışma görüşmesi", "Süreç ve olgunluk keşfi", "Öncelikli fırsat portföyü", "Yol haritası ve teklif"].map((step, i) => (
                  <li key={step} className="relative flex items-center gap-4 py-2.5">
                    <span className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] tabular-nums ${i === 0 ? "bg-[var(--brand-navy)] border-[var(--brand-navy)] text-white" : "bg-[var(--paper)] border-[var(--brand-navy)] text-[var(--brand-navy)]"}`}>{i + 1}</span>
                    <span className="font-serif text-[1.08rem] text-[var(--ink)]">{step}</span>
                  </li>
                ))}
              </ol>
            </FadeIn>

            <FadeIn delay={0.2} className="mt-10">
              <dl className="border-t border-[var(--rule-strong)]">
                <div className="border-b border-[var(--rule)] py-5">
                  <dt className="sr-only">Yetkili</dt>
                  <dd className="font-serif text-[1.15rem] text-[var(--ink)]">Bennur Güner Yılmaz</dd>
                  <dd className="text-[13px] text-[var(--ink-muted)] mt-1">Founder & Managing Partner</dd>
                </div>
                <div className="flex items-baseline justify-between gap-6 border-b border-[var(--rule)] py-5">
                  <dt className="text-[13px] text-[var(--ink-muted)]">Telefon</dt>
                  <dd><a href="tel:+905053752992" className="link-underline text-[15px] text-[var(--ink)]">+90 505 375 2992</a></dd>
                </div>
                <div className="flex items-baseline justify-between gap-6 border-b border-[var(--rule)] py-5">
                  <dt className="text-[13px] text-[var(--ink-muted)]">E-posta</dt>
                  <dd className="min-w-0"><a href="mailto:bennur.yilmaz@atalitix.com" className="link-underline text-[15px] text-[var(--ink)] break-all">bennur.yilmaz@atalitix.com</a></dd>
                </div>
              </dl>
            </FadeIn>
          </div>

          {/* Right — form */}
          <FadeIn delay={0.15} className="lg:col-span-6 lg:col-start-7">
            <form onSubmit={handleSubmit} className="space-y-9 lg:pt-3" aria-label="İletişim formu">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-9">
                <div>
                  <label htmlFor="contact-name" className={label}>Ad Soyad *</label>
                  <input id="contact-name" type="text" required autoComplete="name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="field" placeholder="Adınız Soyadınız" />
                </div>
                <div>
                  <label htmlFor="contact-email" className={label}>E-posta *</label>
                  <input id="contact-email" type="email" required autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="field" placeholder="ornek@sirket.com" />
                </div>
                <div>
                  <label htmlFor="contact-phone" className={label}>Telefon</label>
                  <input id="contact-phone" type="tel" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="field" placeholder="+90 5XX XXX XX XX" />
                </div>
                <div>
                  <label htmlFor="contact-company" className={label}>Şirket</label>
                  <input id="contact-company" type="text" autoComplete="organization" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="field" placeholder="Şirket adı" />
                </div>
              </div>
              <div>
                <label htmlFor="contact-message" className={label}>Mesaj</label>
                <textarea id="contact-message" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="field resize-none" placeholder="Kullandığınız sistemler, süreçleriniz ve hedefleriniz hakkında kısa bilgi" />
              </div>

              {status === "success" && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} role="status" className="border-l-2 border-emerald-600 pl-4 text-[15px] text-emerald-800">Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.</motion.p>}
              {status === "error" && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} role="alert" className="border-l-2 border-red-600 pl-4 text-[15px] text-red-700">Bir hata oluştu. Lütfen tekrar deneyin.</motion.p>}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                <p className="text-[13px] text-[var(--ink-muted)]">* zorunlu alanlar</p>
                <button type="submit" disabled={status === "loading"} className="btn-primary justify-center disabled:opacity-50">
                  {status === "loading" ? "Gönderiliyor..." : "Görüşme Planla"}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M5 12h14M13 6l6 6-6 6" /></svg>
                </button>
              </div>
            </form>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
