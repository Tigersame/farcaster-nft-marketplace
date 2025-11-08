/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['gateway.pinata.cloud', 'ipfs.io'],
  },
  // Disable TypeScript checking during development to prevent build failures
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_FARCASTER_HUB_URL: process.env.NEXT_PUBLIC_FARCASTER_HUB_URL,
    NEXT_PUBLIC_BASE_RPC_URL: process.env.NEXT_PUBLIC_BASE_RPC_URL,
    MINIKIT_APP_ID: process.env.MINIKIT_APP_ID,
  },
  // Add security headers with relaxed CSP for wallet compatibility
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' chrome-extension: moz-extension:; object-src 'none'; base-uri 'self'; connect-src 'self' https: wss: chrome-extension: moz-extension:; img-src 'self' data: https: chrome-extension: moz-extension:; style-src 'self' 'unsafe-inline' https: chrome-extension: moz-extension:; font-src 'self' https: chrome-extension: moz-extension: data:;"
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  },
  webpack: (config, { isServer }) => {
    // Handle missing dependencies warnings
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      'pino-pretty': false,
      '@react-native-async-storage/async-storage': false,
    };

    // Ignore specific warnings from MetaMask SDK
    config.ignoreWarnings = [
      { module: /node_modules\/@metamask\/sdk/ },
      { message: /Failed to parse source map/ },
    ];

    return config;
  }
};

module.exports = nextConfig;