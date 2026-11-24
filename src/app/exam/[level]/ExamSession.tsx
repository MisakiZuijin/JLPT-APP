"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { speakJapanese } from "@/lib/audio";
import type { MockExamSpec } from "@/lib/japanese/exam-bank";
import { ExamLeaveModal } from "@/components/modals/ExamLeaveModal";
import {
  IconArrowLeft,
  IconArrowRight,
  IconAward,
  IconCheck,
  IconClock,
  IconFlag,
  IconRotateCcw,
  IconVolume,
} from "@/components/ui/Icons";
import { saveExamAttempt, type SectionScoreRecord } from "../actions";
import type { WrongMistakeEntry } from "@/app/daily-test/actions";

function formatMMSS(sec: number): string {
  const s = Math.max(0, sec);
  const mins = Math.floor(s / 60);
  const rem = s % 60;
  return `${String(mins).padStart(2, "0")}:${String(rem).padStart(2, "0")}`;
}

export function ExamSession({ spec }: { spec: MockExamSpec }) {
  const [sectionIdx, setSectionIdx] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState(
    spec.sections[0]!.durationMinutes * 60,
  );
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [finished, setFinished] = useState(false);
  const [sectionResults, setSectionResults] = useState<SectionScoreRecord[]>([]);
  const [saveNote, setSaveNote] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const currentSection = spec.sections[sectionIdx]!;
  const nextSection = spec.sections[sectionIdx + 1] ?? null;
  const currentQuestion = currentSection.questions[questionIdx]!;

  const finishAndGrade = useCallback(
    (finalAnswers: Record<string, number>) => {
      const results: SectionScoreRecord[] = spec.sections.map((sec) => {
        const right = sec.questions.reduce(
          (acc, q) => acc + (finalAnswers[q.id] === q.answerIndex ? 1 : 0),
          0,
        );
        const scaled = Math.round(
          (right / Math.max(1, sec.questions.length)) * sec.maxScore,
        );
        return {
          sectionId: sec.id,
          title: sec.title,
          score: scaled,
          maxScore: sec.maxScore,
          minPassScore: sec.minPassScore,
          passedSection: scaled >= sec.minPassScore,
        };
      });

      const totalScore = results.reduce((acc, r) => acc + r.score, 0);
      const passed =
        totalScore >= spec.totalPassScore && results.every((r) => r.passedSection);

      const mistakes: WrongMistakeEntry[] = [];
      for (const sec of spec.sections) {
        for (const q of sec.questions) {
          const picked = finalAnswers[q.id];
          if (picked !== q.answerIndex) {
            mistakes.push({
              category: `${spec.level} · ${sec.title}`,
              prompt: q.promptJa,
              yourAnswer:
                picked !== undefined ? q.options[picked] ?? "(kosong)" : "(kosong)",
              correctAnswer: q.options[q.answerIndex] ?? "",
              explanation: q.explanationId,
            });
          }
        }
      }

      setSectionResults(results);
      setFinished(true);

      startTransition(async () => {
        const res = await saveExamAttempt({
          level: spec.level,
          sectionScores: results,
          totalScore,
          maxScore: spec.totalMaxScore,
          passed,
          answers: finalAnswers,
          mistakes,
        });
        setSaveNote(
          res.saved
            ? "Hasil simulasi JLPT tersimpan ke riwayat akunmu."
            : res.message ?? null,
        );
      });
    },
    [spec],
  );

  const advanceSection = useCallback(() => {
    setShowLeaveModal(false);
    if (sectionIdx < spec.sections.length - 1) {
      const next = sectionIdx + 1;
      setSectionIdx(next);
      setQuestionIdx(0);
      setSecondsLeft(spec.sections[next]!.durationMinutes * 60);
    } else {
      finishAndGrade(answers);
    }
  }, [sectionIdx, spec.sections, answers, finishAndGrade]);

  // Countdown timer per bagian
  useEffect(() => {
    if (finished) return;
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [sectionIdx, finished]);

  // Auto-advance jika timer habis
  useEffect(() => {
    if (!finished && secondsLeft === 0) {
      const id = window.setTimeout(() => advanceSection(), 0);
      return () => window.clearTimeout(id);
    }
  }, [secondsLeft, finished, advanceSection]);

  function restartExam() {
    setSectionIdx(0);
    setQuestionIdx(0);
    setAnswers({});
    setFlagged({});
    setSecondsLeft(spec.sections[0]!.durationMinutes * 60);
    setFinished(false);
    setSectionResults([]);
    setSaveNote(null);
  }

  if (finished) {
    const totalScore = sectionResults.reduce((acc, r) => acc + r.score, 0);
    const passed =
      totalScore >= spec.totalPassScore &&
      sectionResults.every((r) => r.passedSection);

    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-[#111827] sm:p-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-extrabold ${
                  passed
                    ? "bg-emerald-50 text-[#059669] dark:bg-emerald-950/60 dark:text-emerald-300"
                    : "bg-red-50 text-[#DC2626] dark:bg-red-950/60 dark:text-red-300"
                }`}
              >
                <IconAward className="h-4 w-4" />
                {passed ? `LULUS SIMULASI ${spec.level}` : `BELUM LULUS ${spec.level}`}
              </span>
              <h1 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
                Hasil &amp; Pembahasan {spec.title}
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Batas lulus total: {spec.totalPassScore}/{spec.totalMaxScore} poin (serta memenuhi batas minimum tiap bagian).
              </p>
            </div>

            <div className="rounded-2xl bg-[#0F172A] px-6 py-4 text-center text-white dark:bg-[#2563EB]">
              <p className="text-[11px] font-bold tracking-wider text-blue-200 uppercase">
                Skor Total
              </p>
              <p className="text-3xl font-extrabold">
                {totalScore} <span className="text-base font-semibold">/ {spec.totalMaxScore}</span>
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {sectionResults.map((r) => (
              <div
                key={r.sectionId}
                className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 dark:border-slate-800 dark:bg-[#0B1120]"
              >
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {r.title}
                </p>
                <p className="mt-1.5 text-xl font-extrabold text-slate-900 dark:text-white">
                  {r.score} / {r.maxScore}
                </p>
                <p
                  className={`mt-1 text-[11px] font-bold ${
                    r.passedSection
                      ? "text-[#059669] dark:text-emerald-300"
                      : "text-[#DC2626] dark:text-red-300"
                  }`}
                >
                  {r.passedSection
                    ? `Memenuhi batas min (${r.minPassScore})`
                    : `Di bawah batas min (${r.minPassScore})`}
                </p>
              </div>
            ))}
          </div>

          {saveNote && (
            <p className="mt-4 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              {saveNote}
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/exam"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-2.5 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-[#1E293B] dark:text-slate-200"
            >
              <IconArrowLeft className="h-3.5 w-3.5" />
              Daftar Simulasi JLPT
            </Link>
            <button
              type="button"
              onClick={restartExam}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700"
            >
              <IconRotateCcw className="h-3.5 w-3.5" />
              Ulangi Simulasi {spec.level}
            </button>
          </div>
        </div>

        {/* Pembahasan Lengkap */}
        <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#111827] sm:p-8">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Pembahasan Jawaban Ujian
          </h2>
          {spec.sections.map((sec) => (
            <div key={sec.id} className="space-y-3 pt-2">
              <h3 className="text-sm font-extrabold text-[#2563EB] dark:text-blue-400">
                {sec.title}
              </h3>
              {sec.questions.map((q, qIdx) => {
                const picked = answers[q.id];
                const right = picked === q.answerIndex;
                return (
                  <div
                    key={q.id}
                    className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 text-xs dark:border-slate-800 dark:bg-[#0B1120]"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-slate-500">SOAL #{qIdx + 1}</span>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
                          right
                            ? "bg-emerald-50 text-[#059669] dark:bg-emerald-950/60 dark:text-emerald-300"
                            : "bg-red-50 text-[#DC2626] dark:bg-red-950/60 dark:text-red-300"
                        }`}
                      >
                        {right ? "Benar" : "Salah"}
                      </span>
                    </div>
                    <p className="font-jp mt-1.5 text-sm font-bold text-slate-900 dark:text-white">
                      {q.promptJa}
                    </p>
                    <p className="mt-1 text-slate-600 dark:text-slate-300">
                      Jawabanmu:{" "}
                      <span className="font-bold">
                        {picked !== undefined ? q.options[picked] : "(tidak dijawab)"}
                      </span>{" "}
                      · Kunci:{" "}
                      <span className="font-bold text-[#059669] dark:text-emerald-300">
                        {q.options[q.answerIndex]}
                      </span>
                    </p>
                    <p className="mt-1.5 text-slate-600 dark:text-slate-300">
                      {q.explanationId}
                    </p>
                  </div>
                );
              })}
            </div>
          ))}
        </section>
      </div>
    );
  }

  const unansweredCount = currentSection.questions.filter(
    (q) => answers[q.id] === undefined,
  ).length;
  const flaggedCount = currentSection.questions.filter((q) => flagged[q.id]).length;

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      {/* Header Ujian + Timer */}
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 dark:border-slate-800 dark:bg-[#111827]">
        <div>
          <p className="text-[11px] font-bold tracking-wider text-[#2563EB] uppercase dark:text-blue-400">
            JLPT {spec.level} · BAGIAN {sectionIdx + 1}/{spec.sections.length}
          </p>
          <h1 className="text-sm font-extrabold text-slate-900 dark:text-white sm:text-base">
            {currentSection.title}
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F172A] px-3.5 py-2 text-xs font-extrabold text-white dark:bg-[#1E293B]">
            <IconClock className="h-4 w-4 text-blue-400" />
            {formatMMSS(secondsLeft)}
          </span>
          <button
            type="button"
            onClick={() => setShowLeaveModal(true)}
            className="rounded-xl bg-[#2563EB] px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700"
          >
            {nextSection ? "Selesai Bagian →" : "Kumpulkan Ujian"}
          </button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        {/* Soal Aktif */}
        <section className="min-w-0 space-y-5 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#111827] sm:p-8">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Soal {questionIdx + 1} dari {currentSection.questions.length}
            </span>
            <button
              type="button"
              onClick={() =>
                setFlagged((prev) => ({
                  ...prev,
                  [currentQuestion.id]: !prev[currentQuestion.id],
                }))
              }
              aria-pressed={Boolean(flagged[currentQuestion.id])}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                flagged[currentQuestion.id]
                  ? "border-[#D97706] bg-amber-50 text-[#D97706] dark:bg-amber-950/60 dark:text-amber-300"
                  : "border-slate-200 bg-[#F8FAFC] text-slate-600 dark:border-slate-700 dark:bg-[#0B1120] dark:text-slate-300"
              }`}
            >
              <IconFlag className="h-3.5 w-3.5" />
              {flagged[currentQuestion.id] ? "Ditandai Ragu" : "Tandai Ragu"}
            </button>
          </div>

          <div>
            <p className="font-jp text-xl font-extrabold leading-relaxed text-slate-900 dark:text-white">
              {currentQuestion.promptJa}
            </p>
            <p className="mt-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              {currentQuestion.promptId}
            </p>
          </div>

          {currentQuestion.audioText && (
            <button
              type="button"
              onClick={() => speakJapanese(currentQuestion.audioText!)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0F172A] px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 dark:bg-[#2563EB] dark:hover:bg-blue-700"
            >
              <IconVolume className="h-4 w-4" />
              Putar Audio Soal (ja-JP)
            </button>
          )}

          <div className="space-y-2.5">
            {currentQuestion.options.map((opt, optIdx) => {
              const selected = answers[currentQuestion.id] === optIdx;
              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() =>
                    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optIdx }))
                  }
                  className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left text-sm font-bold transition ${
                    selected
                      ? "border-[#2563EB] bg-[#2563EB] text-white"
                      : "border-slate-200 bg-[#F8FAFC] text-slate-800 hover:border-[#2563EB] dark:border-slate-700 dark:bg-[#0B1120] dark:text-slate-100"
                  }`}
                >
                  <span className="font-jp">
                    {optIdx + 1}. {opt}
                  </span>
                  {selected && <IconCheck className="h-4 w-4 shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
            <button
              type="button"
              disabled={questionIdx === 0}
              onClick={() => setQuestionIdx((q) => Math.max(0, q - 1))}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-2 text-xs font-bold text-slate-700 disabled:opacity-40 dark:border-slate-700 dark:bg-[#1E293B] dark:text-slate-200"
            >
              <IconArrowLeft className="h-3.5 w-3.5" />
              Sebelumnya
            </button>

            {questionIdx < currentSection.questions.length - 1 ? (
              <button
                type="button"
                onClick={() =>
                  setQuestionIdx((q) =>
                    Math.min(currentSection.questions.length - 1, q + 1),
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
              >
                Soal Berikutnya
                <IconArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowLeaveModal(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#059669] px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
              >
                {nextSection ? `Lanjut Bagian ${sectionIdx + 2}` : "Kumpulkan Ujian"}
                <IconArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </section>

        {/* Peta Nomor Soal */}
        <aside className="h-fit space-y-4 rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#111827]">
          <h2 className="text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
            Daftar Soal (Bagian {sectionIdx + 1})
          </h2>

          <div className="grid grid-cols-5 gap-2">
            {currentSection.questions.map((q, i) => {
              const isCurrent = i === questionIdx;
              const isDone = answers[q.id] !== undefined;
              const isFlag = Boolean(flagged[q.id]);

              let cls =
                "border-slate-200 bg-[#F8FAFC] text-slate-700 dark:border-slate-700 dark:bg-[#0B1120] dark:text-slate-300";
              if (isCurrent) cls = "border-[#2563EB] bg-[#2563EB] text-white";
              else if (isFlag) cls = "border-[#D97706] bg-amber-50 text-[#D97706] dark:bg-amber-950/60 dark:text-amber-300";
              else if (isDone) cls = "border-[#059669] bg-emerald-50 text-[#059669] dark:bg-emerald-950/60 dark:text-emerald-300";

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setQuestionIdx(i)}
                  className={`flex h-9 items-center justify-center rounded-xl border text-xs font-extrabold transition ${cls}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          <div className="space-y-1 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <p>
              {currentSection.questions.length - unansweredCount} Dijawab ·{" "}
              {flaggedCount} Ragu · {unansweredCount} Kosong
            </p>
            <p className="text-[11px]">
              Catatan: Tidak bisa kembali ke bagian sebelumnya setelah pindah bagian.
            </p>
          </div>
        </aside>
      </div>

      <ExamLeaveModal
        open={showLeaveModal}
        currentSectionTitle={currentSection.title}
        nextSectionTitle={nextSection?.title ?? null}
        unansweredCount={unansweredCount}
        flaggedCount={flaggedCount}
        onCancel={() => setShowLeaveModal(false)}
        onConfirm={advanceSection}
      />
    </div>
  );
}
