'use client'

import { useState } from 'react'
import { VerticalSidebarEnhanced } from '@/components/VerticalSidebarEnhanced'
import { motion } from 'framer-motion'
import { FiCheckCircle, FiMove, FiEye, FiZap, FiTrendingUp } from 'react-icons/fi'

export default function SidebarDemoPage() {
  const [currentView, setCurrentView] = useState('marketplace')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Enhanced Sidebar */}
      <VerticalSidebarEnhanced
        currentView={currentView}
        setCurrentView={setCurrentView}
        isConnected={true}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Main Content */}
      <div className="ml-[260px] p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold mb-4">
            <FiZap className="w-4 h-4" />
            Enhanced Sidebar Demo
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Advanced Sidebar Features
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Experience the power of customization, hover previews, and smart analytics
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Feature 1: Hover Previews */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiEye className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Hover Previews
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Hover over navigation items like Trending, Favorites, Watchlist, or Portfolio to see a quick preview card with recent items.
                </p>
                <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 font-semibold">
                  <FiCheckCircle className="w-4 h-4" />
                  Try hovering now!
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature 2: Drag to Reorder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiMove className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Drag to Reorder
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Customize your navigation by dragging items to reorder them. Your preference is saved automatically in localStorage.
                </p>
                <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 font-semibold">
                  <FiCheckCircle className="w-4 h-4" />
                  Powered by @dnd-kit
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature 3: Auto-Collapse */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiZap className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Smart Auto-Collapse
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Sidebar automatically collapses after 4 seconds of inactivity to give you more screen space. Any interaction expands it instantly.
                </p>
                <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 font-semibold">
                  <FiCheckCircle className="w-4 h-4" />
                  Wait 4s to see it in action
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature 4: Analytics Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiTrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Analytics Badges
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  See real-time floor price changes and market analytics directly on navigation items. Green badges show gains, red shows losses.
                </p>
                <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 font-semibold">
                  <FiCheckCircle className="w-4 h-4" />
                  Check Trending (+23.5%)
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Usage Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white shadow-xl"
        >
          <h2 className="text-2xl font-bold mb-4">How to Use</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-bold">1</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Hover Over Items</h4>
                <p className="text-sm text-white/80">
                  Hover over Trending, Favorites, Portfolio, or Collections to see preview cards
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-bold">2</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Drag to Customize</h4>
                <p className="text-sm text-white/80">
                  Hover near the left edge of items to reveal drag handle, then reorder as you like
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-bold">3</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Auto-Collapse</h4>
                <p className="text-sm text-white/80">
                  Stop interacting with the sidebar for 4 seconds to auto-collapse it
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-bold">4</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Check Analytics</h4>
                <p className="text-sm text-white/80">
                  Look for badges showing percentage changes - green for up, red for down
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Current View Display */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Current View
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            You are currently viewing: <span className="font-semibold text-blue-600 dark:text-blue-400">{currentView}</span>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Click any navigation item in the sidebar to switch views
          </p>
        </motion.div>

        {/* Technical Details */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Technical Implementation
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-gray-700 dark:text-gray-300">
                <strong>@dnd-kit/core</strong> - Drag and drop functionality
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-gray-700 dark:text-gray-300">
                <strong>@dnd-kit/sortable</strong> - Sortable list behavior
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-gray-700 dark:text-gray-300">
                <strong>Framer Motion</strong> - Smooth animations
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-gray-700 dark:text-gray-300">
                <strong>localStorage</strong> - Persistent nav order
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-gray-700 dark:text-gray-300">
                <strong>Auto-collapse Timer</strong> - 4s inactivity detection
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
