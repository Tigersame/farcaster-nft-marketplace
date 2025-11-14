// Analytics tracking utility
// Supports Segment, Google Analytics 4, and console logging

export interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
}

/**
 * Track an analytics event
 * @param event - Event name (e.g., 'view_nft', 'click_buy')
 * @param properties - Event properties/payload
 */
export function track(event: string, properties?: Record<string, any>) {
  const payload = {
    event,
    properties: {
      ...properties,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : '',
    },
  }

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', payload)
  }

  // Segment
  if (typeof window !== 'undefined' && (window as any).analytics) {
    ;(window as any).analytics.track(event, properties)
  }

  // Google Analytics 4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    ;(window as any).gtag('event', event, properties)
  }

  // Custom analytics endpoint (optional)
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
    fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(console.error)
  }
}

/**
 * Predefined analytics events for NFT marketplace
 */
export const AnalyticsEvents = {
  // Viewing
  VIEW_NFT: 'view_nft',
  VIEW_COLLECTION: 'view_collection',
  
  // Actions
  CLICK_BUY: 'click_buy',
  CLICK_LIST: 'click_list',
  CLICK_OFFER: 'click_offer',
  
  // Transactions
  TX_SUBMITTED: 'tx_submitted',
  TX_CONFIRMED: 'tx_confirmed',
  TX_FAILED: 'tx_failed',
  
  // Search & Filter
  SEARCH: 'search',
  FILTER_APPLIED: 'filter_applied',
  SORT_APPLIED: 'sort_applied',
  
  // Wallet
  WALLET_CONNECTED: 'wallet_connected',
  WALLET_DISCONNECTED: 'wallet_disconnected',
  NETWORK_SWITCHED: 'network_switched',
}

/**
 * Track NFT view
 */
export function trackNFTView(tokenId: string, collection: string, source?: string) {
  track(AnalyticsEvents.VIEW_NFT, { tokenId, collection, source })
}

/**
 * Track buy click
 */
export function trackBuyClick(tokenId: string, price: string, collection?: string) {
  track(AnalyticsEvents.CLICK_BUY, { tokenId, price, collection })
}

/**
 * Track transaction submission
 */
export function trackTxSubmitted(txHash: string, tokenId: string, action: string) {
  track(AnalyticsEvents.TX_SUBMITTED, { txHash, tokenId, action })
}

/**
 * Track transaction confirmation
 */
export function trackTxConfirmed(txHash: string, tokenId: string, confirmations: number) {
  track(AnalyticsEvents.TX_CONFIRMED, { txHash, tokenId, confirmations })
}

/**
 * Track search
 */
export function trackSearch(query: string, resultsCount: number) {
  track(AnalyticsEvents.SEARCH, { query, resultsCount })
}

// ============ Admin Analytics Events ============

export const AdminAnalyticsEvents = {
  // Minting
  ADMIN_MINT: 'admin.mint',
  ADMIN_BATCH_MINT: 'admin.batch_mint',
  
  // Collections
  ADMIN_CREATE_COLLECTION: 'admin.create_collection',
  ADMIN_UPDATE_COLLECTION: 'admin.update_collection',
  ADMIN_SET_ROYALTY: 'admin.set_royalty',
  
  // NFT Management
  ADMIN_SET_PRICE: 'admin.set_price',
  ADMIN_DELIST: 'admin.delist',
  ADMIN_REMOVE_NFT: 'admin.remove_nft',
  ADMIN_ADD_TO_COLLECTION: 'admin.add_to_collection',
  
  // Finance
  ADMIN_WITHDRAW_PROPOSED: 'admin.withdraw_proposed',
  ADMIN_WITHDRAW_EXECUTED: 'admin.withdraw_executed',
  
  // Theme & Settings
  ADMIN_SET_THEME: 'admin.set_theme',
  ADMIN_UPDATE_HEADER: 'admin.update_header',
  
  // Roles & Permissions
  ADMIN_GRANT_ROLE: 'admin.grant_role',
  ADMIN_REVOKE_ROLE: 'admin.revoke_role',
  
  // Emergency
  ADMIN_PAUSE: 'admin.pause',
  ADMIN_UNPAUSE: 'admin.unpause',
  ADMIN_UPGRADE_PROPOSED: 'admin.upgrade_proposed',
  
  // Whitelist
  ADMIN_SET_WHITELIST: 'admin.set_whitelist',
  ADMIN_BATCH_WHITELIST: 'admin.batch_whitelist',
}

interface AdminEventData {
  userId: string;
  txHash?: string;
  [key: string]: any;
}

/**
 * Send admin event to Sentry for monitoring
 */
function sendToSentry(eventName: string, data: AdminEventData) {
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    const Sentry = (window as any).Sentry;
    
    Sentry.addBreadcrumb({
      category: 'admin',
      message: eventName,
      level: 'info',
      data,
    });

    // Set tags for filtering
    Sentry.setTag('admin_action', eventName.replace('admin.', ''));
    
    if (data.userId) {
      Sentry.setUser({ id: data.userId });
    }
    
    if (data.txHash) {
      Sentry.setContext('transaction', { txHash: data.txHash });
    }
  }
}

