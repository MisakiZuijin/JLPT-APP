# Panduan & Urutan Fase Implementasi v2 (`JLPT App`)

Dokumen ini adalah **daftar periksa eksekusi tunggal (*single execution playbook*)** untuk mengimplementasikan seluruh rancangan **Design System v2**, **Alur Kurikulum Formal (Onboarding + Roadmap + Lesson View)**, **FSRS 2-Tahap**, **Rekaman Suara Adaptif `5/10/15 dtk` Anti-Noise**, serta **Pengisian Materi Penuh** secara berurutan tanpa kerja dua kali (*zero rework*) dan tanpa kode berantakan.

---

## 1. Patokan Wajib Dibaca Sebelum Menulis Kode

Setiap kali memulai fase baru (baik dikerjakan manual maupun bersama AI agent), **wajib baca referensi berikut terlebih dahulu** agar arsitektur, warna, dan perilaku sistem tidak melenceng:

### A. File Rancangan & Arsitektur Sistem (Repo)

| File | Fungsi Patokan | Kapan Wajib Dibaca |
| :--- | :--- | :--- |
| [AGENTS.md](../AGENTS.md) | Aturan wajib Next.js 16 (baca `node_modules/next/dist/docs/` sebelum menulis API/konvensi baru) | **Semua Fase** |
| [DESIGN_SYSTEM_V2.md](./DESIGN_SYSTEM_V2.md) | Palet *Seiji Washi* (Light) & *Yoru Night* (Dark), token Tailwind v4 `@theme` & `@custom-variant dark`, tipografi, pemisahan Desktop vs Mobile | **Fase 1, 3, 4, 5** |
| [design/jlpt-app-v2.figcraft](../design/jlpt-app-v2.figcraft) | Acuan visual penuh (**18 halaman · 44 layar** Desktop `1440×960` & Mobile `390×844` + **30 Master Components**). Inspeksi via **FigCraft MCP** sebelum menyusun UI | **Fase 1, 3, 4, 5** |
| [LEARNING_FLOW_AND_CURRICULUM.md](./LEARNING_FLOW_AND_CURRICULUM.md) | Alur Register/Callback/Onboarding, 15 soal Placement Test, Silabus Tahap 0–5, Romaji Weaning & Smart Furigana, FSRS 2-Tahap, Voice `5/10/15 dtk` + Anti-Noise, Skema DB `0005`, & Kepatuhan Lisensi | **Semua Fase** |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Konvensi folder, pola Server Components + `<Suspense>`, Supabase RLS, aturan 0 Token AI/pelajar, & SVG-only | **Semua Fase** |
| [FEATURES.md](./FEATURES.md) | Spesifikasi modul per fitur (Reading, Writing KanjiVG, Pronunciation, FSRS, Daily Test, JLPT Exam) | **Fase 5, 6** |
| [TOOLS.md](./TOOLS.md) | Sumber dataset terbuka & kewajiban lisensi (`JMdict`, `KANJIDIC2`, `KanjiVG`, `Tatoeba`, `VOICEVOX`) | **Fase 1 (`/about`), Fase 6** |

### B. Referensi Dokumentasi Library via Context7 MCP & Docs Lokal

Gunakan **Context7 MCP** (`resolve-library-id` → `query-docs`) — dan `node_modules/next/dist/docs/` khusus untuk Next.js 16 — sebelum memakai API library berikut:

| Library / Framework | Topik yang Wajib Diverifikasi | Dipakai di Fase |
| :--- | :--- | :--- |
| **Next.js 16** (`node_modules/next/dist/docs/` + Context7 `/vercel/next.js`) | Cache Components (`use cache` / `await connection()`), `<Suspense>` boundary, `src/proxy.ts` (pengganti `middleware.ts`), `next/font/google`, Server Actions & `redirect()` | **Fase 1, 2, 3, 4** |
| **Tailwind CSS v4** (Context7 `/tailwindlabs/tailwindcss.com`) | `@theme` CSS variables, `@custom-variant dark (&:where(.dark, .dark *))`, utility spacing/typography terbaru | **Fase 1, 5** |
| **Supabase SSR** (Context7 `/supabase/supabase`) | `@supabase/ssr` cookie refresh di `proxy.ts`, `supabase.auth.getUser()` (jangan `getSession()`), RLS policies & migration SQL | **Fase 2, 3, 4** |
| **ts-fsrs** (Context7 / docs `ts-fsrs`) | Penjadwalan kartu `Rating.Again / Hard / Good / Easy`, preview interval estimasi tiap tombol sebelum klik | **Fase 5** |

