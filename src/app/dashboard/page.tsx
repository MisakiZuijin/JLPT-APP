import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { JLPT_LEVELS, type Profile } from "@/lib/types";
import { logout } from "../login/actions";
import { updateSettings } from "./actions";

export default function DashboardPage() {
  return (
    <Suspense fallback={<p className="p-10 text-center text-slate-500">Memuat dashboard...</p>}>
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const nowIso = new Date().toISOString();
  const [{ data: profile }, { count: dueCount }, { count: learnedCount }, { count: todayReviews }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single<Profile>(),
      supabase.from("user_cards").select("*", { count: "exact", head: true }).lte("due", nowIso),
      supabase.from("user_cards").select("*", { count: "exact", head: true }).gte("state", 2),
      supabase.from("review_logs").select("*", { count: "exact", head: true })
        .gte("reviewed_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
    ]);

  const stats = [
    { label: "Jatuh tempo", value: dueCount ?? 0 },
    { label: "Sudah dikuasai", value: learnedCount ?? 0 },
    { label: "Review hari ini", value: todayReviews ?? 0 },
  ];

  const modules = [
    { href: "/review", icon: "🧠", title: "Review SRS", desc: "Hafalan kosakata, kanji & kana", ready: true },
    { href: "/kana", icon: "あ", title: "Tabel Kana", desc: "Hiragana dengan romaji", ready: true },
    { href: "#", icon: "✍️", title: "Menulis", desc: "Fase 2", ready: false },
    { href: "#", icon: "🗣️", title: "Pengucapan", desc: "Fase 3", ready: false },
    { href: "#", icon: "📅", title: "Daily Test", desc: "Fase 4", ready: false },
    { href: "#", icon: "🎓", title: "Ujian JLPT", desc: "Fase 4", ready: false },
  ];

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">おかえりなさい！</p>
          <h1 className="text-2xl font-bold">{profile?.display_name ?? user.email}</h1>
        </div>
        <form action={logout}>
          <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-white">Keluar</button>
        </form>
      </header>

      <section className="mt-8 grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm">
            <p className="text-3xl font-bold text-rose-600">{s.value}</p>
            <p className="text-sm text-slate-600">{s.label}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">Pengaturan Belajar</h2>
        <form action={updateSettings} className="mt-3 flex flex-wrap items-end gap-4">
          <label className="text-sm">
            Level target
            <select name="target_level" defaultValue={profile?.target_level ?? "N5"}
              className="mt-1 block rounded-lg border border-slate-300 px-3 py-2">
              {JLPT_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </label>
          <label className="text-sm">
            Kartu baru / hari
            <input name="daily_new_limit" type="number" min={0} max={100}
              defaultValue={profile?.daily_new_limit ?? 10}
              className="mt-1 block w-28 rounded-lg border border-slate-300 px-3 py-2" />
          </label>
          <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white">Simpan</button>
        </form>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((m) => (
          <Link key={m.title} href={m.href}
            className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition ${
              m.ready ? "hover:-translate-y-0.5 hover:shadow-md" : "pointer-events-none opacity-50"}`}>
            <div className="text-3xl">{m.icon}</div>
            <h3 className="mt-2 font-semibold">{m.title}</h3>
            <p className="text-sm text-slate-600">{m.desc}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
