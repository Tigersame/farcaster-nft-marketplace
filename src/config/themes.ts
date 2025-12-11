/**
 * Theme Presets for CurSwap
 * Multiple color schemes that can be easily switched
 */

export interface ThemeColors {
  name: string
  displayName: string
  description: string
  colors: {
    // Primary gradient colors
    primary: string
    primaryLight: string
    primaryDark: string
    
    // Accent colors
    accent: string
    accentLight: string
    
    // Background colors
    bgPrimary: string
    bgSecondary: string
    bgTertiary: string
    
    // Surface colors
    surfaceCard: string
    surfaceElevated: string
    
    // Text colors
    textPrimary: string
    textSecondary: string
    textMuted: string
    
    // Border colors
    border: string
    borderLight: string
    
    // Status colors
    success: string
    warning: string
    error: string
    info: string
    
    // Gradient strings for CSS
    gradientPrimary: string
    gradientAccent: string
    gradientHero: string
  }
}

export const THEMES: Record<string, ThemeColors> = {
  // Current Theme - Purple/Pink
  default: {
    name: 'default',
    displayName: '🟣 Purple Dream',
    description: 'The original CurSwap theme with purple and pink gradients',
    colors: {
      primary: '#6E4BFF',
      primaryLight: '#8B6BFF',
      primaryDark: '#5A3DD9',
      accent: '#FF6BA6',
      accentLight: '#FF8FBF',
      bgPrimary: '#0A0A0F',
      bgSecondary: '#111118',
      bgTertiary: '#1A1B25',
      surfaceCard: '#1A1B25',
      surfaceElevated: '#2A2B36',
      textPrimary: '#FFFFFF',
      textSecondary: '#B6B7C3',
      textMuted: '#6F7080',
      border: '#2A2B36',
      borderLight: 'rgba(255, 255, 255, 0.1)',
      success: '#30E19F',
      warning: '#FFBB44',
      error: '#FF5E79',
      info: '#55B4FF',
      gradientPrimary: 'linear-gradient(135deg, #6E4BFF 0%, #8B6BFF 100%)',
      gradientAccent: 'linear-gradient(135deg, #FF6BA6 0%, #FF8FBF 100%)',
      gradientHero: 'linear-gradient(135deg, #6E4BFF 0%, #FF6BA6 50%, #FF8FBF 100%)',
    }
  },

  // Ocean Theme - Blue/Cyan
  ocean: {
    name: 'ocean',
    displayName: '🌊 Ocean Breeze',
    description: 'Cool blue and cyan colors inspired by the ocean',
    colors: {
      primary: '#0EA5E9',
      primaryLight: '#38BDF8',
      primaryDark: '#0284C7',
      accent: '#06B6D4',
      accentLight: '#22D3EE',
      bgPrimary: '#020617',
      bgSecondary: '#0F172A',
      bgTertiary: '#1E293B',
      surfaceCard: '#1E293B',
      surfaceElevated: '#334155',
      textPrimary: '#F8FAFC',
      textSecondary: '#CBD5E1',
      textMuted: '#64748B',
      border: '#334155',
      borderLight: 'rgba(255, 255, 255, 0.1)',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
      gradientPrimary: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)',
      gradientAccent: 'linear-gradient(135deg, #06B6D4 0%, #22D3EE 100%)',
      gradientHero: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 50%, #22D3EE 100%)',
    }
  },

  // Sunset Theme - Orange/Red
  sunset: {
    name: 'sunset',
    displayName: '🌅 Sunset Fire',
    description: 'Warm orange and red gradients like a beautiful sunset',
    colors: {
      primary: '#F97316',
      primaryLight: '#FB923C',
      primaryDark: '#EA580C',
      accent: '#EF4444',
      accentLight: '#F87171',
      bgPrimary: '#0F0A08',
      bgSecondary: '#1C1410',
      bgTertiary: '#292218',
      surfaceCard: '#292218',
      surfaceElevated: '#3D2F24',
      textPrimary: '#FEF3F2',
      textSecondary: '#FDE4CD',
      textMuted: '#D4A574',
      border: '#3D2F24',
      borderLight: 'rgba(255, 255, 255, 0.1)',
      success: '#10B981',
      warning: '#FBBF24',
      error: '#DC2626',
      info: '#3B82F6',
      gradientPrimary: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
      gradientAccent: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
      gradientHero: 'linear-gradient(135deg, #F97316 0%, #EF4444 50%, #F87171 100%)',
    }
  },

  // Forest Theme - Green/Emerald
  forest: {
    name: 'forest',
    displayName: '🌲 Forest Green',
    description: 'Fresh green tones inspired by nature',
    colors: {
      primary: '#10B981',
      primaryLight: '#34D399',
      primaryDark: '#059669',
      accent: '#14B8A6',
      accentLight: '#2DD4BF',
      bgPrimary: '#0A0F0A',
      bgSecondary: '#0F1F14',
      bgTertiary: '#1A2921',
      surfaceCard: '#1A2921',
      surfaceElevated: '#243B32',
      textPrimary: '#F0FDF4',
      textSecondary: '#BBF7D0',
      textMuted: '#86EFAC',
      border: '#243B32',
      borderLight: 'rgba(255, 255, 255, 0.1)',
      success: '#22C55E',
      warning: '#FBBF24',
      error: '#EF4444',
      info: '#06B6D4',
      gradientPrimary: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
      gradientAccent: 'linear-gradient(135deg, #14B8A6 0%, #2DD4BF 100%)',
      gradientHero: 'linear-gradient(135deg, #10B981 0%, #14B8A6 50%, #2DD4BF 100%)',
    }
  },

  // Cyberpunk Theme - Neon Pink/Yellow
  cyberpunk: {
    name: 'cyberpunk',
    displayName: '🤖 Cyberpunk',
    description: 'Neon colors straight from a cyberpunk future',
    colors: {
      primary: '#EC4899',
      primaryLight: '#F472B6',
      primaryDark: '#DB2777',
      accent: '#FBBF24',
      accentLight: '#FCD34D',
      bgPrimary: '#0A0A0A',
      bgSecondary: '#18181B',
      bgTertiary: '#27272A',
      surfaceCard: '#27272A',
      surfaceElevated: '#3F3F46',
      textPrimary: '#FAFAFA',
      textSecondary: '#E4E4E7',
      textMuted: '#A1A1AA',
      border: '#3F3F46',
      borderLight: 'rgba(255, 255, 255, 0.1)',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#DC2626',
      info: '#06B6D4',
      gradientPrimary: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
      gradientAccent: 'linear-gradient(135deg, #FBBF24 0%, #FCD34D 100%)',
      gradientHero: 'linear-gradient(135deg, #EC4899 0%, #FBBF24 50%, #FCD34D 100%)',
    }
  },

  // Royal Theme - Deep Purple/Gold
  royal: {
    name: 'royal',
    displayName: '👑 Royal Gold',
    description: 'Luxurious purple and gold color scheme',
    colors: {
      primary: '#7C3AED',
      primaryLight: '#A78BFA',
      primaryDark: '#6D28D9',
      accent: '#F59E0B',
      accentLight: '#FBBF24',
      bgPrimary: '#0F0A1F',
      bgSecondary: '#1A0F2E',
      bgTertiary: '#2D1B4E',
      surfaceCard: '#2D1B4E',
      surfaceElevated: '#3D2B5E',
      textPrimary: '#FAF5FF',
      textSecondary: '#E9D5FF',
      textMuted: '#C4B5FD',
      border: '#3D2B5E',
      borderLight: 'rgba(255, 255, 255, 0.1)',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#DC2626',
      info: '#3B82F6',
      gradientPrimary: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)',
      gradientAccent: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
      gradientHero: 'linear-gradient(135deg, #7C3AED 0%, #F59E0B 50%, #FBBF24 100%)',
    }
  },

  // Midnight Theme - Dark Blue/Indigo
  midnight: {
    name: 'midnight',
    displayName: '🌙 Midnight Blue',
    description: 'Deep blue tones for late-night trading',
    colors: {
      primary: '#4F46E5',
      primaryLight: '#6366F1',
      primaryDark: '#4338CA',
      accent: '#8B5CF6',
      accentLight: '#A78BFA',
      bgPrimary: '#050712',
      bgSecondary: '#0F1629',
      bgTertiary: '#1E2847',
      surfaceCard: '#1E2847',
      surfaceElevated: '#2E3A59',
      textPrimary: '#F0F9FF',
      textSecondary: '#DBEAFE',
      textMuted: '#93C5FD',
      border: '#2E3A59',
      borderLight: 'rgba(255, 255, 255, 0.1)',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#DC2626',
      info: '#06B6D4',
      gradientPrimary: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
      gradientAccent: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
      gradientHero: 'linear-gradient(135deg, #4F46E5 0%, #8B5CF6 50%, #A78BFA 100%)',
    }
  },

  // Monochrome Theme - Black/White/Gray
  monochrome: {
    name: 'monochrome',
    displayName: '⚫ Monochrome',
    description: 'Clean and minimal black and white theme',
    colors: {
      primary: '#18181B',
      primaryLight: '#3F3F46',
      primaryDark: '#09090B',
      accent: '#71717A',
      accentLight: '#A1A1AA',
      bgPrimary: '#000000',
      bgSecondary: '#0A0A0A',
      bgTertiary: '#171717',
      surfaceCard: '#171717',
      surfaceElevated: '#262626',
      textPrimary: '#FAFAFA',
      textSecondary: '#D4D4D8',
      textMuted: '#A1A1AA',
      border: '#262626',
      borderLight: 'rgba(255, 255, 255, 0.1)',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#DC2626',
      info: '#3B82F6',
      gradientPrimary: 'linear-gradient(135deg, #18181B 0%, #3F3F46 100%)',
      gradientAccent: 'linear-gradient(135deg, #71717A 0%, #A1A1AA 100%)',
      gradientHero: 'linear-gradient(135deg, #18181B 0%, #3F3F46 50%, #71717A 100%)',
    }
  },
}

