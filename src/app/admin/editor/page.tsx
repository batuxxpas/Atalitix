import { requireAdmin, getAdminClient } from "@/lib/admin/auth";
import VisualEditorClient from "./VisualEditorClient";

export const revalidate = 0; // Don't cache admin page

export default async function VisualEditorPage() {
  await requireAdmin();
  const supabase = getAdminClient();

  const results = await Promise.all([
    (supabase.from("ana_sayfa_icerik") as any).select("*").eq("is_active", true).single(),
    (supabase.from("isletim_haritasi_adimlari") as any).select("*").eq("is_active", true).order("sort_order"),
    (supabase.from("isletim_haritasi_kategorileri") as any).select("*").eq("is_active", true).order("sort_order"),
    (supabase.from("cozumler") as any).select("*").eq("is_active", true).order("sort_order"),
    (supabase.from("yaklasim_adimlari") as any).select("*").eq("is_active", true).order("sort_order"),
    (supabase.from("deneyim_maddeleri") as any).select("*").eq("is_active", true).order("sort_order"),
  ]);

  const [
    { data: hero },
    { data: processSteps },
    { data: processCategories },
    { data: solutions },
    { data: approachSteps },
    { data: experienceItems },
  ] = results;

  return (
    <>
      <VisualEditorClient 
        initialData={{
          hero: hero || {},
          processSteps: processSteps || [],
          processCategories: processCategories || [],
          solutions: solutions || [],
          approachSteps: approachSteps || [],
          experienceItems: experienceItems || []
        }}
      />
    </>
  );
}
