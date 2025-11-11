/**
 * ERC20 Gas Payment Component
 * Provides UI for users to enable and manage ERC20 gas payments
 */

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiZap, FiCheck, FiAlertCircle, FiRefreshCw, FiInfo } from 'react-icons/fi'
import { useERC20GasPayment, useSupportedPaymentTokens } from '@/hooks/useERC20GasPayment'

interface ERC20GasPaymentProps {
  className?: string
  showEstimate?: boolean
  onApprovalSuccess?: (txHash: string) => void
  onApprovalError?: (error: Error) => void
}

export function ERC20GasPayment({
  className = '',
  showEstimate = true,
  onApprovalSuccess,
  onApprovalError
}: ERC20GasPaymentProps) {
  const [isApproving, setIsApproving] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  
  const {
    isSupported,
    needsApproval,
    tokenBalance,
    currentAllowance,
    approveTokens,
    estimatedGasCost,
    isLoading,
    tokenInfo,
    refreshStatus
  } = useERC20GasPayment({ enabled: true })

  const { defaultToken } = useSupportedPaymentTokens()

  const handleApproval = async () => {
    try {
      setIsApproving(true)
      const txHash = await approveTokens()
      onApprovalSuccess?.(txHash)
    } catch (error) {
      console.error('Approval failed:', error)
      onApprovalError?.(error as Error)
    } finally {
      setIsApproving(false)
    }
  }

  const handleRefresh = async () => {
    try {
      await refreshStatus()
    } catch (error) {
      console.error('Failed to refresh status:', error)
    }
  }

  if (!isSupported) {
    return (
      <div className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
          <FiZap className="w-5 h-5" />
          <span className="text-sm">ERC20 gas payments not available</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
              <FiZap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Pay Gas with {tokenInfo?.symbol || 'USDC'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Use your {tokenInfo?.symbol} balance for transaction fees
              </p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <FiRefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {needsApproval ? (
              <>
                <FiAlertCircle className="w-4 h-4 text-amber-500" />
                <span className="text-sm text-amber-600 dark:text-amber-400">
                  Approval required
                </span>
              </>
            ) : (
              <>
                <FiCheck className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400">
                  Ready for gas payments
                </span>
              </>
            )}
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            {showDetails ? 'Hide' : 'Show'} details
          </button>
        </div>

        {/* Details */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-3 text-sm"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Balance:</span>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {tokenBalance}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Allowance:</span>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {currentAllowance}
                  </div>
                </div>
              </div>
              
              {showEstimate && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <FiInfo className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-blue-700 dark:text-blue-300">
                    Estimated gas cost: ~{estimatedGasCost}
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Button */}
        {needsApproval && (
          <motion.button
            onClick={handleApproval}
            disabled={isApproving || isLoading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            whileHover={{ scale: isApproving ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isApproving ? (
              <>
                <FiRefreshCw className="w-4 h-4 animate-spin" />
                Approving...
              </>
            ) : (
              <>
                <FiCheck className="w-4 h-4" />
                Approve {tokenInfo?.symbol} for Gas
              </>
            )}
          </motion.button>
        )}

        {/* Info Box */}
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-start gap-2">
            <FiInfo className="w-4 h-4 text-gray-500 mt-0.5" />
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <p className="mb-1">
                <strong>ERC20 Gas Payments:</strong> Pay transaction fees using {tokenInfo?.symbol} instead of ETH.
              </p>
              <p>
                Powered by Base Account. One-time approval allows seamless transactions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Compact version for smaller spaces
 */
export function ERC20GasPaymentCompact({
  className = '',
  onApprovalSuccess,
  onApprovalError
}: Omit<ERC20GasPaymentProps, 'showEstimate'>) {
  const [isApproving, setIsApproving] = useState(false)
  
  const {
    isSupported,
    needsApproval,
    approveTokens,
    isLoading,
    tokenInfo
  } = useERC20GasPayment({ enabled: true })

  const handleApproval = async () => {
    try {
      setIsApproving(true)
      const txHash = await approveTokens()
      onApprovalSuccess?.(txHash)
    } catch (error) {
      console.error('Approval failed:', error)
      onApprovalError?.(error as Error)
    } finally {
      setIsApproving(false)
    }
  }

  if (!isSupported || !needsApproval) {
    return null
  }

  return (
    <motion.button
      onClick={handleApproval}
      disabled={isApproving || isLoading}
      className={`flex items-center gap-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium transition-colors ${className}`}
      whileHover={{ scale: isApproving ? 1 : 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {isApproving ? (
        <FiRefreshCw className="w-4 h-4 animate-spin" />
      ) : (
        <FiZap className="w-4 h-4" />
      )}
      {isApproving ? 'Approving...' : `Enable ${tokenInfo?.symbol} Gas`}
    </motion.button>
  )
}