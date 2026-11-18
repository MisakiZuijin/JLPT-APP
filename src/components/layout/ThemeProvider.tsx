"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

export type ThemeMode = "light" | "dark" | "system";

type ThemeContextValue = {
  theme: ThemeMode;
  resolvedTheme: "light" | "dark";
  setTheme: (mode: ThemeMode) => void;
};

const STORAGE_KEY = "jlpt-theme";
const THEME_EVENT = "jlpt-theme-change";

const ThemeContext = createContext<ThemeContextValue>({
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => {},
});

function readStoredTheme(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    // Abaikan jika localStorage tidak tersedia
  }
  return "system";
}

function subscribeTheme(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(THEME_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(THEME_EVENT, callback);
  };
}

function subscribeSystemDark(callback: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function getSystemDarkSnapshot(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore<ThemeMode>(
    subscribeTheme,
    readStoredTheme,
    () => "system",
  );
  const systemDark = useSyncExternalStore<boolean>(
    subscribeSystemDark,
    getSystemDarkSnapshot,
    () => false,
  );

  const resolvedTheme: "light" | "dark" =
    theme === "dark" || (theme === "system" && systemDark) ? "dark" : "light";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
  }, [resolvedTheme]);

  const setTheme = useCallback((mode: ThemeMode) => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Abaikan jika storage diblokir
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
