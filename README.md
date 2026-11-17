# JLPT App — Belajar Bahasa Jepang N5 → N1

Aplikasi belajar bahasa Jepang: membaca, menulis, pengucapan (3–5x pengulangan),
hafalan SRS (FSRS), daily test, dan simulasi ujian JLPT.

📚 **Dokumentasi lengkap & roadmap:** lihat folder [`docs/`](./docs/README.md)
([PLAN](./docs/PLAN.md) · [ARCHITECTURE](./docs/ARCHITECTURE.md) · [FEATURES](./docs/FEATURES.md) · [TOOLS](./docs/TOOLS.md))

## Tech Stack
- **Next.js 16** (App Router, TypeScript, Tailwind CSS 4)
- **Supabase** — Postgres, Auth, Storage (free tier)
- **ts-fsrs** — algoritma spaced repetition
- **wanakana** — konversi kana ↔ romaji

## Setup

1. Buat project gratis di https://supabase.com
2. Buka **SQL Editor**, jalankan berurutan:
   - `supabase/migrations/0001_init.sql`
   - `supabase/seed.sql`
3. Salin env:
   ```bash
   cp .env.local.example .env.local
   ```
   Isi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   (Project Settings → API).
4. (Opsional, untuk dev) Supabase → Authentication → Providers → Email →
   matikan **Confirm email** agar bisa langsung login setelah daftar.
5. Jalankan:
   ```bash
   npm install
   npm run dev
   ```
   Buka http://localhost:3000

## Struktur
```
src/
  proxy.ts                 # refresh session + proteksi route
  lib/
    supabase/{client,server}.ts
    srs.ts                 # wrapper FSRS
    types.ts
  app/
    page.tsx               # landing
    login/                 # login & daftar
    dashboard/             # statistik + pengaturan level
    review/                # sesi review SRS
    kana/                  # tabel hiragana/katakana
supabase/
  migrations/0001_init.sql
  seed.sql
```

## Roadmap
- [x] **Fase 1** — Auth, profil & level, SRS (FSRS), seed kana + N5
- [ ] **Fase 2** — Menulis (KanjiVG stroke order), Membaca (furigana kuroshiro)
- [ ] **Fase 3** — Pengucapan: TTS (VOICEVOX/Web Speech) + STT (Whisper), skor & 3–5x ulang
- [ ] **Fase 4** — Daily test (cron) + simulasi ujian JLPT N5–N1
- [ ] **Fase 5** — Import data penuh (JMdict, KANJIDIC2, Tatoeba) N5–N1
