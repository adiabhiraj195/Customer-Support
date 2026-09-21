/**
 * Design Tokens & Semantic Type Definitions
 * Abstracted tokens for theme, typography, colors, and layout metrics.
 */

export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export interface SemanticColors {
  background: string;
  foreground: string;
  mutedForeground: string;
  subtleForeground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryHover: string;
  primaryForeground: string;
  primarySubtle: string;
  primarySubtleForeground: string;
  primaryBorder: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  destructiveSubtle: string;
  destructiveSubtleForeground: string;
  destructiveBorder: string;
  success: string;
  successForeground: string;
  successSubtle: string;
  successSubtleForeground: string;
  successBorder: string;
  warning: string;
  warningForeground: string;
  warningSubtle: string;
  warningSubtleForeground: string;
  warningBorder: string;
  border: string;
  borderSubtle: string;
  borderStrong: string;
  input: string;
  ring: string;
}

export interface TypographyScaleItem {
  fontSize: string;
  lineHeight: string;
  letterSpacing?: string;
  fontWeight?: string;
}

export interface TypographyTokens {
  fontSans: string;
  fontMono: string;
  fontHeading: string;
  scales: {
    micro: TypographyScaleItem; // 10px
    badge: TypographyScaleItem; // 11px
    xs: TypographyScaleItem;    // 12px
    sm: TypographyScaleItem;    // 14px
    base: TypographyScaleItem;  // 16px
    lg: TypographyScaleItem;    // 18px
    xl: TypographyScaleItem;    // 20px
    '2xl': TypographyScaleItem; // 24px
    '3xl': TypographyScaleItem; // 30px
  };
}

export interface RadiusTokens {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  full: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';

