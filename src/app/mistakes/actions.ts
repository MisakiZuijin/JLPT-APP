"use server";

import { revalidatePath } from "next/cache";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export async function toggleMistakeResolved(id: number, resolved: boolean): Promise<void> {
  if (!isSupabaseConfigured() || id < 0) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase
    .from("mistakes_notebook")
    .update({ resolved, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/mistakes");
}
