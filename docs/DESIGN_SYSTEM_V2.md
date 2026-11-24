# Design System v2 — Seiji Washi & Kaki Amber (`JLPT App`)

Dokumen ini mendokumentasikan perombakan menyeluruh sistem desain **JLPT App v2** yang dirancang di [`design/jlpt-app-v2.figcraft`](../design/jlpt-app-v2.figcraft) agar selaras 100% dengan alur baru pada [LEARNING_FLOW_AND_CURRICULUM.md](./LEARNING_FLOW_AND_CURRICULUM.md).

Referensi riset & validasi teknis:
- **UI/UX Pro Max** (*LMS Teal + Book & Reading Warm Paper + Achievement Amber*, aturan kontras Light/Dark WCAG AA+, *touch target* ≥ 44–48px, serta *SVG-only zero emoji*).
- **Context7 · Tailwind CSS v4** (`@theme` semantic tokens & `@custom-variant dark (&:where(.dark, .dark *))`).
- **FigCraft** (variabel tema `Light`/`Dark` terstruktur + pemisahan halaman **Desktop 1440×960** dan **Mobile 390×844** secara ketat).

---

## 1. Palet Warna Baru: *Seiji Washi & Kaki Amber*

Menggantikan biru korporat dingin (`#2563EB`) dan abu-abu steril (`#F8FAFC`) dengan palet belajar bernuansa kerajinan Jepang yang **rendah silau (*low eye strain*) untuk sesi baca/tulis 30–60 menit**, modern, sekaligus **memotivasi lewat aksen hangat**:

| Token Variabel | Mode Terang (*Washi Day*) | Mode Gelap (*Yoru Night*) | Fungsi & Kontras WCAG |
| :--- | :--- | :--- | :--- |
| `bg/canvas` | `#F7F6F2` | `#0E1418` | Latar kertas *Washi* hangat / *Sumi Pine* malam tanpa silau `#FFFFFF`/`#000000` murni |
| `bg/surface` | `#FFFFFF` | `#151E24` | Kartu misi, lembar *Lesson*, studio suara, dan modal |
| `bg/subtle` | `#EFECE5` | `#1D2830` | Input form, pill sekunder, track progress bar |
| `border/default` | `#E2DFD7` | `#26333D` | Garis pemisah tegas & terlihat jelas di kedua mode |
| `text/primary` | `#1C252C` | `#F1F5F4` | Teks utama, Kanji, & judul (**≥ 14:1**) |
| `text/secondary` | `#4B5964` | `#9AAAB5` | Penjelasan Bahasa Indonesia & keterangan bantu (**≥ 6.5:1**) |
| `brand/primary` | `#0F766E` | `#2DD4BF` | **Seiji Celadon Teal** — fokus tenang, tombol utama, navigasi aktif (**5.47:1** Light / **10.7:1** Dark) |
| `brand/primary-soft` | `#E6F4F1` | `#122E2C` | Tint lembut untuk kartu terpilih, *Smart Furigana*, & badge tahap |
| `brand/accent` | `#D97706` | `#FBBF24` | **Kaki Amber / Lantern Gold** — streak harian, lencana pencapaian, fokus remedial |
| `brand/accent-soft` | `#FEF3C7` | `#33250B` | Latar pill streak, durasi mic, & *Soft Gate* edukatif |
| `brand/cta` | `#C2410C` | `#FB923C` | **Persimmon CTA** — tombol aksi prioritas tinggi (*Lanjut Misi*, *Stop & Nilai Mic*, **5.18:1**) |
| `semantic/success` | `#047857` | `#34D399` | **Matcha Emerald** — unit lulus, skor pelafalan ≥ 85%, misi selesai (**5.48:1**) |
| `semantic/danger` | `#BE123C` | `#FB7185` | **Beni Crimson** — status merekam aktif, rating *Lupa*, & catatan kesalahan (**6.20:1**) |

