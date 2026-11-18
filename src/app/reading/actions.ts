"use server";

import { createClient as createAdminClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { JlptLevel } from "@/lib/types";

export async function saveReadingProgress(
  passageSlug: string,
  score: number,
  total: number,
): Promise<{ saved: boolean; message?: string }> {
  if (!isSupabaseConfigured()) {
    return { saved: false, message: "Mode pratinjau: skor dihitung secara lokal." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { saved: false, message: "Masuk akun untuk menyimpan progres bacaan." };
  }

  const { error } = await supabase.from("reading_progress").upsert(
    {
      user_id: user.id,
      passage_slug: passageSlug,
      score,
      total,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,passage_slug" },
  );

  if (error) {
    return {
      saved: false,
      message: "Kuis selesai! Jalankan migrasi 0002_reading_writing.sql di Supabase untuk simpan ke DB.",
    };
  }

  return { saved: true };
}

export async function addWordToSrs(input: {
  term: string;
  reading: string;
  meaning: string;
  level: JlptLevel;
}): Promise<{ ok: boolean; status: "added" | "exists" | "error"; message: string }> {
  if (!isSupabaseConfigured()) {
    return { ok: false, status: "error", message: "Konfigurasi Supabase belum aktif." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, status: "error", message: "Silakan login terlebih dahulu." };
  }

  const cleanTerm = input.term.trim();
  const cleanReading = input.reading.trim();

  // 1. Cari apakah kosakata sudah ada di tabel items
  const { data: existingItems } = await supabase
    .from("items")
    .select("id")
    .eq("term", cleanTerm)
    .limit(1);

  let itemId = existingItems?.[0]?.id as number | undefined;

  // 2. Jika belum ada, buat via service secret key jika tersedia di server
  if (!itemId) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY;

    if (!url || !secretKey) {
      return {
        ok: false,
        status: "error",
        message: "Kosakata ini belum ada di bank kartu awal.",
      };
    }

    const admin = createAdminClient(url, secretKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: inserted, error: insertErr } = await admin
      .from("items")
      .upsert(
        {
          type: "vocab",
          jlpt_level: input.level,
          term: cleanTerm,
          reading: cleanReading || null,
          meaning: input.meaning,
          sort_order: 900,
        },
        { onConflict: "type,jlpt_level,term,reading" },
      )
      .select("id")
      .single();

    if (insertErr || !inserted) {
      return {
        ok: false,
        status: "error",
        message: insertErr?.message ?? "Gagal mendaftarkan kata ke bank kartu.",
      };
    }
    itemId = inserted.id;
  }

  // 3. Cek apakah user sudah memiliki kartu ini
  const { data: existingCard } = await supabase
    .from("user_cards")
    .select("id")
    .eq("user_id", user.id)
    .eq("item_id", itemId)
    .maybeSingle();

  if (existingCard) {
    return {
      ok: true,
      status: "exists",
      message: "Kata ini sudah ada di antrean Hafalan (FSRS) kamu.",
    };
  }

  const { error: cardErr } = await supabase.from("user_cards").insert({
    user_id: user.id,
    item_id: itemId,
    due: new Date().toISOString(),
    state: 0,
  });

  if (cardErr) {
    return { ok: false, status: "error", message: cardErr.message };
  }

  return {
    ok: true,
    status: "added",
    message: "Berhasil ditambahkan ke antrean Hafalan Kartu (/review).",
  };
}
