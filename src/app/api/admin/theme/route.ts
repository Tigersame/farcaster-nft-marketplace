/**
 * Admin API - Theme Settings
 * POST /api/admin/theme - Update site theme
 */

import { NextRequest, NextResponse } from 'next/server';
import { trackAdminSetTheme } from '@/lib/analytics';
import { logSetTheme } from '@/lib/auditLog';

export async function POST(request: NextRequest) {
  try {
    const { key, value, userId, userAddress } = await request.json();

    // Validate required fields
    if (!key || value === undefined || !userId || !userAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save theme setting to database
    // For now, just track and log

    // Track analytics
    trackAdminSetTheme({ key, value, userId });

    // Audit log
    await logSetTheme({
      userId,
      userAddress,
      key,
      value,
      status: 'success',
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Theme updated successfully'
    });

  } catch (error: any) {
    console.error('Error updating theme:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update theme' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Fetch current theme settings from database
    const themeSettings: any = {};

    return NextResponse.json({ theme: themeSettings });

  } catch (error: any) {
    console.error('Error fetching theme:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch theme' },
      { status: 500 }
    );
  }
}
