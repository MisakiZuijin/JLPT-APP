"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toRomaji } from "wanakana";
import { speakJapanese } from "@/lib/audio";
import type { ReadingPassage, ReadingToken } from "@/lib/japanese/reading-data";
import { WordPopup } from "@/components/modals/WordPopup";
import {
  IconArrowLeft,
  IconCheck,
  IconEye,
  IconVolume,
} from "@/components/ui/Icons";
import { saveReadingProgress } from "../actions";

export function ReadingReader({ passage }: { passage: ReadingPassage }) {
  const [showFurigana, setShowFurigana] = useState(true);
  const [showRomaji, setShowRomaji] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [selectedToken, setSelectedToken] = useState<ReadingToken | null>(null);

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saveNote, setSaveNote] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const fullJapaneseText = passage.paragraphs
    .map((p) => p.map((t) => t.surface).join(""))
    .join(" ");

  const allAnswered = passage.questions.every((q) => answers[q.id] !== undefined);
  const score = passage.questions.reduce(
    (acc, q) => acc + (answers[q.id] === q.answerIndex ? 1 : 0),
    0,
  );

  function handleSubmitQuiz() {
    setSubmitted(true);
    startTransition(async () => {
      const res = await saveReadingProgress(
        passage.slug,
        score,
        passage.questions.length,
      );
      if (res.message) setSaveNote(res.message);
      else if (res.saved) setSaveNote("Skor kuis berhasil disimpan ke progres belajarmu.");
    });
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Navigasi atas & Judul */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/reading"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:border-slate-300 dark:border-slate-800 dark:bg-[#111827] dark:text-slate-200"
        >
          <IconArrowLeft className="h-3.5 w-3.5" />
          Daftar Bacaan
        </Link>

        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-[#2563EB] px-2.5 py-1 text-xs font-bold text-white">
            JLPT {passage.level}
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {passage.topic} · ±{passage.estimatedMinutes} menit
          </span>
        </div>
      </div>

      {/* Bar Kontrol Tampilan & Audio */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#111827]">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowFurigana((v) => !v)}
            aria-pressed={showFurigana}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
              showFurigana
                ? "bg-[#2563EB] text-white"
                : "border border-slate-200 bg-[#F8FAFC] text-slate-700 dark:border-slate-700 dark:bg-[#0B1120] dark:text-slate-300"
            }`}
          >
            <IconEye className="h-3.5 w-3.5" />
            Furigana
          </button>

          <button
            type="button"
            onClick={() => setShowRomaji((v) => !v)}
            aria-pressed={showRomaji}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
              showRomaji
                ? "bg-[#2563EB] text-white"
                : "border border-slate-200 bg-[#F8FAFC] text-slate-700 dark:border-slate-700 dark:bg-[#0B1120] dark:text-slate-300"
            }`}
          >
            Romaji
          </button>

          <button
            type="button"
            onClick={() => setShowTranslation((v) => !v)}
            aria-pressed={showTranslation}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
              showTranslation
                ? "bg-[#0F172A] text-white dark:bg-slate-700"
                : "border border-slate-200 bg-[#F8FAFC] text-slate-700 dark:border-slate-700 dark:bg-[#0B1120] dark:text-slate-300"
            }`}
          >
            Terjemahan Indonesia
          </button>
        </div>

        <button
          type="button"
          onClick={() => speakJapanese(fullJapaneseText)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F172A] px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800 dark:bg-[#2563EB] dark:hover:bg-blue-700"
        >
          <IconVolume className="h-4 w-4" />
          Putar Audio Teks
        </button>
      </div>

      {/* Konten Bacaan */}
      <article className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#111827] sm:p-8">
        <header className="border-b border-slate-100 pb-5 dark:border-slate-800">
          <h1 className="font-jp text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
            {passage.titleJa}
          </h1>
          {showFurigana && (
            <p className="font-jp mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
              {passage.titleReading}
            </p>
          )}
          <p className="mt-1 text-sm font-semibold text-[#2563EB] dark:text-blue-400">
            {passage.titleId}
          </p>
        </header>

        <p className="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">
          Tips: Ketuk kata mana saja di bawah ini untuk melihat arti detail, audio pengucapan, dan menyimpannya ke kartu hafalan FSRS.
        </p>

        <div className="mt-5 space-y-5 leading-[2.5]">
          {passage.paragraphs.map((para, pIdx) => (
            <p key={pIdx} className="font-jp flex flex-wrap items-end gap-x-1 gap-y-2 text-xl text-slate-900 dark:text-slate-100 sm:text-2xl">
              {para.map((token, tIdx) => {
                if (token.isPunctuation) {
                  return (
                    <span key={tIdx} className="select-none text-slate-500">
                      {token.surface}
                    </span>
                  );
                }

                const isSelected = selectedToken === token;
                const readingText = token.reading ?? token.surface;
                const romajiText = toRomaji(readingText);
                const needsFurigana = showFurigana && token.reading && token.reading !== token.surface;

                return (
                  <button
                    key={tIdx}
                    type="button"
                    onClick={() => setSelectedToken(token)}
                    className={`inline-flex flex-col items-center rounded-lg px-1 py-0.5 transition ${
                      isSelected
                        ? "bg-[#2563EB] text-white"
                        : "hover:bg-blue-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {showRomaji && (
                      <span
                        className={`font-sans text-[10px] leading-none font-bold ${
                          isSelected
                            ? "text-blue-100"
                            : "text-[#2563EB] dark:text-blue-400"
                        }`}
                      >
                        {romajiText}
                      </span>
                    )}
                    <ruby className="leading-snug">
                      {token.surface}
                      {needsFurigana && (
                        <rt
                          className={`text-[11px] font-semibold ${
                            isSelected
                              ? "text-blue-100"
                              : "text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          {token.reading}
                        </rt>
                      )}
                    </ruby>
                  </button>
                );
              })}
            </p>
          ))}
        </div>

        {showTranslation && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 dark:border-slate-800 dark:bg-[#0B1120]">
            <p className="text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
              Terjemahan Bahasa Indonesia
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              {passage.translationId}
            </p>
          </div>
        )}
      </article>

      {/* Kuis Pemahaman Bacaan */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#111827] sm:p-8">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
          Kuis Pemahaman Bacaan ({passage.questions.length} Soal)
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Uji pemahamanmu terhadap teks di atas setelah selesai membaca.
        </p>

        <div className="mt-5 space-y-6">
          {passage.questions.map((q, qIndex) => {
            const chosen = answers[q.id];
            return (
              <div
                key={q.id}
                className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 dark:border-slate-800 dark:bg-[#0B1120]"
              >
                <p className="text-xs font-bold text-[#2563EB] dark:text-blue-400">
                  SOAL {qIndex + 1}
                </p>
                <p className="font-jp mt-1 text-base font-bold text-slate-900 dark:text-white">
                  {q.promptJa}
                </p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {q.promptId}
                </p>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {q.options.map((opt, optIdx) => {
                    const isPicked = chosen === optIdx;
                    const isRight = q.answerIndex === optIdx;
                    let cls =
                      "border-slate-200 bg-white text-slate-800 hover:border-[#2563EB] dark:border-slate-700 dark:bg-[#111827] dark:text-slate-200";

                    if (submitted) {
                      if (isRight) {
                        cls =
                          "border-[#059669] bg-[#059669] text-white";
                      } else if (isPicked && !isRight) {
                        cls =
                          "border-[#DC2626] bg-[#DC2626] text-white";
                      }
                    } else if (isPicked) {
                      cls = "border-[#2563EB] bg-[#2563EB] text-white";
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={submitted}
                        onClick={() =>
                          setAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                        }
                        className={`font-jp rounded-xl border px-3.5 py-2.5 text-left text-sm font-semibold transition ${cls}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <p className="mt-3 text-xs font-medium text-slate-600 dark:text-slate-300">
                    Pembahasan: {q.explanationId}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {submitted ? (
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-extrabold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                <IconCheck className="h-4 w-4" />
                Skor Akhir: {score} / {passage.questions.length}
              </span>
              {saveNote && (
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {saveNote}
                </span>
              )}
            </div>
          ) : (
            <button
              type="button"
              disabled={!allAnswered || pending}
              onClick={handleSubmitQuiz}
              className="rounded-xl bg-[#2563EB] px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {pending ? "Memeriksa..." : "Periksa Jawaban Kuis"}
            </button>
          )}
        </div>
      </section>

      {selectedToken && (
        <WordPopup
          token={selectedToken}
          level={passage.level}
          onClose={() => setSelectedToken(null)}
        />
      )}
    </div>
  );
}
