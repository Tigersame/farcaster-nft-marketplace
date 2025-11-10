// Authentication API route with SIWE support
import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

// Create viem client for signature verification
const client = createPublicClient({ 
  chain: base, 
  transport: http() 
});

// Store nonces temporarily (in production, use Redis or a database)
const nonces = new Set<string>();

// Cleanup old nonces every hour
setInterval(() => {
  nonces.clear();
}, 60 * 60 * 1000);

/**
 * POST /api/auth/verify
 * Verify SIWE signature and create session
 */
export async function POST(request: NextRequest) {
  try {
    const { address, message, signature } = await request.json();

    if (!address || !message || !signature) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Extract and validate nonce from SIWE message
    const nonceMatch = message.match(/Nonce: (\w+)/);
    const nonce = nonceMatch?.[1];
    
    if (!nonce || !nonces.has(nonce)) {
      return NextResponse.json(
        { error: 'Invalid or expired nonce' },
        { status: 401 }
      );
    }

    // Remove nonce to prevent reuse (single-use nonce)
    nonces.delete(nonce);

    // Verify the signature using viem
    const isValid = await client.verifyMessage({ 
      address: address as `0x${string}`, 
      message, 
      signature: signature as `0x${string}` 
    });
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Create session token (in production, use JWT with proper secret)
    const sessionToken = Buffer.from(
      `${address}:${Date.now()}:${Math.random()}`
    ).toString('base64');
    
    const response = NextResponse.json({ 
      ok: true, 
      address, 
      sessionToken 
    });
    
    // Set secure session cookie
    response.cookies.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    
    return response;
  } catch (error: any) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/auth/verify
 * Generate a new nonce for SIWE authentication
 */
export async function GET() {
  try {
    // Generate cryptographically secure random nonce
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    const nonce = Array.from(array, byte => 
      byte.toString(16).padStart(2, '0')
    ).join('');
    
    // Store nonce for verification
    nonces.add(nonce);
    
    // Auto-cleanup after 5 minutes
    setTimeout(() => {
      nonces.delete(nonce);
    }, 5 * 60 * 1000);
    
    return NextResponse.json({ nonce });
  } catch (error: any) {
    console.error('Nonce generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate nonce' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/auth/verify
 * Logout and clear session
 */
export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  
  // Clear session cookie
  response.cookies.delete('session');
  
  return response;
}
