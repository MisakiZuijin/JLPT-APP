import type { JlptLevel } from "@/lib/types";

export type DailyQuestionKind = "srs" | "new" | "listening";
export type DailyQuestionType = "mcq" | "arrange" | "listening";

export type DailyTestQuestion = {
  id: string;
  kind: DailyQuestionKind;
  type: DailyQuestionType;
  level: JlptLevel;
  category: string;
  promptJa: string;
  promptId: string;
  audioText?: string;
  options?: string[];
  correctAnswer: string;
  tokens?: string[];
  explanationId: string;
};

type VocabSeed = {
  level: JlptLevel;
  category: string;
  term: string;
  reading: string;
  meaning: string;
  distractors: string[];
};

const BANK_VOCAB: VocabSeed[] = [
  { level: "N5", category: "Kosakata", term: "学生", reading: "がくせい", meaning: "pelajar / mahasiswa", distractors: ["guru", "dokter", "pegawai"] },
  { level: "N5", category: "Kosakata", term: "食べる", reading: "たべる", meaning: "makan", distractors: ["minum", "tidur", "pergi"] },
  { level: "N5", category: "Kosakata", term: "電車", reading: "でんしゃ", meaning: "kereta listrik", distractors: ["pesawat", "sepeda", "kapal"] },
  { level: "N5", category: "Kosakata", term: "図書館", reading: "としょかん", meaning: "perpustakaan", distractors: ["rumah sakit", "bank", "kantor pos"] },
  { level: "N5", category: "Kanji", term: "水", reading: "みず", meaning: "air", distractors: ["api", "gunung", "angin"] },
  { level: "N5", category: "Kanji", term: "明日", reading: "あした", meaning: "besok", distractors: ["kemarin", "minggu depan", "tadi pagi"] },
  { level: "N5", category: "Kosakata", term: "高い", reading: "たかい", meaning: "mahal / tinggi", distractors: ["murah", "kecil", "dingin"] },
  { level: "N5", category: "Kosakata", term: "友達", reading: "ともだち", meaning: "teman", distractors: ["keluarga", "kakak", "tetangga"] },
  { level: "N5", category: "Tata Bahasa", term: "駅（　）行きます", reading: "えきへいきます", meaning: "pergi ke stasiun", distractors: ["を", "で", "から"] },
  { level: "N5", category: "Tata Bahasa", term: "パン（　）食べます", reading: "ぱんをたべます", meaning: "makan roti", distractors: ["に", "へ", "が"] },
  { level: "N4", category: "Kosakata", term: "丁寧", reading: "ていねい", meaning: "ramah / sopan", distractors: ["kasar", "berisik", "lambat"] },
  { level: "N4", category: "Kosakata", term: "予約", reading: "よやく", meaning: "reservasi / pesan tempat", distractors: ["pembatalan", "pengiriman", "pembayaran"] },
  { level: "N3", category: "Kosakata", term: "正確", reading: "せいかく", meaning: "tepat / akurat", distractors: ["bingung", "sementara", "berbahaya"] },
  { level: "N3", category: "Kosakata", term: "通勤", reading: "つうきん", meaning: "perjalanan berangkat kerja", distractors: ["lembur", "cuti", "pensiun"] },
  { level: "N2", category: "Kerja", term: "確認", reading: "かくにん", meaning: "konfirmasi / pengecekan", distractors: ["penolakan", "perdebatan", "perayaan"] },
  { level: "N1", category: "Esai", term: "調和", reading: "ちょうわ", meaning: "harmoni / keselarasan", distractors: ["pertikaian", "keterlambatan", "kekurangan"] },
];

