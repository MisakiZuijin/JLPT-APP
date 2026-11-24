import type { Metadata } from "next";
import Link from "next/link";
import { ThemeToggleCompact } from "@/components/layout/ThemeToggle";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import {
  IconAlert,
  IconArrowLeft,
  IconArrowRight,
  IconExternalLink,
  IconShieldCheck,
} from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Tentang & Atribusi Lisensi — JLPT App",
  description:
    "Penafian status non-sertifikasi JLPT/JFT-Basic, atribusi lisensi data terbuka (JMdict, KANJIDIC2, KanjiVG, Tatoeba, VOICEVOX), serta arsitektur 0 Token AI per pelajar.",
};

const OPEN_DATA_LICENSES = [
  {
    name: "JMdict / EDICT (EDRDG)",
    org: "Electronic Dictionary Research and Development Group",
    license: "CC BY-SA 4.0",
    tone: "primary" as const,
    usage: "Basis data kamus kosakata, bacaan kana, dan referensi makna bahasa Jepang.",
    url: "https://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project",
  },
  {
    name: "KANJIDIC2 (EDRDG)",
    org: "Electronic Dictionary Research and Development Group",
    license: "CC BY-SA 4.0",
    tone: "primary" as const,
    usage: "Metadata Kanji mencakup bacaan Onyomi/Kunyomi, jumlah goresan, dan klasifikasi level.",
    url: "https://www.edrdg.org/wiki/index.php/KANJIDIC_Project",
  },
  {
    name: "KanjiVG (Ulrich Apel)",
    org: "Kanji Vector Graphics Project",
    license: "CC BY-SA 3.0",
    tone: "primary" as const,
    usage: "Data vektor jalur SVG urutan goresan Hiragana, Katakana, dan Kanji pada modul menulis.",
    url: "https://kanjivg.tagaini.net/",
  },
  {
    name: "Tatoeba Corpus",
    org: "Tatoeba Community Project",
    license: "CC BY 2.0 FR",
    tone: "primary" as const,
    usage: "Korpus kalimat contoh kontekstual bahasa Jepang beserta padanan terjemahannya.",
    url: "https://tatoeba.org/",
  },
  {
    name: "VOICEVOX / Web Speech API",
    org: "Audio Pengucapan & Sintesis Suara",
    license: "Atribusi Suara",
    tone: "warning" as const,
    usage:
      "Audio pengucapan Web Speech API native browser (ja-JP) & dukungan opsional audio pra-generate VOICEVOX sesuai kredit karakter suara.",
    url: "https://voicevox.hiroshiba.jp/",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-canvas text-text-primary">
      {/* Shared Clean Responsive Top Bar */}
      <header className="sticky top-0 z-20 border-b border-border-default bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex min-h-9 items-center gap-1.5 rounded-xl px-2 py-1 text-xs font-bold text-brand-primary transition hover:bg-brand-primary-soft sm:text-sm"
          >
            <IconArrowLeft className="h-4 w-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-primary font-jp text-xs font-bold text-brand-primary-fg">
              道
            </span>
            <span className="font-heading text-sm font-bold text-text-primary">
              JLPT App · Tentang &amp; Kepatuhan Lisensi
            </span>
          </div>

          <ThemeToggleCompact />
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:space-y-8 lg:px-8 lg:py-10">
        {/* Heading */}
        <section className="space-y-2">
          <Badge tone="primary" mono>
            TRANSPARANSI &amp; KEPATUHAN HAK CIPTA · /about
          </Badge>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            Tentang JLPT App, Batasan Sertifikasi &amp; Atribusi Data Terbuka
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-text-secondary">
            JLPT App dibangun sebagai media latihan mandiri non-komersial untuk pembelajar bahasa
            Jepang di Indonesia (Tahap Pra-N5 hingga N1) dengan menghormati hak cipta ujian resmi
            dan seluruh lisensi sumber data terbuka.
          </p>
        </section>

        {/* Non-Certification Disclaimer Card */}
        <section
          aria-labelledby="non-cert-title"
          className="rounded-2xl border border-brand-accent/45 bg-brand-accent-soft p-5 sm:p-6"
        >
          <div className="flex items-start gap-3.5">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-accent/20 text-brand-accent-text">
              <IconAlert className="h-5 w-5" />
            </span>
            <div className="space-y-2">
              <h2
                id="non-cert-title"
                className="font-mono text-xs font-bold tracking-wide text-brand-accent-text uppercase sm:text-sm"
              >
                PENAFIAN RESMI · BUKAN LEMBAGA PENERBIT SERTIFIKAT JLPT / JFT-BASIC
              </h2>
              <p className="text-xs leading-relaxed text-brand-accent-text/95 sm:text-sm">
                JLPT App adalah platform latihan kesiapan mandiri (<em>mock readiness</em>) dan{" "}
                <strong>tidak berafiliasi</strong> dengan Japan Foundation, Japan Educational
                Exchanges and Services (JEES), maupun penyelenggara resmi JFT-Basic. Kelulusan unit,
                skor tes harian, dan hasil simulasi ujian di aplikasi ini{" "}
                <strong>bukan sertifikat resmi</strong>.
              </p>
              <p className="text-xs leading-relaxed text-brand-accent-text/90">
                Seluruh soal latihan, teks bacaan, dan dialog Kaiwa disusun 100% orisinal tanpa
                menyalin soal resmi ujian maupun buku cetak berhak cipta. Informasi resmi jadwal,
                durasi, dan ambang kelulusan ujian selalu merujuk{" "}
                <a
                  href="https://www.jlpt.jp/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-bold underline"
                >
                  <span>https://www.jlpt.jp/</span>
                  <IconExternalLink className="h-3 w-3" />
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        {/* Open Data Attribution List (Desktop Rows / Mobile Stacked Cards) */}
        <section className="rounded-3xl border border-border-default bg-surface p-5 sm:p-7">
          <div className="space-y-1">
            <p className="font-mono text-[11px] font-bold tracking-wider text-brand-primary uppercase">
              ATRIBUSI SUMBER DATA TERBUKA &amp; LISENSI RESMI (5 SUMBER)
            </p>
            <h2 className="font-heading text-lg font-bold text-text-primary sm:text-xl">
              Sumber Data Kamus, Kanji, Urutan Goresan &amp; Korpus Kalimat
            </h2>
          </div>

          <div className="mt-5 space-y-3">
            {OPEN_DATA_LICENSES.map((item) => (
              <div
                key={item.name}
                className="flex flex-col gap-3 rounded-2xl border border-border-default bg-canvas p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-heading text-sm font-bold text-text-primary sm:text-base">
                      {item.name}
                    </h3>
                    <span className="text-[11px] text-text-secondary">— {item.org}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-text-secondary">{item.usage}</p>
                </div>

                <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end">
                  <Badge tone={item.tone} mono>
                    {item.license}
                  </Badge>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-8 items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-brand-primary transition hover:bg-brand-primary-soft"
                  >
                    <span>Sumber</span>
                    <IconExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Zero Token Architecture Banner */}
        <section className="flex flex-col justify-between gap-4 rounded-2xl border border-brand-primary/30 bg-brand-primary-soft p-5 sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-primary text-brand-primary-fg">
              <IconShieldCheck className="h-5 w-5" />
            </span>
            <div className="space-y-1">
              <p className="font-heading text-sm font-bold text-brand-primary">
                Arsitektur Hemat Token: 0 Token AI per Pelajar
              </p>
              <p className="text-xs leading-relaxed text-text-secondary">
                Seluruh latihan harian, penempatan awal, FSRS, dan simulasi ujian berjalan dari bank
                data lokal dan database Supabase yang dikurasi Admin (/admin). Pelajar tidak pernah
                terkena batas kuota API AI.
              </p>
            </div>
          </div>

          <ButtonLink href="/login?mode=signup" variant="primary" size="md" className="shrink-0">
            <span>Mulai Belajar</span>
            <IconArrowRight className="h-4 w-4" />
          </ButtonLink>
        </section>
      </main>
    </div>
  );
}
