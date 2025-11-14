/**
 * Gnosis Safe Integration
 * For multisig proposals on critical admin actions
 */

import { ethers, ZeroAddress, keccak256, toUtf8Bytes, Interface, formatEther, BrowserProvider } from 'ethers';

export interface SafeProposal {
  id: string;
  to: string;
  value: string;
  data: string;
  operation: 0 | 1; // 0 = Call, 1 = DelegateCall
  safeTxGas: string;
  baseGas: string;
  gasPrice: string;
  gasToken: string;
  refundReceiver: string;
  nonce: number;
  signatures?: string;
  status: 'pending' | 'approved' | 'executed' | 'rejected';
  confirmationsRequired: number;
  confirmations: Array<{
    owner: string;
    signature: string;
    timestamp: string;
  }>;
}

/**
 * Create a Gnosis Safe proposal
 */
export async function createSafeProposal(params: {
  safeAddress: string;
  to: string;
  value: string;
  data: string;
  description: string;
}): Promise<SafeProposal> {
  const { safeAddress, to, value, data, description } = params;

  // Use Gnosis Safe Transaction Service API
  const chainId = await getCurrentChainId();
  const apiUrl = getSafeServiceUrl(chainId);

  try {
    const response = await fetch(`${apiUrl}/api/v1/safes/${safeAddress}/multisig-transactions/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        value,
        data,
        operation: 0,
        safeTxGas: '0',
        baseGas: '0',
        gasPrice: '0',
        gasToken: ZeroAddress,
        refundReceiver: ZeroAddress,
        nonce: await getSafeNonce(safeAddress),
        contractTransactionHash: '',
        sender: '',
        signature: '',
        origin: description,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create Safe proposal: ${response.statusText}`);
    }

    const proposal = await response.json();
    
    return {
      id: proposal.safeTxHash,
      to,
      value,
      data,
      operation: 0,
      safeTxGas: '0',
      baseGas: '0',
      gasPrice: '0',
      gasToken: ZeroAddress,
      refundReceiver: ZeroAddress,
      nonce: proposal.nonce,
      status: 'pending',
      confirmationsRequired: await getSafeThreshold(safeAddress),
      confirmations: [],
    };
  } catch (error) {
    console.error('Error creating Safe proposal:', error);
    throw error;
  }
}

/**
 * Create withdrawal proposal to Gnosis Safe
 */
export async function createWithdrawProposal(params: {
  safeAddress: string;
  to: string;
  amount: string;
  description?: string;
}): Promise<SafeProposal> {
  return createSafeProposal({
    safeAddress: params.safeAddress,
    to: params.to,
    value: params.amount,
    data: '0x', // Plain ETH transfer
    description: params.description || `Withdraw ${formatEther(params.amount)} ETH to ${params.to}`,
  });
}

/**
 * Create contract function call proposal
 */
export async function createContractCallProposal(params: {
  safeAddress: string;
  contractAddress: string;
  functionName: string;
  args: any[];
  abi: any[];
  description?: string;
}): Promise<SafeProposal> {
  const { safeAddress, contractAddress, functionName, args, abi, description } = params;

  // Encode function call
  const iface = new Interface(abi);
  const data = iface.encodeFunctionData(functionName, args);

  return createSafeProposal({
    safeAddress,
    to: contractAddress,
    value: '0',
    data,
    description: description || `Call ${functionName} on ${contractAddress}`,
  });
}

/**
 * Create role grant proposal
 */
export async function createGrantRoleProposal(params: {
  safeAddress: string;
  contractAddress: string;
  role: string;
  account: string;
  abi: any[];
}): Promise<SafeProposal> {
  return createContractCallProposal({
    safeAddress: params.safeAddress,
    contractAddress: params.contractAddress,
    functionName: 'grantRole',
    args: [params.role, params.account],
    abi: params.abi,
    description: `Grant role ${params.role} to ${params.account}`,
  });
}

/**
 * Create role revoke proposal
 */
export async function createRevokeRoleProposal(params: {
  safeAddress: string;
  contractAddress: string;
  role: string;
  account: string;
  abi: any[];
}): Promise<SafeProposal> {
  return createContractCallProposal({
    safeAddress: params.safeAddress,
    contractAddress: params.contractAddress,
    functionName: 'revokeRole',
    args: [params.role, params.account],
    abi: params.abi,
    description: `Revoke role ${params.role} from ${params.account}`,
  });
}

/**
 * Create upgrade proposal
 */
