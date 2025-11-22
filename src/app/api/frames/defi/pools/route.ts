import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://curswap.com'

  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Liquidity Pools - Base DeFi</title>
    
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${baseUrl}/api/frames/defi/pools/image" />
    <meta property="fc:frame:image:aspect_ratio" content="1:1" />
    <meta property="fc:frame:button:1" content="💎 ETH/USDC Pool" />
    <meta property="fc:frame:button:1:action" content="link" />
    <meta property="fc:frame:button:1:target" content="${baseUrl}/defi?tab=pools" />
    <meta property="fc:frame:button:2" content="🔙 Back to Hub" />
    <meta property="fc:frame:button:2:action" content="post" />
    <meta property="fc:frame:button:2:target" content="${baseUrl}/api/frames/defi" />
  </head>
  <body>
    <h1>Liquidity Pools</h1>
  </body>
</html>
  `

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}
