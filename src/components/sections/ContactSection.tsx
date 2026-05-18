"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";

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

  return (
    <section id="iletisim" className="py-24 grid-bg overflow-hidden">
      <div className="container max-w-3xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <p className="section-label mb-4">İLETİŞİM</p>
          <h2 className="section-title mb-4">Görüşme Planlayın</h2>
          <p className="text-slate-500">İş süreçlerinizi birlikte değerlendirelim. Size en uygun dijital dönüşüm yolculuğunu tasarlayalım.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="card-corporate"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Ad Soyad *</label>
                <input type="text" required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition" placeholder="Adınız Soyadınız" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">E-posta *</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition" placeholder="ornek@sirket.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Telefon</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition" placeholder="+90 5XX XXX XX XX" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Şirket</label>
                <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition" placeholder="Şirket adı" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Mesaj</label>
              <textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition resize-none" placeholder="Projeniz hakkında kısa bilgi..." />
            </div>

            {status === "success" && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm overflow-hidden">Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.</motion.div>}
            {status === "error" && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm overflow-hidden">Bir hata oluştu. Lütfen tekrar deneyin.</motion.div>}

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={status === "loading"} 
              className="btn-primary w-full justify-center disabled:opacity-50"
            >
              {status === "loading" ? "Gönderiliyor..." : "Görüşme Planla"}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
