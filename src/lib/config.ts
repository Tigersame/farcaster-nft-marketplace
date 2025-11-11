import { base, baseSepolia, mainnet } from 'wagmi/chains';

export const ENVIRONMENT = process.env.NODE_ENV || 'development';

export const config = {
  // Environment-specific URLs
  baseUrl: ENVIRONMENT === 'development' 
    ? 'http://localhost:3000' 
    : process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com',
  
  // Chain configuration
  chain: ENVIRONMENT === 'development' ? baseSepolia : base,
  
  // Supported chains
  chains: [base, baseSepolia, mainnet],
  
  // OnchainKit configuration
  onchainKit: {
    apiKey: process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || '',
    projectId: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_ID || 'farcastsea',
    schemaId: process.env.NEXT_PUBLIC_ONCHAINKIT_SCHEMA_ID,
  },
  
  // Wallet Connect
  walletConnect: {
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'farcaster-nft-demo',
  },
  
  // Farcaster configuration
  farcaster: {
    hubUrl: process.env.NEXT_PUBLIC_FARCASTER_HUB_URL || 'https://hub.farcaster.standardcrypto.vc:2281',
    signerUuid: process.env.FARCASTER_SIGNER_UUID,
  },
  
  // XMTP configuration
  xmtp: {
    environment: ENVIRONMENT === 'development' ? 'dev' : 'production',
  },
  
  // Analytics
  analytics: {
    gtag: process.env.NEXT_PUBLIC_GTAG_ID,
  },
  
  // Feature flags
  features: {
    enableXMTP: true,
    enableFrames: true,
    enableBasename: true,
    enableAnalytics: !!process.env.NEXT_PUBLIC_GTAG_ID,
  },
  
  // Contract addresses (environment-specific)
  contracts: {
    nftMarketplace: process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT || '0xE4241917A3B75C761C87BE335F392e220F67afCf', // Base Mainnet
  },
};

export default config;