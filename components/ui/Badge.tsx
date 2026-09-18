"use client";

import React from "react";

export type BadgeVariant =
  | "default"
  | "secondary"
  | "success"
  | "warning"
  | "destructive"
  | "outline";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "sm" | "md";
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-primary-subtle text-primary-subtle-foreground border border-primary/25 font-semibold",
  secondary:
    "bg-secondary text-secondary-foreground border border-border font-medium",
  success:
    "bg-success-subtle text-success-subtle-foreground border border-success-border font-semibold",
  warning:
    "bg-warning-subtle text-warning-subtle-foreground border border-warning-border font-semibold",
  destructive:
    "bg-destructive-subtle text-destructive-subtle-foreground border border-destructive-border font-semibold",
  outline: "border border-border text-muted-foreground font-medium",
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-[10px] rounded-md",
  md: "px-2.5 py-1 text-xs rounded-full",
};

export function Badge({
  children,
  variant = "default",
  size = "sm",
  className = "",
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 leading-none select-none tracking-tight transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

