import { Suspense } from "react";
import { connection } from "next/server";
import { AppShell } from "@/components/layout/AppShell";
import { StudySubNav } from "@/components/layout/StudySubNav";
import { requireShellContext } from "@/lib/auth-profile";
import { READING_PASSAGES } from "@/lib/japanese/reading-data";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { logout } from "../login/actions";
import { ReadingHub } from "./ReadingHub";

export default function ReadingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] text-sm font-medium text-slate-500 dark:bg-[#0B1120] dark:text-slate-400">
          Memuat daftar bacaan N5–N1...
        </div>
      }
    >
      <ReadingContent />
    </Suspense>
  );
}

async function ReadingContent() {
  await connection();

  if (!isSupabaseConfigured()) {
    return (
      <AppShell activeTab="belajar" displayName="Mode Pratinjau" targetLevel="N5" dueCount={0}>
        <div className="mx-auto max-w-6xl space-y-6">
          <StudySubNav active="reading" />
          <ReadingHub passages={READING_PASSAGES} defaultLevel="N5" progressMap={{}} />
        </div>
      </AppShell>
    );
  }

  const { userId, email, profile, dueCount } = await requireShellContext();
  const targetLevel = profile?.target_level ?? "N5";
  const displayName = profile?.display_name ?? email ?? "Pelajar JLPT";

  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("reading_progress")
    .select("passage_slug, score, total")
    .eq("user_id", userId);

  const progressMap: Record<string, { score: number; total: number }> = {};
  for (const r of rows ?? []) {
    progressMap[r.passage_slug] = { score: r.score, total: r.total };
  }

  return (
    <AppShell
      activeTab="belajar"
      displayName={displayName}
      targetLevel={targetLevel}
      dueCount={dueCount}
      logoutAction={logout}
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <StudySubNav active="reading" />
        <ReadingHub
          passages={READING_PASSAGES}
          defaultLevel={targetLevel}
          progressMap={progressMap}
        />
      </div>
    </AppShell>
  );
}
