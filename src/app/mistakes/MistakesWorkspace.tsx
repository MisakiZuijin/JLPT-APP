"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { IconAlert, IconArrowRight, IconCheck } from "@/components/ui/Icons";
import { toggleMistakeResolved } from "./actions";

export type MistakeRow = {
  id: number;
  category: string;
  prompt: string;
  your_answer: string | null;
  correct_answer: string;
  explanation: string | null;
  wrong_count: number;
  resolved: boolean;
  isStarter?: boolean;
};

const STARTER_MISTAKES: MistakeRow[] = [
  {
    id: -1,
    category: "Partikel & Grammar",
    prompt: "Tertukar antara partikel で (de) vs に (ni)",
    your_answer: "レストランに ごはんを たべます",
    correct_answer: "レストランで ごはんを たべます",
    explanation:
      "で digunakan untuk lokasi dilakukannya aksi aktif (makan, belajar, bekerja); に digunakan untuk keberadaan (います/あります) atau arah tujuan.",
    wrong_count: 1,
    resolved: false,
    isStarter: true,
  },
  {
    id: -2,
    category: "Kanji Mirip",
    prompt: "待 (まつ · menunggu) vs 持 (もつ · membawa)",
    your_answer: "持ってください (tunggu sebentar?)",
    correct_answer: "待ってください (tolong tunggu)",
    explanation:
      "Perhatikan radikal kiri: 彳 (orang berjalan/tunggu) pada 待, sedangkan 扌 (tangan/pegang) pada 持.",
    wrong_count: 1,
    resolved: false,
    isStarter: true,
  },
];

export function MistakesWorkspace({ initialRows }: { initialRows: MistakeRow[] }) {
  const [filter, setFilter] = useState<"active" | "resolved" | "all">("active");
  const [rows, setRows] = useState<MistakeRow[]>(
    initialRows.length > 0 ? initialRows : STARTER_MISTAKES,
  );
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    if (filter === "active") return rows.filter((r) => !r.resolved);
    if (filter === "resolved") return rows.filter((r) => r.resolved);
    return rows;
  }, [rows, filter]);

  function handleToggle(row: MistakeRow) {
    const nextResolved = !row.resolved;
    setRows((prev) =>
      prev.map((item) =>
        item.id === row.id ? { ...item, resolved: nextResolved } : item,
      ),
    );
    if (!row.isStarter) {
      startTransition(async () => {
        await toggleMistakeResolved(row.id, nextResolved);
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold tracking-wider text-[#2563EB] uppercase dark:text-blue-400">
            Tahap 4 · Evaluasi &amp; Ulasan Kesalahan
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            Buku Catatan Kesalahan (Mistake Notebook)
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Soal yang salah saat Tes Harian atau Simulasi Ujian JLPT otomatis tercatat di sini agar mudah dipelajari ulang.
          </p>
        </div>

        <Link
          href="/daily-test"
          className="inline-flex w-fit items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700"
        >
          Latih Lewat Tes Harian
          <IconArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Filter Tab */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            { key: "active", label: `Perlu Diulas (${rows.filter((r) => !r.resolved).length})` },
            { key: "resolved", label: `Sudah Paham (${rows.filter((r) => r.resolved).length})` },
            { key: "all", label: `Semua (${rows.length})` },
          ] as const
        ).map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
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

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-[#111827] dark:text-slate-400">
          Tidak ada catatan pada filter ini.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((row) => (
            <article
              key={row.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#111827]"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-[#D97706] dark:bg-amber-950/60 dark:text-amber-300">
                    <IconAlert className="h-3 w-3" />
                    {row.category} · Salah {row.wrong_count}x
                  </span>
                  {row.isStarter && (
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Contoh Umum N5
                    </span>
                  )}
                </div>

                <h2 className="font-jp mt-3 text-base font-extrabold text-slate-900 dark:text-white">
                  {row.prompt}
                </h2>

                {row.your_answer && (
                  <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                    Jawaban salah: {row.your_answer}
                  </p>
                )}
                <p className="font-jp mt-1 text-xs font-bold text-[#059669] dark:text-emerald-300">
                  Jawaban tepat: {row.correct_answer}
                </p>

                {row.explanation && (
                  <p className="mt-2.5 rounded-xl bg-[#F8FAFC] p-3 text-xs leading-relaxed text-slate-600 dark:bg-[#0B1120] dark:text-slate-300">
                    {row.explanation}
                  </p>
                )}
              </div>

              <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => handleToggle(row)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                    row.resolved
                      ? "bg-[#059669] text-white hover:bg-emerald-700"
                      : "border border-slate-200 bg-[#F8FAFC] text-slate-700 hover:border-[#2563EB] dark:border-slate-700 dark:bg-[#1E293B] dark:text-slate-200"
                  }`}
                >
                  <IconCheck className="h-3.5 w-3.5" />
                  {row.resolved ? "Sudah Paham" : "Tandai Sudah Paham"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