### C. Skill & Tool Lokal yang Digunakan

| Skill / Tool | Lokasi / Cara Pakai | Tujuan |
| :--- | :--- | :--- |
| **`ui-ux-pro-max`** | [`.agents/skills/ui-ux-pro-max/SKILL.md`](../.agents/skills/ui-ux-pro-max/SKILL.md) & `references/pro-rules.md` | Menjaga kontras WCAG AA+ Light/Dark, *touch target* ≥ 44–48px, tipografi, fokus aksesibilitas, dan kerapian interaksi |
| **FigCraft MCP** | Buka `design/jlpt-app-v2.figcraft` (`open_file`, `inspect_document`, `get_node`) | Memastikan implementasi komponen & layout Desktop (`D0–D6`) vs Mobile (`M0–M6`) presisi terhadap rancangan |
| **Browser Subagent** | Verifikasi visual di `http://localhost:3000` pada viewport `1440×900` (Desktop) & `390×844` (Mobile) | Memastikan 0 error console, 0 overflow horizontal, 0 tabrakan layout Desktop/Mobile, dan Dark Mode *Yoru Night* kontras bersih |

---

## 2. Aturan Anti-Berantakan (*Non-Negotiable Guardrails*)

1. **Jangan campur tampilan Desktop dan Mobile jadi satu komponen kaku**: Desktop (`lg:` ke atas) memakai struktur *Studio* (sidebar `256px`, multi-kolom, panel referensi samping); Mobile (`< lg`) memakai struktur *Companion* (Bottom Nav 5 tab, 1 fokus per layar, *Pocket Lesson* bertab, *Bottom Sheet*, & *Thumb Mic Dock*).
2. **Nol Emoji Unicode di `src/`**: Seluruh ikon UI wajib berupa komponen SVG di [src/components/ui/Icons.tsx](../src/components/ui/Icons.tsx).
3. **Arsitektur 0 Token AI per Pelajar**: Gemini API (`src/lib/ai/gemini-questions.ts`) **hanya** boleh dipanggil dari `/admin` oleh akun `role === "admin"`.
4. **Kepatuhan Next.js 16 & Keamanan Auth**:
   - Gunakan `await supabase.auth.getUser()` (bukan `getSession()`).
   - Bungkus pembacaan data dinamis/sesi di Server Component dalam `<Suspense>` + `await connection()`.
   - Semua tabel user baru di Supabase wajib memakai RLS `auth.uid() = user_id`.
5. **Satu Fase = Satu Commit Bersih**: Jangan pindah ke fase berikutnya sebelum lulus *Definition of Done* fase aktif (`npx tsc --noEmit`, `npm run build`, dan cek visual Desktop + Mobile).

---

## 3. Baseline yang Sudah Selesai (Tidak Perlu Dikerjakan Ulang)

- [x] **Fondasi Aplikasi v1** (`4f57c3f`): 17 rute awal, FSRS dasar, KanjiVG 36 karakter, Reading/Writing/Pronunciation/Kaiwa/Culture/Bunpou/Daily Test/Exam/Mistakes/Admin Gemini.
- [x] **Perencanaan Kurikulum & Design System v2** (`6ca9656`): `docs/LEARNING_FLOW_AND_CURRICULUM.md`, `docs/DESIGN_SYSTEM_V2.md`, & `design/jlpt-app-v2.figcraft` (44 layar + 30 Master Components).
- [x] **Auth Callback, Confirm & Isolasi Redirect Admin** (`ae12860`): `src/app/auth/confirm/route.ts`, `src/app/auth/callback/route.ts`, `src/lib/supabase/site-url.ts`, isolasi login admin di `src/app/login/*` & `src/proxy.ts`.

---

## 4. Urutan Eksekusi 6 Fase Implementasi

