export const JLPT_LEVELS = ["N5", "N4", "N3", "N2", "N1"] as const;
export type JlptLevel = (typeof JLPT_LEVELS)[number];

export const CURRICULUM_STAGES = [
  "PRE_N5",
  "N5",
  "N4",
  "N3",
  "N2",
  "N1",
] as const;
export type CurriculumStage = (typeof CURRICULUM_STAGES)[number];

export const LEARNING_GOALS = [
  "jlpt",
  "work_ssw",
  "study_jp",
  "general",
] as const;
export type LearningGoal = (typeof LEARNING_GOALS)[number];

export const FURIGANA_MODES = ["all", "smart", "off"] as const;
export type FuriganaMode = (typeof FURIGANA_MODES)[number];

export const STUDY_MINUTES_OPTIONS = [15, 30, 60] as const;
export type StudyMinutesDaily = (typeof STUDY_MINUTES_OPTIONS)[number];

export type Item = {
  id: number;
  type: "kana" | "vocab" | "kanji" | "grammar";
  jlpt_level: JlptLevel;
  unit_code?: string | null;
  term: string;
  reading: string | null;
  meaning: string;
  example_ja: string | null;
  example_id: string | null;
  extra: Record<string, unknown>;
};

export type PlacementScore = {
  total?: number;
  correct?: number;
  recommended_stage?: CurriculumStage;
  breakdown?: Record<string, { correct: number; total: number }>;
  taken_at?: string;
};

export type Profile = {
  id: string;
  display_name: string | null;
  target_level: JlptLevel;
  daily_new_limit: number;
  onboarding_completed: boolean;
  learning_goal: LearningGoal;
  current_stage: CurriculumStage;
  study_minutes_daily: StudyMinutesDaily;
  exam_target_period: string | null;
  placement_score: PlacementScore;
  romaji_enabled: boolean;
  furigana_mode: FuriganaMode;
};

export type CurriculumUnit = {
  id: number;
  stage: CurriculumStage;
  unit_code: string;
  title_ja: string;
  title_id: string;
  can_do_id: string;
  lesson_summary_md: string;
  romaji_default: boolean;
  sort_order: number;
  required_accuracy: number;
};

export type UserUnitStatus = "locked" | "active" | "completed";

export type UserUnitProgress = {
  id: number;
  user_id: string;
  unit_code: string;
  lesson_read: boolean;
  status: UserUnitStatus;
  accuracy: number;
  completed_at: string | null;
  updated_at: string;
};

export type DailyMissionLog = {
  id: number;
  user_id: string;
  mission_date: string;
  step_review_done: boolean;
  step_input_done: boolean;
  step_skill_done: boolean;
  step_test_done: boolean;
  skill_mode: "reading" | "speaking";
  completed_at: string | null;
  updated_at: string;
};
