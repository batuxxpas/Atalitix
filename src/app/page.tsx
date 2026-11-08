import { Header, Footer } from "@/components/layout";
import { HeroSection, SolutionsSection, ApproachSection, ContactSection, ErpScopeSection } from "@/components/sections";
import { IntroLoader, INTRO_BOOT_SCRIPT } from "@/components/motion";
import { createClient } from "@/lib/supabase/server";
import { SITE_CONFIG } from "@/lib/constants";

export const revalidate = 60; // Revalidate cache every 60 seconds

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
  ]);

  const [
    { data: hero },
    { data: processSteps },
    { data: processCategories },
    , // teknoloji_etiketleri (şu an gösterilmiyor)
    { data: solutions },
    { data: approachSteps },
    { data: experienceItems },
  ] = results;

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
    sameAs: [],
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
      "ERP Danışmanlığı",
      "Dijital Dönüşüm",
      "Veri Analitiği",
      "Süreç Otomasyonu",
      "İş Zekası",
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
        
        {solutions && solutions.length > 0 && <SolutionsSection solutions={solutions} hero={hero} />}

        <ErpScopeSection />
        
        {approachSteps && experienceItems && (
          <ApproachSection
            approachSteps={approachSteps}
            experienceItems={experienceItems}
            hero={hero}
          />
        )}

        <ContactSection />
      </main>
      <Footer />
    </>
  );
}

