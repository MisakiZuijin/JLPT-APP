import type { JlptLevel } from "@/lib/types";

export type BunpouExercise = {
  id: string;
  level: JlptLevel;
  formula: string;
  promptId: string;
  tokens: string[];
  correctTokens: string[];
  politeForm: string;
  casualForm: string;
  explanationId: string;
};

export const BUNPOU_EXERCISES: BunpouExercise[] = [
  {
    id: "bp-n5-de-wo",
    level: "N5",
    formula: "[TEMPAT] で [OBJEK] を [KATA KERJA]",
    promptId: "Saya belajar bahasa Jepang di kelas.",
    tokens: ["日本語を", "クラスで", "勉強します。", "私は"],
    correctTokens: ["私は", "クラスで", "日本語を", "勉強します。"],
    politeForm: "私は クラスで 日本語を 勉強します。",
    casualForm: "私は クラスで 日本語を 勉強する。",
    explanationId: "Partikel で menandai tempat dilakukannya kegiatan aktif, bukan keberadaan.",
  },
  {
    id: "bp-n5-te-kudasai",
    level: "N5",
    formula: "[KATA KERJA Bentuk-て] + ください",
    promptId: "Tolong tulis nama di sini.",
    tokens: ["ここに", "ください。", "書いて", "名前を"],
    correctTokens: ["ここに", "名前を", "書いて", "ください。"],
    politeForm: "ここに 名前を 書いて ください。",
    casualForm: "ここに 名前を 書いて。",
    explanationId: "Verba 書く berubah ke bentuk-て menjadi 書いて lalu ditambah ください untuk permintaan sopan.",
  },
  {
    id: "bp-n4-hougaii",
    level: "N4",
    formula: "[KATA KERJA Bentuk-た] + ほうが いいです",
    promptId: "Sebaiknya minum obat lebih cepat.",
    tokens: ["早く", "いいです。", "飲んだ", "薬を", "ほうが"],
    correctTokens: ["早く", "薬を", "飲んだ", "ほうが", "いいです。"],
    politeForm: "早く 薬を 飲んだ ほうが いいです。",
    casualForm: "早く 薬を 飲んだ ほうが いいよ。",
    explanationId: "Memberikan nasihat/saran positif menggunakan bentuk lampau (飲んだ) + ほうがいい.",
  },
  {
    id: "bp-n3-tame",
    level: "N3",
    formula: "[TUJUAN / KATA KERJA Kamus] + ために",
    promptId: "Saya belajar setiap hari demi lulus JLPT.",
    tokens: ["毎日", "合格する", "JLPTに", "勉強しています。", "ために"],
    correctTokens: ["JLPTに", "合格する", "ために", "毎日", "勉強しています。"],
    politeForm: "JLPTに 合格する ために 毎日 勉強しています。",
    casualForm: "JLPTに 合格する ために 毎日 勉強している。",
    explanationId: "「〜ために」 setelah kata kerja bentuk kamus menyatakan tujuan yang diusahakan secara sadar.",
  },
  {
    id: "bp-n2-keigo",
    level: "N2",
    formula: "ご + [KATA BENDA KANJI] + お願いいたします (Keigo)",
    promptId: "Mohon pengecekan atas dokumen ini (ragam sopan bisnis).",
    tokens: ["この書類の", "お願いいたします。", "ご確認を"],
    correctTokens: ["この書類の", "ご確認を", "お願いいたします。"],
    politeForm: "この書類の ご確認を お願いいたします。",
    casualForm: "この書類を 確認して ほしい。",
    explanationId: "Prefiks ご + nomina sino-Jepang (確認) + お願いいたします adalah standar sopan dunia kerja Jepang.",
  },
];
