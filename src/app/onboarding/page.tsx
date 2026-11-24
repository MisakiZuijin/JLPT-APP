import { Suspense } from "react";
import Link from "next/link";
import { ThemeToggleCompact } from "@/components/layout/ThemeToggle";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  IconArrowRight,
  IconCheck,
  IconCompass,
  IconLogOut,
  IconShieldCheck,
} from "@/components/ui/Icons";
import { requireShellContext } from "@/lib/auth-profile";
import { logout } from "@/app/login/actions";
import { completeOnboardingTemporary } from "./actions";

const UPCOMING_STEPS = [
  {
    num: "01",
    title: "Tujuan Belajar",
    desc: "Pilih jalur JLPT, Kerja/SSW Jepang, Kuliah, atau Umum.",
  },
  {
    num: "02",
    title: "Skrining Awal",
    desc: "Tentukan apakah mulai dari nol (Tahap 0 Kana) atau ikut tes penempatan.",
  },
  {
    num: "03",
    title: "Tes Penempatan 15 Soal",
    desc: "Deteksi otomatis level awal (Pra-N5 hingga N2) dengan 0 token AI.",
  },
  {
    num: "04",
    title: "Kontrak Belajar Harian",
    desc: "Atur durasi 15 / 30 / 60 menit per hari & target periode ujian.",
  },
];

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-canvas text-sm font-medium text-text-secondary">
          Menyiapkan halaman onboarding...
        </div>
      }
    >
      <OnboardingBridgeContent />
    </Suspense>
  );
}

async function OnboardingBridgeContent() {
  const { email, profile, isAdmin, onboardingSchemaReady } =
    await requireShellContext({ allowIncompleteOnboarding: true });

  const displayName = profile?.display_name ?? email ?? "Pelajar JLPT";

  return (
    <div className="min-h-screen bg-canvas text-text-primary">
      <header className="sticky top-0 z-20 border-b border-border-default bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-primary font-jp text-base font-bold text-brand-primary-fg">
              道
            </span>
            <div>
              <p className="font-heading text-sm font-bold leading-none text-text-primary">
                JLPT App · Persiapan Awal
              </p>
              <p className="mt-0.5 font-mono text-[10px] text-brand-primary">
                Onboarding Guard Aktif
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <ThemeToggleCompact />
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-xl border border-border-default bg-surface px-3 py-1.5 text-xs font-bold text-text-primary transition hover:bg-subtle"
              >
                <IconLogOut className="h-3.5 w-3.5" />
                <span>Keluar</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:py-10">
        <section className="rounded-3xl border border-border-default bg-surface p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge tone="primary" mono>
              FASE 2 · ONBOARDING GUARD TERPASANG
            </Badge>
            <Badge tone={onboardingSchemaReady ? "success" : "warning"} mono>
              {onboardingSchemaReady
                ? "Migrasi 0005 Aktif"
                : "Menunggu SQL 0005 di Supabase"}
            </Badge>
          </div>

          <h1 className="font-heading mt-4 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            Selamat datang, {displayName}!
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">
            Akun kamu telah terverifikasi dan diarahkan otomatis ke gerbang persiapan awal
            (<code>/onboarding</code>). Wizard interaktif 4 langkah &amp; Tes Penempatan 15 soal
            akan diaktifkan pada <strong>Fase 3</strong>.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {UPCOMING_STEPS.map((step) => (
              <div
                key={step.num}
                className="flex items-start gap-3 rounded-2xl border border-border-default bg-canvas p-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-primary-soft font-mono text-xs font-bold text-brand-primary">
                  {step.num}
                </span>
                <div className="min-w-0">
                  <p className="font-heading text-sm font-bold text-text-primary">
                    {step.title}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-text-secondary">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {!onboardingSchemaReady && (
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-brand-accent/40 bg-brand-accent-soft p-4 text-xs text-brand-accent-text">
              <IconCompass className="mt-0.5 h-4 w-4 shrink-0" />
              <p className="leading-relaxed">
                <strong>Catatan Admin/Developer:</strong> Jalankan{" "}
                <code>supabase/migrations/0005_onboarding_curriculum.sql</code> di Supabase SQL
                Editor untuk mengaktifkan kolom <code>onboarding_completed</code>, tabel unit
                kurikulum, dan log misi harian secara penuh.
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 border-t border-border-default pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-text-secondary">
              <IconShieldCheck className="h-4 w-4 text-brand-primary" />
              <span>Kamu tetap bisa mengulang tes penempatan kapan saja lewat /onboarding?retake=1</span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border-default bg-subtle px-4 py-2.5 text-xs font-bold text-text-primary transition hover:bg-canvas"
                >
                  Kembali ke Panel Admin
                </Link>
              )}
              <form action={completeOnboardingTemporary}>
                <Button type="submit" variant="cta" size="md">
                  <IconCheck className="h-4 w-4" />
                  <span>Masuk Beranda Belajar Sekarang</span>
                  <IconArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