/**
 * Track admin mint action
 */
export function trackAdminMint(data: { tokenId?: number; to: string; txHash?: string; userId: string }) {
  track(AdminAnalyticsEvents.ADMIN_MINT, data);
  sendToSentry(AdminAnalyticsEvents.ADMIN_MINT, data);
}

/**
 * Track admin batch mint
 */
export function trackAdminBatchMint(data: { tokenIds: number[]; to: string; txHash?: string; userId: string }) {
  const eventData = { ...data, count: data.tokenIds.length };
  track(AdminAnalyticsEvents.ADMIN_BATCH_MINT, eventData);
  sendToSentry(AdminAnalyticsEvents.ADMIN_BATCH_MINT, eventData);
}

/**
 * Track collection creation
 */
export function trackAdminCreateCollection(data: { collectionId: string; name: string; userId: string }) {
  track(AdminAnalyticsEvents.ADMIN_CREATE_COLLECTION, data);
  sendToSentry(AdminAnalyticsEvents.ADMIN_CREATE_COLLECTION, data);
}

/**
 * Track collection update
 */
export function trackAdminUpdateCollection(data: { collectionId: string; userId: string }) {
  track(AdminAnalyticsEvents.ADMIN_UPDATE_COLLECTION, data);
  sendToSentry(AdminAnalyticsEvents.ADMIN_UPDATE_COLLECTION, data);
}

/**
 * Track price update
 */
export function trackAdminSetPrice(data: { tokenId: number; price: string; userId: string }) {
  track(AdminAnalyticsEvents.ADMIN_SET_PRICE, data);
  sendToSentry(AdminAnalyticsEvents.ADMIN_SET_PRICE, data);
}

/**
 * Track NFT delisting
 */
export function trackAdminDelist(data: { tokenId: number; reason?: string; userId: string }) {
  track(AdminAnalyticsEvents.ADMIN_DELIST, data);
  sendToSentry(AdminAnalyticsEvents.ADMIN_DELIST, data);
}

/**
 * Track NFT removal/burn
 */
export function trackAdminRemoveNFT(data: { tokenId: number; reason?: string; userId: string }) {
  track(AdminAnalyticsEvents.ADMIN_REMOVE_NFT, data);
  sendToSentry(AdminAnalyticsEvents.ADMIN_REMOVE_NFT, data);
}

/**
 * Track withdraw proposal
 */
export function trackAdminWithdrawProposed(data: { amount: string; to: string; proposalId?: string; userId: string }) {
  track(AdminAnalyticsEvents.ADMIN_WITHDRAW_PROPOSED, data);
  sendToSentry(AdminAnalyticsEvents.ADMIN_WITHDRAW_PROPOSED, data);
}

/**
 * Track withdraw execution
 */
export function trackAdminWithdrawExecuted(data: { amount: string; to: string; txHash: string; userId: string }) {
  track(AdminAnalyticsEvents.ADMIN_WITHDRAW_EXECUTED, data);
  sendToSentry(AdminAnalyticsEvents.ADMIN_WITHDRAW_EXECUTED, data);
}

/**
 * Track theme change
 */
export function trackAdminSetTheme(data: { key: string; value: string; userId: string }) {
  track(AdminAnalyticsEvents.ADMIN_SET_THEME, data);
  sendToSentry(AdminAnalyticsEvents.ADMIN_SET_THEME, data);
}

/**
 * Track role grant
 */
export function trackAdminGrantRole(data: { role: string; to: string; userId: string; txHash?: string }) {
  track(AdminAnalyticsEvents.ADMIN_GRANT_ROLE, data);
  sendToSentry(AdminAnalyticsEvents.ADMIN_GRANT_ROLE, data);
}

/**
 * Track role revoke
 */
export function trackAdminRevokeRole(data: { role: string; from: string; userId: string; txHash?: string }) {
  track(AdminAnalyticsEvents.ADMIN_REVOKE_ROLE, data);
  sendToSentry(AdminAnalyticsEvents.ADMIN_REVOKE_ROLE, data);
}

/**
 * Track marketplace pause
 */
export function trackAdminPause(data: { userId: string; reason?: string; txHash?: string }) {
  track(AdminAnalyticsEvents.ADMIN_PAUSE, data);
  sendToSentry(AdminAnalyticsEvents.ADMIN_PAUSE, data);
}

/**
 * Track marketplace unpause
 */
export function trackAdminUnpause(data: { userId: string; txHash?: string }) {
  track(AdminAnalyticsEvents.ADMIN_UNPAUSE, data);
  sendToSentry(AdminAnalyticsEvents.ADMIN_UNPAUSE, data);
}

/**
 * Track whitelist update
 */
export function trackAdminSetWhitelist(data: { address: string; status: boolean; userId: string; txHash?: string }) {
  track(AdminAnalyticsEvents.ADMIN_SET_WHITELIST, data);
  sendToSentry(AdminAnalyticsEvents.ADMIN_SET_WHITELIST, data);
}