### Fase 1 · Fondasi Design System v2, Pemisahan Shell Desktop/Mobile, Landing & `/about`
> **Kenapa wajib paling awal**: Menerapkan palet *Seiji Washi / Yoru Night*, font, dan komponen atomik sejak awal mencegah kerja dua kali (*rework*) saat membangun halaman-halaman baru di Fase 3–5.

- **Patokan wajib dibaca**:
  - [DESIGN_SYSTEM_V2.md](./DESIGN_SYSTEM_V2.md) (Bagian 1–3)
  - FigCraft: `Page 00` (Tokens), `Page 01` (Component Library), `D0`, `M0`, `D1.1`, `M1.1`
  - Context7: Tailwind CSS v4 (`@theme`, `@custom-variant dark`) + Next.js 16 (`next/font/google`)
  - Skill: `ui-ux-pro-max` (`references/pro-rules.md`)
- **Checklist Pekerjaan**:
  - [x] Perbarui `src/app/globals.css` dengan token `@theme inline` (*Washi Day* `#F7F6F2`, *Seiji Teal* `#0F766E`, *Kaki Amber* `#D97706`, *Persimmon CTA* `#C2410C`, *Matcha* `#047857`, *Beni* `#BE123C`) & `.dark` (*Yoru Night* `#0E1418`, `#151E24`, `#2DD4BF`, `#FBBF24`) + `@custom-variant dark`.
  - [x] Perbarui `src/app/layout.tsx` untuk memuat font `Outfit`, `DM Sans`, `Noto Sans JP`, dan `JetBrains Mono` lewat `next/font/google` dan menempelkan CSS variables ke `<html>`.
  - [x] Buat komponen UI modular sesuai `Page 01` FigCraft di `src/components/ui/`:
    - `Button.tsx` (varian: `primary`, `cta`, `soft`, `outline`, `danger`)
    - `Badge.tsx` (tone: `success`, `primary`, `warning`, `danger`, `dark`, `neutral`)
    - `SoftGateBanner.tsx` (banner edukatif *Soft Gate* tanpa blokir keras)
  - [x] Rombak [src/components/layout/AppShell.tsx](../src/components/layout/AppShell.tsx) dengan pemisahan tegas:
    - `DesktopSidebar.tsx` (`256px` tetap, menu utama 4 grup + due badge + profil + link `/about` + pintasan `/admin` khusus admin)
    - `MobileBottomNav.tsx` (5 tab + `MobileTopBar` ringkas, area sentuh ≥ 48px)
  - [x] Terapkan tema baru pada halaman publik [src/app/page.tsx](../src/app/page.tsx) (Desktop `D0.1` vs Mobile `M0.1`) dan [src/app/login/page.tsx](../src/app/login/page.tsx) (Desktop `D1.1` vs Mobile `M1.1`).
  - [x] Buat halaman baru **`src/app/about/page.tsx`** (`D0.2` & `M0.2`): penafian non-sertifikasi JLPT/JFT-Basic, atribusi 5 sumber data terbuka (`JMdict`, `KANJIDIC2`, `KanjiVG`, `Tatoeba`, `VOICEVOX`), & kebijakan 0 Token AI/pelajar.
- **Definition of Done (DoD Fase 1)**:
  - [x] `npx tsc --noEmit`, `npm run lint`, & `npm run build` lulus tanpa error.
  - [x] Uji browser di `/`, `/about`, dan `/login` pada `1440×900` & `390×844` (Light *Washi Day* & Dark *Yoru Night*): 0 overflow horizontal, 0 emoji Unicode, 0 error console.

---

### Fase 2 · Migrasi Database `0005` & Guard Onboarding (`supabase/` + `proxy.ts`)
> **Tujuan**: Menyiapkan skema kurikulum, progres unit, misi harian, dan pengaturan *Romaji Weaning / Smart Furigana* di database serta mengunci alur redirect akun baru ke `/onboarding`.

