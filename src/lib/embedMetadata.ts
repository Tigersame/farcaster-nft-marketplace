/**
 * Farcaster Mini App Embed Metadata Utilities
 * Based on: https://docs.base.org/mini-apps/core-concepts/embeds-and-previews
 */

export interface EmbedMetadata {
  version: 'next' | '1'
  imageUrl: string
  button: {
    title: string
    action: {
      type: 'launch_frame'
      url?: string
      name?: string
      splashImageUrl?: string
      splashBackgroundColor?: string
    }
  }
}

/**
 * Generate Mini App embed metadata for a page
 */
export function generateEmbedMetadata(options: {
  imageUrl: string
  buttonTitle?: string
  url?: string
  name?: string
  splashImageUrl?: string
  splashBackgroundColor?: string
}): string {
  const metadata: EmbedMetadata = {
    version: 'next',
    imageUrl: options.imageUrl,
    button: {
      title: options.buttonTitle || 'Open App',
      action: {
        type: 'launch_frame',
        url: options.url || 'https://farcastmints.com',
        name: options.name || 'FarcastMints',
        splashImageUrl: options.splashImageUrl || 'https://farcastmints.com/splash.png',
        splashBackgroundColor: options.splashBackgroundColor || '#0f1f3d'
      }
    }
  }

  return JSON.stringify(metadata)
}

/**
 * Generate embed metadata for the homepage
 */
export function getHomeEmbedMetadata(): string {
  return generateEmbedMetadata({
    imageUrl: 'https://farcastmints.com/og-image.png',
    buttonTitle: 'Open App',
    url: 'https://farcastmints.com',
  })
}

/**
 * Generate embed metadata for collections page
 */
export function getCollectionsEmbedMetadata(): string {
  return generateEmbedMetadata({
    imageUrl: 'https://farcastmints.com/screenshots/marketplace.png',
    buttonTitle: 'Browse Collections',
    url: 'https://farcastmints.com/collections',
  })
}

/**
 * Generate embed metadata for a specific NFT
 */
export function getNFTEmbedMetadata(tokenId: string, imageUrl: string, name: string): string {
  return generateEmbedMetadata({
    imageUrl: imageUrl,
    buttonTitle: `View ${name}`,
    url: `https://farcastmints.com/nft/${tokenId}`,
  })
}

/**
 * Generate embed metadata for minting page
 */
export function getMintEmbedMetadata(): string {
  return generateEmbedMetadata({
    imageUrl: 'https://farcastmints.com/screenshots/frames.png',
    buttonTitle: 'Start Minting',
    url: 'https://farcastmints.com/mint',
  })
}
