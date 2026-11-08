"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { InViewMask } from "@/components/motion";

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

  const contactRows = [
    {
      label: "Telefon",
      value: "+90 505 375 2992",
      href: "tel:+905053752992",
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 5.5A2.5 2.5 0 015.5 3h1.6a1 1 0 01.95.68l1.2 3.6a1 1 0 01-.5 1.2l-1.7.85a11 11 0 005.6 5.6l.85-1.7a1 1 0 011.2-.5l3.6 1.2a1 1 0 01.68.95v1.6A2.5 2.5 0 0118.5 21h-1C9.5 21 3 14.5 3 6.5v-1z" />,
    },
    {
      label: "E-posta",
      value: "bennur.yilmaz@atalitix.com",
      href: "mailto:bennur.yilmaz@atalitix.com",
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 6.5l8.5 6 8.5-6M4.5 19h15a1 1 0 001-1V6a1 1 0 00-1-1h-15a1 1 0 00-1 1v12a1 1 0 001 1z" />,
    },
  ];

  return (
    <section id="iletisim" className="relative py-24 md:py-28 bg-white overflow-hidden">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left — intro & direct contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-5"
          >
            <p className="section-label mb-4">İLETİŞİM</p>
            <InViewMask className="mb-5"><h2 className="section-title">Görüşme planlayın.</h2></InViewMask>
            <p className="text-slate-500 leading-relaxed mb-10 max-w-md">
              İş süreçlerinizi ve mevcut sistemlerinizi birlikte değerlendirelim; ERP ve dijitalleşme yol haritanızı netleştirelim.
            </p>

            <div className="rounded-2xl border border-slate-200 bg-[var(--color-bg-soft)] p-6">
              <div className="flex items-center gap-3 pb-5 mb-5 border-b border-slate-200">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--brand-navy-700)] font-semibold text-white text-sm" aria-hidden="true">BY</div>
                <div>
                  <p className="text-sm font-semibold text-[var(--brand-navy)]">Bennur Güner Yılmaz</p>
                  <p className="text-xs text-slate-500">Founder & Managing Partner</p>
                </div>
              </div>
              <ul className="space-y-4">
                {contactRows.map((row) => (
                  <li key={row.label}>
                    <a href={row.href} className="group flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-[var(--brand-blue)] transition-colors group-hover:border-[var(--brand-blue)]">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} aria-hidden="true">{row.icon}</svg>
                      </span>
                      <span className="min-w-0">
                        <span className="block font-mono text-[10.5px] uppercase tracking-wider text-slate-400">{row.label}</span>
                        <span className="block text-sm font-medium text-[var(--brand-navy)] truncate group-hover:text-[var(--brand-blue)] transition-colors">{row.value}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="lg:col-span-7"
          >
            <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-[0_24px_60px_-30px_rgba(11,26,79,0.25)] space-y-5" aria-label="İletişim formu">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium text-slate-700 mb-1.5">Ad Soyad *</label>
                  <input id="contact-name" type="text" required autoComplete="name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="field" placeholder="Adınız Soyadınız" />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-slate-700 mb-1.5">E-posta *</label>
                  <input id="contact-email" type="email" required autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="field" placeholder="ornek@sirket.com" />
                </div>
                <div>
                  <label htmlFor="contact-phone" className="block text-sm font-medium text-slate-700 mb-1.5">Telefon</label>
                  <input id="contact-phone" type="tel" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="field" placeholder="+90 5XX XXX XX XX" />
                </div>
                <div>
                  <label htmlFor="contact-company" className="block text-sm font-medium text-slate-700 mb-1.5">Şirket</label>
                  <input id="contact-company" type="text" autoComplete="organization" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="field" placeholder="Şirket adı" />
                </div>
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-slate-700 mb-1.5">Mesaj</label>
                <textarea id="contact-message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="field resize-none" placeholder="Projeniz, mevcut sistemleriniz ve hedefleriniz hakkında kısa bilgi..." />
              </div>

              {status === "success" && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} role="status" className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm overflow-hidden">Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.</motion.div>}
              {status === "error" && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} role="alert" className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm overflow-hidden">Bir hata oluştu. Lütfen tekrar deneyin.</motion.div>}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
                <p className="text-xs text-slate-400">* ile işaretli alanlar zorunludur.</p>
                <button type="submit" disabled={status === "loading"} className="btn-primary justify-center disabled:opacity-50">
                  {status === "loading" ? "Gönderiliyor..." : "Görüşme Planla"}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M13 6l6 6-6 6" /></svg>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
