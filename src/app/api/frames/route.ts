import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const baseUrl = `${url.protocol}//${url.host}`

  // Available NFT frames
  const nftFrames = [
    { tokenId: '1', name: 'Farcaster Genesis #001' },
    { tokenId: '2', name: 'Base Builder Badge' },
    { tokenId: '3', name: 'Onchain Summer Vibes' },
    { tokenId: '4', name: 'Crypto Punk Revival #2847' },
    { tokenId: '5', name: 'Neural Art Genesis' },
    { tokenId: '6', name: 'Base Ecosystem Explorer' },
    { tokenId: '7', name: 'Farcaster Frame Art #42' },
    { tokenId: '8', name: 'Onchain Music Genesis' },
    { tokenId: '9', name: 'Pixel Warriors #156' },
    { tokenId: '10', name: 'Base Degen Collection #001' },
    { tokenId: '11', name: 'MetaVerse Land Plot #777' },
    { tokenId: '12', name: 'Animated Cosmos #99' }
  ]

  const frameLinks = nftFrames.map(nft => 
    `<div style="margin: 10px 0;">
      <a href="${baseUrl}/api/frames/nft/${nft.tokenId}" 
         style="color: #3b82f6; text-decoration: none; font-weight: 500;">
        🖼️ ${nft.name} Frame
      </a>
      <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">
        Frame URL: ${baseUrl}/api/frames/nft/${nft.tokenId}
      </p>
    </div>`
  ).join('')

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>NFT Frames | Base NFT Marketplace</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            line-height: 1.6;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
          }
          .frame-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
          }
          .copy-btn {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            margin-left: 10px;
          }
          .copy-btn:hover {
            background: #2563eb;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🖼️ NFT Farcaster Frames</h1>
          <p>Interactive NFT frames for the Farcaster ecosystem on Base network</p>
        </div>
        
        <div class="frame-card">
          <h2>Available NFT Frames</h2>
          <p style="color: #64748b; margin-bottom: 20px;">
            These frames can be shared in Farcaster casts to allow direct NFT interactions
          </p>
          ${frameLinks}
        </div>

        <div class="frame-card">
          <h3>🚀 How to Use</h3>
          <ol style="color: #4b5563;">
            <li>Copy any frame URL above</li>
            <li>Paste it in a Farcaster cast</li>
            <li>Users can interact with the NFT directly in their feed</li>
            <li>Actions include: Buy, Like, View Details, and Share</li>
          </ol>
        </div>

        <div class="frame-card">
          <h3>⚡ Features</h3>
          <ul style="color: #4b5563;">
            <li><strong>Interactive Buttons:</strong> Buy, Like, View, Share actions</li>
            <li><strong>Dynamic Images:</strong> Custom generated frame images</li>
            <li><strong>Base Integration:</strong> Optimized for Base network transactions</li>
            <li><strong>Social Proof:</strong> Real-time activity tracking</li>
            <li><strong>XMTP Ready:</strong> Compatible with Base App Quick Actions</li>
          </ul>
        </div>

        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b;">
            <a href="${baseUrl}" style="color: #3b82f6;">← Back to Marketplace</a>
          </p>
        </div>

        <script>
          function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
              alert('Frame URL copied to clipboard!');
            });
          }
        </script>
      </body>
    </html>
  `

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}