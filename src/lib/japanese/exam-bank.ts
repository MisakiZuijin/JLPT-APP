import type { JlptLevel } from "@/lib/types";

export type ExamQuestion = {
  id: string;
  promptJa: string;
  promptId: string;
  audioText?: string;
  options: string[];
  answerIndex: number;
  explanationId: string;
};

export type ExamSection = {
  id: string;
  title: string;
  durationMinutes: number;
  maxScore: number;
  minPassScore: number;
  questions: ExamQuestion[];
};

export type MockExamSpec = {
  level: JlptLevel;
  title: string;
  totalMaxScore: number;
  totalPassScore: number;
  sections: ExamSection[];
};

export const MOCK_EXAMS: Record<JlptLevel, MockExamSpec> = {
  N5: {
    level: "N5",
    title: "Simulasi Ujian JLPT N5",
    totalMaxScore: 180,
    totalPassScore: 80,
    sections: [
      {
        id: "n5-moji-goi",
        title: "Bagian 1: 文字・語彙 (Kosakata & Kanji)",
        durationMinutes: 20,
        maxScore: 60,
        minPassScore: 19,
        questions: [
          {
            id: "n5-v1",
            promptJa: "きのう 【新しい】 本を 買いました。",
            promptId: "Pilih cara baca hiragana yang tepat untuk kata dalam kurung 【新しい】.",
            options: ["あたらしい", "ふるい", "おおきい", "ちいさい"],
            answerIndex: 0,
            explanationId: "新しい dibaca 「あたらしい」 (atarashii) yang berarti 'baru'.",
          },
          {
            id: "n5-v2",
            promptJa: "毎日 【電車】で 学校へ 行きます。",
            promptId: "Pilih cara baca hiragana untuk 【電車】.",
            options: ["くるま", "じてんしゃ", "でんしゃ", "ひこうき"],
            answerIndex: 2,
            explanationId: "電車 dibaca 「でんしゃ」 (densha) yang berarti 'kereta listrik'.",
          },
          {
            id: "n5-v3",
            promptJa: "つめたい 【みず】を 飲みます。",
            promptId: "Pilih huruf kanji yang tepat untuk 【みず】.",
            options: ["火", "水", "木", "土"],
            answerIndex: 1,
            explanationId: "みず (mizu = air) ditulis dengan kanji 「水」.",
          },
          {
            id: "n5-v4",
            promptJa: "この レストランの 料理は とても （　）です。",
            promptId: "Pilih kata sifat yang paling pas melengkapi kalimat.",
            options: ["おいしい", "いそがしい", "むずかしい", "くらい"],
            answerIndex: 0,
            explanationId: "「料理はおいしいです」 berarti 'masakannya enak'.",
          },
          {
            id: "n5-v5",
            promptJa: "【友達】と いっしょに 昼ごはんを 食べます。",
            promptId: "Pilih arti kata 【友達】 yang benar.",
            options: ["guru", "teman", "kakak laki-laki", "dokter"],
            answerIndex: 1,
            explanationId: "友達 (ともだち / tomodachi) berarti 'teman'.",
          },
        ],
      },
      {
        id: "n5-bunpou-dokkai",
        title: "Bagian 2: 文法・読解 (Tata Bahasa & Bacaan)",
        durationMinutes: 35,
        maxScore: 60,
        minPassScore: 19,
        questions: [
          {
            id: "n5-g1",
            promptJa: "きょうは レストラン（　） ともだちと ごはんを たべます。",
            promptId: "Pilih partikel yang tepat untuk tempat aktivitas.",
            options: ["に", "へ", "で", "を"],
            answerIndex: 2,
            explanationId: "Partikel で dipakai untuk menunjukkan tempat dilakukannya kegiatan aktif (makan di restoran).",
          },
          {
            id: "n5-g2",
            promptJa: "すみません、ここに なまえを （　） ください。",
            promptId: "Pilih bentuk kata kerja ~て yang benar untuk 'tulis'.",
            options: ["かいて", "かく", "かきます", "かいた"],
            answerIndex: 0,
            explanationId: "Pola permintaan halus adalah Kata Kerja Bentuk-て + ください: 書く → かいてください.",
          },
          {
            id: "n5-g3",
            promptJa: "わたしは あした 大阪（おおさか）（　） 行きます。",
            promptId: "Pilih partikel arah tujuan.",
            options: ["を", "で", "へ", "から"],
            answerIndex: 2,
            explanationId: "Partikel へ (atau に) dipakai setelah tujuan sebelum verba perpindahan seperti 行きます.",
          },
          {
            id: "n5-g4",
            promptJa: "Bacaan pendek: 「毎週 日曜日に 私は 図書館へ 行って、日本語の本を 読みます。」 — いつ 図書館へ 行きますか。",
            promptId: "Kapan pembicara pergi ke perpustakaan?",
            options: ["Setiap hari Senin", "Setiap hari Minggu", "Setiap hari Sabtu", "Setiap malam"],
            answerIndex: 1,
            explanationId: "Tertulis jelas 「毎週日曜日に」 (setiap hari Minggu).",
          },
        ],
      },
      {
        id: "n5-choukai",
        title: "Bagian 3: 聴解 (Mendengarkan Audio)",
        durationMinutes: 25,
        maxScore: 60,
        minPassScore: 19,
        questions: [
          {
            id: "n5-l1",
            promptJa: "Putar audio percakapan di bawah ini lalu pilih jam pertemuan yang disepakati.",
            promptId: "Pukul berapa mereka bertemu besok?",
            audioText: "あしたの午後、二時に駅の前で会いましょう。",
            options: ["Pukul 12 siang", "Pukul 2 siang (午後二時)", "Pukul 4 sore", "Pukul 8 malam"],
            answerIndex: 1,
            explanationId: "Audio mengucapkan 「午後二時に」(gogo niji ni = pukul 2 siang).",
          },
          {
            id: "n5-l2",
            promptJa: "Dengarkan audio pemesanan di kafe lalu pilih apa yang dipesan pembicara.",
            promptId: "Apa yang diminta pembicara?",
            audioText: "すみません、つめたいお茶を二つと、コーヒーを一つお願いします。",
            options: [
              "2 teh dingin dan 1 kopi",
              "1 teh panas dan 2 kopi",
              "2 air putih dan 1 jus",
              "1 roti dan 2 teh",
            ],
            answerIndex: 0,
            explanationId: "Terdengar 「つめたいお茶を二つ (2 teh dingin) と、コーヒーを一つ (dan 1 kopi)」.",
          },
          {
            id: "n5-l3",
            promptJa: "Dengarkan kalimat berikut lalu pilih kondisi cuacanya.",
            promptId: "Bagaimana cuaca hari ini menurut audio?",
            audioText: "今日は少しさむいですが、いい天気ですね。",
            options: [
              "Hujan deras sepanjang hari",
              "Agak dingin tetapi cuacanya cerah/bagus",
              "Sangat panas dan berangin",
              "Turun salju tebal",
            ],
            answerIndex: 1,
            explanationId: "「少しさむいですが、いい天気」 berarti 'agak dingin, namun cuacanya bagus'.",
          },
        ],
      },
    ],
  },
  N4: {
    level: "N4",
    title: "Simulasi Ujian JLPT N4",
    totalMaxScore: 180,
    totalPassScore: 90,
    sections: [
      {
        id: "n4-moji-goi",
        title: "Bagian 1: 文字・語彙 (Kosakata & Kanji N4)",
        durationMinutes: 25,
        maxScore: 60,
        minPassScore: 19,
        questions: [
          {
            id: "n4-v1",
            promptJa: "店長が 【丁寧】に 仕事を 教えてくれました。",
            promptId: "Pilih cara baca kanji 【丁寧】 yang benar.",
            options: ["ていねい", "あんぜん", "ふべん", "たいせつ"],
            answerIndex: 0,
            explanationId: "丁寧 dibaca 「ていねい」 (teinei = ramah / teliti).",
          },
          {
            id: "n4-v2",
            promptJa: "来週の 旅行のために ホテルを 【予約】しました。",
            promptId: "Apa arti kata 【予約】?",
            options: ["Membatalkan", "Memesan / reservasi", "Membayar denda", "Menunda"],
            answerIndex: 1,
            explanationId: "予約 (よやく) berarti reservasi / pemesanan sebelumnya.",
          },
          {
            id: "n4-v3",
            promptJa: "駅まで 歩いて 十分ぐらい 【かかります】。",
            promptId: "Makna kata kerja 【かかります】 pada kalimat ini adalah...",
            options: ["memakan waktu", "mengunci pintu", "menggantung", "menelepon"],
            answerIndex: 0,
            explanationId: "Waktu/biaya + かかります berarti membutuhkan waktu atau biaya.",
          },
        ],
      },
      {
        id: "n4-bunpou-dokkai",
        title: "Bagian 2: 文法・読解 (Tata Bahasa & Bacaan N4)",
        durationMinutes: 45,
        maxScore: 60,
        minPassScore: 19,
        questions: [
          {
            id: "n4-g1",
            promptJa: "日本へ 来たばかりなので、まだ 日本語が あまり （　）。",
            promptId: "Pilih bentuk potensial negatif yang tepat untuk 'tidak terlalu bisa berbicara'.",
            options: ["話せません", "話しませんでした", "話したいです", "話してください"],
            answerIndex: 0,
            explanationId: "Bentuk potensial 話す → 話せる → negatif 話せません (belum terlalu bisa bicara).",
          },
          {
            id: "n4-g2",
            promptJa: "雨が 降りそうだから、傘を （　） ほうが いいですよ。",
            promptId: "Pilih kata kerja bentuk lampau yang pas untuk pola saran ~たほうがいい.",
            options: ["持っていく", "持っていった", "持っていって", "持っていかない"],
            answerIndex: 1,
            explanationId: "Pola saran positif memakai bentuk lampau (た-form) + ほうがいい: 持っていったほうがいい.",
          },
        ],
      },
      {
        id: "n4-choukai",
        title: "Bagian 3: 聴解 (Mendengarkan Audio N4)",
        durationMinutes: 30,
        maxScore: 60,
        minPassScore: 19,
        questions: [
          {
            id: "n4-l1",
            promptJa: "Dengarkan percakapan rekan kerja lalu tentukan apa yang akan dilakukan laki-laki tersebut.",
            promptId: "Apa yang akan ia lakukan segera?",
            audioText: "会議の前に、この資料を五部コピーしておきます。",
            options: [
              "Memfotokopi dokumen sebanyak 5 rangkap sebelum rapat",
              "Membatalkan rapat sore ini",
              "Mengirim email ke pelanggan",
              "Pergi makan siang duluan",
            ],
            answerIndex: 0,
            explanationId: "「五部コピーしておきます」 = menyiapkan fotokopi 5 rangkap sebelumnya (~ておく).",
          },
        ],
      },
    ],
  },
  N3: {
    level: "N3",
    title: "Simulasi Ujian JLPT N3",
    totalMaxScore: 180,
    totalPassScore: 95,
    sections: [
      {
        id: "n3-moji-goi",
        title: "Bagian 1: 文字・語彙 (Kosakata & Kanji N3)",
        durationMinutes: 30,
        maxScore: 60,
        minPassScore: 19,
        questions: [
          {
            id: "n3-v1",
            promptJa: "日本の 電車は 時間に 【正確】だと 言われています。",
            promptId: "Pilih arti kata 【正確】.",
            options: ["Tepat dan akurat", "Mahal sekali", "Selalu terlambat", "Membosankan"],
            answerIndex: 0,
            explanationId: "正確 (せいかく / seikaku) berarti akurat / tepat.",
          },
          {
            id: "n3-v2",
            promptJa: "車内では 電話での 通話を （　） マナーが 大切です。",
            promptId: "Pilih kata kerja paling tepat untuk 'menahan diri / menghindari'.",
            options: ["控える", "応援する", "増やす", "諦める"],
            answerIndex: 0,
            explanationId: "控える (ひかえる) berarti menahan diri atau menghindari suatu tindakan.",
          },
        ],
      },
      {
        id: "n3-bunpou-dokkai",
        title: "Bagian 2: 文法・読解 (Tata Bahasa & Bacaan N3)",
        durationMinutes: 55,
        maxScore: 60,
        minPassScore: 19,
        questions: [
          {
            id: "n3-g1",
            promptJa: "毎日 練習した（　）、N3に 合格することが できた。",
            promptId: "Pilih pola tata bahasa yang menunjukkan hasil positif berkat usaha.",
            options: ["せいで", "おかげで", "ばかりに", "くせに"],
            answerIndex: 1,
            explanationId: "「おかげで」 dipakai untuk penyebab yang menghasilkan dampak positif (berkat...).",
          },
        ],
      },
      {
        id: "n3-choukai",
        title: "Bagian 3: 聴解 (Mendengarkan Audio N3)",
        durationMinutes: 35,
        maxScore: 60,
        minPassScore: 19,
        questions: [
          {
            id: "n3-l1",
            promptJa: "Dengarkan pesan singkat kantor lalu pilih instruksi utama atasan.",
            promptId: "Apa pesan utama atasan?",
            audioText: "作業が終わったら、退社する前に必ず報告してください。",
            options: [
              "Wajib melapor setelah pekerjaan selesai sebelum pulang",
              "Boleh langsung pulang tanpa melapor",
              "Datang 2 jam lebih lambat besok",
              "Tunda laporan sampai minggu depan",
            ],
            answerIndex: 0,
            explanationId: "Tertulis/terdengar 「退社する前に必ず報告してください」 (wajib lapor sebelum pulang).",
          },
        ],
      },
    ],
  },
  N2: {
    level: "N2",
    title: "Simulasi Ujian JLPT N2",
    totalMaxScore: 180,
    totalPassScore: 90,
    sections: [
      {
        id: "n2-gengo-dokkai",
        title: "Bagian 1: 言語知識・読解 (Pengetahuan Bahasa & Bacaan N2)",
        durationMinutes: 85,
        maxScore: 120,
        minPassScore: 38,
        questions: [
          {
            id: "n2-q1",
            promptJa: "チームで 仕事を 進める（　）、報連相が 欠かせません。",
            promptId: "Pilih pola N2 yang berarti 'dalam rangka / ketika menjalankan...'.",
            options: ["うえで", "ものの", "わりに", "どころか"],
            answerIndex: 0,
            explanationId: "「〜うえで」 (ue de) bermakna 'dalam rangka / pada saat melakukan hal tersebut'.",
          },
          {
            id: "n2-q2",
            promptJa: "今回の 計画は 予算不足の ため、中止（　）。",
            promptId: "Pilih ungkapan N2 yang tepat untuk 'terpaksa harus dibatalkan'.",
            options: ["せざるを得ない", "するはずがない", "しっこない", "するわけだ"],
            answerIndex: 0,
            explanationId: "「〜ざるを得ない」 berarti 'terpaksa / tidak ada pilihan selain melakukan'.",
          },
        ],
      },
      {
        id: "n2-choukai",
        title: "Bagian 2: 聴解 (Mendengarkan Audio N2)",
        durationMinutes: 45,
        maxScore: 60,
        minPassScore: 19,
        questions: [
          {
            id: "n2-l1",
            promptJa: "Dengarkan percakapan bisnis lalu tentukan langkah selanjutnya.",
            promptId: "Apa tindakan yang harus segera diambil?",
            audioText: "書類に少し不備が見つかりましたので、先方に確認の上、訂正をお願いします。",
            options: [
              "Mengonfirmasi ke pihak klien lalu memperbaiki dokumen",
              "Menghapus seluruh dokumen lama",
              "Mengabaikan kesalahan kecil",
              "Memindahkan jadwal ke bulan depan",
            ],
            answerIndex: 0,
            explanationId: "「先方に確認の上、訂正をお願いします」 = konfirmasi dulu kepada klien lalu revisi.",
          },
        ],
      },
    ],
  },
  N1: {
    level: "N1",
    title: "Simulasi Ujian JLPT N1",
    totalMaxScore: 180,
    totalPassScore: 100,
    sections: [
      {
        id: "n1-gengo-dokkai",
        title: "Bagian 1: 言語知識・読解 (Pengetahuan Bahasa & Bacaan N1)",
        durationMinutes: 95,
        maxScore: 120,
        minPassScore: 38,
        questions: [
          {
            id: "n1-q1",
            promptJa: "伝統技術の 価値は 時代の変化に（　）、今なお 高く 評価されている。",
            promptId: "Pilih pola tata bahasa N1 yang berarti 'lepas dari / tanpa terpengaruh oleh...'.",
            options: ["かかわらず", "いたって", "めぐって", "そくして"],
            answerIndex: 0,
            explanationId: "「〜にかかわらず」 berarti 'tidak peduli / terlepas dari perubahan zaman'.",
          },
          {
            id: "n1-q2",
            promptJa: "長年の 研究の 成果が ようやく 実を 結び（　）。",
            promptId: "Pilih tata bahasa N1 untuk proses perubahan yang sedang berlangsung/mulai terwujud.",
            options: ["つつある", "がたい", "べからず", "きらいがある"],
            answerIndex: 0,
            explanationId: "Kata kerja bentuk-masu + つつある menunjukkan kondisi yang terus bergerak menuju wujud nyata.",
          },
        ],
      },
      {
        id: "n1-choukai",
        title: "Bagian 2: 聴解 (Mendengarkan Audio N1)",
        durationMinutes: 50,
        maxScore: 60,
        minPassScore: 19,
        questions: [
          {
            id: "n1-l1",
            promptJa: "Dengarkan cuplikan diskusi sosial N1 berikut lalu tentukan inti pandangan pembicara.",
            promptId: "Apa kesimpulan utama pembicara?",
            audioText: "効率化を追求するあまり、本来の対話の質が損なわれては本末転倒と言えます。",
            options: [
              "Mengejar efisiensi berlebihan hingga mengorbankan kualitas dialog adalah keliru tujuan",
              "Efisiensi kerja selalu jauh lebih penting daripada komunikasi",
              "Dialog tatap muka sebaiknya dihapus sepenuhnya",
              "Teknologi tidak memengaruhi komunikasi",
            ],
            answerIndex: 0,
            explanationId: "「本末転倒」 berarti 'terbalik antara tujuan pokok dan cabang/sarana'.",
          },
        ],
      },
    ],
  },
};
