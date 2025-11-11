import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name') || 'marketplace'
  
  let svg = ''
  
  switch (name) {
    case 'marketplace':
      svg = generateMarketplaceSVG()
      break
    case 'frames':
      svg = generateFramesSVG()
      break
    case 'social':
      svg = generateSocialSVG()
      break
    default:
      svg = generateMarketplaceSVG()
  }
  
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400'
    }
  })
}

function generateMarketplaceSVG() {
  return `<svg width="1284" height="2778" viewBox="0 0 1284 2778" xmlns="http://www.w3.org/2000/svg">
    <rect width="1284" height="2778" fill="#0f172a"/>
    
    <!-- Header -->
    <rect x="0" y="0" width="1284" height="120" fill="#1e293b"/>
    <text x="640" y="75" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white" text-anchor="middle">🌊 FarcastSea</text>
    
    <!-- Search Bar -->
    <rect x="60" y="160" width="1164" height="60" rx="30" fill="#334155" stroke="#64748b" stroke-width="2"/>
    <text x="90" y="200" font-family="Arial, sans-serif" font-size="20" fill="#94a3b8">Search NFTs...</text>
    
    <!-- NFT Grid -->
    <!-- Row 1 -->
    <rect x="60" y="280" width="280" height="320" rx="20" fill="#1e293b" stroke="#334155" stroke-width="2"/>
    <rect x="80" y="300" width="240" height="240" rx="10" fill="#6366f1"/>
    <text x="200" y="430" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="white" text-anchor="middle">🎨</text>
    <text x="200" y="570" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle">Genesis #001</text>
    
    <rect x="380" y="280" width="280" height="320" rx="20" fill="#1e293b" stroke="#334155" stroke-width="2"/>
    <rect x="400" y="300" width="240" height="240" rx="10" fill="#8b5cf6"/>
    <text x="520" y="430" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="white" text-anchor="middle">💎</text>
    <text x="520" y="570" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle">Base Builder</text>
    
    <rect x="700" y="280" width="280" height="320" rx="20" fill="#1e293b" stroke="#334155" stroke-width="2"/>
    <rect x="720" y="300" width="240" height="240" rx="10" fill="#ec4899"/>
    <text x="840" y="430" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="white" text-anchor="middle">🚀</text>
    <text x="840" y="570" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle">Cosmic Art</text>
    
    <!-- Row 2 -->
    <rect x="60" y="640" width="280" height="320" rx="20" fill="#1e293b" stroke="#334155" stroke-width="2"/>
    <rect x="80" y="660" width="240" height="240" rx="10" fill="#10b981"/>
    <text x="200" y="790" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="white" text-anchor="middle">🎭</text>
    <text x="200" y="930" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle">Mask Collection</text>
    
    <rect x="380" y="640" width="280" height="320" rx="20" fill="#1e293b" stroke="#334155" stroke-width="2"/>
    <rect x="400" y="660" width="240" height="240" rx="10" fill="#f59e0b"/>
    <text x="520" y="790" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="white" text-anchor="middle">⚡</text>
    <text x="520" y="930" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle">Lightning NFT</text>
    
    <rect x="700" y="640" width="280" height="320" rx="20" fill="#1e293b" stroke="#334155" stroke-width="2"/>
    <rect x="720" y="660" width="240" height="240" rx="10" fill="#ef4444"/>
    <text x="840" y="790" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="white" text-anchor="middle">🔥</text>
    <text x="840" y="930" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle">Fire Element</text>
    
    <!-- Stats Bar -->
    <rect x="60" y="1000" width="1164" height="100" rx="20" fill="#1e293b" stroke="#334155" stroke-width="2"/>
    <text x="200" y="1040" font-family="Arial, sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Total Volume</text>
    <text x="200" y="1070" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="white" text-anchor="middle">1,234 ETH</text>
    
    <text x="640" y="1040" font-family="Arial, sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Active Listings</text>
    <text x="640" y="1070" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="white" text-anchor="middle">89</text>
    
    <text x="1080" y="1040" font-family="Arial, sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Floor Price</text>
    <text x="1080" y="1070" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="white" text-anchor="middle">0.5 ETH</text>
    
    <!-- Bottom Navigation -->
    <rect x="0" y="2658" width="1284" height="120" fill="#1e293b"/>
    <text x="200" y="2730" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle">🏪 Browse</text>
    <text x="500" y="2730" font-family="Arial, sans-serif" font-size="16" fill="#6366f1" text-anchor="middle">💼 Portfolio</text>
    <text x="800" y="2730" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle">⚙️ Settings</text>
  </svg>`
}

