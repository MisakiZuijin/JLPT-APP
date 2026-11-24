import type {
  CurriculumStage,
  FuriganaMode,
  JlptLevel,
  LearningGoal,
  PlacementScore,
  StudyMinutesDaily,
} from "@/lib/types";

export type PlacementBlockId = "kana" | "n5" | "n4" | "n3_n2";

export type PlacementQuestion = {
  id: string;
  block: PlacementBlockId;
  blockLabel: string;
  levelTag: string;
  instructionId: string;
  promptJa: string;
  options: readonly [string, string, string, string];
  answerIndex: 0 | 1 | 2 | 3;
};

export type BlockMeta = {
  id: PlacementBlockId;
  title: string;
  subtitle: string;
  questionCount: number;
};

export const PLACEMENT_BLOCKS: readonly BlockMeta[] = [
  {
    id: "kana",
    title: "Bagian 1 · Huruf Kana",
    subtitle: "Hiragana, bunyi ganda, dan Katakana dasar",
    questionCount: 3,
  },
  {
    id: "n5",
    title: "Bagian 2 · Dasar N5",
    subtitle: "Partikel dasar, Kanji harian, dan kata kerja sopan",
    questionCount: 4,
  },
  {
    id: "n4",
    title: "Bagian 3 · Menengah Awal N4",
    subtitle: "Bentuk potensial, memberi-menerima jasa, pasif, dan bahasa sopan",
    questionCount: 4,
  },
  {
    id: "n3_n2",
    title: "Bagian 4 · Lanjutan N3–N2",
    subtitle: "Hubungan sebab-akibat, dugaan, dan ungkapan formal",
    questionCount: 4,
  },
];

/**
 * 15 soal orisinal untuk Tes Penempatan Adaptif (Blok 1–4).
 * Disusun khusus untuk mengevaluasi kemampuan awal pelajar tanpa menyalin soal resmi ujian.
 */
