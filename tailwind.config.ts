import type { Config } from "tailwindcss";

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
        // Brand colors
        'farcaster-purple': '#8A63D2',
        'base-blue': '#0052FF',
        
        // Design System - Primary
        primary: {
          500: "#5A61FF",
          600: "#4550FF",
          700: "#3240FF",
          DEFAULT: "#5A61FF",
        },
        
        // Design System - Secondary
        secondary: {
          500: "#805BFF",
          600: "#6A49EB",
          700: "#5939D8",
          DEFAULT: "#805BFF",
        },
        
        // Base brand colors
        base: {
          blue: "#0052FF",
          purple: "#855DFF",
          cyan: "#55E5FF",
        },
        
        // Surface colors
        surface: {
          black: "#0A0A0F",
          DEFAULT: "#111118",
          elevated: "#1A1B25",
          hover: "#2A2B36",
        },
        
        // Text colors
        text: {
          primary: "#FFFFFF",
          secondary: "#B6B7C3",
          tertiary: "#6F7080",
          muted: "#4F5060",
        },
        
        // Border colors
        border: {
          DEFAULT: "#2A2B36",
          light: "rgba(255, 255, 255, 0.1)",
          focus: "#5A61FF",
        },
        
        // Status colors
        success: "#30E19F",
        warning: "#FFBB44",
        error: "#FF5E79",
        info: "#55B4FF",
      },
      
      borderRadius: {
        s: "6px",
        m: "10px",
        l: "16px",
        xl: "20px",
        full: "9999px",
      },
      
      boxShadow: {
        soft: "0px 4px 16px rgba(0, 0, 0, 0.25)",
        card: "0px 6px 24px rgba(0, 0, 0, 0.35)",
        'card-hover': "0px 8px 32px rgba(0, 0, 0, 0.45)",
        glow: "0px 0px 15px rgba(90, 97, 255, 0.5)",
        'glow-large': "0px 0px 30px rgba(90, 97, 255, 0.4)",
        inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)",
      },
      
      fontFamily: {
        sans: ["'Inter'", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "sans-serif"],
        mono: ["'JetBrains Mono'", "'Courier New'", "monospace"],
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
      
      backdropBlur: {
        xs: '2px',
        sm: '4px',
      },
      
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    }
  },
  plugins: [],
};

export default config;