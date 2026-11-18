import { Suspense } from "react";
import { connection } from "next/server";
import { AppShell } from "@/components/layout/AppShell";
import { SpeakSubNav } from "@/components/layout/SpeakSubNav";
import { requireShellContext } from "@/lib/auth-profile";
import { KAIWA_SCENARIOS } from "@/lib/japanese/kaiwa-data";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { logout } from "../login/actions";
import { KaiwaWorkspace } from "./KaiwaWorkspace";

export default function KaiwaPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] text-sm font-medium text-slate-500 dark:bg-[#0B1120] dark:text-slate-400">
          Memuat skenario Kaiwa roleplay...
        </div>
      }
    >
      <KaiwaContent />
    </Suspense>
  );
}

async function KaiwaContent() {
  await connection();

  if (!isSupabaseConfigured()) {
    return (
      <AppShell activeTab="belajar" displayName="Mode Pratinjau" targetLevel="N5" dueCount={0}>
        <div className="mx-auto max-w-6xl space-y-6">
          <SpeakSubNav active="kaiwa" />
          <KaiwaWorkspace scenarios={KAIWA_SCENARIOS} />
        </div>
      </AppShell>
    );
  }

  const { email, profile, dueCount } = await requireShellContext();
  const targetLevel = profile?.target_level ?? "N5";
  const displayName = profile?.display_name ?? email ?? "Pelajar JLPT";

  return (
    <AppShell
      activeTab="belajar"
      displayName={displayName}
      targetLevel={targetLevel}
      dueCount={dueCount}
      logoutAction={logout}
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <SpeakSubNav active="kaiwa" />
        <KaiwaWorkspace scenarios={KAIWA_SCENARIOS} />
      </div>
    </AppShell>
  );
}
