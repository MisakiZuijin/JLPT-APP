import Link from "next/link";
import { ThemeToggleCompact, ThemeToggleIcon } from "@/components/layout/ThemeToggle";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import {
  IconArrowRight,
  IconAward,
  IconBook,
  IconCalendar,
  IconCards,
  IconInfo,
  IconMic,
  IconPen,
  IconShieldCheck,
} from "@/components/ui/Icons";

const DESKTOP_PILLARS = [
  {
    eyebrow: "TAHAP 0 · PRA-N5",
    title: "92 Kana + Bunyi Khusus",
    desc: "Baca huruf Hiragana & Katakana, audio penutur asli, latihan goresan, hingga bisa membaca tanpa romaji.",
  },
  {
    eyebrow: "MATERI & KONJUGASI",
    title: "Penjelasan Bab & Latihan Pola",
    desc: "Pahami tata bahasa dalam Bahasa Indonesia, perubahan kata kerja, dan satuan hitung sebelum mengerjakan kuis.",
  },
  {
    eyebrow: "BICARA & PERCAKAPAN",
    title: "Latihan Ucap & Simulasi Dialog",
    desc: "Rekam suaramu dengan durasi otomatis sesuai panjang kalimat, latihan percakapan harian, dan etika kerja Jepang.",
  },
  {
    eyebrow: "EVALUASI & UJIAN",
    title: "Tes Harian & Simulasi JLPT N5–N1",
    desc: "Simulasi ujian berwaktu per bagian, penilaian transparan, serta buku catatan kesalahan otomatis.",
  },
];

const MOBILE_STEPS = [
  {
    num: "01",
    title: "Daftar & Cek Kemampuan Awal",
    desc: "Tentukan level awal belajarmu secara otomatis agar materi langsung pas.",
    accent: "primary" as const,
  },
  {
    num: "02",
    title: "Pelajari Penjelasan Tiap Bab",
    desc: "Pahami pola kalimat dengan bantuan bacaan yang menyesuaikan progresmu.",
    accent: "primary" as const,
  },
  {
    num: "03",
    title: "Hafalan Kartu, Tulis & Latihan Ucap",
    desc: "Latih ingatan, urutan goresan kanji, dan pengucapan suara secara rutin.",
    accent: "warning" as const,
  },
  {
    num: "04",
    title: "Tes Harian & Simulasi Ujian JLPT",
    desc: "Evaluasi progres tiap hari dan latih kesiapan menghadapi ujian N5–N1.",
    accent: "primary" as const,
  },
];

const CORE_MODULES = [
  {
    tag: "01 · MEMBACA",
    title: "Bacaan Bertingkat & Cara Baca",
    desc: "Teks pendek hingga artikel N5–N1 dengan bantuan furigana pintar. Ketuk kata untuk melihat arti dan simpan ke hafalan.",
    Icon: IconBook,
  },
  {
    tag: "02 · MENULIS",
    title: "Latihan Tulis Urutan Goresan",
    desc: "Lihat animasi urutan garis, jiplak langsung di layar, hingga mampu menulis huruf Kana dan Kanji secara mandiri.",
    Icon: IconPen,
  },
  {
    tag: "03 · PENGUCAPAN",
    title: "Latihan Bicara & Dialog Nyata",
    desc: "Dengar contoh penutur Jepang, rekam dan ulangi hingga tepat, dilengkapi skenario percakapan sehari-hari dan dunia kerja.",
    Icon: IconMic,
  },
  {
    tag: "04 · HAFALAN PINTAR",
    title: "Kartu Hafalan Terjadwal Otomatis",
    desc: "Uji ingatanmu sebelum kartu dijadwalkan ulang secara otomatis tepat sebelum kamu lupa.",
    Icon: IconCards,
  },
  {
    tag: "05 · TES HARIAN",
    title: "Evaluasi 20 Soal & Mendengarkan",
    desc: "Gabungan ulasan hafalan lama, materi baru, serta latihan mendengarkan audio setiap hari.",
    Icon: IconCalendar,
  },
  {
    tag: "06 · UJIAN JLPT",
    title: "Simulasi Ujian Berwaktu N5–N1",
    desc: "Format 3 bagian (Huruf & Kosakata, Tata Bahasa & Bacaan, Mendengarkan) lengkap dengan timer dan pembahasan.",
    Icon: IconAward,
  },
];

