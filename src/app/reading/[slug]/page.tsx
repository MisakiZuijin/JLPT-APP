import { Suspense } from "react";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { AppShell } from "@/components/layout/AppShell";
import { requireShellContext } from "@/lib/auth-profile";
import { getPassageBySlug } from "@/lib/japanese/reading-data";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { logout } from "@/app/login/actions";
import { ReadingReader } from "./ReadingReader";

export default function ReadingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] text-sm font-medium text-slate-500 dark:bg-[#0B1120] dark:text-slate-400">
          Memuat teks bacaan...
        </div>
      }
    >
      <ReadingDetailContent params={params} />
    </Suspense>
  );
}

async function ReadingDetailContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();
  const { slug } = await params;
  const passage = getPassageBySlug(slug);
  if (!passage) {
    notFound();
  }

  if (!isSupabaseConfigured()) {
    return (
      <AppShell activeTab="belajar" displayName="Mode Pratinjau" targetLevel="N5" dueCount={0}>
        <ReadingReader passage={passage} />
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
      <ReadingReader passage={passage} />
    </AppShell>
  );
}
