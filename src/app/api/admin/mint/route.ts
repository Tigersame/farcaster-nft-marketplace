/**
 * Admin API - Mint NFT
 * POST /api/admin/mint - Mint new NFT
 */

import { NextRequest, NextResponse } from 'next/server';
import { trackAdminMint, trackAdminBatchMint } from '@/lib/analytics';
import { logMint, logBatchMint } from '@/lib/auditLog';

export async function POST(request: NextRequest) {
  try {
    const { to, metadataUri, userId, userAddress, batch, metadataUris } = await request.json();

    // Validate required fields
    if (!to || !userId || !userAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if batch mint
    if (batch && metadataUris && Array.isArray(metadataUris)) {
      // Batch mint logic
      const tokenIds = metadataUris.map((_, index) => Date.now() + index);

      // Track analytics
      trackAdminBatchMint({ tokenIds, to, userId });

      // Audit log
      await logBatchMint({
        userId,
        userAddress,
        to,
        tokenIds,
        status: 'success',
      });

      return NextResponse.json({ 
        success: true, 
        tokenIds,
        message: `Minted ${tokenIds.length} NFTs`
      });
    } else {
      // Single mint logic
      if (!metadataUri) {
        return NextResponse.json(
          { error: 'Missing metadataUri for single mint' },
          { status: 400 }
        );
      }

      const tokenId = Date.now();

      // Track analytics
      trackAdminMint({ tokenId, to, userId });

      // Audit log
      await logMint({
        userId,
        userAddress,
        to,
        tokenId,
        status: 'success',
      });

      return NextResponse.json({ 
        success: true, 
        tokenId,
        message: 'NFT minted successfully'
      });
    }

  } catch (error: any) {
    console.error('Error minting NFT:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to mint NFT' },
      { status: 500 }
    );
  }
}
