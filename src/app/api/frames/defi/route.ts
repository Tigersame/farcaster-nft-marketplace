import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://farcastmints.com'

  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Base DeFi Hub - Trade Tokens</title>
    
    <!-- Farcaster Frame Meta Tags -->
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${baseUrl}/api/frames/defi/image" />
    <meta property="fc:frame:image:aspect_ratio" content="1:1" />
    <meta property="fc:frame:button:1" content="🔄 Swap Tokens" />
    <meta property="fc:frame:button:1:action" content="link" />
    <meta property="fc:frame:button:1:target" content="${baseUrl}/defi" />
    <meta property="fc:frame:button:2" content="💰 View Pools" />
    <meta property="fc:frame:button:2:action" content="post" />
    <meta property="fc:frame:button:2:target" content="${baseUrl}/api/frames/defi/pools" />
    <meta property="fc:frame:button:3" content="📊 Token List" />
    <meta property="fc:frame:button:3:action" content="post" />
    <meta property="fc:frame:button:3:target" content="${baseUrl}/api/frames/defi/tokens" />
    
    <!-- OpenGraph Tags -->
    <meta property="og:title" content="Base DeFi Hub" />
    <meta property="og:description" content="Trade tokens, provide liquidity, and earn rewards on Base network" />
    <meta property="og:image" content="${baseUrl}/api/frames/defi/image" />
    
    <!-- Twitter Card Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Base DeFi Hub" />
    <meta name="twitter:description" content="Trade tokens on Base network" />
    <meta name="twitter:image" content="${baseUrl}/api/frames/defi/image" />
  </head>
  <body>
    <h1>Base DeFi Hub</h1>
    <p>Trade tokens, provide liquidity, and earn rewards on Base network</p>
  </body>
</html>
  `

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=60',
    },
  })
}

export async function POST(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://farcastmints.com'

  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Base DeFi Hub</title>
    
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${baseUrl}/api/frames/defi/image" />
    <meta property="fc:frame:image:aspect_ratio" content="1:1" />
    <meta property="fc:frame:button:1" content="🚀 Open DeFi Hub" />
    <meta property="fc:frame:button:1:action" content="link" />
    <meta property="fc:frame:button:1:target" content="${baseUrl}/defi" />
  </head>
  <body>
    <h1>Base DeFi Hub</h1>
  </body>
</html>
  `

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}
