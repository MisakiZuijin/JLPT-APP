import type { JlptLevel } from "@/lib/types";

export type CultureCard = {
  id: string;
  tag: string;
  level: JlptLevel;
  title: string;
  summary: string;
  points: { label: string; detail: string }[];
  keyPhrase: {
    term: string;
    reading: string;
    romaji: string;
    meaning: string;
  };
};

export const CULTURE_CARDS: CultureCard[] = [
  {
    id: "hou-ren-sou",
    tag: "ATURAN KERJA",
    level: "N4",
    title: "Hou-Ren-Sou (報連相): Lapor · Kabari · Konsultasi",
    summary:
      "Prinsip emas di perusahaan & tempat magang Jepang. Jangan pernah diam saat pekerjaan selesai, ada keterlambatan, atau bingung menghadapi masalah.",
    points: [
      {
        label: "1. Houkoku (報告 · Lapor)",
        detail: "Segera laporkan hasil begitu tugas selesai agar atasan tahu progres tanpa harus menanyakan.",
      },
      {
        label: "2. Renraku (連絡 · Kabari)",
        detail: "Bagikan fakta/jadwal penting kepada tim—terutama jika diperkirakan telat 5–10 menit.",
      },
      {
        label: "3. Soudan (相談 · Konsultasi)",
        detail: "Bila ragu, tanyakan sebelum salah langkah alih-alih menebak-nebak sendiri.",
      },
    ],
    keyPhrase: {
      term: "終わりました、ご確認お願いします",
      reading: "おわりました ごかくにん おねがいします",
      romaji: "Owarimashita, gokakunin onegaishimasu.",
      meaning: "Sudah selesai, mohon dicek kembali.",
    },
  },
  {
    id: "ojigi",
    tag: "TATA KRAMA",
    level: "N5",
    title: "Ojigi (お辞儀): 3 Sudut Membungkuk di Jepang",
    summary:
      "Membungkuk adalah bentuk salam dan penghormatan nonverbal paling penting. Posisi punggung harus lurus dari pinggang dan pandangan turun alami.",
    points: [
      {
        label: "15° · Eshaku (会釈)",
        detail: "Salam ringan saat berpapasan dengan rekan kerja di koridor atau menyapa pelanggan.",
      },
      {
        label: "30° · Keirei (敬礼)",
        detail: "Salam hormat standar saat masuk ruang wawancara (mensetsu), bertemu atasan, atau tamu.",
      },
      {
        label: "45° · Saikeirei (最敬礼)",
        detail: "Penghormatan terdalam saat meminta maaf serius atau mengucapkan terima kasih yang besar.",
      },
    ],
    keyPhrase: {
      term: "失礼いたします",
      reading: "しつれいいたします",
      romaji: "Shitsurei itashimasu.",
      meaning: "Permisi (saat masuk/keluar ruangan dengan hormat).",
    },
  },
  {
    id: "aisatsu",
    tag: "KEBIASAAN HARIAN",
    level: "N5",
    title: "Aisatsu di Tempat Kerja & Pulang Kantor",
    summary:
      "Di Jepang, menyapa sebelum bekerja dan berpamitan dengan kalimat khusus menandakan kerja sama tim yang baik.",
    points: [
      {
        label: "Datang Pagi",
        detail: "Ucapkan 'Ohayou gozaimasu' dengan suara jelas meski baru masuk shift sore pada beberapa lingkungan kerja!",
      },
      {
        label: "Saat Pulang Lebih Dulu",
        detail: "Ucapkan 'Osaki ni shitsurei shimasu' (Permisi pulang duluan); rekan lain membalas 'Otsukaresama deshita'.",
      },
    ],
    keyPhrase: {
      term: "お疲れ様でした",
      reading: "おつかれさまでした",
      romaji: "Otsukaresama deshita.",
      meaning: "Terima kasih atas kerja kerasnya hari ini.",
    },
  },
  {
    id: "ketepatan-waktu",
    tag: "DISIPLIN WAKTU",
    level: "N4",
    title: "Aturan 5–10 Menit Sebelum Jadwal (Go-fun-mae Koudou)",
    summary:
      "Tiba tepat saat jam mulai dianggap sudah terlambat di budaya kerja Jepang. Biasakan hadir 5–10 menit sebelumnya untuk persiapan.",
    points: [
      {
        label: "Kereta & Transportasi",
        detail: "Jadwal kereta dihitung per menit. Jika ada keterlambatan darurat, segera hubungi sebelum jam masuk dan minta surat bukti keterlambatan stasiun (Chien Shoumeisho).",
      },
    ],
    keyPhrase: {
      term: "お待たせいたしました",
      reading: "おまたせいたしました",
      romaji: "Omatase itashimashita.",
      meaning: "Maaf telah membuat Anda menunggu.",
    },
  },
];
