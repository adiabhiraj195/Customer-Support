"use client";

import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive";

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "icon";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-hover shadow-xs active:scale-[0.98]",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary-hover border border-border/60 active:scale-[0.98]",
  outline:
    "border border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground active:scale-[0.98]",
  ghost:
    "text-muted-foreground hover:text-foreground hover:bg-accent active:scale-[0.98]",
  destructive:
    "bg-destructive text-destructive-foreground hover:opacity-90 shadow-xs active:scale-[0.98]",
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "h-7 px-2.5 text-[11px] rounded-lg gap-1.5 font-medium",
  sm: "h-8 px-3 text-xs rounded-lg gap-1.5 font-medium",
  md: "h-9.5 px-4 text-xs sm:text-sm rounded-xl gap-2 font-medium",
  lg: "h-11 px-5 text-sm rounded-xl gap-2.5 font-semibold",
  icon: "h-9 w-9 rounded-xl p-0 flex items-center justify-center shrink-0",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      className = "",
      type = "button",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center font-sans transition-all select-none disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-ring ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin shrink-0" />
            <span>{children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children && <span>{children}</span>}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

