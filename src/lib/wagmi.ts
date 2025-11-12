import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { base, mainnet } from 'wagmi/chains'
import { http, fallback } from 'viem'
import { createConfig } from 'wagmi'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'

// Check if running in Farcaster Frame environment
const isFarcasterFrame = typeof window !== 'undefined' && 
  (window as any).frameSDK !== undefined

// RPC Configuration with fallbacks to avoid rate limits
const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || 'skI70Usmhsnf0GDuGdYqj'
const baseRpcUrl = process.env.NEXT_PUBLIC_BASE_RPC_URL || `https://base-mainnet.g.alchemy.com/v2/${alchemyApiKey}`

export const config = getDefaultConfig({
  appName: 'FarcasterSea NFT Marketplace',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'e3877a06886f08ffd144013611c152d1',
  chains: [base, mainnet],
  transports: {
    [base.id]: fallback([
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
    [mainnet.id]: fallback([
      http(`https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`, {
        batch: true,
        retryCount: 3,
        timeout: 30_000,
      }),
      http('https://ethereum.publicnode.com', { retryCount: 2 }),
      http('https://cloudflare-eth.com', { retryCount: 2 }),
    ]),
  },
  ssr: true,
  multiInjectedProviderDiscovery: true, // Enable for better wallet detection
})

// Enhanced config with Farcaster Frame support
export const farcasterFrameConfig = createConfig({
  chains: [base, mainnet],
  connectors: [
    injected(), // MetaMask, Rabby, etc.
    coinbaseWallet({
      appName: 'FarcasterSea NFT Marketplace',
      preference: 'smartWalletOnly', // Smart wallet for Farcaster users
    }),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'e3877a06886f08ffd144013611c152d1',
    }),
  ],
  transports: {
    [base.id]: fallback([
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
    [mainnet.id]: fallback([
      http(`https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`, {
        batch: true,
        retryCount: 3,
        timeout: 30_000,
      }),
      http('https://ethereum.publicnode.com', { retryCount: 2 }),
      http('https://cloudflare-eth.com', { retryCount: 2 }),
    ]),
  },
  ssr: true,
})

// Base Mainnet configuration (Production)
export const baseConfig = {
  chainId: base.id,
  name: 'Base',
  rpcUrl: baseRpcUrl,
  explorerUrl: 'https://basescan.org',
  currency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
}