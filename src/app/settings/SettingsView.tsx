"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { useTheme, type ThemeMode } from "@/components/layout/ThemeProvider";
import {
  readSpeechRate,
  saveSpeechRate,
  speakJapanese,
  subscribeSpeechRate,
  type SpeechRate,
} from "@/lib/audio";
import {
  IconArrowRight,
  IconCheck,
  IconMonitor,
  IconMoon,
  IconSettings,
  IconSun,
  IconUser,
  IconVolume,
} from "@/components/ui/Icons";

const THEME_OPTIONS: {
  value: ThemeMode;
  title: string;
  desc: string;
  Icon: typeof IconSun;
}[] = [
  {
    value: "light",
    title: "Mode Terang (Washi)",
    desc: "Latar kertas terang #F8FAFC yang nyaman untuk belajar di ruangan terang.",
    Icon: IconSun,
  },
  {
    value: "dark",
    title: "Mode Gelap (Malam)",
    desc: "Latar biru malam #0B1120 untuk mengurangi silau saat belajar malam hari.",
    Icon: IconMoon,
  },
  {
    value: "system",
    title: "Ikuti Sistem",
    desc: "Menyesuaikan tema Windows, macOS, atau ponsel Anda secara otomatis.",
    Icon: IconMonitor,
  },
];

const SPEECH_SPEEDS: { value: SpeechRate; label: string; desc: string }[] = [
  { value: 0.75, label: "0.75x Lambat", desc: "Cocok untuk pemula N5" },
  { value: 0.85, label: "0.85x Standar", desc: "Jelas & seimbang" },
  { value: 1.0, label: "1.0x Alami", desc: "Tempo bicara penutur asli" },
];

type SettingsViewProps = {
  isPreviewMode: boolean;
};

export function SettingsView({ isPreviewMode }: SettingsViewProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const speechRate = useSyncExternalStore<SpeechRate>(
    subscribeSpeechRate,
    readSpeechRate,
    () => 0.85,
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold tracking-wider text-[#2563EB] uppercase dark:text-blue-400">
            Preferensi Aplikasi
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            Pengaturan &amp; Tampilan
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Seluruh pengaturan mode terang/gelap dan audio pelafalan dipusatkan di halaman ini.
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-200">
          <IconSettings className="h-4 w-4 text-[#2563EB] dark:text-blue-400" />
          Tema Aktif: {resolvedTheme === "dark" ? "Gelap" : "Terang"}
        </span>
      </div>

      {/* Pilihan Light / Dark / System Mode */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#111827] sm:p-6">
        <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
            Tampilan Layar (Light Mode &amp; Dark Mode)
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Perubahan tema tersimpan otomatis di perangkat ini dan langsung berlaku di seluruh halaman.
          </p>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {THEME_OPTIONS.map(({ value, title, desc, Icon }) => {
            const active = theme === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setTheme(value)}
                aria-pressed={active}
                className={`flex flex-col items-start rounded-2xl border p-4 text-left transition ${
                  active
                    ? "border-[#2563EB] bg-[#2563EB] text-white"
                    : "border-slate-200 bg-[#F8FAFC] text-slate-800 hover:border-[#2563EB]/60 dark:border-slate-700 dark:bg-[#0B1120] dark:text-slate-100 dark:hover:border-blue-500"
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-white text-[#2563EB] dark:bg-[#1E293B] dark:text-blue-400"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  {active && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold text-white">
                      <IconCheck className="h-3 w-3" />
                      Aktif
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm font-extrabold">{title}</p>
                <p
                  className={`mt-1 text-xs leading-relaxed ${
                    active ? "text-blue-100" : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {desc}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Kecepatan Audio Bahasa Jepang */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#111827] sm:p-6">
        <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
              Kecepatan Audio Pelafalan (ja-JP)
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Digunakan di Papan Kana Interaktif dan Sesi Hafalan Flashcard.
            </p>
          </div>

          <button
            type="button"
            onClick={() => speakJapanese("おはようございます。今日も頑張りましょう。", speechRate)}
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#0F172A] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-slate-800 dark:bg-[#2563EB] dark:hover:bg-blue-700"
          >
            <IconVolume className="h-4 w-4" />
            Uji Suara Jepang
          </button>
        </div>

        <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
          {SPEECH_SPEEDS.map(({ value, label, desc }) => {
            const active = speechRate === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => saveSpeechRate(value)}
                aria-pressed={active}
                className={`rounded-xl border p-3.5 text-left transition ${
                  active
                    ? "border-[#2563EB] bg-[#2563EB]/10 text-[#2563EB] dark:border-blue-500 dark:bg-blue-950/60 dark:text-blue-300"
                    : "border-slate-200 bg-[#F8FAFC] text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-[#0B1120] dark:text-slate-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold">{label}</span>
                  {active && <IconCheck className="h-4 w-4" />}
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{desc}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Tautan ke Profil & Target JLPT */}
      <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#111827] sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2563EB]/10 text-[#2563EB] dark:bg-blue-950/60 dark:text-blue-400">
            <IconUser className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
              Profil, Target Level JLPT &amp; Batas Kartu Harian
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {isPreviewMode
                ? "Mode Pratinjau aktif: isi konfigurasi Supabase di .env.local untuk mengaktifkan pengaturan akun & target level."
                : "Ubah nama panggilan, target ujian N5–N1, dan batas kartu baru harian di halaman Profil."}
            </p>
          </div>
        </div>

        <Link
          href={isPreviewMode ? "/login?setup=1" : "/profile"}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:border-[#2563EB] hover:text-[#2563EB] dark:border-slate-700 dark:bg-[#1E293B] dark:text-slate-200"
        >
          <span>{isPreviewMode ? "Panduan Setup Akun" : "Buka Halaman Profil"}</span>
          <IconArrowRight className="h-3.5 w-3.5" />
        </Link>
      </section>
    </div>
  );
}
