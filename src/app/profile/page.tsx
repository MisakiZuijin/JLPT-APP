import { Suspense } from "react";
import { connection } from "next/server";
import { AppShell } from "@/components/layout/AppShell";
import { requireShellContext } from "@/lib/auth-profile";
import { logout } from "../login/actions";
import { ProfileForm } from "./ProfileForm";

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] text-sm font-medium text-slate-500 dark:bg-[#0B1120] dark:text-slate-400">
          Memuat profil &amp; pengaturan...
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}

async function ProfileContent() {
  await connection();
  const { email, profile, dueCount } = await requireShellContext();
  const targetLevel = profile?.target_level ?? "N5";
  const displayName = profile?.display_name ?? email ?? "Pelajar JLPT";

  return (
    <AppShell
      activeTab="profil"
      displayName={displayName}
      targetLevel={targetLevel}
      dueCount={dueCount}
      logoutAction={logout}
    >
      <ProfileForm
        email={email}
        initialName={profile?.display_name ?? ""}
        initialLevel={targetLevel}
        initialLimit={profile?.daily_new_limit ?? 10}
        logoutAction={logout}
      />
    </AppShell>
  );
}
