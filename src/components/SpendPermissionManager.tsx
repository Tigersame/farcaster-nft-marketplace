'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiDollarSign, FiClock } from 'react-icons/fi';
import { getUserSpendPermissions, revokeSpendPermission, formatUSDC } from '@/lib/spend-permissions';

interface SpendPermissionManagerProps {
  isAuthenticated: boolean;
  userAddress: string | null;
}

interface Permission {
  id: string;
  permission: {
    token: string;
    allowance: string;
    period: number;
  };
  status: 'active' | 'expired';
}

export default function SpendPermissionManager({ isAuthenticated, userAddress }: SpendPermissionManagerProps) {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRevoking, setIsRevoking] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadPermissions = async () => {
    if (!userAddress || !isAuthenticated) {
      setPermissions([]);
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      // Get server wallet address
      const walletResponse = await fetch("/api/wallet/create", { method: "POST" });
      
      if (!walletResponse.ok) {
        throw new Error('Failed to get wallet address');
      }

      const { smartAccountAddress } = await walletResponse.json();

      // Fetch user's spend permissions
      const userPermissions = await getUserSpendPermissions(userAddress, smartAccountAddress);
      
      // @ts-ignore - Permission type structure
      setPermissions(userPermissions);
    } catch (error: any) {
      console.error('Error loading permissions:', error);
      setError(error.message || 'Failed to load permissions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokePermission = async (permission: Permission) => {
    setIsRevoking(permission.id);
    setError(null);

    try {
      const result = await revokeSpendPermission(permission);
      console.log('Permission revoked:', result.id);
      
      // Reload permissions
      await loadPermissions();
    } catch (error: any) {
      console.error('Revoke error:', error);
      setError(error.message || 'Failed to revoke permission');
    } finally {
      setIsRevoking(null);
    }
  };

  // Load permissions when authenticated
  useEffect(() => {
    loadPermissions();
  }, [isAuthenticated, userAddress]);

  if (!isAuthenticated || !userAddress) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Active Permissions
        </h3>
        <motion.button
          onClick={loadPermissions}
          disabled={isLoading}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </motion.button>
      </div>

      {/* Permissions List */}
      <AnimatePresence mode="wait">
        {isLoading && permissions.length === 0 ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-8 text-center"
          >
            <div className="w-8 h-8 mx-auto border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">Loading permissions...</p>
          </motion.div>
        ) : permissions.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-8 text-center rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
          >
            <FiCheckCircle className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              No Active Permissions
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Set up a spend permission to start using the AI agent
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="permissions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {permissions.map((permission) => (
              <motion.div
                key={permission.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Permission Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <FiDollarSign className="text-green-500" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        Daily Limit: {formatUSDC(permission.permission.allowance)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <FiClock />
                      <span>Resets every {permission.permission.period} day(s)</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {permission.status === 'active' ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400">
                          <FiCheckCircle className="text-xs" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400">
                          <FiXCircle className="text-xs" />
                          Expired
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Revoke Button */}
                  <motion.button
                    onClick={() => handleRevokePermission(permission)}
                    disabled={isRevoking === permission.id}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: isRevoking === permission.id ? 1 : 1.05 }}
                    whileTap={{ scale: isRevoking === permission.id ? 1 : 0.95 }}
                  >
                    {isRevoking === permission.id ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        <span>Revoking...</span>
                      </div>
                    ) : (
                      'Revoke'
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

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
