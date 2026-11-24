import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Noto_Sans_JP, Outfit } from "next/font/google";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const notoJp = Noto_Sans_JP({
  variable: "--font-noto-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "JLPT App — Belajar Bahasa Jepang Terarah N5–N1",
  description:
    "Platform latihan mandiri bahasa Jepang berbasis kurikulum formal JF Standard & JLPT N5–N1: huruf kana, menulis goresan KanjiVG, membaca Smart Furigana, pelafalan adaptif 5–15 detik, hafalan FSRS, dan simulasi ujian.",
};

const THEME_INIT_SCRIPT = `
(function() {
  try {
    var saved = localStorage.getItem('jlpt-theme') || 'system';
    var isDark = saved === 'dark' || (saved === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${outfit.variable} ${dmSans.variable} ${notoJp.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col bg-canvas text-text-primary transition-colors duration-200">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
