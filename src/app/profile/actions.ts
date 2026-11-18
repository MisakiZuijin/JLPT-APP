"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { JLPT_LEVELS, type JlptLevel } from "@/lib/types";

export type ProfileActionState = {
  error?: string;
  saved?: boolean;
};

export async function updateProfile(
  _: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase belum dikonfigurasi." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesi berakhir, silakan masuk kembali." };

  const displayName = String(formData.get("display_name") ?? "").trim() || null;
  const level = String(formData.get("target_level") ?? "N5") as JlptLevel;
  const limit = Number(formData.get("daily_new_limit"));

  if (!JLPT_LEVELS.includes(level)) {
    return { error: "Level JLPT tidak valid." };
  }
  if (!Number.isInteger(limit) || limit < 0 || limit > 100) {
    return { error: "Kuota kata baru harus antara 0 sampai 100." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: displayName,
      target_level: level,
      daily_new_limit: limit,
    })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/profile");
  revalidatePath("/review");
  return { saved: true };
}
