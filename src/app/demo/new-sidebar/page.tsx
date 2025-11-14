'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'

export default function SidebarDemoPage() {
  const [currentView, setCurrentView] = useState('explore')

  const handleNavigate = (id: string) => {
    console.log('Navigating to:', id)
    setCurrentView(id)
  }

  return (
    <div className="flex h-screen bg-gray-900">
      {/* New Sidebar Component */}
      <Sidebar
        active={currentView}
        onNavigate={handleNavigate}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl p-8 border border-white/10">
            <h1 className="text-4xl font-bold text-white mb-4">
              Enhanced Sidebar Demo
            </h1>
            <p className="text-gray-300 text-lg mb-8">
              Testing the new sidebar with all features:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Feature 1 */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white">Drag to Reorder</h3>
                </div>
                <p className="text-gray-400">
                  Click and drag navigation items to reorder them. Your custom order is saved to localStorage.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white">Hover Previews</h3>
                </div>
                <p className="text-gray-400">
                  Hover over any sidebar icon to see a preview card with NFT data fetched from the API.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white">Auto-Collapse</h3>
                </div>
                <p className="text-gray-400">
                  Sidebar automatically collapses after 4 seconds of inactivity. Toggle the setting at the bottom.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white">Analytics Badges</h3>
                </div>
                <p className="text-gray-400">
                  Some items show metric badges (numbers) and notification badges (!). Easily customizable.
                </p>
              </div>
            </div>

            {/* Current View Display */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-6 border border-blue-500/30">
              <h2 className="text-2xl font-bold text-white mb-2">
                Current View: <span className="text-cyan-400">{currentView}</span>
              </h2>
              <p className="text-gray-300">
                Click any sidebar item to navigate. The active view is tracked and highlighted.
              </p>
            </div>

            {/* Technical Details */}
            <div className="mt-8 p-6 bg-black/20 rounded-xl border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Technical Details</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span><strong>@dnd-kit</strong> for drag-and-drop functionality</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span><strong>framer-motion</strong> for smooth animations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span><strong>next/image</strong> for optimized preview images</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span><strong>localStorage</strong> for persistent user preferences</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span><strong>API route</strong> at /api/sidebar/previews for server-side data</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