const ARRANGE_QUESTIONS: DailyTestQuestion[] = [
  {
    id: "arr-1",
    kind: "new",
    type: "arrange",
    level: "N5",
    category: "Susun Kalimat",
    promptJa: "Susun menjadi: \"Besok saya pergi ke stasiun naik kereta.\"",
    promptId: "Ketuk potongan kata sesuai urutan tata bahasa Jepang.",
    tokens: ["駅へ", "電車で", "明日", "行きます。", "私は"],
    correctAnswer: "明日 私は 電車で 駅へ 行きます。",
    explanationId: "Urutan alami: Waktu (明日) → Subjek (私は) → Alat (電車で) → Tujuan (駅へ) → Verba (行きます).",
  },
  {
    id: "arr-2",
    kind: "new",
    type: "arrange",
    level: "N5",
    category: "Susun Kalimat",
    promptJa: "Susun menjadi: \"Saya belajar bahasa Jepang di kelas.\"",
    promptId: "Pola kalimat: [TEMPAT] で [OBJEK] を [KATA KERJA].",
    tokens: ["日本語を", "クラスで", "勉強します。", "私は"],
    correctAnswer: "私は クラスで 日本語を 勉強します。",
    explanationId: "Partikel で menandai tempat aktivitas (di kelas) dan を menandai objek (bahasa Jepang).",
  },
  {
    id: "arr-3",
    kind: "new",
    type: "arrange",
    level: "N4",
    category: "Susun Kalimat",
    promptJa: "Susun menjadi: \"Tolong hangatkan bento ini.\"",
    promptId: "Gunakan bentuk permintaan sopan.",
    tokens: ["この", "お願いします。", "温め", "お弁当の"],
    correctAnswer: "この お弁当の 温め お願いします。",
    explanationId: "Frasa sopan meminta layanan: [Kata benda] + お願いします。",
  },
  {
    id: "arr-4",
    kind: "new",
    type: "arrange",
    level: "N5",
    category: "Susun Kalimat",
    promptJa: "Susun menjadi: \"Setiap hari saya minum air putih.\"",
    promptId: "Rangkai kata menjadi kalimat sopan ~ます.",
    tokens: ["毎日", "水を", "飲みます。", "私は"],
    correctAnswer: "私は 毎日 水を 飲みます。",
    explanationId: "Subjek (私は) + frekuensi (毎日) + objek (水を) + verba (飲みます).",
  },
];

const LISTENING_QUESTIONS: DailyTestQuestion[] = [
  {
    id: "lis-1",
    kind: "listening",
    type: "listening",
    level: "N5",
    category: "Mendengarkan Audio",
    promptJa: "Dengarkan audio lalu pilih arti yang paling tepat:",
    promptId: "Klik tombol Putar Audio, lalu pilih makna kalimat tersebut.",
    audioText: "すみません、駅はどこですか。",
    options: [
      "Permisi, stasiun ada di mana?",
      "Permisi, harga tiketnya berapa?",
      "Maaf, keretanya sudah berangkat.",
      "Selamat datang di stasiun.",
    ],
    correctAnswer: "Permisi, stasiun ada di mana?",
    explanationId: "Audio mengucapkan 「すみません、駅はどこですか」(Permisi, stasiun di mana?).",
  },
  {
    id: "lis-2",
    kind: "listening",
    type: "listening",
    level: "N5",
    category: "Mendengarkan Audio",
    promptJa: "Dengarkan audio lalu pilih waktu bangun yang disebutkan:",
    promptId: "Klik tombol Putar Audio dan simak jam yang diucapkan.",
    audioText: "毎日、朝の六時に起きます。",
    options: ["Pukul 5 pagi", "Pukul 6 pagi", "Pukul 7 pagi", "Pukul 8 pagi"],
    correctAnswer: "Pukul 6 pagi",
    explanationId: "Terdengar 「六時に起きます」(roku-ji ni okimasu = bangun pukul 6).",
  },
  {
    id: "lis-3",
    kind: "listening",
    type: "listening",
    level: "N4",
    category: "Mendengarkan Audio",
    promptJa: "Dengarkan audio kasir konbini lalu pilih respons terbaik:",
    promptId: "Apa respons sopan untuk pertanyaan kasir ini?",
    audioText: "お弁当を温めますか。",
    options: [
      "はい、お願いします。",
      "いいえ、食べません。",
      "明日、行きます。",
      "水曜日です。",
    ],
    correctAnswer: "はい、お願いします。",
    explanationId: "Kasir bertanya apakah bekal mau dihangatkan; jawab 「はい、お願いします。」 bila setuju.",
  },
  {
    id: "lis-4",
    kind: "listening",
    type: "listening",
    level: "N3",
    category: "Mendengarkan Audio",
    promptJa: "Dengarkan pengumuman stasiun dan pilih sisi pintu keluar:",
    promptId: "Di sebelah mana pintu keluar menurut audio?",
    audioText: "つぎは渋谷です。お出口は右側です。",
    options: [
      "Sebelah kanan (右側)",
      "Sebelah kiri (左側)",
      "Pintu belakang",
      "Lantai bawah tanah",
    ],
    correctAnswer: "Sebelah kanan (右側)",
    explanationId: "Pengumuman menyebut 「お出口は右側です」(migi-gawa = sebelah kanan).",
  },
];

