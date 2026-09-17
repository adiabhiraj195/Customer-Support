"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, Database, LogIn, LogOut, MessageSquare, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useHealth } from "@/hooks/useHealth";

export function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, isHydrated, logout } = useAuth();
  const { isHealthy, isLoading: isHealthLoading } = useHealth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm transition-transform group-hover:scale-105">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <span className="font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight text-base">
                RAG Support
              </span>
              <span className="ml-1.5 rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
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
                  ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900"
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Conversations</span>
            </Link>

            <Link
              href="/knowledgebase"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                pathname.startsWith("/knowledgebase")
                  ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900"
              }`}
            >
              <Database className="h-4 w-4" />
              <span>Knowledge Base</span>
            </Link>

            <Link
              href="/?tab=stateless"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                pathname === "/"
                  ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-900"
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
            className="flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
            title="Backend API at http://localhost:8000"
          >
            {isHealthLoading ? (
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
            ) : isHealthy ? (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="hidden sm:inline">Online</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-rose-500">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                <span className="hidden sm:inline">Offline</span>
              </span>
            )}
            <span className="text-[11px] text-zinc-400">localhost:8000</span>
          </div>

          {/* Auth section */}
          {isHydrated && (
            <div className="flex items-center gap-2">
              {isAuthenticated && user ? (
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex flex-col items-end text-xs">
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                      {user.name || user.email.split("@")[0]}
                    </span>
                    <span className="text-[10px] text-zinc-500 capitalize">
                      {user.role || "User"}
                    </span>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 font-semibold text-xs dark:bg-zinc-800 dark:text-zinc-200">
                    {(user.name?.[0] || user.email[0]).toUpperCase()}
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center justify-center h-8 w-8 rounded-lg text-zinc-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    href="/signup"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors"
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

