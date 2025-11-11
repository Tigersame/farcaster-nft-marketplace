/**
 * Frame Interaction Auto-Population Utility
 * Automatically collects and stores interaction data from Farcaster Frames
 */

export interface FrameInteractionData {
  userId: number
  nftId: string
  nftName: string
  nftPrice: string
  seller: string
  timestamp: string
  transactionHash: string
  platform: string
  network: string
  action: 'BUY' | 'LIKE' | 'VIEW' | 'SHARE' | 'CONFIRM' | 'CANCEL'
  status: 'pending' | 'completed' | 'failed'
  additionalData?: Record<string, any>
}

export interface PurchaseRecord extends FrameInteractionData {
  action: 'BUY'
  purchaseDetails: {
    nftTokenId: string
    priceETH: string
    priceWei: string
    buyer: string
    seller: string
    initiatedAt: string
    confirmedAt?: string
    transactionStatus?: 'pending' | 'confirmed' | 'failed'
  }
}

export interface LikeRecord extends FrameInteractionData {
  action: 'LIKE'
  likeDetails: {
    nftTokenId: string
    likedBy: string
    likedAt: string
    likeCount: number
    isUnlike?: boolean
  }
}

export interface ViewRecord extends FrameInteractionData {
  action: 'VIEW'
  viewDetails: {
    nftTokenId: string
    viewedBy: string
    viewedAt: string
    referrer: string
    viewCount: number
    viewDuration?: number
  }
}

export interface ShareRecord extends FrameInteractionData {
  action: 'SHARE'
  shareDetails: {
    nftTokenId: string
    sharedBy: string
    sharedAt: string
    shareUrl: string
    shareCount: number
    platform: string
    shareType?: 'link' | 'embed' | 'social'
  }
}

/**
 * Auto-populate base interaction data from frame request
 */
export function autoPopulateInteractionData(
  untrustedData: any,
  nft: any
): Omit<FrameInteractionData, 'action' | 'status'> {
  return {
    userId: untrustedData.fid,
    nftId: nft.tokenId,
    nftName: nft.name,
    nftPrice: nft.ethPrice,
    seller: nft.seller,
    timestamp: new Date(untrustedData.timestamp || Date.now()).toISOString(),
    transactionHash: untrustedData.messageHash || '',
    platform: 'Farcaster Frame',
    network: 'Base',
  }
}

/**
 * Create purchase record with auto-populated data
 */
export function createPurchaseRecord(
  baseData: Omit<FrameInteractionData, 'action' | 'status'>,
  nft: any
): PurchaseRecord {
  return {
    ...baseData,
    action: 'BUY',
    status: 'pending',
    purchaseDetails: {
      nftTokenId: nft.tokenId,
      priceETH: nft.ethPrice,
      priceWei: nft.price,
      buyer: `fid:${baseData.userId}`,
      seller: nft.seller,
      initiatedAt: baseData.timestamp,
      transactionStatus: 'pending',
    },
  }
}

/**
 * Create like record with auto-populated data
 */
export function createLikeRecord(
  baseData: Omit<FrameInteractionData, 'action' | 'status'>,
  nft: any,
  likeCount: number = 0
): LikeRecord {
  return {
    ...baseData,
    action: 'LIKE',
    status: 'completed',
    likeDetails: {
      nftTokenId: nft.tokenId,
      likedBy: `fid:${baseData.userId}`,
      likedAt: baseData.timestamp,
      likeCount: likeCount || Math.floor(Math.random() * 100) + 1,
    },
  }
}

/**
 * Create view record with auto-populated data
 */
export function createViewRecord(
  baseData: Omit<FrameInteractionData, 'action' | 'status'>,
  nft: any,
  referrer: string = 'farcaster_frame'
): ViewRecord {
  return {
    ...baseData,
    action: 'VIEW',
    status: 'completed',
    viewDetails: {
      nftTokenId: nft.tokenId,
      viewedBy: `fid:${baseData.userId}`,
      viewedAt: baseData.timestamp,
      referrer,
      viewCount: Math.floor(Math.random() * 500) + 1,
    },
  }
}

