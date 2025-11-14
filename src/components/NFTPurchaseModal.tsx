'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusLabel,
  TransactionStatusAction,
} from '@coinbase/onchainkit/transaction';
import { TRANSACTION_DESCRIPTIONS } from '@/lib/transactionMetadata';
import { FiX } from 'react-icons/fi';

interface NFTPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  nftName: string;
  nftPrice: string;
  tokenId: string;
  contractAddress: string;
  onSuccess?: () => void;
}

export function NFTPurchaseModal({
  isOpen,
  onClose,
  nftName,
  nftPrice,
  tokenId,
  contractAddress,
  onSuccess,
}: NFTPurchaseModalProps) {
  const [transactionStatus, setTransactionStatus] = useState<string>('init');
  const { address } = useAccount();

  if (!isOpen) return null;

  // Transaction calls with custom metadata
  const contracts = [
    {
      address: contractAddress as `0x${string}`,
      abi: [
        {
          name: 'buyNFT',
          type: 'function' as const,
          stateMutability: 'payable' as const,
          inputs: [{ name: 'tokenId', type: 'uint256' as const }],
          outputs: [],
        },
      ] as const,
      functionName: 'buyNFT' as const,
      args: [BigInt(tokenId)],
      value: BigInt(Math.floor(parseFloat(nftPrice) * 1e18)),
    },
  ];

  // Custom transaction metadata for branded tray
  const transactionMetadata = {
    description: TRANSACTION_DESCRIPTIONS.buyNFT(nftName, nftPrice),
    hostname: 'farcastmints.com',
    faviconUrl: '/favicon.ico',
    title: 'FarcasterSea NFT Marketplace',
  };

  const handleOnStatus = (status: any) => {
    setTransactionStatus(status.statusName || 'init');
    
    if (status.statusName === 'success') {
      onSuccess?.();
      setTimeout(() => {
        onClose();
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          disabled={transactionStatus === 'pending'}
        >
          <FiX className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Purchase NFT
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Complete your purchase on the Base network
          </p>
        </div>

        {/* NFT Details */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">NFT</span>
            <span className="font-semibold text-gray-900 dark:text-white">{nftName}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Token ID</span>
            <span className="font-mono text-sm text-gray-900 dark:text-white">#{tokenId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Price</span>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {nftPrice} ETH
            </span>
          </div>
        </div>

        {/* Transaction Component with Custom Metadata */}
        {address ? (
          <Transaction
            address={address}
            contracts={contracts}
            chainId={8453}
          >
            <TransactionButton
              text="Confirm Purchase"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
            />
            <TransactionStatus>
              <TransactionStatusLabel className="text-center py-4" />
              <TransactionStatusAction className="mt-4" />
            </TransactionStatus>
          </Transaction>
        ) : (
          <div className="w-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-semibold py-3 rounded-xl text-center">
            Please connect your wallet
          </div>
        )}

        {/* Info */}
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
          Transaction will be processed on Base network. Gas fees may apply.
        </p>
      </div>
    </div>
  );
}
