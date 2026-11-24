"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toKatakana } from "wanakana";
import { speakJapanese } from "@/lib/audio";
import {
  IconArrowRight,
  IconBook,
  IconVolume,
} from "@/components/ui/Icons";

type ScriptMode = "all" | "hiragana" | "katakana";
type KanaGroup = "basic" | "dakuon" | "youon";

type KanaEntry = {
  hira: string;
  romaji: string;
  exampleJa: string;
  exampleId: string;
  note: string;
};

const BASIC_ROWS: (string | null)[][] = [
  ["あ", "い", "う", "え", "お"],
  ["か", "き", "く", "け", "こ"],
  ["さ", "し", "す", "せ", "そ"],
  ["た", "ち", "つ", "て", "と"],
  ["な", "に", "ぬ", "ね", "の"],
  ["は", "ひ", "ふ", "へ", "ほ"],
  ["ま", "み", "む", "め", "も"],
  ["や", null, "ゆ", null, "よ"],
  ["ら", "り", "る", "れ", "ろ"],
  ["わ", null, "を", null, "ん"],
];

const DAKUON_ROWS: (string | null)[][] = [
  ["が", "ぎ", "ぐ", "げ", "ご"],
  ["ざ", "じ", "ず", "ぜ", "ぞ"],
  ["だ", "ぢ", "づ", "で", "ど"],
  ["ば", "び", "ぶ", "べ", "ぼ"],
  ["ぱ", "ぴ", "ぷ", "ぺ", "ぽ"],
];

const YOUON_ROWS: (string | null)[][] = [
  ["きゃ", "きゅ", "きょ"],
  ["しゃ", "しゅ", "しょ"],
  ["ちゃ", "ちゅ", "ちょ"],
  ["にゃ", "にゅ", "にょ"],
  ["ひゃ", "ひゅ", "ひょ"],
  ["みゃ", "みゅ", "みょ"],
  ["りゃ", "りゅ", "りょ"],
  ["ぎゃ", "ぎゅ", "ぎょ"],
  ["じゃ", "じゅ", "じょ"],
  ["びゃ", "びゅ", "びょ"],
  ["ぴゃ", "ぴゅ", "ぴょ"],
];

const ROMAJI_MAP: Record<string, string> = {
  あ: "a", い: "i", う: "u", え: "e", お: "o",
  か: "ka", き: "ki", く: "ku", け: "ke", こ: "ko",
  さ: "sa", し: "shi", す: "su", せ: "se", そ: "so",
  た: "ta", ち: "chi", つ: "tsu", て: "te", と: "to",
  な: "na", に: "ni", ぬ: "nu", ね: "ne", の: "no",
  は: "ha", ひ: "hi", ふ: "fu", へ: "he", ほ: "ho",
  ま: "ma", み: "mi", む: "mu", め: "me", も: "mo",
  や: "ya", ゆ: "yu", よ: "yo",
  ら: "ra", り: "ri", る: "ru", れ: "re", ろ: "ro",
  わ: "wa", を: "wo", ん: "n",
  が: "ga", ぎ: "gi", ぐ: "gu", げ: "ge", ご: "go",
  ざ: "za", じ: "ji", ず: "zu", ぜ: "ze", ぞ: "zo",
  だ: "da", ぢ: "ji (di)", づ: "zu (du)", で: "de", ど: "do",
  ば: "ba", び: "bi", ぶ: "bu", べ: "be", ぼ: "bo",
  ぱ: "pa", ぴ: "pi", ぷ: "pu", ぺ: "pe", ぽ: "po",
  きゃ: "kya", きゅ: "kyu", きょ: "kyo",
  しゃ: "sha", しゅ: "shu", しょ: "sho",
  ちゃ: "cha", ちゅ: "chu", ちょ: "cho",
  にゃ: "nya", にゅ: "nyu", にょ: "nyo",
  ひゃ: "hya", ひゅ: "hyu", ひょ: "hyo",
  みゃ: "mya", みゅ: "myu", みょ: "myo",
  りゃ: "rya", りゅ: "ryu", りょ: "ryo",
  ぎゃ: "gya", ぎゅ: "gyu", ぎょ: "gyo",
  じゃ: "ja", じゅ: "ju", じょ: "jo",
  びゃ: "bya", びゅ: "byu", びょ: "byo",
  ぴゃ: "pya", ぴゅ: "pyu", ぴょ: "pyo",
};

