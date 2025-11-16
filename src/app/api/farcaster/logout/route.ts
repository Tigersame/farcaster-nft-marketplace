// Farcaster OAuth - Logout and clear session
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
  // Clear the Farcaster token cookie
  const response = NextResponse.json({ success: true });
  
  response.headers.set(
    'Set-Cookie',
    serialize('farcaster_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0, // Expire immediately
    })
  );

  return response;
}
