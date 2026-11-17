import Link from "next/link";

const features = [
  { icon: "📖", title: "Membaca", desc: "Teks dengan furigana & romaji otomatis" },
  { icon: "✍️", title: "Menulis", desc: "Latihan urutan goresan kana & kanji" },
  { icon: "🗣️", title: "Pengucapan", desc: "Ulangi 3–5x sampai pengucapan sempurna" },
  { icon: "🧠", title: "Hafalan (SRS)", desc: "Algoritma FSRS — review di waktu yang tepat" },
  { icon: "📅", title: "Daily Test", desc: "Tes harian sesuai level N5–N1 kamu" },
  { icon: "🎓", title: "Ujian JLPT", desc: "Simulasi ujian lengkap dengan timer" },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <section className="text-center">
        <p className="text-6xl font-bold tracking-tight">日本語</p>
        <h1 className="mt-4 text-3xl font-bold">Belajar Bahasa Jepang N5 → N1</h1>
        <p className="mt-3 text-slate-600">
          Satu aplikasi untuk membaca, menulis, berbicara, menghafal, dan bersiap ujian JLPT.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/login" className="rounded-lg bg-rose-600 px-6 py-3 font-medium text-white hover:bg-rose-700">
            Mulai Belajar
          </Link>
          <Link href="/dashboard" className="rounded-lg border border-slate-300 px-6 py-3 font-medium hover:bg-white">
            Dashboard
          </Link>
        </div>
      </section>

      <section className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-3xl">{f.icon}</div>
            <h3 className="mt-2 font-semibold">{f.title}</h3>
            <p className="text-sm text-slate-600">{f.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