const EXAMPLES: Record<string, { ja: string; id: string }> = {
  あ: { ja: "あさ (asa)", id: "Pagi" },
  い: { ja: "いぬ (inu)", id: "Anjing" },
  う: { ja: "うみ (umi)", id: "Laut" },
  え: { ja: "えき (eki)", id: "Stasiun" },
  お: { ja: "おちゃ (ocha)", id: "Teh" },
  か: { ja: "かさ (kasa)", id: "Payung" },
  き: { ja: "きって (kitte)", id: "Perangko" },
  く: { ja: "くるま (kuruma)", id: "Mobil" },
  け: { ja: "けさ (kesa)", id: "Tadi pagi" },
  こ: { ja: "こども (kodomo)", id: "Anak" },
  さ: { ja: "さくら (sakura)", id: "Bunga sakura" },
  し: { ja: "しごと (shigoto)", id: "Pekerjaan" },
  す: { ja: "すし (sushi)", id: "Sushi" },
  た: { ja: "たべる (taberu)", id: "Makan" },
  ち: { ja: "ちず (chizu)", id: "Peta" },
  つ: { ja: "つき (tsuki)", id: "Bulan" },
  な: { ja: "なまえ (namae)", id: "Nama" },
  に: { ja: "にほん (nihon)", id: "Jepang" },
  は: { ja: "はな (hana)", id: "Bunga" },
  ま: { ja: "まち (machi)", id: "Kota" },
  や: { ja: "やま (yama)", id: "Gunung" },
  ら: { ja: "らいしゅう (raishuu)", id: "Minggu depan" },
  わ: { ja: "わたし (watashi)", id: "Saya" },
  ん: { ja: "ほん (hon)", id: "Buku" },
  が: { ja: "がっこう (gakkou)", id: "Sekolah" },
  じ: { ja: "じかん (jikan)", id: "Waktu" },
  だ: { ja: "だいがく (daigaku)", id: "Universitas" },
  ば: { ja: "ばしょ (basho)", id: "Tempat" },
  ぱ: { ja: "ぱん (pan)", id: "Roti" },
  きゃ: { ja: "きゃく (kyaku)", id: "Tamu" },
  しゃ: { ja: "しゃしん (shashin)", id: "Foto" },
  ちゃ: { ja: "ちゃわん (chawan)", id: "Mangkuk" },
  りゃ: { ja: "りゃくご (ryakugo)", id: "Singkatan" },
};

function buildEntry(hira: string, group: KanaGroup): KanaEntry {
  const romaji = ROMAJI_MAP[hira] ?? hira;
  const ex = EXAMPLES[hira];
  const note =
    group === "basic"
      ? "Huruf dasar Gojuon (46 aksara inti)"
      : group === "dakuon"
        ? "Huruf bersuara dengan tanda tenten (゛) atau maru (゜)"
        : "Bunyi gabungan dengan ya/yu/yo kecil";

  return {
    hira,
    romaji,
    exampleJa: ex?.ja ?? `${hira} (${romaji})`,
    exampleId: ex?.id ?? `Bunyi "${romaji}"`,
    note,
  };
}

