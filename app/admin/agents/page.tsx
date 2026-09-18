"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  Headphones,
  Loader2,
  Lock,
  Mail,
  RefreshCw,
  Search,
  ShieldCheck,
  UserCheck,
  UserX,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  useApproveAgent,
  useRejectAgent,
  useSupportAgents,
} from "@/hooks/useSupportAgents";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { User } from "@/types/api";

type StatusFilter = "all" | "PENDING_APPROVAL" | "ACTIVE" | "REJECTED";

export default function AdminAgentsPage() {
  const { user, isAuthenticated, isHydrated } = useAuth();
  const isAdmin = isAuthenticated && user?.role === "Admin";

  const [activeTab, setActiveTab] = useState<StatusFilter>("PENDING_APPROVAL");
  const [searchQuery, setSearchQuery] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Fetch all agents so metrics and tabs stay consistent
  const {
    data: allAgents = [],
    isLoading,
    isRefetching,
    refetch,
    error: fetchError,
  } = useSupportAgents("all");

  const approveMutation = useApproveAgent();
  const rejectMutation = useRejectAgent();

  // Metrics computation
  const metrics = useMemo(() => {
    const pending = allAgents.filter((a) => a.status === "PENDING_APPROVAL").length;
    const active = allAgents.filter((a) => a.status === "ACTIVE").length;
    const rejected = allAgents.filter((a) => a.status === "REJECTED").length;
    return {
      pending,
      active,
      rejected,
      total: allAgents.length,
    };
  }, [allAgents]);

  // Filter agents by status and search query
  const filteredAgents = useMemo(() => {
    return allAgents.filter((agent) => {
      // Status filter
      if (activeTab !== "all" && agent.status !== activeTab) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = agent.name?.toLowerCase().includes(query);
        const matchesEmail = agent.email.toLowerCase().includes(query);
        return matchesName || matchesEmail;
      }
      return true;
    });
  }, [allAgents, activeTab, searchQuery]);

  const handleApprove = async (agent: User) => {
    setNotification(null);
    setProcessingId(agent.id);
    try {
      await approveMutation.mutateAsync(agent.id);
      setNotification({
        type: "success",
        message: `Support Agent ${agent.name || agent.email} approved successfully. They now have active access to support tasks.`,
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to approve support agent.";
      setNotification({
        type: "error",
        message: msg,
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (agent: User) => {
    setNotification(null);
    setProcessingId(agent.id);
    try {
      await rejectMutation.mutateAsync(agent.id);
      setNotification({
        type: "success",
        message: `Support Agent ${agent.name || agent.email} rejected. Their task access remains restricted.`,
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to reject support agent.";
      setNotification({
        type: "error",
        message: msg,
      });
    } finally {
      setProcessingId(null);
    }
  };

  // Auth & Admin Guard
  if (isHydrated && !isAdmin) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 bg-background">
        <Card className="max-w-md w-full p-8 text-center space-y-4">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive-subtle text-destructive mx-auto">
            <Lock className="h-7 w-7" />
          </div>
          <CardTitle className="text-xl">Admin Access Required</CardTitle>
          <CardDescription className="text-xs">
            This management portal is strictly restricted to organisation
            administrators. You must be signed in with an Admin account to
            approve or reject Support Agents.
          </CardDescription>
          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <Link href="/conversation" className="flex-1">
              <Button variant="outline" className="w-full" size="md">
                Go to Conversations
              </Button>
            </Link>
            <Link href="/login" className="flex-1">
              <Button variant="primary" className="w-full" size="md">
                Switch Account
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-background">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Top Breadcrumb / Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Link
                href="/conversation"
                className="hover:text-foreground transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </Link>
              <span>/</span>
              <span className="font-semibold text-foreground">
                Admin Console
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
              <Users className="h-7 w-7 text-primary" />
              <span>Support Agent Approvals</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Review, approve, or reject support agent registration requests for{" "}
              <strong className="text-foreground">
                {user?.organisation?.name || "your organisation"}
              </strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              isLoading={isRefetching}
              leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
            >
              Refresh
            </Button>
            <Link href="/knowledgebase">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<ShieldCheck className="h-3.5 w-3.5" />}
              >
                Knowledge Base
              </Button>
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Pending card */}
          <div
            onClick={() => setActiveTab("PENDING_APPROVAL")}
            className={`cursor-pointer rounded-2xl p-4 border transition-all ${
              activeTab === "PENDING_APPROVAL"
                ? "border-warning bg-warning-subtle/50 ring-2 ring-warning/20 shadow-xs"
                : "border-border bg-card hover:bg-card-muted/60"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">
                Pending Approval
              </span>
              <Clock className="h-4 w-4 text-warning" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-foreground mt-2">
              {metrics.pending}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              Awaiting verification
            </div>
          </div>

          {/* Active card */}
          <div
            onClick={() => setActiveTab("ACTIVE")}
            className={`cursor-pointer rounded-2xl p-4 border transition-all ${
              activeTab === "ACTIVE"
                ? "border-success bg-success-subtle/50 ring-2 ring-success/20 shadow-xs"
                : "border-border bg-card hover:bg-card-muted/60"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">
                Active Agents
              </span>
              <UserCheck className="h-4 w-4 text-success" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-foreground mt-2">
              {metrics.active}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              Full task permissions
            </div>
          </div>

          {/* Rejected card */}
          <div
            onClick={() => setActiveTab("REJECTED")}
            className={`cursor-pointer rounded-2xl p-4 border transition-all ${
              activeTab === "REJECTED"
                ? "border-destructive bg-destructive-subtle/50 ring-2 ring-destructive/20 shadow-xs"
                : "border-border bg-card hover:bg-card-muted/60"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">
                Rejected
              </span>
              <UserX className="h-4 w-4 text-destructive" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-foreground mt-2">
              {metrics.rejected}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              Access blocked
            </div>
          </div>

          {/* Total card */}
          <div
            onClick={() => setActiveTab("all")}
            className={`cursor-pointer rounded-2xl p-4 border transition-all ${
              activeTab === "all"
                ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                : "border-border bg-card hover:bg-card-muted/60"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">
                Total Agents
              </span>
              <Headphones className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-foreground mt-2">
              {metrics.total}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              Registered in organisation
            </div>
          </div>
        </div>

        {/* Action Notification Banner */}
        {notification && (
          <div
            className={`flex items-center justify-between gap-2 rounded-2xl p-3.5 text-xs border ${
              notification.type === "success"
                ? "bg-success-subtle text-success-subtle-foreground border-success-border"
                : "bg-destructive-subtle text-destructive-subtle-foreground border-destructive-border"
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
              )}
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {fetchError && (
          <div className="flex items-center gap-2 rounded-2xl bg-destructive-subtle p-3.5 text-xs text-destructive-subtle-foreground border border-destructive-border">
            <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
            <span>
              Failed to load support agents: {(fetchError as Error).message}
            </span>
          </div>
        )}

        {/* Filter Controls & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-card-muted/80 border border-border overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("PENDING_APPROVAL")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                activeTab === "PENDING_APPROVAL"
                  ? "bg-card text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Pending</span>
              {metrics.pending > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-warning text-warning-foreground font-bold">
                  {metrics.pending}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("ACTIVE")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                activeTab === "ACTIVE"
                  ? "bg-card text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Active</span>
              <span className="text-[10px] opacity-70">({metrics.active})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("REJECTED")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                activeTab === "REJECTED"
                  ? "bg-card text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Rejected</span>
              <span className="text-[10px] opacity-70">({metrics.rejected})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                activeTab === "all"
                  ? "bg-card text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>All ({metrics.total})</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search agent by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-card px-3.5 pl-9 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Agents List Card */}
        <Card className="divide-y divide-border overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
              <span className="text-xs">Loading support agents...</span>
            </div>
          ) : filteredAgents.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground space-y-2">
              <div className="h-12 w-12 rounded-2xl bg-card-muted flex items-center justify-center border border-border">
                <Headphones className="h-6 w-6 opacity-40 text-foreground" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                No support agents found
              </h3>
              <p className="text-xs max-w-sm">
                {activeTab === "PENDING_APPROVAL"
                  ? "There are currently no support agent accounts pending administrative approval."
                  : "No support agents match your selected filter criteria."}
              </p>
            </div>
          ) : (
            filteredAgents.map((agent) => {
              const isProcessing = processingId === agent.id;
              const formattedDate = new Date(agent.createdAt).toLocaleDateString(
                undefined,
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }
              );

              return (
                <div
                  key={agent.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-card-muted/30 transition-colors"
                >
                  {/* Agent identity */}
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground font-bold text-sm border border-border shadow-2xs">
                      {(agent.name?.[0] || agent.email[0]).toUpperCase()}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-foreground">
                          {agent.name || "Unnamed Agent"}
                        </span>

                        {/* Status Badge */}
                        {agent.status === "PENDING_APPROVAL" ? (
                          <Badge variant="warning" size="sm">
                            <Clock className="h-2.5 w-2.5" /> Pending Approval
                          </Badge>
                        ) : agent.status === "ACTIVE" ? (
                          <Badge variant="success" size="sm">
                            <Check className="h-2.5 w-2.5" /> Active & Approved
                          </Badge>
                        ) : agent.status === "REJECTED" ? (
                          <Badge variant="destructive" size="sm">
                            <X className="h-2.5 w-2.5" /> Rejected
                          </Badge>
                        ) : (
                          <Badge variant="outline" size="sm">
                            {agent.status}
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 font-mono">
                          <Mail className="h-3 w-3" />
                          {agent.email}
                        </span>
                        <span>•</span>
                        <span>Registered {formattedDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Group */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {/* If PENDING: show Approve and Reject */}
                    {agent.status === "PENDING_APPROVAL" && (
                      <>
                        <Button
                          size="xs"
                          variant="primary"
                          isLoading={isProcessing}
                          disabled={isProcessing}
                          onClick={() => handleApprove(agent)}
                          leftIcon={<Check className="h-3.5 w-3.5" />}
                        >
                          Approve
                        </Button>
                        <Button
                          size="xs"
                          variant="destructive"
                          isLoading={isProcessing}
                          disabled={isProcessing}
                          onClick={() => handleReject(agent)}
                          leftIcon={<X className="h-3.5 w-3.5" />}
                        >
                          Reject
                        </Button>
                      </>
                    )}

                    {/* If ACTIVE: show Revoke / Reject */}
                    {agent.status === "ACTIVE" && (
                      <Button
                        size="xs"
                        variant="outline"
                        isLoading={isProcessing}
                        disabled={isProcessing}
                        onClick={() => handleReject(agent)}
                        className="text-destructive hover:text-destructive hover:bg-destructive-subtle"
                        leftIcon={<UserX className="h-3.5 w-3.5" />}
                      >
                        Revoke Access
                      </Button>
                    )}

                    {/* If REJECTED: show Re-Approve */}
                    {agent.status === "REJECTED" && (
                      <Button
                        size="xs"
                        variant="outline"
                        isLoading={isProcessing}
                        disabled={isProcessing}
                        onClick={() => handleApprove(agent)}
                        className="text-success hover:text-success hover:bg-success-subtle"
                        leftIcon={<Check className="h-3.5 w-3.5" />}
                      >
                        Re-Approve
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </Card>
      </div>
    </div>
  );
}
