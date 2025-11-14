/**
 * Production-Ready NFT Contract Interaction Hook
 * 
 * Provides safe, type-checked contract interactions for buying/minting NFTs
 * Uses wagmi v2 + viem for modern Web3 integration
 * 
 * CRITICAL: Replace placeholder values with your actual contract data
 */

'use client'

import { useState } from 'react'
import { 
  useAccount, 
  useWriteContract, 
  useWaitForTransactionReceipt,
  useSendTransaction,
  useChainId,
  useSwitchChain
} from 'wagmi'
import { parseEther, type Address } from 'viem'
import { base } from 'wagmi/chains'

// ============================================================================
// CONFIGURATION - REPLACE THESE WITH YOUR ACTUAL CONTRACT DATA
// ============================================================================

/**
 * YOUR MARKETPLACE CONTRACT ADDRESS
 * Replace this with your deployed contract address
 */
const MARKETPLACE_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT as Address || '0x0000000000000000000000000000000000000000' as Address

/**
 * YOUR CONTRACT ABI
 * Replace with your actual contract ABI
 * 
 * Common marketplace patterns:
 * - buy(uint256 tokenId) payable - Buy existing listing
 * - mint(uint256 tokenId) payable - Mint new token
 * - purchaseNFT(uint256 tokenId) payable - Purchase NFT
 * - executeSale(uint256 tokenId) payable - Execute sale
 */
const MARKETPLACE_ABI = [
  // EXAMPLE: Buy function - REPLACE WITH YOUR ACTUAL ABI
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'buy',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  // EXAMPLE: Mint function - UNCOMMENT IF YOUR CONTRACT HAS MINT
  // {
  //   inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
  //   name: 'mint',
  //   outputs: [],
  //   stateMutability: 'payable',
  //   type: 'function',
  // },
] as const

/**
 * FUNCTION NAME TO CALL
 * Replace 'buy' with your contract's function name: 'mint', 'purchase', etc.
 */
const CONTRACT_FUNCTION_NAME = 'buy' as const

/**
 * TARGET CHAIN (Base mainnet by default)
 * Change to base sepolia for testnet: import { baseSepolia } from 'wagmi/chains'
 */
const TARGET_CHAIN = base

// ============================================================================
// TYPES
// ============================================================================

export interface UseBuyNFTContractOptions {
  tokenId: string | number
  priceEth?: string
  onSuccess?: (txHash: string) => void
  onError?: (error: Error) => void
  onPendingStart?: () => void
}