export async function createUpgradeProposal(params: {
  safeAddress: string;
  proxyAddress: string;
  newImplementation: string;
  abi: any[];
}): Promise<SafeProposal> {
  return createContractCallProposal({
    safeAddress: params.safeAddress,
    contractAddress: params.proxyAddress,
    functionName: 'upgradeTo',
    args: [params.newImplementation],
    abi: params.abi,
    description: `Upgrade contract to ${params.newImplementation}`,
  });
}

/**
 * Get pending Safe proposals
 */
export async function getPendingSafeProposals(safeAddress: string): Promise<SafeProposal[]> {
  const chainId = await getCurrentChainId();
  const apiUrl = getSafeServiceUrl(chainId);

  try {
    const response = await fetch(`${apiUrl}/api/v1/safes/${safeAddress}/multisig-transactions/?executed=false`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch Safe proposals');
    }

    const data = await response.json();
    return data.results.map(formatSafeProposal);
  } catch (error) {
    console.error('Error fetching Safe proposals:', error);
    return [];
  }
}

/**
 * Get Safe proposal status
 */
export async function getSafeProposalStatus(safeAddress: string, safeTxHash: string): Promise<SafeProposal | null> {
  const chainId = await getCurrentChainId();
  const apiUrl = getSafeServiceUrl(chainId);

  try {
    const response = await fetch(`${apiUrl}/api/v1/safes/${safeAddress}/multisig-transactions/${safeTxHash}/`);
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return formatSafeProposal(data);
  } catch (error) {
    console.error('Error fetching Safe proposal status:', error);
    return null;
  }
}

/**
 * Helper: Get current chain ID
 */
async function getCurrentChainId(): Promise<number> {
  if (typeof window !== 'undefined' && window.ethereum) {
    const provider = new BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    return Number(network.chainId);
  }
  return 8453; // Base mainnet default
}

/**
 * Helper: Get Safe service URL for chain
 */
function getSafeServiceUrl(chainId: number): string {
  const urls: Record<number, string> = {
    1: 'https://safe-transaction-mainnet.safe.global',
    8453: 'https://safe-transaction-base.safe.global',
    84532: 'https://safe-transaction-base-sepolia.safe.global',
    10: 'https://safe-transaction-optimism.safe.global',
    137: 'https://safe-transaction-polygon.safe.global',
  };

  return urls[chainId] || urls[8453];
}

/**
 * Helper: Get Safe nonce
 */
async function getSafeNonce(safeAddress: string): Promise<number> {
  const chainId = await getCurrentChainId();
  const apiUrl = getSafeServiceUrl(chainId);

  try {
    const response = await fetch(`${apiUrl}/api/v1/safes/${safeAddress}/`);
    const data = await response.json();
    return data.nonce || 0;
  } catch (error) {
    console.error('Error fetching Safe nonce:', error);
    return 0;
  }
}

/**
 * Helper: Get Safe threshold
 */
async function getSafeThreshold(safeAddress: string): Promise<number> {
  const chainId = await getCurrentChainId();
  const apiUrl = getSafeServiceUrl(chainId);

  try {
    const response = await fetch(`${apiUrl}/api/v1/safes/${safeAddress}/`);
    const data = await response.json();
    return data.threshold || 1;
  } catch (error) {
    console.error('Error fetching Safe threshold:', error);
    return 1;
  }
}

/**
 * Helper: Format Safe proposal response
 */
function formatSafeProposal(data: any): SafeProposal {
  return {
    id: data.safeTxHash,
    to: data.to,
    value: data.value,
    data: data.data,
    operation: data.operation,
    safeTxGas: data.safeTxGas,
    baseGas: data.baseGas,
    gasPrice: data.gasPrice,
    gasToken: data.gasToken,
    refundReceiver: data.refundReceiver,
    nonce: data.nonce,
    signatures: data.signatures,
    status: data.isExecuted ? 'executed' : 'pending',
    confirmationsRequired: data.confirmationsRequired || 1,
    confirmations: data.confirmations?.map((c: any) => ({
      owner: c.owner,
      signature: c.signature,
      timestamp: c.submissionDate,
    })) || [],
  };
}

/**
 * Constants for role hashes
 */
export const ROLES = {
  DEFAULT_ADMIN_ROLE: '0x' + '00'.repeat(32),
  MINTER_ROLE: keccak256(toUtf8Bytes('MINTER_ROLE')),
  CURATOR_ROLE: keccak256(toUtf8Bytes('CURATOR_ROLE')),
  FINANCE_ROLE: keccak256(toUtf8Bytes('FINANCE_ROLE')),
  UPGRADER_ROLE: keccak256(toUtf8Bytes('UPGRADER_ROLE')),
  PAUSER_ROLE: keccak256(toUtf8Bytes('PAUSER_ROLE')),
};
