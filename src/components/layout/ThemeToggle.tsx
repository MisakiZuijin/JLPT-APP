"use client";

import { useTheme, type ThemeMode } from "./ThemeProvider";
import { IconMonitor, IconMoon, IconSun } from "@/components/ui/Icons";

export function ThemeToggleCompact() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-border-default bg-subtle p-1 whitespace-nowrap">
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={`inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
          !isDark
            ? "bg-brand-primary text-brand-primary-fg"
            : "text-text-secondary hover:text-text-primary"
        }`}
        aria-label="Aktifkan Mode Terang"
      >
        <IconSun className="h-3.5 w-3.5 shrink-0" />
        <span>Terang</span>
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={`inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
          isDark
            ? "bg-brand-primary text-brand-primary-fg"
            : "text-text-secondary hover:text-text-primary"
        }`}
        aria-label="Aktifkan Mode Gelap"
      >
        <IconMoon className="h-3.5 w-3.5 shrink-0" />
        <span>Gelap</span>
      </button>
    </div>
  );
}

/**
 * Tombol ringkas 1 klik (36x36px) khusus header mobile agar tidak berdesakan di layar sempit.
 */
export function ThemeToggleIcon() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Ubah ke Mode Terang" : "Ubah ke Mode Gelap"}
      title={isDark ? "Mode Terang" : "Mode Gelap"}
      className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-border-default bg-subtle text-text-primary transition hover:bg-canvas"
    >
      {isDark ? (
        <IconSun className="h-4 w-4 text-brand-accent" />
      ) : (
        <IconMoon className="h-4 w-4 text-brand-primary" />
      )}
    </button>
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
    <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-border-default bg-subtle p-1.5">
      {MODES.map(({ value, label, Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            className={`inline-flex min-h-10 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition ${
              active
                ? "bg-brand-primary text-brand-primary-fg shadow-xs"
                : "text-text-secondary hover:bg-surface/70 hover:text-text-primary"
            }`}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
