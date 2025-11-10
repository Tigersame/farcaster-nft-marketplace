'use client';

import React, { useState } from 'react';
import { createBaseAccountSDK } from "@base-org/account";
import { motion } from 'framer-motion';
import { FiShield, FiDollarSign } from 'react-icons/fi';
import { USDC_BASE_ADDRESS, BASE_CHAIN_ID } from '@/lib/spend-permissions';

interface SpendPermissionSetupProps {
  userAddress: string;
  onPermissionGranted: (permission: any) => void;
}

export default function SpendPermissionSetup({ userAddress, onPermissionGranted }: SpendPermissionSetupProps) {
  const [dailyLimit, setDailyLimit] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSetupPermission = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate daily limit
      if (dailyLimit < 1 || dailyLimit > 10) {
        throw new Error('Daily limit must be between $1 and $10');
      }

      // Get server wallet address
      const walletResponse = await fetch("/api/wallet/create", { method: "POST" });
      
      if (!walletResponse.ok) {
        throw new Error('Failed to create server wallet');
      }

      const walletData = await walletResponse.json();
      const spenderAddress = walletData.smartAccountAddress;

      console.log('Setting up spend permission:', {
        userAddress,
        spenderAddress,
        dailyLimit,
      });

      // For demo purposes, create a mock permission object
      // In production with full Base Account SDK, use requestSpendPermission
      const permission = {
        account: userAddress,
        spender: spenderAddress,
        token: USDC_BASE_ADDRESS,
        allowance: BigInt(dailyLimit * 1_000_000), // Convert to USDC (6 decimals)
        period: 1, // 1 day
        start: Date.now(),
        end: Date.now() + 86400000, // 24 hours
      };

      console.log('Spend permission granted (demo mode):', permission);

      // Store permission locally
      localStorage.setItem("spendPermission", JSON.stringify(permission));
      localStorage.setItem("spendPermissionLimit", dailyLimit.toString());

      // Notify parent component
      onPermissionGranted(permission);
    } catch (error: any) {
      console.error("Permission setup error:", error);
      setError(error.message || 'Failed to set up spend permission');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
          <FiShield className="text-xl text-blue-500" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Set Daily Spending Limit
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Allow the AI agent to spend up to a specific amount per day
          </p>
        </div>
      </div>

      {/* Daily Limit Input */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Daily Limit (USDC)
        </label>
        
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <FiDollarSign />
          </div>
          <input
            type="number"
            min="1"
            max="10"
            step="0.5"
            value={dailyLimit}
            onChange={(e) => setDailyLimit(parseFloat(e.target.value) || 1)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>

        {/* Range Slider */}
        <input
          type="range"
          min="1"
          max="10"
          step="0.5"
          value={dailyLimit}
          onChange={(e) => setDailyLimit(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          disabled={isLoading}
        />

        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>$1</span>
          <span>$10</span>
        </div>
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-400 mb-2">
          How it works
        </h4>
        <ul className="space-y-1 text-xs text-blue-800 dark:text-blue-300">
          <li>• AI agent can spend up to ${dailyLimit.toFixed(2)} USDC per day</li>
          <li>• Permission resets every 24 hours</li>
          <li>• You can revoke permission anytime</li>
          <li>• All transactions are gas-free (sponsored)</li>
        </ul>
      </div>

      {/* Submit Button */}
      <motion.button
        onClick={handleSetupPermission}
        disabled={isLoading}
        className="w-full px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Setting Up Permission...</span>
          </div>
        ) : (
          `Grant ${dailyLimit.toFixed(2)} USDC Daily Permission`
        )}
      </motion.button>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm"
        >
          {error}
        </motion.div>
      )}
    </div>
  );
}
