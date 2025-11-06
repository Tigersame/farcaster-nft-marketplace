import { NextRequest } from 'next/server'

// Test the NFT Frame API endpoint
export async function GET() {
  try {
    // Test data for our frame endpoint
    const testTokenId = '1'
    
    // Test basic frame structure
    const frameHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />
  <title>NFT Frame Test</title>
  
  <!-- Farcaster Frame Meta Tags -->
  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:image" content="http://localhost:3000/api/frames/nft/1/image" />
  <meta property="fc:frame:button:1" content="💎 Buy NFT" />
  <meta property="fc:frame:button:2" content="❤️ Like" />
  <meta property="fc:frame:button:3" content="🔗 View Details" />
  <meta property="fc:frame:button:4" content="📤 Share" />
  <meta property="fc:frame:post_url" content="http://localhost:3000/api/frames/nft/1" />
  
  <!-- Open Graph -->
  <meta property="og:title" content="Crypto Punk #1 - NFT Frame" />
  <meta property="og:description" content="Interactive NFT in Farcaster - Buy, Like, Share directly from your feed!" />
  <meta property="og:image" content="http://localhost:3000/api/frames/nft/1/image" />
</head>
<body>
  <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
    <h1>🖼️ NFT Frame Test</h1>
    <p>This is a test page for our Farcaster NFT Frame.</p>
    <p><strong>Frame is active and ready for Farcaster!</strong></p>
    
    <div style="margin-top: 20px; padding: 20px; background: rgba(255,255,255,0.1); border-radius: 10px;">
      <h3>Available Actions:</h3>
      <ul>
        <li>💎 Buy NFT - Purchase this NFT</li>
        <li>❤️ Like - Show appreciation</li> 
        <li>🔗 View Details - See full information</li>
        <li>📤 Share - Share with friends</li>
      </ul>
    </div>

    <div style="margin-top: 20px; text-align: center;">
      <p><strong>Test URLs:</strong></p>
      <a href="/api/frames/nft/1" style="color: lightblue;">Frame API</a> | 
      <a href="/api/frames/nft/1/image" style="color: lightblue;">Frame Image</a> |
      <a href="/api/frames" style="color: lightblue;">All Frames</a>
    </div>
  </div>
</body>
</html>`.trim()

    return new Response(frameHtml, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    })

  } catch (error) {
    console.error('Frame test error:', error)
    
    return new Response(`
<!DOCTYPE html>
<html>
<head>
  <title>Frame Test Error</title>
</head>
<body>
  <h1>Frame Test Error</h1>
  <pre>${error}</pre>
</body>
</html>`, {
      status: 500,
      headers: { 'Content-Type': 'text/html' },
    })
  }
}