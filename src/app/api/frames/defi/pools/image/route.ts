import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const svg = `
<svg width="1200" height="1200" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0b0b0b;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#1a1a2e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0b0b0b;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="poolGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ec4899;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <rect width="1200" height="1200" fill="url(#bgGradient)"/>
  
  <text x="600" y="150" font-family="Arial, sans-serif" font-size="64" font-weight="bold" fill="white" text-anchor="middle">
    Liquidity Pools
  </text>
  
  <!-- Pool 1: ETH/USDC -->
  <g transform="translate(150, 250)">
    <rect width="900" height="140" rx="20" fill="rgba(139,92,246,0.1)" stroke="rgba(139,92,246,0.3)" stroke-width="2"/>
    <text x="30" y="50" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="white">ETH/USDC</text>
    <text x="30" y="90" font-family="Arial, sans-serif" font-size="24" fill="#9ca3af">TVL: $45.2M</text>
    <text x="30" y="120" font-family="Arial, sans-serif" font-size="24" fill="#9ca3af">Volume: $8.2M</text>
    <text x="850" y="70" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="#10b981" text-anchor="end">12.5%</text>
    <text x="850" y="110" font-family="Arial, sans-serif" font-size="20" fill="#9ca3af" text-anchor="end">APR</text>
  </g>
  
  <!-- Pool 2: WETH/USDC -->
  <g transform="translate(150, 420)">
    <rect width="900" height="140" rx="20" fill="rgba(139,92,246,0.1)" stroke="rgba(139,92,246,0.3)" stroke-width="2"/>
    <text x="30" y="50" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="white">WETH/USDC</text>
    <text x="30" y="90" font-family="Arial, sans-serif" font-size="24" fill="#9ca3af">TVL: $32.4M</text>
    <text x="30" y="120" font-family="Arial, sans-serif" font-size="24" fill="#9ca3af">Volume: $5.6M</text>
    <text x="850" y="70" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="#10b981" text-anchor="end">18.2%</text>
    <text x="850" y="110" font-family="Arial, sans-serif" font-size="20" fill="#9ca3af" text-anchor="end">APR</text>
  </g>
  
  <!-- Pool 3: DAI/USDC -->
  <g transform="translate(150, 590)">
    <rect width="900" height="140" rx="20" fill="rgba(139,92,246,0.1)" stroke="rgba(139,92,246,0.3)" stroke-width="2"/>
    <text x="30" y="50" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="white">DAI/USDC</text>
    <text x="30" y="90" font-family="Arial, sans-serif" font-size="24" fill="#9ca3af">TVL: $12.3M</text>
    <text x="30" y="120" font-family="Arial, sans-serif" font-size="24" fill="#9ca3af">Volume: $2.3M</text>
    <text x="850" y="70" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="#10b981" text-anchor="end">8.7%</text>
    <text x="850" y="110" font-family="Arial, sans-serif" font-size="20" fill="#9ca3af" text-anchor="end">APR</text>
  </g>
  
  <!-- Stats -->
  <g transform="translate(150, 800)">
    <text x="0" y="30" font-family="Arial, sans-serif" font-size="28" fill="#9ca3af">Total Pools TVL:</text>
    <text x="0" y="80" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white">$118M+</text>
  </g>
  
  <g transform="translate(600, 800)">
    <text x="0" y="30" font-family="Arial, sans-serif" font-size="28" fill="#9ca3af">Avg APR:</text>
    <text x="0" y="80" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="#10b981">13.1%</text>
  </g>
  
  <text x="600" y="1080" font-family="Arial, sans-serif" font-size="32" fill="#6b7280" text-anchor="middle">
    💧 Earn fees by providing liquidity
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
