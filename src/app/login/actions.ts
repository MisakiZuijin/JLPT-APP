"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getEmailRedirectUrl } from "@/lib/supabase/site-url";

export type AuthState = {
  error?: string;
  message?: string;
  unconfirmedEmail?: string;
};

export type ResendState = {
  error?: string;
  message?: string;
};

export async function login(_: AuthState, formData: FormData): Promise<AuthState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase belum dikonfigurasi di .env.local." };
  }

  const supabase = await createClient();
  const email = String(formData.get("email") ?? "").trim();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: String(formData.get("password") ?? ""),
  });

  if (error) {
    if (
      error.code === "email_not_confirmed" ||
      /email not confirmed/i.test(error.message)
    ) {
      return {
        error:
          "Email kamu belum diverifikasi. Cek kotak masuk / folder Spam atau kirim ulang tautan verifikasi di bawah.",
        unconfirmedEmail: email,
      };
    }
    return { error: error.message };
  }

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
  const emailRedirectTo = await getEmailRedirectUrl();

  const { data, error } = await supabase.auth.signUp({
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
    options: {
      emailRedirectTo,
      ...(displayName
        ? { data: { display_name: displayName, full_name: displayName } }
        : {}),
    },
  });

  if (error) return { error: error.message };

  if (data.session && data.user && displayName) {
    await supabase
      .from("profiles")
      .update({ display_name: displayName })
      .eq("id", data.user.id);
  }

  if (!data.session) {
    return {
      message:
        "Tautan verifikasi sudah dikirim ke email kamu. Cek kotak masuk (atau folder Spam), lalu klik tautannya untuk masuk.",
    };
  }
  redirect("/dashboard");
}

export async function resendConfirmation(
  _: ResendState,
  formData: FormData
): Promise<ResendState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase belum dikonfigurasi." };
  }

  const email = String(formData.get("email") ?? "").trim();
  if (!email || !email.includes("@")) {
    return { error: "Masukkan alamat email yang valid." };
  }

  const supabase = await createClient();
  const emailRedirectTo = await getEmailRedirectUrl();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo },
  });

  if (error) {
    return { error: error.message };
  }

  return {
    message: `Tautan verifikasi baru telah dikirim ke ${email}. Cek kotak masuk atau folder Spam ya.`,
  };
}

export async function logout() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/login");
}
