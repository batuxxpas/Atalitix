import { Header, Footer } from "@/components/layout";
import { HeroSection, SolutionsSection, ApproachSection, ContactSection, ErpPathSection, MaturitySection, EducationSection, NewsSection } from "@/components/sections";
import { IntroLoader, INTRO_BOOT_SCRIPT } from "@/components/motion";
import { createClient } from "@/lib/supabase/server";
import { SITE_CONFIG } from "@/lib/constants";

export const revalidate = 60; // Revalidate cache every 60 seconds

// Sunum (ATAlitiX tanıtım sunumu 2026 v2): 1.1, 1.2, 2.1 — Supabase tablosu yoksa kullanılır
const FALLBACK_SUBS: Record<string, { baslik: string; aciklama: string }[]> = {
  "Süreç Analizi ve Hedef Süreç Tasarımı": [
    { baslik: "ERP Kapsamı ve Kavramsal Tasarım", aciklama: "Modül kapsamı, entegrasyon ihtiyacı ve uygun ERP yolu netleştirilir; Odoo, SAP, Logo, Canias vb. alternatifler süreç uyumuna göre değerlendirilir." },
    { baslik: "Odoo Uygulama", aciklama: "Odoo'nun doğru yol olduğu projelerde kurulum, uyarlama, veri aktarımı ve canlıya geçiş sertifikalı ekibimizle yürütülür." },
  ],
  "Dijital Olgunluk Değerlendirme": [
    { baslik: "Veri, AI ve Otomasyon Fırsatları", aciklama: "KPI, dashboard, RPA/AI kullanım senaryoları ve otomasyon backlog'u; iş değeri, veri hazırlığı ve uygulanabilirliğe göre önceliklendirilir." },
  ],
};

function fallbackSubItems(solutions: { id: string; title: string }[]) {
  return solutions.flatMap((s) =>
    (FALLBACK_SUBS[s.title] || []).map((sub, i) => ({ id: `${s.id}-${i}`, cozum_id: String(s.id), ...sub })),
  );
}

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch data
  const results = await Promise.all([
    (supabase.from("ana_sayfa_icerik") as any).select("*").eq("is_active", true).single(),
    (supabase.from("isletim_haritasi_adimlari") as any).select("*").eq("is_active", true).order("sort_order"),
    (supabase.from("isletim_haritasi_kategorileri") as any).select("*").eq("is_active", true).order("sort_order"),
    (supabase.from("teknoloji_etiketleri") as any).select("*").eq("is_active", true).order("sort_order"),
    (supabase.from("cozumler") as any).select("*").eq("is_active", true).order("sort_order"),
    (supabase.from("yaklasim_adimlari") as any).select("*").eq("is_active", true).order("sort_order"),
    (supabase.from("deneyim_maddeleri") as any).select("*").eq("is_active", true).order("sort_order"),
    // Yeni tablolar: henüz oluşturulmadıysa hata döner, bölümler sessizce gizlenir
    (supabase.from("haberler") as any).select("*").eq("is_active", true).order("tarih", { ascending: false }).limit(24),
    (supabase.from("cozum_alt_basliklari") as any).select("id,cozum_id,baslik,aciklama,sort_order").eq("is_active", true).order("sort_order"),
  ]);

  const [
    { data: hero },
    { data: processSteps },
    { data: processCategories },
    , // teknoloji_etiketleri (şu an gösterilmiyor)
    { data: solutions },
    { data: approachSteps },
    { data: experienceItems },
    { data: news },
    { data: subItemsFromDb, error: subItemsError },
  ] = results;

  // Until the cozum_alt_basliklari table exists, fall back to the presentation's sub-areas
  const solutionSubItems = subItemsError
    ? fallbackSubItems(solutions || [])
    : subItemsFromDb || [];

  // JSON-LD Structured Data
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Atalitix",
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/atalitixlogo.png`,
    description: SITE_CONFIG.description,
    founder: {
      "@type": "Person",
      name: "Bennur Güner Yılmaz",
      jobTitle: "Founder & Managing Partner",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+90-505-375-2992",
      email: "bennur.yilmaz@atalitix.com",
      contactType: "sales",
      availableLanguage: ["Turkish", "English"],
    },
    sameAs: [SITE_CONFIG.links.linkedin, SITE_CONFIG.links.instagram],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Atalitix",
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    inLanguage: "tr",
  };

  const professionalServiceJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Atalitix",
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    image: `${SITE_CONFIG.url}/atalitixlogo.png`,
    telephone: "+90-505-375-2992",
    email: "bennur.yilmaz@atalitix.com",
    serviceType: [
      "Süreç Analizi ve Hedef Süreç Tasarımı",
      "ERP Kapsamı ve Kavramsal Tasarım",
      "Odoo Uygulama",
      "Dijital Olgunluk Değerlendirme",
      "Veri, AI ve Otomasyon Fırsatları",
      "Dijital Eğitim ve Kullanıcı Adaptasyonu",
    ],
    areaServed: {
      "@type": "Country",
      name: "Turkey",
    },
    knowsLanguage: ["tr", "en"],
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(professionalServiceJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* Decide before first paint whether the intro plays (first visit per session) */}
      <script dangerouslySetInnerHTML={{ __html: INTRO_BOOT_SCRIPT }} />
      <IntroLoader />

      <Header />
      <main className="pt-20">
        {hero && (
          <HeroSection
            hero={hero}
            processSteps={processSteps || []}
            processCategories={processCategories || []}
          />
        )}
        
        {solutions && solutions.length > 0 && (
          <SolutionsSection solutions={solutions} hero={hero} subItems={solutionSubItems || []} />
        )}

        {/* 1.1 ERP kapsamı + 1.2 Odoo (sunum s.7) */}
        <ErpPathSection />

        {/* 2 + 2.1 Dijital olgunluk (sunum s.8–10) */}
        <MaturitySection />

        {/* 3 Eğitim ve eğitim kataloğu */}
        <EducationSection />

        
        {approachSteps && experienceItems && (
          <ApproachSection
            approachSteps={approachSteps}
            experienceItems={experienceItems}
            hero={hero}
          />
        )}

        {news && news.length > 0 && <NewsSection items={news} />}

        <ContactSection />
      </main>
      <Footer />
    </>
  );
}

