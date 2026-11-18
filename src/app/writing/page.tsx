import { Suspense } from "react";
import { connection } from "next/server";
import { AppShell } from "@/components/layout/AppShell";
import { StudySubNav } from "@/components/layout/StudySubNav";
import { requireShellContext } from "@/lib/auth-profile";
import { WRITING_CHARACTERS } from "@/lib/japanese/kanjivg-strokes";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { logout } from "../login/actions";
import { WritingWorkspace } from "./WritingWorkspace";

export default function WritingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] text-sm font-medium text-slate-500 dark:bg-[#0B1120] dark:text-slate-400">
          Memuat papan latihan menulis goresan...
        </div>
      }
    >
      <WritingContent />
    </Suspense>
  );
}

async function WritingContent() {
  await connection();

  if (!isSupabaseConfigured()) {
    return (
      <AppShell activeTab="belajar" displayName="Mode Pratinjau" targetLevel="N5" dueCount={0}>
        <div className="mx-auto max-w-6xl space-y-6">
          <StudySubNav active="writing" />
          <WritingWorkspace characters={WRITING_CHARACTERS} initialMastered={{}} />
        </div>
      </AppShell>
    );
  }

  const { userId, email, profile, dueCount } = await requireShellContext();
  const targetLevel = profile?.target_level ?? "N5";
  const displayName = profile?.display_name ?? email ?? "Pelajar JLPT";

  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("writing_progress")
    .select("character, best_accuracy, mastered")
    .eq("user_id", userId);

  const initialMastered: Record<string, number> = {};
  for (const r of rows ?? []) {
    if (r.mastered) {
      initialMastered[r.character] = Number(r.best_accuracy ?? 0);
    }
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
        <StudySubNav active="writing" />
        <WritingWorkspace
          characters={WRITING_CHARACTERS}
          initialMastered={initialMastered}
        />
      </div>
    </AppShell>
  );
}
