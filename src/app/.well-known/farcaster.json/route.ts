import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET(request: NextRequest) {
  try {
    // Get the current domain from the request
    const protocol = request.headers.get('x-forwarded-proto') || 'https'
    const host = request.headers.get('host') || 'localhost:3000'
    const baseUrl = `${protocol}://${host}`
    
    // Load the static manifest
    const manifestPath = join(process.cwd(), 'public', '.well-known', 'farcaster.json')
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
    
    // Update URLs to use the current domain
    const updatedManifest = {
      ...manifest,
      miniapp: {
        ...manifest.miniapp,
        homeUrl: baseUrl,
        iconUrl: `${baseUrl}/icon.png`,
        splashImageUrl: `${baseUrl}/splash.png`,
        webhookUrl: `${baseUrl}/api/webhook`,
        screenshotUrls: [
          `${baseUrl}/screenshots/marketplace.png`,
          `${baseUrl}/screenshots/frames.png`,
          `${baseUrl}/screenshots/social.png`
        ],
        heroImageUrl: `${baseUrl}/hero.png`,
        ogImageUrl: `${baseUrl}/og-image.png`
      }
    }
    
    // Update the payload in accountAssociation to reflect the current domain
    if (host !== 'localhost:3000') {
      // Encode the domain in the payload
      const domainPayload = Buffer.from(JSON.stringify({ domain: host })).toString('base64')
      updatedManifest.accountAssociation.payload = domainPayload
    }
    
    return NextResponse.json(updatedManifest, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })
    
  } catch (error) {
    console.error('Error serving Farcaster manifest:', error)
    return NextResponse.json(
      { error: 'Failed to load manifest' }, 
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}