function generateFramesSVG() {
  return `<svg width="1284" height="2778" viewBox="0 0 1284 2778" xmlns="http://www.w3.org/2000/svg">
    <rect width="1284" height="2778" fill="#0f172a"/>
    
    <!-- Header -->
    <rect x="0" y="0" width="1284" height="120" fill="#1e293b"/>
    <text x="640" y="75" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white" text-anchor="middle">🖼️ Farcaster Frames</text>
    
    <!-- Frame Preview -->
    <rect x="60" y="180" width="1164" height="800" rx="20" fill="#1e293b" stroke="#334155" stroke-width="2"/>
    
    <!-- Frame Image -->
    <rect x="100" y="220" width="1084" height="600" rx="15" fill="url(#frameGrad)"/>
    <defs>
      <linearGradient id="frameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
      </linearGradient>
    </defs>
    
    <!-- NFT in Frame -->
    <rect x="442" y="320" width="400" height="400" rx="20" fill="rgba(255,255,255,0.1)"/>
    <text x="642" y="540" font-family="Arial, sans-serif" font-size="64" fill="white" text-anchor="middle">🎨</text>
    
    <!-- Frame Title -->
    <text x="642" y="280" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white" text-anchor="middle">Farcaster Genesis #001</text>
    <text x="642" y="780" font-family="Arial, sans-serif" font-size="18" fill="#e2e8f0" text-anchor="middle">2.5 ETH • 💎 Rare</text>
    
    <!-- Frame Buttons -->
    <rect x="120" y="860" width="240" height="80" rx="15" fill="#10b981"/>
    <text x="240" y="910" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="white" text-anchor="middle">💳 Buy</text>
    
    <rect x="380" y="860" width="240" height="80" rx="15" fill="#f59e0b"/>
    <text x="500" y="910" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="white" text-anchor="middle">❤️ Like</text>
    
    <rect x="640" y="860" width="240" height="80" rx="15" fill="#6366f1"/>
    <text x="760" y="910" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="white" text-anchor="middle">👁️ View</text>
    
    <rect x="900" y="860" width="240" height="80" rx="15" fill="#8b5cf6"/>
    <text x="1020" y="910" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="white" text-anchor="middle">🔄 Share</text>
    
    <!-- Social Feed -->
    <text x="640" y="1080" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle">Social Activity</text>
    
    <!-- Activity Item 1 -->
    <rect x="60" y="1120" width="1164" height="100" rx="15" fill="#1e293b"/>
    <circle cx="130" cy="1170" r="30" fill="#6366f1"/>
    <text x="130" y="1180" font-family="Arial, sans-serif" font-size="20" fill="white" text-anchor="middle">👩‍🎨</text>
    <text x="200" y="1160" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="white">Alice bought Genesis #001</text>
    <text x="200" y="1185" font-family="Arial, sans-serif" font-size="14" fill="#94a3b8">2 minutes ago • 2.5 ETH</text>
    
    <!-- Activity Item 2 -->
    <rect x="60" y="1240" width="1164" height="100" rx="15" fill="#1e293b"/>
    <circle cx="130" cy="1290" r="30" fill="#8b5cf6"/>
    <text x="130" y="1300" font-family="Arial, sans-serif" font-size="20" fill="white" text-anchor="middle">💎</text>
    <text x="200" y="1280" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="white">Bob liked Cosmic Art #42</text>
    <text x="200" y="1305" font-family="Arial, sans-serif" font-size="14" fill="#94a3b8">5 minutes ago</text>
    
    <!-- Activity Item 3 -->
    <rect x="60" y="1360" width="1164" height="100" rx="15" fill="#1e293b"/>
    <circle cx="130" cy="1410" r="30" fill="#ec4899"/>
    <text x="130" y="1420" font-family="Arial, sans-serif" font-size="20" fill="white" text-anchor="middle">🚀</text>
    <text x="200" y="1400" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="white">Charlie shared Base Builder #15</text>
    <text x="200" y="1425" font-family="Arial, sans-serif" font-size="14" fill="#94a3b8">8 minutes ago</text>
    
    <!-- Frame Integration Info -->
    <rect x="60" y="1520" width="1164" height="200" rx="20" fill="rgba(99, 102, 241, 0.1)" stroke="#6366f1" stroke-width="2"/>
    <text x="640" y="1570" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#6366f1" text-anchor="middle">🔗 Native Farcaster Integration</text>
    <text x="640" y="1610" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle">Trade NFTs directly in your social feed</text>
    <text x="640" y="1640" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle">No need to leave Farcaster!</text>
    <text x="640" y="1680" font-family="Arial, sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">✨ Instant transactions • 🔒 Secure frames • 💬 Social verification</text>
  </svg>`
}

