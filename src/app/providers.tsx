'use client'

import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { OnchainKitProvider } from '@coinbase/onchainkit'
import { config as wagmiConfig } from '@/lib/wagmi'
import config from '@/lib/config'
import { WalletErrorHandler } from '@/components/WalletErrorHandler'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AdminProvider } from '@/contexts/AdminContext'
import { NotificationProvider } from '@/components/NotificationSystem'
import '@rainbow-me/rainbowkit/styles.css'
import '@coinbase/onchainkit/styles.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

// Prevent multiple provider initializations
let isWalletProviderInitialized = false

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AdminProvider>
        <NotificationProvider>
          <WalletErrorHandler />
          <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
              <OnchainKitProvider
                apiKey={config.onchainKit.apiKey}
                chain={config.chain}
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
                  appInfo={{
                    appName: 'FarcasterSea',
                    learnMoreUrl: 'https://farcaster.xyz',
                    disclaimer: ({ Text, Link }) => (
                      <Text>
                        By connecting your wallet and using FarcasterSea, you agree to our{' '}
                        <Link href="/terms">Terms of Service</Link> and{' '}
                        <Link href="/privacy">Privacy Policy</Link>.
                      </Text>
                    ),
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
  )
}