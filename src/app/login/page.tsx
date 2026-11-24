"use client";

import { Suspense, useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ThemeToggleCompact } from "@/components/layout/ThemeToggle";
import { Badge } from "@/components/ui/Badge";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconShieldCheck,
} from "@/components/ui/Icons";
import {
  login,
  resendConfirmation,
  signup,
  type AuthState,
  type ResendState,
} from "./actions";

const ONBOARDING_HIGHLIGHTS = [
  "Verifikasi email cepat dan aman dari perangkat mana saja",
  "Penentuan level awal otomatis agar materi sesuai kemampuanmu",
  "Bantuan cara baca (Romaji & Furigana) yang menyesuaikan progres",
  "Misi belajar harian terarah, kartu hafalan pintar, dan simulasi JLPT",
];

function AuthCard() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const needsSetup = searchParams.get("setup") === "1";
  const authError = searchParams.get("auth_error");
  const verified = searchParams.get("verified");

  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [showResendOverride, setShowResendOverride] = useState(false);

  const [state, action, pending] = useActionState<AuthState, FormData>(
    mode === "login" ? login : signup,
    {},
  );
  const [resendState, resendAction, resendPending] = useActionState<
    ResendState,
    FormData
  >(resendConfirmation, {});

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash.includes("error=")) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }
  }, []);

  const showResend =
    showResendOverride || Boolean(authError) || Boolean(state.unconfirmedEmail);

  return (
    <div className="mx-auto grid w-full max-w-5xl items-center gap-8 lg:grid-cols-12">
      {/* Panel kiri khusus Desktop */}
      <aside className="hidden flex-col justify-between rounded-3xl bg-[#0F766E] p-8 text-white shadow-sm lg:col-span-6 lg:flex lg:min-h-[590px] dark:border dark:border-[#2DD4BF]/20 dark:bg-[#122E2C]">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 font-jp text-lg font-bold text-white">
                道
              </span>
              <div>
                <p className="font-heading text-base font-bold leading-none text-white">
                  JLPT App
                </p>
                <p className="mt-1 font-mono text-[11px] text-[#CCFBF1]">
                  Kurikulum Bahasa Jepang N5–N1
                </p>
              </div>
            </Link>

            <span className="rounded-full bg-[#115E59] px-3 py-1 font-mono text-[11px] font-bold text-[#CCFBF1] dark:bg-[#0E1418] dark:text-[#2DD4BF]">
              100% Gratis
            </span>
          </div>

          <div className="space-y-3 pt-2">
            <h2 className="font-heading text-3xl font-bold leading-tight text-white">
              Satu Akun, Alur Belajar Terstruktur dari Kana sampai JLPT N1
            </h2>
            <p className="text-sm leading-relaxed text-[#CCFBF1]">
              Setelah masuk pertama kali, sistem membantu mengatur target belajar dan level awalmu
              agar latihan harian selalu pas dengan ritmemu.
            </p>
          </div>

          <ul className="space-y-3 pt-2">
            {ONBOARDING_HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-white/95">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15 text-[#CCFBF1]">
                  <IconCheck className="h-3.5 w-3.5" />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-[#115E59]/80 p-4 text-xs text-[#CCFBF1] dark:bg-[#0E1418]/70">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 font-bold text-white">
              <IconShieldCheck className="h-4 w-4 text-[#2DD4BF]" />
              <span>Latihan Mandiri Non-Sertifikasi</span>
            </span>
            <Link href="/about" className="font-bold text-white underline">
              Tentang &amp; Lisensi →
            </Link>
          </div>
          <p className="mt-1.5 leading-relaxed opacity-90">
            Menggunakan data kamus dan urutan goresan terbuka dari JMdict, KANJIDIC2, KanjiVG, dan
            Tatoeba untuk mendukung belajar mandirimu.
          </p>
        </div>
      </aside>

      {/* Kartu Login / Daftar */}
      <section className="mx-auto w-full max-w-md space-y-4 lg:col-span-6 lg:max-w-none">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-border-default bg-surface px-3.5 py-1.5 text-xs font-bold text-text-primary transition hover:bg-subtle"
          >
            <IconArrowLeft className="h-3.5 w-3.5" />
            <span>Beranda</span>
          </Link>
          <ThemeToggleCompact />
        </div>

        <div className="rounded-3xl border border-border-default bg-surface p-6 shadow-sm sm:p-8">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-primary font-jp text-base font-bold text-brand-primary-fg">
                道
              </span>
              <div>
                <p className="font-heading text-base font-bold leading-tight text-text-primary">
                  JLPT App
                </p>
                <p className="text-xs text-text-secondary">
                  Mulai belajar bahasa Jepang terarah
                </p>
              </div>
            </div>
            <Badge tone="primary" mono className="lg:hidden">
              N5–N1
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-1.5 rounded-xl border border-border-default bg-subtle p-1">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`min-h-10 cursor-pointer rounded-lg text-xs font-bold transition sm:text-sm ${
                mode === "login"
                  ? "bg-brand-primary text-brand-primary-fg shadow-xs"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`min-h-10 cursor-pointer rounded-lg text-xs font-bold transition sm:text-sm ${
                mode === "signup"
                  ? "bg-brand-primary text-brand-primary-fg shadow-xs"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Daftar Baru
            </button>
          </div>

          <h1 className="font-heading mt-5 text-xl font-bold text-text-primary sm:text-2xl">
            {mode === "login" ? "Masuk ke Akun Belajarmu" : "Buat Akun Belajar Gratis"}
          </h1>
          <p className="mt-1 text-xs leading-relaxed text-text-secondary">
            {mode === "login"
              ? "Progres hafalan, materi belajar, dan catatan latihanmu tersimpan otomatis."
              : "Gratis untuk siswa SMK, mahasiswa, persiapan kerja ke Jepang, maupun pemula."}
          </p>

          {needsSetup && (
            <div className="mt-4 rounded-xl border border-brand-accent/40 bg-brand-accent-soft px-3.5 py-2.5 text-xs font-semibold text-brand-accent-text">
              Layanan akun belum tersedia saat ini. Silakan coba beberapa saat lagi atau hubungi
              pengelola aplikasi.
            </div>
          )}

          {authError === "otp_expired" && (
            <div className="mt-4 rounded-xl border border-semantic-danger/30 bg-semantic-danger-soft px-3.5 py-2.5 text-xs font-semibold text-semantic-danger">
              Tautan verifikasi email sudah kedaluwarsa atau sudah pernah dibuka. Kirim ulang tautan
              verifikasi baru melalui formulir di bawah.
            </div>
          )}

          {authError && authError !== "otp_expired" && (
            <div className="mt-4 rounded-xl border border-semantic-danger/30 bg-semantic-danger-soft px-3.5 py-2.5 text-xs font-semibold text-semantic-danger">
              Verifikasi email gagal diproses. Silakan kirim ulang tautan verifikasi baru melalui
              formulir di bawah.
            </div>
          )}

          {verified === "cross_device" && (
            <div className="mt-4 rounded-xl border border-semantic-success/30 bg-semantic-success-soft px-3.5 py-2.5 text-xs font-semibold text-semantic-success">
              Email berhasil terverifikasi! Karena tautan dibuka di browser atau perangkat berbeda,
              silakan masuk menggunakan email dan kata sandi kamu.
            </div>
          )}

          <form action={action} className="mt-5 space-y-3.5">
            {mode === "signup" && (
              <label className="block text-xs font-bold text-text-primary">
                Nama Lengkap / Panggilan
                <input
                  name="display_name"
                  type="text"
                  placeholder="Contoh: Raka Pratama"
                  className="mt-1.5 min-h-12 w-full rounded-xl border border-border-default bg-subtle px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/60 focus:border-brand-primary focus:bg-surface"
                />
              </label>
            )}

            <label className="block text-xs font-bold text-text-primary">
              Email
              <input
                name="email"
                type="email"
                required
                placeholder="nama@email.com"
                className="mt-1.5 min-h-12 w-full rounded-xl border border-border-default bg-subtle px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/60 focus:border-brand-primary focus:bg-surface"
              />
            </label>

            <label className="block text-xs font-bold text-text-primary">
              Kata Sandi (minimal 6 karakter)
              <input
                name="password"
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                className="mt-1.5 min-h-12 w-full rounded-xl border border-border-default bg-subtle px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/60 focus:border-brand-primary focus:bg-surface"
              />
            </label>

            {state.error && (
              <p className="rounded-xl border border-semantic-danger/30 bg-semantic-danger-soft px-3.5 py-2.5 text-xs font-semibold text-semantic-danger">
                {state.error}
              </p>
            )}
            {state.message && (
              <p className="rounded-xl border border-semantic-success/30 bg-semantic-success-soft px-3.5 py-2.5 text-xs font-semibold text-semantic-success">
                {state.message}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="mt-2 inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-brand-cta py-3.5 text-sm font-bold text-brand-cta-fg transition hover:bg-brand-cta-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span>
                {pending
                  ? "Memproses..."
                  : mode === "login"
                    ? "Masuk & Lanjut Belajar"
                    : "Daftar Akun Gratis"}
              </span>
              {!pending && <IconArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <div className="mt-5 border-t border-border-default pt-4">
            {!showResend ? (
              <button
                type="button"
                onClick={() => setShowResendOverride(true)}
                className="w-full cursor-pointer text-center text-xs font-bold text-brand-primary hover:underline"
              >
                Belum menerima email verifikasi? Kirim ulang
              </button>
            ) : (
              <form action={resendAction} className="space-y-3">
                <div>
                  <p className="text-xs font-bold text-text-primary">
                    Kirim Ulang Tautan Verifikasi
                  </p>
                  <p className="mt-0.5 text-[11px] text-text-secondary">
                    Masukkan email yang kamu daftarkan untuk mengirim tautan verifikasi baru.
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    key={state.unconfirmedEmail ?? "resend"}
                    name="email"
                    type="email"
                    required
                    defaultValue={state.unconfirmedEmail ?? ""}
                    placeholder="nama@email.com"
                    className="min-h-11 w-full rounded-xl border border-border-default bg-subtle px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-brand-primary focus:bg-surface"
                  />
                  <button
                    type="submit"
                    disabled={resendPending}
                    className="min-h-11 shrink-0 cursor-pointer rounded-xl bg-brand-primary px-4 py-2.5 text-xs font-bold text-brand-primary-fg transition hover:bg-brand-primary-hover disabled:opacity-60"
                  >
                    {resendPending ? "Mengirim..." : "Kirim Ulang"}
                  </button>
                </div>

                {resendState.error && (
                  <p className="rounded-xl border border-semantic-danger/30 bg-semantic-danger-soft px-3.5 py-2 text-xs font-semibold text-semantic-danger">
                    {resendState.error}
                  </p>
                )}
                {resendState.message && (
                  <p className="rounded-xl border border-semantic-success/30 bg-semantic-success-soft px-3.5 py-2 text-xs font-semibold text-semantic-success">
                    {resendState.message}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-text-secondary">
          Informasi lisensi data terbuka &amp; status non-sertifikasi tersedia di halaman{" "}
          <Link href="/about" className="font-bold text-brand-primary hover:underline">
            Tentang &amp; Lisensi
          </Link>
          .
        </p>
      </section>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-canvas px-4 py-8 sm:px-6 lg:py-12">
      <Suspense
        fallback={
          <p className="text-sm font-medium text-text-secondary">Memuat halaman masuk...</p>
        }
      >
        <AuthCard />
      </Suspense>
    </main>
  );
}
