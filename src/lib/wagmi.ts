import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { base, baseSepolia, mainnet } from 'wagmi/chains'
import { http } from 'viem'

export const config = getDefaultConfig({
  appName: 'Farcaster NFT Marketplace',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'e3877a06886f08ffd144013611c152d1',
  chains: [base, baseSepolia, mainnet],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
    [mainnet.id]: http(),
  },
  ssr: true,
  multiInjectedProviderDiscovery: false, // Disable to prevent conflicts
})

// Base chain configuration
export const baseConfig = {
  chainId: base.id,
  name: 'Base',
  rpcUrl: 'https://mainnet.base.org',
  explorerUrl: 'https://basescan.org',
  currency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
}

export const baseSepoliaConfig = {
  chainId: baseSepolia.id,
  name: 'Base Sepolia',
  rpcUrl: 'https://sepolia.base.org',
  explorerUrl: 'https://sepolia.basescan.org',
  currency: {
    name: 'Ethereum',
    symbol: 'ETH', 
    decimals: 18,
  },
}