const PREVIEW_RATINGS = [
  { label: "Lupa", interval: "10 mnt", cls: "bg-[#BE123C] text-white" },
  { label: "Sulit", interval: "1 hari", cls: "bg-[#D97706] text-white" },
  { label: "Bisa", interval: "4 hari", cls: "bg-[#047857] text-white" },
  { label: "Mudah", interval: "12 hari", cls: "bg-[#0F766E] text-white" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-canvas text-text-primary">
      {/* DESKTOP VIEW (lg+) */}
      <div className="hidden lg:block">
        <header className="sticky top-0 z-20 border-b border-border-default bg-surface/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-8 py-4">
            <Link href="/" className="flex shrink-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-primary font-jp text-lg font-bold text-brand-primary-fg shadow-xs">
                道
              </span>
              <div className="whitespace-nowrap">
                <p className="font-heading text-lg font-bold leading-none tracking-tight text-text-primary">
                  JLPT App
                </p>
                <p className="mt-0.5 font-mono text-[10px] font-medium text-brand-primary">
                  Belajar Jepang N5–N1
                </p>
              </div>
            </Link>

            <nav className="flex items-center gap-6 text-sm font-semibold whitespace-nowrap text-text-secondary">
              <a href="#kurikulum" className="transition hover:text-brand-primary">
                Alur Belajar
              </a>
              <a href="#modul" className="transition hover:text-brand-primary">
                Fitur Utama
              </a>
              <Link href="/about" className="transition hover:text-brand-primary">
                Tentang &amp; Lisensi
              </Link>
            </nav>

            <div className="flex shrink-0 items-center gap-2.5">
              <ThemeToggleCompact />
              <ButtonLink href="/login" variant="outline" size="sm">
                Masuk
              </ButtonLink>
              <ButtonLink href="/login?mode=signup" variant="primary" size="sm">
                <span>Daftar Gratis</span>
                <IconArrowRight className="h-3.5 w-3.5" />
              </ButtonLink>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl space-y-14 px-8 py-12">
          <section className="grid items-center gap-10 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-7">
              <Badge tone="warning">
                GRATIS · UNTUK PELAJAR, MAHASISWA &amp; PERSIAPAN KERJA KE JEPANG
              </Badge>

              <h1 className="font-heading text-5xl font-bold leading-[1.12] tracking-tight text-text-primary">
                Kuasai Bahasa Jepang dari Nol hingga JLPT N1 Tanpa Bingung Mulai dari Mana
              </h1>

              <p className="max-w-xl text-base leading-relaxed text-text-secondary">
                Belajar bertahap mengikuti standar pelatihan bahasa Jepang: mulai dari huruf Kana,
                penjelasan bab, latihan menulis dan pengucapan, hafalan pintar, hingga simulasi
                ujian N5 sampai N1.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <ButtonLink href="/login?mode=signup" variant="cta" size="lg">
                  <span>Daftar Gratis &amp; Mulai Belajar</span>
                  <IconArrowRight className="h-4 w-4" />
                </ButtonLink>
                <ButtonLink href="/dashboard" variant="outline" size="lg">
                  <span>Buka Beranda Belajar</span>
                </ButtonLink>
              </div>

              <div className="flex flex-wrap items-center gap-5 pt-2 text-xs font-semibold text-text-secondary">
                <span className="inline-flex items-center gap-1.5">
                  <IconShieldCheck className="h-4 w-4 text-brand-primary" />
                  <span>100% Gratis Tanpa Batas Latihan</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <IconInfo className="h-4 w-4 text-brand-primary" />
                  <span>Latihan mandiri non-komersial dengan data kamus terbuka</span>
                </span>
              </div>
            </div>

            {/* Pratinjau Kartu Hafalan */}
            <div className="rounded-3xl border border-border-default bg-surface p-6 shadow-sm lg:col-span-5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] font-bold tracking-wide text-brand-primary uppercase">
                  CONTOH KARTU HAFALAN PINTAR
                </span>
                <Badge tone="neutral" mono>
                  N5 · Kosakata
                </Badge>
              </div>

              <div className="mt-4 rounded-2xl border border-border-default bg-canvas px-6 py-8 text-center">
                <p className="font-jp text-sm font-bold text-brand-primary">たべる</p>
                <p className="mt-1 font-jp text-5xl font-bold tracking-tight text-text-primary">
                  食べる
                </p>
                <p className="mt-3 text-lg font-bold text-text-primary">makan</p>
                <p className="mt-1 font-jp text-xs text-text-secondary">
                  Golongan 2 (一段) → 食べます / 食べて
                </p>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-2">
                {PREVIEW_RATINGS.map((r) => (
                  <div
                    key={r.label}
                    className={`rounded-xl px-2 py-2.5 text-center ${r.cls}`}
                  >
                    <p className="text-xs font-bold leading-none">{r.label}</p>
                    <p className="mt-1 font-mono text-[10px] opacity-90">{r.interval}</p>
                  </div>
                ))}
              </div>

              <p className="mt-3 text-center text-[11px] text-text-secondary">
                Jadwal ulang otomatis menyesuaikan seberapa mudah kamu mengingatnya
              </p>
            </div>
          </section>

          <section id="kurikulum" className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            {DESKTOP_PILLARS.map((pillar) => (
              <div
                key={pillar.eyebrow}
                className="rounded-2xl border border-border-default bg-surface p-5 transition hover:border-brand-primary/40"
              >
                <p className="font-mono text-[11px] font-bold tracking-wide text-brand-primary uppercase">
                  {pillar.eyebrow}
                </p>
                <h2 className="font-heading mt-2 text-base font-bold text-text-primary">
                  {pillar.title}
                </h2>
                <p className="mt-1.5 text-xs leading-relaxed text-text-secondary">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </section>

          <section id="modul" className="space-y-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-xs font-bold tracking-wider text-brand-primary uppercase">
                  LATIHAN LENGKAP 4 KETERAMPILAN
                </p>
                <h2 className="font-heading mt-1 text-2xl font-bold text-text-primary">
                  6 Modul Inti untuk Membantumu Naik Tingkat Terukur
                </h2>
              </div>
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:underline"
              >
                <span>Tentang &amp; Sumber Data</span>
                <IconArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
              {CORE_MODULES.map(({ tag, title, desc, Icon }) => (
                <div
                  key={tag}
                  className="flex flex-col justify-between rounded-2xl border border-border-default bg-surface p-5"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-lg bg-brand-primary-soft px-2.5 py-1 font-mono text-[10px] font-bold text-brand-primary">
                        {tag}
                      </span>
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-subtle text-brand-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                    </div>
                    <h3 className="font-heading mt-3.5 text-base font-bold text-text-primary">
                      {title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        <footer className="border-t border-border-default bg-surface py-6">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-8 text-xs text-text-secondary">
            <p>
              JLPT App · Latihan mandiri non-komersial · Bukan lembaga penerbit sertifikat resmi
              JLPT (Japan Foundation / JEES).
            </p>
            <div className="flex items-center gap-5 font-semibold text-text-primary">
              <Link href="/about" className="hover:text-brand-primary hover:underline">
                Tentang &amp; Lisensi
              </Link>
              <Link href="/login" className="hover:text-brand-primary hover:underline">
                Masuk
              </Link>
              <Link href="/login?mode=signup" className="hover:text-brand-primary hover:underline">
                Daftar Gratis
              </Link>
            </div>
          </div>
        </footer>
      </div>

      {/* MOBILE & TABLET VIEW (< lg) */}
      <div className="flex min-h-screen flex-col pb-28 lg:hidden">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border-default bg-surface/95 px-4 backdrop-blur sm:px-6">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-primary font-jp text-sm font-bold text-brand-primary-fg">
              道
            </span>
            <span className="font-heading text-base font-bold tracking-tight text-text-primary">
              JLPT App
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden sm:inline-flex">
              <ThemeToggleCompact />
            </span>
            <span className="sm:hidden">
              <ThemeToggleIcon />
            </span>
            <Link
              href="/login"
              className="inline-flex min-h-9 items-center rounded-full bg-subtle px-3.5 text-xs font-bold text-text-primary"
            >
              Masuk
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-xl flex-1 space-y-4 px-4 pt-5 sm:px-6">
          <section className="rounded-3xl bg-[#0F766E] p-5 text-white shadow-sm dark:border dark:border-[#2DD4BF]/25 dark:bg-[#122E2C]">
            <span className="inline-block rounded-full bg-[#115E59] px-3 py-1 font-mono text-[10px] font-bold tracking-wide text-[#CCFBF1] dark:bg-[#0E1418] dark:text-[#2DD4BF]">
              KURIKULUM TERARAH JLPT N5 → N1
            </span>
            <h1 className="font-heading mt-3 text-2xl font-bold leading-snug text-white">
              Belajar Bahasa Jepang Terarah dari Nol hingga Siap Ujian
            </h1>
            <p className="mt-2 text-xs leading-relaxed text-[#CCFBF1]">
              Pelajari huruf Kana, kosakata, tata bahasa, menulis goresan, pengucapan suara, hingga
              simulasi ujian JLPT dalam satu aplikasi.
            </p>
          </section>

          <section className="rounded-2xl border border-border-default bg-surface p-4">
            <p className="font-mono text-[11px] font-bold tracking-wide text-brand-primary uppercase">
              ALUR BELAJAR 4 LANGKAH
            </p>
            <div className="mt-3 space-y-3">
              {MOBILE_STEPS.map((s) => (
                <div key={s.num} className="flex items-start gap-3">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold ${
                      s.accent === "warning"
                        ? "bg-brand-accent-soft text-brand-accent-text"
                        : "bg-brand-primary-soft text-brand-primary"
                    }`}
                  >
                    {s.num}
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-xs font-bold text-text-primary">{s.title}</h2>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-text-secondary">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-border-default bg-surface p-3.5">
              <p className="font-heading text-sm font-bold text-brand-primary">100% Gratis</p>
              <p className="mt-1 text-[11px] leading-relaxed text-text-secondary">
                Akses semua materi &amp; latihan harian tanpa batas kuota.
              </p>
            </div>
            <Link
              href="/about"
              className="rounded-2xl border border-border-default bg-surface p-3.5 transition hover:border-brand-accent/50"
            >
              <p className="font-heading text-sm font-bold text-brand-accent">Lisensi Terbuka</p>
              <p className="mt-1 text-[11px] leading-relaxed text-text-secondary">
                Lihat atribusi kamus &amp; sumber data →
              </p>
            </Link>
          </section>
        </main>

        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border-default bg-surface/95 px-4 pt-3 pb-[calc(0.85rem+env(safe-area-inset-bottom))] backdrop-blur sm:px-6">
          <div className="mx-auto max-w-xl space-y-2 text-center">
            <ButtonLink href="/login?mode=signup" variant="cta" size="lg" fullWidth>
              <span>Daftar Gratis &amp; Mulai Belajar</span>
              <IconArrowRight className="h-4 w-4" />
            </ButtonLink>
            <p className="text-[10px] text-text-secondary">
              Latihan mandiri non-komersial · Bukan sertifikat resmi JLPT
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
