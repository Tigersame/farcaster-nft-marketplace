// Optimistic UI state management for NFT transactions
// Provides instant feedback while blockchain transactions confirm

import { useState, useCallback } from 'react'

export interface OptimisticAction {
  id: string
  type: 'buy' | 'list' | 'cancel' | 'offer'
  tokenId: string
  status: 'pending' | 'confirming' | 'confirmed' | 'failed'
  txHash?: string
  timestamp: number
}

/**
 * Hook for managing optimistic UI state
 */
export function useOptimisticUI() {
  const [actions, setActions] = useState<Map<string, OptimisticAction>>(new Map())

  const startAction = useCallback((
    id: string,
    type: OptimisticAction['type'],
    tokenId: string
  ) => {
    setActions(prev => {
      const next = new Map(prev)
      next.set(id, {
        id,
        type,
        tokenId,
        status: 'pending',
        timestamp: Date.now(),
      })
      return next
    })
  }, [])

  const updateAction = useCallback((
    id: string,
    updates: Partial<OptimisticAction>
  ) => {
    setActions(prev => {
      const next = new Map(prev)
      const action = next.get(id)
      if (action) {
        next.set(id, { ...action, ...updates })
      }
      return next
    })
  }, [])

  const confirmAction = useCallback((id: string, txHash: string) => {
    updateAction(id, { status: 'confirmed', txHash })
    // Remove after animation delay
    setTimeout(() => {
      setActions(prev => {
        const next = new Map(prev)
        next.delete(id)
        return next
      })
    }, 3000)
  }, [updateAction])

  const failAction = useCallback((id: string) => {
    updateAction(id, { status: 'failed' })
    // Remove after error display
    setTimeout(() => {
      setActions(prev => {
        const next = new Map(prev)
        next.delete(id)
        return next
      })
    }, 5000)
  }, [updateAction])

  const isPending = useCallback((tokenId: string) => {
    return Array.from(actions.values()).some(
      action => action.tokenId === tokenId && action.status === 'pending'
    )
  }, [actions])

  return {
    actions: Array.from(actions.values()),
    startAction,
    updateAction,
    confirmAction,
    failAction,
    isPending,
  }
}

/**
 * Generate unique action ID
 */
export function generateActionId(type: string, tokenId: string): string {
  return `${type}_${tokenId}_${Date.now()}`
}

/**
 * Optimistic buy flow example
 */
export async function optimisticBuy(
  tokenId: string,
  buyFunction: () => Promise<any>,
  onStart: (id: string) => void,
  onConfirm: (id: string, txHash: string) => void,
  onFail: (id: string) => void
) {
  const actionId = generateActionId('buy', tokenId)
  
  try {
    // Start optimistic state
    onStart(actionId)
    
    // Execute transaction
    const tx = await buyFunction()
    
    // Wait for confirmation
    const receipt = await tx.wait()
    
    // Confirm success
    onConfirm(actionId, receipt.transactionHash)
    
    return receipt
  } catch (error) {
    // Rollback on failure
    onFail(actionId)
    throw error
  }
}
