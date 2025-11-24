/**
 * Base Mini-App Manifest Configuration
 * https://docs.base.org/mini-apps/quickstart/build-checklist
 * 
 * This file defines the manifest for the CurSwap mini-app
 * following Base's official specification
 */

import { BRANDING } from '@/config/branding'

export interface MiniAppManifest {
  // Required fields
  accountAssociation: {
    header: string
    payload: string
    signature: string
  }
  frame: {
    version: string
    name: string
    iconUrl: string
    homeUrl: string
    imageUrl: string
    buttonTitle: string
    splashImageUrl: string
    splashBackgroundColor: string
    webhookUrl?: string
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://curswap.com'

export const MINIAPP_MANIFEST: MiniAppManifest = {
  accountAssociation: {
    header: 'eyJmaWQiOjYzOTczNCwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDEyMzQ1Njc4OTBhYmNkZWYxMjM0NTY3ODkwYWJjZGVmMTIzNDU2NzgifQ',
    payload: 'eyJkb21haW4iOiJjdXJzd2FwLmNvbSJ9',
    signature: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
  },
  frame: {
    version: 'next',
    name: BRANDING.name,
    iconUrl: `${BASE_URL}/icon.svg`,
    homeUrl: BASE_URL,
    imageUrl: `${BASE_URL}/og-image.png`,
    buttonTitle: `Open ${BRANDING.name}`,
    splashImageUrl: `${BASE_URL}/splash.png`,
    splashBackgroundColor: '#1a1a2e',
    webhookUrl: `${BASE_URL}/api/miniapp/webhook`
  }
}

/**
 * Generate manifest JSON for /.well-known/farcaster.json
 */
export function generateManifestJSON(): MiniAppManifest {
  return MINIAPP_MANIFEST
}

/**
 * Validate manifest according to Base specs
 */
export function validateManifest(manifest: MiniAppManifest): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // Check required fields
  if (!manifest.frame.version) errors.push('frame.version is required')
  if (!manifest.frame.name) errors.push('frame.name is required')
  if (!manifest.frame.iconUrl) errors.push('frame.iconUrl is required')
  if (!manifest.frame.homeUrl) errors.push('frame.homeUrl is required')
  if (!manifest.frame.imageUrl) errors.push('frame.imageUrl is required')
  if (!manifest.frame.buttonTitle) errors.push('frame.buttonTitle is required')
  if (!manifest.frame.splashImageUrl) errors.push('frame.splashImageUrl is required')
  if (!manifest.frame.splashBackgroundColor) errors.push('frame.splashBackgroundColor is required')

  // Validate URLs
  try {
    new URL(manifest.frame.iconUrl)
    new URL(manifest.frame.homeUrl)
    new URL(manifest.frame.imageUrl)
    new URL(manifest.frame.splashImageUrl)
  } catch (e) {
    errors.push('Invalid URL format in manifest')
  }

  // Validate splash background color (must be hex)
  if (!/^#[0-9A-Fa-f]{6}$/.test(manifest.frame.splashBackgroundColor)) {
    errors.push('splashBackgroundColor must be a valid hex color')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
