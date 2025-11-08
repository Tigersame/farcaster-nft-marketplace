import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Farcaster NFT Marketplace',
  description: 'A decentralized NFT marketplace built with Farcaster MiniKit on Base network',
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
        <link rel="preconnect" href="https://mainnet.base.org" />
        <link rel="preconnect" href="https://gateway.pinata.cloud" />
        <link rel="preconnect" href="https://hub.pinata.cloud" />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        {/* Wallet Provider Conflict Handler */}
        <Script
          id="wallet-conflict-handler"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Prevent wallet provider conflicts and suppress console errors
              (function() {
                // Suppress certain console errors
                const originalError = console.error;
                console.error = function(...args) {
                  const message = args[0];
                  if (typeof message === 'string' && (
                    message.includes('MetaMask encountered an error setting the global Ethereum provider') ||
                    message.includes('Could not establish connection. Receiving end does not exist') ||
                    message.includes('TrustedScript') ||
                    message.includes('Function constructor') ||
                    message.includes('Cannot set property ethereum')
                  )) {
                    return; // Suppress these specific errors
                  }
                  originalError.apply(console, args);
                };

                // Handle window load
                if (typeof window !== 'undefined') {
                  window.addEventListener('load', function() {
                    // Handle multiple Ethereum providers
                    if (window.ethereum && window.ethereum.providers && Array.isArray(window.ethereum.providers)) {
                      // Multiple providers detected - prefer MetaMask or use the first one
                      const provider = window.ethereum.providers.find(p => p.isMetaMask) || window.ethereum.providers[0];
                      if (provider) {
                        try {
                          Object.defineProperty(window, 'ethereum', {
                            value: provider,
                            writable: false,
                            configurable: true
                          });
                        } catch (e) {
                          // Silently handle if property can't be redefined
                        }
                      }
                    }
                  });
                }
              })();
            `
          }}
        />
        
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}