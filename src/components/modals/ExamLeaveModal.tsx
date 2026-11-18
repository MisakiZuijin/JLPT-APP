"use client";

import { IconAlert, IconArrowLeft, IconArrowRight } from "@/components/ui/Icons";

type ExamLeaveModalProps = {
  open: boolean;
  currentSectionTitle: string;
  nextSectionTitle: string | null;
  unansweredCount: number;
  flaggedCount: number;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ExamLeaveModal({
  open,
  currentSectionTitle,
  nextSectionTitle,
  unansweredCount,
  flaggedCount,
  onCancel,
  onConfirm,
}: ExamLeaveModalProps) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Konfirmasi pindah bagian ujian"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-xs"
    >
      <div className="w-full max-w-md space-y-4 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-[#111827]">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-amber-800 dark:bg-amber-950/70 dark:text-amber-200">
          <IconAlert className="h-4 w-4" />
          PERINGATAN UJIAN JLPT
        </div>

        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
          {nextSectionTitle
            ? `Lanjut ke ${nextSectionTitle}?`
            : "Akhiri & Kumpulkan Simulasi Ujian?"}
        </h2>

        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          {nextSectionTitle
            ? `Setelah berpindah dari ${currentSectionTitle}, kamu tidak bisa kembali lagi ke soal bagian ini.`
            : "Seluruh jawaban akan langsung dinilai sesuai standar bagian JLPT dan ditampilkan pembahasannya."}
        </p>

        {(unansweredCount > 0 || flaggedCount > 0) && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs font-bold text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/50 dark:text-amber-200">
            Masih ada {flaggedCount} soal ditandai Ragu dan {unansweredCount} soal belum dijawab di bagian ini.
          </div>
        )}

        <div className="flex flex-col gap-2.5 pt-2 sm:flex-row">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-2.5 text-xs font-bold text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-[#1E293B] dark:text-slate-200"
          >
            <IconArrowLeft className="h-3.5 w-3.5" />
            Kembali Cek Soal
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700"
          >
            <span>{nextSectionTitle ? "Ya, Lanjut Bagian" : "Kumpulkan Ujian"}</span>
            <IconArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
