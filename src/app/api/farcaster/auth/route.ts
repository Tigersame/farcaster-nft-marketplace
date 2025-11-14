// Farcaster OAuth - Redirect to authorization endpoint
import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.FARCASTER_CLIENT_ID;
  const redirect = encodeURIComponent(process.env.FARCASTER_CALLBACK || 'http://localhost:3000/api/farcaster/callback');
  const scope = encodeURIComponent(process.env.FARCASTER_SCOPE || 'read_profile');
  const authorizeUrl = process.env.FARCASTER_OAUTH_AUTHORIZE || 'https://neynar.com/oauth/authorize';

  if (!clientId) {
    return NextResponse.json(
      { error: 'Farcaster OAuth not configured. Please set FARCASTER_CLIENT_ID in .env.local' },
      { status: 500 }
    );
  }

  // Build authorization URL
  const authUrl = `${authorizeUrl}?response_type=code&client_id=${clientId}&redirect_uri=${redirect}&scope=${scope}`;

  // Redirect to Farcaster provider
  return NextResponse.redirect(authUrl);
}
