"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, Database, LogIn, LogOut, MessageSquare, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useHealth } from "@/hooks/useHealth";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Badge } from "@/components/ui/Badge";

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
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-2xs transition-transform group-hover:scale-105">
              <Bot className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-foreground tracking-tight text-base">
                RAG Support
              </span>
              <Badge variant="default" size="sm">
                v1.0
              </Badge>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              href="/conversation"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors ${
                pathname.startsWith("/conversation")
                  ? "bg-accent text-accent-foreground font-semibold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-card-muted"
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Conversations</span>
            </Link>

            <Link
              href="/knowledgebase"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors ${
                pathname.startsWith("/knowledgebase")
                  ? "bg-accent text-accent-foreground font-semibold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-card-muted"
              }`}
            >
              <Database className="h-4 w-4" />
              <span>Knowledge Base</span>
            </Link>

            <Link
              href="/?tab=stateless"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors ${
                pathname === "/"
                  ? "bg-accent text-accent-foreground font-semibold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-card-muted"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>Playground</span>
            </Link>
          </nav>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2.5">
          {/* Health Status Indicator */}
          <div
            className="flex items-center gap-1.5 rounded-full border border-border bg-card-muted/70 px-2.5 py-1 text-xs font-medium text-foreground shadow-2xs"
            title="Backend API at http://localhost:8000"
          >
            {isHealthLoading ? (
              <span className="h-2 w-2 rounded-full bg-warning animate-ping" />
            ) : isHealthy ? (
              <span className="flex items-center gap-1.5 text-success font-semibold text-[11px]">
                <span className="h-2 w-2 rounded-full bg-success" />
                <span className="hidden sm:inline">Online</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-destructive font-semibold text-[11px]">
                <span className="h-2 w-2 rounded-full bg-destructive" />
                <span className="hidden sm:inline">Offline</span>
              </span>
            )}
            <span className="text-[11px] text-muted-foreground font-mono">
              localhost:8000
            </span>
          </div>

          {/* Theme Switcher Toggle */}
          <ThemeToggle />

          {/* Auth section */}
          {isHydrated && (
            <div className="flex items-center gap-2">
              {isAuthenticated && user ? (
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex flex-col items-end text-xs">
                    <span className="font-semibold text-foreground">
                      {user.name || user.email.split("@")[0]}
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {user.organisation?.name && (
                        <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                          {user.organisation.name}
                        </span>
                      )}
                      {user.role === "Admin" ? (
                        <Badge variant="default" size="sm">
                          Admin
                        </Badge>
                      ) : user.role === "Support Agent" ? (
                        <Badge
                          variant={
                            user.status === "PENDING_APPROVAL"
                              ? "warning"
                              : "secondary"
                          }
                          size="sm"
                        >
                          {user.status === "PENDING_APPROVAL"
                            ? "Agent (Pending)"
                            : "Agent"}
                        </Badge>
                      ) : (
                        <Badge variant="outline" size="sm">
                          {user.role || "Customer"}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary text-secondary-foreground font-semibold text-xs border border-border">
                    {(user.name?.[0] || user.email[0]).toUpperCase()}
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center justify-center h-8 w-8 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive-subtle transition-colors"
                    title="Sign Out"
                    aria-label="Sign Out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-foreground hover:bg-card-muted transition-colors"
                  >
                    <LogIn className="h-4 w-4 text-muted-foreground" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    href="/signup"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary-hover shadow-2xs transition-colors"
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
