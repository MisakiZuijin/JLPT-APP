export const JLPT_LEVELS = ["N5", "N4", "N3", "N2", "N1"] as const;
export type JlptLevel = (typeof JLPT_LEVELS)[number];

export type Item = {
  id: number;
  type: "kana" | "vocab" | "kanji" | "grammar";
  jlpt_level: JlptLevel;
  term: string;
  reading: string | null;
  meaning: string;
  example_ja: string | null;
  example_id: string | null;
  extra: Record<string, unknown>;
};

export type Profile = {
  id: string;
  display_name: string | null;
  target_level: JlptLevel;
  daily_new_limit: number;
};
