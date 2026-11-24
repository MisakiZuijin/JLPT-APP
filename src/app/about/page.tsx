import type { Metadata } from "next";
import Link from "next/link";
import { ThemeToggleCompact, ThemeToggleIcon } from "@/components/layout/ThemeToggle";
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
    "Penafian status non-sertifikasi JLPT/JFT-Basic serta atribusi lisensi sumber data terbuka (JMdict, KANJIDIC2, KanjiVG, Tatoeba, VOICEVOX).",
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
    usage: "Data vektor urutan goresan Hiragana, Katakana, dan Kanji pada modul latihan menulis.",
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
    name: "VOICEVOX / Audio Browser",
    org: "Sintesis Suara Pengucapan Jepang",
    license: "Atribusi Suara",
    tone: "warning" as const,
    usage:
      "Audio pengucapan bahasa Jepang langsung dari perangkat serta dukungan opsional audio VOICEVOX sesuai ketentuan kredit karakter suara.",
    url: "https://voicevox.hiroshiba.jp/",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-canvas text-text-primary">
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
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-primary font-jp text-xs font-bold text-brand-primary-fg">
              道
            </span>
            <span className="font-heading text-sm font-bold text-text-primary">
              JLPT App · Tentang &amp; Lisensi
            </span>
          </div>

          <span className="hidden sm:inline-flex">
            <ThemeToggleCompact />
          </span>
          <span className="sm:hidden">
            <ThemeToggleIcon />
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:space-y-8 lg:px-8 lg:py-10">
        <section className="space-y-2">
          <Badge tone="primary">TENTANG &amp; LISENSI DATA TERBUKA</Badge>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            Tentang JLPT App, Batasan Sertifikasi &amp; Sumber Data Terbuka
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-text-secondary">
            JLPT App dibangun sebagai media latihan mandiri non-komersial untuk pembelajar bahasa
            Jepang di Indonesia (tingkat pemula hingga N1) dengan menghormati hak cipta ujian resmi
            dan seluruh lisensi sumber data terbuka.
          </p>
        </section>

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
                JLPT App adalah platform latihan kesiapan mandiri dan{" "}
                <strong>tidak berafiliasi</strong> dengan Japan Foundation, Japan Educational
                Exchanges and Services (JEES), maupun penyelenggara resmi JFT-Basic. Kelulusan bab,
                skor tes harian, dan hasil simulasi ujian di aplikasi ini{" "}
                <strong>bukan sertifikat resmi</strong>.
              </p>
              <p className="text-xs leading-relaxed text-brand-accent-text/90">
                Seluruh soal latihan, teks bacaan, dan dialog disusun secara orisinal tanpa menyalin
                soal resmi ujian maupun buku cetak berhak cipta. Informasi resmi jadwal, durasi, dan
                ambang kelulusan ujian selalu merujuk{" "}
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

        <section className="rounded-3xl border border-border-default bg-surface p-5 sm:p-7">
          <div className="space-y-1">
            <p className="font-mono text-[11px] font-bold tracking-wider text-brand-primary uppercase">
              ATRIBUSI SUMBER DATA TERBUKA &amp; LISENSI RESMI
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

        <section className="flex flex-col justify-between gap-4 rounded-2xl border border-brand-primary/30 bg-brand-primary-soft p-5 sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-primary text-brand-primary-fg">
              <IconShieldCheck className="h-5 w-5" />
            </span>
            <div className="space-y-1">
              <p className="font-heading text-sm font-bold text-brand-primary">
                Akses Belajar Gratis Tanpa Batas Latihan
              </p>
              <p className="text-xs leading-relaxed text-text-secondary">
                Seluruh latihan harian, kartu hafalan, latihan menulis, pengucapan, dan simulasi
                ujian dapat diakses gratis kapan saja untuk membantu persiapan belajar mandirimu.
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
