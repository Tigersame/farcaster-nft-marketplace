import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import ErudaProvider from '@/components/providers/ErudaProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FarcastSea - Secure NFT Marketplace',
  description: 'Hack-proof NFT marketplace built for the Base network with Farcaster frames integration and innovative ERC20 gas payments.',
  keywords: ['NFT', 'marketplace', 'Base', 'Farcaster', 'Web3', 'blockchain', 'secure'],
  authors: [{ name: 'FarcastSea Team' }],
  creator: 'FarcastSea',
  publisher: 'FarcastSea',
  category: 'Finance',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  openGraph: {
    title: 'FarcastSea - Secure NFT Marketplace',
    description: 'Hack-proof NFT marketplace with Farcaster frames and ERC20 gas payments on Base network.',
    url: 'https://farcaster-nft-marketplace.vercel.app',
    siteName: 'FarcastSea',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'FarcastSea NFT Marketplace',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FarcastSea - Secure NFT Marketplace',
    description: 'Hack-proof NFT marketplace with Farcaster frames and ERC20 gas payments on Base network.',
    images: ['/og-image.svg'],
    creator: '@FarcastSea',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
    shortcut: '/icon.svg',
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': '/og-image.svg',
    'fc:frame:button:1': 'Explore NFTs',
    'fc:frame:post_url': '/api/frames',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Dark mode initialization script - runs BEFORE any rendering */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Get saved theme, default to dark
                  let theme = localStorage.getItem('farcastsea-theme');
                  
                  // If no theme saved, set dark mode as default
                  if (!theme) {
                    theme = 'dark';
                    localStorage.setItem('farcastsea-theme', 'dark');
                  }
                  
                  // Apply dark class immediately if dark mode
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  // Fallback to dark mode if localStorage fails
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
        {/* Preconnect to important domains */}
        <link rel="preconnect" href="https://mainnet.base.org" />
        <link rel="preconnect" href="https://gateway.pinata.cloud" />
        <link rel="preconnect" href="https://hub.pinata.cloud" />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <Providers>
          <ErudaProvider />
          {children}
        </Providers>
      </body>
    </html>
  )
}