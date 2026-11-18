"use client";

import { useMemo, useState } from "react";
import { speakJapanese } from "@/lib/audio";
import type { WritingCharacter } from "@/lib/japanese/kanjivg-strokes";
import { IconCheck, IconPen, IconVolume } from "@/components/ui/Icons";
import { StrokeCanvas } from "./StrokeCanvas";

type ScriptFilter = "all" | "kanji" | "hiragana" | "katakana";

type WritingWorkspaceProps = {
  characters: WritingCharacter[];
  initialMastered: Record<string, number>;
};

export function WritingWorkspace({
  characters,
  initialMastered,
}: WritingWorkspaceProps) {
  const [filter, setFilter] = useState<ScriptFilter>("kanji");
  const [masteredMap, setMasteredMap] =
    useState<Record<string, number>>(initialMastered);

  const visibleChars = useMemo(() => {
    if (filter === "all") return characters;
    return characters.filter((c) => c.scriptType === filter);
  }, [characters, filter]);

  const [selectedChar, setSelectedChar] = useState<string>(
    visibleChars[0]?.char ?? characters[0]?.char ?? "日",
  );

  const activeCharacter =
    visibleChars.find((c) => c.char === selectedChar) ??
    visibleChars[0] ??
    characters[0]!;

  const activeIndex = visibleChars.findIndex(
    (c) => c.char === activeCharacter.char,
  );

  function handleFilterChange(next: ScriptFilter) {
    setFilter(next);
    const list =
      next === "all" ? characters : characters.filter((c) => c.scriptType === next);
    if (list[0]) setSelectedChar(list[0].char);
  }

  function handleNextCharacter() {
    if (visibleChars.length === 0) return;
    const nextIdx = (activeIndex + 1) % visibleChars.length;
    setSelectedChar(visibleChars[nextIdx]!.char);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold tracking-wider text-[#2563EB] uppercase dark:text-blue-400">
            Tahap 2 · KanjiVG Stroke Order
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            Latihan Menulis Goresan
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Pelajari urutan garis dari Kanji N5, Hiragana, dan Katakana: tonton animasi, jiplak panduan, lalu tulis sendiri.
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-200">
          <IconPen className="h-4 w-4 text-[#2563EB] dark:text-blue-400" />
          Dikuasai: {Object.keys(masteredMap).length} / {characters.length}
        </span>
      </div>

      {/* Filter Script */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            { key: "kanji", label: "Kanji N5" },
            { key: "hiragana", label: "Hiragana Dasar" },
            { key: "katakana", label: "Katakana Dasar" },
            { key: "all", label: "Semua Huruf" },
          ] as const
        ).map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => handleFilterChange(key)}
            className={`rounded-xl border px-3.5 py-1.5 text-xs font-bold transition ${
              filter === key
                ? "border-[#2563EB] bg-[#2563EB] text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-[#111827] dark:text-slate-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Daftar Karakter */}
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#111827] h-fit">
          <p className="mb-3 text-xs font-bold tracking-wider text-slate-400 uppercase">
            Pilih Huruf ({visibleChars.length})
          </p>
          <div className="grid grid-cols-5 gap-2 lg:grid-cols-4">
            {visibleChars.map((c) => {
              const isSelected = c.char === activeCharacter.char;
              const bestAcc = masteredMap[c.char];
              return (
                <button
                  key={c.char}
                  type="button"
                  onClick={() => setSelectedChar(c.char)}
                  className={`relative flex h-12 flex-col items-center justify-center rounded-xl border font-jp text-xl font-bold transition ${
                    isSelected
                      ? "border-[#2563EB] bg-[#2563EB] text-white"
                      : "border-slate-200 bg-[#F8FAFC] text-slate-900 hover:border-[#2563EB] dark:border-slate-800 dark:bg-[#0B1120] dark:text-slate-100"
                  }`}
                >
                  {c.char}
                  {bestAcc !== undefined && (
                    <span
                      className={`absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full ${
                        isSelected
                          ? "bg-white text-[#2563EB]"
                          : "bg-[#059669] text-white"
                      }`}
                    >
                      <IconCheck className="h-2.5 w-2.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Area Kanvas Utama */}
        <section className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#111827] sm:p-7 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <span className="font-jp flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0F172A] text-4xl font-extrabold text-white dark:bg-[#2563EB]">
                {activeCharacter.char}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-[#2563EB]/10 px-2 py-0.5 text-[11px] font-bold text-[#2563EB] uppercase dark:bg-blue-950/70 dark:text-blue-300">
                    {activeCharacter.scriptType} · {activeCharacter.level}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {activeCharacter.strokes.length} goresan
                  </span>
                </div>
                <p className="font-jp mt-1 text-lg font-extrabold text-slate-900 dark:text-white">
                  {activeCharacter.reading}
                </p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Arti: {activeCharacter.meaning}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => speakJapanese(activeCharacter.char)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:border-[#2563EB] hover:text-[#2563EB] dark:border-slate-700 dark:bg-[#1E293B] dark:text-slate-200"
            >
              <IconVolume className="h-4 w-4" />
              Dengar Pelafalan
            </button>
          </div>

          <StrokeCanvas
            key={activeCharacter.char}
            character={activeCharacter}
            onNextCharacter={handleNextCharacter}
            onMastered={(char, acc) =>
              setMasteredMap((prev) => ({
                ...prev,
                [char]: Math.max(prev[char] ?? 0, acc),
              }))
            }
          />
        </section>
      </div>
    </div>
  );
}
