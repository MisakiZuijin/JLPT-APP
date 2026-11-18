import type { JlptLevel } from "@/lib/types";

export type KaiwaOption = {
  id: string;
  ja: string;
  reading: string;
  romaji: string;
  meaning: string;
  isBest: boolean;
  feedback: string;
};

export type KaiwaTurn = {
  id: string;
  npcRole: string;
  npcJa: string;
  npcReading: string;
  npcMeaning: string;
  taskId: string;
  expectedReading: string;
  expectedTerm: string;
  options: KaiwaOption[];
};

export type KaiwaScenario = {
  slug: string;
  level: JlptLevel;
  title: string;
  setting: string;
  turns: KaiwaTurn[];
};

export const KAIWA_SCENARIOS: KaiwaScenario[] = [
  {
    slug: "konbini",
    level: "N5",
    title: "Belanja & Bayar di Konbini",
    setting: "Kamu membeli nasi kotak (obentou) di minimarket Jepang.",
    turns: [
      {
        id: "t1",
        npcRole: "Kasir Konbini",
        npcJa: "いらっしゃいませ。お弁当を 温めますか？",
        npcReading: "いらっしゃいませ おべんとうを あたためますか",
        npcMeaning: "Selamat datang. Apakah bekalnya mau sekalian dihangatkan?",
        taskId: "Jawab dengan sopan bahwa kamu ingin bekalnya dihangatkan.",
        expectedTerm: "はいお願いします",
        expectedReading: "はいおねがいします",
        options: [
          {
            id: "o1",
            ja: "はい、お願いします。",
            reading: "はいおねがいします",
            romaji: "Hai, onegaishimasu.",
            meaning: "Ya, tolong dihangatkan.",
            isBest: true,
            feedback: "Tepat dan sopan! Jawaban paling alami di konbini Jepang.",
          },
          {
            id: "o2",
            ja: "いいえ、だいじょうぶです。",
            reading: "いいえだいじょうぶです",
            romaji: "Iie, daijoubu desu.",
            meaning: "Tidak, tidak perlu.",
            isBest: false,
            feedback: "Ini berarti menolak dihangatkan—coba jawab bila ingin dihangatkan.",
          },
          {
            id: "o3",
            ja: "水ください。",
            reading: "みずください",
            romaji: "Mizu kudasai.",
            meaning: "Minta air.",
            isBest: false,
            feedback: "Kurang nyambung dengan pertanyaan kasir tentang menghangatkan bekal.",
          },
        ],
      },
      {
        id: "t2",
        npcRole: "Kasir Konbini",
        npcJa: "お箸は お付けしますか？",
        npcReading: "おはしは おつけしますか",
        npcMeaning: "Apakah perlu disertakan sumpit?",
        taskId: "Minta satu pasang sumpit dengan sopan.",
        expectedTerm: "はい一つお願いします",
        expectedReading: "はいひとつおねがいします",
        options: [
          {
            id: "o1",
            ja: "はい、一つ お願いします。",
            reading: "はいひとつおねがいします",
            romaji: "Hai, hitotsu onegaishimasu.",
            meaning: "Ya, tolong minta satu.",
            isBest: true,
            feedback: "Alami sekali! Pembeli di konbini biasa memakai 'hitotsu onegaishimasu' atau langsung 'onegaishimasu'.",
          },
          {
            id: "o2",
            ja: "さようなら。",
            reading: "さようなら",
            romaji: "Sayounara.",
            meaning: "Selamat tinggal.",
            isBest: false,
            feedback: "Belum selesai bertransaksi; gunakan 'onegaishimasu'.",
          },
        ],
      },
    ],
  },
  {
    slug: "jikoshoukai",
    level: "N5",
    title: "Perkenalan Diri (Jikoshoukai)",
    setting: "Hari pertama masuk kelas bahasa Jepang atau pengenalan di tempat kerja.",
    turns: [
      {
        id: "t1",
        npcRole: "Guru / Pembimbing",
        npcJa: "ようこそ！ はじめまして。自己紹介を お願いします。",
        npcReading: "ようこそ はじめまして じこしょうかいを おねがいします",
        npcMeaning: "Selamat datang! Salam kenal. Silakan perkenalkan diri Anda.",
        taskId: "Ucapkan salam perkenalan, sebutkan berasal dari Indonesia, dan tutup dengan sopan.",
        expectedTerm: "はじめましてインドネシアから来ましたよろしくお願いします",
        expectedReading: "はじめましていんどねしあからきましたよろしくおねがいします",
        options: [
          {
            id: "o1",
            ja: "はじめまして。インドネシアから 来ました。よろしく お願いします。",
            reading: "はじめましていんどねしあからきましたよろしくおねがいします",
            romaji: "Hajimemashite. Indoneshia kara kimashita. Yoroshiku onegaishimasu.",
            meaning: "Perkenalkan. Saya datang dari Indonesia. Mohon bantuannya.",
            isBest: true,
            feedback: "Tepat dan sangat sopan! Kalimat Jikoshoukai lengkap: salam pembuka, asal negara, dan penutup.",
          },
          {
            id: "o2",
            ja: "こんにちは、ありがとう。",
            reading: "こんにちはありがとう",
            romaji: "Konnichiwa, arigatou.",
            meaning: "Halo, terima kasih.",
            isBest: false,
            feedback: "Kurang tepat untuk perkenalan resmi pertama kali. Gunakan 'Hajimemashite... Yoroshiku onegaishimasu'.",
          },
        ],
      },
      {
        id: "t2",
        npcRole: "Guru / Pembimbing",
        npcJa: "日本語は どのくらい 勉強しましたか？",
        npcReading: "にほんごは どのくらい べんきょうしましたか",
        npcMeaning: "Sudah berapa lama belajar bahasa Jepang?",
        taskId: "Jawab sudah belajar sekitar 3 bulan dan akan terus berusaha setiap hari.",
        expectedTerm: "三か月ぐらい勉強しました毎日がんばります",
        expectedReading: "さんかげつぐらいべんきょうしましたまいにちがんばります",
        options: [
          {
            id: "o1",
            ja: "三か月ぐらい 勉強しました。毎日 がんばります。",
            reading: "さんかげつぐらいべんきょうしましたまいにちがんばります",
            romaji: "Sankagetsu gurai benkyou shimashita. Mainichi ganbarimasu.",
            meaning: "Saya sudah belajar sekitar 3 bulan. Saya akan berusaha setiap hari.",
            isBest: true,
            feedback: "Bagus! Menjawab pertanyaan durasi belajar sekaligus menunjukkan semangat positif.",
          },
          {
            id: "o2",
            ja: "わかりません、さようなら。",
            reading: "わかりませんさようなら",
            romaji: "Wakarimasen, sayounara.",
            meaning: "Tidak tahu, selamat tinggal.",
            isBest: false,
            feedback: "Coba jawab dengan durasi belajar dan ungkapan 'ganbarimasu'.",
          },
        ],
      },
    ],
  },
  {
    slug: "stasiun",
    level: "N4",
    title: "Bertanya Arah ke Stasiun",
    setting: "Kamu sedang berjalan kaki di kota dan bertanya ke petugas informasi.",
    turns: [
      {
        id: "t1",
        npcRole: "Petugas Informasi",
        npcJa: "はい、何か お困りですか？",
        npcReading: "はい なにか おこまりですか",
        npcMeaning: "Ya, ada yang bisa saya bantu?",
        taskId: "Tanyakan letak stasiun terdekat dengan sopan diawali 'Sumimasen'.",
        expectedTerm: "すみません駅はどこですか",
        expectedReading: "すみませんえきはどこですか",
        options: [
          {
            id: "o1",
            ja: "すみません、駅は どこですか。",
            reading: "すみませんえきはどこですか",
            romaji: "Sumimasen, eki wa doko desu ka.",
            meaning: "Permisi, stasiun ada di mana ya?",
            isBest: true,
            feedback: "Sopan dan jelas! Penutur lokal langsung mengerti tujuanmu.",
          },
          {
            id: "o2",
            ja: "駅は 高いです。",
            reading: "えきはたかいです",
            romaji: "Eki wa takai desu.",
            meaning: "Stasiunnya mahal/tinggi.",
            isBest: false,
            feedback: "Gunakan kata tanya 'doko desu ka' (di mana?) untuk menanyakan lokasi.",
          },
        ],
      },
    ],
  },
  {
    slug: "mensetsu",
    level: "N3",
    title: "Lapor Atasan (Hou-Ren-Sou) & Wawancara Kerja",
    setting: "Simulasi komunikasi sopan saat wawancara kerja atau melapor di perusahaan Jepang.",
    turns: [
      {
        id: "t1",
        npcRole: "Manajer / Senpai",
        npcJa: "さきほどの 作業は もう 終わりましたか？",
        npcReading: "さきほどの さぎょうは もう おわりましたか",
        npcMeaning: "Apakah pekerjaan yang tadi sudah selesai?",
        taskId: "Laporkan bahwa pekerjaan sudah selesai dan mohon pengecekan atasan.",
        expectedTerm: "はい終わりましたご確認お願いします",
        expectedReading: "はいおわりましたごかくにんおねがいします",
        options: [
          {
            id: "o1",
            ja: "はい、終わりました。ご確認 お願いします。",
            reading: "はいおわりましたごかくにんおねがいします",
            romaji: "Hai, owarimashita. Gokakunin onegaishimasu.",
            meaning: "Ya, sudah selesai. Mohon dicek kembali.",
            isBest: true,
            feedback: "Sempurna! Contoh nyata Hou-Ren-Sou (lapor cepat + minta konfirmasi).",
          },
          {
            id: "o2",
            ja: "もう いいですよ。",
            reading: "もういいですよ",
            romaji: "Mou ii desu yo.",
            meaning: "Sudah cukup kok.",
            isBest: false,
            feedback: "Ungkapan ini terdengar kasual/kurang sopan terhadap atasan.",
          },
        ],
      },
      {
        id: "t2",
        npcRole: "Pewawancara (Mensetsu)",
        npcJa: "どうぞ お入りください。",
        npcReading: "どうぞ おはいりください",
        npcMeaning: "Silakan masuk ke ruangan.",
        taskId: "Ucapkan permisi dengan ragam hormat sebelum masuk ruangan.",
        expectedTerm: "失礼いたします",
        expectedReading: "しつれいいたします",
        options: [
          {
            id: "o1",
            ja: "失礼いたします。",
            reading: "しつれいいたします",
            romaji: "Shitsurei itashimasu.",
            meaning: "Permisi (sopan / hormat).",
            isBest: true,
            feedback: "Tepat sekali! Jangan lupa membungkuk 30° (Keirei) saat mengucapkan kalimat ini.",
          },
          {
            id: "o2",
            ja: "じゃ、入ります。",
            reading: "じゃはいります",
            romaji: "Ja, hairimasu.",
            meaning: "Ya deh, saya masuk.",
            isBest: false,
            feedback: "Terlalu santai untuk wawancara resmi.",
          },
        ],
      },
    ],
  },
];
