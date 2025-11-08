import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { FiWifi, FiWifiOff, FiAlertCircle } from 'react-icons/fi'

export function WalletStatus() {
  const { address, isConnected, isConnecting, isDisconnected, chain } = useAccount()
  const { connect, connectors, error, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { openConnectModal } = useConnectModal()

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-lg max-w-sm">
      <div className="flex items-center space-x-2 mb-2">
        {isConnected ? (
          <FiWifi className="w-4 h-4 text-green-500" />
        ) : (
          <FiWifiOff className="w-4 h-4 text-gray-400" />
        )}
        <span className="font-medium text-gray-900 dark:text-white">
          Wallet Status
        </span>
      </div>
      
      <div className="space-y-2 text-sm">
        <div>
          <span className="text-gray-600 dark:text-gray-400">Status: </span>
          <span className={`font-medium ${
            isConnected ? 'text-green-600' : 
            isConnecting || isPending ? 'text-yellow-600' : 
            'text-gray-600'
          }`}>
            {isConnected ? 'Connected' : 
             isConnecting || isPending ? 'Connecting...' : 
             'Disconnected'}
          </span>
        </div>
        
        {address && (
          <div>
            <span className="text-gray-600 dark:text-gray-400">Address: </span>
            <span className="font-mono text-xs text-gray-900 dark:text-white">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
          </div>
        )}
        
        {chain && (
          <div>
            <span className="text-gray-600 dark:text-gray-400">Chain: </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {chain.name}
            </span>
          </div>
        )}
        
        {error && (
          <div className="flex items-start space-x-2 text-red-600">
            <FiAlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span className="text-xs">{error.message}</span>
          </div>
        )}
      </div>
      
      <div className="mt-3 space-y-2">
        {!isConnected && (
          <button
            onClick={openConnectModal}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Connect Wallet
          </button>
        )}
        
        {isConnected && (
          <button
            onClick={() => disconnect()}
            className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Disconnect
          </button>
        )}
      </div>
      
      {/* Available Connectors Debug */}
      <details className="mt-3">
        <summary className="text-xs text-gray-500 cursor-pointer">
          Debug Info ({connectors.length} connectors)
        </summary>
        <div className="mt-2 space-y-1">
          {connectors.map((connector) => (
            <div key={connector.uid} className="text-xs text-gray-600 dark:text-gray-400">
              {connector.name} - {connector.type}
              {isPending && ' (connecting...)'}
            </div>
          ))}
        </div>
      </details>
    </div>
  )
}