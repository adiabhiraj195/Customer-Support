"use client";

import React from "react";
import Link from "next/link";
import { Lock, Loader2 } from "lucide-react";

export interface AuthRequiredCardProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  loginHref?: string;
  signupHref?: string;
  signInText?: string;
  signUpText?: string;
  className?: string;
  cardClassName?: string;
}

export function AuthRequiredCard({
  title = "Authentication Required",
  description = "You must be signed in to access this page.",
  icon,
  loginHref = "/login",
  signupHref = "/signup",
  signInText = "Sign In",
  signUpText = "Create Account",
  className = "min-h-[calc(100vh-4rem)]",
  cardClassName = "",
}: AuthRequiredCardProps) {
  return (
    <div
      className={`flex flex-1 flex-col items-center justify-center p-6 text-center ${className}`}
    >
      <div
        className={`max-w-md w-full bg-card rounded-2xl border border-border p-8 text-center shadow-xs ${cardClassName}`}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-subtle text-primary mb-4">
          {icon ?? <Lock className="h-7 w-7" />}
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">{title}</h2>
        <p className="text-sm text-muted-foreground mb-6">{description}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={loginHref}
            className="w-full sm:w-auto rounded-xl bg-primary px-5 py-2.5 text-xs font-medium text-primary-foreground hover:bg-primary-hover shadow-xs transition"
          >
            {signInText}
          </Link>
          <Link
            href={signupHref}
            className="w-full sm:w-auto rounded-xl border border-border px-5 py-2.5 text-xs font-medium text-foreground hover:bg-muted transition"
          >
            {signUpText}
          </Link>
        </div>
      </div>
    </div>
  );
}

export function AuthLoading({
  message = "Checking authorization...",
  className = "min-h-[calc(100vh-4rem)]",
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-1 items-center justify-center ${className}`}>
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="text-xs">{message}</span>
      </div>
    </div>
  );
}

