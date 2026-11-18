import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Profile } from "@/lib/types";

export type ShellContextData = {
  userId: string;
  email: string | null;
  isAdmin: boolean;
  profile: Profile | null;
  dueCount: number;
};

export async function requireShellContext(): Promise<ShellContextData> {
  await connection();

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

  const nowIso = new Date().toISOString();
  const [{ data: profile }, { count: dueCount }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single<Profile>(),
    supabase
      .from("user_cards")
      .select("*", { count: "exact", head: true })
      .lte("due", nowIso),
  ]);

  return {
    userId: user.id,
    email: user.email ?? null,
    isAdmin: user.app_metadata?.role === "admin",
    profile: profile ?? null,
    dueCount: dueCount ?? 0,
  };
}
