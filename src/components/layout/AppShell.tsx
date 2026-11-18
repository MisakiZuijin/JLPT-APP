"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconAlert,
  IconBook,
  IconCalendar,
  IconCards,
  IconExam,
  IconGlobe,
  IconHome,
  IconLogOut,
  IconMessage,
  IconMic,
  IconPen,
  IconPuzzle,
  IconSettings,
  IconUser,
} from "@/components/ui/Icons";

export type AppNavTab = "beranda" | "hafal" | "belajar" | "ujian" | "profil" | "pengaturan";

type AppShellProps = {
  children: React.ReactNode;
  activeTab: AppNavTab;
  displayName?: string | null;
  targetLevel?: string;
  dueCount?: number;
  isAdmin?: boolean;
  logoutAction?: () => Promise<void>;
};

const SIDEBAR_ITEMS = [
  { href: "/dashboard", label: "Beranda Belajar", tab: "beranda" as const, Icon: IconHome, ready: true },
  { href: "/review", label: "Hafalan Kartu", tab: "hafal" as const, Icon: IconCards, ready: true },
  { href: "/kana", label: "Tabel Huruf Kana", tab: "belajar" as const, Icon: IconBook, ready: true },
  { href: "/reading", label: "Membaca & Furigana", tab: "belajar" as const, Icon: IconBook, ready: true },
  { href: "/writing", label: "Menulis Goresan", tab: "belajar" as const, Icon: IconPen, ready: true },
  { href: "/pronunciation", label: "Latihan Ngomong", tab: "belajar" as const, Icon: IconMic, ready: true },
  { href: "/kaiwa", label: "Kaiwa Roleplay", tab: "belajar" as const, Icon: IconMessage, ready: true },
  { href: "/culture", label: "Budaya & Etika", tab: "belajar" as const, Icon: IconGlobe, ready: true },
  { href: "/daily-test", label: "Tes Harian (20)", tab: "ujian" as const, Icon: IconCalendar, ready: true },
  { href: "/exam", label: "Simulasi Ujian JLPT", tab: "ujian" as const, Icon: IconExam, ready: true },
  { href: "/bunpou", label: "Bunpou Builder", tab: "ujian" as const, Icon: IconPuzzle, ready: true },
  { href: "/mistakes", label: "Catatan Kesalahan", tab: "ujian" as const, Icon: IconAlert, ready: true },
  { href: "/profile", label: "Profil Saya", tab: "profil" as const, Icon: IconUser, ready: true },
  { href: "/settings", label: "Pengaturan", tab: "pengaturan" as const, Icon: IconSettings, ready: true },
];

const UPCOMING_ITEMS = [
  { label: "Peta Bab & Import Penuh", badge: "Tahap 5", Icon: IconBook },
  { label: "Offline PWA & Progres", badge: "Tahap 6", Icon: IconGlobe },
];

const MOBILE_TABS = [
  { href: "/dashboard", label: "Beranda", tab: "beranda" as const, Icon: IconHome },
  { href: "/review", label: "Hafal", tab: "hafal" as const, Icon: IconCards },
  { href: "/kana", label: "Belajar", tab: "belajar" as const, Icon: IconBook },
  { href: "/exam", label: "Ujian", tab: "ujian" as const, Icon: IconExam },
  { href: "/profile", label: "Profil", tab: "profil" as const, Icon: IconUser },
];