function generateSocialSVG() {
  return `<svg width="1284" height="2778" viewBox="0 0 1284 2778" xmlns="http://www.w3.org/2000/svg">
    <rect width="1284" height="2778" fill="#0f172a"/>
    
    <!-- Header -->
    <rect x="0" y="0" width="1284" height="120" fill="#1e293b"/>
    <text x="640" y="75" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white" text-anchor="middle">💬 Social Trading</text>
    
    <!-- Chat Interface -->
    <rect x="60" y="180" width="1164" height="1000" rx="20" fill="#1e293b" stroke="#334155" stroke-width="2"/>
    
    <!-- Chat Header -->
    <rect x="60" y="180" width="1164" height="80" rx="20" fill="#334155"/>
    <circle cx="140" cy="220" r="25" fill="#6366f1"/>
    <text x="140" y="230" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle">🤖</text>
    <text x="200" y="230" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="white">FarcastSea Assistant</text>
    <text x="200" y="250" font-family="Arial, sans-serif" font-size="14" fill="#94a3b8">Online • Ready to help with NFT trading</text>
    
    <!-- Chat Messages -->
    <!-- Bot Message 1 -->
    <rect x="100" y="300" width="800" height="80" rx="15" fill="#334155"/>
    <text x="130" y="330" font-family="Arial, sans-serif" font-size="16" fill="white">hey! 👋 welcome to farcastsea</text>
    <text x="130" y="355" font-family="Arial, sans-serif" font-size="16" fill="white">wanna check out some hot nfts? or maybe create your own? 🎨</text>
    
    <!-- User Message 1 -->
    <rect x="384" y="400" width="800" height="60" rx="15" fill="#6366f1"/>
    <text x="414" y="430" font-family="Arial, sans-serif" font-size="16" fill="white">Show me trending NFTs on Base!</text>
    <text x="414" y="450" font-family="Arial, sans-serif" font-size="12" fill="#c7d2fe">You • Just now</text>
    
    <!-- Bot Message 2 -->
    <rect x="100" y="480" width="900" height="100" rx="15" fill="#334155"/>
    <text x="130" y="510" font-family="Arial, sans-serif" font-size="16" fill="white">awesome choice! 🔥 here are the hottest nfts right now:</text>
    <text x="130" y="535" font-family="Arial, sans-serif" font-size="16" fill="white">• genesis #001 - 2.5 eth (🔥 trending)</text>
    <text x="130" y="560" font-family="Arial, sans-serif" font-size="16" fill="white">• base builder badge - 1.0 eth (⚡ fast rising)</text>
    
    <!-- Quick Actions -->
    <rect x="100" y="600" width="1084" height="120" rx="15" fill="rgba(99, 102, 241, 0.1)" stroke="#6366f1" stroke-width="1"/>
    <text x="130" y="630" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#6366f1">Quick Actions:</text>
    
    <rect x="130" y="650" width="200" height="50" rx="10" fill="#10b981"/>
    <text x="230" y="680" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white" text-anchor="middle">💳 Buy Genesis #001</text>
    
    <rect x="350" y="650" width="200" height="50" rx="10" fill="#f59e0b"/>
    <text x="450" y="680" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white" text-anchor="middle">👀 View Collection</text>
    
    <rect x="570" y="650" width="200" height="50" rx="10" fill="#8b5cf6"/>
    <text x="670" y="680" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white" text-anchor="middle">🎨 Create NFT</text>
    
    <rect x="790" y="650" width="200" height="50" rx="10" fill="#ec4899"/>
    <text x="890" y="680" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white" text-anchor="middle">📊 Price Alerts</text>
    
    <!-- User Message 2 -->
    <rect x="384" y="740" width="800" height="60" rx="15" fill="#6366f1"/>
    <text x="414" y="770" font-family="Arial, sans-serif" font-size="16" fill="white">Can I pay with USDC instead of ETH?</text>
    <text x="414" y="790" font-family="Arial, sans-serif" font-size="12" fill="#c7d2fe">You • Just now</text>
    
    <!-- Bot Message 3 -->
    <rect x="100" y="820" width="950" height="120" rx="15" fill="#334155"/>
    <text x="130" y="850" font-family="Arial, sans-serif" font-size="16" fill="white">absolutely! 💫 we support erc20 gas payments</text>
    <text x="130" y="875" font-family="Arial, sans-serif" font-size="16" fill="white">you can use usdc, usdt, or dai for both purchase and gas fees</text>
    <text x="130" y="900" font-family="Arial, sans-serif" font-size="16" fill="white">super convenient, no need to hold eth! ⚡</text>
    <text x="130" y="925" font-family="Arial, sans-serif" font-size="14" fill="#94a3b8">powered by base account abstraction 🔧</text>
    
    <!-- ERC20 Payment Demo -->
    <rect x="100" y="960" width="1084" height="200" rx="15" fill="rgba(16, 185, 129, 0.1)" stroke="#10b981" stroke-width="2"/>
    <text x="640" y="990" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#10b981" text-anchor="middle">💳 ERC20 Gas Payment Demo</text>
    
    <rect x="150" y="1010" width="300" height="60" rx="10" fill="#334155"/>
    <text x="300" y="1035" font-family="Arial, sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Select Payment Token</text>
    <text x="300" y="1055" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="white" text-anchor="middle">USDC ▼</text>
    
    <rect x="480" y="1010" width="300" height="60" rx="10" fill="#334155"/>
    <text x="630" y="1035" font-family="Arial, sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Gas + NFT Cost</text>
    <text x="630" y="1055" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="white" text-anchor="middle">2,503.45 USDC</text>
    
    <rect x="810" y="1010" width="300" height="60" rx="10" fill="#10b981"/>
    <text x="960" y="1045" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="white" text-anchor="middle">✅ Pay with USDC</text>
    
    <text x="640" y="1110" font-family="Arial, sans-serif" font-size="14" fill="#10b981" text-anchor="middle">✨ One-click payment • No ETH required • Instant settlement</text>
    <text x="640" y="1135" font-family="Arial, sans-serif" font-size="12" fill="#6b7280" text-anchor="middle">Gas fees automatically calculated and paid in your chosen token</text>
    
    <!-- Input Area -->
    <rect x="60" y="1220" width="1164" height="80" rx="20" fill="#334155"/>
    <text x="100" y="1270" font-family="Arial, sans-serif" font-size="16" fill="#94a3b8">Type your message...</text>
    <rect x="1124" y="1240" width="80" height="40" rx="20" fill="#6366f1"/>
    <text x="1164" y="1265" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white" text-anchor="middle">Send</text>
    
    <!-- Social Features -->
    <rect x="60" y="1340" width="1164" height="300" rx="20" fill="rgba(139, 92, 246, 0.1)" stroke="#8b5cf6" stroke-width="2"/>
    <text x="640" y="1380" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#8b5cf6" text-anchor="middle">🌟 Social Trading Features</text>
    
    <text x="320" y="1420" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="white" text-anchor="middle">💬 Live Chat Support</text>
    <text x="320" y="1445" font-family="Arial, sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">AI assistant + human experts</text>
    
    <text x="640" y="1420" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="white" text-anchor="middle">🎯 Smart Recommendations</text>
    <text x="640" y="1445" font-family="Arial, sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Personalized NFT suggestions</text>
    
    <text x="960" y="1420" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="white" text-anchor="middle">📊 Real-time Analytics</text>
    <text x="960" y="1445" font-family="Arial, sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Live market data & trends</text>
    
    <text x="320" y="1490" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="white" text-anchor="middle">🔔 Price Alerts</text>
    <text x="320" y="1515" font-family="Arial, sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Never miss a good deal</text>
    
    <text x="640" y="1490" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="white" text-anchor="middle">🤝 Social Verification</text>
    <text x="640" y="1515" font-family="Arial, sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Community-driven trust</text>
    
    <text x="960" y="1490" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="white" text-anchor="middle">⚡ Instant Settlements</text>
    <text x="960" y="1515" font-family="Arial, sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Fast Base network transactions</text>
    
    <text x="640" y="1570" font-family="Arial, sans-serif" font-size="16" fill="#a855f7" text-anchor="middle">The future of social NFT trading is here! 🚀</text>
    <text x="640" y="1600" font-family="Arial, sans-serif" font-size="14" fill="#6b7280" text-anchor="middle">Powered by XMTP • Farcaster • Base Network</text>
  </svg>`
}