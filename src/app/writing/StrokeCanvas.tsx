"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import type { WritingCharacter } from "@/lib/japanese/kanjivg-strokes";
import { pointsToBrushOutline, type InkPoint } from "@/lib/japanese/brush-ink";
import { sampleSvgPath, validateStroke } from "@/lib/japanese/stroke-validator";
import {
  IconArrowRight,
  IconCheck,
  IconEye,
  IconGrid,
  IconPen,
  IconPlay,
  IconRotateCcw,
} from "@/components/ui/Icons";
import { saveWritingProgress } from "./actions";

type PracticeMode = "watch" | "trace" | "free";

type StrokeCanvasProps = {
  character: WritingCharacter;
  onNextCharacter?: () => void;
  onMastered?: (char: string, accuracy: number) => void;
};

export function StrokeCanvas({
  character,
  onNextCharacter,
  onMastered,
}: StrokeCanvasProps) {
  const [mode, setMode] = useState<PracticeMode>("trace");
  const [showGrid, setShowGrid] = useState(true);
  const [completedPaths, setCompletedPaths] = useState<InkPoint[][]>([]);
  const [accuracies, setAccuracies] = useState<number[]>([]);
  const [draftPoints, setDraftPoints] = useState<InkPoint[]>([]);
  const [feedback, setFeedback] = useState<{ type: "info" | "ok" | "err"; text: string }>({
    type: "info",
    text: `Mulai goresan 1: ${character.strokes[0]?.hint ?? ""}`,
  });

  // State animasi mode "watch"
  const [animStep, setAnimStep] = useState<number>(character.strokes.length);
  const [animRunId, setAnimRunId] = useState(0);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const drawingRef = useRef(false);
  const [pending, startTransition] = useTransition();

  const totalStrokes = character.strokes.length;
  const activeIndex = completedPaths.length;
  const isFinished = activeIndex >= totalStrokes;

  // Reset setiap karakter berganti (dikelola via key di parent atau efek eksplisit lewat callback)
  const startPoints = useMemo(() => {
    return character.strokes.map((s) => sampleSvgPath(s.path, 4)[0] ?? { x: 50, y: 50 });
  }, [character]);

  const watchBrushOutlines = useMemo(() => {
    return character.strokes.map((s) => pointsToBrushOutline(sampleSvgPath(s.path, 12), 2.9));
  }, [character]);

  // Timer animasi langkah demi langkah saat mode === "watch"
  useEffect(() => {
    if (mode !== "watch") return;
    let step = 0;
    const id = window.setInterval(() => {
      step += 1;
      setAnimStep(step);
      if (step >= totalStrokes) {
        window.clearInterval(id);
      }
    }, 650);
    return () => window.clearInterval(id);
  }, [mode, totalStrokes, animRunId]);

  function resetBoard(nextMode?: PracticeMode) {
    if (nextMode) setMode(nextMode);
    setCompletedPaths([]);
    setAccuracies([]);
    setDraftPoints([]);
    setFeedback({
      type: "info",
      text: `Goresan 1 dari ${totalStrokes}: ${character.strokes[0]?.hint ?? ""}`,
    });
    if ((nextMode ?? mode) === "watch") {
      setAnimStep(0);
      setAnimRunId((n) => n + 1);
    }
  }

  function toBoardCoords(
    clientX: number,
    clientY: number,
    pressure?: number,
  ): InkPoint | null {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;
    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    return { x, y, t: performance.now(), p: pressure };
  }

  function handlePointerDown(e: React.PointerEvent<SVGSVGElement>) {
    if (mode === "watch" || isFinished) return;
    const pt = toBoardCoords(e.clientX, e.clientY, e.pressure);
    if (!pt) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    setDraftPoints([pt]);
  }

  function handlePointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (!drawingRef.current) return;
    const pt = toBoardCoords(e.clientX, e.clientY, e.pressure);
    if (!pt) return;
    setDraftPoints((prev) => {
      const last = prev[prev.length - 1];
      if (last && Math.hypot(pt.x - last.x, pt.y - last.y) < 1.1) return prev;
      return [...prev, pt];
    });
  }

  function handlePointerUp() {
    if (!drawingRef.current) return;
    drawingRef.current = false;

    const currentStroke = character.strokes[activeIndex];
    if (!currentStroke) {
      setDraftPoints([]);
      return;
    }

    const result = validateStroke(
      draftPoints,
      currentStroke.path,
      activeIndex + 1,
      mode === "free" ? "free" : "trace",
    );
    setDraftPoints([]);

    if (!result.passed) {
      setFeedback({ type: "err", text: result.feedback });
      return;
    }

    const nextPaths = [...completedPaths, draftPoints];
    const nextAccs = [...accuracies, result.accuracy];
    setCompletedPaths(nextPaths);
    setAccuracies(nextAccs);

    if (nextPaths.length >= totalStrokes) {
      const avg = Math.round(
        nextAccs.reduce((sum, v) => sum + v, 0) / Math.max(1, nextAccs.length),
      );
      const mastered = avg >= 72;
      setFeedback({
        type: "ok",
        text: `Selesai! Rata-rata ketepatan goresan: ${avg}%.`,
      });
      onMastered?.(character.char, avg);
      startTransition(async () => {
        await saveWritingProgress({
          character: character.char,
          scriptType: character.scriptType,
          jlptLevel: character.level,
          accuracy: avg,
          mastered,
        });
      });
    } else {
      const nextIdx = nextPaths.length;
      setFeedback({
        type: "ok",
        text: `${result.feedback} Sekarang goresan ${nextIdx + 1}: ${character.strokes[nextIdx]?.hint ?? ""}`,
      });
    }
  }

  const activeStart = startPoints[activeIndex];

  return (
    <div className="space-y-4">
      {/* Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="grid grid-cols-3 gap-1 rounded-xl bg-[#E2E8F0] p-1 dark:bg-[#1E293B]">
          {(
            [
              { key: "watch", label: "Lihat Animasi", Icon: IconEye },
              { key: "trace", label: "Jiplak", Icon: IconPen },
              { key: "free", label: "Tanpa Panduan", Icon: IconPen },
            ] as const
          ).map(({ key, label, Icon }) => {
            const active = mode === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => resetBoard(key)}
                className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition sm:px-3.5 ${
                  active
                    ? "bg-[#2563EB] text-white"
                    : "text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowGrid((v) => !v)}
            aria-pressed={showGrid}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
              showGrid
                ? "border-[#2563EB] bg-[#2563EB]/10 text-[#2563EB] dark:border-blue-500 dark:bg-blue-950/60 dark:text-blue-300"
                : "border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-300"
            }`}
          >
            <IconGrid className="h-3.5 w-3.5" />
            Kotak Bantu
          </button>

          <button
            type="button"
            onClick={() => resetBoard()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-slate-300 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-200"
          >
            <IconRotateCcw className="h-3.5 w-3.5" />
            Ulangi
          </button>
        </div>
      </div>

      {/* Papan Goresan */}
      <div className="flex flex-col items-center gap-5 md:flex-row md:items-start">
        <div className="relative w-full max-w-[320px] shrink-0 overflow-hidden rounded-3xl border-2 border-slate-200 bg-white dark:border-slate-700 dark:bg-[#0B1120]">
          <svg
            ref={svgRef}
            viewBox="0 0 100 100"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={`aspect-square w-full touch-none select-none ${
              mode === "watch" ? "cursor-default" : "cursor-brush"
            }`}
          >
            {/* Garis Bantu Kotak Kanji (田) */}
            {showGrid && (
              <g className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="0.7" strokeDasharray="2 2">
                <line x1="50" y1="0" x2="50" y2="100" />
                <line x1="0" y1="50" x2="100" y2="50" />
                <rect x="6" y="6" width="88" height="88" fill="none" />
              </g>
            )}

            {/* Panduan Ghost Strokes Kaligrafi (mode trace & mode watch) */}
            {mode !== "free" &&
              watchBrushOutlines.map((outline, idx) => (
                <path
                  key={`guide-${idx}`}
                  d={outline}
                  fill="currentColor"
                  className={
                    mode === "watch"
                      ? idx < animStep
                        ? "text-[#2563EB] transition-colors duration-300 dark:text-blue-400"
                        : "text-slate-200 dark:text-slate-800"
                      : idx < activeIndex
                        ? "text-slate-200/60 dark:text-slate-800/60"
                        : idx === activeIndex
                          ? "text-slate-300 dark:text-slate-700"
                          : "text-slate-200/70 dark:text-slate-800/70"
                  }
                />
              ))}

            {/* Penanda Nomor Urut Goresan Aktif (mode trace & free jika belum selesai) */}
            {mode === "trace" && !isFinished && activeStart && (
              <g>
                <circle
                  cx={activeStart.x}
                  cy={activeStart.y}
                  r="5.5"
                  className="fill-[#2563EB] dark:fill-blue-500"
                />
                <text
                  x={activeStart.x}
                  y={activeStart.y + 1.8}
                  textAnchor="middle"
                  fontSize="5"
                  fontWeight="bold"
                  className="fill-white"
                >
                  {activeIndex + 1}
                </text>
              </g>
            )}

            {/* Penanda Semua Nomor Saat Mode Watch */}
            {mode === "watch" &&
              startPoints.map((pt, idx) => (
                <g key={`num-${idx}`} opacity={idx < animStep ? 1 : 0.4}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="4.8"
                    className={
                      idx < animStep
                        ? "fill-[#0F172A] dark:fill-blue-600"
                        : "fill-slate-400 dark:fill-slate-600"
                    }
                  />
                  <text
                    x={pt.x}
                    y={pt.y + 1.7}
                    textAnchor="middle"
                    fontSize="4.6"
                    fontWeight="bold"
                    className="fill-white"
                  >
                    {idx + 1}
                  </text>
                </g>
              ))}

            {/* Goresan Kuas User yang Sudah Lolos Validasi */}
            {mode !== "watch" &&
              completedPaths.map((pts, idx) => (
                <path
                  key={`done-${idx}`}
                  d={pointsToBrushOutline(pts, 3.1)}
                  className="fill-[#1D4ED8] dark:fill-blue-400"
                />
              ))}

            {/* Goresan Kuas Aktif Saat Sedang Menarik Garis */}
            {mode !== "watch" && draftPoints.length > 0 && (
              <path
                d={pointsToBrushOutline(draftPoints, 3.2)}
                className="fill-[#0F172A] dark:fill-white"
              />
            )}
          </svg>
        </div>

        {/* Panel Panduan Urutan & Umpan Balik */}
        <div className="flex-1 space-y-4 w-full">
          <div
            className={`rounded-2xl border p-4 text-sm font-semibold ${
              feedback.type === "ok"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-200"
                : feedback.type === "err"
                  ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-200"
                  : "border-slate-200 bg-[#F8FAFC] text-slate-700 dark:border-slate-800 dark:bg-[#0B1120] dark:text-slate-200"
            }`}
          >
            {mode === "watch"
              ? `Menampilkan animasi urutan ${totalStrokes} goresan untuk "${character.char}".`
              : feedback.text}
          </div>

          {mode === "watch" && (
            <button
              type="button"
              onClick={() => {
                setAnimStep(0);
                setAnimRunId((n) => n + 1);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700"
            >
              <IconPlay className="h-3.5 w-3.5" />
              Putar Ulang Animasi
            </button>
          )}

          {/* Daftar Langkah Goresan */}
          <div className="space-y-1.5">
            <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">
              Urutan Goresan ({Math.min(activeIndex, totalStrokes)} / {totalStrokes})
            </p>
            {character.strokes.map((s, idx) => {
              const done = mode === "watch" ? idx < animStep : idx < activeIndex;
              const current = mode !== "watch" && idx === activeIndex;
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-2.5 rounded-xl border px-3 py-2 text-xs transition ${
                    current
                      ? "border-[#2563EB] bg-blue-50/70 text-slate-900 dark:border-blue-500 dark:bg-blue-950/40 dark:text-slate-100"
                      : done
                        ? "border-emerald-200 bg-emerald-50/50 text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200"
                        : "border-slate-200 bg-white text-slate-500 dark:border-slate-800 dark:bg-[#111827] dark:text-slate-400"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                      done
                        ? "bg-[#059669] text-white"
                        : current
                          ? "bg-[#2563EB] text-white"
                          : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    {done ? <IconCheck className="h-3 w-3" /> : idx + 1}
                  </span>
                  <span className="leading-relaxed font-medium">{s.hint}</span>
                </div>
              );
            })}
          </div>

          {isFinished && (
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => resetBoard()}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-[#1E293B] dark:text-slate-200"
              >
                <IconRotateCcw className="h-3.5 w-3.5" />
                Tulis Lagi
              </button>
              {onNextCharacter && (
                <button
                  type="button"
                  disabled={pending}
                  onClick={onNextCharacter}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                  Huruf Berikutnya
                  <IconArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
