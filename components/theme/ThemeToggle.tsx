"use client";

import { useSyncExternalStore } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme/ThemeProvider";

const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  if (!mounted) {
    return (
      <div className="h-8 w-8 rounded-lg border border-border bg-card/50" />
    );
  }

  return (
    <div className="flex items-center rounded-lg border border-border bg-card/60 p-0.5 text-muted-foreground backdrop-blur-xs">
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
          theme === "light"
            ? "bg-primary text-primary-foreground shadow-xs"
            : "hover:text-foreground"
        }`}
        title="Light theme"
        aria-label="Light theme"
      >
        <Sun className="h-3.5 w-3.5" />
      </button>

      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
          theme === "dark"
            ? "bg-primary text-primary-foreground shadow-xs"
            : "hover:text-foreground"
        }`}
        title="Dark theme"
        aria-label="Dark theme"
      >
        <Moon className="h-3.5 w-3.5" />
      </button>

      <button
        type="button"
        onClick={() => setTheme("system")}
        className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
          theme === "system"
            ? "bg-primary text-primary-foreground shadow-xs"
            : "hover:text-foreground"
        }`}
        title={`System theme (currently ${resolvedTheme})`}
        aria-label="System theme"
      >
        <Monitor className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

