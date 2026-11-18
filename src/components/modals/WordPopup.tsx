"use client";

import { useState, useTransition } from "react";
import { toRomaji } from "wanakana";
import { speakJapanese } from "@/lib/audio";
import type { ReadingToken } from "@/lib/japanese/reading-data";
import type { JlptLevel } from "@/lib/types";
import { addWordToSrs } from "@/app/reading/actions";
import { IconCheck, IconPlus, IconVolume, IconX } from "@/components/ui/Icons";

type WordPopupProps = {
  token: ReadingToken;
  level: JlptLevel;
  onClose: () => void;
};

export function WordPopup({ token, level, onClose }: WordPopupProps) {
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  const reading = token.reading ?? token.surface;
  const romaji = toRomaji(reading);

  function handleSaveToSrs() {
    if (!token.meaning) return;
    startTransition(async () => {
      const res = await addWordToSrs({
        term: token.surface,
        reading,
        meaning: token.meaning ?? token.surface,
        level,
      });
      setFeedback({ ok: res.ok, text: res.message });
    });
  }

  return (
    <div
      role="dialog"
      aria-label={`Detail kata ${token.surface}`}
      className="fixed inset-x-3 bottom-20 z-40 mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-700 dark:bg-[#111827] md:inset-x-auto md:right-8 md:bottom-8 md:w-96"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            {token.pos && (
              <span className="rounded-md bg-[#2563EB]/10 px-2 py-0.5 text-[11px] font-bold text-[#2563EB] dark:bg-blue-950/70 dark:text-blue-300">
                {token.pos}
              </span>
            )}
            <span className="text-[11px] font-bold text-slate-400">{level}</span>
          </div>
          <p className="font-jp mt-1.5 text-2xl font-extrabold text-slate-900 dark:text-white">
            {token.surface}
          </p>
          {reading && reading !== token.surface && (
            <p className="font-jp text-sm font-semibold text-slate-600 dark:text-slate-300">
              {reading}
            </p>
          )}
          <p className="text-xs font-bold text-[#2563EB] dark:text-blue-400">
            /{romaji}/
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup detail kata"
          className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <IconX className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 rounded-xl bg-[#F8FAFC] p-3 dark:bg-[#0B1120]">
        <p className="text-[11px] font-bold tracking-wide text-slate-400 uppercase">
          Arti Kata
        </p>
        <p className="mt-0.5 text-sm font-bold text-slate-900 dark:text-slate-100">
          {token.meaning ?? "—"}
        </p>
      </div>

      {feedback && (
        <p
          className={`mt-3 rounded-xl px-3 py-2 text-xs font-semibold ${
            feedback.ok
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
              : "bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200"
          }`}
        >
          {feedback.text}
        </p>
      )}

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => speakJapanese(reading || token.surface)}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:border-[#2563EB] hover:text-[#2563EB] dark:border-slate-700 dark:bg-[#1E293B] dark:text-slate-200"
        >
          <IconVolume className="h-4 w-4" />
          Dengar Suara
        </button>

        {token.meaning && !token.isPunctuation && (
          <button
            type="button"
            disabled={pending || feedback?.ok === true}
            onClick={handleSaveToSrs}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#2563EB] px-3 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {feedback?.ok ? (
              <>
                <IconCheck className="h-4 w-4" />
                Tersimpan
              </>
            ) : (
              <>
                <IconPlus className="h-4 w-4" />
                {pending ? "Menyimpan..." : "Simpan ke Hafalan"}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
