import { Suspense } from "react";
import { requireShellContext } from "@/lib/auth-profile";
import { logout } from "@/app/login/actions";
import { OnboardingWizard } from "./OnboardingWizard";

export default function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ retake?: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-canvas text-sm font-medium text-text-secondary">
          Menyiapkan halaman awal belajarmu...
        </div>
      }
    >
      <OnboardingContent searchParams={searchParams} />
    </Suspense>
  );
}

async function OnboardingContent({
  searchParams,
}: {
  searchParams: Promise<{ retake?: string }>;
}) {
  const [{ email, profile, isAdmin }, sp] = await Promise.all([
    requireShellContext({ allowIncompleteOnboarding: true }),
    searchParams,
  ]);

  const displayName = profile?.display_name ?? email ?? "Pelajar JLPT";
  const isRetake = sp?.retake === "1";

  return (
    <OnboardingWizard
      displayName={displayName}
      initialProfile={profile}
      isRetake={isRetake}
      isAdmin={isAdmin}
      logoutAction={logout}
    />
  );
}
