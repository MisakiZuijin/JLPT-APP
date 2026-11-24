"use server";

import { redirect } from "next/navigation";
import { isMissingSchemaError } from "@/lib/onboarding-guard";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Aksi sementara Fase 2 agar akun pelajar baru tidak pernah terjebak
 * sebelum Wizard Onboarding 4 Langkah & Tes Penempatan 15 Soal hadir di Fase 3.
 */
export async function completeOnboardingTemporary() {
  if (!isSupabaseConfigured()) {
    redirect("/login?setup=1");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        display_name:
          (user.user_metadata?.display_name as string | undefined) ||
          (user.user_metadata?.full_name as string | undefined) ||
          user.email?.split("@")[0] ||
          "Pelajar JLPT",
        onboarding_completed: true,
      },
      { onConflict: "id" },
    );

  // Bila migrasi 0005 belum dijalankan di DB, tetap lanjut ke dashboard tanpa crash
  if (error && !isMissingSchemaError(error)) {
    throw new Error(error.message);
  }

  redirect("/dashboard");
}
