import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  getOnboardingStatus,
  isMissingSchemaError,
  type OnboardingCheckResult,
} from "@/lib/onboarding-guard";
import {
  CURRICULUM_STAGES,
  FURIGANA_MODES,
  JLPT_LEVELS,
  LEARNING_GOALS,
  STUDY_MINUTES_OPTIONS,
  type CurriculumStage,
  type FuriganaMode,
  type JlptLevel,
  type LearningGoal,
  type PlacementScore,
  type Profile,
  type StudyMinutesDaily,
} from "@/lib/types";

export { getOnboardingStatus, isMissingSchemaError, type OnboardingCheckResult };

export type ShellContextData = {
  userId: string;
  email: string | null;
  isAdmin: boolean;
  profile: Profile | null;
  onboardingSchemaReady: boolean;
  dueCount: number;
};

function asJlptLevel(value: unknown): JlptLevel {
  return JLPT_LEVELS.includes(value as JlptLevel) ? (value as JlptLevel) : "N5";
}

function asStage(value: unknown): CurriculumStage {
  return CURRICULUM_STAGES.includes(value as CurriculumStage)
    ? (value as CurriculumStage)
    : "PRE_N5";
}

function asGoal(value: unknown): LearningGoal {
  return LEARNING_GOALS.includes(value as LearningGoal)
    ? (value as LearningGoal)
    : "jlpt";
}

function asFurigana(value: unknown): FuriganaMode {
  return FURIGANA_MODES.includes(value as FuriganaMode)
    ? (value as FuriganaMode)
    : "all";
}

function asStudyMinutes(value: unknown): StudyMinutesDaily {
  const num = Number(value);
  return STUDY_MINUTES_OPTIONS.includes(num as StudyMinutesDaily)
    ? (num as StudyMinutesDaily)
    : 30;
}

export function normalizeProfile(
  raw: Record<string, unknown> | null | undefined,
  fallbackUserId: string,
): { profile: Profile | null; schemaReady: boolean } {
  if (!raw) {
    return { profile: null, schemaReady: false };
  }

  const schemaReady = typeof raw.onboarding_completed === "boolean";
  const placementRaw =
    raw.placement_score && typeof raw.placement_score === "object"
      ? (raw.placement_score as PlacementScore)
      : {};

  const profile: Profile = {
    id: typeof raw.id === "string" ? raw.id : fallbackUserId,
    display_name: typeof raw.display_name === "string" ? raw.display_name : null,
    target_level: asJlptLevel(raw.target_level),
    daily_new_limit:
      typeof raw.daily_new_limit === "number" ? raw.daily_new_limit : 10,
    onboarding_completed: schemaReady ? Boolean(raw.onboarding_completed) : true,
    learning_goal: asGoal(raw.learning_goal),
    current_stage: asStage(raw.current_stage),
    study_minutes_daily: asStudyMinutes(raw.study_minutes_daily),
    exam_target_period:
      typeof raw.exam_target_period === "string" ? raw.exam_target_period : null,
    placement_score: placementRaw,
    romaji_enabled:
      typeof raw.romaji_enabled === "boolean" ? raw.romaji_enabled : true,
    furigana_mode: asFurigana(raw.furigana_mode),
  };

  return { profile, schemaReady };
}

export async function requireShellContext(options?: {
  allowIncompleteOnboarding?: boolean;
}): Promise<ShellContextData> {
  await connection();

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

  const isAdmin = user.app_metadata?.role === "admin";
  const nowIso = new Date().toISOString();

  const [{ data: rawProfile }, { count: dueCount }] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle<Record<string, unknown>>(),
    supabase
      .from("user_cards")
      .select("*", { count: "exact", head: true })
      .lte("due", nowIso),
  ]);

  const { profile, schemaReady } = normalizeProfile(rawProfile, user.id);

  // Defense-in-depth onboarding guard: pelajar wajib selesaikan /onboarding bila skema 0005 aktif
  if (
    !options?.allowIncompleteOnboarding &&
    !isAdmin &&
    schemaReady &&
    profile &&
    !profile.onboarding_completed
  ) {
    redirect("/onboarding");
  }

  return {
    userId: user.id,
    email: user.email ?? null,
    isAdmin,
    profile,
    onboardingSchemaReady: schemaReady,
    dueCount: dueCount ?? 0,
  };
}
