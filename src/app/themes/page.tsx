'use client'

import { motion } from 'framer-motion'
import { THEMES } from '@/config/themes'
import { FiPalette, FiCheck, FiArrowLeft } from 'react-icons/fi'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { applyTheme } from '@/config/themes'

export default function ThemesPage() {
  const [currentTheme, setCurrentTheme] = useState('default')

  useEffect(() => {
    const savedTheme = localStorage.getItem('curswap-theme') || 'default'
    setCurrentTheme(savedTheme)
  }, [])

  const handleThemeChange = (themeName: string) => {
    setCurrentTheme(themeName)
    applyTheme(themeName)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0b0b] via-[#1a1a2e] to-[#0b0b0b]">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 blur-2xl opacity-50"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl">
                  <FiPalette className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              CurSwap <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Themes</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Choose from {Object.keys(THEMES).length} beautiful color schemes to personalize your DeFi experience
            </p>
          </motion.div>
        </div>
      </div>

      {/* Theme Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Object.values(THEMES).map((theme, index) => (
            <motion.button
              key={theme.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleThemeChange(theme.name)}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-6 rounded-2xl border-2 transition-all text-left ${
                currentTheme === theme.name
                  ? 'border-purple-500 bg-purple-500/10 shadow-2xl shadow-purple-500/20'
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              {/* Active Badge */}
              {currentTheme === theme.name && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg"
                >
                  <FiCheck className="w-5 h-5 text-white" />
                </motion.div>
              )}

              {/* Theme Preview - Large Gradient */}
              <div className="mb-4 h-32 rounded-xl overflow-hidden shadow-inner">
                <div
                  className="w-full h-full"
                  style={{ background: theme.colors.gradientHero }}
                />
              </div>

              {/* Theme Info */}
              <div>
                <h3 className="font-bold text-lg text-white mb-2">{theme.displayName}</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-4">{theme.description}</p>
              </div>

              {/* Color Palette Preview */}
              <div className="flex flex-wrap gap-2">
                <ColorDot color={theme.colors.primary} label="Primary" />
                <ColorDot color={theme.colors.accent} label="Accent" />
                <ColorDot color={theme.colors.success} label="Success" />
                <ColorDot color={theme.colors.warning} label="Warning" />
                <ColorDot color={theme.colors.error} label="Error" />
                <ColorDot color={theme.colors.info} label="Info" />
              </div>

              {/* Apply Button for Active Theme */}
              {currentTheme === theme.name && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 pt-4 border-t border-white/10"
                >
                  <div className="text-xs text-green-400 flex items-center gap-2">
                    <FiCheck className="w-3 h-3" />
                    <span>Active Theme</span>
                  </div>
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-300">
            <div>
              <div className="text-4xl mb-3">🎨</div>
              <h3 className="font-semibold text-white mb-2">Choose Your Theme</h3>
              <p className="text-sm">Select from our curated collection of color schemes</p>
            </div>
            <div>
              <div className="text-4xl mb-3">💾</div>
              <h3 className="font-semibold text-white mb-2">Auto-Saved</h3>
              <p className="text-sm">Your preference is saved automatically to localStorage</p>
            </div>
            <div>
              <div className="text-4xl mb-3">🔄</div>
              <h3 className="font-semibold text-white mb-2">Instant Updates</h3>
              <p className="text-sm">Theme changes apply instantly across all pages</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Theme Switcher Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 border border-purple-500/30 rounded-2xl p-6 text-center">
          <p className="text-white mb-2">
            💡 <strong>Pro Tip:</strong> Look for the floating palette button in the bottom-right corner!
          </p>
          <p className="text-gray-300 text-sm">
            You can access the theme switcher from any page in the app
          </p>
        </div>
      </div>
    </div>
  )
}

interface ColorDotProps {
  color: string
  label: string
}

function ColorDot({ color, label }: ColorDotProps) {
  return (
    <div
      className="w-6 h-6 rounded-full border-2 border-white/20 shadow-md"
      style={{ backgroundColor: color }}
      title={label}
    />
  )
}
