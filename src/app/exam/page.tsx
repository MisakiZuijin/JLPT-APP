import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { AppShell } from "@/components/layout/AppShell";
import { ExamSubNav } from "@/components/layout/ExamSubNav";
import { IconArrowRight, IconAward, IconClock } from "@/components/ui/Icons";
import { requireShellContext } from "@/lib/auth-profile";
import { MOCK_EXAMS } from "@/lib/japanese/exam-bank";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { JLPT_LEVELS, type JlptLevel } from "@/lib/types";
import { logout } from "../login/actions";

type BestAttemptMap = Partial<
  Record<JlptLevel, { totalScore: number; maxScore: number; passed: boolean }>
>;

export default function ExamHubPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] text-sm font-medium text-slate-500 dark:bg-[#0B1120] dark:text-slate-400">
          Memuat daftar simulasi JLPT N5–N1...
        </div>
      }
    >
      <ExamHubContent />
    </Suspense>
  );
}

async function ExamHubContent() {
  await connection();

  let displayName = "Mode Pratinjau";
  let targetLevel: JlptLevel = "N5";
  let dueCount = 0;
  let hasAuth = false;
  const bestMap: BestAttemptMap = {};

  if (isSupabaseConfigured()) {
    const ctx = await requireShellContext();
    hasAuth = true;
    targetLevel = ctx.profile?.target_level ?? "N5";
    displayName = ctx.profile?.display_name ?? ctx.email ?? "Pelajar JLPT";
    dueCount = ctx.dueCount;

    const supabase = await createClient();
    const { data: attempts } = await supabase
      .from("exam_attempts")
      .select("jlpt_level, total_score, max_score, passed")
      .eq("user_id", ctx.userId);

    for (const row of attempts ?? []) {
      const lvl = row.jlpt_level as JlptLevel;
      const prev = bestMap[lvl];
      if (!prev || Number(row.total_score) > prev.totalScore) {
        bestMap[lvl] = {
          totalScore: Number(row.total_score),
          maxScore: Number(row.max_score),
          passed: Boolean(row.passed),
        };
      }
    }
  }

  return (
    <AppShell
      activeTab="ujian"
      displayName={displayName}
      targetLevel={targetLevel}
      dueCount={dueCount}
      logoutAction={hasAuth ? logout : undefined}
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <ExamSubNav active="exam" />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold tracking-wider text-[#2563EB] uppercase dark:text-blue-400">
              Tahap 4 · Simulasi Resmi Berwaktu
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
              Simulasi Ujian JLPT N5–N1
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Terdiri dari bagian Kosakata &amp; Kanji, Tata Bahasa &amp; Bacaan, serta Listening dengan timer, tanda Ragu, batas lulus per bagian, dan pembahasan.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-200">
            <IconAward className="h-4 w-4 text-[#2563EB] dark:text-blue-400" />
            Target Akun: JLPT {targetLevel}
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {JLPT_LEVELS.map((lvl) => {
            const spec = MOCK_EXAMS[lvl];
            const totalMinutes = spec.sections.reduce(
              (acc, s) => acc + s.durationMinutes,
              0,
            );
            const totalQuestions = spec.sections.reduce(
              (acc, s) => acc + s.questions.length,
              0,
            );
            const best = bestMap[lvl];
            const isTarget = lvl === targetLevel;

            return (
              <div
                key={lvl}
                className={`flex flex-col justify-between rounded-3xl border bg-white p-6 dark:bg-[#111827] ${
                  isTarget
                    ? "border-[#2563EB]"
                    : "border-slate-200 dark:border-slate-800"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-lg bg-[#2563EB] px-2.5 py-1 text-xs font-extrabold text-white">
                      JLPT {lvl}
                    </span>
                    {isTarget && (
                      <span className="rounded-full bg-[#2563EB]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#2563EB] dark:bg-blue-950/60 dark:text-blue-300">
                        Targetmu
                      </span>
                    )}
                  </div>

                  <h2 className="mt-3 text-lg font-extrabold text-slate-900 dark:text-white">
                    {spec.title}
                  </h2>

                  <ul className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-1.5">
                      <IconClock className="h-3.5 w-3.5 text-[#2563EB]" />
                      {spec.sections.length} Bagian · Timer total {totalMinutes} menit · {totalQuestions} soal inti
                    </li>
                    <li>
                      Batas Lulus: {spec.totalPassScore} / {spec.totalMaxScore} poin (minimal per bagian berlaku)
                    </li>
                  </ul>

                  {best && (
                    <div
                      className={`mt-4 rounded-xl px-3 py-2 text-xs font-bold ${
                        best.passed
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : "bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200"
                      }`}
                    >
                      Skor Terbaik: {best.totalScore}/{best.maxScore} (
                      {best.passed ? "LULUS" : "Perlu latihan lagi"})
                    </div>
                  )}
                </div>

                <Link
                  href={`/exam/${lvl.toLowerCase()}`}
                  className="mt-5 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0F172A] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 dark:bg-[#2563EB] dark:hover:bg-blue-700"
                >
                  <span>Mulai Simulasi {lvl}</span>
                  <IconArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
