"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, getAdminClient } from "@/lib/admin/auth";

// Every exported action is a public endpoint: each one checks the admin session first.

export async function saveHeroSection(data: any) {
  await requireAdmin();
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
  await requireAdmin();
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
  await requireAdmin();
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
  await requireAdmin();
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
