// Enhanced analytics tracking with comprehensive event types
// Integrates with GA4, Segment, and custom analytics

export interface AnalyticsEvent {
  category: string
  action: string
  label?: string
  value?: number
  metadata?: Record<string, any>
}

// ==================== USER EVENTS ====================

export function trackUserConnect(address: string, method: 'wallet' | 'farcaster') {
  const event: AnalyticsEvent = {
    category: 'User',
    action: 'user:connect',
    label: method,
    metadata: { address, method, timestamp: Date.now() }
  }
  
  console.log('📊 Analytics:', event)
  
  // GA4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'user_connect', {
      method,
      user_address: address
    })
  }
  
  // Custom event for listeners
  window.dispatchEvent(new CustomEvent('analytics:event', { detail: event }))
}

export function trackUserDisconnect(address: string) {
  const event: AnalyticsEvent = {
    category: 'User',
    action: 'user:disconnect',
    metadata: { address, timestamp: Date.now() }
  }
  
  console.log('📊 Analytics:', event)
  
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'user_disconnect', {
      user_address: address
    })
  }
  
  window.dispatchEvent(new CustomEvent('analytics:event', { detail: event }))
}

// ==================== NFT EVENTS ====================

export function trackNFTView(tokenId: string, contractAddress: string, metadata?: any) {
  const event: AnalyticsEvent = {
    category: 'NFT',
    action: 'nft:view',
    label: tokenId,
    metadata: { tokenId, contractAddress, ...metadata, timestamp: Date.now() }
  }
  
  console.log('📊 Analytics:', event)
  
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'view_item', {
      item_id: tokenId,
      item_name: metadata?.name,
      item_category: 'NFT',
      price: metadata?.price
    })
  }
  
  window.dispatchEvent(new CustomEvent('analytics:event', { detail: event }))
}

export function trackBuyClick(tokenId: string, price: string, metadata?: any) {
  const event: AnalyticsEvent = {
    category: 'NFT',
    action: 'buy:click',
    label: tokenId,
    value: parseFloat(price),
    metadata: { tokenId, price, ...metadata, timestamp: Date.now() }
  }
  
  console.log('📊 Analytics:', event)
  
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'add_to_cart', {
      item_id: tokenId,
      item_name: metadata?.name,
      price: parseFloat(price),
      currency: 'ETH'
    })
  }
  
  window.dispatchEvent(new CustomEvent('analytics:event', { detail: event }))
}

// ==================== MINT EVENTS ====================

export function trackMintSubmitted(tokenId: string, metadata?: any) {
  const event: AnalyticsEvent = {
    category: 'Mint',
    action: 'mint:submitted',
    label: tokenId,
    metadata: { tokenId, ...metadata, timestamp: Date.now() }
  }
  
  console.log('📊 Analytics:', event)
  
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'mint_submitted', {
      token_id: tokenId,
      ...metadata
    })
  }
  
  window.dispatchEvent(new CustomEvent('analytics:event', { detail: event }))
}

export function trackMintConfirmed(tokenId: string, txHash: string, metadata?: any) {
  const event: AnalyticsEvent = {
    category: 'Mint',
    action: 'mint:confirmed',
    label: tokenId,
    metadata: { tokenId, txHash, ...metadata, timestamp: Date.now() }
  }
  
  console.log('📊 Analytics:', event)
  
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'mint_confirmed', {
      token_id: tokenId,
      transaction_hash: txHash,
      ...metadata
    })
  }
  
  window.dispatchEvent(new CustomEvent('analytics:event', { detail: event }))
}

export function trackMintFailed(tokenId: string, error: string, metadata?: any) {
  const event: AnalyticsEvent = {
    category: 'Mint',
    action: 'mint:failed',
    label: tokenId,
    metadata: { tokenId, error, ...metadata, timestamp: Date.now() }
  }
  
  console.log('📊 Analytics:', event)
  
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'mint_failed', {
      token_id: tokenId,
      error_message: error,
      ...metadata
    })
  }
  
  window.dispatchEvent(new CustomEvent('analytics:event', { detail: event }))
}

// ==================== SWAP EVENTS ====================

export function trackSwapSubmitted(fromToken: string, toToken: string, amount: string) {
  const event: AnalyticsEvent = {
    category: 'Swap',
    action: 'swap:submitted',
    label: `${fromToken}->${toToken}`,
    value: parseFloat(amount),
    metadata: { fromToken, toToken, amount, timestamp: Date.now() }
  }
  
  console.log('📊 Analytics:', event)
  
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'swap_submitted', {
      from_token: fromToken,
      to_token: toToken,
      amount
    })
  }
  
  window.dispatchEvent(new CustomEvent('analytics:event', { detail: event }))
}

export function trackSwapConfirmed(fromToken: string, toToken: string, amount: string, txHash: string) {
  const event: AnalyticsEvent = {
    category: 'Swap',
    action: 'swap:confirmed',
    label: `${fromToken}->${toToken}`,
    value: parseFloat(amount),
    metadata: { fromToken, toToken, amount, txHash, timestamp: Date.now() }
  }
  
  console.log('📊 Analytics:', event)
  
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'swap_confirmed', {
      from_token: fromToken,
      to_token: toToken,
      amount,
      transaction_hash: txHash
    })
  }
  
  window.dispatchEvent(new CustomEvent('analytics:event', { detail: event }))
}

// ==================== SEARCH & FILTER EVENTS ====================

export function trackSearch(query: string, results: number) {
  const event: AnalyticsEvent = {
    category: 'Search',
    action: 'search',
    label: query,
    value: results,
    metadata: { query, results, timestamp: Date.now() }
  }
  
  console.log('📊 Analytics:', event)
  
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'search', {
      search_term: query,
      results_count: results
    })
  }
  
  window.dispatchEvent(new CustomEvent('analytics:event', { detail: event }))
}

export function trackFilterApply(filterType: string, filterValue: string) {
  const event: AnalyticsEvent = {
    category: 'Filter',
    action: 'filter:apply',
    label: `${filterType}:${filterValue}`,
    metadata: { filterType, filterValue, timestamp: Date.now() }
  }
  
  console.log('📊 Analytics:', event)
  
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'filter_apply', {
      filter_type: filterType,
      filter_value: filterValue
    })
  }
  
  window.dispatchEvent(new CustomEvent('analytics:event', { detail: event }))
}

// ==================== FLOW EVENTS ====================

export function trackStepCompleted(route: string, progress: number) {
  const event: AnalyticsEvent = {
    category: 'Flow',
    action: 'flow:stepCompleted',
    label: route,
    value: progress,
    metadata: { route, progress, timestamp: Date.now() }
  }
  
  console.log('📊 Analytics:', event)
  
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'step_completed', {
      route,
      progress_percentage: progress
    })
  }
  
  window.dispatchEvent(new CustomEvent('analytics:event', { detail: event }))
}

// ==================== GENERIC TRACKER ====================

export function trackEvent(event: AnalyticsEvent) {
  console.log('📊 Analytics:', event)
  
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      ...event.metadata
    })
  }
  
  window.dispatchEvent(new CustomEvent('analytics:event', { detail: event }))
}

// ==================== UTILITY: Analytics Listener ====================

export function setupAnalyticsListeners() {
  if (typeof window === 'undefined') return

  // Listen to flow completion events
  window.addEventListener('flow:stepCompleted', (e: any) => {
    trackStepCompleted(e.detail.route, e.detail.progress)
  })

  console.log('✅ Analytics listeners initialized')
}
