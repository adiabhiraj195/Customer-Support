import { TypographyTokens } from "./tokens";

export const defaultTypography: TypographyTokens = {
  fontSans:
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
  fontMono:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  fontHeading:
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
  scales: {
    micro: { fontSize: "0.625rem", lineHeight: "0.875rem", letterSpacing: "0.025em" }, // 10px
    badge: { fontSize: "0.6875rem", lineHeight: "1rem", letterSpacing: "0.015em" },     // 11px
    xs: { fontSize: "0.75rem", lineHeight: "1rem" },                                   // 12px
    sm: { fontSize: "0.875rem", lineHeight: "1.25rem" },                               // 14px
    base: { fontSize: "1rem", lineHeight: "1.5rem" },                                  // 16px
    lg: { fontSize: "1.125rem", lineHeight: "1.75rem" },                               // 18px
    xl: { fontSize: "1.25rem", lineHeight: "1.75rem" },                                // 20px
    "2xl": { fontSize: "1.5rem", lineHeight: "2rem", letterSpacing: "-0.025em" },      // 24px
    "3xl": { fontSize: "1.875rem", lineHeight: "2.25rem", letterSpacing: "-0.03em" },  // 30px
  },
};

/**
 * Standard semantic typography class helpers for consistent hierarchy across the app.
 */
export const typographyClasses = {
  h1: "text-2xl font-bold tracking-tight text-foreground",
  h2: "text-xl font-semibold tracking-tight text-foreground",
  h3: "text-lg font-bold tracking-tight text-foreground",
  h4: "text-sm font-semibold text-foreground",
  body: "text-sm leading-relaxed text-foreground",
  bodyMuted: "text-xs text-muted-foreground leading-normal",
  caption: "text-xs font-medium text-muted-foreground",
  badge: "text-[11px] font-medium",
  micro: "text-[10px] font-medium",
  code: "font-mono text-xs text-foreground",
};

