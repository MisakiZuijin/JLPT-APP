# 🧰 Tools, Library & Agent

## 1. Library
| Kebutuhan | Library | Status |
|---|---|---|
| Framework | `next`, `react` | ✅ terpasang |
| Auth/DB | `@supabase/supabase-js`, `@supabase/ssr` | ✅ terpasang |
| SRS | `ts-fsrs` | ✅ terpasang |
| Kana ↔ romaji | `wanakana` | ✅ terpasang |
| Furigana / tokenisasi | `kuromoji`, `kuroshiro`, `kuroshiro-analyzer-kuromoji` | Fase 2 |
| Stroke order | data KanjiVG (+ `hanzi-writer` atau komponen custom) | Fase 2 |
| Kemiripan teks | `fastest-levenshtein` | Fase 3 |
| STT di browser | `@huggingface/transformers` (Whisper) | Fase 3 |
| UI komponen | `shadcn/ui` | opsional |
| Validasi | `zod` | opsional |

## 2. Sumber Data (gratis)
| Data | Sumber | Lisensi |
|---|---|---|
| Kamus kosakata | JMdict (EDRDG) / `jmdict-simplified` | CC BY-SA 4.0 |
| Info kanji | KANJIDIC2 | CC BY-SA 4.0 |
| Stroke order | KanjiVG | CC BY-SA 3.0 |
| Contoh kalimat | Tatoeba | CC BY 2.0 FR |
| Suara TTS | VOICEVOX | Gratis (cek syarat tiap karakter suara) |

## 3. Layanan (free tier)
| Layanan | Kegunaan |
|---|---|
| **Supabase** | Postgres, Auth, Storage, `pg_cron` |
| **Vercel** | Hosting Next.js + Cron |
| **Gemini API** | Generate soal latihan / daily test |
| **Azure Speech** (opsional) | Pronunciation Assessment ja-JP |

## 4. AI Agent untuk Development (gratis)
| Agent | Cocok untuk |
|---|---|
| **Antigravity** | Agent utama: scaffold, coding multi-file, menjalankan perintah, tes di browser. Gunakan `/plan`, `/teamwork`, `/goal` |
| **Gemini CLI** | Tugas cepat di terminal, generate/olah data soal |
| **Cline / Kilo Code** (VS Code) | Alternatif dengan model gratis (Gemini free tier / OpenRouter) |

> [!TIP]
> Kuota tier gratis bisa berubah — cek halaman resmi masing-masing layanan secara berkala.
