/**
 * Centralized branding configuration for the entire application
 * Update these values to customize your marketplace branding
 */

export const BRANDING = {
  // Brand Name
  name: 'FarcastMints',
  tagline: 'NFT Marketplace',
  
  // Logo Files (place your custom logos in /public folder)
  logo: {
    main: '/icon.svg',        // Main logo (1024x1024 recommended)
    small: '/logo.svg',       // Small/compact logo (100x100)
    favicon: '/favicon.svg',  // Browser favicon
  },
  
  // Logo Display Settings
  display: {
    showIcon: true,           // Show logo icon in header/sidebar
    showText: true,           // Show brand name text
    iconSize: 40,             // Default icon size in pixels
    iconInitial: 'F',         // Single letter for gradient badge fallback
  },
  
  // Brand Colors (for themed components)
  colors: {
    primary: '#6E4BFF',       // Purple
    accent: '#FF6BA6',        // Pink
    bg1: '#1A1B23',           // Dark background
    bg2: '#0B1220',           // Darker background
    text: '#E6EEF6',          // Light text
    muted: '#9AA4B2',         // Muted text
  },
  
  // Social & External Links
  links: {
    website: 'https://farcastmints.com',
    base: 'https://www.base.org',
    tamber: 'https://tamberfoundation.org',
    github: 'https://github.com/devsaini',
  },
  
  // Copyright & Credits
  footer: {
    copyright: '© 2025 FarcastMints',
    builtOn: 'Base',
    poweredBy: 'Tamber Foundation',
    author: 'devsaini',
  },
} as const;

/**
 * Helper function to get logo URL
 * @param variant - 'main' | 'small' | 'favicon'
 * @returns Full logo URL
 */
export function getLogoUrl(variant: 'main' | 'small' | 'favicon' = 'main'): string {
  return BRANDING.logo[variant];
}

/**
 * Helper function to get brand color
 * @param color - Color name from branding config
 * @returns Hex color value
 */
export function getBrandColor(color: keyof typeof BRANDING.colors): string {
  return BRANDING.colors[color];
}
