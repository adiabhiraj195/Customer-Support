"use client";

import { useState } from "react";
import { Loader2, MessageSquare, Plus, Trash2 } from "lucide-react";
import { useConversations } from "@/hooks/useConversations";
import { useUIStore } from "@/stores/uiStore";

export function ConversationSidebar() {
  const {
    conversations,
    isLoading,
    createConversation,
    isCreating,
    deleteConversation,
  } = useConversations();

  const { selectedConversationId, setSelectedConversationId } = useUIStore();
  const [newTitle, setNewTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      await createConversation({
        title: newTitle.trim() || undefined,
      });
      setNewTitle("");
      setIsAdding(false);
    } catch {
      // Error handled by mutation
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this conversation?")) {
      setDeletingId(id);
      try {
        await deleteConversation(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <aside className="flex flex-col w-full md:w-72 lg:w-80 h-full border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
      {/* Top action bar */}
      <div className="p-3 border-b border-zinc-200 dark:border-zinc-800">
        {isAdding ? (
          <form onSubmit={handleCreate} className="flex items-center gap-1.5">
            <input
              type="text"
              autoFocus
              placeholder="Conversation title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isCreating}
              className="rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isCreating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="rounded-lg border border-zinc-200 dark:border-zinc-700 px-2 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-2 text-xs font-medium shadow-xs transition"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Conversation</span>
          </button>
        )}
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-8 text-zinc-400">
            <Loader2 className="h-5 w-5 animate-spin mb-2" />
            <span className="text-xs">Loading conversations...</span>
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-zinc-400">
            <MessageSquare className="h-8 w-8 stroke-1 mb-2 text-zinc-300 dark:text-zinc-700" />
            <p className="text-xs font-medium text-zinc-500">No conversations yet</p>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Click &quot;New Conversation&quot; to start chatting.
            </p>
          </div>
        ) : (
          conversations.map((conv) => {
            const isSelected = selectedConversationId === conv.id;
            const msgCount = conv._count?.messages ?? 0;
            const updatedDate = new Date(conv.updatedAt || conv.createdAt).toLocaleDateString(
              undefined,
              { month: "short", day: "numeric" }
            );

            return (
              <div
                key={conv.id}
                onClick={() => setSelectedConversationId(conv.id)}
                className={`group relative flex items-center justify-between rounded-xl px-3 py-2.5 cursor-pointer transition text-xs ${
                  isSelected
                    ? "bg-blue-50 text-blue-900 font-medium dark:bg-blue-950/40 dark:text-blue-100 border border-blue-200/60 dark:border-blue-800/40"
                    : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <MessageSquare
                    className={`h-4 w-4 shrink-0 ${
                      isSelected
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
                    }`}
                  />
                  <div className="truncate">
                    <p className="truncate font-medium">{conv.title || "Untitled Chat"}</p>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-0.5">
                      <span>{updatedDate}</span>
                      {msgCount > 0 && (
                        <>
                          <span>•</span>
                          <span>{msgCount} msgs</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Delete button on hover */}
                <button
                  onClick={(e) => handleDelete(e, conv.id)}
                  disabled={deletingId === conv.id}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-opacity"
                  title="Delete Conversation"
                >
                  {deletingId === conv.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-rose-500" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}

