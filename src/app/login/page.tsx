"use client";

import { useActionState, useState } from "react";
import { login, signup, type AuthState } from "./actions";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [state, action, pending] = useActionState<AuthState, FormData>(
    mode === "login" ? login : signup,
    {}
  );

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 py-16">
      <h1 className="text-center text-2xl font-bold">
        {mode === "login" ? "Masuk" : "Daftar Akun"}
      </h1>

      <form action={action} className="mt-8 space-y-4">
        <input name="email" type="email" required placeholder="Email"
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2" />
        <input name="password" type="password" required minLength={6} placeholder="Password (min. 6)"
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2" />

        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
        {state.message && <p className="text-sm text-emerald-700">{state.message}</p>}

        <button disabled={pending}
          className="w-full rounded-lg bg-rose-600 py-2 font-medium text-white hover:bg-rose-700 disabled:opacity-60">
          {pending ? "Memproses..." : mode === "login" ? "Masuk" : "Daftar"}
        </button>
      </form>

      <button onClick={() => setMode(mode === "login" ? "signup" : "login")}
        className="mt-4 text-sm text-slate-600 underline">
        {mode === "login" ? "Belum punya akun? Daftar" : "Sudah punya akun? Masuk"}
      </button>
    </main>
  );
}
