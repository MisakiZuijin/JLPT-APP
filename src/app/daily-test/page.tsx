import { Suspense } from "react";
import { connection } from "next/server";
import { AppShell } from "@/components/layout/AppShell";
import { ExamSubNav } from "@/components/layout/ExamSubNav";
import { requireShellContext } from "@/lib/auth-profile";
import { generateDailyTest } from "@/lib/japanese/daily-test-generator";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { logout } from "../login/actions";
import { DailyTestWorkspace } from "./DailyTestWorkspace";

export default function DailyTestPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] text-sm font-medium text-slate-500 dark:bg-[#0B1120] dark:text-slate-400">
          Menyiapkan 20 soal Tes Harian...
        </div>
      }
    >
      <DailyTestContent />
    </Suspense>
  );
}

async function DailyTestContent() {
  await connection();
  const dateKey = new Date().toISOString().slice(0, 10);

  if (!isSupabaseConfigured()) {
    const questions = generateDailyTest("N5", dateKey);
    return (
      <AppShell activeTab="ujian" displayName="Mode Pratinjau" targetLevel="N5" dueCount={0}>
        <div className="mx-auto max-w-6xl space-y-6">
          <ExamSubNav active="daily" />
          <DailyTestWorkspace level="N5" questions={questions} previousScore={null} />
        </div>
      </AppShell>
    );
  }

  const { userId, email, profile, dueCount } = await requireShellContext();
  const targetLevel = profile?.target_level ?? "N5";
  const displayName = profile?.display_name ?? email ?? "Pelajar JLPT";

  const supabase = await createClient();
  const { data: todayRow } = await supabase
    .from("daily_tests")
    .select("score")
    .eq("user_id", userId)
    .eq("test_date", dateKey)
    .maybeSingle();

  const questions = generateDailyTest(targetLevel, dateKey);

  return (
    <AppShell
      activeTab="ujian"
      displayName={displayName}
      targetLevel={targetLevel}
      dueCount={dueCount}
      logoutAction={logout}
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <ExamSubNav active="daily" />
        <DailyTestWorkspace
          level={targetLevel}
          questions={questions}
          previousScore={todayRow?.score !== null && todayRow?.score !== undefined ? Number(todayRow.score) : null}
        />
      </div>
    </AppShell>
  );
}
