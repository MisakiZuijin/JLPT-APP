import type { JlptLevel } from "@/lib/types";

export type PronunciationPhrase = {
  id: string;
  level: JlptLevel;
  category: string;
  term: string;
  reading: string;
  romaji: string;
  meaning: string;
  tip: string;
};

export const PRONUNCIATION_PHRASES: PronunciationPhrase[] = [
  {
    id: "salam-ohayou",
    level: "N5",
    category: "Salam & Harian",
    term: "おはようございます",
    reading: "おはようございます",
    romaji: "ohayou gozaimasu",
    meaning: "Selamat pagi (sopan)",
    tip: "Panjangkan sedikit bunyi 'o' pada 'ohayou' dan ucapkan 'gozaimasu' dengan lembut di ujung.",
  },
  {
    id: "salam-arigatou",
    level: "N5",
    category: "Salam & Harian",
    term: "ありがとうございます",
    reading: "ありがとうございます",
    romaji: "arigatou gozaimasu",
    meaning: "Terima kasih banyak",
    tip: "Tekankan suku kata 'ri-ga' secara rata dan panjangkan 'tou' sekitar dua ketukan.",
  },
  {
    id: "jikoshoukai-yoroshiku",
    level: "N5",
    category: "Perkenalan",
    term: "よろしくお願いします",
    reading: "よろしくおねがいします",
    romaji: "yoroshiku onegaishimasu",
    meaning: "Mohon bantuannya / Senang berkenalan dengan Anda",
    tip: "Ucapkan 'yoroshiku' mengalir tanpa jeda berat, lalu 'onegaishimasu' dengan nada turun sopan.",
  },
  {
    id: "jikoshoukai-gakusei",
    level: "N5",
    category: "Perkenalan",
    term: "私は学生です",
    reading: "わたしはがくせいです",
    romaji: "watashi wa gakusei desu",
    meaning: "Saya adalah pelajar",
    tip: "Partikel 'は' dibaca 'wa', bukan 'ha'. Huruf 'u' di 'desu' diucapkan sangat ringan.",
  },
  {
    id: "konbini-atatame",
    level: "N4",
    category: "Konbini & Belanja",
    term: "はい、おねがいします",
    reading: "はいおねがいします",
    romaji: "hai, onegaishimasu",
    meaning: "Ya, tolong (dihangatkan / dibungkus)",
    tip: "Pastikan 'hai' diucapkan tegas singkat, lalu jeda halus sebelum 'onegaishimasu'.",
  },
  {
    id: "restoran-mizu",
    level: "N5",
    category: "Restoran",
    term: "すみません、おみずをください",
    reading: "すみませんおみずをください",
    romaji: "sumimasen, omizu wo kudasai",
    meaning: "Permisi, minta air putihnya",
    tip: "Partikel 'を' diucapkan ringan seperti 'o'. Jangan ucapkan 'wo' terlalu keras.",
  },
  {
    id: "arah-eki",
    level: "N4",
    category: "Arah & Transportasi",
    term: "えきは どこですか",
    reading: "えきはどこですか",
    romaji: "eki wa doko desu ka",
    meaning: "Di manakah stasiun?",
    tip: "Naikkan intonasi sedikit pada partikel tanya 'か' di akhir kalimat.",
  },
  {
    id: "kerja-hourensou",
    level: "N3",
    category: "Dunia Kerja (Hou-Ren-Sou)",
    term: "おわりました、ごかくにんおねがいします",
    reading: "おわりましたごかくにんおねがいします",
    romaji: "owarimashita, gokakunin onegaishimasu",
    meaning: "Sudah selesai, mohon dicek kembali",
    tip: "Perhatikan konsonan penutup 'n' pada 'gokakunin' sebelum menyambung ke 'onegaishimasu'.",
  },
  {
    id: "kerja-shitsurei",
    level: "N3",
    category: "Dunia Kerja (Mensetsu)",
    term: "しつれいいたします",
    reading: "しつれいいたします",
    romaji: "shitsurei itashimasu",
    meaning: "Permisi (ragam hormat ke atasan / saat wawancara)",
    tip: "Bunyi 'tsu' di 'shitsurei' singkat saja agar ritme tetap natural.",
  },
];
