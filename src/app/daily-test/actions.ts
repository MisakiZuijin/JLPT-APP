"use server";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { DailyTestQuestion } from "@/lib/japanese/daily-test-generator";
import type { JlptLevel } from "@/lib/types";

export type WrongMistakeEntry = {
  category: string;
  prompt: string;
  yourAnswer: string;
  correctAnswer: string;
  explanation: string;
};

export async function saveDailyTestResult(input: {
  level: JlptLevel;
  questions: DailyTestQuestion[];
  answers: Record<string, string>;
  scorePct: number;
  mistakes: WrongMistakeEntry[];
}): Promise<{ saved: boolean; message?: string }> {
  if (!isSupabaseConfigured()) {
    return { saved: false, message: "Mode pratinjau: skor dihitung lokal." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { saved: false, message: "Login untuk menyimpan hasil Tes Harian." };
  }

  const todayDate = new Date().toISOString().slice(0, 10);

  const { error } = await supabase.from("daily_tests").upsert(
    {
      user_id: user.id,
      test_date: todayDate,
      jlpt_level: input.level,
      questions: input.questions,
      answers: input.answers,
      score: input.scorePct,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,test_date" },
  );

  // Simpan juga item yang salah ke mistakes_notebook jika tabel sudah ada
  if (input.mistakes.length > 0) {
    for (const m of input.mistakes) {
      const { data: existing } = await supabase
        .from("mistakes_notebook")
        .select("wrong_count")
        .eq("user_id", user.id)
        .eq("prompt", m.prompt)
        .maybeSingle();

      await supabase.from("mistakes_notebook").upsert(
        {
          user_id: user.id,
          category: m.category,
          prompt: m.prompt,
          your_answer: m.yourAnswer,
          correct_answer: m.correctAnswer,
          explanation: m.explanation,
          wrong_count: Number(existing?.wrong_count ?? 0) + 1,
          resolved: false,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,prompt" },
      );
    }
  }

  if (error) {
    return { saved: false, message: error.message };
  }

  return { saved: true };
}
