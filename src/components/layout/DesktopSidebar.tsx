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
  IconInfo,
  IconLogOut,
  IconMessage,
  IconMic,
  IconPen,
  IconPuzzle,
  IconSettings,
  IconUser,
} from "@/components/ui/Icons";
import type { AppNavTab } from "./AppShell";

type SidebarItem = {
  href: string;
  label: string;
  tab: AppNavTab;
  Icon: typeof IconHome;
};

type SidebarGroup = {
  title: string;
  items: SidebarItem[];
};

const SIDEBAR_GROUPS: SidebarGroup[] = [
  {
    title: "Jalur Utama",
    items: [
      { href: "/dashboard", label: "Beranda Belajar", tab: "beranda", Icon: IconHome },
      { href: "/review", label: "Hafalan Kartu", tab: "hafal", Icon: IconCards },
    ],
  },
  {
    title: "Latihan 4-Skill",
    items: [
      { href: "/kana", label: "Tabel Kana", tab: "belajar", Icon: IconBook },
      { href: "/reading", label: "Membaca & Furigana", tab: "belajar", Icon: IconBook },
      { href: "/writing", label: "Menulis Goresan", tab: "belajar", Icon: IconPen },
      { href: "/pronunciation", label: "Latihan Pengucapan", tab: "belajar", Icon: IconMic },
      { href: "/kaiwa", label: "Percakapan Kaiwa", tab: "belajar", Icon: IconMessage },
      { href: "/culture", label: "Budaya & Etika", tab: "belajar", Icon: IconGlobe },
    ],
  },
  {
    title: "Evaluasi & Ujian",
    items: [
      { href: "/daily-test", label: "Tes Harian (20)", tab: "ujian", Icon: IconCalendar },
      { href: "/exam", label: "Simulasi JLPT N5–N1", tab: "ujian", Icon: IconExam },
      { href: "/bunpou", label: "Bunpou & Drill", tab: "ujian", Icon: IconPuzzle },
      { href: "/mistakes", label: "Buku Kesalahan", tab: "ujian", Icon: IconAlert },
    ],
  },
  {
    title: "Akun & Informasi",
    items: [
      { href: "/profile", label: "Profil & Kesiapan", tab: "profil", Icon: IconUser },
      { href: "/settings", label: "Pengaturan", tab: "pengaturan", Icon: IconSettings },
      { href: "/about", label: "Tentang & Lisensi", tab: "pengaturan", Icon: IconInfo },
    ],
  },
];

type DesktopSidebarProps = {
  activeTab: AppNavTab;
  displayName?: string | null;
  targetLevel: string;
  dueCount?: number;
  isAdmin: boolean;
  logoutAction?: () => Promise<void>;
};

export function DesktopSidebar({
  activeTab,
  displayName,
  targetLevel,
  dueCount,
  isAdmin,
  logoutAction,
}: DesktopSidebarProps) {
  const pathname = usePathname();
  const initials =
    (displayName || "P")
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "P";

  return (
    <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:justify-between lg:border-r lg:border-border-default lg:bg-surface lg:p-4">
      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-2xl px-1.5 py-1 transition hover:opacity-90"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-primary font-jp text-lg font-bold text-brand-primary-fg shadow-xs">
            道
          </span>
          <div className="min-w-0">
            <p className="font-heading truncate text-base font-bold leading-tight text-text-primary">
              JLPT App
            </p>
            <p className="font-mono text-[11px] font-medium text-brand-primary">
              Target Level {targetLevel}
            </p>
          </div>
        </Link>

        <nav className="space-y-4" aria-label="Navigasi utama desktop">
          {SIDEBAR_GROUPS.map((group) => (
            <div key={group.title} className="space-y-1">
              <p className="px-3 text-[10px] font-bold tracking-wider text-text-secondary/80 uppercase">
                {group.title}
              </p>
              {group.items.map(({ href, label, tab, Icon }) => {
                const isExact =
                  pathname === href ||
                  (href !== "/dashboard" && pathname.startsWith(`${href}/`));
                const isFallback =
                  href === "/dashboard" && activeTab === "beranda" && pathname === "/dashboard";
                const isActive = isExact || isFallback;

                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-[13px] font-semibold transition ${
                      isActive
                        ? "bg-brand-primary-soft font-bold text-brand-primary"
                        : "text-text-secondary hover:bg-subtle hover:text-text-primary"
                    }`}
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{label}</span>
                    </span>
                    {tab === "hafal" && typeof dueCount === "number" && (
                      <span
                        className={`rounded-full px-2 py-0.5 font-mono text-[11px] font-bold tabular-nums ${
                          isActive
                            ? "bg-brand-primary text-brand-primary-fg"
                            : "bg-brand-primary-soft text-brand-primary"
                        }`}
                      >
                        {dueCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      <div className="space-y-2.5 border-t border-border-default pt-3">
        {isAdmin && (
          <Link
            href="/admin"
            className="flex items-center justify-between rounded-xl border border-[#26333D] bg-[#151E24] px-3 py-2 text-xs font-bold text-[#2DD4BF] transition hover:bg-[#1D2830]"
          >
            <span className="flex items-center gap-2">
              <IconSettings className="h-4 w-4" />
              <span>Panel Admin</span>
            </span>
            <span className="rounded-md bg-[#122E2C] px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#2DD4BF]">
              ADMIN
            </span>
          </Link>
        )}

        <div className="flex items-center justify-between gap-2 rounded-2xl border border-[#26333D] bg-[#1C252C] p-3 text-[#F1F5F4] dark:bg-[#1D2830]">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary font-heading text-xs font-bold text-brand-primary-fg">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-[#F1F5F4]">
                {displayName || "Pelajar JLPT"}
              </p>
              <p className="font-mono text-[10px] text-[#9AAAB5]">
                Target {targetLevel}
              </p>
            </div>
          </div>

          {logoutAction && (
            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex min-h-8 cursor-pointer items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-bold text-[#F1F5F4] transition hover:bg-white/20"
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
  );
}