export const PLACEMENT_QUESTIONS: readonly PlacementQuestion[] = [
  // ---------- BLOK 1: KANA (3 soal) ----------
  {
    id: "p01",
    block: "kana",
    blockLabel: "Bagian 1 · Huruf Kana",
    levelTag: "Pra-N5",
    instructionId: "Pilih cara baca yang benar untuk kata Hiragana berikut:",
    promptJa: "せんせい",
    options: ["sensei", "senzai", "shinsei", "sekai"],
    answerIndex: 0,
  },
  {
    id: "p02",
    block: "kana",
    blockLabel: "Bagian 1 · Huruf Kana",
    levelTag: "Pra-N5",
    instructionId: "Manakah cara baca yang tepat untuk bunyi konsonan ganda (っ) ini?",
    promptJa: "きって",
    options: ["kite", "kitte", "kito", "kitsu"],
    answerIndex: 1,
  },
  {
    id: "p03",
    block: "kana",
    blockLabel: "Bagian 1 · Huruf Kana",
    levelTag: "Pra-N5",
    instructionId: "Apa arti kata Katakana yang sering ditemui di Jepang ini?",
    promptJa: "コンビニ",
    options: ["Komputer", "Konser", "Minimarket", "Kantor pos"],
    answerIndex: 2,
  },

  // ---------- BLOK 2: JLPT N5 (4 soal) ----------
  {
    id: "p04",
    block: "n5",
    blockLabel: "Bagian 2 · Dasar N5",
    levelTag: "N5",
    instructionId: "Pilih partikel yang tepat untuk melengkapi kalimat berikut:",
    promptJa: "わたしは としょかん（　）にほんごを べんきょうします。",
    options: ["に", "で", "を", "へ"],
    answerIndex: 1,
  },
  {
    id: "p05",
    block: "n5",
    blockLabel: "Bagian 2 · Dasar N5",
    levelTag: "N5",
    instructionId: "Pilih cara baca dan arti yang tepat untuk Kanji di dalam kurung:",
    promptJa: "【毎日】あさ ごはんを たべます。",
    options: [
      "まいにち (setiap hari)",
      "まいあさ (setiap pagi)",
      "きょう (hari ini)",
      "あした (besok)",
    ],
    answerIndex: 0,
  },
  {
    id: "p06",
    block: "n5",
    blockLabel: "Bagian 2 · Dasar N5",
    levelTag: "N5",
    instructionId: "Pilih bentuk kata kerja lampau negatif yang tepat:",
    promptJa: "きのうは いそがしかったですから、テレビを（　）。",
    options: ["みません", "みました", "みませんでした", "みます"],
    answerIndex: 2,
  },
  {
    id: "p07",
    block: "n5",
    blockLabel: "Bagian 2 · Dasar N5",
    levelTag: "N5",
    instructionId: "Pilih bentuk て yang benar untuk meminta tolong dengan sopan:",
    promptJa: "すみません、ここに なまえを（　）ください。",
    options: ["かき", "かいて", "かって", "かいで"],
    answerIndex: 1,
  },

  // ---------- BLOK 3: JLPT N4 (4 soal) ----------
  {
    id: "p08",
    block: "n4",
    blockLabel: "Bagian 3 · Menengah Awal N4",
    levelTag: "N4",
    instructionId: "Pilih bentuk potensial (kemampuan) yang tepat untuk kalimat ini:",
    promptJa: "たくさん 練習したので、日本語の 新聞が（　）ようになりました。",
    options: ["読める", "読む", "読まれる", "読ませる"],
    answerIndex: 0,
  },
  {
    id: "p09",
    block: "n4",
    blockLabel: "Bagian 3 · Menengah Awal N4",
    levelTag: "N4",
    instructionId: "Senior membantu saya bekerja. Pilih kata kerja arah penerima yang tepat:",
    promptJa: "先輩が 私の 仕事を 手伝って（　）。",
    options: ["あげました", "やりました", "くれました", "さしあげました"],
    answerIndex: 2,
  },
  {
    id: "p10",
    block: "n4",
    blockLabel: "Bagian 3 · Menengah Awal N4",
    levelTag: "N4",
    instructionId: "Pilih bentuk pasif yang sesuai dengan nuansa terkena hujan:",
    promptJa: "かさが なくて、雨に（　）服が ぬれてしまいました。",
    options: ["降って", "降られて", "降らせて", "降れて"],
    answerIndex: 1,
  },
  {
    id: "p11",
    block: "n4",
    blockLabel: "Bagian 3 · Menengah Awal N4",
    levelTag: "N4",
    instructionId: "Pilih bentuk hormat (Sonkeigo) untuk menanyakan keberadaan atasan:",
    promptJa: "すみません、部長は もう 会社に（　）か。",
    options: ["まいります", "おります", "いたします", "いらっしゃいます"],
    answerIndex: 3,
  },

  // ---------- BLOK 4: JLPT N3 / N2 (4 soal) ----------
  {
    id: "p12",
    block: "n3_n2",
    blockLabel: "Bagian 4 · Lanjutan N3–N2",
    levelTag: "N3",
    instructionId: "Pilih penghubung sebab-akibat bernuansa negatif yang tepat:",
    promptJa: "強い 台風が 来た（　）、電車が すべて 止まってしまった。",
    options: ["おかげで", "せいで", "ために", "くせに"],
    answerIndex: 1,
  },
  {
    id: "p13",
    block: "n3_n2",
    blockLabel: "Bagian 4 · Lanjutan N3–N2",
    levelTag: "N3",
    instructionId: "Pilih pola dugaan yang paling alami dari bukti jalanan yang basah:",
    promptJa: "道が ぬれているから、さっきまで 雨が 降っていた（　）。",
    options: ["ようだ", "そうだ", "はずがない", "わけではない"],
    answerIndex: 0,
  },
  {
    id: "p14",
    block: "n3_n2",
    blockLabel: "Bagian 4 · Lanjutan N3–N2",
    levelTag: "N2",
    instructionId: "Pilih pola formal N2 yang berarti 'pada kesempatan / menjelang memulai':",
    promptJa: "新しい プロジェクトを 始める（　）、全員で 目標を 確認した。",
    options: ["にかけて", "にあたって", "につれて", "にしたがって"],
    answerIndex: 1,
  },
  {
    id: "p15",
    block: "n3_n2",
    blockLabel: "Bagian 4 · Lanjutan N3–N2",
    levelTag: "N2",
    instructionId: "Pilih pola N2 yang berarti 'tidak mungkin tidak / mau tidak mau harus':",
    promptJa: "自分で 約束したからには、たとえ 忙しくても 行かない（　）。",
    options: ["わけがない", "ことはない", "わけにはいかない", "わけではない"],
    answerIndex: 2,
  },
];

export type StageMetadata = {
  stage: CurriculumStage;
  shortLabel: string;
  title: string;
  subtitle: string;
  targetLevel: JlptLevel;
  defaultUnitCode: string;
  romajiEnabled: boolean;
  furiganaMode: FuriganaMode;
  estimatedHours: number;
};

