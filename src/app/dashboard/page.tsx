import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { AppShell } from "@/components/layout/AppShell";
import {
  IconAlert,
  IconArrowRight,
  IconAward,
  IconBook,
  IconCalendar,
  IconCards,
  IconExam,
  IconFlame,
  IconGlobe,
  IconMessage,
  IconMic,
  IconPen,
  IconPuzzle,
} from "@/components/ui/Icons";
import { requireShellContext } from "@/lib/auth-profile";
import { createClient } from "@/lib/supabase/server";
import { logout } from "../login/actions";

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] text-sm font-medium text-slate-500 dark:bg-[#0B1120] dark:text-slate-400">
          Memuat beranda belajar...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  await connection();
  const { userId, email, isAdmin, profile, dueCount } = await requireShellContext();
  const supabase = await createClient();

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [{ count: learnedCount }, { count: todayReviews }] = await Promise.all([
    supabase
      .from("user_cards")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("state", 2),
    supabase
      .from("review_logs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("reviewed_at", startOfDay.toISOString()),
  ]);

  const targetLevel = profile?.target_level ?? "N5";
  const dailyLimit = profile?.daily_new_limit ?? 10;
  const displayName = profile?.display_name ?? email ?? "Pelajar JLPT";

  const stats = [
    {
      label: "Perlu Diulang Hari Ini",
      value: dueCount,
      valueCls: "text-[#2563EB] dark:text-[#60A5FA]",
    },
    {
      label: "Sudah Kamu Kuasai",
      value: learnedCount ?? 0,
      valueCls: "text-[#059669] dark:text-[#34D399]",
    },
    {
      label: "Selesai Dilatih Hari Ini",
      value: todayReviews ?? 0,
      valueCls: "text-[#2563EB] dark:text-[#60A5FA]",
    },
    {
      label: "Target Baru / Hari",
      value: dailyLimit,
      valueCls: "text-[#0F172A] dark:text-[#F8FAFC]",
    },
  ];

  const activeModules = [
    {
      href: "/review",
      badge: dueCount > 0 ? `SIAP DIPAKAI · ${dueCount} KARTU` : "SIAP DIPAKAI",
      title: "Hafalan Kartu Pintar",
      desc: "Ulangi kosakata & kanji agar cepat ingat sebelum lupa.",
      Icon: IconCards,
    },
    {
      href: "/kana",
      badge: "SIAP DIPAKAI · KANA LENGKAP",
      title: "Tabel Hiragana & Katakana",
      desc: "Pelajari bentuk, romaji, dan suara huruf dasar Jepang.",
      Icon: IconBook,
    },
    {
      href: "/reading",
      badge: "BARU · TAHAP 2",
      title: "Bacaan + Furigana N5–N1",
      desc: "Baca teks bertingkat, ketuk kata untuk cek arti, simpan ke FSRS & kuis.",
      Icon: IconBook,
    },
    {
      href: "/writing",
      badge: "SIAP DIPAKAI · TAHAP 2",
      title: "Latihan Menulis Goresan",
      desc: "Lihat animasi urutan goresan KanjiVG, jiplak panduan & tulis sendiri.",
      Icon: IconPen,
    },
    {
      href: "/pronunciation",
      badge: "BARU · TAHAP 3",
      title: "Latihan Ngomong (3–5x)",
      desc: "Dengar contoh penutur asli, rekam suara & nilai pelafalan (≥ 85%).",
      Icon: IconMic,
    },
    {
      href: "/kaiwa",
      badge: "BARU · TAHAP 3",
      title: "Kaiwa Roleplay Situasional",
      desc: "Simulasi percakapan di konbini, perkenalan diri, stasiun & kerja.",
      Icon: IconMessage,
    },
    {
      href: "/culture",
      badge: "SIAP DIPAKAI · TAHAP 3",
      title: "Budaya & Etika Kerja Jepang",
      desc: "Pelajari Hou-Ren-Sou, sudut Ojigi 15°–45°, & frasa kerja penting.",
      Icon: IconGlobe,
    },
    {
      href: "/daily-test",
      badge: "BARU · TAHAP 4",
      title: "Tes Harian (20 Soal)",
      desc: "Gabungan 50% SRS, 30% materi baru & 20% audio mendengarkan.",
      Icon: IconCalendar,
    },
    {
      href: "/exam",
      badge: "BARU · TAHAP 4",
      title: "Simulasi Ujian JLPT N5–N1",
      desc: "Latihan berwaktu per bagian, tanda Ragu, batas lulus & pembahasan.",
      Icon: IconExam,
    },
    {
      href: "/bunpou",
      badge: "BARU · TAHAP 4",
      title: "Bunpou Builder (Pola Kalimat)",
      desc: "Rangkai pola kalimat N5–N2 dan bandingkan ragam sopan vs kasual.",
      Icon: IconPuzzle,
    },
    {
      href: "/mistakes",
      badge: "BARU · TAHAP 4",
      title: "Buku Catatan Kesalahan",
      desc: "Daftar otomatis soal yang sering salah agar mudah diulas ulang.",
      Icon: IconAlert,
    },
  ];

  const upcomingModules = [
    {
      badge: "TAHAP 5 · BERIKUTNYA",
      title: "Peta Bab Kurikulum & Bank Penuh",
      desc: "Import massal JMdict, KANJIDIC2, Tatoeba & peta bab mingguan.",
      Icon: IconAward,
    },
  ];

  return (
    <AppShell
      activeTab="beranda"
      displayName={displayName}
      targetLevel={targetLevel}
      dueCount={dueCount}
      isAdmin={isAdmin}
      logoutAction={logout}
    >
      <div className="space-y-6">
        {/* Greeting Header */}
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              おかえりなさい！ Selamat datang kembali,
            </p>
            <h1 className="mt-0.5 text-2xl font-bold sm:text-3xl">
              Halo, {displayName}!
            </h1>
          </div>

          <Link
            href="/profile"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#D97706] px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-[#B45309]"
          >
            <IconFlame className="h-3.5 w-3.5" />
            <span>Target {targetLevel} · Kuota {dailyLimit}/hari</span>
          </Link>
        </header>

        {/* Primary Daily Mission Banner */}
        <section className="rounded-2xl bg-[#0F172A] p-6 text-white dark:border-2 dark:border-[#2563EB] dark:bg-[#111827]">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div className="space-y-2">
              <span className="inline-block rounded-md bg-[#2563EB] px-2.5 py-1 text-[11px] font-bold text-white dark:bg-[#1E3A8A] dark:text-[#DBEAFE]">
                MULAI DARI SINI HARI INI
              </span>
              <h2 className="text-lg font-bold sm:text-xl">
                {dueCount > 0
                  ? `${dueCount} Kartu Perlu Diulang + ${dailyLimit} Kata Baru Siap Dipelajari`
                  : `Target Hari Ini: Pelajari ${dailyLimit} Kartu Baru Level ${targetLevel}`}
              </h2>
              <p className="text-xs text-slate-300 sm:text-sm">
                Cukup 8–15 menit sehari supaya hafalan kosakata &amp; kanji menempel lama.
              </p>
            </div>
            <Link
              href="/review"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1D4ED8]"
            >
              <span>Mulai Hafalan</span>
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* 4 KPI Summary Cards */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-[#111827]"
            >
              <p className={`text-2xl font-bold sm:text-3xl ${s.valueCls}`}>{s.value}</p>
              <p className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                {s.label}
              </p>
            </div>
          ))}
        </section>

        {/* Module Grid */}
        <section id="ujian" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold sm:text-lg">Pilih Menu Latihanmu</h2>
            <Link
              href="/profile"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#2563EB] hover:underline dark:text-[#60A5FA]"
            >
              <IconCalendar className="h-3.5 w-3.5" />
              <span>Atur Target Level</span>
            </Link>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {activeModules.map(({ href, badge, title, desc, Icon }) => (
              <Link
                key={title}
                href={href}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-[#2563EB] dark:border-slate-800 dark:bg-[#111827] dark:hover:border-[#60A5FA]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-md bg-[#2563EB] px-2.5 py-1 text-[10px] font-bold text-white">
                      {badge}
                    </span>
                    <Icon className="h-4 w-4 text-[#2563EB] dark:text-[#60A5FA]" />
                  </div>
                  <h3 className="mt-3 text-base font-bold group-hover:text-[#2563EB] dark:group-hover:text-[#60A5FA]">
                    {title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {desc}
                  </p>
                </div>
              </Link>
            ))}

            {upcomingModules.map(({ badge, title, desc, Icon }) => (
              <div
                key={title}
                aria-disabled="true"
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 opacity-75 dark:border-slate-800 dark:bg-[#111827]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-md bg-[#475569] px-2.5 py-1 text-[10px] font-bold text-white dark:bg-slate-700">
                      {badge}
                    </span>
                    <Icon className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                  </div>
                  <h3 className="mt-3 text-base font-bold">{title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
