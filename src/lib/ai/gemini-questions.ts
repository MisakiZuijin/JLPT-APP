import type { JlptLevel } from "@/lib/types";

export const QUESTION_SECTIONS = [
  "Kosakata & Kanji",
  "Tata Bahasa & Bacaan",
  "Mendengarkan Audio",
] as const;

export type QuestionSection = (typeof QUESTION_SECTIONS)[number];

export type GeneratedQuestionDraft = {
  tempId: string;
  level: JlptLevel;
  section: QuestionSection;
  promptJa: string;
  promptId: string;
  audioText?: string;
  options: [string, string, string, string];
  answerIndex: number;
  explanationId: string;
  modelUsed: string;
};

type GeminiRawQuestion = {
  promptJa: string;
  promptId: string;
  audioText?: string;
  options: string[];
  answerIndex: number;
  explanationId: string;
};

const RESPONSE_SCHEMA = {
  type: "ARRAY",
  items: {
    type: "OBJECT",
    properties: {
      promptJa: { type: "STRING" },
      promptId: { type: "STRING" },
      audioText: { type: "STRING" },
      options: { type: "ARRAY", items: { type: "STRING" }, minItems: 4, maxItems: 4 },
      answerIndex: { type: "INTEGER", minimum: 0, maximum: 3 },
      explanationId: { type: "STRING" },
    },
    required: ["promptJa", "promptId", "options", "answerIndex", "explanationId"],
  },
};

const MODELS_TO_TRY = [
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash-lite",
  "gemini-flash-lite-latest",
  "gemini-3-flash-preview",
] as const;

export async function generateBatchQuestionsWithGemini(input: {
  level: JlptLevel;
  section: QuestionSection;
  count: number;
}): Promise<GeneratedQuestionDraft[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY belum diisi di .env.local.");
  }

  const safeCount = Math.max(1, Math.min(10, Math.round(input.count)));

  const sectionGuidance =
    input.section === "Mendengarkan Audio"
      ? "Sertakan field `audioText` berisi naskah dialog/pengumuman bahasa Jepang yang akan dibacakan TTS, lalu `promptJa` berisi instruksi singkat dan `promptId` berupa pertanyaan pemahaman audio."
      : "Tulis kalimat soal bahasa Jepang yang natural pada `promptJa` (gunakan kurung 【】 atau （　） pada bagian yang ditanyakan) dan instruksi singkat Bahasa Indonesia pada `promptId`. Kosongkan `audioText`.";

  const prompt = [
    `Buat ${safeCount} soal latihan JLPT ORISINAL (bukan menyalin soal ujian resmi) untuk level ${input.level}, bagian "${input.section}".`,
    "Target pengguna adalah pelajar Indonesia, jadi `promptId` wajib berisi instruksi/pertanyaan berbahasa Indonesia (bukan kode ID), dan `explanationId` wajib berisi pembahasan singkat berbahasa Indonesia yang ramah dan akurat.",
    sectionGuidance,
    "Setiap soal harus memiliki tepat 4 pilihan jawaban yang SEMUANYA BERBEDA dan UNIK di `options` (dilarang ada pilihan duplikat atau sama persis; sertakan 1 kunci dan 3 pengecoh yang realistis), satu indeks jawaban benar (`answerIndex` antara 0 sampai 3), dan pembahasan singkat (`explanationId`).",
  ].join("\n");

  let lastError = "Gagal menghubungi Gemini API.";

  for (const model of MODELS_TO_TRY) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(15000),
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.5,
              responseMimeType: "application/json",
              responseJsonSchema: RESPONSE_SCHEMA,
            },
          }),
        },
      );

      if (!res.ok) {
        const errText = await res.text();
        let detail = errText.slice(0, 140);
        try {
          const parsedErr = JSON.parse(errText) as { error?: { message?: string } };
          if (parsedErr.error?.message) {
            detail = parsedErr.error.message;
          }
        } catch {
          // Gunakan potongan teks mentah jika bukan JSON.
        }
        lastError = `Gemini (${model}) HTTP ${res.status}: ${detail}`;
        continue;
      }

      const data = (await res.json()) as {
        candidates?: { content?: { parts?: { text?: string }[] } }[];
      };

      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        lastError = `Gemini (${model}) mengembalikan respons kosong.`;
        continue;
      }

      const parsed = JSON.parse(rawText) as GeminiRawQuestion[];
      if (!Array.isArray(parsed) || parsed.length === 0) {
        lastError = "Format JSON Gemini tidak valid.";
        continue;
      }

      return parsed.slice(0, safeCount).map((q, idx) => {
        const opts = Array.isArray(q.options) ? q.options.slice(0, 4) : [];
        while (opts.length < 4) opts.push(`Opsi ${opts.length + 1}`);
        const answerIdx = Math.max(0, Math.min(3, Number(q.answerIndex ?? 0)));

        return {
          tempId: `${model}-${Date.now()}-${idx}`,
          level: input.level,
          section: input.section,
          promptJa: String(q.promptJa ?? "").trim(),
          promptId: String(q.promptId ?? "").trim(),
          audioText: q.audioText ? String(q.audioText).trim() : undefined,
          options: [opts[0]!, opts[1]!, opts[2]!, opts[3]!],
          answerIndex: answerIdx,
          explanationId: String(q.explanationId ?? "").trim(),
          modelUsed: model,
        };
      });
    } catch (err) {
      lastError = err instanceof Error ? err.message : "Koneksi ke Gemini gagal.";
    }
  }

  throw new Error(lastError);
}
