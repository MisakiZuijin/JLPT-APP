"use client";

import { Suspense, useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { IconArrowLeft, IconArrowRight } from "@/components/ui/Icons";
import {
  login,
  resendConfirmation,
  signup,
  type AuthState,
  type ResendState,
} from "./actions";

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
    {}
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
        window.location.pathname + window.location.search
      );
    }
  }, []);

  const showResend =
    showResendOverride || Boolean(authError) || Boolean(state.unconfirmedEmail);

  return (
    <div className="w-full max-w-md space-y-5">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full bg-[#E2E8F0] px-3.5 py-1.5 text-xs font-semibold text-[#0F172A] transition hover:bg-slate-300 dark:bg-[#1E293B] dark:text-[#F8FAFC] dark:hover:bg-slate-700"
        >
          <IconArrowLeft className="h-3.5 w-3.5" />
          <span>Beranda</span>
        </Link>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-[#111827]">
        <div className="mb-5 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB] font-jp text-base font-bold text-white">
            日
          </span>
          <div>
            <p className="text-base font-bold leading-tight">JLPT App</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Mulai belajar bahasa Jepang terarah
            </p>
          </div>
        </div>

        {/* Segmented Solid Tabs */}
        <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-[#E2E8F0] p-1 dark:bg-[#1E293B]">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`rounded-lg py-2 text-xs font-bold transition sm:text-sm ${
              mode === "login"
                ? "bg-[#2563EB] text-white"
                : "text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            }`}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`rounded-lg py-2 text-xs font-bold transition sm:text-sm ${
              mode === "signup"
                ? "bg-[#2563EB] text-white"
                : "text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            }`}
          >
            Daftar Baru
          </button>
        </div>

        <h1 className="mt-5 text-xl font-bold">
          {mode === "login" ? "Masuk ke Akun Belajarmu" : "Buat Akun Belajar Gratis"}
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {mode === "login"
            ? "Progres hafalan kartu, target level, dan streak tersimpan otomatis."
            : "Gratis untuk siswa SMK, mahasiswa, maupun pemula."}
        </p>

        {needsSetup && (
          <div className="mt-4 rounded-xl bg-[#FEF3C7] px-3.5 py-2.5 text-xs font-semibold text-[#92400E] dark:bg-amber-950/60 dark:text-amber-200">
            Pengaturan Supabase (.env.local) belum diisi. Isi URL dan key Supabase terlebih dahulu
            untuk mengaktifkan login dan database.
          </div>
        )}

        {authError === "otp_expired" && (
          <div className="mt-4 rounded-xl bg-[#FEE2E2] px-3.5 py-2.5 text-xs font-semibold text-[#991B1B] dark:bg-red-950/60 dark:text-red-200">
            Tautan verifikasi email sudah kedaluwarsa atau sudah pernah dibuka. Kirim ulang tautan
            verifikasi baru melalui formulir di bawah.
          </div>
        )}

        {authError && authError !== "otp_expired" && (
          <div className="mt-4 rounded-xl bg-[#FEE2E2] px-3.5 py-2.5 text-xs font-semibold text-[#991B1B] dark:bg-red-950/60 dark:text-red-200">
            Verifikasi email gagal diproses. Silakan kirim ulang tautan verifikasi baru melalui
            formulir di bawah.
          </div>
        )}

        {verified === "cross_device" && (
          <div className="mt-4 rounded-xl bg-[#D1FAE5] px-3.5 py-2.5 text-xs font-semibold text-[#065F46] dark:bg-emerald-950/60 dark:text-emerald-200">
            Email berhasil terverifikasi! Karena tautan dibuka di browser atau perangkat berbeda,
            silakan masuk menggunakan email dan kata sandi kamu.
          </div>
        )}

        <form action={action} className="mt-5 space-y-3.5">
          {mode === "signup" && (
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Nama Lengkap / Panggilan
              <input
                name="display_name"
                type="text"
                placeholder="Contoh: Budi Santoso"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-[#F1F5F9] px-4 py-3 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] dark:border-slate-700 dark:bg-[#1E293B] dark:text-[#F8FAFC]"
              />
            </label>
          )}

          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Email
            <input
              name="email"
              type="email"
              required
              placeholder="nama@email.com"
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-[#F1F5F9] px-4 py-3 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] dark:border-slate-700 dark:bg-[#1E293B] dark:text-[#F8FAFC]"
            />
          </label>

          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Kata Sandi (minimal 6 karakter)
            <input
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-[#F1F5F9] px-4 py-3 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] dark:border-slate-700 dark:bg-[#1E293B] dark:text-[#F8FAFC]"
            />
          </label>

          {state.error && (
            <p className="rounded-xl bg-[#FEE2E2] px-3.5 py-2.5 text-xs font-semibold text-[#991B1B] dark:bg-red-950/60 dark:text-red-200">
              {state.error}
            </p>
          )}
          {state.message && (
            <p className="rounded-xl bg-[#D1FAE5] px-3.5 py-2.5 text-xs font-semibold text-[#065F46] dark:bg-emerald-950/60 dark:text-emerald-200">
              {state.message}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] py-3.5 text-sm font-bold text-white transition hover:bg-[#1D4ED8] disabled:opacity-60"
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

        <div className="mt-5 border-t border-slate-200 pt-4 dark:border-slate-800">
          {!showResend ? (
            <button
              type="button"
              onClick={() => setShowResendOverride(true)}
              className="w-full text-center text-xs font-semibold text-[#2563EB] hover:underline dark:text-blue-400"
            >
              Belum menerima email verifikasi? Kirim ulang
            </button>
          ) : (
            <form action={resendAction} className="space-y-3">
              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Kirim Ulang Tautan Verifikasi
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
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
                  className="w-full rounded-xl border border-slate-200 bg-[#F1F5F9] px-3.5 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#2563EB] dark:border-slate-700 dark:bg-[#1E293B] dark:text-[#F8FAFC]"
                />
                <button
                  type="submit"
                  disabled={resendPending}
                  className="shrink-0 rounded-xl bg-[#0F172A] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 disabled:opacity-60 dark:bg-[#1E293B] dark:hover:bg-slate-700"
                >
                  {resendPending ? "Mengirim..." : "Kirim Ulang"}
                </button>
              </div>

              {resendState.error && (
                <p className="rounded-xl bg-[#FEE2E2] px-3.5 py-2 text-xs font-semibold text-[#991B1B] dark:bg-red-950/60 dark:text-red-200">
                  {resendState.error}
                </p>
              )}
              {resendState.message && (
                <p className="rounded-xl bg-[#D1FAE5] px-3.5 py-2 text-xs font-semibold text-[#065F46] dark:bg-emerald-950/60 dark:text-emerald-200">
                  {resendState.message}
                </p>
              )}
            </form>
          )}
        </div>
      </div>

      <p className="text-center text-xs text-slate-500 dark:text-slate-400">
        Tampilan Light / Dark Mode dapat diatur kapan saja di halaman{" "}
        <Link href="/settings" className="font-semibold text-[#2563EB] hover:underline dark:text-blue-400">
          Pengaturan
        </Link>
        .
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-[#F8FAFC] px-4 py-10 dark:bg-[#0B1120]">
      <Suspense fallback={<p className="text-sm text-slate-500">Memuat halaman masuk...</p>}>
        <AuthCard />
      </Suspense>
    </main>
  );
}
