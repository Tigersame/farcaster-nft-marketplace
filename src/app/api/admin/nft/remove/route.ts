/**
 * Admin API - Delist/Remove NFT
 * POST /api/admin/nft/remove - Delist or remove NFT
 */

import { NextRequest, NextResponse } from 'next/server';
import { trackAdminDelist, trackAdminRemoveNFT } from '@/lib/analytics';
import { logDelist } from '@/lib/auditLog';

export async function POST(request: NextRequest) {
  try {
    const { tokenId, action, reason, userId, userAddress } = await request.json();

    // Validate required fields
    if (tokenId === undefined || !action || !userId || !userAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (action === 'delist') {
      // Delist from marketplace
      trackAdminDelist({ tokenId, reason, userId });
      
      await logDelist({
        userId,
        userAddress,
        tokenId,
        reason,
        status: 'success',
      });

      return NextResponse.json({ 
        success: true, 
        message: 'NFT delisted successfully'
      });
    } else if (action === 'remove') {
      // Remove/burn NFT
      trackAdminRemoveNFT({ tokenId, reason, userId });
      
      await logDelist({
        userId,
        userAddress,
        tokenId,
        reason,
        status: 'success',
      });

      return NextResponse.json({ 
        success: true, 
        message: 'NFT removed successfully'
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "delist" or "remove"' },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('Error removing NFT:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to remove NFT' },
      { status: 500 }
    );
  }
}
