import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  // Generate a dynamic OG image for the DeFi frame
  const svg = `
<svg width="1200" height="1200" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0b0b0b;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#1a1a2e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0b0b0b;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#8b5cf6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ec4899;stop-opacity:1" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="10" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="1200" fill="url(#bgGradient)"/>
  
  <!-- Glow effects -->
  <circle cx="300" cy="300" r="300" fill="#3b82f6" opacity="0.1" filter="url(#glow)"/>
  <circle cx="900" cy="900" r="300" fill="#ec4899" opacity="0.1" filter="url(#glow)"/>
  
  <!-- Main Icon -->
  <rect x="450" y="250" width="300" height="300" rx="60" fill="url(#iconGradient)" filter="url(#glow)"/>
  
  <!-- Swap Icon -->
  <g transform="translate(600, 400)">
    <!-- Arrow Up -->
    <path d="M -60 -30 L -60 30 M -60 -30 L -80 -10 M -60 -30 L -40 -10" 
          stroke="white" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <!-- Arrow Down -->
    <path d="M 60 30 L 60 -30 M 60 30 L 80 10 M 60 30 L 40 10" 
          stroke="white" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </g>
  
  <!-- Title -->
  <text x="600" y="650" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="white" text-anchor="middle">
    Base DeFi Hub
  </text>
  
  <!-- Subtitle -->
  <text x="600" y="720" font-family="Arial, sans-serif" font-size="36" fill="#9ca3af" text-anchor="middle">
    Trade • Earn • Grow
  </text>
  
  <!-- Stats Cards -->
  <g transform="translate(200, 820)">
    <!-- TVL Card -->
    <rect x="0" y="0" width="240" height="120" rx="20" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
    <text x="120" y="50" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white" text-anchor="middle">$507M+</text>
    <text x="120" y="85" font-family="Arial, sans-serif" font-size="18" fill="#9ca3af" text-anchor="middle">Total TVL</text>
  </g>
  
  <g transform="translate(480, 820)">
    <!-- Volume Card -->
    <rect x="0" y="0" width="240" height="120" rx="20" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
    <text x="120" y="50" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white" text-anchor="middle">$56M+</text>
    <text x="120" y="85" font-family="Arial, sans-serif" font-size="18" fill="#9ca3af" text-anchor="middle">24h Volume</text>
  </g>
  
  <g transform="translate(760, 820)">
    <!-- Tokens Card -->
    <rect x="0" y="0" width="240" height="120" rx="20" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
    <text x="120" y="50" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white" text-anchor="middle">8+</text>
    <text x="120" y="85" font-family="Arial, sans-serif" font-size="18" fill="#9ca3af" text-anchor="middle">Tokens</text>
  </g>
  
  <!-- Footer -->
  <text x="600" y="1080" font-family="Arial, sans-serif" font-size="24" fill="#6b7280" text-anchor="middle">
    Powered by Base Network
  </text>
</svg>
  `

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
