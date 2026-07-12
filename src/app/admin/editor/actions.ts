"use server";

import { revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Helper to get admin client that bypasses RLS
function getAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function saveHeroSection(data: any) {
  const supabase = getAdminClient();
  // Using match by id or simply updating the active one.
  // Assuming we only have 1 active row for hero
  const { error } = await (supabase.from("ana_sayfa_icerik") as any)
    .update(data)
    .eq("is_active", true);

  if (error) {
    console.error("Error saving hero section:", error);
    return { success: false, error: error.message };
  }
  
  revalidatePath("/");
  return { success: true };
}

export async function saveSolutions(solutions: any[]) {
  const supabase = getAdminClient();
  
  for (const sol of solutions) {
    const { error } = await (supabase.from("cozumler") as any)
      .update(sol)
      .eq("id", sol.id);
      
    if (error) {
      console.error("Error saving solution:", error);
      return { success: false, error: error.message };
    }
  }

  revalidatePath("/");
  return { success: true };
}

export async function saveApproachSteps(steps: any[]) {
  const supabase = getAdminClient();
  
  for (const step of steps) {
    const { error } = await (supabase.from("yaklasim_adimlari") as any)
      .update(step)
      .eq("id", step.id);
      
    if (error) {
      console.error("Error saving approach step:", error);
      return { success: false, error: error.message };
    }
  }

  revalidatePath("/");
  return { success: true };
}

export async function saveExperienceItems(items: any[]) {
  const supabase = getAdminClient();
  
  for (const item of items) {
    const { error } = await (supabase.from("deneyim_maddeleri") as any)
      .update(item)
      .eq("id", item.id);
      
    if (error) {
      console.error("Error saving experience item:", error);
      return { success: false, error: error.message };
    }
  }

  revalidatePath("/");
  return { success: true };
}
