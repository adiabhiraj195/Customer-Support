"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuth();

  useEffect(() => {
    if (!isHydrated) return;

    if (isAuthenticated) {
      router.replace("/conversation");
    } else {
      router.replace("/login");
    }
  }, [isAuthenticated, isHydrated, router]);

  return (
    <div className="flex flex-1 items-center justify-center h-full min-h-0 bg-background text-muted-foreground">
      <div className="flex flex-col items-center gap-2.5">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="text-xs font-medium">Redirecting...</span>
      </div>
    </div>
  );
}
