import { isRomaji, toHiragana } from "wanakana";

export type SpeechComparisonResult = {
  score: number;
  passed: boolean;
  normalizedTranscript: string;
  normalizedTarget: string;
  feedback: string;
};

const COMMON_STT_KANJI_TO_KANA: [string, string][] = [
  ["おはようございます", "おはようございます"],
  ["ありがとうございます", "ありがとうございます"],
  ["よろしくお願いします", "よろしくおねがいします"],
  ["お願い", "おねがい"],
  ["弁当", "べんとう"],
  ["温め", "あたため"],
  ["学生", "がくせい"],
  ["先生", "せんせい"],
  ["日本語", "にほんご"],
  ["日本", "にほん"],
  ["仕事", "しごと"],
  ["終わ", "おわ"],
  ["確認", "かくにん"],
  ["失礼", "しつれい"],
  ["電車", "でんしゃ"],
  ["駅", "えき"],
  ["私", "わたし"],
  ["今日", "きょう"],
  ["明日", "あした"],
  ["水", "みず"],
  ["食べ", "たべ"],
  ["飲み", "のみ"],
  ["大丈夫", "だいじょうぶ"],
  ["名前", "なまえ"],
  ["インドネシア", "いんどねしあ"],
  ["東京駅", "とうきょうえき"],
  ["東京", "とうきょう"],
  ["一膳", "いちぜん"],
  ["一つ", "ひとつ"],
  ["来ました", "きました"],
  ["勉強", "べんきょう"],
  ["三か月", "さんかげつ"],
  ["三ヶ月", "さんかげつ"],
  ["3ヶ月", "さんかげつ"],
  ["毎日", "まいにち"],
  ["頑張ります", "がんばります"],
  ["作業", "さぎょう"],
];

function stripNoise(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[\s\u3000。、．，！？!?,.'"\-「」『』（）()・〜~]/g, "");
}

export function normalizeToHiragana(raw: string): string {
  let s = stripNoise(raw);
  if (!s) return "";

  if (isRomaji(s)) {
    s = toHiragana(s);
  } else {
    s = toHiragana(s);
  }

  for (const [kanji, kana] of COMMON_STT_KANJI_TO_KANA) {
    if (s.includes(kanji)) {
      s = s.split(kanji).join(kana);
    }
  }

  // Konversi tanda panjang katakana "ー" di posisi tengah jika tersisa
  return s.replace(/ー/g, "");
}

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const dp = new Array<number>(b.length + 1);
  for (let j = 0; j <= b.length; j++) dp[j] = j;

  for (let i = 1; i <= a.length; i++) {
    let prev = i - 1;
    dp[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const temp = dp[j]!;
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[j] = Math.min(dp[j]! + 1, dp[j - 1]! + 1, prev + cost);
      prev = temp;
    }
  }

  return dp[b.length]!;
}

/**
 * Membandingkan transkrip suara user vs target kalimat Jepang (lulus jika skor ≥ 85%).
 */
export function compareJapaneseSpeech(
  transcript: string,
  targetReading: string,
  targetTerm?: string,
  passThreshold = 85,
): SpeechComparisonResult {
  const cleanRawTranscript = stripNoise(transcript);
  const cleanRawTerm = targetTerm ? stripNoise(targetTerm) : "";
  const normalizedTarget = normalizeToHiragana(targetReading);

  if (!cleanRawTranscript) {
    return {
      score: 0,
      passed: false,
      normalizedTranscript: "",
      normalizedTarget,
      feedback: "Suara belum tertangkap jelas. Dekatkan mikrofon lalu coba ucapkan lagi.",
    };
  }

  // Jika hasil STT berhuruf kanji sama persis dengan targetTerm -> cocok 100%
  if (cleanRawTerm && cleanRawTranscript === cleanRawTerm) {
    return {
      score: 100,
      passed: true,
      normalizedTranscript: normalizedTarget,
      normalizedTarget,
      feedback: "Pelafalan sangat tepat (100%)!",
    };
  }

  const normalizedTranscript = normalizeToHiragana(transcript);
  const maxLen = Math.max(normalizedTarget.length, normalizedTranscript.length, 1);
  const dist = levenshtein(normalizedTranscript, normalizedTarget);
  const score = Math.max(0, Math.min(100, Math.round((1 - dist / maxLen) * 100)));
  const passed = score >= passThreshold;

  let feedback = "";
  if (score >= 95) {
    feedback = "Luar biasa! Pelafalanmu bersih dan akurat.";
  } else if (passed) {
    feedback = `Bagus! Skor ${score}% sudah memenuhi batas lulus (≥ ${passThreshold}%).`;
  } else if (score >= 65) {
    feedback = `Hampir tepat (${score}%). Dengarkan contoh sekali lagi lalu perhatikan panjang bunyi vokal.`;
  } else {
    feedback = `Skor ${score}% masih di bawah ${passThreshold}%. Coba aktifkan tempo lambat (0.75x) dan tirukan perlahan.`;
  }

  return {
    score,
    passed,
    normalizedTranscript,
    normalizedTarget,
    feedback,
  };
}
