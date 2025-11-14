/**
 * Admin API - Withdraw Revenue
 * POST /api/admin/withdraw - Create withdraw proposal to Gnosis Safe
 */

import { NextRequest, NextResponse } from 'next/server';
import { createWithdrawProposal } from '@/lib/gnosisSafe';
import { trackAdminWithdrawProposed } from '@/lib/analytics';
import { logWithdrawProposed } from '@/lib/auditLog';

export async function POST(request: NextRequest) {
  try {
    const { amount, to, safeAddress, description, userId, userAddress } = await request.json();

    // Validate required fields
    if (!amount || !to || !safeAddress || !userId || !userAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create Gnosis Safe proposal
    const proposal = await createWithdrawProposal({
      safeAddress,
      to,
      amount,
      description: description || `Withdraw ${amount} ETH`,
    });

    // Track analytics
    trackAdminWithdrawProposed({ 
      amount, 
      to, 
      proposalId: proposal.id, 
      userId 
    });

    // Audit log
    await logWithdrawProposed({
      userId,
      userAddress,
      amount,
      to,
      proposalId: proposal.id,
    });

    return NextResponse.json({ 
      success: true, 
      proposal,
      message: 'Withdrawal proposal created. Awaiting multisig approvals.'
    });

  } catch (error: any) {
    console.error('Error creating withdrawal proposal:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create withdrawal proposal' },
      { status: 500 }
    );
  }
}
