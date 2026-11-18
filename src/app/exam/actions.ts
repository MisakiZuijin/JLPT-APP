"use server";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { JlptLevel } from "@/lib/types";
import type { WrongMistakeEntry } from "@/app/daily-test/actions";

export type SectionScoreRecord = {
  sectionId: string;
  title: string;
  score: number;
  maxScore: number;
  minPassScore: number;
  passedSection: boolean;
};

export async function saveExamAttempt(input: {
  level: JlptLevel;
  sectionScores: SectionScoreRecord[];
  totalScore: number;
  maxScore: number;
  passed: boolean;
  answers: Record<string, number>;
  mistakes: WrongMistakeEntry[];
}): Promise<{ saved: boolean; message?: string }> {
  if (!isSupabaseConfigured()) {
    return { saved: false, message: "Mode pratinjau: hasil simulasi dihitung lokal." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { saved: false, message: "Login untuk menyimpan hasil simulasi." };
  }

  const { error } = await supabase.from("exam_attempts").insert({
    user_id: user.id,
    jlpt_level: input.level,
    section_scores: input.sectionScores,
    total_score: input.totalScore,
    max_score: input.maxScore,
    passed: input.passed,
    answers: input.answers,
  });

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
    return {
      saved: false,
      message: "Simulasi selesai! Jalankan migrasi 0003_exams_mistakes.sql di Supabase untuk simpan riwayat ujian.",
    };
  }

  return { saved: true };
}