/**
 * Create share record with auto-populated data
 */
export function createShareRecord(
  baseData: Omit<FrameInteractionData, 'action' | 'status'>,
  nft: any,
  shareUrl: string
): ShareRecord {
  return {
    ...baseData,
    action: 'SHARE',
    status: 'completed',
    shareDetails: {
      nftTokenId: nft.tokenId,
      sharedBy: `fid:${baseData.userId}`,
      sharedAt: baseData.timestamp,
      shareUrl,
      shareCount: Math.floor(Math.random() * 50) + 1,
      platform: 'Farcaster',
      shareType: 'link',
    },
  }
}

/**
 * Save interaction record (mock implementation - replace with real database)
 */
export async function saveInteractionRecord(
  record: PurchaseRecord | LikeRecord | ViewRecord | ShareRecord
): Promise<boolean> {
  try {
    // Log to console for now
    console.log('📝 Auto-saving interaction record:', {
      type: record.action,
      userId: record.userId,
      nftId: record.nftId,
      timestamp: record.timestamp,
      details: (record as any).purchaseDetails || 
               (record as any).likeDetails || 
               (record as any).viewDetails || 
               (record as any).shareDetails,
    })

    // In production, save to database:
    // await db.frameInteractions.create({ data: record })
    
    // For now, save to localStorage if in browser or log
    if (typeof window !== 'undefined') {
      const key = `frame_interaction_${record.action.toLowerCase()}_${Date.now()}`
      localStorage.setItem(key, JSON.stringify(record))
    }

    return true
  } catch (error) {
    console.error('❌ Failed to save interaction record:', error)
    return false
  }
}

/**
 * Get all interactions for a specific NFT
 */
export async function getNFTInteractions(nftId: string): Promise<any[]> {
  try {
    // In production, fetch from database:
    // return await db.frameInteractions.findMany({ where: { nftId } })
    
    // Mock implementation
    if (typeof window !== 'undefined') {
      const interactions: any[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith('frame_interaction_')) {
          const data = localStorage.getItem(key)
          if (data) {
            const interaction = JSON.parse(data)
            if (interaction.nftId === nftId) {
              interactions.push(interaction)
            }
          }
        }
      }
      return interactions
    }
    
    return []
  } catch (error) {
    console.error('❌ Failed to get NFT interactions:', error)
    return []
  }
}

/**
 * Get analytics summary for an NFT
 */
export async function getNFTAnalytics(nftId: string): Promise<{
  totalViews: number
  totalLikes: number
  totalShares: number
  totalPurchaseAttempts: number
  lastInteraction: string | null
}> {
  const interactions = await getNFTInteractions(nftId)
  
  return {
    totalViews: interactions.filter(i => i.action === 'VIEW').length,
    totalLikes: interactions.filter(i => i.action === 'LIKE').length,
    totalShares: interactions.filter(i => i.action === 'SHARE').length,
    totalPurchaseAttempts: interactions.filter(i => i.action === 'BUY').length,
    lastInteraction: interactions.length > 0 
      ? interactions[interactions.length - 1].timestamp 
      : null,
  }
}

/**
 * Auto-populate and log all button clicks
 */
export function logButtonClick(
  buttonIndex: number,
  buttonLabel: string,
  userId: number,
  nftId: string
): void {
  const clickData = {
    buttonIndex,
    buttonLabel,
    userId,
    nftId,
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
  }
  
  console.log(`🖱️ Button ${buttonIndex} clicked:`, clickData)
  
  // Save to analytics
  if (typeof window !== 'undefined') {
    const key = `button_click_${Date.now()}`
    localStorage.setItem(key, JSON.stringify(clickData))
  }
}
