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
  </defs>
  
  <rect width="1200" height="1200" fill="url(#bgGradient)"/>
  
  <text x="600" y="150" font-family="Arial, sans-serif" font-size="64" font-weight="bold" fill="white" text-anchor="middle">
    Base Token List
  </text>
  
  <!-- Token Rows -->
  <!-- ETH -->
  <g transform="translate(150, 250)">
    <rect width="900" height="100" rx="20" fill="rgba(59,130,246,0.1)" stroke="rgba(59,130,246,0.3)" stroke-width="2"/>
    <circle cx="50" cy="50" r="25" fill="#627eea"/>
    <text x="100" y="60" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white">ETH</text>
    <text x="850" y="45" font-family="Arial, sans-serif" font-size="28" fill="white" text-anchor="end">$3,245.67</text>
    <text x="850" y="80" font-family="Arial, sans-serif" font-size="20" fill="#10b981" text-anchor="end">+2.34%</text>
  </g>
  
  <!-- USDC -->
  <g transform="translate(150, 370)">
    <rect width="900" height="100" rx="20" fill="rgba(59,130,246,0.1)" stroke="rgba(59,130,246,0.3)" stroke-width="2"/>
    <circle cx="50" cy="50" r="25" fill="#2775ca"/>
    <text x="100" y="60" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white">USDC</text>
    <text x="850" y="45" font-family="Arial, sans-serif" font-size="28" fill="white" text-anchor="end">$1.00</text>
    <text x="850" y="80" font-family="Arial, sans-serif" font-size="20" fill="#10b981" text-anchor="end">+0.01%</text>
  </g>
  
  <!-- DAI -->
  <g transform="translate(150, 490)">
    <rect width="900" height="100" rx="20" fill="rgba(59,130,246,0.1)" stroke="rgba(59,130,246,0.3)" stroke-width="2"/>
    <circle cx="50" cy="50" r="25" fill="#f5ac37"/>
    <text x="100" y="60" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white">DAI</text>
    <text x="850" y="45" font-family="Arial, sans-serif" font-size="28" fill="white" text-anchor="end">$1.00</text>
    <text x="850" y="80" font-family="Arial, sans-serif" font-size="20" fill="#ef4444" text-anchor="end">-0.02%</text>
  </g>
  
  <!-- WETH -->
  <g transform="translate(150, 610)">
    <rect width="900" height="100" rx="20" fill="rgba(59,130,246,0.1)" stroke="rgba(59,130,246,0.3)" stroke-width="2"/>
    <circle cx="50" cy="50" r="25" fill="#627eea"/>
    <text x="100" y="60" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white">WETH</text>
    <text x="850" y="45" font-family="Arial, sans-serif" font-size="28" fill="white" text-anchor="end">$3,245.67</text>
    <text x="850" y="80" font-family="Arial, sans-serif" font-size="20" fill="#10b981" text-anchor="end">+2.34%</text>
  </g>
  
  <!-- cbETH -->
  <g transform="translate(150, 730)">
    <rect width="900" height="100" rx="20" fill="rgba(59,130,246,0.1)" stroke="rgba(59,130,246,0.3)" stroke-width="2"/>
    <circle cx="50" cy="50" r="25" fill="#0052ff"/>
    <text x="100" y="60" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white">cbETH</text>
    <text x="850" y="45" font-family="Arial, sans-serif" font-size="28" fill="white" text-anchor="end">$3,198.45</text>
    <text x="850" y="80" font-family="Arial, sans-serif" font-size="20" fill="#10b981" text-anchor="end">+2.21%</text>
  </g>
  
  <!-- Stats Footer -->
  <g transform="translate(150, 900)">
    <rect width="900" height="120" rx="20" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.3)" stroke-width="2"/>
    <text x="450" y="50" font-family="Arial, sans-serif" font-size="28" fill="#9ca3af" text-anchor="middle">Total Market Cap</text>
    <text x="450" y="95" font-family="Arial, sans-serif" font-size="44" font-weight="bold" fill="white" text-anchor="middle">$389B+</text>
  </g>
  
  <text x="600" y="1080" font-family="Arial, sans-serif" font-size="28" fill="#6b7280" text-anchor="middle">
    💎 8+ tokens available for trading
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