- **Patokan wajib dibaca**:
  - [LEARNING_FLOW_AND_CURRICULUM.md](./LEARNING_FLOW_AND_CURRICULUM.md) (Bagian 2.2 Matriks Routing & Bagian 7 Skema DB `0005`)
  - [src/proxy.ts](../src/proxy.ts), [src/lib/auth-profile.ts](../src/lib/auth-profile.ts), [src/lib/types.ts](../src/lib/types.ts), dan [supabase/migrations/0001_init.sql](../supabase/migrations/0001_init.sql)
  - Context7: Supabase SSR & Postgres RLS policies
- **Checklist Pekerjaan**:
  - [ ] Buat `supabase/migrations/0005_onboarding_curriculum.sql`:
    - Tambah kolom di `public.profiles`: `onboarding_completed`, `learning_goal`, `current_stage`, `study_minutes_daily`, `exam_target_period`, `placement_score`, `romaji_enabled`, `furigana_mode`.
    - Perbarui trigger `public.handle_new_user()` agar menyalin `display_name` dari `raw_user_meta_data`.
    - Tambah kolom `unit_code` + index pada `public.items`.
    - Buat tabel baru dengan RLS penuh (`auth.uid() = user_id`): `public.curriculum_units`, `public.user_unit_progress`, `public.daily_mission_logs`.
    - Seed definisi unit awal (`0.1–0.3`, `1.1–1.8`, `2.1–2.6`, dst.) di `public.curriculum_units`.
  - [ ] Perbarui [src/lib/types.ts](../src/lib/types.ts) & [src/lib/auth-profile.ts](../src/lib/auth-profile.ts) agar menyertakan field profil baru + helper cek `onboarding_completed`.
  - [ ] Perbarui [src/proxy.ts](../src/proxy.ts) dan `requireShellContext()` sesuai Matriks Routing Bagian 2.2 (pelajar yang `onboarding_completed = false` diarahkan wajib ke `/onboarding`; admin tidak dipaksa onboarding dan tetap terisolasi di `/admin`).
  - [ ] Jalankan migrasi `0005_onboarding_curriculum.sql` di Supabase (serta pastikan akun eksisting tetap aman / tidak terjebak loop redirect).
- **Definition of Done (DoD Fase 2)**:
  - `npx tsc --noEmit` & `npm run build` lulus.
  - Uji skenario routing: (1) Belum login → `/login`, (2) Pelajar baru `onboarding_completed=false` akses `/dashboard` → redirect `/onboarding`, (3) Admin login → langsung `/admin` tanpa dipaksa onboarding.

---

### Fase 3 · Wizard Onboarding 4 Langkah & Placement Test 15 Soal (`/onboarding`)
> **Tujuan**: Memberikan pengalaman masuk pertama kali yang terarah, menghitung level awal otomatis (0 token AI), dan menuliskan kontrak belajar ke database.

- **Patokan wajib dibaca**:
  - [LEARNING_FLOW_AND_CURRICULUM.md](./LEARNING_FLOW_AND_CURRICULUM.md) (Bagian 2.1 Langkah 1–4 Onboarding)
  - FigCraft: `D1.2`, `D1.3` (Desktop Split) & `M1.2`, `M1.3` (Mobile 1 soal/layar)
- **Checklist Pekerjaan**:
  - [ ] Buat `src/lib/japanese/placement-test.ts`: 15 soal orisinal bertingkat (`PRE_N5` Kana, `N5` kosakata/partikel, `N4` konjugasi/keigo, `N3/N2` pemahaman singkat) + algoritma penempatan otomatis (`current_stage`, `romaji_enabled`, `furigana_mode`, unit awal).
  - [ ] Buat `src/app/onboarding/actions.ts`: Server Action simpan jawaban onboarding, skor placement, kontrak belajar (`study_minutes_daily`, `exam_target_period`), inisialisasi `user_unit_progress`, dan set `onboarding_completed = true`.
  - [ ] Buat `src/app/onboarding/page.tsx` & `src/app/onboarding/OnboardingWizard.tsx` (dukung `?retake=1` untuk ulang tes penempatan):
    - Desktop: split 2 kolom sesuai `D1.2–D1.3`.
    - Mobile: 1 soal per layar + tombol pilihan tap `54px` + CTA sticky bawah sesuai `M1.2–M1.3`.
