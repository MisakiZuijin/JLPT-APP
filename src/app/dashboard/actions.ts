"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { JLPT_LEVELS, type JlptLevel } from "@/lib/types";

export async function updateSettings(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const level = String(formData.get("target_level")) as JlptLevel;
  const limit = Number(formData.get("daily_new_limit"));
  if (!JLPT_LEVELS.includes(level) || !Number.isInteger(limit) || limit < 0 || limit > 100) return;

  await supabase
    .from("profiles")
    .update({ target_level: level, daily_new_limit: limit })
    .eq("id", user.id);

  revalidatePath("/dashboard");
}