### Token Tailwind CSS v4 (Hasil Export FigCraft + Context7 `@custom-variant dark`)

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --color-canvas: #F7F6F2;
  --color-surface: #FFFFFF;
  --color-subtle: #EFECE5;
  --color-border-default: #E2DFD7;
  --color-text-primary: #1C252C;
  --color-text-secondary: #4B5964;
  --color-brand-primary: #0F766E;
  --color-brand-primary-soft: #E6F4F1;
  --color-brand-accent: #D97706;
  --color-brand-accent-soft: #FEF3C7;
  --color-brand-cta: #C2410C;
  --color-semantic-success: #047857;
  --color-semantic-danger: #BE123C;

  --font-heading: var(--font-outfit), var(--font-noto-jp), system-ui, sans-serif;
  --font-sans: var(--font-dm-sans), var(--font-noto-jp), system-ui, sans-serif;
  --font-jp: var(--font-noto-jp), system-ui, sans-serif;
  --font-mono: var(--font-jetbrains-mono), ui-monospace, monospace;
}

.dark {
  --color-canvas: #0E1418;
  --color-surface: #151E24;
  --color-subtle: #1D2830;
  --color-border-default: #26333D;
  --color-text-primary: #F1F5F4;
  --color-text-secondary: #9AAAB5;
  --color-brand-primary: #2DD4BF;
  --color-brand-primary-soft: #122E2C;
  --color-brand-accent: #FBBF24;
  --color-brand-accent-soft: #33250B;
  --color-brand-cta: #FB923C;
  --color-semantic-success: #34D399;
  --color-semantic-danger: #FB7185;
}
```

---

## 2. Tipografi & Aturan Ikon

| Peran | Font Web (`next/font/google`) | Font Preview FigCraft | Ukuran & Aturan |
| :--- | :--- | :--- | :--- |
| **Display & Heading** | `Outfit` (`600 / 700`) | `Segoe UI Bold` | H1 `26–34px` Desktop · `20–22px` Mobile; tracking rapat & ramah |
| **Body & Penjelasan** | `DM Sans` (`400 / 500 / 700`) | `Segoe UI` | Base `14–16px`, *line-height* `1.5–1.6`, panjang baris terjaga |
| **Teks Jepang & Furigana** | `Noto Sans JP` (`400 / 500 / 700`) | `Yu Gothic UI` | *Line-height* `1.75` untuk ruang `<ruby>` furigana; patuh *Romaji Weaning* |
| **Timer & Skor JLPT** | `JetBrains Mono` (`500 / 700`) | `Consolas` | Angka tabular untuk timer rekam `04.2s / 15.0s` & skor `80/180` |
| **Ikon UI** | Inline SVG (`src/components/ui/Icons.tsx`) | Vektor geometris | **Wajib SVG Only** — nol emoji Unicode di seluruh antarmuka |

---

## 3. Pemisahan Ketat Desktop vs Mobile (Tanpa Tabrakan & Konten Adaptif Berbeda)

Tampilan Desktop dan Mobile tidak sekadar mengecilkan kolom yang sama, melainkan **dipisah penuh baik secara halaman FigCraft maupun arsitektur komponen & kepadatan informasi**:

| Halaman / Modul | Desktop Studio (`1440×960` · Halaman `D0–D6`) | Mobile Companion (`390×844` · Halaman `M0–M6`) |
| :--- | :--- | :--- |
| **Landing & Tentang (`/`, `/about`)** | Hero 2 kolom + preview kartu FSRS + grid 4 pilar + tabel lisensi lengkap | Hero 1 kolom Seiji + alur vertikal 4 langkah + kartu lisensi bertumpuk + CTA *sticky* bawah |
| **Navigasi Utama** | Sidebar kiri tetap `256px` (Master Component `Nav / Desktop Sidebar` Light & Dark) | Top bar ringkas + **Bottom Nav 5 Tab** (Master Component `Nav / Mobile Bottom Bar` Light & Dark, area sentuh ≥ 48px) |
| **Register & Onboarding** | Split 2 kolom (narasi JF Standard kiri + form/wizard kanan); Placement Test berdampingan dengan Kontrak Belajar | Layar penuh 1 fokus per viewport: 1 soal Placement/layar, pilihan tap `54px`, CTA *sticky* zona jempol |
| **Guided Dashboard** | Kokpit 2 kolom: Hero Misi + 4 Langkah + Perpustakaan Mandiri kiri; Unit Aktif + **Grafik Kesiapan 4 Bidang** kanan | **Focus Mode**: 1 Hero CTA *"Lanjut Langkah 2/4"*, daftar 4 langkah 1 baris, & 3 *Latihan Cepat* (grafik dipindah ke Profil) |
| **Peta Kurikulum & Lesson (`/roadmap`)** | Grid 2×4 unit + tata letak buku ajar 2 kolom (`66%` materi + `34%` panel 14 Kanji *sticky*) | **Vertical Timeline** satu tangan + **Pocket Lesson** bertab (`Ringkasan · Tabel ます · 14 Kanji`) |
| **Kana, FSRS & Menulis (`/kana`, `/review`, `/writing`)** | Tabel Kana 5-kolom + Inspektor samping; **FSRS 2-Tahap** (*Tahap 1: Uji 4 Pilihan + Jeda 1,5s* → *Tahap 2: Hasil Tervalidasi & Rating FSRS + Wrong-Lock*); Kanvas KanjiVG + panel info radikal | Grid Kana 5-kolom *thumb* + kartu detail ringkas; **FSRS 2-Tahap** (*Tahap 1: 4 Pilihan Jempol + Jeda 1,5s* → *Tahap 2: Hasil + 4 Tombol FSRS Tervalidasi*); Kanvas sentuh `336×336px` |
| **Membaca, Kaiwa & Budaya (`/reading`, `/kaiwa`, `/culture`)** | Pembaca 2 kolom + *Word Lookup* samping; Kaiwa split Mic `5/10/15s` + respons sopan; Grid 3 kolom etika kerja | *Pocket Reader* + *Bottom Sheet Word Lookup* (live instance); Chat Kaiwa + **Thumb Mic Dock `390px`** (live instance); Kartu Hou-Ren-Sou vertikal |
| **Studio Suara (`5 / 10 / 15 dtk`) & Drill** | **3-Pane Studio** (antrean + rekam tengah + log 3–5x); Drill + panel rumus cepat & 4 format Choukai | Kartu kalimat terpusat + **Thumb-Zone Mic Dock**; Flash-drill tunggal + grid jawaban 2×2 besar (`64px`) |
| **Tes Harian, Ujian JLPT, Kesalahan & Admin** | Tes 20 soal & dikte; Simulasi JLPT + peta nomor samping & modal kunci bagian; Admin Dark *Yoru Night* 3-kolom | Tes fokus 1 soal + IME Kana; Exam header gelap `14:28` + *Bottom Sheet* kunci bagian; Monitor Admin Dark KPI 2×2 + generator cepat |

---

## 4. Arsitektur Komponen & Daftar Halaman File FigCraft (`design/jlpt-app-v2.figcraft`)

File lama `design/jlpt-app.figcraft` tetap dipertahankan sebagai arsip v1, sementara seluruh rancangan penuh v2 (18 halaman · **44 layar penuh** Desktop & Mobile mencakup 100% dari 21 rute aplikasi termasuk **FSRS 2-Tahap** + **30 Master Components** & **36 live linked instances**) tersimpan di **`design/jlpt-app-v2.figcraft`**:

### Fondasi & Perpustakaan Komponen
1. **`00 · Design System v2 — Tokens & Foundations`** — 13 variabel tema `Light` (*Washi Day*) & `Dark` (*Yoru Night*), skala tipografi (`Outfit` / `DM Sans` / `Noto Sans JP` / `JetBrains Mono`), dan panduan pemisahan perangkat.
2. **`01 · Component Library (Master Components & Variants)`** — **30 Master Components** yang terorganisasi dalam **5 Variant Component Sets** (`Button / Action` 5 varian, `Badge / Status Pill` 5 tone, `Card / Mission Step` 3 status, `Voice / Adaptive Timer Bar` `5s/10s/15s`, `Nav / Mobile Bottom Bar` Light/Dark) + **12 Standalone Master Components** (termasuk `FSRS Step-1 Recall Widget Desktop`, `FSRS Step-2 Wrong-Lock Rating Bar`, `FSRS Step-1 Recall Dock Mobile`, `FSRS Rating Bar`, `Soft Gate Notice`, `Desktop Sidebar` Light/Dark, `Word Lookup Modal`, `Exam Section Lock Modal`, `Mobile Thumb Mic Dock 390px`, `Unit Roadmap Item`, `KPI Stat Tile Dark Yoru`) yang dipakai ulang lewat **36 live instances** di layar Desktop & Mobile.

### Halaman Desktop Studio (`1440×960` · 7 Halaman · 22 Layar)
3. **`D0 · Desktop Landing & About (/ · /about)`** — 2 layar: Landing Page penuh & Halaman Tentang/Atribusi Lisensi (`JMdict`, `KANJIDIC2`, `KanjiVG`, `Tatoeba`, `VOICEVOX`).
4. **`D1 · Desktop Auth, Email Verify & 4-Step Onboarding`** — 3 layar: Register + `/auth/callback`, Onboarding Langkah 1–2, & Placement Test 15 soal + Kontrak Belajar.
5. **`D2 · Desktop Guided Dashboard, Roadmap & Lesson View`** — 3 layar: Kokpit Misi 4 Langkah, Peta Kurikulum Tahap 0–5, & Lesson View Unit 1.3.
6. **`D3 · Desktop Kana, FSRS Review & Writing KanjiVG`** — **4 layar**: `/kana`, **`/review` Tahap 1 (Uji 4 Pilihan + Jeda 1,5s + Mode Anki)**, **`/review` Tahap 2 (Hasil Tervalidasi + Rating FSRS)**, & `/writing`.
7. **`D4 · Desktop Reading, Kaiwa Roleplay & Culture`** — 3 layar: `/reading/[slug]`, `/kaiwa` (Mic adaptif `5/10/15s`), & `/culture`.
8. **`D5 · Desktop Voice Studio (5-15s), Drills & Admin Dark`** — 3 layar: `/pronunciation`, `/bunpou` (Konjugasi/Counter/4-Tipe Choukai), & `/admin` Dark *Yoru Night*.
9. **`D6 · Desktop Daily Test, JLPT Exam, Mistakes & Profile/Settings`** — 4 layar: `/daily-test`, `/exam/n5` (dengan modal kunci bagian), `/mistakes`, & `/profile` + `/settings`.

### Halaman Mobile Companion (`390×844` · 7 Halaman · 22 Layar)
10. **`M0 · Mobile Landing & About (/ · /about)`** — 2 layar: Mobile Landing & Tentang/Lisensi Terbuka.
11. **`M1 · Mobile Auth & Onboarding Flow`** — 3 layar: Register/Verify, Placement Test 1 soal/layar, & Kontrak Belajar.
12. **`M2 · Mobile Guided Home, Roadmap & Pocket Lesson`** — 3 layar: Guided Home Focus Mode, Roadmap Vertical Timeline, & Pocket Lesson bertab.
13. **`M3 · Mobile Kana, FSRS Flashcard & Writing Canvas`** — **4 layar**: `/kana` 5-kolom thumb, **`/review` Tahap 1 (4 Pilihan Jempol + Jeda 1,5s)**, **`/review` Tahap 2 (Hasil + Rating FSRS Tervalidasi)**, & `/writing` kanvas sentuh KanjiVG.
14. **`M4 · Mobile Reading, Kaiwa Roleplay & Culture`** — 3 layar: `/reading/[slug]` + *Word Lookup Bottom Sheet*, `/kaiwa` + *Thumb Mic Dock 390px*, & `/culture` Hou-Ren-Sou.
15. **`M5 · Mobile Voice Studio (5-15s), Quick Drill & Dark Profile`** — 3 layar: `/pronunciation` Thumb Dock, `/bunpou` Quick Drill 2×2, & `/profile` Kesiapan 4 Bidang Dark *Yoru Night*.
16. **`M6 · Mobile Daily Test, Exam, Mistakes & Settings/Admin Dark`** — 4 layar: `/daily-test` Dikte Kana, `/exam/n5` Timer Gelap + *Section Lock Sheet*, `/mistakes`, & `/settings` + `/admin` Dark *Yoru Night*.
