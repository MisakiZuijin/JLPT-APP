import Link from "next/link";
import {
  IconArrowRight,
  IconAward,
  IconBook,
  IconCalendar,
  IconCards,
  IconMic,
  IconPen,
} from "@/components/ui/Icons";

const STEPS = [
  {
    step: "LANGKAH 1",
    title: "Kenali Huruf Kana",
    desc: "Pelajari Hiragana & Katakana beserta bunyi aslinya.",
  },
  {
    step: "LANGKAH 2",
    title: "Baca & Tulis Goresan",
    desc: "Latihan baca teks furigana dan menulis kanji rapi.",
  },
  {
    step: "LANGKAH 3",
    title: "Hafalan & Ngomong",
    desc: "Kartu hafalan otomatis + rekam suara 3–5x.",
  },
  {
    step: "LANGKAH 4",
    title: "Tes Harian & Ujian JLPT",
    desc: "Uji kemampuanmu setiap hari & simulasi N5–N1.",
  },
];

const FEATURES = [
  {
    tag: "01 · MEMBACA",
    title: "Bacaan + Cara Baca Otomatis",
    desc: "Teks pendek sampai artikel. Nyalakan furigana atau romaji, ketuk kata untuk melihat arti, lalu jawab kuis.",
    Icon: IconBook,
  },
  {
    tag: "02 · MENULIS",
    title: "Latihan Tulis Urutan Goresan",
    desc: "Lihat animasi urutan garis, jiplak di layar HP atau laptop, sampai bisa tulis kanji sendiri tanpa panduan.",
    Icon: IconPen,
  },
  {
    tag: "03 · NGOMONG",
    title: "Latihan Pengucapan 3–5x",
    desc: "Dengar suara penutur Jepang, rekam suaramu, dan ulang 3–5x hingga pelafalan tepat.",
    Icon: IconMic,
  },
  {
    tag: "04 · HAFALAN PINTAR",
    title: "Flashcard Pengingat Otomatis",
    desc: "Kosakata, kanji, dan tata bahasa dijadwalkan ulang otomatis tepat sebelum kamu lupa.",
    Icon: IconCards,
  },
  {
    tag: "05 · TES HARIAN",
    title: "Kuis Harian 20 Soal Otomatis",
    desc: "Soal gabungan hafalan lama, materi baru, dan audio mendengarkan sesuai level targetmu.",
    Icon: IconCalendar,
  },
  {
    tag: "06 · UJIAN JLPT",
    title: "Simulasi Ujian Resmi N5–N1",
    desc: "Latihan ujian lengkap (Kosakata & Kanji, Tata Bahasa & Bacaan, serta Listening) pakai timer asli.",
    Icon: IconAward,
  },
];

