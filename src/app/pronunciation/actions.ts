"use server";

import { createClient as createAdminClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { JlptLevel } from "@/lib/types";

export async function recordPronunciationAttempt(input: {
  term: string;
  reading: string;
  meaning: string;
  level: JlptLevel;
  attemptNo: number;
  transcript: string;
  score: number;
  passed: boolean;
}): Promise<{ saved: boolean; message?: string }> {
  if (!isSupabaseConfigured()) {
    return { saved: false, message: "Mode pratinjau: skor dihitung lokal." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { saved: false, message: "Login untuk menyimpan riwayat pengucapan." };
  }

  const cleanTerm = input.term.trim();
  const { data: existingItems } = await supabase
    .from("items")
    .select("id")
    .eq("term", cleanTerm)
    .limit(1);

  let itemId = existingItems?.[0]?.id as number | undefined;

  if (!itemId) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY;
    if (url && secretKey) {
      const admin = createAdminClient(url, secretKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      const { data: inserted } = await admin
        .from("items")
        .upsert(
          {
            type: "vocab",
            jlpt_level: input.level,
            term: cleanTerm,
            reading: input.reading,
            meaning: input.meaning,
            sort_order: 950,
          },
          { onConflict: "type,jlpt_level,term,reading" },
        )
        .select("id")
        .single();
      itemId = inserted?.id;
    }
  }

  if (!itemId) {
    return { saved: false, message: "Frasa belum terdaftar di bank kartu." };
  }

  const clampedAttempt = Math.max(1, Math.min(5, Math.round(input.attemptNo)));

  const { error } = await supabase.from("pronunciation_attempts").insert({
    user_id: user.id,
    item_id: itemId,
    attempt_no: clampedAttempt,
    transcript: input.transcript,
    score: input.score,
    passed: input.passed,
  });

  if (error) {
    return { saved: false, message: error.message };
  }

  // Sesuai spesifikasi FEATURES.md: gagal sampai percobaan ke-5 masuk antrean ulang besok
  if (clampedAttempt === 5 && !input.passed) {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    await supabase.from("user_cards").upsert(
      {
        user_id: user.id,
        item_id: itemId,
        due: tomorrow,
        state: 0,
      },
      { onConflict: "user_id,item_id" },
    );
  }

  return { saved: true };
}
