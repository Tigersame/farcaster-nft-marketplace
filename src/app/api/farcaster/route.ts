import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const check = searchParams.get('check')
  
  if (check === 'manifest') {
    try {
      // Test if our manifest is accessible
      const protocol = request.headers.get('x-forwarded-proto') || 'https'
      const host = request.headers.get('host') || 'localhost:3000'
      const manifestUrl = `${protocol}://${host}/.well-known/farcaster.json`
      
      const manifestResponse = await fetch(manifestUrl)
      const manifest = await manifestResponse.json()
      
      return NextResponse.json({
        status: 'valid',
        manifest: manifest,
        manifestUrl: manifestUrl,
        checks: {
          manifestAccessible: manifestResponse.ok,
          hasAccountAssociation: !!manifest.accountAssociation,
          hasBaseBuilder: !!manifest.baseBuilder,
          hasMiniapp: !!manifest.miniapp,
          hasRequiredFields: !!(
            manifest.miniapp?.name &&
            manifest.miniapp?.version &&
            manifest.miniapp?.homeUrl &&
            manifest.miniapp?.iconUrl &&
            manifest.miniapp?.splashImageUrl &&
            manifest.miniapp?.primaryCategory
          )
        },
        urls: {
          home: manifest.miniapp?.homeUrl,
          icon: manifest.miniapp?.iconUrl,
          splash: manifest.miniapp?.splashImageUrl,
          webhook: manifest.miniapp?.webhookUrl,
          hero: manifest.miniapp?.heroImageUrl,
          ogImage: manifest.miniapp?.ogImageUrl,
          screenshots: manifest.miniapp?.screenshotUrls
        }
      })
    } catch (error) {
      return NextResponse.json({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        manifestUrl: `${request.headers.get('x-forwarded-proto') || 'https'}://${request.headers.get('host')}/.well-known/farcaster.json`
      }, { status: 500 })
    }
  }
  
  // Default validation response
  return NextResponse.json({
    service: 'FarcastSea Farcaster Integration',
    status: 'active',
    timestamp: new Date().toISOString(),
    endpoints: {
      manifest: '/.well-known/farcaster.json',
      webhook: '/api/webhook',
      frames: '/api/frames/nft/[tokenId]',
      images: '/api/images',
      screenshots: '/api/screenshots'
    },
    features: [
      'Farcaster Frames Integration',
      'Dynamic Asset Generation', 
      'Webhook Event Handling',
      'Base Network Integration',
      'ERC20 Gas Payments',
      'Social Trading Features'
    ],
    usage: {
      checkManifest: '?check=manifest',
      testWebhook: 'POST /api/webhook',
      generateIcon: '/api/images?type=icon&size=512',
      getScreenshot: '/api/screenshots?name=marketplace'
    }
  })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({
    message: 'Farcaster integration is ready for testing!',
    status: 'active',
    timestamp: new Date().toISOString()
  })
}