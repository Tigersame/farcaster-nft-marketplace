// Farcaster OAuth - Handle callback and exchange code for token
import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/?error=missing_code', request.url));
  }

  const clientId = process.env.FARCASTER_CLIENT_ID;
  const clientSecret = process.env.FARCASTER_CLIENT_SECRET;
  const tokenUrl = process.env.FARCASTER_OAUTH_TOKEN || 'https://neynar.com/oauth/token';
  const callbackUrl = process.env.FARCASTER_CALLBACK || 'http://localhost:3000/api/farcaster/callback';

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL('/?error=oauth_not_configured', request.url));
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: callbackUrl,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', errorText);
      return NextResponse.redirect(new URL('/?error=token_exchange_failed', request.url));
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const expiresIn = tokenData.expires_in || 60 * 60 * 24 * 30; // 30 days default

    if (!accessToken) {
      return NextResponse.redirect(new URL('/?error=no_access_token', request.url));
    }

    // Optionally fetch user profile immediately
    let profileData = null;
    try {
      const profileResponse = await fetch('https://neynar.com/api/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (profileResponse.ok) {
        profileData = await profileResponse.json();
      }
    } catch (e) {
      console.log('Could not fetch profile immediately:', e);
    }

    // Create response and set httpOnly cookie
    const response = NextResponse.redirect(new URL('/', request.url));
    
    response.headers.set(
      'Set-Cookie',
      serialize('farcaster_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: expiresIn,
      })
    );

    return response;
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(new URL('/?error=oauth_failed', request.url));
  }
}
