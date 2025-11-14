/**
 * Utility to generate blur data URLs for images
 * Can be used server-side or at build time
 */

/**
 * Generate a simple gray blur placeholder (1x1 pixel)
 */
export function getDefaultBlurDataURL(): string {
  return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8dPjwfwAG8QKgdnblowAAAABJRU5ErkJggg=="
}

/**
 * Generate a colored blur placeholder based on dominant color
 * @param color - Hex color (e.g., "#7A5AF8")
 */
export function getColoredBlurDataURL(color: string): string {
  const hex = color.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  
  // Create a 10x10 canvas with the color
  if (typeof window !== 'undefined') {
    const canvas = document.createElement('canvas')
    canvas.width = 10
    canvas.height = 10
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
      ctx.fillRect(0, 0, 10, 10)
      return canvas.toDataURL()
    }
  }
  
  return getDefaultBlurDataURL()
}

/**
 * Generate gradient blur placeholder
 * @param color1 - Start color hex (e.g., "#7A5AF8")
 * @param color2 - End color hex (e.g., "#00D2FF")
 */
export function getGradientBlurDataURL(color1: string, color2: string): string {
  if (typeof window !== 'undefined') {
    const canvas = document.createElement('canvas')
    canvas.width = 10
    canvas.height = 10
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 10, 10)
      gradient.addColorStop(0, color1)
      gradient.addColorStop(1, color2)
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 10, 10)
      return canvas.toDataURL()
    }
  }
  
  return getDefaultBlurDataURL()
}

/**
 * Shimmer effect blur placeholder (for loading states)
 */
export function getShimmerBlurDataURL(): string {
  const shimmer = `
    <svg width="400" height="400" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#1a1a1a" offset="20%" />
          <stop stop-color="#2a2a2a" offset="50%" />
          <stop stop-color="#1a1a1a" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="#1a1a1a" />
      <rect id="r" width="400" height="400" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-400" to="400" dur="1s" repeatCount="indefinite"  />
    </svg>
  `
  const toBase64 = (str: string) =>
    typeof window === 'undefined'
      ? Buffer.from(str).toString('base64')
      : window.btoa(str)
  
  return `data:image/svg+xml;base64,${toBase64(shimmer)}`
}

/**
 * NFT category-based blur colors
 */
export const NFT_CATEGORY_COLORS: Record<string, string[]> = {
  Art: ['#7A5AF8', '#00D2FF'],      // Purple to Cyan
  Gaming: ['#FF6B6B', '#FFD166'],    // Red to Yellow
  Music: ['#4ADE80', '#06B6D4'],     // Green to Teal
  Photography: ['#F59E0B', '#EF4444'], // Orange to Red
  Sports: ['#10B981', '#3B82F6'],    // Green to Blue
  Collectibles: ['#EC4899', '#8B5CF6'], // Pink to Purple
  Utility: ['#6366F1', '#14B8A6'],   // Indigo to Teal
  default: ['#1a1a1a', '#2a2a2a'],   // Dark gray
}

/**
 * Get blur placeholder for NFT category
 */
export function getCategoryBlurDataURL(category: string): string {
  const colors = NFT_CATEGORY_COLORS[category] || NFT_CATEGORY_COLORS.default
  return getGradientBlurDataURL(colors[0], colors[1])
}

/**
 * Mock NFT data with blur placeholders
 */
export function generateMockNFTWithBlur(
  id: string,
  name: string,
  category: string,
  imageUrl: string
) {
  return {
    id,
    name,
    collection: `${category} Collection`,
    image: imageUrl,
    blurDataURL: getCategoryBlurDataURL(category),
    price: (Math.random() * 3 + 0.5).toFixed(2),
    description: `An exclusive ${category.toLowerCase()} NFT from the ${name} collection.`,
    contractAddress: '0x1234567890123456789012345678901234567890',
    traits: [
      { trait_type: 'Category', value: category },
      { trait_type: 'Rarity', value: ['Common', 'Rare', 'Epic', 'Legendary'][Math.floor(Math.random() * 4)] },
      { trait_type: 'Edition', value: `${Math.floor(Math.random() * 100 + 1)}/500` },
    ],
    verified: Math.random() > 0.5,
    creator: '0xCreator' + Math.random().toString(16).slice(2, 10),
  }
}