export function AppShell({
  children,
  activeTab,
  displayName,
  targetLevel = "N5",
  dueCount,
  isAdmin = false,
  logoutAction,
}: AppShellProps) {
  const pathname = usePathname();
  const initials = (displayName || "P")
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("") || "P";

  return (
    <div className="flex min-h-screen w-full bg-[#F8FAFC] text-[#0F172A] dark:bg-[#0B1120] dark:text-[#F8FAFC]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:shrink-0 md:flex-col md:justify-between md:border-r md:border-slate-200 md:bg-white md:p-5 dark:md:border-slate-800 dark:md:bg-[#111827]">
        <div className="space-y-6">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563EB] font-[var(--font-jp)] text-lg font-bold text-white">
              日
            </span>
            <div>
              <p className="text-base font-bold leading-tight">JLPT App</p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Target Ujian: {targetLevel}
              </p>
            </div>
          </Link>

          <nav className="space-y-1.5" aria-label="Navigasi utama">
            {SIDEBAR_ITEMS.map(({ href, label, tab, Icon }) => {
              const isExact = pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`));
              const inGroupSubpage =
                pathname.startsWith("/reading") ||
                pathname.startsWith("/writing") ||
                pathname.startsWith("/pronunciation") ||
                pathname.startsWith("/kaiwa") ||
                pathname.startsWith("/culture") ||
                pathname.startsWith("/daily-test") ||
                pathname.startsWith("/exam") ||
                pathname.startsWith("/bunpou") ||
                pathname.startsWith("/mistakes");
              const isFallbackActive =
                tab !== "belajar" && tab !== "ujian" && activeTab === tab && !inGroupSubpage;
              const isActive = isExact || isFallbackActive;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? "bg-[#2563EB] text-white"
                      : "bg-[#F1F5F9] text-slate-800 hover:bg-slate-200 dark:bg-[#1E293B] dark:text-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{label}</span>
                  </span>
                  {tab === "hafal" && typeof dueCount === "number" && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        isActive
                          ? "bg-white text-[#2563EB]"
                          : "bg-[#2563EB] text-white"
                      }`}
                    >
                      {dueCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="space-y-1.5 border-t border-slate-200 pt-4 dark:border-slate-800">
            <p className="px-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Modul Berikutnya
            </p>
            {UPCOMING_ITEMS.map(({ label, badge, Icon }) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-500 dark:text-slate-400"
              >
                <span className="flex items-center gap-2">
                  <Icon className="h-4 w-4 shrink-0 opacity-75" />
                  <span>{label}</span>
                </span>
                <span className="rounded-md bg-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-4">
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center justify-between rounded-xl border border-[#2563EB]/30 bg-[#EFF6FF] px-3 py-2 text-xs font-bold text-[#1D4ED8] transition hover:bg-[#DBEAFE] dark:border-[#60A5FA]/30 dark:bg-[#1E293B] dark:text-[#60A5FA] dark:hover:bg-[#273549]"
            >
              <span className="flex items-center gap-2">
                <IconSettings className="h-4 w-4" />
                <span>Panel Admin</span>
              </span>
              <span className="rounded-md bg-[#2563EB] px-1.5 py-0.5 text-[10px] font-bold text-white">
                ADMIN
              </span>
            </Link>
          )}
          <div className="flex items-center justify-between gap-2 rounded-2xl bg-[#0F172A] p-3 text-white dark:border dark:border-slate-800 dark:bg-[#1E293B]">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-xs font-bold text-white">
                {initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold">{displayName || "Pelajar JLPT"}</p>
                <p className="text-[11px] text-slate-300">Level {targetLevel}</p>
              </div>
            </div>
            {logoutAction && (
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 rounded-lg bg-[#2563EB] px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-[#1D4ED8]"
                  title="Keluar akun"
                >
                  <IconLogOut className="h-3.5 w-3.5" />
                  <span>Keluar</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile Sticky Top Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:hidden dark:border-slate-800 dark:bg-[#111827]/95">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563EB] font-[var(--font-jp)] text-sm font-bold text-white">
              日
            </span>
            <span className="text-sm font-bold">JLPT App</span>
          </Link>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link
                href="/admin"
                className="rounded-full bg-[#2563EB] px-2.5 py-1 text-[11px] font-bold text-white transition hover:bg-[#1D4ED8]"
              >
                Admin
              </Link>
            )}
            <span className="rounded-full bg-[#F1F5F9] px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:bg-[#1E293B] dark:text-slate-200">
              Target {targetLevel}
            </span>
            <Link
              href="/settings"
              aria-label="Buka Pengaturan"
              className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                pathname === "/settings" || activeTab === "pengaturan"
                  ? "border-[#2563EB] bg-[#2563EB] text-white"
                  : "border-slate-200 bg-[#F8FAFC] text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-[#1E293B] dark:text-slate-200"
              }`}
            >
              <IconSettings className="h-4 w-4" />
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 pb-24 sm:px-6 md:px-10 md:py-8 md:pb-10">
          {children}
        </main>
      </div>

      {/* Mobile Compact 5-Column Responsive Bottom Navbar (Zero Horizontal Scroll) */}
      <nav
        aria-label="Navigasi bawah mobile"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white px-2 pt-2 pb-[calc(0.65rem+env(safe-area-inset-bottom))] md:hidden dark:border-slate-800 dark:bg-[#111827]"
      >
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {MOBILE_TABS.map(({ href, label, tab, Icon }) => {
            const isActive = activeTab === tab;
            return (
              <Link
                key={label}
                href={href}
                className={`flex flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 text-[10px] transition ${
                  isActive
                    ? "bg-[#2563EB] font-bold text-white"
                    : "font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
