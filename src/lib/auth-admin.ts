import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient as createAdminClient, type User } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export function isAdminUser(user: User | null | undefined): boolean {
  if (!user) return false;
  return user.app_metadata?.role === "admin";
}

export type AdminContextData = {
  userId: string;
  email: string;
  displayName: string;
};

export async function requireAdminContext(): Promise<AdminContextData> {
  await connection();

  if (!isSupabaseConfigured()) {
    redirect("/login?setup=1");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/admin");
  }

  if (!isAdminUser(user)) {
    redirect("/dashboard");
  }

  return {
    userId: user.id,
    email: user.email ?? "admin@jlptapp.local",
    displayName:
      String(user.user_metadata?.display_name ?? "") || "Admin JLPT App",
  };
}

export function getSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secretKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL atau SUPABASE_SECRET_KEY belum tersedia.");
  }
  return createAdminClient(url, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
