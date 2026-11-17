"use server";

import { createClient } from "@/lib/supabase/server";
import { applyReview, isGrade, type CardRow } from "@/lib/srs";
import { JLPT_LEVELS, type Item, type Profile } from "@/lib/types";

export type QueueEntry = { item: Item; isNew: boolean };

export async function getQueue(): Promise<QueueEntry[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: profile } = await supabase
    .from("profiles").select("*").eq("id", user.id).single<Profile>();
  const target = profile?.target_level ?? "N5";
  // Level target + semua level yang lebih mudah (N5 dulu)
  const levels = JLPT_LEVELS.slice(0, JLPT_LEVELS.indexOf(target) + 1);

  // 1) Kartu jatuh tempo
  const { data: due } = await supabase
    .from("user_cards")
    .select("item:items(*)")
    .lte("due", new Date().toISOString())
    .order("due")
    .limit(100);

  const dueEntries: QueueEntry[] = (due ?? [])
    .map((r) => r.item as unknown as Item)
    .filter(Boolean)
    .map((item) => ({ item, isNew: false }));

  // 2) Kartu baru (sisa kuota hari ini)
  const startOfDay = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
  const { count: introducedToday } = await supabase
    .from("user_cards").select("*", { count: "exact", head: true })
    .gte("created_at", startOfDay);
  const remaining = Math.max(0, (profile?.daily_new_limit ?? 10) - (introducedToday ?? 0));

  let newEntries: QueueEntry[] = [];
  if (remaining > 0) {
    const { data: owned } = await supabase.from("user_cards").select("item_id");
    const ownedIds = new Set((owned ?? []).map((o) => o.item_id as number));

    const { data: candidates } = await supabase
      .from("items").select("*")
      .in("jlpt_level", levels)
      .order("jlpt_level", { ascending: false }) // N5 → N1
      .order("sort_order")
      .limit(ownedIds.size + remaining + 50);

    newEntries = (candidates ?? [])
      .filter((i) => !ownedIds.has(i.id))
      .slice(0, remaining)
      .map((item) => ({ item: item as Item, isNew: true }));
  }

  return [...dueEntries, ...newEntries];
}

export async function submitReview(itemId: number, rating: number) {
  if (!isGrade(rating)) throw new Error("Rating tidak valid");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Belum login");

  const { data: existing } = await supabase
    .from("user_cards").select("*")
    .eq("user_id", user.id).eq("item_id", itemId)
    .maybeSingle<CardRow>();

  const { row, log } = applyReview(existing, rating);

  const { error } = await supabase
    .from("user_cards")
    .upsert({ user_id: user.id, item_id: itemId, ...row }, { onConflict: "user_id,item_id" });
  if (error) throw new Error(error.message);

  await supabase.from("review_logs").insert({
    user_id: user.id,
    item_id: itemId,
    rating,
    state: log.state as number,
    scheduled_days: row.scheduled_days,
  });

  return { due: row.due };
}
