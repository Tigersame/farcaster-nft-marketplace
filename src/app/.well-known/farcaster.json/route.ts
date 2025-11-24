import { NextResponse } from 'next/server'
import { MINIAPP_MANIFEST, validateManifest } from '@/lib/miniapp/manifest'

export async function GET() {
  // Validate manifest before returning
  const validation = validateManifest(MINIAPP_MANIFEST)
  
  if (!validation.valid) {
    console.error('Manifest validation failed:', validation.errors)
    // Return manifest anyway but log errors in development
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json(
        {
          error: 'Invalid manifest',
          errors: validation.errors,
          manifest: MINIAPP_MANIFEST
        },
        { status: 500 }
      )
    }
  }

  return NextResponse.json(MINIAPP_MANIFEST, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*'
    }
  })
}