/**
 * Get theme by name
 */
export function getTheme(themeName: string): ThemeColors {
  return THEMES[themeName] || THEMES.default
}

/**
 * Get all available theme names
 */
export function getThemeNames(): string[] {
  return Object.keys(THEMES)
}

/**
 * Apply theme colors to CSS variables
 */
export function applyTheme(themeName: string): void {
  const theme = getTheme(themeName)
  const root = document.documentElement

  // Apply CSS custom properties
  root.style.setProperty('--theme-primary', theme.colors.primary)
  root.style.setProperty('--theme-primary-light', theme.colors.primaryLight)
  root.style.setProperty('--theme-primary-dark', theme.colors.primaryDark)
  root.style.setProperty('--theme-accent', theme.colors.accent)
  root.style.setProperty('--theme-accent-light', theme.colors.accentLight)
  root.style.setProperty('--theme-bg-primary', theme.colors.bgPrimary)
  root.style.setProperty('--theme-bg-secondary', theme.colors.bgSecondary)
  root.style.setProperty('--theme-bg-tertiary', theme.colors.bgTertiary)
  root.style.setProperty('--theme-surface-card', theme.colors.surfaceCard)
  root.style.setProperty('--theme-surface-elevated', theme.colors.surfaceElevated)
  root.style.setProperty('--theme-text-primary', theme.colors.textPrimary)
  root.style.setProperty('--theme-text-secondary', theme.colors.textSecondary)
  root.style.setProperty('--theme-text-muted', theme.colors.textMuted)
  root.style.setProperty('--theme-border', theme.colors.border)
  root.style.setProperty('--theme-border-light', theme.colors.borderLight)
  root.style.setProperty('--theme-success', theme.colors.success)
  root.style.setProperty('--theme-warning', theme.colors.warning)
  root.style.setProperty('--theme-error', theme.colors.error)
  root.style.setProperty('--theme-info', theme.colors.info)
  root.style.setProperty('--theme-gradient-primary', theme.colors.gradientPrimary)
  root.style.setProperty('--theme-gradient-accent', theme.colors.gradientAccent)
  root.style.setProperty('--theme-gradient-hero', theme.colors.gradientHero)

  // Store theme preference
  localStorage.setItem('curswap-theme', themeName)
}