- **Definition of Done (DoD Fase 3)**:
  - Pelajar baru bisa menyelesaikan 4 langkah dari awal hingga masuk `/dashboard`, kolom `profiles` dan `user_unit_progress` terisi akurat sesuai skor tes penempatan.
  - Verifikasi visual Desktop (`1440px`) & Mobile (`390px`), `tsc` & `build` hijau.

---

### Fase 4 · Guided Dashboard 4-Langkah, Peta Kurikulum (`/roadmap`) & Lesson View (`/roadmap/[unitCode]`)
> **Tujuan**: Menghidupkan siklus belajar harian terarah, pelajaran bab sebelum drill (*Lesson View*), serta kebijakan *Romaji Weaning & Smart Furigana*.

- **Patokan wajib dibaca**:
  - [LEARNING_FLOW_AND_CURRICULUM.md](./LEARNING_FLOW_AND_CURRICULUM.md) (Bagian 3.1, 3.2, 4, & 5)
  - FigCraft: `D2.1`, `D2.2`, `D2.3` (Desktop) & `M2.1`, `M2.2`, `M2.3` (Mobile)
- **Checklist Pekerjaan**:
  - [ ] Buat `src/lib/japanese/curriculum-roadmap.ts`: struktur silabus formal Tahap 0–5 (3 unit Pra-N5, 8 unit N5, 6 unit N4, dan ringkasan N3–N1) beserta materi ringkasan *Lesson View* Bahasa Indonesia, tabel konjugasi bab, daftar kanji unit, dan contoh audio.
  - [ ] Buat `src/lib/mission-tracker.ts`: helper baca & update `daily_mission_logs` (Langkah 1–4 harian + rotasi ganjil/genap Reading vs Speaking/Kaiwa) serta `user_unit_progress`.
  - [ ] Rombak `src/app/dashboard/page.tsx`:
    - Desktop (`D2.1`): Kokpit 2 kolom — Hero Misi Aktif + Daftar 4 Langkah + Perpustakaan Mandiri di kiri; Kartu Unit Aktif + Grafik Kesiapan 4 Bidang di kanan.
    - Mobile (`M2.1`): *Focus Mode* — 1 Hero CTA utama, daftar 4 langkah ringkas 1 baris, dan 3 tombol *Latihan Cepat* (grafik kesiapan tetap di `/profile`).
  - [ ] Buat `src/app/roadmap/page.tsx`: Desktop grid unit 2×4 (`D2.2`) vs Mobile *Vertical Timeline* (`M2.2`) dengan indikator status (`Lulus`, `Aktif`, `Terkunci/Soft Gate`) & tombol akses bebas ber-banner edukatif.
  - [ ] Buat `src/app/roadmap/[unitCode]/page.tsx` + action `"Tandai Paham Materi Bab Ini"`:
    - Desktop (`D2.3`): tata letak buku ajar 2 kolom (`66%` penjelasan & tabel + `34%` 14 Kanji & checklist *sticky*).
    - Mobile (`M2.3`): *Pocket Lesson* bertab (`Ringkasan · Tabel · Kanji`) + tombol aksi *sticky* bawah.
  - [ ] Buat helper kebijakan **Romaji Weaning & Smart Furigana** (`src/lib/japanese/display-policy.ts`) berdasarkan `current_stage`, `romaji_enabled`, `furigana_mode`, dan status FSRS kartu.
- **Definition of Done (DoD Fase 4)**:
  - Pelajar dapat membuka `/dashboard` → klik unit aktif `/roadmap/[unitCode]` → menandai bab paham → status progres & misi harian terupdate di DB.
  - Uji visual `D2` & `M2` di browser (`1440px` & `390px`), `tsc` & `build` hijau.

---

### Fase 5 · Upgrade Modul Latihan Inti (FSRS 2-Tahap, Voice 5–15s Anti-Noise, Konjugasi/Choukai & UI v2 Modul)
> **Tujuan**: Menerapkan seluruh fitur pedagogis tingkat lanjut dan menyelaraskan 100% modul eksisting ke Design System v2 (Desktop Studio vs Mobile Companion).

