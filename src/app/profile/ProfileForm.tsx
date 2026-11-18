"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { JLPT_LEVELS, type JlptLevel } from "@/lib/types";
import {
  IconArrowRight,
  IconAward,
  IconCalendar,
  IconCheck,
  IconLogOut,
  IconSettings,
  IconUser,
} from "@/components/ui/Icons";
import { updateProfile, type ProfileActionState } from "./actions";

const LEVEL_META: Record<JlptLevel, { title: string; subtitle: string }> = {
  N5: { title: "N5", subtitle: "Dasar · 800 kosakata" },
  N4: { title: "N4", subtitle: "Menengah Awal · 1.500 kata" },
  N3: { title: "N3", subtitle: "Menengah · 3.700 kata" },
  N2: { title: "N2", subtitle: "Lanjutan · 6.000 kata" },
  N1: { title: "N1", subtitle: "Mahir · 10.000 kata" },
};

const LIMIT_PRESETS = [5, 10, 20, 30];

type ProfileFormProps = {
  email: string | null;
  initialName: string;
  initialLevel: JlptLevel;
  initialLimit: number;
  logoutAction: () => Promise<void>;
};

export function ProfileForm({
  email,
  initialName,
  initialLevel,
  initialLimit,
  logoutAction,
}: ProfileFormProps) {
  const [state, formAction, pending] = useActionState<ProfileActionState, FormData>(
    updateProfile,
    {},
  );
  const [displayName, setDisplayName] = useState(initialName);
  const [selectedLevel, setSelectedLevel] = useState<JlptLevel>(initialLevel);
  const [dailyLimit, setDailyLimit] = useState<number>(initialLimit);

  const labelSource = displayName.trim() || email || "Pelajar JLPT";
  const initials = labelSource
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "PJ";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold tracking-wider text-[#2563EB] uppercase dark:text-blue-400">
            Pengaturan Akun &amp; Target
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            Profil &amp; Pengaturan
          </h1>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-200">
          <IconAward className="h-4 w-4 text-[#2563EB] dark:text-blue-400" />
          Target Aktif: JLPT {selectedLevel}
        </span>
      </div>

      {/* Avatar & Identitas */}
      <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#111827] sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#2563EB] text-lg font-extrabold text-white">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-extrabold text-slate-900 dark:text-slate-100">
              {displayName.trim() || "Pelajar JLPT"}
            </p>
            <p className="truncate text-sm text-slate-500 dark:text-slate-400">
              {email ?? "Akun Terdaftar"}
            </p>
          </div>
        </div>

        <form action={logoutAction}>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 dark:border-slate-700 dark:bg-[#1E293B] dark:text-slate-200 dark:hover:border-red-800 dark:hover:bg-red-950/50 dark:hover:text-red-300"
          >
            <IconLogOut className="h-4 w-4" />
            Keluar Akun
          </button>
        </form>
      </section>

      {/* Form Pengaturan Belajar */}
      <form action={formAction} className="space-y-6">
        {state.error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
            {state.error}
          </div>
        )}
        {state.saved && (
          <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
            <IconCheck className="h-4 w-4 shrink-0" />
            <span>Pengaturan belajar berhasil disimpan.</span>
          </div>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#111827] sm:p-6">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 dark:border-slate-800">
            <IconUser className="h-5 w-5 text-[#2563EB] dark:text-blue-400" />
            <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
              Identitas Pelajar
            </h2>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="display_name"
                className="mb-1.5 block text-xs font-bold tracking-wide text-slate-600 uppercase dark:text-slate-400"
              >
                Nama Panggilan
              </label>
              <input
                id="display_name"
                name="display_name"
                type="text"
                maxLength={60}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Mis. Andi Pratama"
                className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3.5 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-[#2563EB] focus:bg-white dark:border-slate-700 dark:bg-[#0B1120] dark:text-slate-100 dark:focus:border-blue-500"
              />
            </div>

            <div>
              <span className="mb-1.5 block text-xs font-bold tracking-wide text-slate-600 uppercase dark:text-slate-400">
                Email Akun
              </span>
              <div className="rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2.5 text-sm font-medium text-slate-500 dark:border-slate-800 dark:bg-[#0B1120]/60 dark:text-slate-400">
                {email ?? "Tidak tersedia"}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#111827] sm:p-6">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 dark:border-slate-800">
            <IconAward className="h-5 w-5 text-[#2563EB] dark:text-blue-400" />
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Target Level JLPT
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Menentukan materi belajar &amp; bank soal yang diprioritaskan di Dashboard.
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-5">
            {JLPT_LEVELS.map((lvl) => {
              const active = selectedLevel === lvl;
              return (
                <label
                  key={lvl}
                  className={`cursor-pointer rounded-xl border p-3 transition ${
                    active
                      ? "border-[#2563EB] bg-[#2563EB] text-white"
                      : "border-slate-200 bg-[#F8FAFC] text-slate-800 hover:border-slate-300 dark:border-slate-700 dark:bg-[#0B1120] dark:text-slate-200 dark:hover:border-slate-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="target_level"
                    value={lvl}
                    checked={active}
                    onChange={() => setSelectedLevel(lvl)}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-base font-extrabold">{LEVEL_META[lvl].title}</span>
                    {active && <IconCheck className="h-4 w-4" />}
                  </div>
                  <p
                    className={`mt-1 text-[11px] font-medium ${
                      active ? "text-blue-100" : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {LEVEL_META[lvl].subtitle}
                  </p>
                </label>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#111827] sm:p-6">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 dark:border-slate-800">
            <IconCalendar className="h-5 w-5 text-[#2563EB] dark:text-blue-400" />
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Batas Kartu Baru Harian (FSRS)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Jumlah kartu baru per hari di luar jadwal ulangan wajib (review).
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {LIMIT_PRESETS.map((preset) => {
                const active = dailyLimit === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setDailyLimit(preset)}
                    className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                      active
                        ? "bg-[#2563EB] text-white"
                        : "border border-slate-200 bg-[#F8FAFC] text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-[#0B1120] dark:text-slate-200"
                    }`}
                  >
                    {preset} kartu/hari
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <label
                htmlFor="daily_new_limit"
                className="text-xs font-bold text-slate-500 dark:text-slate-400"
              >
                Kustom:
              </label>
              <input
                id="daily_new_limit"
                name="daily_new_limit"
                type="number"
                min={1}
                max={100}
                value={dailyLimit}
                onChange={(e) => {
                  const parsed = Number.parseInt(e.target.value, 10);
                  setDailyLimit(Number.isNaN(parsed) ? 1 : Math.min(100, Math.max(1, parsed)));
                }}
                className="w-24 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-center text-sm font-bold text-slate-900 outline-none focus:border-[#2563EB] dark:border-slate-700 dark:bg-[#0B1120] dark:text-slate-100"
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60 sm:w-auto"
          >
            <IconCheck className="h-4 w-4" />
            {pending ? "Menyimpan..." : "Simpan Pengaturan"}
          </button>
        </div>
      </form>

      {/* Tautan ke Halaman Pengaturan (Mode Terang/Gelap & Audio) */}
      <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#111827] sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2563EB]/10 text-[#2563EB] dark:bg-blue-950/60 dark:text-blue-400">
            <IconSettings className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
              Pengaturan Tema &amp; Kecepatan Suara
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Mode Terang / Gelap dan kecepatan audio pelafalan diatur terpisah di halaman Pengaturan.
            </p>
          </div>
        </div>
        <Link
          href="/settings"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:border-[#2563EB] hover:text-[#2563EB] dark:border-slate-700 dark:bg-[#1E293B] dark:text-slate-200"
        >
          <span>Buka Pengaturan</span>
          <IconArrowRight className="h-3.5 w-3.5" />
        </Link>
      </section>
    </div>
  );
}
