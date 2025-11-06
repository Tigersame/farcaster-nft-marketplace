'use client'

import { motion } from 'framer-motion'
import { FiSun, FiMoon } from 'react-icons/fi'
import { useTheme } from '@/contexts/ThemeContext'

export function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useTheme()

  return (
    <motion.button
      onClick={toggleDarkMode}
      className={`relative flex items-center justify-center w-12 h-6 rounded-full transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-blue-600 dark:bg-blue-500' 
          : 'bg-gray-300 dark:bg-gray-600'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Toggle Circle */}
      <motion.div
        className={`absolute w-5 h-5 bg-white rounded-full shadow-lg flex items-center justify-center ${
          isDarkMode ? 'text-blue-600' : 'text-amber-500'
        }`}
        animate={{
          x: isDarkMode ? 24 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
      >
        <motion.div
          animate={{ rotate: isDarkMode ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isDarkMode ? (
            <FiMoon className="w-3 h-3" />
          ) : (
            <FiSun className="w-3 h-3" />
          )}
        </motion.div>
      </motion.div>
    </motion.button>
  )
}

// Compact version for smaller spaces
export function CompactDarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useTheme()

  return (
    <motion.button
      onClick={toggleDarkMode}
      className={`p-2 rounded-xl transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-800 text-amber-400 hover:bg-gray-700' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        animate={{ rotate: isDarkMode ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isDarkMode ? (
          <FiSun className="w-5 h-5" />
        ) : (
          <FiMoon className="w-5 h-5" />
        )}
      </motion.div>
    </motion.button>
  )
}