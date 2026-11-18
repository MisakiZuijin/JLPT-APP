import type { JlptLevel } from "@/lib/types";

export type StrokeSpec = {
  path: string;
  hint: string;
};

export type WritingCharacter = {
  char: string;
  scriptType: "kanji" | "hiragana" | "katakana";
  level: JlptLevel;
  reading: string;
  meaning: string;
  strokes: StrokeSpec[];
};

/**
 * Koordinat SVG distandarisasi ke viewBox 0 0 100 100 (urutan goresan KanjiVG standar).
 */
export const WRITING_CHARACTERS: WritingCharacter[] = [
  // ---------- KANJI N5 INTI (20 huruf) ----------
  {
    char: "一",
    scriptType: "kanji",
    level: "N5",
    reading: "いち / ひと(つ)",
    meaning: "satu",
    strokes: [{ path: "M 15 50 L 85 50", hint: "Tarik garis lurus mendatar dari kiri ke kanan." }],
  },
  {
    char: "二",
    scriptType: "kanji",
    level: "N5",
    reading: "に / ふた(つ)",
    meaning: "dua",
    strokes: [
      { path: "M 24 35 L 76 35", hint: "Goresan atas lebih pendek, dari kiri ke kanan." },
      { path: "M 14 68 L 86 68", hint: "Goresan bawah lebih panjang dan tegas." },
    ],
  },
  {
    char: "三",
    scriptType: "kanji",
    level: "N5",
    reading: "さん / みっ(つ)",
    meaning: "tiga",
    strokes: [
      { path: "M 26 26 L 74 26", hint: "Garis atas mendatar dari kiri ke kanan." },
      { path: "M 30 50 L 70 50", hint: "Garis tengah sedikit lebih pendek." },
      { path: "M 14 75 L 86 75", hint: "Garis bawah paling panjang." },
    ],
  },
  {
    char: "日",
    scriptType: "kanji",
    level: "N5",
    reading: "にち / ひ",
    meaning: "hari, matahari",
    strokes: [
      { path: "M 28 20 L 28 82", hint: "Garis vertikal kiri turun lurus ke bawah." },
      { path: "M 28 22 L 72 22 L 72 82", hint: "Garis atas ke kanan lalu berbelok lurus ke bawah." },
      { path: "M 28 50 L 72 50", hint: "Garis tengah dari kiri menyentuh kanan." },
      { path: "M 28 79 L 72 79", hint: "Tutup bagian bawah dari kiri ke kanan." },
    ],
  },
  {
    char: "月",
    scriptType: "kanji",
    level: "N5",
    reading: "げつ / つき",
    meaning: "bulan",
    strokes: [
      { path: "M 32 18 L 32 54 Q 32 74 18 88", hint: "Garis kiri lurus lalu melengkung ke kiri bawah." },
      { path: "M 32 20 L 70 20 L 70 84 L 60 76", hint: "Atas ke kanan lalu turun lurus dengan kait di ujung." },
      { path: "M 32 42 L 70 42", hint: "Garis horizontal dalam pertama." },
      { path: "M 31 61 L 70 61", hint: "Garis horizontal dalam kedua." },
    ],
  },
  {
    char: "火",
    scriptType: "kanji",
    level: "N5",
    reading: "か / ひ",
    meaning: "api",
    strokes: [
      { path: "M 24 34 L 32 48", hint: "Titik kiri miring ke kanan bawah." },
      { path: "M 78 30 L 66 48", hint: "Coretan kanan miring ke dalam." },
      { path: "M 50 15 L 50 48 Q 48 70 18 86", hint: "Garis tengah turun lalu sapu ke kiri bawah." },
      { path: "M 50 48 L 84 84", hint: "Sapu dari tengah miring ke kanan bawah." },
    ],
  },
  {
    char: "水",
    scriptType: "kanji",
    level: "N5",
    reading: "すい / みず",
    meaning: "air",
    strokes: [
      { path: "M 50 14 L 50 84 L 40 76", hint: "Garis vertikal tengah dengan kait kecil di dasar." },
      { path: "M 18 42 L 40 42 L 18 76", hint: "Dari kiri ke tengah lalu sapu miring ke kiri bawah." },
      { path: "M 78 28 L 54 46", hint: "Tarik singkat dari kanan atas menuju batang tengah." },
      { path: "M 52 46 L 84 78", hint: "Tarik tegas miring ke kanan bawah." },
    ],
  },
  {
    char: "木",
    scriptType: "kanji",
    level: "N5",
    reading: "もく / き",
    meaning: "pohon, kayu",
    strokes: [
      { path: "M 18 36 L 82 36", hint: "Garis horizontal melintang dari kiri ke kanan." },
      { path: "M 50 14 L 50 88", hint: "Batang vertikal lurus dari atas ke bawah." },
      { path: "M 50 36 L 18 76", hint: "Sapu miring ke kiri bawah." },
      { path: "M 50 36 L 84 76", hint: "Sapu miring ke kanan bawah." },
    ],
  },
  {
    char: "山",
    scriptType: "kanji",
    level: "N5",
    reading: "さん / やま",
    meaning: "gunung",
    strokes: [
      { path: "M 50 16 L 50 80", hint: "Puncak tengah lurus dari atas ke bawah." },
      { path: "M 22 44 L 22 80 L 78 78", hint: "Garis kiri turun lalu membelok rata ke kanan." },
      { path: "M 78 40 L 78 85", hint: "Tutup sisi kanan dari atas ke bawah." },
    ],
  },
  {
    char: "川",
    scriptType: "kanji",
    level: "N5",
    reading: "せん / かわ",
    meaning: "sungai",
    strokes: [
      { path: "M 28 20 L 28 56 Q 28 74 16 86", hint: "Aliran kiri turun lalu melengkung lembut ke kiri." },
      { path: "M 50 24 L 50 74", hint: "Aliran tengah vertikal lebih pendek." },
      { path: "M 74 16 L 74 88", hint: "Aliran kanan vertikal paling panjang." },
    ],
  },
  {
    char: "人",
    scriptType: "kanji",
    level: "N5",
    reading: "じん / ひと",
    meaning: "orang",
    strokes: [
      { path: "M 52 16 Q 48 56 16 84", hint: "Tarik dari atas tengah melengkung ke kiri bawah." },
      { path: "M 46 46 L 84 84", hint: "Tarik dari sisi batang miring ke kanan bawah." },
    ],
  },
  {
    char: "口",
    scriptType: "kanji",
    level: "N5",
    reading: "こう / くち",
    meaning: "mulut, pintu masuk",
    strokes: [
      { path: "M 22 26 L 26 78", hint: "Garis kiri agak miring sedikit ke dalam." },
      { path: "M 22 28 L 78 28 L 74 74", hint: "Atas ke kanan lalu turun membentuk sudut." },
      { path: "M 26 75 L 74 75", hint: "Tutup bagian bawah dari kiri ke kanan." },
    ],
  },
  {
    char: "大",
    scriptType: "kanji",
    level: "N5",
    reading: "だい / おお(きい)",
    meaning: "besar",
    strokes: [
      { path: "M 16 38 L 84 38", hint: "Garis horizontal dari kiri ke kanan." },
      { path: "M 50 14 Q 48 58 16 86", hint: "Batang tengah memotong lalu melengkung ke kiri." },
      { path: "M 50 42 L 84 86", hint: "Tarik miring simetris ke kanan bawah." },
    ],
  },
  {
    char: "小",
    scriptType: "kanji",
    level: "N5",
    reading: "しょう / ちい(さい)",
    meaning: "kecil",
    strokes: [
      { path: "M 50 16 L 50 84 L 38 74", hint: "Garis tengah turun lurus lalu beri kait kiri." },
      { path: "M 32 42 L 16 68", hint: "Coretan miring pendek di sisi kiri." },
      { path: "M 68 42 L 84 68", hint: "Coretan miring simetris di sisi kanan." },
    ],
  },
  {
    char: "中",
    scriptType: "kanji",
    level: "N5",
    reading: "ちゅう / なか",
    meaning: "tengah, dalam",
    strokes: [
      { path: "M 20 32 L 24 62", hint: "Sisi kiri kotak agak condong ke dalam." },
      { path: "M 20 34 L 80 34 L 76 60", hint: "Atas kanan kotak lalu turun." },
      { path: "M 24 60 L 76 60", hint: "Tutup dasar kotak." },
      { path: "M 50 12 L 50 90", hint: "Belah tengah secara vertikal dari puncak hingga bawah." },
    ],
  },
  {
    char: "上",
    scriptType: "kanji",
    level: "N5",
    reading: "じょう / うえ",
    meaning: "atas, naik",
    strokes: [
      { path: "M 48 16 L 48 80", hint: "Batang vertikal tengah lurus ke bawah." },
      { path: "M 48 44 L 78 44", hint: "Cabang horizontal pendek ke kanan." },
      { path: "M 14 80 L 86 80", hint: "Garis dasar panjang dari kiri ke kanan." },
    ],
  },
  {
    char: "下",
    scriptType: "kanji",
    level: "N5",
    reading: "か / した",
    meaning: "bawah, turun",
    strokes: [
      { path: "M 14 24 L 86 24", hint: "Garis atap panjang dari kiri ke kanan." },
      { path: "M 48 24 L 48 86", hint: "Batang vertikal turun dari tengah." },
      { path: "M 54 46 L 78 60", hint: "Titik kecil miring ke kanan bawah." },
    ],
  },
  {
    char: "本",
    scriptType: "kanji",
    level: "N5",
    reading: "ほん / もと",
    meaning: "buku, asal",
    strokes: [
      { path: "M 18 34 L 82 34", hint: "Garis horizontal atas." },
      { path: "M 50 12 L 50 88", hint: "Batang vertikal lurus." },
      { path: "M 50 34 L 16 74", hint: "Cabang miring kiri." },
      { path: "M 50 34 L 84 74", hint: "Cabang miring kanan." },
      { path: "M 32 70 L 68 70", hint: "Garis pendek horizontal di bagian bawah batang." },
    ],
  },
  {
    char: "田",
    scriptType: "kanji",
    level: "N5",
    reading: "でん / た",
    meaning: "sawah",
    strokes: [
      { path: "M 20 22 L 24 80", hint: "Sisi kiri kotak vertikal." },
      { path: "M 20 24 L 80 24 L 76 80", hint: "Atas ke kanan lalu turun." },
      { path: "M 50 24 L 50 78", hint: "Garis pembagi tengah vertikal." },
      { path: "M 22 50 L 78 50", hint: "Garis pembagi tengah horizontal." },
      { path: "M 24 78 L 76 78", hint: "Tutup sisi bawah sawah." },
    ],
  },
  {
    char: "土",
    scriptType: "kanji",
    level: "N5",
    reading: "ど / つち",
    meaning: "tanah",
    strokes: [
      { path: "M 24 44 L 76 44", hint: "Garis horizontal tengah lebih pendek." },
      { path: "M 50 16 L 50 80", hint: "Garis vertikal tengah dari atas ke bawah." },
      { path: "M 14 80 L 86 80", hint: "Garis alas paling panjang." },
    ],
  },

  // ---------- HIRAGANA DASAR (10 huruf) ----------
  {
    char: "あ",
    scriptType: "hiragana",
    level: "N5",
    reading: "a",
    meaning: "Hiragana bunyi 'a'",
    strokes: [
      { path: "M 22 30 L 74 26", hint: "Garis horizontal sedikit naik ke kanan." },
      { path: "M 48 16 Q 42 52 50 82", hint: "Garis vertikal sedikit melengkung ke bawah." },
      { path: "M 66 40 Q 40 82 22 76 Q 16 62 46 50 Q 82 48 80 72 Q 76 84 56 86", hint: "Lengkung menyilang lalu memutar besar ke kanan." },
    ],
  },
  {
    char: "い",
    scriptType: "hiragana",
    level: "N5",
    reading: "i",
    meaning: "Hiragana bunyi 'i'",
    strokes: [
      { path: "M 26 24 Q 24 62 34 78 L 44 64", hint: "Turun melengkung lembut lalu kait ke atas." },
      { path: "M 66 30 Q 78 48 76 72", hint: "Garis lengkung pendek di kanan." },
    ],
  },
  {
    char: "う",
    scriptType: "hiragana",
    level: "N5",
    reading: "u",
    meaning: "Hiragana bunyi 'u'",
    strokes: [
      { path: "M 36 18 L 62 28", hint: "Coretan atas miring ke kanan bawah." },
      { path: "M 24 46 Q 68 32 72 56 Q 72 78 38 86", hint: "Lengkung lebar ke kanan lalu turun menyapu ke bawah." },
    ],
  },
  {
    char: "え",
    scriptType: "hiragana",
    level: "N5",
    reading: "e",
    meaning: "Hiragana bunyi 'e'",
    strokes: [
      { path: "M 36 18 L 62 28", hint: "Titik miring pendek di bagian atas." },
      { path: "M 24 46 L 68 42 L 26 78 Q 52 60 60 76 Q 66 84 82 80", hint: "Z-zig-zag lalu ekor mendatar ke kanan." },
    ],
  },
  {
    char: "お",
    scriptType: "hiragana",
    level: "N5",
    reading: "o",
    meaning: "Hiragana bunyi 'o'",
    strokes: [
      { path: "M 20 34 L 56 30", hint: "Garis horizontal pendek." },
      { path: "M 38 16 L 38 78 Q 22 86 22 72 Q 36 52 72 56 Q 86 70 68 84", hint: "Vertikal lalu putaran lingkaran kanan bawah." },
      { path: "M 68 24 L 82 36", hint: "Titik penutup di kanan atas." },
    ],
  },
  {
    char: "か",
    scriptType: "hiragana",
    level: "N5",
    reading: "ka",
    meaning: "Hiragana bunyi 'ka'",
    strokes: [
      { path: "M 20 42 Q 56 34 58 58 Q 58 80 44 76", hint: "Horizontal ke kanan lalu belok turun dengan kait." },
      { path: "M 42 18 L 24 80", hint: "Tarik menyilang miring ke kiri bawah." },
      { path: "M 68 30 L 84 56", hint: "Coretan miring di sisi kanan." },
    ],
  },
  {
    char: "き",
    scriptType: "hiragana",
    level: "N5",
    reading: "ki",
    meaning: "Hiragana bunyi 'ki'",
    strokes: [
      { path: "M 24 34 L 74 28", hint: "Garis melintang pertama." },
      { path: "M 22 52 L 76 46", hint: "Garis melintang kedua sejajar." },
      { path: "M 42 18 L 62 66", hint: "Garis miring ke kanan bawah menyilang kedua garis." },
      { path: "M 30 72 Q 40 86 68 82", hint: "Lengkung senyum lembut di dasar." },
    ],
  },
  {
    char: "く",
    scriptType: "hiragana",
    level: "N5",
    reading: "ku",
    meaning: "Hiragana bunyi 'ku'",
    strokes: [{ path: "M 64 16 L 26 50 L 66 86", hint: "Satu goresan menyudut tajam ke kiri lalu kanan bawah." }],
  },
  {
    char: "こ",
    scriptType: "hiragana",
    level: "N5",
    reading: "ko",
    meaning: "Hiragana bunyi 'ko'",
    strokes: [
      { path: "M 28 28 Q 52 24 68 32", hint: "Lengkungan datar pendek di atas." },
      { path: "M 26 68 Q 48 82 76 74", hint: "Lengkungan senyum datar di bawah." },
    ],
  },
  {
    char: "し",
    scriptType: "hiragana",
    level: "N5",
    reading: "shi",
    meaning: "Hiragana bunyi 'shi'",
    strokes: [{ path: "M 34 18 L 34 64 Q 34 86 78 72", hint: "Satu goresan vertikal turun lalu melengkung naik ke kanan." }],
  },

  // ---------- KATAKANA DASAR (5 huruf pembuka) ----------
  {
    char: "ア",
    scriptType: "katakana",
    level: "N5",
    reading: "a",
    meaning: "Katakana bunyi 'a'",
    strokes: [
      { path: "M 18 24 L 82 24 L 58 50", hint: "Horizontal ke kanan lalu patah miring ke tengah." },
      { path: "M 48 40 Q 46 68 24 86", hint: "Turun dari tengah melengkung ke kiri bawah." },
    ],
  },
  {
    char: "イ",
    scriptType: "katakana",
    level: "N5",
    reading: "i",
    meaning: "Katakana bunyi 'i'",
    strokes: [
      { path: "M 72 18 Q 50 42 18 58", hint: "Sapu miring dari kanan atas ke kiri." },
      { path: "M 52 44 L 52 86", hint: "Garis vertikal lurus ke bawah." },
    ],
  },
  {
    char: "ウ",
    scriptType: "katakana",
    level: "N5",
    reading: "u",
    meaning: "Katakana bunyi 'u'",
    strokes: [
      { path: "M 50 14 L 50 32", hint: "Garis vertikal pendek di puncak tengah." },
      { path: "M 22 32 L 22 52", hint: "Dinding pendek kiri." },
      { path: "M 22 34 L 78 34 Q 76 70 36 86", hint: "Atas ke kanan lalu turun melengkung ke kiri bawah." },
    ],
  },
  {
    char: "エ",
    scriptType: "katakana",
    level: "N5",
    reading: "e",
    meaning: "Katakana bunyi 'e'",
    strokes: [
      { path: "M 24 26 L 76 26", hint: "Garis horizontal atas." },
      { path: "M 50 26 L 50 76", hint: "Tiang vertikal tengah." },
      { path: "M 16 76 L 84 76", hint: "Garis horizontal bawah." },
    ],
  },
  {
    char: "オ",
    scriptType: "katakana",
    level: "N5",
    reading: "o",
    meaning: "Katakana bunyi 'o'",
    strokes: [
      { path: "M 18 36 L 82 36", hint: "Garis horizontal melintang." },
      { path: "M 58 14 L 58 84 L 46 74", hint: "Tiang vertikal kanan dengan kait kecil." },
      { path: "M 58 36 L 20 74", hint: "Sapu miring dari persimpangan ke kiri bawah." },
    ],
  },
];
