/**
 * FarcastMints Design System v1.0
 * Complete design tokens and CSS variables
 * Based on Base Chain + Farcaster Identity aesthetic
 */

export const designSystem = {
  // Brand Colors
  colors: {
    primary: {
      500: "#5A61FF",
      600: "#4550FF",
      700: "#3240FF",
    },
    secondary: {
      500: "#805BFF",
      600: "#6A49EB",
      700: "#5939D8",
    },
    // Base Colors (from existing brand)
    base: {
      blue: "#0052FF",
      purple: "#855DFF",
      cyan: "#55E5FF",
    },
    // Surface Colors (Dark Theme)
    surface: {
      black: "#0A0A0F",
      default: "#111118",
      elevated: "#1A1B25",
      hover: "#2A2B36",
    },
    // Text Colors
    text: {
      primary: "#FFFFFF",
      secondary: "#B6B7C3",
      tertiary: "#6F7080",
      muted: "#4F5060",
    },
    // Border
    border: {
      default: "#2A2B36",
      light: "rgba(255, 255, 255, 0.1)",
      focus: "#5A61FF",
    },
    // Status Colors
    status: {
      success: "#30E19F",
      warning: "#FFBB44",
      error: "#FF5E79",
      info: "#55B4FF",
    },
  },

  // Gradients
  gradients: {
    brand: "linear-gradient(90deg, #0052FF 0%, #805BFF 100%)",
    hero: "linear-gradient(135deg, #1A1B25 0%, #202233 40%, #26283C 100%)",
    buttonShine: "linear-gradient(90deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%)",
    card: "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)",
  },

  // Typography
  typography: {
    fontFamily: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'JetBrains Mono', 'Courier New', monospace",
    },
    fontSize: {
      display: "clamp(48px, 5vw, 64px)",
      h1: "32px",
      h2: "24px",
      h3: "20px",
      body: "16px",
      small: "14px",
      tiny: "12px",
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  // Spacing (8-point system)
  spacing: {
    xs: "4px",
    s: "8px",
    m: "12px",
    l: "16px",
    xl: "24px",
    "2xl": "32px",
    "3xl": "48px",
    "4xl": "64px",
    "5xl": "96px",
  },

  // Border Radius
  borderRadius: {
    s: "6px",
    m: "10px",
    l: "16px",
    xl: "20px",
    full: "9999px",
  },

  // Shadows
  shadows: {
    soft: "0px 4px 16px rgba(0, 0, 0, 0.25)",
    card: "0px 6px 24px rgba(0, 0, 0, 0.35)",
    cardHover: "0px 8px 32px rgba(0, 0, 0, 0.45)",
    glow: "0px 0px 15px rgba(90, 97, 255, 0.5)",
    glowLarge: "0px 0px 30px rgba(90, 97, 255, 0.4)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)",
  },

  // Transitions
  transitions: {
    fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
    base: "200ms cubic-bezier(0.4, 0, 0.2, 1)",
    slow: "300ms cubic-bezier(0.4, 0, 0.2, 1)",
    spring: "300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
  },

  // Z-Index
  zIndex: {
    dropdown: 1000,
    sticky: 1100,
    modal: 1200,
    popover: 1300,
    tooltip: 1400,
  },

  // Breakpoints
  breakpoints: {
    xs: "375px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
};

/**
 * Generate CSS variables from design system
 */
export function generateCSSVariables(): string {
  return `
    :root {
      /* Colors - Primary */
      --color-primary-500: ${designSystem.colors.primary[500]};
      --color-primary-600: ${designSystem.colors.primary[600]};
      --color-primary-700: ${designSystem.colors.primary[700]};
      
      /* Colors - Secondary */
      --color-secondary-500: ${designSystem.colors.secondary[500]};
      --color-secondary-600: ${designSystem.colors.secondary[600]};
      --color-secondary-700: ${designSystem.colors.secondary[700]};
      
      /* Colors - Base Brand */
      --color-base-blue: ${designSystem.colors.base.blue};
      --color-base-purple: ${designSystem.colors.base.purple};
      --color-base-cyan: ${designSystem.colors.base.cyan};
      
      /* Surface Colors */
      --surface-black: ${designSystem.colors.surface.black};
      --surface-default: ${designSystem.colors.surface.default};
      --surface-elevated: ${designSystem.colors.surface.elevated};
      --surface-hover: ${designSystem.colors.surface.hover};
      
      /* Text Colors */
      --text-primary: ${designSystem.colors.text.primary};
      --text-secondary: ${designSystem.colors.text.secondary};
      --text-tertiary: ${designSystem.colors.text.tertiary};
      --text-muted: ${designSystem.colors.text.muted};
      
      /* Border Colors */
      --border-default: ${designSystem.colors.border.default};
      --border-light: ${designSystem.colors.border.light};
      --border-focus: ${designSystem.colors.border.focus};
      
      /* Status Colors */
      --status-success: ${designSystem.colors.status.success};
      --status-warning: ${designSystem.colors.status.warning};
      --status-error: ${designSystem.colors.status.error};
      --status-info: ${designSystem.colors.status.info};
      
      /* Gradients */
      --gradient-brand: ${designSystem.gradients.brand};
      --gradient-hero: ${designSystem.gradients.hero};
      --gradient-button-shine: ${designSystem.gradients.buttonShine};
      --gradient-card: ${designSystem.gradients.card};
      
      /* Typography */
      --font-primary: ${designSystem.typography.fontFamily.primary};
      --font-mono: ${designSystem.typography.fontFamily.mono};
      
      /* Spacing */
      --space-xs: ${designSystem.spacing.xs};
      --space-s: ${designSystem.spacing.s};
      --space-m: ${designSystem.spacing.m};
      --space-l: ${designSystem.spacing.l};
      --space-xl: ${designSystem.spacing.xl};
      --space-2xl: ${designSystem.spacing["2xl"]};
      --space-3xl: ${designSystem.spacing["3xl"]};
      --space-4xl: ${designSystem.spacing["4xl"]};
      
      /* Border Radius */
      --radius-s: ${designSystem.borderRadius.s};
      --radius-m: ${designSystem.borderRadius.m};
      --radius-l: ${designSystem.borderRadius.l};
      --radius-xl: ${designSystem.borderRadius.xl};
      --radius-full: ${designSystem.borderRadius.full};
      
      /* Shadows */
      --shadow-soft: ${designSystem.shadows.soft};
      --shadow-card: ${designSystem.shadows.card};
      --shadow-card-hover: ${designSystem.shadows.cardHover};
      --shadow-glow: ${designSystem.shadows.glow};
      --shadow-glow-large: ${designSystem.shadows.glowLarge};
      --shadow-inner: ${designSystem.shadows.inner};
      
      /* Transitions */
      --transition-fast: ${designSystem.transitions.fast};
      --transition-base: ${designSystem.transitions.base};
      --transition-slow: ${designSystem.transitions.slow};
      --transition-spring: ${designSystem.transitions.spring};
    }
  `;
}

export default designSystem;
