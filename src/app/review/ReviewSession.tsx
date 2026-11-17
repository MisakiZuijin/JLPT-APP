"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toRomaji, isKana } from "wanakana";
import { submitReview, type QueueEntry } from "./actions";

const RATINGS = [
  { value: 1, label: "Lupa", cls: "bg-red-600 hover:bg-red-700" },
  { value: 2, label: "Sulit", cls: "bg-amber-500 hover:bg-amber-600" },
  { value: 3, label: "Bisa", cls: "bg-emerald-600 hover:bg-emerald-700" },
  { value: 4, label: "Mudah", cls: "bg-sky-600 hover:bg-sky-700" },
];

const TYPE_LABEL: Record<string, string> = {
  kana: "Kana", vocab: "Kosakata", kanji: "Kanji", grammar: "Tata bahasa",
};

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ja-JP";
  u.rate = 0.85;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

export default function ReviewSession({ initialQueue }: { initialQueue: QueueEntry[] }) {
  const [queue, setQueue] = useState(initialQueue);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const current = queue[0];

  if (!current) {
    return (
      <div className="mt-10 rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-5xl">🎉</p>
        <p className="mt-4 text-lg font-semibold">お疲れ様でした！</p>
        <p className="text-slate-600">
          {done > 0 ? `${done} kartu selesai direview.` : "Tidak ada kartu untuk direview saat ini."}
        </p>
        <Link href="/dashboard" className="mt-6 inline-block rounded-lg bg-rose-600 px-5 py-2 text-white">
          Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  const { item, isNew } = current;
  const reading = item.reading ?? "";
  const romaji = isKana(reading.replace(/・/g, "")) ? toRomaji(reading) : reading;

  function rate(value: number) {
    setError(null);
    startTransition(async () => {
      try {
        const { due } = await submitReview(item.id, value);
        const soon = new Date(due).getTime() - Date.now() < 15 * 60 * 1000;
        setQueue((q) => {
          const [head, ...rest] = q;
          // Kartu yang masih tahap belajar dimunculkan lagi di akhir sesi
          return soon ? [...rest, { ...head, isNew: false }] : rest;
        });
        setDone((d) => d + 1);
        setRevealed(false);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Gagal menyimpan");
      }
    });
  }

  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center justify-between text-sm text-slate-500">
        <span>
          {TYPE_LABEL[item.type]} · {item.jlpt_level}
          {isNew && <span className="ml-2 rounded bg-rose-100 px-2 py-0.5 text-rose-700">Baru</span>}
        </span>
        <span>Sisa: {queue.length}</span>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-7xl font-bold">{item.term}</p>

        {revealed ? (
          <div className="mt-6 space-y-2">
            {item.type !== "kana" && <p className="text-2xl text-slate-700">{reading}</p>}
            <p className="text-sm text-slate-500">{romaji}</p>
            <p className="text-xl font-semibold">{item.meaning}</p>
            {item.example_ja && (
              <div className="mt-4 rounded-lg bg-slate-50 p-3 text-left">
                <p>{item.example_ja}</p>
                <p className="text-sm text-slate-500">{item.example_id}</p>
              </div>
            )}
            <button onClick={() => speak(item.type === "kana" ? item.term : reading.split("・")[0] || item.term)}
              className="mt-2 rounded-lg border border-slate-300 px-3 py-1 text-sm hover:bg-slate-50">
              🔊 Dengarkan
            </button>
          </div>
        ) : (
          <button onClick={() => setRevealed(true)}
            className="mt-8 rounded-lg bg-slate-900 px-6 py-2 text-white">
            Tampilkan Jawaban
          </button>
        )}
      </div>

      {revealed && (
        <div className="mt-4 grid grid-cols-4 gap-2">
          {RATINGS.map((r) => (
            <button key={r.value} disabled={pending} onClick={() => rate(r.value)}
              className={`rounded-lg py-3 font-medium text-white disabled:opacity-60 ${r.cls}`}>
              {r.label}
            </button>
          ))}
        </div>
      )}
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