- **Patokan wajib dibaca**:
  - [LEARNING_FLOW_AND_CURRICULUM.md](./LEARNING_FLOW_AND_CURRICULUM.md) (Bagian 3.3, 3.4, & 3.5)
  - FigCraft: `Page 01` (Section B, C, D), `D3–D6` & `M3–M6`
  - Context7: `ts-fsrs` (estimasi interval 4 tombol)
- **Checklist Pekerjaan**:
  - [ ] **5A · FSRS 2-Tahap (`/review`)** (`D3.2a/b` & `M3.2a/b`):
    - Perbarui `src/app/review/ReviewSession.tsx` & `actions.ts`:
      - **Tahap 1**: Kartu tertutup + timer tenang berjalan naik + **4 tombol pilihan cepat** (distraktor dari level yang sama) + tombol `"Tidak Tahu / Buka Jawaban"` dengan **jeda kunci `1,5 detik`** + toggle **Mode Uji Pilihan vs Mode Kartu Anki (`N3+`)**.
      - **Tahap 2**: Hasil tervalidasi + audio otomatis + 4 tombol FSRS dengan estimasi interval. Jika **SALAH / Tidak Tahu**, tombol `Bisa` & `Mudah` **dinonaktifkan (*Wrong-Lock*)** dan kartu otomatis tercatat ke `mistakes_notebook`. Jika **BENAR**, tampil sorotan rekomendasi berbasis waktu (`< 3s` Mudah, `3–8s` Bisa, `> 8s` Sulit).
    - Hubungkan selesai sesi review ke `daily_mission_logs.step_review_done`.
  - [ ] **5B · Voice Recording Adaptif `5/10/15 dtk` & Perbaikan Akurasi Transkrip**:
    - Rombak [src/hooks/useSpeechPractice.ts](../src/hooks/useSpeechPractice.ts):
      - Hitung batas durasi otomatis: `≤ 12` kana → **5s**, `13–24` kana → **10s**, `≥ 25` kana → **15s**.
      - Set `rec.continuous = true` dan `rec.maxAlternatives = 5`, pisahkan tegas segmen `isFinal` vs `interim`.
      - Aktifkan `getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } })` + `window.speechSynthesis.cancel()` + jeda `250ms` sebelum `rec.start()`.
      - Tambah countdown timer, progress bar, auto-stop saat habis waktu, & tombol *Stop & Nilai Lebih Cepat*.
    - Rombak [src/lib/japanese/kana-compare.ts](../src/lib/japanese/kana-compare.ts):
      - Evaluasi **Best-of-5 alternatives** (pilih skor tertinggi dari seluruh kandidat STT).
      - Perluas kamus Kanji → Hiragana & tambah toleransi vokal ekor tipis untuk frasa pendek (`じゃ` ≈ `じゃあ`), kecuali pada mode latihan kontras *chouon* yang tetap ketat.
    - Terapkan UI v2 ke `src/app/pronunciation/PronunciationWorkspace.tsx` (`D5.1` 3-Pane Studio vs `M5.1` Thumb Mic Dock) & `src/app/kaiwa/KaiwaWorkspace.tsx` (`D4.2` vs `M4.2`).
  - [ ] **5C · Drill Konjugasi (`活用`), Kata Bantu Bilangan (`助数詞`) & 4-Tipe Choukai**:
    - Perluas `src/app/bunpou/` & `src/lib/japanese/bunpou-data.ts` dengan tab **Konjugasi Kata Kerja/Sifat** (`Gol 1/2/3`, `ます/て/ない/た/辞書`), **Kata Bantu Bilangan (`〜つ/〜人/〜枚/〜本/〜台`)**, serta latihan **4 tipe Choukai** (`D5.2` vs `M5.2`).
  - [ ] **5D · Penyelarasan UI v2 & Integrasi Misi ke Modul Lain**:
    - `/kana` (`D3.1` vs `M3.1`) & `/writing` (`D3.3` vs `M3.3`: mode bertahap *Lihat → Jiplak → Mandiri*).
    - `/reading` & `/reading/[slug]` (`D4.1` vs `M4.1`: *Smart Furigana* + *Bottom Sheet Word Lookup* Mobile) & `/culture` (`D4.3` vs `M4.3`).
    - `/daily-test` (`D6.1` vs `M6.1`: dikte audio Kana + `step_test_done`), `/exam/[level]` (`D6.2` vs `M6.2`: header gelap timer + *Section Lock Modal/Sheet*), `/mistakes` (`D6.3` vs `M6.3`).
    - `/profile` & `/settings` (`D6.4` & `M5.3` / `M6.4`: grafik kesiapan 4 bidang JLPT, pengaturan Romaji/Furigana, & toggle tema *Washi Day / Yoru Night*).
    - `/admin` (`D5.3` & `M6.4`: tampilan *Yoru Night* Dark Mode penuh, KPI `0 Token / Pelajar`, & review draft Gemini).
