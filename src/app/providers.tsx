'use client'

import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { OnchainKitProvider } from '@coinbase/onchainkit'
import { config as wagmiConfig } from '@/lib/wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { WalletErrorHandler } from '@/components/WalletErrorHandler'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AdminProvider } from '@/contexts/AdminContext'
import { NotificationProvider } from '@/components/NotificationSystem'
import { MiniAppProvider } from '@/contexts/MiniAppContext'
import '@rainbow-me/rainbowkit/styles.css'
import '@coinbase/onchainkit/styles.css'

// Create QueryClient outside component to prevent reinitialization
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

// Determine initial chain based on environment
const isTestnet = process.env.NEXT_PUBLIC_NETWORK === 'baseSepolia'
const initialChain = isTestnet ? baseSepolia : base

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MiniAppProvider>
      <ThemeProvider>
        <AdminProvider>
          <NotificationProvider>
            <WalletErrorHandler />
            <WagmiProvider config={wagmiConfig}>
              <QueryClientProvider client={queryClient}>
                <OnchainKitProvider
                  apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
                  chain={initialChain}
                >
                  <RainbowKitProvider
                    theme={darkTheme({
                      accentColor: '#2563eb', // Blue accent to match OpenSea
                      accentColorForeground: 'white',
                      borderRadius: 'large',
                      fontStack: 'system',
                      overlayBlur: 'large',
                    })}
                    modalSize="compact"
                    initialChain={initialChain}
                    appInfo={{
                      appName: 'FarcastMints',
                      learnMoreUrl: 'https://farcaster.xyz',
                    }}
                  >
                    {children}
                  </RainbowKitProvider>
                </OnchainKitProvider>
              </QueryClientProvider>
            </WagmiProvider>
          </NotificationProvider>
        </AdminProvider>
      </ThemeProvider>
    </MiniAppProvider>
  )
}