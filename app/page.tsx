"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Database, MessageSquare, Sparkles } from "lucide-react";
import { useUIStore, ActiveTab } from "@/stores/uiStore";
import { ConversationSidebar } from "@/components/chat/ConversationSidebar";
import { ChatArea } from "@/components/chat/ChatArea";
import { DocumentUploadCard } from "@/components/knowledge/DocumentUploadCard";
import { StatelessPlayground } from "@/components/stateless/StatelessPlayground";

function DashboardContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") as ActiveTab | null;
  const { activeTab, setActiveTab } = useUIStore();

  const currentTab = initialTab || activeTab;

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      {/* Sub-header Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 sm:px-6 py-2.5">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-xs font-medium">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              currentTab === "chat"
                ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-800 dark:text-zinc-50"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Conversations</span>
          </button>

          <button
            onClick={() => setActiveTab("knowledge")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              currentTab === "knowledge"
                ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-800 dark:text-zinc-50"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            <Database className="h-3.5 w-3.5" />
            <span>Knowledge Base</span>
          </button>

          <button
            onClick={() => setActiveTab("stateless")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              currentTab === "stateless"
                ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-800 dark:text-zinc-50"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Stateless Playground</span>
          </button>
        </div>

        <div className="hidden sm:block text-xs text-zinc-400">
          {currentTab === "chat" && "Persistent Multi-turn AI Assistant"}
          {currentTab === "knowledge" && "Direct S3 Ingestion & BullMQ Tracker"}
          {currentTab === "stateless" && "Direct RRF & Hybrid Search Diagnostics"}
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 flex overflow-hidden">
        {currentTab === "chat" && (
          <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
            <ConversationSidebar />
            <ChatArea />
          </div>
        )}

        {currentTab === "knowledge" && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <DocumentUploadCard />
          </div>
        )}

        {currentTab === "stateless" && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <StatelessPlayground />
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center p-8 text-zinc-400 text-xs">
          Loading dashboard...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
