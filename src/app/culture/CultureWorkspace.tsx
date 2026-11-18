"use client";

import { useState, useTransition } from "react";
import { speakJapanese } from "@/lib/audio";
import type { CultureCard } from "@/lib/japanese/culture-data";
import { addWordToSrs } from "@/app/reading/actions";
import { IconCheck, IconGlobe, IconPlus, IconVolume } from "@/components/ui/Icons";

export function CultureWorkspace({ cards }: { cards: CultureCard[] }) {
  const [savedMap, setSavedMap] = useState<Record<string, { ok: boolean; text: string }>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function savePhrase(card: CultureCard) {
    setSavingId(card.id);
    startTransition(async () => {
      const res = await addWordToSrs({
        term: card.keyPhrase.term,
        reading: card.keyPhrase.reading,
        meaning: card.keyPhrase.meaning,
        level: card.level,
      });
      setSavedMap((prev) => ({
        ...prev,
        [card.id]: { ok: res.ok, text: res.message },
      }));
      setSavingId(null);
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold tracking-wider text-[#2563EB] uppercase dark:text-blue-400">
            Tahap 3 · Bunka &amp; Etika Kerja Jepang
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            Budaya &amp; Tata Krama di Jepang
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Pahami etiket kerja, aturan membungkuk (Ojigi), Hou-Ren-Sou, dan simpan frasa sopan penting ke kartu hafalanmu.
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-200">
          <IconGlobe className="h-4 w-4 text-[#2563EB] dark:text-blue-400" />
          {cards.length} Panduan Budaya
        </span>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {cards.map((card) => {
          const status = savedMap[card.id];
          const isSaving = savingId === card.id;

          return (
            <article
              key={card.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#111827]"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-lg bg-[#2563EB] px-2.5 py-0.5 text-[11px] font-bold text-white">
                    {card.tag}
                  </span>
                  <span className="text-xs font-bold text-slate-400">JLPT {card.level}</span>
                </div>

                <h2 className="mt-3 text-lg font-extrabold text-slate-900 dark:text-white">
                  {card.title}
                </h2>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {card.summary}
                </p>

                <ul className="mt-4 space-y-2.5">
                  {card.points.map((pt, idx) => (
                    <li
                      key={idx}
                      className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-3 text-xs dark:border-slate-800 dark:bg-[#0B1120]"
                    >
                      <p className="font-extrabold text-slate-900 dark:text-slate-100">
                        {pt.label}
                      </p>
                      <p className="mt-0.5 leading-relaxed text-slate-600 dark:text-slate-400">
                        {pt.detail}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Frasa Kunci */}
              <div className="mt-5 rounded-2xl bg-[#0F172A] p-4 text-white dark:border dark:border-slate-800 dark:bg-[#0B1120]">
                <p className="text-[10px] font-bold tracking-wider text-blue-300 uppercase">
                  Frasa Kunci yang Wajib Dikuasai
                </p>
                <p className="font-jp mt-1 text-base font-extrabold">
                  {card.keyPhrase.term}
                </p>
                <p className="text-xs text-slate-300">
                  /{card.keyPhrase.romaji}/ — {card.keyPhrase.meaning}
                </p>

                {status && (
                  <p
                    className={`mt-2 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold ${
                      status.ok
                        ? "bg-emerald-950/70 text-emerald-200"
                        : "bg-amber-950/70 text-amber-200"
                    }`}
                  >
                    {status.text}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => speakJapanese(card.keyPhrase.term)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-100 hover:bg-slate-700"
                  >
                    <IconVolume className="h-3.5 w-3.5" />
                    Dengar Suara
                  </button>

                  <button
                    type="button"
                    disabled={isSaving || status?.ok === true}
                    onClick={() => savePhrase(card)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-600 disabled:opacity-60"
                  >
                    {status?.ok ? (
                      <>
                        <IconCheck className="h-3.5 w-3.5" />
                        Tersimpan di FSRS
                      </>
                    ) : (
                      <>
                        <IconPlus className="h-3.5 w-3.5" />
                        {isSaving ? "Menyimpan..." : "Simpan ke Hafalan"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
