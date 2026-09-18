import { create } from "zustand";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  initializeTheme: () => void;
}

const THEME_STORAGE_KEY = "rag_app_theme";

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyThemeClass(resolved: ResolvedTheme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (resolved === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: "system",
  resolvedTheme: "light",

  setTheme: (theme: Theme) => {
    const resolved = theme === "system" ? getSystemTheme() : theme;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
      } catch {
        // Ignore localStorage errors
      }
    }
    applyThemeClass(resolved);
    set({ theme, resolvedTheme: resolved });
  },

  initializeTheme: () => {
    if (typeof window === "undefined") return;

    let savedTheme: Theme = "system";
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === "light" || stored === "dark" || stored === "system") {
        savedTheme = stored;
      }
    } catch {
      // Ignore
    }

    const resolved =
      savedTheme === "system" ? getSystemTheme() : (savedTheme as ResolvedTheme);
    applyThemeClass(resolved);
    set({ theme: savedTheme, resolvedTheme: resolved });

    // Listen to OS color scheme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (get().theme === "system") {
        const currentSystem = getSystemTheme();
        applyThemeClass(currentSystem);
        set({ resolvedTheme: currentSystem });
      }
    };

    mediaQuery.addEventListener("change", handleChange);
  },
}));

