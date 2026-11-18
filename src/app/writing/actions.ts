"use server";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { JlptLevel } from "@/lib/types";

export async function saveWritingProgress(input: {
  character: string;
  scriptType: "hiragana" | "katakana" | "kanji";
  jlptLevel: JlptLevel;
  accuracy: number;
  mastered: boolean;
}): Promise<{ saved: boolean; message?: string }> {
  if (!isSupabaseConfigured()) {
    return { saved: false, message: "Mode pratinjau: hasil latihan tercatat lokal." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { saved: false, message: "Login untuk menyimpan progres menulis." };
  }

  const { data: existing } = await supabase
    .from("writing_progress")
    .select("best_accuracy, attempts, mastered")
    .eq("user_id", user.id)
    .eq("character", input.character)
    .maybeSingle();

  const bestAccuracy = Math.max(Number(existing?.best_accuracy ?? 0), input.accuracy);
  const attempts = Number(existing?.attempts ?? 0) + 1;
  const mastered = Boolean(existing?.mastered) || input.mastered;

  const { error } = await supabase.from("writing_progress").upsert(
    {
      user_id: user.id,
      character: input.character,
      script_type: input.scriptType,
      jlpt_level: input.jlptLevel,
      best_accuracy: bestAccuracy,
      attempts,
      mastered,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,character" },
  );

  if (error) {
    return {
      saved: false,
      message: "Latihan selesai! Jalankan migrasi 0002_reading_writing.sql untuk menyimpan permanen.",
    };
  }

  return { saved: true };
}
