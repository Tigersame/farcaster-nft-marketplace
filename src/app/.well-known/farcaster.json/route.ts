import { NextResponse } from 'next/server'

export async function GET() {
  const manifest = {
    accountAssociation: {
      header: "eyJmaWQiOjI3OTA1NSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDRCMjEwOTE1MjJGMDA5OUI4Rjc2Mzk2OGQzNzliMGY4M2E1NWNBYjMifQ",
      payload: "eyJkb21haW4iOiJmYXJjYXN0bWludHMuY29tIn0",
      signature: "FKK/+CegXaVEz+VSWhSs/WYNSFs7yaeFZZboBvQKpw4brV1PzHWeBFJ6sMdlBlXGwxWb5ANEPncQkjY4j4C49Rw="
    },
    baseBuilder: {
      ownerAddress: "0xEaFE5088BCd7eb27fa1e4AA417a55eD5ea2dab8B"
    },
    miniapp: {
      version: "1",
      name: "FarcastMints",
      homeUrl: "https://farcastmints.com",
      imageUrl: "https://farcastmints.com/og-image.png",
      iconUrl: "https://farcastmints.com/icon.png",
      splashImageUrl: "https://farcastmints.com/splash.png",
      splashBackgroundColor: "#0f1f3d",
      webhookUrl: "https://farcastmints.com/api/miniapp/webhook",
      subtitle: "Trade NFTs on Base Network",
      description: "NFT marketplace with Farcaster frames and social trading on Base",
      screenshotUrls: [
        "https://farcastmints.com/screenshots/marketplace.png",
        "https://farcastmints.com/screenshots/frames.png"
      ],
      primaryCategory: "finance",
      tags: ["nft", "marketplace", "base"],
      heroImageUrl: "https://farcastmints.com/og-image.png",
      tagline: "Trade securely on Base",
      ogTitle: "FarcastMints - NFT Marketplace",
      ogDescription: "Trade NFTs securely on Base",
      ogImageUrl: "https://farcastmints.com/og-image.png"
    }
  }

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Access-Control-Allow-Origin': '*',
    }
  })
}
