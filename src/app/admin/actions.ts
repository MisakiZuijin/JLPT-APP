"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdminClient, requireAdminContext } from "@/lib/auth-admin";
import {
  generateBatchQuestionsWithGemini,
  type GeneratedQuestionDraft,
  type QuestionSection,
} from "@/lib/ai/gemini-questions";
import type { JlptLevel } from "@/lib/types";

export type BankQuestionRow = {
  id: number;
  jlpt_level: JlptLevel;
  section: QuestionSection;
  prompt_ja: string;
  prompt_id: string;
  audio_text: string | null;
  options: string[];
  answer_index: number;
  explanation_id: string;
  source: string;
  approved: boolean;
  created_at: string;
};

export async function generateDraftQuestionsAction(input: {
  level: JlptLevel;
  section: QuestionSection;
  count: number;
}): Promise<{ ok: boolean; drafts: GeneratedQuestionDraft[]; error?: string }> {
  try {
    await requireAdminContext();
    const drafts = await generateBatchQuestionsWithGemini(input);
    return { ok: true, drafts };
  } catch (err) {
    return {
      ok: false,
      drafts: [],
      error: err instanceof Error ? err.message : "Gagal membuat draft soal Gemini.",
    };
  }
}

export async function approveAndSaveQuestionAction(
  draft: GeneratedQuestionDraft,
): Promise<{ ok: boolean; row?: BankQuestionRow; message: string }> {
  try {
    const adminCtx = await requireAdminContext();
    const adminClient = getSupabaseAdminClient();

    const { data, error } = await adminClient
      .from("question_bank")
      .insert({
        jlpt_level: draft.level,
        section: draft.section,
        prompt_ja: draft.promptJa,
        prompt_id: draft.promptId,
        audio_text: draft.audioText ?? null,
        options: draft.options,
        answer_index: draft.answerIndex,
        explanation_id: draft.explanationId,
        source: draft.modelUsed,
        approved: true,
        created_by: adminCtx.userId,
      })
      .select("*")
      .single<BankQuestionRow>();

    if (error || !data) {
      if (error?.code === "PGRST205" || error?.message?.includes("question_bank")) {
        return {
          ok: false,
          message:
            "Tabel `question_bank` belum ada di Supabase. Jalankan file `supabase/migrations/0004_admin_question_bank.sql` di SQL Editor terlebih dahulu.",
        };
      }
      return { ok: false, message: error?.message ?? "Gagal menyimpan soal ke Supabase." };
    }

    revalidatePath("/admin");
    revalidatePath(`/exam/${draft.level.toLowerCase()}`);
    return { ok: true, row: data, message: "Soal disetujui & disimpan ke database!" };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan.",
    };
  }
}

export async function deleteBankQuestionAction(
  id: number,
): Promise<{ ok: boolean; message?: string }> {
  try {
    await requireAdminContext();
    const adminClient = getSupabaseAdminClient();
    const { error } = await adminClient.from("question_bank").delete().eq("id", id);
    if (error) return { ok: false, message: error.message };
    revalidatePath("/admin");
    return { ok: true };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : "Gagal menghapus." };
  }
}
