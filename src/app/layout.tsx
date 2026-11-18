import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const notoJp = Noto_Sans_JP({
  variable: "--font-noto-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "JLPT App — Belajar Bahasa Jepang N5–N1",
  description:
    "Aplikasi belajar bahasa Jepang lengkap untuk pemula hingga JLPT N1: huruf kana, menulis goresan, membaca, pengucapan, hafalan pintar, dan simulasi ujian.",
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
      className={`${inter.variable} ${notoJp.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-[#0F172A] dark:bg-[#0B1120] dark:text-[#F8FAFC] transition-colors">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
