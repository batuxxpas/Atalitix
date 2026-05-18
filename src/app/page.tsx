import { Header, Footer } from "@/components/layout";
import { HeroSection, TechTagsBar, SolutionsSection, ApproachSection, ContactSection } from "@/components/sections";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60; // Revalidate cache every 60 seconds

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch data
  const [
    { data: hero },
    { data: processSteps },
    { data: processCategories },
    { data: techTags },
    { data: solutions },
    { data: approachSteps },
    { data: experienceItems },
  ] = await Promise.all([
    (supabase.from("ana_sayfa_icerik") as any).select("*").eq("is_active", true).single(),
    (supabase.from("isletim_haritasi_adimlari") as any).select("*").eq("is_active", true).order("sort_order"),
    (supabase.from("isletim_haritasi_kategorileri") as any).select("*").eq("is_active", true).order("sort_order"),
    (supabase.from("teknoloji_etiketleri") as any).select("*").eq("is_active", true).order("sort_order"),
    (supabase.from("cozumler") as any).select("*").eq("is_active", true).order("sort_order"),
    (supabase.from("yaklasim_adimlari") as any).select("*").eq("is_active", true).order("sort_order"),
    (supabase.from("deneyim_maddeleri") as any).select("*").eq("is_active", true).order("sort_order"),
  ]);

  return (
    <>
      <Header />
      <main className="pt-20">
        {hero && (
          <HeroSection
            hero={hero}
            processSteps={processSteps || []}
            processCategories={processCategories || []}
          />
        )}
        
        {/* {techTags && techTags.length > 0 && <TechTagsBar tags={techTags} />} */}
        
        {solutions && solutions.length > 0 && <SolutionsSection solutions={solutions} />}
        
        {approachSteps && experienceItems && (
          <ApproachSection
            approachSteps={approachSteps}
            experienceItems={experienceItems}
          />
        )}

        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
