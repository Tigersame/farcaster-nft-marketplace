import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'icon'
  const size = searchParams.get('size') || '512'
  
  // Generate SVG based on type
  let svg = ''
  
  switch (type) {
    case 'icon':
      svg = generateIconSVG(parseInt(size))
      break
    case 'splash':
      svg = generateSplashSVG()
      break
    case 'hero':
      svg = generateHeroSVG()
      break
    case 'og':
      svg = generateOGImageSVG()
      break
    default:
      svg = generateIconSVG(parseInt(size))
  }
  
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400'
    }
  })
}

function generateIconSVG(size: number) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#grad1)"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.4}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">⚡</text>
    <text x="50%" y="75%" font-family="Arial, sans-serif" font-size="${size * 0.08}" fill="white" text-anchor="middle" dominant-baseline="central">FarcastSea</text>
  </svg>`
}

function generateSplashSVG() {
  return `<svg width="390" height="844" viewBox="0 0 390 844" xmlns="http://www.w3.org/2000/svg">
    <rect width="390" height="844" fill="#1a1a2e"/>
    <defs>
      <linearGradient id="splashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
      </linearGradient>
    </defs>
    <circle cx="195" cy="300" r="80" fill="url(#splashGrad)"/>
    <text x="195" y="310" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle">⚡</text>
    <text x="195" y="450" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white" text-anchor="middle">FarcastSea</text>
    <text x="195" y="480" font-family="Arial, sans-serif" font-size="16" fill="#a855f7" text-anchor="middle">NFT Marketplace</text>
    <text x="195" y="550" font-family="Arial, sans-serif" font-size="14" fill="#9ca3af" text-anchor="middle">Secure • Fast • Social</text>
  </svg>`
}

function generateHeroSVG() {
  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="#1a1a2e"/>
    <defs>
      <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#6366f1;stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:0.8" />
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="1200" height="630" fill="url(#heroGrad)"/>
    <text x="600" y="250" font-family="Arial, sans-serif" font-size="64" font-weight="bold" fill="white" text-anchor="middle">🌊 FarcastSea</text>
    <text x="600" y="320" font-family="Arial, sans-serif" font-size="28" fill="white" text-anchor="middle">Secure NFT Marketplace on Base</text>
    <text x="600" y="380" font-family="Arial, sans-serif" font-size="20" fill="#e2e8f0" text-anchor="middle">✨ Farcaster Frames • 🔒 Hack-Proof • ⚡ ERC20 Gas Payments</text>
    <rect x="450" y="450" width="300" height="60" rx="30" fill="rgba(255,255,255,0.2)" stroke="white" stroke-width="2"/>
    <text x="600" y="490" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white" text-anchor="middle">Start Trading</text>
  </svg>`
}

function generateOGImageSVG() {
  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="#0f172a"/>
    <defs>
      <linearGradient id="ogGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#7c3aed;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#db2777;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect x="50" y="50" width="1100" height="530" rx="20" fill="url(#ogGrad)"/>
    <text x="600" y="200" font-family="Arial, sans-serif" font-size="56" font-weight="bold" fill="white" text-anchor="middle">FarcastSea</text>
    <text x="600" y="280" font-family="Arial, sans-serif" font-size="32" fill="white" text-anchor="middle">Hack-Proof NFT Marketplace</text>
    <text x="600" y="350" font-family="Arial, sans-serif" font-size="24" fill="#e2e8f0" text-anchor="middle">🔒 Enterprise Security • ⚡ Base Network • 🎭 Farcaster Frames</text>
    <text x="600" y="450" font-family="Arial, sans-serif" font-size="20" fill="#cbd5e1" text-anchor="middle">Trade NFTs with innovative ERC20 gas payments</text>
  </svg>`
}