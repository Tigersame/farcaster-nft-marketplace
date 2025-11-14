// Enhanced wallet component with network detection and switching
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { base, baseSepolia } from 'wagmi/chains'
import { useState, useEffect } from 'react'

interface EnhancedWalletProps {
  showBalance?: boolean
  showNetwork?: boolean
  compactOnMobile?: boolean
}

export function EnhancedWallet({ 
  showBalance = true, 
  showNetwork = true,
  compactOnMobile = true 
}: EnhancedWalletProps) {
  const { address, isConnected, chain } = useAccount()
  const { switchChain } = useSwitchChain()
  const [needsNetworkSwitch, setNeedsNetworkSwitch] = useState(false)
  
  // Detect if user is on wrong network
  useEffect(() => {
    if (isConnected && chain) {
      const isCorrectNetwork = chain.id === base.id || chain.id === baseSepolia.id
      setNeedsNetworkSwitch(!isCorrectNetwork)
    }
  }, [isConnected, chain])

  // Auto-prompt network switch
  const handleSwitchToBase = () => {
    if (switchChain) {
      switchChain({ chainId: base.id })
    }
  }

  if (!isConnected) {
    return (
      <ConnectButton.Custom>
        {({ openConnectModal }) => (
          <button
            onClick={openConnectModal}
            className="px-4 py-2 md:px-6 md:py-2.5 bg-primary hover:bg-primary/90 
                     text-white rounded-md font-medium transition-all
                     min-w-[44px] min-h-[44px] touch-manipulation
                     shadow-subtle hover:shadow-pop"
          >
            <span className={compactOnMobile ? "hidden md:inline" : ""}>
              Connect Wallet
            </span>
            <span className={compactOnMobile ? "md:hidden" : "hidden"}>
              Connect
            </span>
          </button>
        )}
      </ConnectButton.Custom>
    )
  }

  return (
    <div className="flex items-center gap-2 md:gap-3">
      {/* Network warning */}
      {needsNetworkSwitch && (
        <button
          onClick={handleSwitchToBase}
          className="px-3 py-1.5 md:px-4 md:py-2 bg-danger text-white rounded-md
                   text-sm font-medium hover:bg-danger/90 transition-all
                   shadow-subtle hover:shadow-pop animate-pulse"
          aria-label="Switch to Base network"
        >
          <span className="hidden md:inline">Switch to Base</span>
          <span className="md:hidden">⚠️ Network</span>
        </button>
      )}

      {/* Network indicator */}
      {showNetwork && chain && !needsNetworkSwitch && (
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 
                      bg-surface rounded-md text-sm text-neutral-300">
          <div className={`w-2 h-2 rounded-full ${
            chain.id === base.id ? 'bg-accent' : 'bg-yellow-500'
          }`} />
          <span>{chain.name}</span>
        </div>
      )}

      {/* RainbowKit connect button */}
      <ConnectButton 
        accountStatus={compactOnMobile ? {
          smallScreen: 'avatar',
          largeScreen: 'full',
        } : 'full'}
        chainStatus={showNetwork ? {
          smallScreen: 'icon',
          largeScreen: 'full',
        } : 'none'}
        showBalance={showBalance ? {
          smallScreen: false,
          largeScreen: true,
        } : false}
      />
    </div>
  )
}

/**
 * Hook for detecting and prompting network switches
 */
export function useNetworkCheck() {
  const { chain } = useAccount()
  const { switchChain } = useSwitchChain()
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true)

  useEffect(() => {
    if (chain) {
      const correct = chain.id === base.id || chain.id === baseSepolia.id
      setIsCorrectNetwork(correct)
    }
  }, [chain])

  const switchToBase = async () => {
    if (switchChain) {
      try {
        await switchChain({ chainId: base.id })
        return true
      } catch (error) {
        console.error('Network switch failed:', error)
        return false
      }
    }
    return false
  }

  return {
    isCorrectNetwork,
    currentChain: chain,
    switchToBase,
  }
}

/**
 * Component that blocks interaction until correct network
 */
export function RequireNetwork({ children }: { children: React.ReactNode }) {
  const { isCorrectNetwork, switchToBase } = useNetworkCheck()
  const { isConnected } = useAccount()

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center p-8 md:p-12 
                    bg-surface rounded-lg text-center">
        <h3 className="text-xl md:text-2xl font-bold mb-4">
          Connect Your Wallet
        </h3>
        <p className="text-neutral-400 mb-6 max-w-md">
          Connect your wallet to view and interact with NFTs on Base network.
        </p>
        <EnhancedWallet showBalance={false} showNetwork={false} />
      </div>
    )
  }

  if (!isCorrectNetwork) {
    return (
      <div className="flex flex-col items-center justify-center p-8 md:p-12 
                    bg-surface rounded-lg text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-xl md:text-2xl font-bold mb-4">
          Wrong Network
        </h3>
        <p className="text-neutral-400 mb-6 max-w-md">
          This marketplace operates on Base network. Please switch your wallet to continue.
        </p>
        <button
          onClick={switchToBase}
          className="px-6 py-3 bg-primary hover:bg-primary/90 text-white
                   rounded-md font-medium transition-all shadow-subtle hover:shadow-pop"
        >
          Switch to Base Network
        </button>
      </div>
    )
  }

  return <>{children}</>
}
