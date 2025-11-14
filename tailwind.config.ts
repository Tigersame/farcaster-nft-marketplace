import type { Config } from "tailwindcss";

// Import theme tokens
const { theme: designTokens } = require("./src/styles/theme");

const config: Config = {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'farcaster-purple': '#8A63D2',
        'base-blue': '#0052FF',
        // Design token colors
        primary: designTokens.colors.primary,
        accent: designTokens.colors.accent,
        bg: designTokens.colors.bg,
        surface: designTokens.colors.surface,
        neutral100: designTokens.colors.neutral100,
        neutral700: designTokens.colors.neutral700,
        danger: designTokens.colors.danger,
      },
      borderRadius: {
        sm: designTokens.radii.sm,
        md: designTokens.radii.md,
        lg: designTokens.radii.lg,
      },
      boxShadow: {
        subtle: designTokens.shadow.subtle,
        pop: designTokens.shadow.pop,
      },
      fontFamily: {
        sans: [designTokens.fonts.body],
        heading: [designTokens.fonts.heading],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
    screens: {
      'sm': '640px',
      'md': '900px',   // slightly wider tablet breakpoint
      'lg': '1200px',  // desktop
      'xl': '1600px'   // large desktop
    }
  },
  plugins: [],
};
export default config;