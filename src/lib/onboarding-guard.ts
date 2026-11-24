import type { SupabaseClient } from "@supabase/supabase-js";

export type OnboardingCheckResult = {
  schemaReady: boolean;
  completed: boolean;
};

type PostgrestLikeError = {
  code?: string | null;
  message?: string | null;
} | null;

export function isMissingSchemaError(error: PostgrestLikeError): boolean {
  if (!error) return false;
  const code = error.code ?? "";
  const msg = error.message ?? "";
  return (
    code === "42703" ||
    code === "42P01" ||
    code === "PGRST204" ||
    code === "PGRST205" ||
    /onboarding_completed|does not exist|schema cache/i.test(msg)
  );
}

/**
 * Memeriksa status onboarding akun pelajar secara aman.
 * Bila migrasi 0005 belum dijalankan di Supabase (kolom belum ada),
 * fungsi mengembalikan { schemaReady: false, completed: true } agar app tidak error/loop.
 */
export async function getOnboardingStatus(
  supabase: SupabaseClient,
  userId: string,
): Promise<OnboardingCheckResult> {
  const { data, error } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", userId)
    .maybeSingle<{ onboarding_completed?: boolean }>();

  if (error) {
    if (isMissingSchemaError(error)) {
      return { schemaReady: false, completed: true };
    }
    return { schemaReady: false, completed: true };
  }

  if (!data) {
    return { schemaReady: true, completed: false };
  }

  if (typeof data.onboarding_completed !== "boolean") {
    return { schemaReady: false, completed: true };
  }

  return { schemaReady: true, completed: data.onboarding_completed };
}
