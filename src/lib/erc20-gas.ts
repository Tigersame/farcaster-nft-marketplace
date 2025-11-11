/**
 * ERC20 Gas Payment Support for Base Account
 * Enables users to pay gas fees with ERC20 tokens like USDC
 */

import { parseAbi, formatUnits } from 'viem'

// Supported ERC20 tokens for gas payment
export interface PaymentToken {
  name: string
  address: string
  decimals: number
  symbol: string
}

// Base network supported tokens for gas payment
export const SUPPORTED_PAYMENT_TOKENS: PaymentToken[] = [
  {
    name: 'USD Coin',
    address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', // USDC on Base
    decimals: 6,
    symbol: 'USDC'
  },
  // More tokens can be added as Base Account expands support
]

// Coinbase Developer Platform paymaster (recommended)
export const CDP_PAYMASTER_ADDRESS = '0x2FAEB0760D4230Ef2aC21496Bb4F0b47D634FD4c'

// ERC20 approval ABI
export const ERC20_ABI = parseAbi([
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function name() view returns (string)',
  'function symbol() view returns (string)'
])

export interface GasPaymentConfig {
  tokenAddress: string
  paymasterAddress: string
  minTokenThreshold: bigint  // Minimum balance to require approval
  tokenApprovalTopUp: bigint // Amount to approve when topping up
}

/**
 * Get default gas payment configuration for USDC
 */
export function getDefaultGasPaymentConfig(): GasPaymentConfig {
  const usdc = SUPPORTED_PAYMENT_TOKENS[0] // USDC
  return {
    tokenAddress: usdc.address,
    paymasterAddress: CDP_PAYMASTER_ADDRESS,
    minTokenThreshold: BigInt(1 * 10 ** usdc.decimals), // $1 threshold
    tokenApprovalTopUp: BigInt(20 * 10 ** usdc.decimals) // $20 approval amount
  }
}

/**
 * Check if user needs to approve tokens for gas payment
 */
export async function checkTokenAllowance(
  client: any, // Viem client
  userAddress: string,
  config: GasPaymentConfig
): Promise<{
  needsApproval: boolean
  currentAllowance: bigint
  tokenBalance: bigint
}> {
  try {
    // Check current allowance
    const allowance = await client.readContract({
      abi: ERC20_ABI,
      address: config.tokenAddress,
      functionName: 'allowance',
      args: [userAddress, config.paymasterAddress],
    })

    // Check token balance
    const balance = await client.readContract({
      abi: ERC20_ABI,
      address: config.tokenAddress,
      functionName: 'balanceOf',
      args: [userAddress],
    })

    return {
      needsApproval: allowance < config.minTokenThreshold,
      currentAllowance: allowance,
      tokenBalance: balance
    }
  } catch (error) {
    console.error('Error checking token allowance:', error)
    return {
      needsApproval: true,
      currentAllowance: BigInt(0),
      tokenBalance: BigInt(0)
    }
  }
}

/**
 * Create approval transaction for ERC20 gas payment
 */
export function createApprovalTransaction(
  config: GasPaymentConfig,
  approvalAmount?: bigint
) {
  return {
    abi: ERC20_ABI,
    address: config.tokenAddress,
    functionName: 'approve',
    args: [config.paymasterAddress, approvalAmount || config.tokenApprovalTopUp],
  }
}

/**
 * Format token amount for display
 */
export function formatTokenAmount(
  amount: bigint,
  decimals: number,
  symbol: string,
  maxDecimals = 2
): string {
  const formatted = formatUnits(amount, decimals)
  const rounded = parseFloat(formatted).toFixed(maxDecimals)
  return `${rounded} ${symbol}`
}

/**
 * Get token info for display
 */
export function getTokenInfo(tokenAddress: string): PaymentToken | null {
  return SUPPORTED_PAYMENT_TOKENS.find(
    token => token.address.toLowerCase() === tokenAddress.toLowerCase()
  ) || null
}

/**
 * Paymaster service configuration
 * These would be used to integrate with ERC-7677 compatible paymasters
 */
export interface PaymasterConfig {
  serviceUrl: string
  entryPointAddress: string
  chainId: number
}

export const BASE_PAYMASTER_CONFIG: PaymasterConfig = {
  serviceUrl: 'https://api.developer.coinbase.com/rpc/v1/base', // CDP paymaster
  entryPointAddress: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789', // EntryPoint v0.6
  chainId: 8453 // Base mainnet
}

/**
 * Create ERC-7677 paymaster request for ERC20 gas payment
 */
export function createPaymasterRequest(
  userOp: any,
  entryPointAddress: string,
  chainId: number,
  tokenAddress?: string
) {
  const context = tokenAddress ? { erc20: tokenAddress } : {}
  
  return {
    jsonrpc: '2.0',
    id: 1,
    method: 'pm_getPaymasterData',
    params: [
      userOp,
      entryPointAddress,
      `0x${chainId.toString(16)}`, // hex chain ID
      context
    ]
  }
}

/**
 * Utility to estimate gas cost in ERC20 tokens
 */
export function estimateGasCostInToken(
  gasLimit: bigint,
  gasPrice: bigint,
  ethToTokenRate: number, // How many tokens per 1 ETH
  tokenDecimals: number
): bigint {
  // Calculate gas cost in ETH (wei)
  const gasCostWei = gasLimit * gasPrice
  
  // Convert to ETH (18 decimals)
  const gasCostEth = Number(gasCostWei) / 1e18
  
  // Convert to token amount
  const gasCostToken = gasCostEth * ethToTokenRate
  
  // Convert to token units with proper decimals
  return BigInt(Math.ceil(gasCostToken * (10 ** tokenDecimals)))
}

/**
 * React hook integration helper types
 */
export interface UseERC20GasPaymentResult {
  isSupported: boolean
  needsApproval: boolean
  tokenBalance: string
  currentAllowance: string
  approveTokens: () => Promise<string>
  estimatedGasCost: string
  isLoading: boolean
  tokenInfo?: PaymentToken
  refreshStatus: () => Promise<void>
}