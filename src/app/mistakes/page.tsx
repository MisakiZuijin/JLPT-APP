import { Suspense } from "react";
import { connection } from "next/server";
import { AppShell } from "@/components/layout/AppShell";
import { ExamSubNav } from "@/components/layout/ExamSubNav";
import { requireShellContext } from "@/lib/auth-profile";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { logout } from "../login/actions";
import { MistakesWorkspace, type MistakeRow } from "./MistakesWorkspace";

export default function MistakesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] text-sm font-medium text-slate-500 dark:bg-[#0B1120] dark:text-slate-400">
          Memuat catatan kesalahan...
        </div>
      }
    >
      <MistakesContent />
    </Suspense>
  );
}

async function MistakesContent() {
  await connection();

  if (!isSupabaseConfigured()) {
    return (
      <AppShell activeTab="ujian" displayName="Mode Pratinjau" targetLevel="N5" dueCount={0}>
        <div className="mx-auto max-w-6xl space-y-6">
          <ExamSubNav active="mistakes" />
          <MistakesWorkspace initialRows={[]} />
        </div>
      </AppShell>
    );
  }

  const { userId, email, profile, dueCount } = await requireShellContext();
  const targetLevel = profile?.target_level ?? "N5";
  const displayName = profile?.display_name ?? email ?? "Pelajar JLPT";

  const supabase = await createClient();
  const { data } = await supabase
    .from("mistakes_notebook")
    .select("id, category, prompt, your_answer, correct_answer, explanation, wrong_count, resolved")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  return (
    <AppShell
      activeTab="ujian"
      displayName={displayName}
      targetLevel={targetLevel}
      dueCount={dueCount}
      logoutAction={logout}
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <ExamSubNav active="mistakes" />
        <MistakesWorkspace initialRows={(data as MistakeRow[] | null) ?? []} />
      </div>
    </AppShell>
  );
}
