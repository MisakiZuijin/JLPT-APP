import { Suspense } from "react";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { AppShell } from "@/components/layout/AppShell";
import { requireShellContext } from "@/lib/auth-profile";
import {
  MOCK_EXAMS,
  type ExamQuestion,
  type MockExamSpec,
} from "@/lib/japanese/exam-bank";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { JLPT_LEVELS, type JlptLevel } from "@/lib/types";
import { logout } from "@/app/login/actions";
import { ExamSession } from "./ExamSession";

export default function ExamLevelPage({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] text-sm font-medium text-slate-500 dark:bg-[#0B1120] dark:text-slate-400">
          Menyiapkan ruang simulasi ujian JLPT...
        </div>
      }
    >
      <ExamLevelContent params={params} />
    </Suspense>
  );
}

type DbBankRow = {
  id: string;
  section: string;
  prompt_ja: string;
  prompt_id: string;
  audio_text: string | null;
  options: string[];
  answer_index: number;
  explanation_id: string;
};

function mergeBankQuestions(base: MockExamSpec, rows: DbBankRow[]): MockExamSpec {
  if (rows.length === 0) return base;
  const sections = base.sections.map((sec) => ({
    ...sec,
    questions: [...sec.questions],
  }));

  for (const row of rows) {
    const q: ExamQuestion = {
      id: `bank-${row.id}`,
      promptJa: row.prompt_ja,
      promptId: row.prompt_id,
      ...(row.audio_text ? { audioText: row.audio_text } : {}),
      options: Array.isArray(row.options) ? row.options : [],
      answerIndex: row.answer_index,
      explanationId: row.explanation_id,
    };
    const secName = row.section;
    let targetIdx = 0;
    if (secName === "Mendengarkan Audio") {
      const idx = sections.findIndex((s) => s.title.includes("聴解"));
      targetIdx = idx >= 0 ? idx : sections.length - 1;
    } else if (secName === "Tata Bahasa & Bacaan") {
      const idx = sections.findIndex(
        (s) => s.title.includes("文法") || s.title.includes("言語知識")
      );
      targetIdx = idx >= 0 ? idx : 0;
    } else {
      const idx = sections.findIndex((s) => s.title.includes("文字"));
      targetIdx = idx >= 0 ? idx : 0;
    }
    if (sections[targetIdx]) {
      sections[targetIdx].questions.push(q);
    }
  }

  return { ...base, sections };
}

async function ExamLevelContent({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  await connection();
  const { level } = await params;
  const upper = level.toUpperCase() as JlptLevel;
  if (!JLPT_LEVELS.includes(upper)) {
    notFound();
  }

  const baseSpec = MOCK_EXAMS[upper];

  if (!isSupabaseConfigured()) {
    return (
      <AppShell activeTab="ujian" displayName="Mode Pratinjau" targetLevel={upper} dueCount={0}>
        <ExamSession spec={baseSpec} />
      </AppShell>
    );
  }

  const { email, isAdmin, profile, dueCount } = await requireShellContext();
  const targetLevel = profile?.target_level ?? upper;
  const displayName = profile?.display_name ?? email ?? "Pelajar JLPT";

  let spec = baseSpec;
  const supabase = await createClient();
  const { data: bankRows, error: bankError } = await supabase
    .from("question_bank")
    .select("id, section, prompt_ja, prompt_id, audio_text, options, answer_index, explanation_id")
    .eq("jlpt_level", upper)
    .eq("approved", true)
    .order("created_at", { ascending: true });

  if (!bankError && bankRows) {
    spec = mergeBankQuestions(baseSpec, bankRows as DbBankRow[]);
  }

  return (
    <AppShell
      activeTab="ujian"
      displayName={displayName}
      targetLevel={targetLevel}
      dueCount={dueCount}
      isAdmin={isAdmin}
      logoutAction={logout}
    >
      <ExamSession spec={spec} />
    </AppShell>
  );
}
