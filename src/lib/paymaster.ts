import { createPublicClient, http, type Address, type Chain } from 'viem';
import { base, baseSepolia } from 'viem/chains';

/**
 * Base Paymaster Configuration
 * 
 * This file sets up the Paymaster client for sponsoring gas fees on Base network.
 * Uses Coinbase Developer Platform (CDP) Paymaster service.
 * 
 * Environment variable required:
 * NEXT_PUBLIC_PAYMASTER_RPC_URL - Your CDP Paymaster RPC URL
 * Format: https://api.developer.coinbase.com/rpc/v1/base/YOUR_KEY
 */

// ERC-4337 EntryPoint contract (v0.6)
export const ENTRYPOINT_ADDRESS: Address = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';

// Simple Account Factory contract on Base
export const SIMPLE_ACCOUNT_FACTORY_ADDRESS: Address = '0x15Ba39375ee2Ab563E8873C8390be6f2E2F50232';

// Get chain based on environment (defaults to Base Sepolia testnet)
export const getChain = (): Chain => {
  const isProduction = process.env.NEXT_PUBLIC_NETWORK === 'mainnet';
  return isProduction ? base : baseSepolia;
};

// Get Paymaster RPC URL from environment
export const getPaymasterRpcUrl = (): string => {
  const rpcUrl = process.env.NEXT_PUBLIC_PAYMASTER_RPC_URL;
  
  if (!rpcUrl) {
    console.warn('NEXT_PUBLIC_PAYMASTER_RPC_URL not set. Gasless transactions will not work.');
    console.warn('Get your RPC URL from: https://portal.cdp.coinbase.com/products/paymaster');
    return '';
  }
  
  return rpcUrl;
};

/**
 * Create a public client for interacting with Base blockchain
 */
export const createBasePublicClient = () => {
  const chain = getChain();
  
  return createPublicClient({
    chain,
    transport: http(),
  });
};

/**
 * Create a bundler client for submitting UserOperations
 * This client communicates with the Paymaster service
 */
export const createBundlerClient = () => {
  const chain = getChain();
  const paymasterUrl = getPaymasterRpcUrl();
  
  if (!paymasterUrl) {
    throw new Error('Paymaster RPC URL not configured. Set NEXT_PUBLIC_PAYMASTER_RPC_URL in .env.local');
  }
  
  return createPublicClient({
    chain,
    transport: http(paymasterUrl),
  });
};

/**
 * Paymaster middleware configuration
 * This will be used in the Smart Account hook to sponsor gas fees
 */
export interface PaymasterConfig {
  entrypoint: Address;
  factoryAddress: Address;
  paymasterUrl: string;
  chain: Chain;
}

export const getPaymasterConfig = (): PaymasterConfig => {
  return {
    entrypoint: ENTRYPOINT_ADDRESS,
    factoryAddress: SIMPLE_ACCOUNT_FACTORY_ADDRESS,
    paymasterUrl: getPaymasterRpcUrl(),
    chain: getChain(),
  };
};

/**
 * Check if Paymaster is properly configured
 */
export const isPaymasterConfigured = (): boolean => {
  const rpcUrl = process.env.NEXT_PUBLIC_PAYMASTER_RPC_URL;
  return !!rpcUrl && rpcUrl.length > 0;
};

/**
 * Get user-friendly message about Paymaster status
 */
export const getPaymasterStatus = (): { enabled: boolean; message: string } => {
  const configured = isPaymasterConfigured();
  
  if (configured) {
    return {
      enabled: true,
      message: 'Gasless transactions enabled via Base Paymaster',
    };
  }
  
  return {
    enabled: false,
    message: 'Paymaster not configured. Add NEXT_PUBLIC_PAYMASTER_RPC_URL to enable gasless transactions.',
  };
};
