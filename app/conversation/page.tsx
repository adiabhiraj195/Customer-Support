"use client";

import { ConversationSidebar } from "@/components/chat/ConversationSidebar";
import { ChatArea } from "@/components/chat/ChatArea";

export default function ConversationPage() {
  return (
    <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-4rem)] overflow-hidden bg-background">
      <ConversationSidebar />
      <ChatArea />
    </div>
  );
}
