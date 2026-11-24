"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { JLPT_LEVELS, type JlptLevel } from "@/lib/types";
import {
  QUESTION_SECTIONS,
  type GeneratedQuestionDraft,
  type QuestionSection,
} from "@/lib/ai/gemini-questions";
import { speakJapanese } from "@/lib/audio";
import {
  IconArrowLeft,
  IconArrowRight,
  IconBook,
  IconCheck,
  IconExam,
  IconHome,
  IconLogOut,
  IconSettings,
  IconUser,
  IconVolume,
  IconX,
} from "@/components/ui/Icons";
import {
  approveAndSaveQuestionAction,
  deleteBankQuestionAction,
  generateDraftQuestionsAction,
  type BankQuestionRow,
} from "./actions";

type AdminTab = "overview" | "generator" | "bank" | "users";

export type AdminUserSummary = {
  id: string;
  email: string;
  displayName: string;
  role: "admin" | "learner";
  createdAt: string;
};

type AdminWorkspaceProps = {
  adminEmail: string;
  adminName: string;
  totalItems: number;
  initialBankQuestions: BankQuestionRow[];
  bankTableMissing: boolean;
  users: AdminUserSummary[];
  logoutAction: () => Promise<void>;
};

const NAV_TABS: { key: AdminTab; label: string; shortLabel: string; Icon: typeof IconHome }[] = [
  { key: "overview", label: "Ringkasan Sistem", shortLabel: "Ringkas", Icon: IconHome },
  { key: "generator", label: "Generator Soal Gemini", shortLabel: "Soal AI", Icon: IconExam },
  { key: "bank", label: "Bank Soal DB", shortLabel: "Bank DB", Icon: IconBook },
  { key: "users", label: "Daftar Akun & Role", shortLabel: "Akun", Icon: IconUser },
];

