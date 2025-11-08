'use client';

import { ReactNode } from 'react';
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
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
}

export default function TransactionWrapper({
  address,
  children,
  className = '',
  onSuccess,
  onError,
  contractAddress = '0x1234567890123456789012345678901234567890', // Demo contract
  functionName = 'mint',
  args = [],
}: TransactionWrapperProps) {
  const handleOnSuccess = () => {
    console.log('Transaction successful!');
    if (onSuccess) onSuccess();
  };

  const handleOnError = (error: TransactionError) => {
    console.error('Transaction failed:', error);
    if (onError) onError(error);
  };

  // Define the contract call
  const contracts = [
    {
      address: contractAddress,
      abi: [
        {
          name: functionName,
          type: 'function' as const,
          stateMutability: 'payable' as const,
          inputs: [],
          outputs: [],
        },
      ],
      functionName,
      args,
    },
  ];

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <Transaction
        address={address}
        contracts={contracts}
        chainId={base.id}
        onSuccess={handleOnSuccess}
        onError={handleOnError}
      >
        {children}
        
        <TransactionButton
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-xl transition-colors"
          text="Mint NFT"
        />
        
        <TransactionStatus className="mt-4">
          <TransactionStatusLabel className="text-sm font-medium" />
          <TransactionStatusAction className="mt-2" />
        </TransactionStatus>
      </Transaction>
    </div>
  );
}