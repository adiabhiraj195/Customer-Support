import { PresetName, colorPresets } from "./presets";
import { defaultTypography } from "./typography";
import { RadiusTokens, ThemeMode, TypographyTokens } from "./tokens";

export interface AppThemeConfig {
  /**
   * Default theme mode on initial load ('light' | 'dark' | 'system')
   */
  defaultMode: ThemeMode;

  /**
   * Active color preset from available presets:
   * 'blue' | 'indigo' | 'violet' | 'emerald' | 'amber' | 'rose' | 'slate'
   */
  activePreset: PresetName;

  /**
   * Typography font families and scale definitions
   */
  typography: TypographyTokens;

  /**
   * Border radius scale tokens
   */
  radii: RadiusTokens;
}

/**
 * MASTER THEME CONFIGURATION
 * -------------------------------------------------------------
 * Configure your application theme, active palette, typography,
 * and radii here in one single place.
 */
export const themeConfig: AppThemeConfig = {
  defaultMode: "system",
  activePreset: "blue",
  typography: defaultTypography,
  radii: {
    xs: "0.25rem",  // 4px
    sm: "0.375rem", // 6px
    md: "0.5rem",   // 8px
    lg: "0.75rem",  // 12px
    xl: "1rem",     // 16px
    "2xl": "1.25rem", // 20px
    full: "9999px",
  },
};

/**
 * Get active semantic colors based on configured preset
 */
export function getActiveThemePreset() {
  return colorPresets[themeConfig.activePreset] || colorPresets.blue;
}