export const STAGE_METADATA: Record<CurriculumStage, StageMetadata> = {
  PRE_N5: {
    stage: "PRE_N5",
    shortLabel: "Tahap 0 · Pra-N5",
    title: "Fondasi Huruf Kana & Bunyi",
    subtitle: "Mulai dari 46 Hiragana, 46 Katakana, bunyi khusus, dan salam dasar.",
    targetLevel: "N5",
    defaultUnitCode: "0.1",
    romajiEnabled: true,
    furiganaMode: "all",
    estimatedHours: 35,
  },
  N5: {
    stage: "N5",
    shortLabel: "Tahap 1 · JLPT N5",
    title: "Dasar Percakapan & 110 Kanji",
    subtitle: "8 bab tematik, ~800 kosakata inti, konjugasi dasar, dan bacaan harian.",
    targetLevel: "N5",
    defaultUnitCode: "1.1",
    romajiEnabled: false,
    furiganaMode: "all",
    estimatedHours: 320,
  },
  N4: {
    stage: "N4",
    shortLabel: "Tahap 2 · JLPT N4",
    title: "Dasar Lanjutan & Siap Kerja",
    subtitle: "6 bab N4, bentuk potensial/pasif/kausatif, Keigo dasar, dan etika kerja.",
    targetLevel: "N4",
    defaultUnitCode: "2.1",
    romajiEnabled: false,
    furiganaMode: "smart",
    estimatedHours: 350,
  },
  N3: {
    stage: "N3",
    shortLabel: "Tahap 3 · JLPT N3",
    title: "Menengah & Bacaan Berita",
    subtitle: "Ragam lisan alami, sebab-akibat, wacana menengah, dan 650 Kanji.",
    targetLevel: "N3",
    defaultUnitCode: "3.1",
    romajiEnabled: false,
    furiganaMode: "smart",
    estimatedHours: 450,
  },
  N2: {
    stage: "N2",
    shortLabel: "Tahap 4 · JLPT N2",
    title: "Menengah Lanjutan & Bisnis",
    subtitle: "Ekspresi tulis formal, Keigo bisnis, bacaan opini panjang, dan 1.000 Kanji.",
    targetLevel: "N2",
    defaultUnitCode: "4.1",
    romajiEnabled: false,
    furiganaMode: "smart",
    estimatedHours: 600,
  },
  N1: {
    stage: "N1",
    shortLabel: "Tahap 5 · JLPT N1",
    title: "Tingkat Mahir & Akademis",
    subtitle: "Wacana akademis, argumen kritis, dan 2.000+ Joyo Kanji.",
    targetLevel: "N1",
    defaultUnitCode: "5.1",
    romajiEnabled: false,
    furiganaMode: "off",
    estimatedHours: 900,
  },
};

export const STAGE_ORDER: readonly CurriculumStage[] = [
  "PRE_N5",
  "N5",
  "N4",
  "N3",
  "N2",
  "N1",
];

export type PlacementEvaluation = {
  recommendedStage: CurriculumStage;
  recommendedUnitCode: string;
  stoppedEarlyAt: PlacementBlockId | null;
  totalAnswered: number;
  totalCorrect: number;
  breakdown: Record<PlacementBlockId, { correct: number; total: number }>;
  summaryMessage: string;
  placementScore: PlacementScore;
};

/**
 * Memeriksa apakah tes perlu berhenti cepat (early-stop) setelah menyelesaikan suatu blok.
 */
export function shouldEarlyStopAfterBlock(
  blockId: PlacementBlockId,
  answers: Record<string, number>,
): boolean {
  const blockQuestions = PLACEMENT_QUESTIONS.filter((q) => q.block === blockId);
  const correct = blockQuestions.filter(
    (q) => answers[q.id] === q.answerIndex,
  ).length;
  return correct / blockQuestions.length < 0.5;
}

export function getQuestionsByBlock(blockId: PlacementBlockId): PlacementQuestion[] {
  return PLACEMENT_QUESTIONS.filter((q) => q.block === blockId);
}

/**
 * Menghitung rekomendasi tahap dan unit awal dari jawaban tes penempatan.
 */