export function AdminWorkspace({
  adminEmail,
  adminName,
  totalItems,
  initialBankQuestions,
  bankTableMissing,
  users,
  logoutAction,
}: AdminWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("generator");
  const [level, setLevel] = useState<JlptLevel>("N5");
  const [section, setSection] = useState<QuestionSection>("Tata Bahasa & Bacaan");
  const [count, setCount] = useState<number>(3);

  const [drafts, setDrafts] = useState<GeneratedQuestionDraft[]>([]);
  const [bankRows, setBankRows] = useState<BankQuestionRow[]>(initialBankQuestions);
  const [statusBanner, setStatusBanner] = useState<{ ok: boolean; text: string } | null>(null);
  const [generating, startGenerating] = useTransition();
  const [savingId, setSavingId] = useState<string | null>(null);

  function handleGenerate() {
    setStatusBanner(null);
    startGenerating(async () => {
      const res = await generateDraftQuestionsAction({ level, section, count });
      if (!res.ok) {
        setStatusBanner({ ok: false, text: res.error ?? "Gagal membuat draft." });
        return;
      }
      setDrafts((prev) => [...res.drafts, ...prev]);
      setStatusBanner({
        ok: true,
        text: `Berhasil membuat ${res.drafts.length} draft soal ${level} (${section}). Silakan review sebelum simpan ke database.`,
      });
    });
  }

  async function handleApproveDraft(draft: GeneratedQuestionDraft) {
    setSavingId(draft.tempId);
    setStatusBanner(null);
    const res = await approveAndSaveQuestionAction(draft);
    setSavingId(null);
    if (!res.ok) {
      setStatusBanner({ ok: false, text: res.message });
      return;
    }
    setDrafts((prev) => prev.filter((d) => d.tempId !== draft.tempId));
    if (res.row) {
      setBankRows((prev) => [res.row!, ...prev]);
    }
    setStatusBanner({ ok: true, text: res.message });
  }

  function handleDiscardDraft(tempId: string) {
    setDrafts((prev) => prev.filter((d) => d.tempId !== tempId));
  }

  async function handleDeleteBankRow(id: number) {
    const res = await deleteBankQuestionAction(id);
    if (res.ok) {
      setBankRows((prev) => prev.filter((r) => r.id !== id));
    } else if (res.message) {
      setStatusBanner({ ok: false, text: res.message });
    }
  }

  const initials = adminName
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("") || "AD";

  return (
    <div className="flex min-h-screen w-full bg-[#F8FAFC] text-[#0F172A] dark:bg-[#0B1120] dark:text-[#F8FAFC]">
      {/* Desktop Sidebar Admin */}
      <aside className="hidden md:flex md:w-64 md:shrink-0 md:flex-col md:justify-between md:border-r md:border-slate-200 md:bg-white md:p-5 dark:md:border-slate-800 dark:md:bg-[#111827]">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F172A] font-jp text-lg font-bold text-white dark:bg-[#2563EB]">
              管
            </span>
            <div>
              <p className="text-base font-bold leading-tight">JLPT Admin</p>
              <p className="text-[11px] font-bold tracking-wide text-[#2563EB] uppercase dark:text-blue-400">
                Panel Kurikulum &amp; Soal
              </p>
            </div>
          </div>

          <nav className="space-y-1.5" aria-label="Navigasi admin">
            {NAV_TABS.map(({ key, label, Icon }) => {
              const active = activeTab === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold transition ${
                    active
                      ? "bg-[#2563EB] text-white"
                      : "bg-[#F1F5F9] text-slate-800 hover:bg-slate-200 dark:bg-[#1E293B] dark:text-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{label}</span>
                  </span>
                  {key === "bank" && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        active ? "bg-white text-[#2563EB]" : "bg-[#2563EB] text-white"
                      }`}
                    >
                      {bankRows.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="space-y-2 border-t border-slate-200 pt-4 dark:border-slate-800">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3.5 py-2.5 text-xs font-bold text-slate-700 transition hover:border-[#2563EB] hover:text-[#2563EB] dark:border-slate-700 dark:bg-[#1E293B] dark:text-slate-200"
            >
              <IconArrowLeft className="h-4 w-4 shrink-0" />
              <span>Masuk Mode Pelajar</span>
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <IconSettings className="h-4 w-4 shrink-0" />
              <span>Pengaturan Tampilan</span>
            </Link>
          </div>
        </div>

        <div className="rounded-2xl bg-[#0F172A] p-3.5 text-white dark:border dark:border-slate-800 dark:bg-[#1E293B]">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-xs font-bold text-white">
                {initials}
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-bold tracking-wider text-blue-300 uppercase">
                  AKUN ADMIN
                </p>
                <p className="truncate text-xs font-bold">{adminEmail}</p>
              </div>
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-1 rounded-lg bg-[#2563EB] px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-blue-700"
                title="Keluar akun"
              >
                <IconLogOut className="h-3.5 w-3.5" />
                <span>Keluar</span>
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:hidden dark:border-slate-800 dark:bg-[#111827]/95">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0F172A] font-jp text-sm font-bold text-white dark:bg-[#2563EB]">
              管
            </span>
            <span className="truncate text-sm font-bold">JLPT Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="rounded-full bg-[#F1F5F9] px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:bg-[#1E293B] dark:text-slate-200"
            >
              Mode Pelajar
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                aria-label="Keluar akun"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-[#F8FAFC] text-slate-700 dark:border-slate-700 dark:bg-[#1E293B] dark:text-slate-200"
              >
                <IconLogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-4 py-6 pb-24 sm:px-6 md:px-10 md:py-8 md:pb-10">
          {/* Header Top */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold tracking-wider text-[#2563EB] uppercase dark:text-blue-400">
                Hemat Token · Batch Admin Only
              </p>
              <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
                Panel Admin &amp; Bank Soal Gemini
              </h1>
            </div>
            <span className="inline-flex w-fit items-center rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-[#1D4ED8] dark:bg-blue-950/60 dark:text-blue-200">
              Sekali Generate → Simpan ke Supabase
            </span>
          </div>

          {bankTableMissing && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
              Tabel <code>question_bank</code> belum ditemukan di Supabase. Jalankan SQL pada file{" "}
              <code>supabase/migrations/0004_admin_question_bank.sql</code> di SQL Editor Supabase agar tombol{" "}
              <strong>Setujui &amp; Simpan ke DB</strong> menyimpan soal permanen ke database.
            </div>
          )}

          {statusBanner && (
            <div
              className={`rounded-2xl border px-4 py-3 text-xs font-bold ${
                statusBanner.ok
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200"
                  : "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200"
              }`}
            >
              {statusBanner.text}
            </div>
          )}

          {/* 4 KPI Cards */}
          <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-[#111827]">
              <p className="text-2xl font-extrabold text-[#2563EB] dark:text-blue-400">
                {totalItems}
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                Item Materi di DB
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-[#111827]">
              <p className="text-2xl font-extrabold text-[#059669] dark:text-emerald-400">
                {bankRows.length}
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                Bank Soal Gemini DB
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-[#111827]">
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {users.length}
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                Akun Terdaftar
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-[#111827]">
              <p className="text-2xl font-extrabold text-[#D97706] dark:text-amber-400">
                0 Token/User
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                Pelajar Pakai DB Statis
              </p>
            </div>
          </section>

          {/* TAB: OVERVIEW */}
          {activeTab === "overview" && (
            <section className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#111827]">
                <h2 className="text-base font-extrabold">Alur Penghematan Token AI</h2>
                <ol className="mt-3 space-y-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  <li>1. Admin memilih level (N5–N1), bagian ujian, dan jumlah soal di tab <strong>Generator Soal Gemini</strong>.</li>
                  <li>2. Gemini (`gemini-3-flash-preview`) membuat draft soal terstruktur JSON sekali panggil.</li>
                  <li>3. Admin meninjau kualitas kalimat &amp; pembahasan lalu klik <strong>Setujui &amp; Simpan ke DB</strong>.</li>
                  <li>4. Soal otomatis tampil di Simulasi Ujian (`/exam/[level]`) bagi seluruh pelajar tanpa memanggil AI lagi.</li>
                </ol>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#111827]">
                <h2 className="text-base font-extrabold">Akses Cepat</h2>
                <div className="mt-3 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("generator")}
                    className="inline-flex items-center justify-between rounded-xl bg-[#2563EB] px-4 py-3 text-xs font-bold text-white"
                  >
                    <span>Buat Soal Baru via Gemini API</span>
                    <IconArrowRight className="h-4 w-4" />
                  </button>
                  <Link
                    href="/exam"
                    className="inline-flex items-center justify-between rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-3 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-[#0B1120] dark:text-slate-200"
                  >
                    <span>Pratinjau Halaman Simulasi Ujian Pelajar</span>
                    <IconArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* TAB: GENERATOR GEMINI */}
          {activeTab === "generator" && (
            <section className="space-y-5 rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#111827] sm:p-7">
              <div>
                <h2 className="text-base font-extrabold sm:text-lg">
                  1. Generate Batch Soal Orisinal (Gemini API → Review → Supabase)
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Hasil tidak langsung masuk ke user sebelum Anda klik Setujui &amp; Simpan ke DB.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-4">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  Level JLPT
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as JlptLevel)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2.5 text-sm font-bold text-slate-900 dark:border-slate-700 dark:bg-[#0B1120] dark:text-white"
                  >
                    {JLPT_LEVELS.map((l) => (
                      <option key={l} value={l}>
                        JLPT {l}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 sm:col-span-2">
                  Bagian Ujian
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value as QuestionSection)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2.5 text-sm font-bold text-slate-900 dark:border-slate-700 dark:bg-[#0B1120] dark:text-white"
                  >
                    {QUESTION_SECTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  Jumlah Draft
                  <select
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2.5 text-sm font-bold text-slate-900 dark:border-slate-700 dark:bg-[#0B1120] dark:text-white"
                  >
                    {[3, 5, 8, 10].map((c) => (
                      <option key={c} value={c}>
                        {c} Soal
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <button
                type="button"
                disabled={generating}
                onClick={handleGenerate}
                className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                <span>{generating ? "Menghasilkan Draft via Gemini..." : "Generate Draft Soal"}</span>
                <IconArrowRight className="h-4 w-4" />
              </button>

              {drafts.length > 0 && (
                <div className="space-y-4 border-t border-slate-100 pt-5 dark:border-slate-800">
                  <p className="text-xs font-extrabold tracking-wider text-[#D97706] uppercase">
                    Menunggu Review &amp; ACC Admin ({drafts.length} Draft)
                  </p>
                  {drafts.map((d, i) => (
                    <div
                      key={d.tempId}
                      className="space-y-3 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 dark:border-slate-700 dark:bg-[#0B1120]"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] font-extrabold text-[#D97706] uppercase">
                          DRAFT #{i + 1} · {d.level} · {d.section} · ({d.modelUsed})
                        </span>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={savingId === d.tempId}
                            onClick={() => handleApproveDraft(d)}
                            className="inline-flex items-center gap-1 rounded-lg bg-[#059669] px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                          >
                            <IconCheck className="h-3.5 w-3.5" />
                            {savingId === d.tempId ? "Menyimpan..." : "Setujui & Simpan ke DB"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDiscardDraft(d.tempId)}
                            className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-200 dark:bg-red-950/60 dark:text-red-300"
                          >
                            <IconX className="h-3.5 w-3.5" />
                            Buang
                          </button>
                        </div>
                      </div>

                      <p className="font-jp text-base font-extrabold text-slate-900 dark:text-white">
                        {d.promptJa}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-300">{d.promptId}</p>

                      {d.audioText && (
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => speakJapanese(d.audioText!)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F172A] px-3 py-1.5 text-xs font-bold text-white dark:bg-[#2563EB]"
                          >
                            <IconVolume className="h-3.5 w-3.5" />
                            Coba Audio Naskah
                          </button>
                          <span className="font-jp text-xs text-slate-500 dark:text-slate-400">
                            {d.audioText}
                          </span>
                        </div>
                      )}

                      <div className="grid gap-2 sm:grid-cols-2">
                        {d.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className={`font-jp rounded-xl border px-3 py-2 text-xs font-bold ${
                              oIdx === d.answerIndex
                                ? "border-[#059669] bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200"
                                : "border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-[#111827] dark:text-slate-300"
                            }`}
                          >
                            {oIdx + 1}. {opt} {oIdx === d.answerIndex ? "(Kunci)" : ""}
                          </div>
                        ))}
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        <strong>Pembahasan:</strong> {d.explanationId}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* TAB: BANK SOAL DB */}
          {activeTab === "bank" && (
            <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#111827] sm:p-7">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold sm:text-lg">
                  Bank Soal Tersimpan di Supabase ({bankRows.length})
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveTab("generator")}
                  className="rounded-xl bg-[#2563EB] px-3.5 py-2 text-xs font-bold text-white"
                >
                  + Generate Soal Baru
                </button>
              </div>

              {bankRows.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  Belum ada soal yang disimpan ke <code>question_bank</code>. Buat lewat tab{" "}
                  <strong>Generator Soal Gemini</strong> lalu klik Setujui &amp; Simpan ke DB.
                </p>
              ) : (
                <div className="space-y-3">
                  {bankRows.map((row) => (
                    <div
                      key={row.id}
                      className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 dark:border-slate-800 dark:bg-[#0B1120]"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="rounded-md bg-[#2563EB] px-2 py-0.5 text-[11px] font-bold text-white">
                          {row.jlpt_level} · {row.section}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteBankRow(row.id)}
                          className="text-xs font-bold text-red-600 hover:underline dark:text-red-400"
                        >
                          Hapus
                        </button>
                      </div>
                      <p className="font-jp mt-2 text-sm font-bold text-slate-900 dark:text-white">
                        {row.prompt_ja}
                      </p>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                        Kunci: <strong>{row.options[row.answer_index] ?? "-"}</strong> · {row.explanation_id}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* TAB: DAFTAR AKUN & ROLE */}
          {activeTab === "users" && (
            <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#111827] sm:p-7">
              <h2 className="text-base font-extrabold sm:text-lg">
                Daftar Pengguna &amp; Role ({users.length})
              </h2>
              <div className="space-y-2.5">
                {users.map((u) => (
                  <div
                    key={u.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 dark:border-slate-800 dark:bg-[#0B1120]"
                  >
                    <div>
                      <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {u.displayName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{u.email}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase ${
                        u.role === "admin"
                          ? "bg-[#2563EB] text-white"
                          : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {u.role === "admin" ? "ADMIN" : "PELAJAR"}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Mobile Admin Bottom Nav (4 Cols) */}
      <nav
        aria-label="Navigasi bawah admin"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white px-2 pt-2 pb-[calc(0.65rem+env(safe-area-inset-bottom))] md:hidden dark:border-slate-800 dark:bg-[#111827]"
      >
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
          {NAV_TABS.map(({ key, shortLabel, Icon }) => {
            const active = activeTab === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={`flex flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 text-[10px] transition ${
                  active
                    ? "bg-[#2563EB] font-bold text-white"
                    : "font-semibold text-slate-500 dark:text-slate-400"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{shortLabel}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
