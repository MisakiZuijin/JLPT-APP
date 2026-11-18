"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { isKana, toRomaji } from "wanakana";
import { speakJapanese } from "@/lib/audio";
import {
  IconArrowLeft,
  IconAward,
  IconCards,
  IconVolume,
} from "@/components/ui/Icons";
import { submitReview, type QueueEntry } from "./actions";

const RATINGS = [
  {
    value: 1,
    shortcut: "1",
    label: "Lupa",
    sublabel: "Ulang sebentar",
    cls: "bg-[#DC2626] hover:bg-red-700 text-white",
  },
  {
    value: 2,
    shortcut: "2",
    label: "Sulit",
    sublabel: "Perlu usaha",
    cls: "bg-[#D97706] hover:bg-amber-700 text-white",
  },
  {
    value: 3,
    shortcut: "3",
    label: "Bisa",
    sublabel: "Ingat baik",
    cls: "bg-[#059669] hover:bg-emerald-700 text-white",
  },
  {
    value: 4,
    shortcut: "4",
    label: "Mudah",
    sublabel: "Sangat lancar",
    cls: "bg-[#2563EB] hover:bg-blue-700 text-white",
  },
] as const;

const TYPE_LABEL: Record<string, string> = {
  kana: "Kana",
  vocab: "Kosakata",
  kanji: "Kanji",
  grammar: "Tata Bahasa",
};

export default function ReviewSession({
  initialQueue,
}: {
  initialQueue: QueueEntry[];
}) {
  const [queue, setQueue] = useState(initialQueue);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const current = queue[0];
  const totalInSession = done + queue.length;
  const progressPct =
    totalInSession > 0 ? Math.round((done / totalInSession) * 100) : 100;

  const rate = useCallback(
    (value: number) => {
      if (!current || pending) return;
      setError(null);
      startTransition(async () => {
        try {
          const { due } = await submitReview(current.item.id, value);
          const soon = new Date(due).getTime() - Date.now() < 15 * 60 * 1000;
          setQueue((q) => {
            const [head, ...rest] = q;
            if (!head) return q;
            return soon ? [...rest, { ...head, isNew: false }] : rest;
          });
          setDone((d) => d + 1);
          setRevealed(false);
        } catch (e) {
          setError(e instanceof Error ? e.message : "Gagal menyimpan hasil review");
        }
      });
    },
    [current, pending],
  );

  useEffect(() => {
    if (!current) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }

      if (!revealed && (e.code === "Space" || e.code === "Enter")) {
        e.preventDefault();
        setRevealed(true);
        return;
      }

      if (revealed && ["1", "2", "3", "4"].includes(e.key)) {
        e.preventDefault();
        rate(Number(e.key));
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [current, revealed, rate]);

  if (!current) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-[#111827] sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2563EB]/10 text-[#2563EB] dark:bg-blue-950/60 dark:text-blue-400">
            <IconAward className="h-8 w-8" />
          </div>
          <p className="font-jp mt-5 text-2xl font-bold text-slate-900 dark:text-slate-100">
            お疲れ様でした！
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {done > 0
              ? `${done} kartu selesai diulang pada sesi ini. Algoritma FSRS telah menjadwalkan ulang waktu review berikutnya.`
              : "Tidak ada kartu yang perlu direview saat ini. Semua jadwal hafalan masih aman."}
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              <IconArrowLeft className="h-4 w-4" />
              Kembali ke Beranda
            </Link>
            <Link
              href="/kana"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-[#F8FAFC] px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:border-slate-300 dark:border-slate-700 dark:bg-[#1E293B] dark:text-slate-200"
            >
              Latihan Papan Kana
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { item, isNew } = current;
  const reading = item.reading ?? "";
  const romaji = isKana(reading.replace(/・/g, "")) ? toRomaji(reading) : reading;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      {/* Header navigasi & progres sesi */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-[#111827] dark:text-slate-300 dark:hover:text-white"
          >
            <IconArrowLeft className="h-3.5 w-3.5" />
            Beranda
          </Link>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
            <IconCards className="h-4 w-4 text-[#2563EB] dark:text-blue-400" />
            <span>
              {TYPE_LABEL[item.type] ?? item.type} · {item.jlpt_level}
            </span>
            {isNew && (
              <span className="rounded-md bg-[#2563EB]/10 px-2 py-0.5 text-[11px] font-bold text-[#2563EB] dark:bg-blue-950/70 dark:text-blue-300">
                Kartu Baru
              </span>
            )}
          </div>
        </div>

        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
          Selesai {done} · Sisa {queue.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-[#2563EB] transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Flashcard utama */}
      <div className="rounded-3xl border border-slate-200 bg-white p-7 text-center dark:border-slate-800 dark:bg-[#111827] sm:p-10">
        <p className="font-jp text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-7xl">
          {item.term}
        </p>

        {revealed ? (
          <div className="mt-7 space-y-3 border-t border-slate-100 pt-6 dark:border-slate-800">
            {item.type !== "kana" && reading && (
              <p className="font-jp text-2xl font-bold text-slate-800 dark:text-slate-100">
                {reading}
              </p>
            )}
            {romaji && (
              <p className="text-sm font-semibold tracking-wide text-[#2563EB] dark:text-blue-400">
                {romaji}
              </p>
            )}
            <p className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              {item.meaning}
            </p>

            {item.example_ja && (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 text-left dark:border-slate-800 dark:bg-[#0B1120]">
                <p className="font-jp text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {item.example_ja}
                </p>
                {item.example_id && (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {item.example_id}
                  </p>
                )}
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={() => speakJapanese(reading || item.term)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-2 text-xs font-bold text-slate-700 transition hover:border-[#2563EB] hover:text-[#2563EB] dark:border-slate-700 dark:bg-[#1E293B] dark:text-slate-200 dark:hover:border-blue-400"
              >
                <IconVolume className="h-4 w-4" />
                Putar Pengucapan (JP)
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-8">
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="w-full rounded-xl bg-[#0F172A] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-[#2563EB] dark:hover:bg-blue-700"
            >
              Tampilkan Jawaban (Spasi)
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {revealed && (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {RATINGS.map((r) => (
            <button
              key={r.value}
              type="button"
              disabled={pending}
              onClick={() => rate(r.value)}
              className={`flex flex-col items-center rounded-2xl px-3 py-3 transition disabled:opacity-50 ${r.cls}`}
            >
              <span className="text-sm font-extrabold">
                {r.label}
              </span>
              <span className="mt-0.5 text-[11px] font-medium opacity-90">
                [{r.shortcut}] {r.sublabel}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
