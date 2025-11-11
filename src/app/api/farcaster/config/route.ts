import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET(request: NextRequest) {
  try {
    // Get the current domain from the request
    const protocol = request.headers.get('x-forwarded-proto') || 'https'
    const host = request.headers.get('host') || 'localhost:3000'
    const baseUrl = `${protocol}://${host}`
    
    // Load Farcaster config
    const configPath = join(process.cwd(), 'farcaster.config.json')
    const farcasterConfig = JSON.parse(readFileSync(configPath, 'utf8'))
    
    // Update URLs to use the current domain
    const config = {
      ...farcasterConfig,
      miniapp: {
        ...farcasterConfig.miniapp,
        homeUrl: baseUrl,
        iconUrl: `${baseUrl}/icon.png`,
        splashImageUrl: `${baseUrl}/splash.png`,
        webhookUrl: `${baseUrl}/api/webhook`,
        screenshotUrls: [
          `${baseUrl}/screenshots/marketplace.png`,
          `${baseUrl}/screenshots/frames.png`,
          `${baseUrl}/screenshots/chat.png`
        ],
        heroImageUrl: `${baseUrl}/hero.png`,
        ogImageUrl: `${baseUrl}/og-image.png`
      }
    }
    
    return NextResponse.json(config, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600'
      }
    })
    
  } catch (error) {
    console.error('Error serving Farcaster config:', error)
    return NextResponse.json(
      { error: 'Failed to load configuration' }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Method not allowed' }, 
    { status: 405 }
  )
}