"use client";

import { useSyncExternalStore } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/stores/themeStore";

const emptySubscribe = () => () => {};

export function ThemeToggle({ className = "" }: { className?: string }) {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const { theme, resolvedTheme, setTheme } = useThemeStore();

  const cycleTheme = () => {
    if (theme === "system") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("system");
    }
  };

  if (!mounted) {
    return (
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground ${className}`}
        aria-hidden="true"
      >
        <span className="h-4 w-4" />
      </div>
    );
  }

  const label =
    theme === "system"
      ? `System (${resolvedTheme})`
      : theme === "light"
      ? "Light mode"
      : "Dark mode";

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className={`relative flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent hover:border-border transition-all shadow-2xs focus:outline-none focus:ring-2 focus:ring-ring ${className}`}
      title={`Current: ${label}. Click to cycle themes.`}
      aria-label={`Current: ${label}. Click to cycle themes.`}
    >
      {theme === "system" ? (
        <Monitor className="h-4 w-4" />
      ) : theme === "light" ? (
        <Sun className="h-4 w-4 text-amber-500" />
      ) : (
        <Moon className="h-4 w-4 text-blue-400" />
      )}
    </button>
  );
}