const PREVIEW_RATINGS = [
  { label: "Lupa", cls: "bg-[#DC2626]" },
  { label: "Sulit", cls: "bg-[#D97706]" },
  { label: "Bisa", cls: "bg-[#059669]" },
  { label: "Mudah", cls: "bg-[#2563EB]" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] dark:bg-[#0B1120] dark:text-[#F8FAFC]">
      {/* Navbar */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-[#111827]/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB] font-jp text-base font-bold text-white">
              日
            </span>
            <span className="text-lg font-bold tracking-tight">JLPT App</span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex dark:text-slate-300">
            <a href="#alur" className="hover:text-[#0F172A] dark:hover:text-white">
              Cara Kerja
            </a>
            <a href="#fitur" className="hover:text-[#0F172A] dark:hover:text-white">
              Fitur Belajar
            </a>
            <Link href="/kana" className="hover:text-[#0F172A] dark:hover:text-white">
              Tabel Kana
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-xl bg-[#E2E8F0] px-3.5 py-2 text-xs font-bold text-[#0F172A] transition hover:bg-slate-300 sm:text-sm dark:bg-[#1E293B] dark:text-[#F8FAFC] dark:hover:bg-slate-700"
            >
              Masuk
            </Link>
            <Link
              href="/login?mode=signup"
              className="rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#1D4ED8] sm:text-sm"
            >
              Daftar Gratis
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6 sm:py-12">
        {/* Hero */}
        <section className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="space-y-5 lg:col-span-7">
            <span className="inline-block rounded-full bg-[#0F172A] px-3.5 py-1.5 text-[11px] font-bold tracking-wide text-white dark:bg-[#1E3A8A] dark:text-[#DBEAFE]">
              GRATIS · UNTUK ANAK SMK, MAHASISWA &amp; PEMULA
            </span>
            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
              Belajar Bahasa Jepang dari Nol Sampai Siap JLPT.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Cocok untuk persiapan kerja ke Jepang, kuliah, atau belajar mandiri. Mulai dari
              huruf Hiragana–Katakana, latihan tulis &amp; ngomong, hafalan pintar, hingga
              simulasi ujian N5–N1.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/login?mode=signup"
                className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#1D4ED8]"
              >
                <span>Mulai Belajar Gratis</span>
                <IconArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-[#0F172A] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 dark:border dark:border-slate-700 dark:bg-[#1E293B] dark:hover:bg-slate-700"
              >
                <span>Buka Beranda Belajar</span>
              </Link>
            </div>
          </div>

          {/* Flashcard Preview */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-5 dark:border-slate-800 dark:bg-[#111827]">
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-full bg-[#2563EB] px-3 py-1 text-[11px] font-bold text-white">
                CONTOH KARTU · N5
              </span>
              <span className="text-xs font-bold text-[#059669] dark:text-[#34D399]">
                Hafalan Terjadwal Otomatis
              </span>
            </div>

            <div className="mt-4 rounded-2xl bg-[#F1F5F9] px-5 py-7 text-center dark:bg-[#1E293B]">
              <p className="font-jp text-5xl font-bold">食べる</p>
              <p className="mt-2 font-jp text-sm text-slate-600 dark:text-slate-300">
                たべる (taberu)
              </p>
              <p className="mt-2 text-lg font-bold">makan</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                ご飯を食べる。(Makan nasi.)
              </p>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2">
              {PREVIEW_RATINGS.map((r) => (
                <div
                  key={r.label}
                  className={`rounded-lg py-2 text-center text-xs font-bold text-white ${r.cls}`}
                >
                  {r.label}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4 Step Flow */}
        <section
          id="alur"
          className="rounded-3xl bg-[#0F172A] p-6 text-white sm:p-8 dark:border dark:border-slate-800 dark:bg-[#111827]"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold sm:text-xl">
              Alur Belajar 4 Langkah (Mudah Dipahami Pemula)
            </h2>
            <span className="text-xs font-medium text-slate-300">
              Cukup 10–15 menit setiap hari
            </span>
          </div>

          <div className="mt-5 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div
                key={s.step}
                className="rounded-2xl bg-[#1E293B] p-4 dark:border dark:border-slate-700/60"
              >
                <span className="inline-block rounded-md bg-[#2563EB] px-2.5 py-1 text-[10px] font-bold text-white">
                  {s.step}
                </span>
                <h3 className="mt-3 text-sm font-bold text-white">{s.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-300">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 6 Core Features */}
        <section id="fitur" className="space-y-4">
          <h2 className="text-xl font-bold sm:text-2xl">
            6 Fitur Utama untuk Membantumu Cepat Bisa
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ tag, title, desc, Icon }) => (
              <div
                key={tag}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#111827]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-md bg-[#0F172A] px-2.5 py-1 text-[10px] font-bold text-white dark:bg-[#1E293B] dark:text-[#60A5FA]">
                      {tag}
                    </span>
                    <span className="rounded-lg bg-[#F1F5F9] p-1.5 text-slate-700 dark:bg-[#1E293B] dark:text-slate-300">
                      <Icon className="h-4 w-4" />
                    </span>
                  </div>
                  <h3 className="mt-3 text-base font-bold">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-5 dark:border-slate-800 dark:bg-[#111827]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 text-xs text-slate-500 sm:px-6 dark:text-slate-400">
          <p>JLPT App · Belajar Bahasa Jepang N5–N1 Gratis untuk Pelajar &amp; Pemula</p>
          <div className="flex items-center gap-4 font-semibold text-slate-700 dark:text-slate-200">
            <Link href="/login" className="hover:underline">
              Masuk
            </Link>
            <Link href="/login?mode=signup" className="hover:underline">
              Daftar Gratis
            </Link>
            <Link href="/kana" className="hover:underline">
              Tabel Kana
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