function deterministicShuffle<T>(arr: T[], seedStr: string): T[] {
  const copy = [...arr];
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) {
    seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;
  }
  for (let i = copy.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const j = seed % (i + 1);
    const tmp = copy[i]!;
    copy[i] = copy[j]!;
    copy[j] = tmp;
  }
  return copy;
}

/**
 * Menghasilkan 20 soal Daily Test otomatis sesuai target level:
 * 50% (10 soal) SRS/review, 30% (6 soal) materi baru/susun kalimat, 20% (4 soal) audio.
 */
export function generateDailyTest(targetLevel: JlptLevel, dateKey: string): DailyTestQuestion[] {
  const srsQuestions: DailyTestQuestion[] = [];
  const prioritized = [
    ...BANK_VOCAB.filter((v) => v.level === targetLevel),
    ...BANK_VOCAB.filter((v) => v.level !== targetLevel),
  ];

  // 10 soal SRS / review (50%)
  for (let i = 0; i < 10; i++) {
    const v = prioritized[i % prioritized.length]!;
    const isGrammarBlank = v.category === "Tata Bahasa";

    if (isGrammarBlank) {
      const ans = v.term.includes("駅") ? "へ" : "を";
      srsQuestions.push({
        id: `srs-${i}`,
        kind: "srs",
        type: "mcq",
        level: v.level,
        category: "Tata Bahasa (SRS)",
        promptJa: v.term,
        promptId: `Lengkapi partikel yang tepat untuk "${v.meaning}"`,
        options: deterministicShuffle([ans, ...v.distractors], dateKey + i),
        correctAnswer: ans,
        explanationId: `Bentuk lengkapnya adalah 「${v.reading}」 yang berarti "${v.meaning}".`,
      });
    } else {
      srsQuestions.push({
        id: `srs-${i}`,
        kind: "srs",
        type: "mcq",
        level: v.level,
        category: `${v.category} (SRS)`,
        promptJa: `${v.term}（${v.reading}）`,
        promptId: `Pilih arti yang paling tepat untuk kata di atas (${v.level})`,
        options: deterministicShuffle([v.meaning, ...v.distractors], dateKey + i),
        correctAnswer: v.meaning,
        explanationId: `「${v.term}」 dibaca 「${v.reading}」 dan berarti "${v.meaning}".`,
      });
    }
  }

  // 6 soal Materi Baru: 4 Arrange + 2 MCQ Reading/Kanji (30%)
  const newQuestions: DailyTestQuestion[] = [
    ...ARRANGE_QUESTIONS,
    ...BANK_VOCAB.slice(4, 6).map((v, idx) => ({
      id: `new-mcq-${idx}`,
      kind: "new" as const,
      type: "mcq" as const,
      level: v.level,
      category: "Materi Baru",
      promptJa: v.term,
      promptId: "Bagaimana cara baca hiragana dari huruf ini?",
      options: deterministicShuffle(
        [v.reading, "きょねん", "まいにち", "せんせい"].filter((x, k, a) => a.indexOf(x) === k).slice(0, 4),
        dateKey + "new" + idx,
      ),
      correctAnswer: v.reading,
      explanationId: `Kanji 「${v.term}」 dibaca 「${v.reading}」 (${v.meaning}).`,
    })),
  ];

  // 4 soal Listening Audio (20%)
  const listening = LISTENING_QUESTIONS.slice(0, 4);

  return [...srsQuestions, ...newQuestions, ...listening];
}
