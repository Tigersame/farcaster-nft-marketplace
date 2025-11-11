/**
 * React Hook for ERC20 Gas Payment Integration
 * Provides easy integration with Base Account ERC20 gas payments
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'
import { 
  checkTokenAllowance, 
  createApprovalTransaction, 
  getDefaultGasPaymentConfig,
  formatTokenAmount,
  GasPaymentConfig,
  SUPPORTED_PAYMENT_TOKENS,
  type UseERC20GasPaymentResult 
} from '@/lib/erc20-gas'

interface UseERC20GasPaymentOptions {
  tokenAddress?: string
  paymasterAddress?: string
  enabled?: boolean
}

export function useERC20GasPayment(
  options: UseERC20GasPaymentOptions = {}
): UseERC20GasPaymentResult {
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()
  
  const [needsApproval, setNeedsApproval] = useState(false)
  const [tokenBalance, setTokenBalance] = useState('0')
  const [currentAllowance, setCurrentAllowance] = useState('0')
  const [estimatedGasCost, setEstimatedGasCost] = useState('0')
  const [isLoading, setIsLoading] = useState(false)

  const config = options.tokenAddress 
    ? {
        ...getDefaultGasPaymentConfig(),
        tokenAddress: options.tokenAddress,
        ...(options.paymasterAddress && { paymasterAddress: options.paymasterAddress })
      }
    : getDefaultGasPaymentConfig()

  const isSupported = Boolean(
    isConnected && 
    publicClient && 
    walletClient && 
    options.enabled !== false
  )

  // Get token info for formatting
  const tokenInfo = SUPPORTED_PAYMENT_TOKENS.find(
    token => token.address.toLowerCase() === config.tokenAddress.toLowerCase()
  )

  const checkAllowanceAndBalance = useCallback(async () => {
    if (!isSupported || !address || !publicClient) return

    try {
      setIsLoading(true)
      const result = await checkTokenAllowance(publicClient, address, config)
      
      setNeedsApproval(result.needsApproval)
      setTokenBalance(
        tokenInfo ? formatTokenAmount(result.tokenBalance, tokenInfo.decimals, tokenInfo.symbol) : '0'
      )
      setCurrentAllowance(
        tokenInfo ? formatTokenAmount(result.currentAllowance, tokenInfo.decimals, tokenInfo.symbol) : '0'
      )
    } catch (error) {
      console.error('Error checking ERC20 gas payment status:', error)
    } finally {
      setIsLoading(false)
    }
  }, [isSupported, address, publicClient, config, tokenInfo])

  const approveTokens = useCallback(async (): Promise<string> => {
    if (!walletClient || !address) {
      throw new Error('Wallet not connected')
    }

    try {
      setIsLoading(true)
      const approvalTx = createApprovalTransaction(config)
      
      const hash = await walletClient.writeContract({
        abi: approvalTx.abi,
        address: approvalTx.address as `0x${string}`,
        functionName: 'approve' as const,
        args: [approvalTx.args[0] as `0x${string}`, approvalTx.args[1] as bigint],
        account: address,
      })

      // Wait for transaction confirmation
      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash })
      }

      // Refresh allowance after approval
      await checkAllowanceAndBalance()
      
      return hash
    } catch (error) {
      console.error('Error approving tokens for gas payment:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [walletClient, address, config, publicClient, checkAllowanceAndBalance])

  // Check allowance on mount and when dependencies change
  useEffect(() => {
    if (isSupported) {
      checkAllowanceAndBalance()
    }
  }, [isSupported, checkAllowanceAndBalance])

  // Estimate gas cost (simplified - in production would use real gas estimation)
  useEffect(() => {
    if (tokenInfo) {
      // Rough estimate: ~$0.01-0.05 for typical NFT transactions
      const estimatedCostUSD = 0.02
      const estimatedTokens = estimatedCostUSD * (10 ** tokenInfo.decimals)
      setEstimatedGasCost(formatTokenAmount(BigInt(Math.floor(estimatedTokens)), tokenInfo.decimals, tokenInfo.symbol))
    }
  }, [tokenInfo])

  return {
    isSupported,
    needsApproval,
    tokenBalance,
    currentAllowance,
    approveTokens,
    estimatedGasCost,
    isLoading,
    tokenInfo,
    refreshStatus: checkAllowanceAndBalance
  }
}

/**
 * Hook for getting supported payment tokens
 */
export function useSupportedPaymentTokens() {
  return {
    tokens: SUPPORTED_PAYMENT_TOKENS,
    defaultToken: SUPPORTED_PAYMENT_TOKENS[0], // USDC
  }
}