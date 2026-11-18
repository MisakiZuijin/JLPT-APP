"use client";

import { useState } from "react";
import { speakJapanese } from "@/lib/audio";
import { compareJapaneseSpeech } from "@/lib/japanese/kana-compare";
import type { KaiwaOption, KaiwaScenario } from "@/lib/japanese/kaiwa-data";
import { useSpeechPractice } from "@/hooks/useSpeechPractice";
import {
  IconArrowRight,
  IconCheck,
  IconMessage,
  IconMic,
  IconRotateCcw,
  IconStop,
  IconVolume,
} from "@/components/ui/Icons";

export function KaiwaWorkspace({ scenarios }: { scenarios: KaiwaScenario[] }) {
  const [scenarioSlug, setScenarioSlug] = useState(scenarios[0]?.slug ?? "konbini");
  const [turnIndex, setTurnIndex] = useState(0);
  const [pickedOption, setPickedOption] = useState<KaiwaOption | null>(null);
  const [spokenResult, setSpokenResult] = useState<{
    transcript: string;
    score: number;
    passed: boolean;
    feedback: string;
  } | null>(null);

  const scenario = scenarios.find((s) => s.slug === scenarioSlug) ?? scenarios[0]!;
  const currentTurn = scenario.turns[turnIndex] ?? scenario.turns[0]!;
  const isLastTurn = turnIndex >= scenario.turns.length - 1;

  const bestOption = currentTurn.options.find((o) => o.isBest) ?? currentTurn.options[0];

  const { listening, interimText, micError, startRecording, stopRecording, clearMicError } =
    useSpeechPractice((transcript) => {
      const resPrimary = compareJapaneseSpeech(
        transcript,
        currentTurn.expectedReading,
        currentTurn.expectedTerm,
        75,
      );
      const resOption = bestOption
        ? compareJapaneseSpeech(transcript, bestOption.reading, bestOption.ja, 75)
        : resPrimary;
      const res = resOption.score > resPrimary.score ? resOption : resPrimary;

      setSpokenResult({
        transcript,
        score: res.score,
        passed: res.passed,
        feedback: res.feedback,
      });
    });

  function switchScenario(slug: string) {
    if (listening) stopRecording();
    clearMicError();
    setScenarioSlug(slug);
    setTurnIndex(0);
    setPickedOption(null);
    setSpokenResult(null);
  }

  function handleNextTurn() {
    if (listening) stopRecording();
    clearMicError();
    if (!isLastTurn) {
      setTurnIndex((n) => n + 1);
      setPickedOption(null);
      setSpokenResult(null);
    } else {
      setTurnIndex(0);
      setPickedOption(null);
      setSpokenResult(null);
    }
  }

  const canAdvance = Boolean(pickedOption?.isBest || spokenResult?.passed);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold tracking-wider text-[#2563EB] uppercase dark:text-blue-400">
            Tahap 3 · Roleplay Percakapan Situasional
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            Kaiwa Roleplay Dunia Nyata
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Dengar dialog lawan bicara, pilih respons sopan yang tepat, atau ucapkan langsung lewat mikrofon.
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-200">
          <IconMessage className="h-4 w-4 text-[#2563EB] dark:text-blue-400" />
          Langkah {turnIndex + 1} / {scenario.turns.length}
        </span>
      </div>

      {/* Pilihan Skenario */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {scenarios.map((s) => {
          const active = s.slug === scenario.slug;
          return (
            <button
              key={s.slug}
              type="button"
              onClick={() => switchScenario(s.slug)}
              className={`rounded-2xl border p-4 text-left transition ${
                active
                  ? "border-[#2563EB] bg-[#2563EB] text-white"
                  : "border-slate-200 bg-white text-slate-800 hover:border-[#2563EB]/60 dark:border-slate-800 dark:bg-[#111827] dark:text-slate-100"
              }`}
            >
              <span
                className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${
                  active
                    ? "bg-white/20 text-white"
                    : "bg-[#2563EB]/10 text-[#2563EB] dark:bg-blue-950/60 dark:text-blue-300"
                }`}
              >
                {s.level}
              </span>
              <p className="mt-2 text-sm font-extrabold">{s.title}</p>
              <p
                className={`mt-1 line-clamp-2 text-xs ${
                  active ? "text-blue-100" : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {s.setting}
              </p>
            </button>
          );
        })}
      </div>

      {/* Arena Roleplay */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#111827] sm:p-7 space-y-6">
        {/* Gelembung Lawan Bicara */}
        <div className="rounded-2xl bg-[#0F172A] p-5 text-white dark:border dark:border-slate-800 dark:bg-[#0B1120]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold tracking-wider text-blue-300 uppercase">
              {currentTurn.npcRole}
            </span>
            <button
              type="button"
              onClick={() => speakJapanese(currentTurn.npcJa)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-600"
            >
              <IconVolume className="h-3.5 w-3.5" />
              Putar Dialog
            </button>
          </div>

          <p className="font-jp mt-3 text-xl font-extrabold sm:text-2xl">
            {currentTurn.npcJa}
          </p>
          <p className="font-jp mt-1 text-xs text-slate-300">{currentTurn.npcReading}</p>
          <p className="mt-1.5 text-sm text-slate-200">&ldquo;{currentTurn.npcMeaning}&rdquo;</p>
        </div>

        {/* Tugas Jawaban User */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-bold tracking-wider text-[#2563EB] uppercase dark:text-blue-400">
                Giliran Kamu Menjawab
              </p>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {currentTurn.taskId}
              </p>
              {bestOption && (
                <p className="font-jp mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Target ucapan mic: &ldquo;{bestOption.ja}&rdquo;
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={listening ? stopRecording : startRecording}
              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white transition ${
                listening
                  ? "bg-[#DC2626] hover:bg-red-700"
                  : "bg-[#0F172A] hover:bg-slate-800 dark:bg-[#2563EB] dark:hover:bg-blue-700"
              }`}
            >
              {listening ? <IconStop className="h-3.5 w-3.5" /> : <IconMic className="h-3.5 w-3.5" />}
              {listening ? "Hentikan" : "Jawab Pakai Suara"}
            </button>
          </div>

          {listening && (
            <p className="rounded-xl bg-blue-50 px-4 py-2 text-xs font-bold text-[#2563EB] dark:bg-blue-950/60 dark:text-blue-300">
              Mendengarkan... {interimText || "Ucapkan jawabanmu dalam bahasa Jepang."}
            </p>
          )}

          {micError && (
            <p className="rounded-xl bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-800 dark:bg-amber-950/60 dark:text-amber-200">
              {micError}
            </p>
          )}

          {spokenResult && (
            <div
              className={`rounded-xl border p-3.5 text-xs ${
                spokenResult.passed
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200"
                  : "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200"
              }`}
            >
              <p className="font-bold">
                Terdeteksi: &ldquo;{spokenResult.transcript}&rdquo; · Skor: {spokenResult.score}%
              </p>
              <p className="mt-1">{spokenResult.feedback}</p>
            </div>
          )}

          {/* Pilihan Kalimat Respons */}
          <div className="grid gap-2.5">
            {currentTurn.options.map((opt) => {
              const chosen = pickedOption?.id === opt.id;
              let cls =
                "border-slate-200 bg-[#F8FAFC] text-slate-900 hover:border-[#2563EB] dark:border-slate-800 dark:bg-[#0B1120] dark:text-slate-100";
              if (chosen) {
                cls = opt.isBest
                  ? "border-[#059669] bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950/40"
                  : "border-[#DC2626] bg-red-50 dark:border-red-700 dark:bg-red-950/40";
              }

              return (
                <div
                  key={opt.id}
                  className={`flex flex-col gap-2 rounded-2xl border p-4 transition sm:flex-row sm:items-center sm:justify-between ${cls}`}
                >
                  <button
                    type="button"
                    onClick={() => setPickedOption(opt)}
                    className="flex-1 text-left"
                  >
                    <p className="font-jp text-base font-extrabold">{opt.ja}</p>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      /{opt.romaji}/ — {opt.meaning}
                    </p>
                    {chosen && (
                      <p
                        className={`mt-1.5 text-xs font-bold ${
                          opt.isBest
                            ? "text-[#059669] dark:text-emerald-300"
                            : "text-[#DC2626] dark:text-red-300"
                        }`}
                      >
                        {opt.feedback}
                      </p>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => speakJapanese(opt.ja)}
                    aria-label={`Putar pengucapan ${opt.ja}`}
                    className="inline-flex w-fit shrink-0 items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-[#2563EB] dark:border-slate-700 dark:bg-[#1E293B] dark:text-slate-200"
                  >
                    <IconVolume className="h-3.5 w-3.5" />
                    Contoh
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {canAdvance && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#059669] dark:text-emerald-300">
              <IconCheck className="h-4 w-4" />
              {isLastTurn
                ? "Skenario selesai dikuasai!"
                : "Dialog tepat! Siap ke langkah percakapan berikutnya."}
            </span>

            <button
              type="button"
              onClick={handleNextTurn}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700"
            >
              {isLastTurn ? (
                <>
                  <IconRotateCcw className="h-3.5 w-3.5" />
                  Ulangi Skenario
                </>
              ) : (
                <>
                  Dialog Selanjutnya
                  <IconArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
