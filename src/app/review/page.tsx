import { Suspense } from "react";
import { connection } from "next/server";
import { AppShell } from "@/components/layout/AppShell";
import { requireShellContext } from "@/lib/auth-profile";
import { logout } from "../login/actions";
import { getQueue } from "./actions";
import ReviewSession from "./ReviewSession";

export default function ReviewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] text-sm font-medium text-slate-500 dark:bg-[#0B1120] dark:text-slate-400">
          Menyiapkan antrean review FSRS...
        </div>
      }
    >
      <ReviewContent />
    </Suspense>
  );
}

async function ReviewContent() {
  await connection();
  const [{ email, profile, dueCount }, queue] = await Promise.all([
    requireShellContext(),
    getQueue(),
  ]);

  const targetLevel = profile?.target_level ?? "N5";
  const displayName = profile?.display_name ?? email ?? "Pelajar JLPT";

  return (
    <AppShell
      activeTab="hafal"
      displayName={displayName}
      targetLevel={targetLevel}
      dueCount={dueCount}
      logoutAction={logout}
    >
      <ReviewSession initialQueue={queue} />
    </AppShell>
  );
}
