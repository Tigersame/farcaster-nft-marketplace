'use client'

import Link from 'next/link'
import { FiArrowLeft, FiHome } from 'react-icons/fi'
import { motion } from 'framer-motion'

interface BackToMainButtonProps {
  className?: string
  showHomeIcon?: boolean
}

export function BackToMainButton({ 
  className = '', 
  showHomeIcon = true 
}: BackToMainButtonProps) {
  return (
    <div className={`w-full ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <Link 
          href="/"
          className="group flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-xl transition-all shadow-sm hover:shadow-md"
        >
          <FiArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
            Back to Main
          </span>
        </Link>

        {showHomeIcon && (
          <Link 
            href="/"
            className="group flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-sm hover:shadow-md"
          >
            <FiHome className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:inline">
              Home
            </span>
          </Link>
        )}
      </motion.div>
    </div>
  )
}
