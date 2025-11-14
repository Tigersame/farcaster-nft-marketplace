import { useState, useEffect, useCallback } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { createPublicClient, http, type Address, type Hash } from 'viem';
import { 
  createSmartAccountClient,
} from 'permissionless';
import { toSimpleSmartAccount } from 'permissionless/accounts';
import { 
  getPaymasterConfig, 
  isPaymasterConfigured,
  getChain,
  SIMPLE_ACCOUNT_FACTORY_ADDRESS,
  ENTRYPOINT_ADDRESS,
  createBundlerClient,
} from '@/lib/paymaster';

/**
 * Hook for managing Smart Accounts with Paymaster support
 * 
 * This hook:
 * 1. Creates a Smart Account from the user's connected wallet
 * 2. Configures Paymaster middleware for gas sponsorship
 * 3. Provides methods for sending gasless transactions
 * 
 * Usage:
 * ```tsx
 * const { smartAccount, isReady, sendGaslessTransaction, error } = useSmartAccount();
 * 
 * // Send a gasless transaction
 * await sendGaslessTransaction({
 *   to: contractAddress,
 *   data: encodedFunctionCall,
 *   value: 0n,
 * });
 * ```
 */

export interface SmartAccountState {
  smartAccount: any | null; // Using any for now due to permissionless types
  smartAccountAddress: Address | null;
  isReady: boolean;
  isLoading: boolean;
  error: Error | null;
}

export interface GaslessTransactionParams {
  to: Address;
  data: `0x${string}`;
  value?: bigint;
}

export interface GaslessTransactionResult {
  hash: Hash;
  success: boolean;
}

export const useSmartAccount = () => {
  const { address: walletAddress, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  
  const [state, setState] = useState<SmartAccountState>({
    smartAccount: null,
    smartAccountAddress: null,
    isReady: false,
    isLoading: false,
    error: null,
  });

  /**
   * Initialize Smart Account when wallet is connected
   */
  useEffect(() => {
    const initializeSmartAccount = async () => {
      // Reset state if wallet disconnected
      if (!isConnected || !walletClient || !walletAddress) {
        setState({
          smartAccount: null,
          smartAccountAddress: null,
          isReady: false,
          isLoading: false,
          error: null,
        });
        return;
      }

      // Check if Paymaster is configured
      if (!isPaymasterConfigured()) {
        setState(prev => ({
          ...prev,
          error: new Error('Paymaster not configured. Set NEXT_PUBLIC_PAYMASTER_RPC_URL in environment.'),
          isReady: false,
        }));
        return;
      }

      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const config = getPaymasterConfig();
        const chain = getChain();

        // Create public client
        const publicClient = createPublicClient({
          chain,
          transport: http(),
        });

        // Convert wallet to Simple Smart Account
        const simpleAccount = await toSimpleSmartAccount({
          client: publicClient,
          owner: walletClient,
          factoryAddress: SIMPLE_ACCOUNT_FACTORY_ADDRESS,
          entryPoint: {
            address: ENTRYPOINT_ADDRESS,
            version: '0.6',
          },
        });

        // Create Smart Account client with Paymaster middleware
        const smartAccountClient = createSmartAccountClient({
          account: simpleAccount,
          chain,
          bundlerTransport: http(config.paymasterUrl),
          paymaster: {
            getPaymasterData: async () => {
              // Coinbase Paymaster automatically sponsors transactions
              return {
                paymaster: config.paymasterUrl as Address,
                paymasterData: '0x' as `0x${string}`,
              };
            },
          },
          userOperation: {
            estimateFeesPerGas: async () => {
              return {
                maxFeePerGas: BigInt(0),
                maxPriorityFeePerGas: BigInt(0),
              };
            },
          },
        }) as any;

        setState({
          smartAccount: smartAccountClient,
          smartAccountAddress: simpleAccount.address,
          isReady: true,
          isLoading: false,
          error: null,
        });

        console.log('✅ Smart Account initialized:', simpleAccount.address);
      } catch (err) {
        console.error('❌ Failed to initialize Smart Account:', err);
        setState(prev => ({
          ...prev,
          error: err instanceof Error ? err : new Error('Failed to initialize Smart Account'),
          isLoading: false,
          isReady: false,
        }));
      }
    };

    initializeSmartAccount();
  }, [isConnected, walletClient, walletAddress]);

  /**
   * Send a gasless transaction using the Smart Account
   */
  const sendGaslessTransaction = useCallback(
    async ({ to, data, value = BigInt(0) }: GaslessTransactionParams): Promise<GaslessTransactionResult> => {
      if (!state.smartAccount || !state.isReady) {
        throw new Error('Smart Account not ready. Please connect your wallet and wait for initialization.');
      }

      try {
        console.log('🚀 Sending gasless transaction to:', to);
        
        // Send UserOperation (gas sponsored by Paymaster)
        const txHash = await state.smartAccount.sendTransaction({
          to,
          data,
          value,
        });

        console.log('✅ Gasless transaction sent:', txHash);

        return {
          hash: txHash,
          success: true,
        };
      } catch (err) {
        console.error('❌ Gasless transaction failed:', err);
        throw err;
      }
    },
    [state.smartAccount, state.isReady]
  );

  /**
   * Estimate gas for a transaction (useful for UI feedback)
   */
  const estimateGas = useCallback(
    async ({ to, data, value = BigInt(0) }: GaslessTransactionParams): Promise<bigint> => {
      if (!state.smartAccount) {
        throw new Error('Smart Account not initialized');
      }

      // For gasless transactions, gas is always 0 for the user
      return BigInt(0);
    },
    [state.smartAccount]
  );

  return {
    // Smart Account state
    smartAccount: state.smartAccount,
    smartAccountAddress: state.smartAccountAddress,
    isReady: state.isReady,
    isLoading: state.isLoading,
    error: state.error,

    // Transaction methods
    sendGaslessTransaction,
    estimateGas,

    // Helper utilities
    isPaymasterEnabled: isPaymasterConfigured(),
  };
};

/**
 * Utility to check if gasless transactions are available
 */
export const useGaslessAvailable = () => {
  const { isConnected } = useAccount();
  const paymasterConfigured = isPaymasterConfigured();
  
  return isConnected && paymasterConfigured;
};
