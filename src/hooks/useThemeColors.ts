'use client'

import { useState, useEffect } from 'react'
import { getTheme, type ThemeColors } from '@/config/themes'

/**
 * Hook to get current theme colors
 * Updates automatically when theme changes
 */
export function useThemeColors(): ThemeColors {
  const [theme, setTheme] = useState<ThemeColors>(getTheme('default'))

  useEffect(() => {
    // Initial load
    const savedTheme = localStorage.getItem('curswap-theme') || 'default'
    setTheme(getTheme(savedTheme))

    // Listen for storage changes (theme updates from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'curswap-theme' && e.newValue) {
        setTheme(getTheme(e.newValue))
      }
    }

    // Listen for custom theme change events
    const handleThemeChange = ((e: CustomEvent) => {
      setTheme(getTheme(e.detail.themeName))
    }) as EventListener

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('themechange', handleThemeChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('themechange', handleThemeChange)
    }
  }, [])

  return theme
}

/**
 * Hook to get a specific color from current theme
 */
export function useThemeColor(colorKey: keyof ThemeColors['colors']): string {
  const theme = useThemeColors()
  return theme.colors[colorKey]
}
