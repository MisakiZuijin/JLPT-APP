"use client";

import type { ReactNode } from "react";
import { DesktopSidebar } from "./DesktopSidebar";
import { MobileBottomNav, MobileTopBar } from "./MobileBottomNav";

export type AppNavTab =
  | "beranda"
  | "peta"
  | "hafal"
  | "belajar"
  | "ujian"
  | "profil"
  | "pengaturan";

type AppShellProps = {
  children: ReactNode;
  activeTab: AppNavTab;
  displayName?: string | null;
  targetLevel?: string;
  dueCount?: number;
  isAdmin?: boolean;
  logoutAction?: () => Promise<void>;
};

export function AppShell({
  children,
  activeTab,
  displayName,
  targetLevel = "N5",
  dueCount,
  isAdmin = false,
  logoutAction,
}: AppShellProps) {
  return (
    <div className="flex min-h-screen w-full bg-canvas text-text-primary">
      <DesktopSidebar
        activeTab={activeTab}
        displayName={displayName}
        targetLevel={targetLevel}
        dueCount={dueCount}
        isAdmin={isAdmin}
        logoutAction={logoutAction}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopBar
          activeTab={activeTab}
          targetLevel={targetLevel}
          isAdmin={isAdmin}
        />

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-5 pb-24 sm:px-6 lg:px-10 lg:py-8 lg:pb-10">
          {children}
        </main>
      </div>

      <MobileBottomNav activeTab={activeTab} dueCount={dueCount} />
    </div>
  );
}
