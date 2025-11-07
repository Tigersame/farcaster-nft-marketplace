// Farcaster Hub Provider Configuration and Integration

/**
 * Supported Farcaster Hub Providers
 * Reference: https://docs.farcaster.xyz/reference/hubs/hubs
 */

export interface HubProvider {
  name: string
  url: string
  description: string
  features: string[]
  requiresAuth: boolean
  isPaid: boolean
  status: 'active' | 'deprecated' | 'beta'
}

export const FARCASTER_HUB_PROVIDERS: Record<string, HubProvider> = {
  pinata: {
    name: 'Pinata Hub',
    url: 'https://hub.pinata.cloud',
    description: 'Free, public, reliable hub service by Pinata',
    features: [
      'Free tier available',
      'High reliability',
      'Easy setup',
      'No authentication required',
      'Rate limiting applied'
    ],
    requiresAuth: false,
    isPaid: false,
    status: 'active'
  },
  neynar: {
    name: 'Neynar Hub',
    url: 'https://hub-api.neynar.com/v1',
    description: 'API-rich hub with advanced features and authentication',
    features: [
      'Rich API features',
      'User authentication',
      'Advanced analytics',
      'Professional support',
      'Higher rate limits'
    ],
    requiresAuth: true,
    isPaid: true,
    status: 'active'
  },
  warpcast: {
    name: 'Warpcast Hub',
    url: 'https://api.warpcast.com/v2',
    description: 'Official Warpcast API endpoint',
    features: [
      'Official Warpcast integration',
      'Direct access to Warpcast data',
      'User profiles and social graph'
    ],
    requiresAuth: true,
    isPaid: false,
    status: 'active'
  },
  custom: {
    name: 'Custom Hub',
    url: 'https://your-domain.com',
    description: 'Self-hosted or custom Farcaster Hub instance',
    features: [
      'Full control',
      'Custom configuration',
      'Private data',
      'No external dependencies'
    ],
    requiresAuth: true,
    isPaid: false,
    status: 'active'
  },
  // Legacy/deprecated providers
  nemes: {
    name: 'Nemes Hub (Legacy)',
    url: 'https://nemes.farcaster.xyz:2283',
    description: 'Legacy hub endpoint - consider migrating',
    features: [
      'Legacy support',
      'May have limited availability'
    ],
    requiresAuth: false,
    isPaid: false,
    status: 'deprecated'
  }
}

/**
 * Hub Configuration Interface
 */
export interface HubConfig {
  provider: keyof typeof FARCASTER_HUB_PROVIDERS
  url: string
  apiKey?: string
  customHeaders?: Record<string, string>
  timeout?: number
}

/**
 * Get current hub configuration from environment
 */
export function getCurrentHubConfig(): HubConfig {
  const hubUrl = process.env.NEXT_PUBLIC_FARCASTER_HUB_URL || FARCASTER_HUB_PROVIDERS.pinata.url
  const apiKey = process.env.NEXT_PUBLIC_FARCASTER_API_KEY

  // Detect provider based on URL
  let provider: keyof typeof FARCASTER_HUB_PROVIDERS = 'custom'
  
  for (const [key, config] of Object.entries(FARCASTER_HUB_PROVIDERS)) {
    if (hubUrl.includes(config.url.replace('https://', '').split('/')[0])) {
      provider = key as keyof typeof FARCASTER_HUB_PROVIDERS
      break
    }
  }

  return {
    provider,
    url: hubUrl,
    apiKey,
    timeout: 10000
  }
}

/**
 * Validate hub configuration
 */
