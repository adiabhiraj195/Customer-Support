"use client";

import { ArrowUpDown, RefreshCw, Search, Users, User, X } from "lucide-react";
import { DocumentFilterParams, DocumentStatus } from "@/types/api";

interface DocumentFiltersProps {
  filters: DocumentFilterParams;
  onFilterChange: (newFilters: Partial<DocumentFilterParams>) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  isAuthenticated?: boolean;
}

export function DocumentFilters({
  filters,
  onFilterChange,
  onRefresh,
  isRefreshing = false,
  isAuthenticated = false,
}: DocumentFiltersProps) {
  const statusOptions: Array<{ label: string; value: DocumentStatus | "" }> = [
    { label: "All Statuses", value: "" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Processing", value: "PROCESSING" },
    { label: "Pending", value: "PENDING" },
    { label: "Failed", value: "FAILED" },
  ];

  const sortOptions = [
    { label: "Newest First", sortBy: "createdAt", order: "desc" },
    { label: "Oldest First", sortBy: "createdAt", order: "asc" },
    { label: "Filename (A-Z)", sortBy: "filename", order: "asc" },
    { label: "Filename (Z-A)", sortBy: "filename", order: "desc" },
    { label: "Status", sortBy: "status", order: "asc" },
  ] as const;

  const currentSortKey = `${filters.sortBy || "createdAt"}-${filters.order || "desc"}`;

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={filters.search || ""}
            onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
            placeholder="Search documents by filename..."
            className="w-full rounded-xl border border-input bg-muted/40 pl-10 pr-9 py-2 text-xs sm:text-sm text-foreground placeholder:text-subtle-foreground focus:border-primary focus:bg-background focus:outline-none transition"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ search: "", page: 1 })}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground transition"
              title="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Right side controls: Scope, Sort, Refresh */}
        <div className="flex flex-wrap items-center gap-2">
          {/* My Docs vs All Docs toggle (only visible when logged in) */}
          {isAuthenticated && (
            <div className="inline-flex rounded-xl border border-border bg-muted/30 p-0.5 text-xs font-medium">
              <button
                type="button"
                onClick={() => onFilterChange({ all: false, page: 1 })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  !filters.all
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="View documents uploaded by your account"
              >
                <User className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">My Documents</span>
                <span className="sm:hidden">Mine</span>
              </button>
              <button
                type="button"
                onClick={() => onFilterChange({ all: true, page: 1 })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  filters.all
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="View all public & shared documents across the system"
              >
                <Users className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">All Documents</span>
                <span className="sm:hidden">All</span>
              </button>
            </div>
          )}

          {/* Sort Dropdown */}
          <div className="relative inline-block">
            <select
              value={currentSortKey}
              onChange={(e) => {
                const [sortBy, order] = e.target.value.split("-") as [
                  DocumentFilterParams["sortBy"],
                  DocumentFilterParams["order"]
                ];
                onFilterChange({ sortBy, order, page: 1 });
              }}
              className="appearance-none rounded-xl border border-input bg-muted/40 pl-3 pr-8 py-2 text-xs font-medium text-foreground focus:border-primary focus:bg-background focus:outline-none transition cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option
                  key={`${opt.sortBy}-${opt.order}`}
                  value={`${opt.sortBy}-${opt.order}`}
                >
                  {opt.label}
                </option>
              ))}
            </select>
            <ArrowUpDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center justify-center rounded-xl border border-border bg-card p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition disabled:opacity-50"
            title="Refresh document list"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin text-primary" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Status Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[11px] font-medium text-muted-foreground mr-1 hidden sm:inline">
          Status:
        </span>
        {statusOptions.map((opt) => {
          const isActive = (filters.status || "") === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onFilterChange({ status: opt.value, page: 1 })}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

