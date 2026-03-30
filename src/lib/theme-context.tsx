"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";

export type AppTheme = "muthr" | "light" | "speakx";

const THEME_ORDER: AppTheme[] = ["muthr", "light", "speakx"];

interface ThemeContextValue {
  theme: AppTheme;
  cycle: () => void;
  setTheme: (t: AppTheme) => void;
  is: (t: AppTheme) => boolean;
  pick: <T>(options: Record<AppTheme, T>) => T;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "muthr",
  cycle: () => {},
  setTheme: () => {},
  is: () => false,
  pick: (opts) => opts.muthr,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AppTheme>("muthr");

  const cycle = useCallback(() => {
    setThemeState((prev) => {
      const idx = THEME_ORDER.indexOf(prev);
      return THEME_ORDER[(idx + 1) % THEME_ORDER.length];
    });
  }, []);

  const setTheme = useCallback((t: AppTheme) => {
    setThemeState(t);
  }, []);

  const is = useCallback((t: AppTheme) => theme === t, [theme]);

  const pick = useCallback(
    <T,>(options: Record<AppTheme, T>): T => options[theme],
    [theme]
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "muthr") {
      document.body.classList.add("crt-scanlines", "crt-flicker");
      document.body.style.background = "#0a0e08";
    } else if (theme === "light") {
      document.body.classList.remove("crt-scanlines", "crt-flicker");
      document.body.style.background = "#f8fafc";
    } else {
      document.body.classList.remove("crt-scanlines", "crt-flicker");
      document.body.style.background = "#FFF8F3";
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, cycle, setTheme, is, pick }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