export function evaluatePlacementAnswers(
  answers: Record<string, number>,
  stoppedEarlyAt: PlacementBlockId | null = null,
): PlacementEvaluation {
  const breakdown: Record<PlacementBlockId, { correct: number; total: number }> = {
    kana: { correct: 0, total: 0 },
    n5: { correct: 0, total: 0 },
    n4: { correct: 0, total: 0 },
    n3_n2: { correct: 0, total: 0 },
  };

  let totalAnswered = 0;
  let totalCorrect = 0;

  for (const q of PLACEMENT_QUESTIONS) {
    const selected = answers[q.id];
    if (typeof selected === "number") {
      breakdown[q.block].total += 1;
      totalAnswered += 1;
      if (selected === q.answerIndex) {
        breakdown[q.block].correct += 1;
        totalCorrect += 1;
      }
    }
  }

  let recommendedStage: CurriculumStage = "PRE_N5";
  let recommendedUnitCode = "0.1";
  let summaryMessage =
    "Fondasi huruf Kana masih perlu diperkuat terlebih dahulu agar membaca kalimat terasa nyaman.";

  const kanaPassed = breakdown.kana.total > 0 && breakdown.kana.correct >= 2;
  const n5Passed = breakdown.n5.total > 0 && breakdown.n5.correct >= 2;
  const n4Passed = breakdown.n4.total > 0 && breakdown.n4.correct >= 2;

  if (!kanaPassed) {
    recommendedStage = "PRE_N5";
    recommendedUnitCode = "0.1";
    summaryMessage =
      "Kamu cocok memulai dari Tahap 0 (Pra-N5) untuk memantapkan bacaan Hiragana, bunyi ganda, dan Katakana.";
  } else if (!n5Passed) {
    recommendedStage = "N5";
    recommendedUnitCode = "1.1";
    summaryMessage =
      "Huruf Kanamu sudah cukup baik! Kamu bisa langsung masuk ke Tahap 1 (JLPT N5) mulai dari Bab 1.1.";
  } else if (!n4Passed) {
    recommendedStage = "N5";
    recommendedUnitCode = breakdown.n5.correct >= 3 ? "1.5" : "1.1";
    summaryMessage =
      breakdown.n5.correct >= 3
        ? "Dasar N5 awalmu sudah kuat. Kami sarankan mulai dari paruh kedua N5 (Bab 1.5) untuk memantapkan bentuk て dan persiapan N4."
        : "Dasar Kanamu sudah mantap dan sebagian pola N5 sudah dikenal. Mulai dari Tahap 1 (JLPT N5) agar fondasi tata bahasamu rapi.";
  } else {
    // Lolos Kana, N5, dan N4 -> cek skor Blok 4 (N3/N2)
    if (breakdown.n3_n2.correct >= 4) {
      recommendedStage = "N2";
      recommendedUnitCode = "4.1";
      summaryMessage =
        "Pemahaman dasar hingga N3-mu sangat kuat! Kamu direkomendasikan mulai dari Tahap 4 (JLPT N2).";
    } else if (breakdown.n3_n2.correct >= 2) {
      recommendedStage = "N3";
      recommendedUnitCode = "3.1";
      summaryMessage =
        "Fondasi N5 dan N4-mu sudah sangat baik. Kamu siap melangkah ke Tahap 3 (JLPT N3).";
    } else {
      recommendedStage = "N4";
      recommendedUnitCode = "2.1";
      summaryMessage =
        "Fondasi N5-mu sudah lulus dengan baik! Kamu direkomendasikan langsung memulai dari Tahap 2 (JLPT N4).";
    }
  }

  const placementScore: PlacementScore = {
    total: totalAnswered,
    correct: totalCorrect,
    recommended_stage: recommendedStage,
    breakdown,
    taken_at: new Date().toISOString(),
  };

  return {
    recommendedStage,
    recommendedUnitCode,
    stoppedEarlyAt,
    totalAnswered,
    totalCorrect,
    breakdown,
    summaryMessage,
    placementScore,
  };
}

/**
 * Mengembalikan opsi tahap yang sama atau lebih rendah (opt-down)
 * agar pelajar selalu bisa memilih mengulang fondasi bila merasa ragu.
 */
export function getSelectableStagesUpTo(
  recommendedStage: CurriculumStage,
): StageMetadata[] {
  const maxIdx = STAGE_ORDER.indexOf(recommendedStage);
  return STAGE_ORDER.slice(0, Math.max(maxIdx + 1, 1)).map(
    (st) => STAGE_METADATA[st],
  );
}

export type StudyPaceOption = {
  minutes: StudyMinutesDaily;
  dailyNewLimit: number;
  title: string;
  subtitle: string;
  badge: string;
};

