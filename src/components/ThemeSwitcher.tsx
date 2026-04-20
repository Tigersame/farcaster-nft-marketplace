'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCheck, FiPalette, FiX } from 'react-icons/fi'
import { THEMES, applyTheme, getTheme, type ThemeColors } from '@/config/themes'

export function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentTheme, setCurrentTheme] = useState('default')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load saved theme
    const savedTheme = localStorage.getItem('curswap-theme') || 'default'
    setCurrentTheme(savedTheme)
    applyTheme(savedTheme)
  }, [])

  const handleThemeChange = (themeName: string) => {
    setCurrentTheme(themeName)
    applyTheme(themeName)
    
    // Add a subtle page transition effect
    document.body.style.transition = 'background-color 0.5s ease'
    setTimeout(() => {
      document.body.style.transition = ''
    }, 500)
  }

  if (!mounted) return null

  return (
    <>
      {/* Floating Theme Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 shadow-2xl hover:shadow-purple-500/50 flex items-center justify-center transition-all hover:scale-110"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Change Theme"
      >
        <FiPalette className="w-6 h-6 text-white" />
      </motion.button>

      {/* Theme Selector Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl md:max-h-[85vh] z-[70] overflow-hidden"
            >
              <div className="bg-[#0f1724] rounded-3xl shadow-2xl border border-white/10 overflow-hidden h-full flex flex-col">
                {/* Header */}
                <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-purple-600/10 to-pink-600/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                      <FiPalette className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Choose Your Theme</h2>
                      <p className="text-sm text-gray-400">Customize your CurSwap experience</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    <FiX className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Theme Grid */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.values(THEMES).map((theme) => (
                      <ThemeCard
                        key={theme.name}
                        theme={theme}
                        isActive={currentTheme === theme.name}
                        onClick={() => handleThemeChange(theme.name)}
                      />
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-white/10 bg-white/5">
                  <p className="text-sm text-gray-400 text-center">
                    Your theme preference is saved automatically
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

interface ThemeCardProps {
  theme: ThemeColors
  isActive: boolean
  onClick: () => void
}

function ThemeCard({ theme, isActive, onClick }: ThemeCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`relative p-4 rounded-2xl border-2 transition-all text-left ${
        isActive
          ? 'border-purple-500 bg-purple-500/10'
          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
      }`}
    >
      {/* Active Badge */}
      {isActive && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center"
        >
          <FiCheck className="w-4 h-4 text-white" />
        </motion.div>
      )}

      {/* Theme Preview */}
      <div className="mb-3 h-20 rounded-xl overflow-hidden flex">
        <div
          className="flex-1"
          style={{ background: theme.colors.gradientPrimary }}
        />
        <div
          className="flex-1"
          style={{ background: theme.colors.gradientAccent }}
        />
      </div>

      {/* Theme Info */}
      <div>
        <h3 className="font-bold text-white mb-1">{theme.displayName}</h3>
        <p className="text-xs text-gray-400 leading-relaxed">{theme.description}</p>
      </div>

      {/* Color Dots */}
      <div className="flex gap-1.5 mt-3">
        <div
          className="w-5 h-5 rounded-full border border-white/20"
          style={{ backgroundColor: theme.colors.primary }}
          title="Primary"
        />
        <div
          className="w-5 h-5 rounded-full border border-white/20"
          style={{ backgroundColor: theme.colors.accent }}
          title="Accent"
        />
        <div
          className="w-5 h-5 rounded-full border border-white/20"
          style={{ backgroundColor: theme.colors.success }}
          title="Success"
        />
      </div>
    </motion.button>
  )
}

export default ThemeSwitcher
