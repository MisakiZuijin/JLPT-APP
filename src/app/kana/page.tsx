import Link from "next/link";
import { toKatakana } from "wanakana";

const ROWS = [
  ["あ", "い", "う", "え", "お"],
  ["か", "き", "く", "け", "こ"],
  ["さ", "し", "す", "せ", "そ"],
  ["た", "ち", "つ", "て", "と"],
  ["な", "に", "ぬ", "ね", "の"],
  ["は", "ひ", "ふ", "へ", "ほ"],
  ["ま", "み", "む", "め", "も"],
  ["や", "", "ゆ", "", "よ"],
  ["ら", "り", "る", "れ", "ろ"],
  ["わ", "", "", "", "を"],
  ["ん", "", "", "", ""],
];

const ROMAJI: Record<string, string> = {
  あ:"a",い:"i",う:"u",え:"e",お:"o",か:"ka",き:"ki",く:"ku",け:"ke",こ:"ko",
  さ:"sa",し:"shi",す:"su",せ:"se",そ:"so",た:"ta",ち:"chi",つ:"tsu",て:"te",と:"to",
  な:"na",に:"ni",ぬ:"nu",ね:"ne",の:"no",は:"ha",ひ:"hi",ふ:"fu",へ:"he",ほ:"ho",
  ま:"ma",み:"mi",む:"mu",め:"me",も:"mo",や:"ya",ゆ:"yu",よ:"yo",
  ら:"ra",り:"ri",る:"ru",れ:"re",ろ:"ro",わ:"wa",を:"wo",ん:"n",
};

export default function KanaPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <Link href="/dashboard" className="text-sm text-slate-500 hover:underline">← Dashboard</Link>
      <h1 className="mt-2 text-2xl font-bold">Hiragana & Katakana</h1>
      <p className="text-sm text-slate-600">Katakana ditampilkan di pojok kanan atas setiap kotak.</p>

      <div className="mt-6 grid grid-cols-5 gap-2">
        {ROWS.flat().map((k, i) =>
          k ? (
            <div key={i} className="relative rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm">
              <span className="absolute right-2 top-1 text-xs text-slate-400">{toKatakana(k)}</span>
              <p className="text-4xl">{k}</p>
              <p className="text-sm text-slate-500">{ROMAJI[k]}</p>
            </div>
          ) : (
            <div key={i} />
          )
        )}
      </div>
    </main>
  );
}
