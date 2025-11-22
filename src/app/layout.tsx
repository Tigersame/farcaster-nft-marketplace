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
  title: 'CurSwap - DeFi on Base Network',
  description: 'Swap tokens, provide liquidity, and earn rewards on Base Network',
  keywords: ['DeFi', 'swap', 'liquidity', 'Base', 'Farcaster', 'Web3', 'crypto', 'CurSwap'],
  authors: [{ name: 'CurSwap Team' }],
  creator: 'CurSwap',
  publisher: 'CurSwap',
  category: 'Finance',
  openGraph: {
    title: 'CurSwap - DeFi on Base Network',
    description: 'Swap tokens, provide liquidity, and earn rewards on Base Network',
    url: 'https://curswap.com',
    siteName: 'CurSwap',
    images: [
      {
        url: 'https://curswap.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CurSwap DeFi Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CurSwap - DeFi on Base',
    description: 'Swap tokens, provide liquidity, and earn rewards on Base Network',
    images: ['https://curswap.com/og-image.png'],
    creator: '@CurSwap',
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
    'fc:frame:image': 'https://curswap.com/og-image.png',
    'fc:frame:button:1': 'Launch DeFi Hub',
    'fc:miniapp': JSON.stringify({
      version: 'next',
      imageUrl: 'https://curswap.com/og-image.png',
      button: {
        title: 'Open CurSwap',
        action: {
          type: 'launch_frame',
          url: 'https://curswap.com',
          name: 'CurSwap',
          splashImageUrl: 'https://curswap.com/splash.png',
          splashBackgroundColor: '#0f1f3d'
        }
      }
    }),
    'fc:frame:post_url': 'https://curswap.com/api/frames',
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