- **Definition of Done (DoD Fase 5)**:
  - Uji langsung di browser: (1) FSRS 2-Tahap mengunci `Bisa/Mudah` saat salah & jeda `1,5s` berfungsi, (2) Voice timer otomatis berubah `5s / 10s / 15s` sesuai panjang kalimat + `maxAlternatives=5`, (3) Seluruh 21 rute bebas overflow pada `1440px` & `390px` di mode Light & Dark, `tsc` & `build` lulus.

---

### Fase 6 · Pengisian Konten Penuh (Gelombang 1 & 2) + Verifikasi E2E Produksi
> **Tujuan**: Mengisi konten nyata agar pelatihan Pra-N5, N5 Penuh (8 unit), dan N4 Penuh (6 unit) benar-benar bisa dipakai belajar jangka panjang tanpa kekurangan data.

- **Patokan wajib dibaca**:
  - [LEARNING_FLOW_AND_CURRICULUM.md](./LEARNING_FLOW_AND_CURRICULUM.md) (Bagian 4 Silabus Detail, Bagian 6 Audit Kesenjangan Materi, & Bagian 8 Kepatuhan Hak Cipta/Lisensi)
  - [TOOLS.md](./TOOLS.md) (Sumber data gratis berlisensi)
- **Checklist Pekerjaan**:
  - [ ] **Gelombang 1 — Pra-N5 + JLPT N5 Penuh (`supabase/migrations/0006_seed_pre_n5_and_n5.sql`)**:
    - Daftarkan 58 Dakuon/Handakuon/Youon + pasangan latih Sokuon/Chouon ke Tahap 0 (`unit_code` `0.1–0.3`).
    - Lengkapi data path KanjiVG di `src/lib/japanese/kanjivg-strokes.ts` untuk 92 Kana + 110 Kanji N5.
    - Isi ~800 kosakata N5, 110 Kanji N5, dan ~65 pola grammar N5 yang terikat per `unit_code` (`1.1–1.8`).
    - Tambah 8–16 teks bacaan N5, 8 skenario Kaiwa N5, frasa pelafalan per unit, dan minimal 40–60 soal `/exam/n5` (via generator batch Admin `/admin`).
  - [ ] **Gelombang 2 — JLPT N4 Penuh (`supabase/migrations/0007_seed_n4.sql`)**:
    - Isi ~700 kosakata N4 tambahan, ~190 Kanji N4, konjugasi lanjutan + *Keigo*, 6 skenario Kaiwa kerja/SSW, tambahan kartu budaya kerja, dan bank soal `/exam/n4`.
  - [ ] **Gelombang 3 — N3–N1 (Bertahap via Import Dataset Terbuka)**:
    - Siapkan script import `JMdict` + `KANJIDIC2` + `Tatoeba` dengan atribusi penuh di `/about`.
  - [ ] **Verifikasi Akhir & Kesiapan Deploy**:
    - Uji end-to-end penuh: Daftar baru → Verifikasi email → Onboarding 4 langkah → Dashboard 4 langkah → Roadmap & Lesson View → Review FSRS 2-Tahap → Writing → Reading → Voice 5–15s → Daily Test → Exam → Mistakes → Admin `/admin`.
    - Pastikan `npx tsc --noEmit`, `npm run lint`, dan `npm run build` 100% bersih tanpa warning/error.
- **Definition of Done (DoD Fase 6)**:
  - Seluruh jalur belajar Tahap 0 → Tahap 2 dapat diselesaikan penuh tanpa data kosong, seluruh hak cipta & lisensi tercantum di `/about`, siap deploy ke Vercel.
