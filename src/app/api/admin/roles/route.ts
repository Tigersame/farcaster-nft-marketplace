/**
 * Admin API - Roles Management
 * POST /api/admin/roles - Grant or revoke roles
 */

import { NextRequest, NextResponse } from 'next/server';
import { createGrantRoleProposal, createRevokeRoleProposal, ROLES } from '@/lib/gnosisSafe';
import { trackAdminGrantRole, trackAdminRevokeRole } from '@/lib/analytics';
import { logGrantRole, logRevokeRole } from '@/lib/auditLog';

export async function POST(request: NextRequest) {
  try {
    const { action, role, account, safeAddress, contractAddress, abi, userId, userAddress } = await request.json();

    // Validate required fields
    if (!action || !role || !account || !safeAddress || !contractAddress || !userId || !userAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get role hash
    const roleHash = (ROLES as any)[role] || role;

    if (action === 'grant') {
      // Create grant role proposal
      const proposal = await createGrantRoleProposal({
        safeAddress,
        contractAddress,
        role: roleHash,
        account,
        abi: abi || [], // Provide default ABI if not given
      });

      // Track analytics
      trackAdminGrantRole({ role, to: account, userId });

      // Audit log
      await logGrantRole({
        userId,
        userAddress,
        role,
        to: account,
        status: 'pending',
      });

      return NextResponse.json({ 
        success: true, 
        proposal,
        message: 'Role grant proposal created. Awaiting multisig approvals.'
      });

    } else if (action === 'revoke') {
      // Create revoke role proposal
      const proposal = await createRevokeRoleProposal({
        safeAddress,
        contractAddress,
        role: roleHash,
        account,
        abi: abi || [],
      });

      // Track analytics
      trackAdminRevokeRole({ role, from: account, userId });

      // Audit log
      await logRevokeRole({
        userId,
        userAddress,
        role,
        from: account,
        status: 'pending',
      });

      return NextResponse.json({ 
        success: true, 
        proposal,
        message: 'Role revoke proposal created. Awaiting multisig approvals.'
      });

    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "grant" or "revoke"' },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('Error managing roles:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to manage roles' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Return available roles
    const roles = Object.keys(ROLES).map(key => ({
      name: key,
      hash: (ROLES as any)[key],
    }));

    return NextResponse.json({ roles });

  } catch (error: any) {
    console.error('Error fetching roles:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch roles' },
      { status: 500 }
    );
  }
}
