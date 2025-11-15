import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import ErudaProvider from '@/components/providers/ErudaProvider'
import AnalyticsProvider from '@/components/providers/AnalyticsProvider'
import AdminDashboard from '@/components/AdminDashboard'
import { WalletPrompt } from '@/components/WalletPrompt'
import { NetworkSwitcher } from '@/components/NetworkSwitcher'
import ProSidebar from '@/components/ProSidebar'
import { MiniAppHeader } from '@/components/MiniAppHeader'
import { MiniAppSplash } from '@/components/MiniAppSplash'
import { MiniAppContainer } from '@/components/MiniAppContainer'

const inter = Inter({ subsets: ['latin'] })

// Force dynamic rendering for all routes
export const dynamic = 'force-dynamic'
export const dynamicParams = true

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover', // For safe area insets on mobile
}

export const metadata: Metadata = {
  title: 'Farcast Mints - NFT Marketplace on Base',
  description: 'An NFT marketplace on Base with Farcaster integration',
  keywords: ['NFT', 'marketplace', 'Base', 'Farcaster', 'Web3', 'blockchain', 'Farcast Mints'],
  authors: [{ name: 'Farcast Mints Team' }],
  creator: 'Farcast Mints',
  publisher: 'Farcast Mints',
  category: 'Finance',
  openGraph: {
    title: 'Farcast Mints - NFT Marketplace on Base',
    description: 'An NFT marketplace on Base with Farcaster integration',
    url: 'https://farcastmints.com',
    siteName: 'Farcast Mints',
    images: [
      {
        url: 'https://farcastmints.com/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'FarcastMints NFT Marketplace',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Farcast Mints - NFT Marketplace',
    description: 'An NFT marketplace on Base with Farcaster integration',
    images: ['https://farcastmints.com/og-image.svg'],
    creator: '@FarcastMints',
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/icon.svg', sizes: '512x512', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/icon.svg', sizes: '180x180', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.ico',
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://farcastmints.com/og-image.svg',
    'fc:frame:button:1': 'Explore NFTs',
    'fc:frame:post_url': 'https://farcastmints.com/api/frames',
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
        <link rel="preconnect" href="https://base-mainnet.g.alchemy.com" />
        <link rel="preconnect" href="https://gateway.pinata.cloud" />
        <link rel="preconnect" href="https://hub.pinata.cloud" />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <Providers>
          <AnalyticsProvider>
            {/* Mini App Splash Screen - shown on initial load in Farcaster */}
            <MiniAppSplash />
            
            {/* Mini App Container - enforces proper sizing for Farcaster */}
            <MiniAppContainer>
              <div className="flex min-h-screen">
                <ProSidebar />
                <div className="flex-1 flex flex-col">
                  {/* Mini App Header - shown when in Farcaster environment */}
                  <MiniAppHeader />
                  
                  <ErudaProvider />
                  <AdminDashboard />
                  <WalletPrompt />
                  <NetworkSwitcher />
                  <main className="flex-1">
                    {children}
                  </main>
                </div>
              </div>
            </MiniAppContainer>
          </AnalyticsProvider>
        </Providers>
      </body>
    </html>
  )
}