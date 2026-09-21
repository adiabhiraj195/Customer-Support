"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, Database, LogIn, LogOut, MessageSquare, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useHealth } from "@/hooks/useHealth";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, isHydrated, logout } = useAuth();
  const { isHealthy, isLoading: isHealthLoading } = useHealth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs transition-transform group-hover:scale-105">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <span className="font-semibold text-foreground tracking-tight text-base">
                RAG Support
              </span>
              <span className="ml-1.5 rounded bg-primary-subtle px-1.5 py-0.5 text-[10px] font-medium text-primary-subtle-foreground">
                v1.0
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              href="/conversation"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                pathname.startsWith("/conversation")
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Conversations</span>
            </Link>

            <Link
              href="/knowledgebase"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                pathname.startsWith("/knowledgebase")
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              <Database className="h-4 w-4" />
              <span>Knowledge Base</span>
            </Link>

            <Link
              href="/playground"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                pathname.startsWith("/playground")
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>Playground</span>
            </Link>
          </nav>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Health Status Indicator */}
          <div
            className="flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground"
            title="Backend API at http://localhost:8000"
          >
            {isHealthLoading ? (
              <span className="h-2 w-2 rounded-full bg-warning animate-ping" />
            ) : isHealthy ? (
              <span className="flex items-center gap-1 text-success">
                <span className="h-2 w-2 rounded-full bg-success" />
                <span className="hidden sm:inline">Online</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-destructive">
                <span className="h-2 w-2 rounded-full bg-destructive" />
                <span className="hidden sm:inline">Offline</span>
              </span>
            )}
            <span className="text-[11px] text-subtle-foreground">localhost:8000</span>
          </div>

          {/* Theme Toggle Component */}
          <ThemeToggle />

          {/* Auth section */}
          {isHydrated && (
            <div className="flex items-center gap-2">
              {isAuthenticated && user ? (
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex flex-col items-end text-xs">
                    <span className="font-medium text-foreground">
                      {user.name || user.email.split("@")[0]}
                    </span>
                    <span className="text-[10px] text-muted-foreground capitalize">
                      {user.role || "User"}
                    </span>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-foreground font-semibold text-xs">
                    {(user.name?.[0] || user.email[0]).toUpperCase()}
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive-subtle transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    href="/signup"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors"
                  >
                    <span>Sign Up</span>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
