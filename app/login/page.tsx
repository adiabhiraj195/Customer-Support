"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Bot, Loader2, Lock, Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggingIn, loginError, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError("Please fill in both email and password.");
      return;
    }

    try {
      await login({ email, password });
      router.push("/conversation");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Login failed. Please check your credentials.";
      setLocalError(message);
    }
  };

  if (isAuthenticated) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="max-w-md w-full bg-card rounded-2xl border border-border p-8 text-center shadow-xs">
          <Bot className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            You are already signed in
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Continue to your conversations or explore the knowledge base.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/conversation"
              className="w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition"
            >
              Go to Conversations
            </Link>
            <Link
              href="/knowledgebase"
              className="w-full rounded-xl border border-border py-2.5 text-sm font-medium text-foreground hover:bg-muted transition"
            >
              Go to Knowledge Base
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-2xl border border-border shadow-xs">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xs mb-4">
            <Bot className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Welcome Back
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in to access your persistent conversations and knowledge base
          </p>
        </div>

        {/* Error Alert */}
        {(localError || loginError) && (
          <div className="flex items-center gap-2 rounded-xl bg-destructive-subtle p-3 text-sm text-destructive-subtle-foreground border border-destructive-border">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{localError || (loginError as Error)?.message}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-foreground mb-1"
            >
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-subtle-foreground" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full rounded-xl border border-input bg-muted/40 pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-subtle-foreground focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none transition"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-foreground mb-1"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-subtle-foreground" />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-input bg-muted/40 pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-subtle-foreground focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-medium py-2.5 text-sm shadow-xs transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-primary hover:text-primary-hover"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
