import { Suspense } from "react";
import { connection } from "next/server";
import { AppShell } from "@/components/layout/AppShell";
import { requireShellContext } from "@/lib/auth-profile";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { logout } from "../login/actions";
import { SettingsView } from "./SettingsView";

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] text-sm font-medium text-slate-500 dark:bg-[#0B1120] dark:text-slate-400">
          Memuat halaman pengaturan...
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}

async function SettingsContent() {
  await connection();
  if (!isSupabaseConfigured()) {
    return (
      <AppShell activeTab="pengaturan" displayName="Mode Pratinjau" targetLevel="N5" dueCount={0}>
        <SettingsView isPreviewMode />
      </AppShell>
    );
  }

  const { email, profile, dueCount } = await requireShellContext();
  const targetLevel = profile?.target_level ?? "N5";
  const displayName = profile?.display_name ?? email ?? "Pelajar JLPT";

  return (
    <AppShell
      activeTab="pengaturan"
      displayName={displayName}
      targetLevel={targetLevel}
      dueCount={dueCount}
      logoutAction={logout}
    >
      <SettingsView isPreviewMode={false} />
    </AppShell>
  );
}
