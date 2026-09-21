"use client";

import React, { createContext, useContext, useEffect, useSyncExternalStore } from "react";
import { ThemeMode } from "./tokens";
import { themeConfig } from "./config";

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: themeConfig.defaultMode,
  resolvedTheme: "light",
  setTheme: () => {},
});

const THEME_STORAGE_KEY = "rag-support-theme";

// External store subscription management
const listeners = new Set<() => void>();
function notify() {
  listeners.forEach((callback) => callback());
}

function subscribe(callback: () => void) {
  listeners.add(callback);

  let mediaQuery: MediaQueryList | null = null;
  const mediaListener = () => {
    callback();
  };

  if (typeof window !== "undefined") {
    mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", mediaListener);
  }

  return () => {
    listeners.delete(callback);
    mediaQuery?.removeEventListener("change", mediaListener);
  };
}

function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return themeConfig.defaultMode;
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    // Ignore error
  }
  return themeConfig.defaultMode;
}

function applyThemeToDom(resolved: "light" | "dark") {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (resolved === "dark") {
    root.classList.add("dark");
    root.classList.remove("light");
    root.setAttribute("data-theme", "dark");
  } else {
    root.classList.add("light");
    root.classList.remove("dark");
    root.setAttribute("data-theme", "light");
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore<ThemeMode>(
    subscribe,
    getStoredTheme,
    () => themeConfig.defaultMode
  );

  const isSystemDark = useSyncExternalStore<boolean>(
    subscribe,
    () => typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches,
    () => false
  );

  const resolvedTheme: "light" | "dark" =
    theme === "system" ? (isSystemDark ? "dark" : "light") : theme;

  // Apply to DOM whenever resolvedTheme changes
  useEffect(() => {
    applyThemeToDom(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = (newTheme: ThemeMode) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch {
      // Ignore write errors
    }
    notify();
    const isDark =
      newTheme === "system"
        ? typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
        : newTheme === "dark";
    applyThemeToDom(isDark ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
