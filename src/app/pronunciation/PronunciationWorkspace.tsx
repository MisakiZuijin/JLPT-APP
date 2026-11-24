"use client";

import { useState, useTransition } from "react";
import { speakJapanese } from "@/lib/audio";
import {
  compareJapaneseSpeech,
  type SpeechComparisonResult,
} from "@/lib/japanese/kana-compare";
import type { PronunciationPhrase } from "@/lib/japanese/pronunciation-data";
import { useSpeechPractice } from "@/hooks/useSpeechPractice";
import {
  IconArrowRight,
  IconCheck,
  IconMic,
  IconRotateCcw,
  IconStop,
  IconVolume,
} from "@/components/ui/Icons";
import { recordPronunciationAttempt } from "./actions";

type AttemptRecord = {
  attemptNo: number;
  transcript: string;
  result: SpeechComparisonResult;
};

export function PronunciationWorkspace({
  phrases,
}: {
  phrases: PronunciationPhrase[];
}) {
  const [selectedId, setSelectedId] = useState(phrases[0]?.id ?? "");
  const [attemptsMap, setAttemptsMap] = useState<Record<string, AttemptRecord[]>>({});
  const [manualInput, setManualInput] = useState("");
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const activePhrase =
    phrases.find((p) => p.id === selectedId) ?? phrases[0]!;
  const phraseAttempts = attemptsMap[activePhrase.id] ?? [];
  const attemptCount = phraseAttempts.length;
  const lastAttempt = phraseAttempts[attemptCount - 1];

  const hasPassedScore = phraseAttempts.some((a) => a.result.passed);
  const completedPass = attemptCount >= 3 && hasPassedScore;
  const completedMaxFail = attemptCount >= 5 && !hasPassedScore;
  const isLocked = completedPass || completedMaxFail;

  function evaluateTranscript(rawTranscript: string) {
    if (attemptCount >= 5) return;
    const nextAttemptNo = attemptCount + 1;
    const result = compareJapaneseSpeech(
      rawTranscript,
      activePhrase.reading,
      activePhrase.term,
      85,
    );

    setAttemptsMap((prev) => ({
      ...prev,
      [activePhrase.id]: [
        ...(prev[activePhrase.id] ?? []),
        { attemptNo: nextAttemptNo, transcript: rawTranscript, result },
      ],
    }));
    setManualInput("");

    startTransition(async () => {
      const res = await recordPronunciationAttempt({
        term: activePhrase.term,
        reading: activePhrase.reading,
        meaning: activePhrase.meaning,
        level: activePhrase.level,
        attemptNo: nextAttemptNo,
        transcript: rawTranscript,
        score: result.score,
        passed: result.passed,
      });
      setSaveStatus(res.saved ? "Riwayat tersimpan ke database." : res.message ?? null);
    });
  }

  const {
    speechSupported,
    listening,
    interimText,
    micError,
    audioUrl,
    startRecording,
    stopRecording,
    clearMicError,
  } = useSpeechPractice(evaluateTranscript);

  function selectPhrase(id: string) {
    if (listening) stopRecording();
    clearMicError();
    setSelectedId(id);
    setSaveStatus(null);
    setManualInput("");
  }

  function resetCurrentAttempts() {
    setAttemptsMap((prev) => ({ ...prev, [activePhrase.id]: [] }));
    setSaveStatus(null);
    clearMicError();
  }

  function nextPhrase() {
    const idx = phrases.findIndex((p) => p.id === activePhrase.id);
    const next = phrases[(idx + 1) % phrases.length];
    if (next) selectPhrase(next.id);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold tracking-wider text-[#2563EB] uppercase dark:text-blue-400">
            Tahap 3 · Pelatihan Pelafalan Aktif
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            Latihan Ngomong Bahasa Jepang (3–5x)
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Dengar contoh penutur Jepang, tirukan dengan mikrofon, dan ulangi minimal 3–5x hingga skor ketepatan ≥ 85%.
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-200">
          <IconMic className="h-4 w-4 text-[#2563EB] dark:text-blue-400" />
          Target Lulus: ≥ 85% (Min 3x)
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[290px_minmax(0,1fr)]">
        {/* Daftar Frasa */}
        <aside className="min-w-0 h-fit space-y-2 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#111827]">
          <p className="px-1 text-xs font-bold tracking-wider text-slate-400 uppercase">
            Daftar Kalimat ({phrases.length})
          </p>
          <div className="space-y-1.5">
            {phrases.map((p) => {
              const list = attemptsMap[p.id] ?? [];
              const passed = list.length >= 3 && list.some((a) => a.result.passed);
              const active = p.id === activePhrase.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => selectPhrase(p.id)}
                  className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left transition ${
                    active
                      ? "border-[#2563EB] bg-[#2563EB] text-white"
                      : "border-slate-200 bg-[#F8FAFC] text-slate-800 hover:border-[#2563EB]/60 dark:border-slate-800 dark:bg-[#0B1120] dark:text-slate-100"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="font-jp truncate text-sm font-bold">{p.term}</p>
                    <p
                      className={`truncate text-[11px] ${
                        active ? "text-blue-100" : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {p.level} · {p.meaning}
                    </p>
                  </div>
                  {passed && (
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                        active ? "bg-white text-[#2563EB]" : "bg-[#059669] text-white"
                      }`}
                    >
                      <IconCheck className="h-3 w-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Studio Pengucapan */}
        <section className="min-w-0 space-y-5 rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#111827] sm:p-7">
          {/* Indikator Pengulangan 1..5 */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((slot) => {
                const rec = phraseAttempts[slot - 1];
                let cls =
                  "border-slate-200 bg-[#F8FAFC] text-slate-400 dark:border-slate-700 dark:bg-[#0B1120]";
                if (rec) {
                  cls = rec.result.passed
                    ? "border-[#059669] bg-[#059669] text-white"
                    : "border-[#D97706] bg-[#D97706] text-white";
                } else if (slot === attemptCount + 1 && !isLocked) {
                  cls = "border-[#2563EB] bg-[#2563EB]/10 text-[#2563EB] dark:text-blue-300";
                }

                return (
                  <div
                    key={slot}
                    className={`flex h-9 w-9 flex-col items-center justify-center rounded-xl border text-xs font-extrabold ${cls}`}
                    title={rec ? `Percobaan ${slot}: ${rec.result.score}%` : `Percobaan ${slot}`}
                  >
                    <span>{slot}</span>
                  </div>
                );
              })}
              <span className="ml-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                {attemptCount}/5 percobaan
              </span>
            </div>

            <span className="rounded-lg bg-[#2563EB]/10 px-2.5 py-1 text-xs font-bold text-[#2563EB] dark:bg-blue-950/60 dark:text-blue-300">
              {activePhrase.level} · {activePhrase.category}
            </span>
          </div>

          {/* Kartu Frasa Target */}
          <div className="rounded-2xl bg-[#0F172A] p-6 text-white dark:border dark:border-slate-800 dark:bg-[#0B1120]">
            <p className="font-jp text-2xl font-extrabold sm:text-3xl">
              {activePhrase.term}
            </p>
            <p className="font-jp mt-1.5 text-sm font-medium text-blue-300">
              {activePhrase.reading}
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-300">
              /{activePhrase.romaji}/ — {activePhrase.meaning}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => speakJapanese(activePhrase.term)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-600"
              >
                <IconVolume className="h-4 w-4" />
                Putar Contoh
              </button>
              <button
                type="button"
                onClick={() => speakJapanese(activePhrase.term, 0.75)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-200 transition hover:bg-slate-700"
              >
                <IconVolume className="h-4 w-4" />
                Tempo Lambat (0.75x)
              </button>
            </div>
          </div>

          {/* Tips Pelafalan */}
          <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-[#0B1120] dark:text-slate-300">
            <span className="font-bold text-[#2563EB] dark:text-blue-400">Tips Pelafalan: </span>
            {activePhrase.tip}
          </div>

          {/* Kontrol Rekam Suara */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {!isLocked && (
              <button
                type="button"
                disabled={pending}
                onClick={listening ? stopRecording : startRecording}
                className={`inline-flex flex-1 items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-extrabold text-white transition ${
                  listening
                    ? "bg-[#DC2626] hover:bg-red-700"
                    : "bg-[#2563EB] hover:bg-blue-700"
                }`}
              >
                {listening ? (
                  <>
                    <IconStop className="h-4 w-4" />
                    Hentikan &amp; Nilai Suara
                  </>
                ) : (
                  <>
                    <IconMic className="h-4 w-4" />
                    Rekam Pengucapan (Ke-{attemptCount + 1})
                  </>
                )}
              </button>
            )}

            {audioUrl && (
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 dark:border-slate-700 dark:bg-[#0B1120]">
                <span className="text-[11px] font-bold text-slate-500">Suaramu:</span>
                <audio controls src={audioUrl} className="h-8 max-w-[200px]" />
              </div>
            )}
          </div>

          {listening && (
            <p className="rounded-xl bg-blue-50 px-4 py-2.5 text-xs font-bold text-[#2563EB] dark:bg-blue-950/60 dark:text-blue-300">
              Sedang mendengarkan (ja-JP)...{" "}
              {interimText ? `Terdeteksi: "${interimText}"` : "Ucapkan frasa sekarang."}
            </p>
          )}

          {micError && (
            <p className="rounded-xl bg-amber-50 px-4 py-2.5 text-xs font-semibold text-amber-800 dark:bg-amber-950/60 dark:text-amber-200">
              {micError}
            </p>
          )}

          {/* Input Cadangan / Uji Manual Jika Tidak Pakai Mikrofon */}
          {!isLocked && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (manualInput.trim()) evaluateTranscript(manualInput);
              }}
              className="flex flex-col gap-2 rounded-2xl border border-dashed border-slate-300 p-3.5 dark:border-slate-700 sm:flex-row sm:items-center"
            >
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder={
                  speechSupported
                    ? "Opsional: ketik transkrip kana/romaji jika sedang tanpa mikrofon..."
                    : "Browser tidak mendukung STT otomatis: ketik bacaan kana/romaji untuk latihan nilai..."
                }
                className="font-jp flex-1 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#2563EB] dark:border-slate-700 dark:bg-[#0B1120] dark:text-slate-100"
              />
              <button
                type="submit"
                disabled={!manualInput.trim() || pending}
                className="rounded-xl bg-[#0F172A] px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800 disabled:opacity-50 dark:bg-[#1E293B]"
              >
                Nilai Transkrip
              </button>
            </form>
          )}

          {/* Hasil Percobaan Terakhir & Status Lulus */}
          {lastAttempt && (
            <div
              className={`rounded-2xl border p-4 ${
                lastAttempt.result.passed
                  ? "border-emerald-200 bg-emerald-50/80 dark:border-emerald-900/60 dark:bg-emerald-950/40"
                  : "border-amber-200 bg-amber-50/80 dark:border-amber-900/60 dark:bg-amber-950/40"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Hasil Percobaan ke-{lastAttempt.attemptNo}:{" "}
                  <span
                    className={
                      lastAttempt.result.passed
                        ? "text-[#059669] dark:text-emerald-300"
                        : "text-[#D97706] dark:text-amber-300"
                    }
                  >
                    {lastAttempt.result.score}%
                  </span>
                </p>
                <span className="font-jp rounded-md bg-white/80 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  Transkrip: &ldquo;{lastAttempt.transcript}&rdquo;
                </span>
              </div>
              <p className="mt-1.5 text-xs font-medium text-slate-700 dark:text-slate-200">
                {lastAttempt.result.feedback}
              </p>

              {attemptCount < 3 && lastAttempt.result.passed && (
                <p className="mt-2 text-xs font-bold text-[#2563EB] dark:text-blue-400">
                  Selesaikan minimal 3x pengulangan (kurang {3 - attemptCount}x lagi) supaya pengucapan menempel kuat.
                </p>
              )}

              {completedPass && (
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-emerald-200 pt-3 dark:border-emerald-900/60">
                  <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#059669] dark:text-emerald-300">
                    <IconCheck className="h-4 w-4" />
                    Lulus Pengucapan! ({attemptCount}x pengulangan selesai)
                  </span>
                  <button
                    type="button"
                    onClick={nextPhrase}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#059669] px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                  >
                    Lanjut Frasa Berikutnya
                    <IconArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {completedMaxFail && (
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-amber-200 pt-3 dark:border-amber-900/60">
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-200">
                    5 percobaan selesai. Frasa ini ditandai untuk latihan ulang besok di SRS.
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={resetCurrentAttempts}
                      className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-[#1E293B] dark:text-slate-200"
                    >
                      <IconRotateCcw className="h-3.5 w-3.5" />
                      Ulang Sesi
                    </button>
                    <button
                      type="button"
                      onClick={nextPhrase}
                      className="inline-flex items-center gap-1 rounded-xl bg-[#2563EB] px-3 py-1.5 text-xs font-bold text-white"
                    >
                      Frasa Lain
                      <IconArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {saveStatus && (
            <p className="text-xs font-medium text-slate-400">{saveStatus}</p>
          )}
        </section>
      </div>
    </div>
  );
}
