"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { JLPT_LEVELS, type JlptLevel } from "@/lib/types";
import type { ReadingPassage } from "@/lib/japanese/reading-data";
import { IconArrowRight, IconBook, IconCheck } from "@/components/ui/Icons";

type ProgressMap = Record<string, { score: number; total: number }>;

type ReadingHubProps = {
  passages: ReadingPassage[];
  defaultLevel: JlptLevel;
  progressMap: ProgressMap;
};

export function ReadingHub({
  passages,
  defaultLevel,
  progressMap,
}: ReadingHubProps) {
  const [filter, setFilter] = useState<"ALL" | JlptLevel>("ALL");

  const filtered = useMemo(() => {
    if (filter === "ALL") return passages;
    return passages.filter((p) => p.level === filter);
  }, [passages, filter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold tracking-wider text-[#2563EB] uppercase dark:text-blue-400">
            Tahap 2 · Pemahaman Teks N5–N1
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            Latihan Membaca &amp; Furigana
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Nyalakan furigana atau romaji sesuai kebutuhan, ketuk kata untuk melihat arti &amp; simpan ke FSRS, lalu kerjakan kuis pemahaman.
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-200">
          <IconBook className="h-4 w-4 text-[#2563EB] dark:text-blue-400" />
          Target Aktif: {defaultLevel}
        </span>
      </div>

      {/* Filter Level */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter("ALL")}
          className={`rounded-xl border px-3.5 py-1.5 text-xs font-bold transition ${
            filter === "ALL"
              ? "border-[#2563EB] bg-[#2563EB] text-white"
              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-[#111827] dark:text-slate-300"
          }`}
        >
          Semua Level ({passages.length})
        </button>
        {JLPT_LEVELS.map((lvl) => (
          <button
            key={lvl}
            type="button"
            onClick={() => setFilter(lvl)}
            className={`rounded-xl border px-3.5 py-1.5 text-xs font-bold transition ${
              filter === lvl
                ? "border-[#2563EB] bg-[#2563EB] text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-[#111827] dark:text-slate-300"
            }`}
          >
            JLPT {lvl}
          </button>
        ))}
      </div>

      {/* Grid Bacaan */}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((passage) => {
          const prog = progressMap[passage.slug];
          const done = Boolean(prog);

          return (
            <Link
              key={passage.slug}
              href={`/reading/${passage.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-[#2563EB] dark:border-slate-800 dark:bg-[#111827] dark:hover:border-blue-500"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-[#2563EB] px-2.5 py-0.5 text-[11px] font-bold text-white">
                      {passage.level}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {passage.topic} · ±{passage.estimatedMinutes} menit
                    </span>
                  </div>
                  {done && prog && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                      <IconCheck className="h-3 w-3" />
                      Skor {prog.score}/{prog.total}
                    </span>
                  )}
                </div>

                <h2 className="font-jp mt-3 text-lg font-extrabold text-slate-900 group-hover:text-[#2563EB] dark:text-slate-100 dark:group-hover:text-blue-400">
                  {passage.titleJa}
                </h2>
                <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                  {passage.titleId}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold text-[#2563EB] dark:border-slate-800 dark:text-blue-400">
                <span>{passage.questions.length} Soal Pemahaman</span>
                <span className="inline-flex items-center gap-1 transition-transform group-hover:translate-x-0.5">
                  Baca Sekarang
                  <IconArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
