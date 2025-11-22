import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { base, baseSepolia, mainnet } from 'wagmi/chains'
import { http, fallback } from 'viem'
import { createConfig } from 'wagmi'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'

// Check if running in Farcaster Frame environment
const isFarcasterFrame = typeof window !== 'undefined' && 
  (window as any).frameSDK !== undefined

// SECURITY: No fallback API keys - must be set in environment variables
const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
const tatumApiKey = process.env.NEXT_PUBLIC_TATUM_API_KEY

if (!alchemyApiKey) {
  console.error('⚠️ CRITICAL: NEXT_PUBLIC_ALCHEMY_API_KEY is not set')
}

if (!tatumApiKey) {
  console.error('⚠️ CRITICAL: NEXT_PUBLIC_TATUM_API_KEY is not set')
}

// Determine which network to use based on environment
const isTestnet = process.env.NEXT_PUBLIC_NETWORK === 'baseSepolia'
const baseRpcUrl = isTestnet 
  ? process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://sepolia.base.org'
  : process.env.NEXT_PUBLIC_BASE_RPC_URL || `https://base-mainnet.gateway.tatum.io/${tatumApiKey || ''}`
const ankrRpcUrl = process.env.NEXT_PUBLIC_ANKR_RPC_URL || 'https://rpc.ankr.com/base'
const tatumRpcUrl = tatumApiKey ? `https://base-mainnet.gateway.tatum.io/${tatumApiKey}` : undefined

export const config = getDefaultConfig({
  appName: 'CurSwap DeFi',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
  chains: isTestnet ? [baseSepolia] : [base],
  transports: {
    [baseSepolia.id]: fallback([
      http('https://sepolia.base.org', {
        batch: true,
        retryCount: 3,
        timeout: 30_000,
      }),
      http('https://base-sepolia.g.alchemy.com/v2/' + alchemyApiKey, {
        batch: true,
        retryCount: 2,
        timeout: 30_000,
      }),
      http('https://base-sepolia.blockpi.network/v1/rpc/public', { retryCount: 2 }),
    ]),
    [base.id]: fallback([
      http(tatumRpcUrl, {
        batch: true,
        retryCount: 3,
        timeout: 30_000,
      }),
      http(baseRpcUrl, {
        batch: true,
        retryCount: 3,
        timeout: 30_000,
      }),
      http(ankrRpcUrl, {
        batch: true,
        retryCount: 3,
        timeout: 30_000,
      }),
      http(`https://base-mainnet.g.alchemy.com/v2/${alchemyApiKey}`, {
        batch: true,
        retryCount: 2,
        timeout: 30_000,
      }),
      http('https://base.llamarpc.com', { retryCount: 2 }),
      http('https://base.blockpi.network/v1/rpc/public', { retryCount: 2 }),
    ]),
  },
  ssr: true,
  multiInjectedProviderDiscovery: true, // Enable for better wallet detection
})

// Enhanced config with Farcaster Frame support
export const farcasterFrameConfig = createConfig({
  chains: isTestnet ? [baseSepolia] : [base],
  connectors: [
    injected(), // MetaMask, Rabby, etc.
    coinbaseWallet({
      appName: 'CurSwap DeFi',
      preference: 'smartWalletOnly', // Smart wallet for Farcaster users
    }),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'e3877a06886f08ffd144013611c152d1',
    }),
  ],
  transports: {
    [baseSepolia.id]: fallback([
      http('https://sepolia.base.org', {
        batch: true,
        retryCount: 3,
        timeout: 30_000,
      }),
      http('https://base-sepolia.g.alchemy.com/v2/' + alchemyApiKey, {
        batch: true,
        retryCount: 2,
        timeout: 30_000,
      }),
      http('https://base-sepolia.blockpi.network/v1/rpc/public', { retryCount: 2 }),
    ]),
    [base.id]: fallback([
      http(tatumRpcUrl, {
        batch: true,
        retryCount: 3,
        timeout: 30_000,
      }),
      http(baseRpcUrl, {
        batch: true,
        retryCount: 3,
        timeout: 30_000,
      }),
      http(`https://base-mainnet.g.alchemy.com/v2/${alchemyApiKey}`, {
        batch: true,
        retryCount: 2,
        timeout: 30_000,
      }),
      http('https://base.llamarpc.com', { retryCount: 2 }),
      http('https://base.blockpi.network/v1/rpc/public', { retryCount: 2 }),
    ]),
  },
  ssr: true,
})

// Base Mainnet configuration (Production)
export const baseConfig = {
  chainId: base.id,
  name: 'Base',
  rpcUrl: tatumRpcUrl,
  explorerUrl: 'https://basescan.org',
  currency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
}