export const STUDY_PACE_OPTIONS: readonly StudyPaceOption[] = [
  {
    minutes: 15,
    dailyNewLimit: 5,
    title: "Ringan",
    subtitle: "Cocok sambil sekolah atau bekerja penuh waktu.",
    badge: "15 mnt/hari · 5 kartu baru",
  },
  {
    minutes: 30,
    dailyNewLimit: 10,
    title: "Standar Terarah",
    subtitle: "Ritme seimbang paling direkomendasikan untuk konsistensi harian.",
    badge: "30 mnt/hari · 10 kartu baru",
  },
  {
    minutes: 60,
    dailyNewLimit: 20,
    title: "Intensif Persiapan Ujian",
    subtitle: "Untuk target cepat mengejar jadwal ujian atau keberangkatan kerja.",
    badge: "60 mnt/hari · 20 kartu baru",
  },
];

export function getDailyNewLimitForMinutes(minutes: StudyMinutesDaily): number {
  const found = STUDY_PACE_OPTIONS.find((p) => p.minutes === minutes);
  return found ? found.dailyNewLimit : 10;
}

export function estimateWeeksToCompleteStage(
  stage: CurriculumStage,
  studyMinutesDaily: StudyMinutesDaily,
): number {
  const hours = STAGE_METADATA[stage].estimatedHours;
  const hoursPerWeek = (studyMinutesDaily * 7) / 60;
  return Math.max(2, Math.ceil(hours / hoursPerWeek));
}

export type ExamPeriodOption = {
  value: string;
  label: string;
  hint: string;
};

/**
 * Menghasilkan pilihan periode ujian JLPT resmi (Juli & Desember) ke depan
 * secara dinamis berdasarkan tanggal saat ini.
 */
export function getUpcomingExamPeriods(now = new Date()): ExamPeriodOption[] {
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1..12
  const periods: ExamPeriodOption[] = [];

  const candidates: { y: number; m: 7 | 12 }[] = [];
  if (month <= 5) {
    candidates.push({ y: year, m: 7 }, { y: year, m: 12 }, { y: year + 1, m: 7 });
  } else if (month <= 10) {
    candidates.push({ y: year, m: 12 }, { y: year + 1, m: 7 }, { y: year + 1, m: 12 });
  } else {
    candidates.push({ y: year + 1, m: 7 }, { y: year + 1, m: 12 }, { y: year + 2, m: 7 });
  }

  for (const c of candidates) {
    const val = `${c.y}-${c.m === 7 ? "07" : "12"}`;
    const monthName = c.m === 7 ? "Juli" : "Desember";
    periods.push({
      value: val,
      label: `JLPT ${monthName} ${c.y}`,
      hint: c.m === 7 ? "Gelombang pertama" : "Gelombang kedua",
    });
  }

  periods.push({
    value: "",
    label: "Belajar santai tanpa tanggal target",
    hint: "Fokus penguasaan materi tanpa tekanan jadwal",
  });

  return periods;
}

export type LearningGoalOption = {
  id: LearningGoal;
  title: string;
  subtitle: string;
  highlight: string;
};

export const LEARNING_GOAL_OPTIONS: readonly LearningGoalOption[] = [
  {
    id: "jlpt",
    title: "Persiapan Ujian JLPT N5–N1",
    subtitle: "Fokus terstruktur pada kosakata, Kanji, tata bahasa, bacaan, dan mendengarkan.",
    highlight: "Prioritas simulasi & nilai lulus tiap bagian",
  },
  {
    id: "work_ssw",
    title: "Kerja ke Jepang / Magang / SSW",
    subtitle: "Cocok untuk persiapan Tokutei Ginou, JFT-Basic A2, dan wawancara kerja.",
    highlight: "Porsi lebih banyak untuk percakapan kerja, Keigo & budaya",
  },
  {
    id: "study_jp",
    title: "Kuliah & Beasiswa di Jepang",
    subtitle: "Membangun fondasi bacaan, tata bahasa rapi, dan pemahaman wacana panjang.",
    highlight: "Fokus kecepatan baca, Kanji, dan menulis rapi",
  },
  {
    id: "general",
    title: "Komunikasi Sehari-hari & Mandiri",
    subtitle: "Belajar bahasa Jepang untuk wisata, hobi, dan percakapan sehari-hari.",
    highlight: "Seimbang antara bacaan ringan, audio, dan dialog harian",
  },
];
