/**
 * Gasless Transaction Badge
 * 
 * Displays a badge indicating that transactions are gasless (sponsored by Paymaster)
 */

'use client';

import React from 'react';
import { useGaslessAvailable } from '@/hooks/useSmartAccount';

interface GaslessBadgeProps {
  className?: string;
  showTooltip?: boolean;
}

export const GaslessBadge: React.FC<GaslessBadgeProps> = ({ 
  className = '', 
  showTooltip = true 
}) => {
  const isGaslessAvailable = useGaslessAvailable();

  if (!isGaslessAvailable) {
    return null;
  }

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-medium shadow-lg">
        <svg 
          className="w-3.5 h-3.5" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path 
            fillRule="evenodd" 
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
            clipRule="evenodd" 
          />
        </svg>
        Gas Free
      </span>
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
          Transactions sponsored by Base Paymaster
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

/**
 * Gasless Status Indicator
 * 
 * Shows full status message about gasless transactions
 */
interface GaslessStatusProps {
  variant?: 'banner' | 'inline' | 'card';
  className?: string;
}

export const GaslessStatus: React.FC<GaslessStatusProps> = ({ 
  variant = 'inline',
  className = '' 
}) => {
  const isGaslessAvailable = useGaslessAvailable();

  if (!isGaslessAvailable) {
    return null;
  }

  const content = (
    <>
      <svg 
        className="w-5 h-5 text-green-500 flex-shrink-0" 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path 
          fillRule="evenodd" 
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
          clipRule="evenodd" 
        />
      </svg>
      <div>
        <p className="font-medium text-gray-900 dark:text-white">
          ✨ Gas-Free Transactions Enabled
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          All transaction fees are sponsored. You pay nothing for gas!
        </p>
      </div>
    </>
  );

  if (variant === 'banner') {
    return (
      <div className={`bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 ${className}`}>
        <div className="flex items-start gap-3">
          {content}
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-green-200 dark:border-green-800 ${className}`}>
        <div className="flex items-start gap-4">
          {content}
        </div>
      </div>
    );
  }

  // inline variant
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {content}
    </div>
  );
};

/**
 * Smart Account Address Display
 * 
 * Shows the user's Smart Account address with copy functionality
 */
import { useSmartAccount } from '@/hooks/useSmartAccount';

export const SmartAccountAddress: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { smartAccountAddress, isReady, isLoading } = useSmartAccount();
  const [copied, setCopied] = React.useState(false);

  if (!smartAccountAddress) {
    return null;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(smartAccountAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shortAddress = `${smartAccountAddress.slice(0, 6)}...${smartAccountAddress.slice(-4)}`;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        <span className="font-mono text-gray-700 dark:text-gray-300">
          {shortAddress}
        </span>
        <button
          onClick={handleCopy}
          className="ml-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          title="Copy Smart Account address"
        >
          {copied ? (
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
          )}
        </button>
      </div>
      
      {isLoading && (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Initializing...
        </span>
      )}
      {isReady && (
        <span className="text-xs text-green-600 dark:text-green-400 font-medium">
          Smart Account Active
        </span>
      )}
    </div>
  );
};

/**
 * Transaction Status Toast
 * 
 * Shows transaction progress with gasless indicator
 */
interface TransactionToastProps {
  status: 'pending' | 'success' | 'error';
  message: string;
  txHash?: string;
  isGasless?: boolean;
}

export const TransactionToast: React.FC<TransactionToastProps> = ({
  status,
  message,
  txHash,
  isGasless = false,
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return (
          <svg className="animate-spin w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        );
      case 'success':
        return (
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 min-w-[320px]">
      {getStatusIcon()}
      
      <div className="flex-1">
        <p className="font-medium text-gray-900 dark:text-white">
          {message}
        </p>
        
        {isGasless && status === 'success' && (
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
            ✨ Gas fees sponsored (You paid $0!)
          </p>
        )}
        
        {txHash && (
          <a
            href={`https://basescan.org/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block"
          >
            View on BaseScan →
          </a>
        )}
      </div>
    </div>
  );
};
