"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconBook,
  IconCards,
  IconExam,
  IconHome,
  IconSettings,
  IconUser,
} from "@/components/ui/Icons";
import type { AppNavTab } from "./AppShell";

const MOBILE_TABS: {
  href: string;
  label: string;
  tab: AppNavTab;
  Icon: typeof IconHome;
}[] = [
  { href: "/dashboard", label: "Beranda", tab: "beranda", Icon: IconHome },
  { href: "/review", label: "Hafal", tab: "hafal", Icon: IconCards },
  { href: "/kana", label: "Latih", tab: "belajar", Icon: IconBook },
  { href: "/exam", label: "Ujian", tab: "ujian", Icon: IconExam },
  { href: "/profile", label: "Profil", tab: "profil", Icon: IconUser },
];

type MobileTopBarProps = {
  activeTab: AppNavTab;
  targetLevel: string;
  isAdmin: boolean;
};

export function MobileTopBar({
  activeTab,
  targetLevel,
  isAdmin,
}: MobileTopBarProps) {
  const pathname = usePathname();
  const isSettingsActive = pathname === "/settings" || activeTab === "pengaturan";

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-2 border-b border-border-default bg-surface/95 px-4 backdrop-blur sm:px-6 lg:hidden">
      <Link href="/dashboard" className="flex min-w-0 items-center gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-primary font-jp text-sm font-bold text-brand-primary-fg">
          道
        </span>
        <span className="font-heading truncate text-sm font-bold tracking-tight text-text-primary">
          JLPT App
        </span>
      </Link>

      <div className="flex shrink-0 items-center gap-2">
        {isAdmin && (
          <Link
            href="/admin"
            className="inline-flex min-h-8 items-center rounded-full border border-[#26333D] bg-[#151E24] px-2.5 py-1 font-mono text-[11px] font-bold text-[#2DD4BF]"
          >
            Admin
          </Link>
        )}
        <span className="rounded-full bg-brand-primary-soft px-2.5 py-1 font-mono text-[11px] font-bold text-brand-primary">
          {targetLevel}
        </span>
        <Link
          href="/settings"
          aria-label="Buka Pengaturan"
          className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
            isSettingsActive
              ? "border-brand-primary bg-brand-primary text-brand-primary-fg"
              : "border-border-default bg-subtle text-text-primary hover:bg-canvas"
          }`}
        >
          <IconSettings className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}

type MobileBottomNavProps = {
  activeTab: AppNavTab;
  dueCount?: number;
};

export function MobileBottomNav({ activeTab, dueCount }: MobileBottomNavProps) {
  return (
    <nav
      aria-label="Navigasi bawah mobile"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border-default bg-surface/95 px-2 pt-1.5 pb-[calc(0.5rem+env(safe-area-inset-bottom))] backdrop-blur lg:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {MOBILE_TABS.map(({ href, label, tab, Icon }) => {
          const isActive = activeTab === tab;
          return (
            <Link
              key={tab}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 text-[10px] transition ${
                isActive
                  ? "bg-brand-primary-soft font-bold text-brand-primary"
                  : "font-semibold text-text-secondary hover:bg-subtle hover:text-text-primary"
              }`}
            >
              <span className="relative">
                <Icon className="h-[18px] w-[18px] shrink-0" />
                {tab === "hafal" && typeof dueCount === "number" && dueCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 flex min-w-4 items-center justify-center rounded-full bg-brand-cta px-1 font-mono text-[9px] font-bold text-brand-cta-fg tabular-nums">
                    {dueCount > 99 ? "99+" : dueCount}
                  </span>
                )}
              </span>
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
