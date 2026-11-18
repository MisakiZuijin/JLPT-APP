"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { speakJapanese } from "@/lib/audio";
import type { DailyTestQuestion } from "@/lib/japanese/daily-test-generator";
import type { JlptLevel } from "@/lib/types";
import {
  IconArrowLeft,
  IconArrowRight,
  IconAward,
  IconCalendar,
  IconCheck,
  IconRotateCcw,
  IconVolume,
} from "@/components/ui/Icons";
import { saveDailyTestResult, type WrongMistakeEntry } from "./actions";

type DailyTestWorkspaceProps = {
  level: JlptLevel;
  questions: DailyTestQuestion[];
  previousScore: number | null;
};

export function DailyTestWorkspace({
  level,
  questions,
  previousScore,
}: DailyTestWorkspaceProps) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [arrangeSelection, setArrangeSelection] = useState<Record<string, number[]>>({});
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});
  const [finished, setFinished] = useState(false);
  const [saveNote, setSaveNote] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const current = questions[index] ?? questions[0]!;
  const isChecked = Boolean(checkedMap[current.id]);
  const currentAnswer = answers[current.id] ?? "";
  const isCurrentCorrect = currentAnswer === current.correctAnswer;

  const correctCount = useMemo(
    () =>
      questions.reduce(
        (acc, q) => acc + (answers[q.id] === q.correctAnswer ? 1 : 0),
        0,
      ),
    [questions, answers],
  );

  function pickOption(val: string) {
    if (isChecked) return;
    setAnswers((prev) => ({ ...prev, [current.id]: val }));
  }

  function toggleArrangeToken(tokenIdx: number) {
    if (isChecked || !current.tokens) return;
    const prevList = arrangeSelection[current.id] ?? [];
    const nextList = prevList.includes(tokenIdx)
      ? prevList.filter((i) => i !== tokenIdx)
      : [...prevList, tokenIdx];
    setArrangeSelection((prev) => ({ ...prev, [current.id]: nextList }));

    const joined = nextList.map((i) => current.tokens![i]).join(" ");
    setAnswers((prev) => ({ ...prev, [current.id]: joined }));
  }

  function checkCurrentAnswer() {
    if (!currentAnswer) return;
    setCheckedMap((prev) => ({ ...prev, [current.id]: true }));
  }

  function nextOrFinish() {
    if (index < questions.length - 1) {
      setIndex((i) => i + 1);
      return;
    }

    const scorePct = Math.round((correctCount / Math.max(1, questions.length)) * 100);
    const mistakes: WrongMistakeEntry[] = questions
      .filter((q) => (answers[q.id] ?? "") !== q.correctAnswer)
      .map((q) => ({
        category: q.category,
        prompt: q.promptJa,
        yourAnswer: answers[q.id] || "(kosong)",
        correctAnswer: q.correctAnswer,
        explanation: q.explanationId,
      }));

    setFinished(true);
    startTransition(async () => {
      const res = await saveDailyTestResult({
        level,
        questions,
        answers,
        scorePct,
        mistakes,
      });
      setSaveNote(
        res.saved
          ? "Skor Tes Harian tersimpan & soal salah masuk ke Catatan Kesalahan."
          : res.message ?? null,
      );
    });
  }

  function restartTest() {
    setIndex(0);
    setAnswers({});
    setArrangeSelection({});
    setCheckedMap({});
    setFinished(false);
    setSaveNote(null);
  }

  if (finished) {
    const scorePct = Math.round((correctCount / Math.max(1, questions.length)) * 100);
    const wrongList = questions.filter((q) => (answers[q.id] ?? "") !== q.correctAnswer);

    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 text-center dark:border-slate-800 dark:bg-[#111827] sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2563EB]/10 text-[#2563EB] dark:bg-blue-950/60 dark:text-blue-400">
            <IconAward className="h-8 w-8" />
          </div>
          <p className="mt-4 text-xs font-bold tracking-wider text-[#2563EB] uppercase dark:text-blue-400">
            Tes Harian Selesai · JLPT {level}
          </p>
          <p className="mt-2 text-4xl font-extrabold text-slate-900 dark:text-white">
            {correctCount} / {questions.length} ({scorePct}%)
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            {scorePct >= 80
              ? "Hasil sangat baik! Kamu siap mencoba Simulasi Ujian JLPT atau lanjut materi bab berikutnya."
              : "Terus ulangi kartu SRS yang jatuh tempo dan periksa Catatan Kesalahan agar semakin mantap."}
          </p>
          {saveNote && (
            <p className="mt-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              {saveNote}
            </p>
          )}

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={restartTest}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-2.5 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-[#1E293B] dark:text-slate-200"
            >
              <IconRotateCcw className="h-3.5 w-3.5" />
              Ulangi Tes Hari Ini
            </button>
            <Link
              href="/exam"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700"
            >
              Lanjut ke Simulasi Ujian JLPT
              <IconArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {wrongList.length > 0 && (
          <section className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#111827]">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              Pembahasan Soal yang Perlu Diulas ({wrongList.length})
            </h2>
            {wrongList.map((q) => (
              <div
                key={q.id}
                className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 text-xs dark:border-slate-800 dark:bg-[#0B1120]"
              >
                <p className="font-bold text-[#2563EB] dark:text-blue-400">{q.category}</p>
                <p className="font-jp mt-1 text-sm font-bold text-slate-900 dark:text-white">
                  {q.promptJa}
                </p>
                <p className="mt-1 text-red-600 dark:text-red-400">
                  Jawabanmu: {answers[q.id] || "(kosong)"}
                </p>
                <p className="font-bold text-emerald-700 dark:text-emerald-300">
                  Jawaban tepat: {q.correctAnswer}
                </p>
                <p className="mt-1 text-slate-600 dark:text-slate-300">{q.explanationId}</p>
              </div>
            ))}
          </section>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold tracking-wider text-[#2563EB] uppercase dark:text-blue-400">
            Komposisi: 50% SRS · 30% Materi Baru · 20% Audio
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Tes Harian Otomatis · Level {level}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {previousScore !== null && (
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-300">
              Skor Hari Ini: {previousScore}%
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-200">
            <IconCalendar className="h-3.5 w-3.5 text-[#2563EB]" />
            Soal {index + 1} / {questions.length}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-[#2563EB] transition-all duration-300"
          style={{ width: `${Math.round(((index + 1) / questions.length) * 100)}%` }}
        />
      </div>

      {/* Kartu Soal */}
      <section className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#111827] sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-lg bg-[#2563EB]/10 px-2.5 py-1 text-xs font-bold text-[#2563EB] dark:bg-blue-950/60 dark:text-blue-300">
            {current.category} · {current.level}
          </span>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            Benar sejauh ini: {correctCount}
          </span>
        </div>

        <div>
          <p className="font-jp text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl">
            {current.promptJa}
          </p>
          <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            {current.promptId}
          </p>
        </div>

        {/* Audio untuk tipe listening */}
        {current.type === "listening" && current.audioText && (
          <div>
            <button
              type="button"
              onClick={() => speakJapanese(current.audioText!)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0F172A] px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 dark:bg-[#2563EB] dark:hover:bg-blue-700"
            >
              <IconVolume className="h-4 w-4" />
              Putar Audio Soal (ja-JP)
            </button>
          </div>
        )}

        {/* Susun Kata untuk tipe arrange */}
        {current.type === "arrange" && current.tokens && (
          <div className="space-y-4">
            <div className="min-h-14 rounded-2xl border-2 border-dashed border-slate-300 bg-[#F8FAFC] p-3.5 dark:border-slate-700 dark:bg-[#0B1120]">
              {(arrangeSelection[current.id]?.length ?? 0) === 0 ? (
                <p className="text-xs font-medium text-slate-400">
                  Ketuk kata-kata di bawah secara berurutan untuk menyusun kalimat...
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {(arrangeSelection[current.id] ?? []).map((tIdx) => (
                    <button
                      key={tIdx}
                      type="button"
                      disabled={isChecked}
                      onClick={() => toggleArrangeToken(tIdx)}
                      className="font-jp rounded-xl bg-[#2563EB] px-3 py-1.5 text-sm font-bold text-white"
                    >
                      {current.tokens![tIdx]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className="mb-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                Pilihan Kata (Ketuk untuk memasukkan)
              </p>
              <div className="flex flex-wrap gap-2">
                {current.tokens.map((tok, tIdx) => {
                  const used = (arrangeSelection[current.id] ?? []).includes(tIdx);
                  return (
                    <button
                      key={tIdx}
                      type="button"
                      disabled={isChecked || used}
                      onClick={() => toggleArrangeToken(tIdx)}
                      className={`font-jp rounded-xl border px-3.5 py-2 text-sm font-bold transition ${
                        used
                          ? "border-slate-200 bg-slate-100 text-slate-400 opacity-40 dark:border-slate-800 dark:bg-slate-900"
                          : "border-slate-200 bg-white text-slate-800 hover:border-[#2563EB] dark:border-slate-700 dark:bg-[#1E293B] dark:text-slate-100"
                      }`}
                    >
                      {tok}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Pilihan Ganda untuk mcq / listening */}
        {current.options && (
          <div className="grid gap-2.5 sm:grid-cols-2">
            {current.options.map((opt, oIdx) => {
              const picked = currentAnswer === opt;
              const rightOpt = opt === current.correctAnswer;
              let cls =
                "border-slate-200 bg-[#F8FAFC] text-slate-800 hover:border-[#2563EB] dark:border-slate-700 dark:bg-[#0B1120] dark:text-slate-100";
              if (isChecked) {
                if (rightOpt) cls = "border-[#059669] bg-[#059669] text-white";
                else if (picked) cls = "border-[#DC2626] bg-[#DC2626] text-white";
              } else if (picked) {
                cls = "border-[#2563EB] bg-[#2563EB] text-white";
              }

              return (
                <button
                  key={oIdx}
                  type="button"
                  disabled={isChecked}
                  onClick={() => pickOption(opt)}
                  className={`font-jp rounded-2xl border px-4 py-3 text-left text-sm font-bold transition ${cls}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {isChecked && (
          <div
            className={`rounded-2xl border p-4 text-xs ${
              isCurrentCorrect
                ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200"
                : "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200"
            }`}
          >
            <p className="font-extrabold">
              {isCurrentCorrect
                ? "Benar!"
                : `Kurang tepat. Jawaban yang benar: ${current.correctAnswer}`}
            </p>
            <p className="mt-1 leading-relaxed">{current.explanationId}</p>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
          >
            <IconArrowLeft className="h-3.5 w-3.5" />
            Keluar Tes
          </Link>

          {!isChecked ? (
            <button
              type="button"
              disabled={!currentAnswer}
              onClick={checkCurrentAnswer}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              <IconCheck className="h-4 w-4" />
              Periksa Jawaban
            </button>
          ) : (
            <button
              type="button"
              disabled={pending}
              onClick={nextOrFinish}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F172A] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 dark:bg-[#2563EB] dark:hover:bg-blue-700"
            >
              {index < questions.length - 1 ? "Soal Berikutnya" : "Selesaikan & Lihat Skor"}
              <IconArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
