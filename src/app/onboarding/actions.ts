"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isMissingSchemaError } from "@/lib/onboarding-guard";
import {
  getDailyNewLimitForMinutes,
  STAGE_METADATA,
} from "@/lib/japanese/placement-test";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  CURRICULUM_STAGES,
  LEARNING_GOALS,
  STUDY_MINUTES_OPTIONS,
  type CurriculumStage,
  type LearningGoal,
  type PlacementScore,
  type StudyMinutesDaily,
} from "@/lib/types";

export type CompleteOnboardingInput = {
  learningGoal: LearningGoal;
  selectedStage: CurriculumStage;
  recommendedUnitCode?: string;
  studyMinutesDaily: StudyMinutesDaily;
  examTargetPeriod: string | null;
  placementScore: PlacementScore;
};

export type CompleteOnboardingResult = {
  error?: string;
};

function sanitizeGoal(val: unknown): LearningGoal {
  return LEARNING_GOALS.includes(val as LearningGoal)
    ? (val as LearningGoal)
    : "jlpt";
}

function sanitizeStage(val: unknown): CurriculumStage {
  return CURRICULUM_STAGES.includes(val as CurriculumStage)
    ? (val as CurriculumStage)
    : "PRE_N5";
}

function sanitizeMinutes(val: unknown): StudyMinutesDaily {
  const num = Number(val);
  return STUDY_MINUTES_OPTIONS.includes(num as StudyMinutesDaily)
    ? (num as StudyMinutesDaily)
    : 30;
}

function sanitizeExamPeriod(val: unknown): string | null {
  if (typeof val !== "string") return null;
  const trimmed = val.trim();
  if (!trimmed) return null;
  return /^\d{4}-(07|12)$/.test(trimmed) ? trimmed : null;
}

export async function completeOnboarding(
  input: CompleteOnboardingInput,
): Promise<CompleteOnboardingResult> {
  if (!isSupabaseConfigured()) {
    redirect("/login?setup=1");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const learningGoal = sanitizeGoal(input.learningGoal);
  const selectedStage = sanitizeStage(input.selectedStage);
  const studyMinutesDaily = sanitizeMinutes(input.studyMinutesDaily);
  const examTargetPeriod = sanitizeExamPeriod(input.examTargetPeriod);

  const stageMeta = STAGE_METADATA[selectedStage];
  const dailyNewLimit = getDailyNewLimitForMinutes(studyMinutesDaily);
  const activeUnitCode =
    input.recommendedUnitCode &&
    input.placementScore?.recommended_stage === selectedStage
      ? input.recommendedUnitCode
      : stageMeta.defaultUnitCode;

  const displayName =
    (user.user_metadata?.display_name as string | undefined)?.trim() ||
    (user.user_metadata?.full_name as string | undefined)?.trim() ||
    user.email?.split("@")[0] ||
    "Pelajar JLPT";

  // 1. Simpan profil lengkap beserta kontrak belajar & aturan Romaji/Furigana
  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      display_name: displayName,
      target_level: stageMeta.targetLevel,
      daily_new_limit: dailyNewLimit,
      onboarding_completed: true,
      learning_goal: learningGoal,
      current_stage: selectedStage,
      study_minutes_daily: studyMinutesDaily,
      exam_target_period: examTargetPeriod,
      placement_score: input.placementScore ?? {},
      romaji_enabled: stageMeta.romajiEnabled,
      furigana_mode: stageMeta.furiganaMode,
    },
    { onConflict: "id" },
  );

  if (profileError) {
    if (isMissingSchemaError(profileError)) {
      // Fallback kompatibel bila tabel profil masih memakai skema lama
      const { error: fallbackErr } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          display_name: displayName,
          target_level: stageMeta.targetLevel,
          daily_new_limit: dailyNewLimit,
        },
        { onConflict: "id" },
      );
      if (fallbackErr) {
        return { error: "Gagal menyimpan pengaturan profil. Silakan coba lagi." };
      }
      revalidatePath("/dashboard");
      redirect("/dashboard");
    }

    return { error: "Gagal menyimpan rencana belajar. Silakan coba lagi." };
  }

  // 2. Inisialisasi progres unit kurikulum (tandai unit di bawah level awal sebagai selesai, aktifkan unit awal)
  const { data: units, error: unitsErr } = await supabase
    .from("curriculum_units")
    .select("unit_code, sort_order")
    .order("sort_order", { ascending: true });

  if (!unitsErr && units && units.length > 0) {
    const activeUnit =
      units.find((u) => u.unit_code === activeUnitCode) ?? units[0]!;
    const nowIso = new Date().toISOString();

    const progressRows = units
      .filter((u) => u.sort_order <= activeUnit.sort_order)
      .map((u) => {
        const isSkippedFoundation = u.sort_order < activeUnit.sort_order;
        return {
          user_id: user.id,
          unit_code: u.unit_code,
          lesson_read: isSkippedFoundation,
          status: isSkippedFoundation ? "completed" : "active",
          accuracy: isSkippedFoundation ? 100 : 0,
          completed_at: isSkippedFoundation ? nowIso : null,
          updated_at: nowIso,
        };
      });

    if (progressRows.length > 0) {
      await supabase
        .from("user_unit_progress")
        .upsert(progressRows, { onConflict: "user_id,unit_code" });
    }
  }

  // 3. Siapkan log misi hari pertama sesuai jalur belajar
  const today = new Date();
  const missionDate = today.toISOString().slice(0, 10);
  const defaultSkillMode =
    learningGoal === "work_ssw" || today.getDate() % 2 === 0
      ? "speaking"
      : "reading";

  await supabase.from("daily_mission_logs").upsert(
    {
      user_id: user.id,
      mission_date: missionDate,
      skill_mode: defaultSkillMode,
      updated_at: today.toISOString(),
    },
    { onConflict: "user_id,mission_date", ignoreDuplicates: true },
  );

  revalidatePath("/dashboard");
  revalidatePath("/profile");
  redirect("/dashboard");
}
