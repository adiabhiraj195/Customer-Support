"use client";

import { useAuth } from "@/hooks/useAuth";
import { ConversationSidebar } from "@/components/chat/ConversationSidebar";
import { ChatArea } from "@/components/chat/ChatArea";
import { AuthRequiredCard, AuthLoading } from "@/components/auth/AuthRequiredCard";

export default function ConversationPage() {
  const { isAuthenticated, isHydrated } = useAuth();

  if (!isHydrated) {
    return <AuthLoading />;
  }

  if (!isAuthenticated) {
    return (
      <AuthRequiredCard
        title="Authentication Required"
        description="You must be signed in to access and manage your persistent conversations."
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-4rem)] overflow-hidden">
      <ConversationSidebar />
      <ChatArea />
    </div>
  );
}
