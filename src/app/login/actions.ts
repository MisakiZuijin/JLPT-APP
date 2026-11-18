"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type AuthState = { error?: string; message?: string };

export async function login(_: AuthState, formData: FormData): Promise<AuthState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase belum dikonfigurasi di .env.local." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  });

  if (error) return { error: error.message };
  if (data.user?.app_metadata?.role === "admin") {
    redirect("/admin");
  }
  redirect("/dashboard");
}

export async function signup(_: AuthState, formData: FormData): Promise<AuthState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase belum dikonfigurasi di .env.local." };
  }

  const supabase = await createClient();
  const displayName = String(formData.get("display_name") ?? "").trim();

  const { data, error } = await supabase.auth.signUp({
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
    options: displayName ? { data: { full_name: displayName } } : undefined,
  });

  if (error) return { error: error.message };

  if (data.user && displayName) {
    await supabase
      .from("profiles")
      .update({ display_name: displayName })
      .eq("id", data.user.id);
  }

  if (!data.session) {
    return { message: "Cek email kamu untuk konfirmasi akun, lalu silakan masuk." };
  }
  redirect("/dashboard");
}

export async function logout() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/login");
}
