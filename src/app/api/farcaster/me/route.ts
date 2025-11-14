// Farcaster OAuth - Get current user profile
import { NextRequest, NextResponse } from 'next/server';
import cookie from 'cookie';

export async function GET(request: NextRequest) {
  // Parse cookies from request
  const cookies = cookie.parse(request.headers.get('cookie') || '');
  const token = cookies.farcaster_token;

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    // Fetch user profile from Farcaster provider
    // Replace with actual provider profile endpoint (Neynar or Warpcast)
    const profileResponse = await fetch('https://neynar.com/api/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!profileResponse.ok) {
      // Token might be expired or invalid
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const profile = await profileResponse.json();
    
    // Return user profile
    // Expected format: { username, displayName, avatar, fid, bio, etc. }
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching Farcaster profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}