export function KanaBoard() {
  const [scriptMode, setScriptMode] = useState<ScriptMode>("all");
  const [group, setGroup] = useState<KanaGroup>("basic");
  const [selectedHira, setSelectedHira] = useState<string>("あ");

  const activeRows = useMemo(() => {
    if (group === "basic") return BASIC_ROWS;
    if (group === "dakuon") return DAKUON_ROWS;
    return YOUON_ROWS;
  }, [group]);

  const selectedEntry = useMemo(
    () => buildEntry(selectedHira, group),
    [selectedHira, group],
  );
  const selectedKata = toKatakana(selectedEntry.hira);

  function handleSelect(hira: string) {
    setSelectedHira(hira);
    speakJapanese(hira);
  }

  function handleGroupChange(next: KanaGroup) {
    setGroup(next);
    const firstValid =
      (next === "basic" ? BASIC_ROWS : next === "dakuon" ? DAKUON_ROWS : YOUON_ROWS)
        .flat()
        .find((cell): cell is string => Boolean(cell)) ?? "あ";
    setSelectedHira(firstValid);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold tracking-wider text-[#2563EB] uppercase dark:text-blue-400">
            Fondasi Membaca &amp; Pengucapan
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            Papan Kana Interaktif
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Ketuk huruf apa saja untuk mendengarkan pelafalan bahasa Jepang dan melihat bentuk Hiragana &amp; Katakana.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Script Mode Selector */}
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-[#111827]">
            {(
              [
                { key: "all", label: "Semua" },
                { key: "hiragana", label: "Hiragana" },
                { key: "katakana", label: "Katakana" },
              ] as const
            ).map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setScriptMode(key)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  scriptMode === key
                    ? "bg-[#2563EB] text-white"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <Link
            href="/review"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F172A] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-slate-800 dark:bg-[#2563EB] dark:hover:bg-blue-700"
          >
            Latihan Flashcard
            <IconArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Sub-tabs: Dasar / Dakuon / Youon */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            { key: "basic", label: "Dasar Gojuon (46)" },
            { key: "dakuon", label: "Dakuon & Handakuon (25)" },
            { key: "youon", label: "Bunyi Gabungan Youon (33)" },
          ] as const
        ).map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => handleGroupChange(key)}
            className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition ${
              group === key
                ? "border-[#2563EB] bg-[#2563EB]/10 text-[#2563EB] dark:border-blue-500 dark:bg-blue-950/60 dark:text-blue-300"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-[#111827] dark:text-slate-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Main layout: Grid + Dark Detail Panel */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* Kana Matrix */}
        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#111827] sm:p-5">
          <div className="space-y-2">
            {activeRows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className={`grid gap-2 ${
                  group === "youon" ? "grid-cols-3" : "grid-cols-5"
                }`}
              >
                {row.map((hira, colIndex) => {
                  if (!hira) {
                    return <div key={colIndex} aria-hidden="true" />;
                  }
                  const kata = toKatakana(hira);
                  const romaji = ROMAJI_MAP[hira] ?? hira;
                  const active = selectedHira === hira;

                  return (
                    <button
                      key={hira}
                      type="button"
                      onClick={() => handleSelect(hira)}
                      className={`group flex flex-col items-center justify-center rounded-xl border py-2.5 text-center transition sm:py-3 ${
                        active
                          ? "border-[#2563EB] bg-[#2563EB] text-white"
                          : "border-slate-200 bg-[#F8FAFC] text-slate-900 hover:border-[#2563EB] hover:bg-blue-50/50 dark:border-slate-800 dark:bg-[#0B1120] dark:text-slate-100 dark:hover:border-blue-500 dark:hover:bg-slate-800/80"
                      }`}
                    >
                      {scriptMode === "all" && (
                        <>
                          <span className="font-jp text-xl font-bold sm:text-2xl">
                            {hira}
                          </span>
                          <span
                            className={`font-jp text-xs font-semibold ${
                              active
                                ? "text-blue-100"
                                : "text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            {kata}
                          </span>
                        </>
                      )}
                      {scriptMode === "hiragana" && (
                        <span className="font-jp text-2xl font-bold sm:text-3xl">
                          {hira}
                        </span>
                      )}
                      {scriptMode === "katakana" && (
                        <span className="font-jp text-2xl font-bold sm:text-3xl">
                          {kata}
                        </span>
                      )}
                      <span
                        className={`mt-0.5 text-[11px] font-bold ${
                          active
                            ? "text-blue-100"
                            : "text-slate-400 dark:text-slate-500"
                        }`}
                      >
                        {romaji}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </section>

        {/* Detail Panel */}
        <aside className="h-fit rounded-2xl bg-[#0F172A] p-6 text-white dark:border dark:border-slate-800 dark:bg-[#111827]">
          <div className="flex items-center justify-between text-xs font-bold tracking-wider text-blue-300 uppercase">
            <span className="inline-flex items-center gap-1.5">
              <IconBook className="h-4 w-4" />
              Detail Aksara
            </span>
            <span className="rounded-md bg-slate-800 px-2 py-0.5 text-slate-200">
              /{selectedEntry.romaji}/
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-slate-800/70 p-4 text-center">
            <div>
              <p className="text-[11px] font-semibold text-slate-400">Hiragana</p>
              <p className="font-jp mt-1 text-5xl font-extrabold text-white">
                {selectedEntry.hira}
              </p>
            </div>
            <div className="border-l border-slate-700">
              <p className="text-[11px] font-semibold text-slate-400">Katakana</p>
              <p className="font-jp mt-1 text-5xl font-extrabold text-blue-300">
                {selectedKata}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => speakJapanese(selectedEntry.hira)}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-600"
          >
            <IconVolume className="h-4 w-4" />
            Putar Pelafalan ({selectedEntry.romaji})
          </button>

          <div className="mt-5 space-y-3 border-t border-slate-800 pt-4 text-sm">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">
                Contoh Kosakata
              </p>
              <p className="font-jp mt-1 text-base font-bold text-white">
                {selectedEntry.exampleJa}
              </p>
              <p className="text-xs text-slate-300">Arti: {selectedEntry.exampleId}</p>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Catatan</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-300">
                {selectedEntry.note}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