export interface UseBuyNFTContractReturn {
  buy: () => Promise<void>
  isLoading: boolean
  isPending: boolean
  isSuccess: boolean
  error: Error | null
  txHash: string | undefined
  explorerUrl: string | undefined
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * Hook for buying/minting NFTs from your marketplace contract
 * 
 * Features:
 * - Automatic network switching to Base
 * - Contract write with proper error handling
 * - Transaction confirmation tracking
 * - Explorer link generation
 * - Fallback to simple ETH transfer (for basic mint contracts)
 * 
 * @example
 * ```tsx
 * const { buy, isLoading, txHash, explorerUrl } = useBuyNFTContract({
 *   tokenId: '123',
 *   priceEth: '0.5',
 *   onSuccess: (hash) => toast.success(`Bought! ${hash}`),
 *   onError: (err) => toast.error(err.message),
 * })
 * 
 * <button onClick={buy} disabled={isLoading}>
 *   {isLoading ? 'Processing...' : 'Buy NFT'}
 * </button>
 * ```
 */
export function useBuyNFTContract(options: UseBuyNFTContractOptions): UseBuyNFTContractReturn {
  const {
    tokenId,
    priceEth = '0',
    onSuccess,
    onError,
    onPendingStart,
  } = options

  const [error, setError] = useState<Error | null>(null)
  
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  // Parse price to wei
  const value = priceEth ? parseEther(priceEth) : undefined

  // -------------------------
  // Contract Write (Preferred Method)
  // -------------------------
  const { 
    writeContract, 
    data: txData, 
    isPending: isWritePending,
    error: writeError 
  } = useWriteContract()

  const { 
    isLoading: isTxLoading, 
    isSuccess: isTxSuccess 
  } = useWaitForTransactionReceipt({
    hash: txData,
    confirmations: 1,
  })

  // -------------------------
  // Fallback: Simple ETH Transfer
  // For contracts that mint on receive() or fallback()
  // -------------------------
  const { 
    sendTransaction,
    data: sendTxData,
    isPending: isSendPending 
  } = useSendTransaction()

  const {
    isLoading: isSendTxLoading,
    isSuccess: isSendTxSuccess
  } = useWaitForTransactionReceipt({
    hash: sendTxData,
    confirmations: 1,
  })

  // -------------------------
  // Combined State
  // -------------------------
  const txHash = txData || sendTxData
  const isPending = isWritePending || isSendPending
  const isLoading = isPending || isTxLoading || isSendTxLoading
  const isSuccess = isTxSuccess || isSendTxSuccess

  // Explorer URL generation
  const explorerUrl = txHash 
    ? `${TARGET_CHAIN.blockExplorers.default.url}/tx/${txHash}`
    : undefined

  // -------------------------
  // Success/Error Handlers
  // -------------------------
  if (isSuccess && txHash && !isLoading) {
    onSuccess?.(txHash)
  }

  if (writeError && !error) {
    const err = new Error(writeError.message)
    setError(err)
    onError?.(err)
  }

  // -------------------------
  // Main Buy Function
  // -------------------------
  const buy = async () => {
    setError(null)

    // Check wallet connection
    if (!isConnected || !address) {
      const err = new Error('Please connect your wallet first')
      setError(err)
      onError?.(err)
      return
    }

    // Check network and switch if needed
    if (chainId !== TARGET_CHAIN.id) {
      try {
        await switchChain?.({ chainId: TARGET_CHAIN.id })
      } catch (err) {
        const error = new Error(`Please switch to ${TARGET_CHAIN.name} network`)
        setError(error)
        onError?.(error as Error)
        return
      }
    }

    try {
      onPendingStart?.()

      // METHOD 1: Call contract function (buy, mint, etc.)
      if (MARKETPLACE_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000') {
        await writeContract({
          address: MARKETPLACE_CONTRACT_ADDRESS,
          abi: MARKETPLACE_ABI,
          functionName: CONTRACT_FUNCTION_NAME,
          args: [BigInt(tokenId)],
          value: value,
        })
        return
      }

      // METHOD 2: Fallback - Send ETH directly to contract
      // Some simple mint contracts accept ETH via fallback/receive
      if (value && value > BigInt(0)) {
        await sendTransaction({
          to: MARKETPLACE_CONTRACT_ADDRESS,
          value: value,
        })
        return
      }

      // No valid transaction method
      throw new Error(
        'Contract not configured. Please set MARKETPLACE_CONTRACT_ADDRESS and ABI in useBuyNFTContract.ts'
      )

    } catch (err: any) {
      const error = new Error(err?.message || 'Transaction failed')
      setError(error)
      onError?.(error)
    }
  }

  return {
    buy,
    isLoading,
    isPending,
    isSuccess,
    error,
    txHash,
    explorerUrl,
  }
}

// ============================================================================
// HELPER: Get Explorer URL for any chain
// ============================================================================

/**
 * Generate block explorer URL for a transaction
 */
export function getExplorerUrl(chainId: number, txHash: string): string {
  const explorers: Record<number, string> = {
    1: 'https://etherscan.io',
    8453: 'https://basescan.org',
    84531: 'https://sepolia.basescan.org',
    137: 'https://polygonscan.com',
    42161: 'https://arbiscan.io',
    10: 'https://optimistic.etherscan.io',
  }

  const baseUrl = explorers[chainId] || 'https://etherscan.io'
  return `${baseUrl}/tx/${txHash}`
}