export function validateHubConfig(config: HubConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  const providerInfo = FARCASTER_HUB_PROVIDERS[config.provider]

  if (!providerInfo) {
    errors.push(`Unknown provider: ${config.provider}`)
  }

  if (!config.url) {
    errors.push('Hub URL is required')
  }

  if (providerInfo?.requiresAuth && !config.apiKey) {
    errors.push(`API key required for ${providerInfo.name}`)
  }

  if (providerInfo?.status === 'deprecated') {
    errors.push(`Provider ${providerInfo.name} is deprecated - consider migrating`)
  }

  try {
    new URL(config.url)
  } catch {
    errors.push('Invalid hub URL format')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Create hub client with proper configuration
 */
export async function createHubClient(config?: HubConfig) {
  const hubConfig = config || getCurrentHubConfig()
  const validation = validateHubConfig(hubConfig)
  
  if (!validation.valid) {
    console.warn('Hub configuration issues:', validation.errors)
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'User-Agent': 'Farcaster-NFT-Marketplace/1.0'
  }

  if (hubConfig.apiKey) {
    headers['Authorization'] = `Bearer ${hubConfig.apiKey}`
  }

  if (hubConfig.customHeaders) {
    Object.assign(headers, hubConfig.customHeaders)
  }

  return {
    config: hubConfig,
    headers,
    
    async fetch(endpoint: string, options: RequestInit = {}) {
      const url = `${hubConfig.url}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers
        },
        signal: AbortSignal.timeout(hubConfig.timeout || 10000)
      })

      if (!response.ok) {
        throw new Error(`Hub request failed: ${response.status} ${response.statusText}`)
      }

      return response
    }
  }
}

/**
 * Test hub connectivity
 */
export async function testHubConnection(config?: HubConfig): Promise<{ 
  success: boolean; 
  provider: string;
  latency?: number;
  error?: string;
}> {
  const hubConfig = config || getCurrentHubConfig()
  const providerInfo = FARCASTER_HUB_PROVIDERS[hubConfig.provider]
  
  try {
    const startTime = Date.now()
    const client = await createHubClient(hubConfig)
    
    // Try a simple health check endpoint (varies by provider)
    const healthEndpoints: Record<string, string> = {
      pinata: '/health',
      neynar: '/health',
      warpcast: '/health',
      custom: '/health',
      nemes: '/' // Legacy endpoint
    }
    
    const endpoint = healthEndpoints[hubConfig.provider] || '/health'
    await client.fetch(endpoint, { method: 'GET' })
    
    const latency = Date.now() - startTime
    
    return {
      success: true,
      provider: providerInfo?.name || 'Unknown',
      latency
    }
  } catch (error) {
    return {
      success: false,
      provider: providerInfo?.name || 'Unknown',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Migration helper for updating hub providers
 */
export function getRecommendedProvider(): keyof typeof FARCASTER_HUB_PROVIDERS {
  // Default recommendation: Pinata for free usage, Neynar for advanced features
  return 'pinata'
}

export function getMigrationGuide(currentProvider: string, targetProvider: string): string[] {
  const steps: string[] = []
  
  if (currentProvider === 'nemes') {
    steps.push('⚠️  Nemes hub is deprecated and may become unavailable')
    steps.push('✅ Update NEXT_PUBLIC_FARCASTER_HUB_URL in your .env.local file')
  }
  
  if (targetProvider === 'pinata') {
    steps.push('1. Update hub URL to: https://hub.pinata.cloud')
    steps.push('2. No API key required for basic usage')
    steps.push('3. Check rate limits at https://docs.pinata.cloud/farcaster/farcaster-api')
  }
  
  if (targetProvider === 'neynar') {
    steps.push('1. Update hub URL to: https://hub-api.neynar.com/v1')
    steps.push('2. Sign up for Neynar API key at https://neynar.com')
    steps.push('3. Add NEXT_PUBLIC_FARCASTER_API_KEY to your .env.local')
    steps.push('4. Configure authentication headers')
  }
  
  if (targetProvider === 'custom') {
    steps.push('1. Set up your own Farcaster Hub instance')
    steps.push('2. Update hub URL to your custom endpoint')
    steps.push('3. Configure authentication as needed')
  }
  
  steps.push('5. Test connection using the hub diagnostics in admin panel')
  steps.push('6. Update any hardcoded endpoints in your application')
  
  return steps
}

/**
 * Hub provider comparison for admin interface
 */
export function getProviderComparison() {
  return Object.entries(FARCASTER_HUB_PROVIDERS).map(([key, provider]) => ({
    id: key,
    ...provider,
    recommended: key === 'pinata' ? 'Free & Reliable' : 
                key === 'neynar' ? 'Feature Rich' : 
                key === 'nemes' ? '⚠️ Deprecated' : 
                'Custom Setup'
  }))
}