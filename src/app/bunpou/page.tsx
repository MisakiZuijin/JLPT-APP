import { Suspense } from "react";
import { connection } from "next/server";
import { AppShell } from "@/components/layout/AppShell";
import { ExamSubNav } from "@/components/layout/ExamSubNav";
import { requireShellContext } from "@/lib/auth-profile";
import { BUNPOU_EXERCISES } from "@/lib/japanese/bunpou-data";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { logout } from "../login/actions";
import { BunpouWorkspace } from "./BunpouWorkspace";

export default function BunpouPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] text-sm font-medium text-slate-500 dark:bg-[#0B1120] dark:text-slate-400">
          Memuat Bunpou Builder...
        </div>
      }
    >
      <BunpouContent />
    </Suspense>
  );
}

async function BunpouContent() {
  await connection();

  if (!isSupabaseConfigured()) {
    return (
      <AppShell activeTab="ujian" displayName="Mode Pratinjau" targetLevel="N5" dueCount={0}>
        <div className="mx-auto max-w-6xl space-y-6">
          <ExamSubNav active="bunpou" />
          <BunpouWorkspace exercises={BUNPOU_EXERCISES} />
        </div>
      </AppShell>
    );
  }

  const { email, profile, dueCount } = await requireShellContext();
  const targetLevel = profile?.target_level ?? "N5";
  const displayName = profile?.display_name ?? email ?? "Pelajar JLPT";

  return (
    <AppShell
      activeTab="ujian"
      displayName={displayName}
      targetLevel={targetLevel}
      dueCount={dueCount}
      logoutAction={logout}
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <ExamSubNav active="bunpou" />
        <BunpouWorkspace exercises={BUNPOU_EXERCISES} />
      </div>
    </AppShell>
  );
}
