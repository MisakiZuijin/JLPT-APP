"use client";

import { useTheme, type ThemeMode } from "./ThemeProvider";
import { IconMonitor, IconMoon, IconSun } from "@/components/ui/Icons";

export function ThemeToggleCompact() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-[#F1F5F9] p-1 dark:border-slate-700 dark:bg-[#111827]">
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
          !isDark
            ? "bg-[#2563EB] text-white"
            : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        }`}
        aria-label="Aktifkan Mode Terang"
      >
        <IconSun className="h-3.5 w-3.5" />
        <span>Terang</span>
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
          isDark
            ? "bg-[#2563EB] text-white"
            : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        }`}
        aria-label="Aktifkan Mode Gelap"
      >
        <IconMoon className="h-3.5 w-3.5" />
        <span>Gelap</span>
      </button>
    </div>
  );
}

const MODES: { value: ThemeMode; label: string; Icon: typeof IconSun }[] = [
  { value: "light", label: "Terang", Icon: IconSun },
  { value: "dark", label: "Gelap", Icon: IconMoon },
  { value: "system", label: "Sistem", Icon: IconMonitor },
];

export function ThemeSelectorSegmented() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-[#E2E8F0] p-1.5 dark:bg-[#1E293B]">
      {MODES.map(({ value, label, Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition ${
              active
                ? "bg-[#2563EB] text-white"
                : "text-slate-700 hover:bg-white/60 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
