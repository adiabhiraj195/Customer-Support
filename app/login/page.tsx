"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Bot, Lock, Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

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
      <div className="flex flex-1 items-center justify-center p-6 bg-background">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto mb-4">
            <Bot className="h-7 w-7" />
          </div>
          <CardTitle className="mb-2">You are already signed in</CardTitle>
          <CardDescription className="mb-6">
            Continue to your conversations or explore the knowledge base.
          </CardDescription>
          <div className="flex flex-col gap-2.5">
            <Link href="/conversation">
              <Button className="w-full" size="md">
                Go to Conversations
              </Button>
            </Link>
            <Link href="/knowledgebase">
              <Button variant="outline" className="w-full" size="md">
                Go to Knowledge Base
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8 bg-background">
      <Card className="w-full max-w-md p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xs mb-2">
            <Bot className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to access your persistent conversations and knowledge base
          </CardDescription>
        </div>

        {/* Error Alert */}
        {(localError || loginError) && (
          <div className="flex items-center gap-2 rounded-xl bg-destructive-subtle p-3 text-xs text-destructive-subtle-foreground border border-destructive-border">
            <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
            <span>{localError || (loginError as Error)?.message}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="email"
            type="email"
            required
            label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            leftIcon={<Mail className="h-4 w-4" />}
          />

          <Input
            id="password"
            type="password"
            required
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            leftIcon={<Lock className="h-4 w-4" />}
          />

          <Button
            type="submit"
            isLoading={isLoggingIn}
            className="w-full mt-2"
            size="md"
          >
            Sign In
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground pt-2">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-primary hover:text-primary-hover underline underline-offset-4"
          >
            Create an account
          </Link>
        </div>
      </Card>
    </div>
  );
}
