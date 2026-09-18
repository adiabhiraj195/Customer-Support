"use client";

import { useState } from "react";
import { Clock, Loader2, MessageSquare, Plus, ShieldAlert, Trash2 } from "lucide-react";
import { useConversations } from "@/hooks/useConversations";
import { useAuth } from "@/hooks/useAuth";
import { useUIStore } from "@/stores/uiStore";
import { Button } from "@/components/ui/Button";

export function ConversationSidebar() {
  const { user } = useAuth();
  const isAgentPending =
    user?.role === "Support Agent" && user?.status === "PENDING_APPROVAL";

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
    <aside className="flex flex-col w-full md:w-72 lg:w-80 h-full border-r border-border bg-card-muted/40">
      {/* Top action bar */}
      <div className="p-3 border-b border-border space-y-2">
        {isAgentPending && (
          <div className="rounded-xl border border-warning-border bg-warning-subtle p-2.5 text-[11px] text-warning-subtle-foreground space-y-1">
            <div className="flex items-center gap-1.5 font-semibold">
              <Clock className="h-3.5 w-3.5 text-warning shrink-0" />
              <span>Pending Admin Approval</span>
            </div>
            <p className="text-[10px] opacity-90 leading-tight">
              Support Agents must be approved by an Admin before creating conversations or handling tasks.
            </p>
          </div>
        )}

        {isAdding ? (
          <form onSubmit={handleCreate} className="flex items-center gap-1.5">
            <input
              type="text"
              autoFocus
              placeholder="Conversation title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1 rounded-xl border border-border bg-card px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <Button
              type="submit"
              size="xs"
              isLoading={isCreating}
              disabled={isCreating}
            >
              Save
            </Button>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => setIsAdding(false)}
            >
              Cancel
            </Button>
          </form>
        ) : (
          <Button
            onClick={() => setIsAdding(true)}
            size="sm"
            disabled={isAgentPending}
            leftIcon={
              isAgentPending ? (
                <ShieldAlert className="h-3.5 w-3.5 text-warning" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )
            }
            className="w-full"
          >
            {isAgentPending ? "Locked (Awaiting Approval)" : "New Conversation"}
          </Button>
        )}
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mb-2 text-primary" />
            <span className="text-xs">Loading conversations...</span>
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
            <MessageSquare className="h-8 w-8 stroke-1 mb-2 opacity-40" />
            <p className="text-xs font-semibold text-foreground">No conversations yet</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
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
                className={`group relative flex items-center justify-between rounded-xl px-3 py-2.5 cursor-pointer transition-all text-xs ${
                  isSelected
                    ? "bg-primary-subtle text-primary-subtle-foreground font-semibold border border-primary/25 shadow-2xs"
                    : "text-foreground/80 hover:bg-accent hover:text-foreground border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <MessageSquare
                    className={`h-4 w-4 shrink-0 ${
                      isSelected
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  />
                  <div className="truncate">
                    <p className="truncate font-medium">{conv.title || "Untitled Chat"}</p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
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
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive-subtle transition-all"
                  title="Delete Conversation"
                  aria-label="Delete Conversation"
                >
                  {deletingId === conv.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-destructive" />
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
