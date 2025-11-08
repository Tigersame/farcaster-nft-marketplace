'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { FiShield, FiX, FiSettings } from 'react-icons/fi'
import { SuperAdminPanel } from './EnhancedAdminPanel'

export function AdminToggleButton() {
  const { address, isConnected } = useAccount()
  const [isAdmin, setIsAdmin] = useState(false)
  const [showAdminPanel, setShowAdminPanel] = useState(false)

  useEffect(() => {
    // For demo purposes, any connected wallet can be admin
    // In production, you'd check against a specific admin address
    const adminAddress = process.env.NEXT_PUBLIC_ADMIN_ADDRESS || '0x' // Set default or use env var
    if (isConnected && address) {
      // For development, make any connected wallet an admin
      // In production: setIsAdmin(address.toLowerCase() === adminAddress.toLowerCase())
      setIsAdmin(true) // Temporary for demo - make any wallet admin
    } else {
      setIsAdmin(false)
      setShowAdminPanel(false)
    }
  }, [address, isConnected])

  if (!isConnected || !isAdmin) {
    return null
  }

  return (
    <>
      {/* Admin Panel Modal */}
      {showAdminPanel && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowAdminPanel(false)}
          />
          
          {/* Modal Content */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-7xl max-h-[90vh] overflow-y-auto">
              {/* Close Button */}
              <div className="sticky top-0 z-10 flex justify-end p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowAdminPanel(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              
              {/* Enhanced Admin Panel */}
              <div className="p-4">
                <SuperAdminPanel />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Admin Button */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => setShowAdminPanel(!showAdminPanel)}
          className={`group relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${
            showAdminPanel 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700'
          }`}
        >
          {/* Icon */}
          <div className="relative">
            {showAdminPanel ? (
              <FiX className="w-6 h-6 text-white" />
            ) : (
              <FiShield className="w-6 h-6 text-white" />
            )}
          </div>

          {/* Tooltip */}
          <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            {showAdminPanel ? 'Close Admin Panel' : 'Open Admin Panel'}
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45"></div>
          </div>

          {/* Pulse Animation */}
          <div className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-20"></div>
          
          {/* Admin Badge */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
            <FiSettings className="w-2.5 h-2.5 text-yellow-900" />
          </div>
        </button>

        {/* Admin Status Indicator */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs font-medium rounded-full">
            ADMIN
          </div>
        </div>
      </div>
    </>
  )
}