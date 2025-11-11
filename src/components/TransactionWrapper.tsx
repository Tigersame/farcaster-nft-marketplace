'use client';

import { ReactNode } from 'react';
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
  TransactionSponsor,
} from '@coinbase/onchainkit/transaction';
import type { TransactionError } from '@coinbase/onchainkit/transaction';
import { base } from 'wagmi/chains';

interface TransactionWrapperProps {
  address: `0x${string}`;
  children?: ReactNode;
  className?: string;
  onSuccess?: () => void;
  onError?: (error: TransactionError) => void;
  contractAddress?: `0x${string}`;
  functionName?: string;
  args?: any[];
  isSponsored?: boolean;
}

export default function TransactionWrapper({
  address,
  children,
  className = '',
  onSuccess,
  onError,
  contractAddress = (process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT || '0xE4241917A3B75C761C87BE335F392e220F67afCf') as `0x${string}`,
  functionName = 'mintNFT',
  args = [],
  isSponsored = false,
}: TransactionWrapperProps) {
  const handleOnSuccess = () => {
    console.log('Transaction successful!');
    if (onSuccess) onSuccess();
  };

  const handleOnError = (error: TransactionError) => {
    console.error('Transaction failed:', error);
    if (onError) onError(error);
  };

  // Define the contract call with proper ABI
  const contracts = [
    {
      address: contractAddress,
      abi: [
        {
          name: functionName,
          type: 'function' as const,
          stateMutability: functionName === 'mintNFT' ? 'nonpayable' as const : 'payable' as const,
          inputs: functionName === 'mintNFT' ? [
            { name: 'metadataURI', type: 'string' },
            { name: 'royaltyPercentage', type: 'uint256' }
          ] : functionName === 'listNFT' ? [
            { name: 'tokenId', type: 'uint256' },
            { name: 'price', type: 'uint256' }
          ] : functionName === 'buyNFT' ? [
            { name: 'tokenId', type: 'uint256' }
          ] : [],
          outputs: functionName === 'mintNFT' ? [{ name: '', type: 'uint256' }] : [],
        },
      ],
      functionName,
      args,
    },
  ];

  return (
    <div className={`w-full ${className}`}>
      <Transaction
        address={address}
        contracts={contracts}
        chainId={base.id}
        onSuccess={handleOnSuccess}
        onError={handleOnError}
        capabilities={isSponsored ? {
          paymasterService: {
            url: 'https://api.developer.coinbase.com/rpc/v1/base/paymaster'
          }
        } : undefined}
      >
        {isSponsored && (
          <TransactionSponsor className="mb-2" />
        )}
        
        <TransactionButton
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all"
          text={children as string || "🚀 Mint NFT"}
        />
        
        <TransactionStatus className="mt-4">
          <TransactionStatusLabel className="text-sm font-medium" />
          <TransactionStatusAction className="mt-2" />
        </TransactionStatus>
      </Transaction>
    </div>
  );
}