"use client";

import { useState } from "react";
import { speakJapanese } from "@/lib/audio";
import type { BunpouExercise } from "@/lib/japanese/bunpou-data";
import {
  IconArrowRight,
  IconCheck,
  IconPuzzle,
  IconRotateCcw,
  IconVolume,
} from "@/components/ui/Icons";

export function BunpouWorkspace({ exercises }: { exercises: BunpouExercise[] }) {
  const [idx, setIdx] = useState(0);
  const [pickedIndices, setPickedIndices] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const [showCasual, setShowCasual] = useState(false);

  const current = exercises[idx] ?? exercises[0]!;
  const builtSentence = pickedIndices.map((i) => current.tokens[i]).join(" ");
  const expected = current.correctTokens.join(" ");
  const isRight = builtSentence === expected;

  function toggleChip(tokenIdx: number) {
    if (checked) return;
    setPickedIndices((prev) =>
      prev.includes(tokenIdx) ? prev.filter((x) => x !== tokenIdx) : [...prev, tokenIdx],
    );
  }

  function nextExercise() {
    setIdx((prev) => (prev + 1) % exercises.length);
    setPickedIndices([]);
    setChecked(false);
    setShowCasual(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold tracking-wider text-[#2563EB] uppercase dark:text-blue-400">
            Tahap 4 · Merangkai Pola Kalimat N5–N2
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            Bunpou Builder (Pola Kalimat &amp; Keigo)
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Susun potongan kata sesuai rumus pola kalimat Jepang dan bandingkan ragam sopan vs kasual.
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-200">
          <IconPuzzle className="h-4 w-4 text-[#2563EB] dark:text-blue-400" />
          Pola {idx + 1} / {exercises.length}
        </span>
      </div>

      {/* Selector Pola */}
      <div className="flex flex-wrap gap-2">
        {exercises.map((ex, i) => (
          <button
            key={ex.id}
            type="button"
            onClick={() => {
              setIdx(i);
              setPickedIndices([]);
              setChecked(false);
              setShowCasual(false);
            }}
            className={`rounded-xl border px-3.5 py-1.5 text-xs font-bold transition ${
              i === idx
                ? "border-[#2563EB] bg-[#2563EB] text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-[#111827] dark:text-slate-300"
            }`}
          >
            {ex.level} · #{i + 1}
          </button>
        ))}
      </div>

      <section className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#111827] sm:p-8">
        <div className="rounded-2xl bg-[#0F172A] p-4 text-white dark:bg-[#0B1120]">
          <p className="text-[11px] font-bold tracking-wider text-blue-300 uppercase">
            Rumus Pola Kalimat ({current.level})
          </p>
          <p className="font-jp mt-1 text-base font-extrabold">{current.formula}</p>
        </div>

        <div>
          <p className="text-xs font-bold text-slate-400 uppercase">Susun Menjadi:</p>
          <p className="mt-1 text-lg font-extrabold text-slate-900 dark:text-white">
            &ldquo;{current.promptId}&rdquo;
          </p>
        </div>

        {/* Area Susunan Kalimat */}
        <div className="min-h-16 rounded-2xl border-2 border-dashed border-slate-300 bg-[#F8FAFC] p-4 dark:border-slate-700 dark:bg-[#0B1120]">
          {pickedIndices.length === 0 ? (
            <p className="text-xs font-medium text-slate-400">
              Ketuk potongan kata di bawah secara berurutan...
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {pickedIndices.map((tIdx) => (
                <button
                  key={tIdx}
                  type="button"
                  disabled={checked}
                  onClick={() => toggleChip(tIdx)}
                  className="font-jp rounded-xl bg-[#2563EB] px-3.5 py-2 text-sm font-bold text-white"
                >
                  {current.tokens[tIdx]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bank Chip */}
        <div className="flex flex-wrap gap-2">
          {current.tokens.map((tok, tIdx) => {
            const used = pickedIndices.includes(tIdx);
            return (
              <button
                key={tIdx}
                type="button"
                disabled={checked || used}
                onClick={() => toggleChip(tIdx)}
                className={`font-jp rounded-xl border px-4 py-2 text-sm font-bold transition ${
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

        <div className="flex flex-wrap gap-2.5">
          {!checked ? (
            <>
              <button
                type="button"
                disabled={pickedIndices.length < current.tokens.length}
                onClick={() => setChecked(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <IconCheck className="h-4 w-4" />
                Periksa Susunan
              </button>
              <button
                type="button"
                onClick={() => setPickedIndices([])}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-2.5 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-[#1E293B] dark:text-slate-200"
              >
                <IconRotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={nextExercise}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#059669] px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700"
            >
              Lanjut Pola Berikutnya
              <IconArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {checked && (
          <div
            className={`space-y-3 rounded-2xl border p-4 text-xs ${
              isRight
                ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/40"
                : "border-red-200 bg-red-50 dark:border-red-900/60 dark:bg-red-950/40"
            }`}
          >
            <p
              className={`text-sm font-extrabold ${
                isRight
                  ? "text-emerald-800 dark:text-emerald-200"
                  : "text-red-700 dark:text-red-200"
              }`}
            >
              {isRight ? "Benar! Susunan pola kalimat sudah tepat." : `Kurang tepat. Susunan tepat: ${expected}`}
            </p>
            <p className="text-slate-700 dark:text-slate-200">{current.explanationId}</p>

            {/* Perbandingan Sopan vs Kasual */}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white p-3 dark:bg-[#0B1120]">
              <div>
                <p className="text-[11px] font-bold text-[#2563EB] uppercase dark:text-blue-400">
                  {showCasual ? "Bentuk Kasual / Biasa" : "Bentuk Sopan (Keigo / ~ます)"}
                </p>
                <p className="font-jp mt-0.5 text-sm font-bold text-slate-900 dark:text-white">
                  {showCasual ? current.casualForm : current.politeForm}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCasual((v) => !v)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-bold text-slate-700 dark:border-slate-700 dark:text-slate-200"
                >
                  {showCasual ? "Lihat Sopan" : "Lihat Kasual"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    speakJapanese(showCasual ? current.casualForm : current.politeForm)
                  }
                  className="inline-flex items-center gap-1 rounded-lg bg-[#2563EB] px-3 py-1.5 text-[11px] font-bold text-white"
                >
                  <IconVolume className="h-3.5 w-3.5" />
                  Suara
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
