/**
 * Admin API - Set Price
 * POST /api/admin/price - Set NFT price
 */

import { NextRequest, NextResponse } from 'next/server';
import { trackAdminSetPrice } from '@/lib/analytics';
import { logSetPrice } from '@/lib/auditLog';

export async function POST(request: NextRequest) {
  try {
    const { tokenId, price, userId, userAddress } = await request.json();

    // Validate required fields
    if (tokenId === undefined || price === undefined || !userId || !userAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Track analytics
    trackAdminSetPrice({ tokenId, price, userId });

    // Audit log
    await logSetPrice({
      userId,
      userAddress,
      tokenId,
      price,
      status: 'success',
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Price set successfully'
    });

  } catch (error: any) {
    console.error('Error setting price:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to set price' },
      { status: 500 }
    );
  }
}
