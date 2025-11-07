'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useAccount } from 'wagmi';

export default function RevenueManager() {
  const { settings, updateSettings, hasPermission, currentAdmin, createContent } = useAdmin();
  const { address: connectedWallet } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [showWalletInput, setShowWalletInput] = useState(false);
  const [newWalletAddress, setNewWalletAddress] = useState('');

  if (!hasPermission('canManageFees')) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🚫</div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Access Denied
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          You don't have permission to manage revenue settings.
        </p>
      </div>
    );
  }

  const handleUpdateRevenueWallet = async (walletAddress: string) => {
    if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      alert('Please enter a valid Ethereum wallet address');
      return;
    }

    setIsLoading(true);
    try {
      await updateSettings({ revenueWallet: walletAddress });
      setNewWalletAddress('');
      setShowWalletInput(false);
      alert('Revenue wallet updated successfully!');
    } catch (error) {
      console.error('Error updating revenue wallet:', error);
      alert('Failed to update revenue wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawalSettingUpdate = async (setting: string, value: any) => {
    setIsLoading(true);
    try {
      await updateSettings({ [setting]: value });
    } catch (error) {
      console.error('Error updating withdrawal setting:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveWithWallet = async () => {
    if (!currentAdmin || !connectedWallet) {
      alert('Admin must be logged in and wallet connected to save changes');
      return;
    }

    setIsLoading(true);
    try {
      const revenueData = {
        revenueWallet: settings.revenueWallet,
        autoWithdrawThreshold: settings.autoWithdrawThreshold,
        enableAutoWithdraw: settings.enableAutoWithdraw,
        withdrawalSchedule: settings.withdrawalSchedule,
        savedByWallet: connectedWallet,
        adminId: currentAdmin.id,
        timestamp: new Date().toISOString()
      };

      const contentId = await createContent('setting', `Revenue Settings - ${new Date().toLocaleString()}`, revenueData);
      
      alert(`Revenue settings saved successfully!\nContent ID: ${contentId}\nSaved by wallet: ${connectedWallet}`);
    } catch (error) {
      console.error('Error saving revenue settings with wallet:', error);
      alert('Failed to save revenue settings');
    } finally {
      setIsLoading(false);
    }
  };

  // Mock revenue data (in production, this would come from smart contracts)
  const mockRevenueData = {
    totalCollected: 45.67,
    pendingWithdrawal: 12.34,
    monthlyRevenue: 23.45,
    weeklyRevenue: 8.91,
    lastWithdrawal: '2024-11-01T10:30:00Z',
    transactionCount: 156
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Revenue Manager</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Configure revenue collection and withdrawal settings
          </p>
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Collected</p>
              <p className="text-2xl font-bold">{mockRevenueData.totalCollected} ETH</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Pending Withdrawal</p>
              <p className="text-2xl font-bold">{mockRevenueData.pendingWithdrawal} ETH</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Monthly Revenue</p>
              <p className="text-2xl font-bold">{mockRevenueData.monthlyRevenue} ETH</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Transactions</p>
              <p className="text-2xl font-bold">{mockRevenueData.transactionCount}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Wallet Configuration */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Revenue Collection Wallet
          </h2>
          <button
            onClick={() => setShowWalletInput(!showWalletInput)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {settings.revenueWallet ? 'Change Wallet' : 'Set Wallet'}
          </button>
        </div>

        {settings.revenueWallet ? (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-3">
              <div className="bg-green-500 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Revenue Wallet Configured</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                  {settings.revenueWallet.slice(0, 10)}...{settings.revenueWallet.slice(-8)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-500 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">No Revenue Wallet Set</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Please configure a wallet address to collect platform revenue
                </p>
              </div>
            </div>
          </div>
        )}

        {showWalletInput && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Wallet Address (0x...)
            </label>
            <div className="flex space-x-3">
              <input
                type="text"
                value={newWalletAddress}
                onChange={(e) => setNewWalletAddress(e.target.value)}
                placeholder="0x1234567890123456789012345678901234567890"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
              />
              <button
                onClick={() => handleUpdateRevenueWallet(newWalletAddress)}
                disabled={isLoading || !newWalletAddress}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowWalletInput(false);
                  setNewWalletAddress('');
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
            </div>
            {connectedWallet && (
              <button
                onClick={() => setNewWalletAddress(connectedWallet)}
                className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Use current connected wallet ({connectedWallet.slice(0, 8)}...)
              </button>
            )}
          </div>
        )}
      </div>

      {/* Withdrawal Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Automatic Withdrawal Settings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.enableAutoWithdraw}
                onChange={(e) => handleWithdrawalSettingUpdate('enableAutoWithdraw', e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-gray-900 dark:text-white font-medium">
                Enable Automatic Withdrawal
              </span>
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 ml-8">
              Automatically withdraw funds to revenue wallet when conditions are met
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Auto Withdrawal Threshold (ETH)
            </label>
            <input
              type="number"
              value={settings.autoWithdrawThreshold}
              onChange={(e) => handleWithdrawalSettingUpdate('autoWithdrawThreshold', parseFloat(e.target.value))}
              min="0.1"
              max="100"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              disabled={!settings.enableAutoWithdraw}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Withdrawal Schedule
            </label>
            <select
              value={settings.withdrawalSchedule}
              onChange={(e) => handleWithdrawalSettingUpdate('withdrawalSchedule', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              disabled={!settings.enableAutoWithdraw}
            >
              <option value="immediate">Immediate (when threshold reached)</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>
      </div>

      {/* Manual Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Manual Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            disabled={!settings.revenueWallet}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            💰 Withdraw Now
          </button>
          
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            📊 Generate Report
          </button>
          
          <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
            📈 View Analytics
          </button>
        </div>
      </div>

      {/* Wallet-Based Save */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          💼 Admin Wallet Save
        </h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Admin Status:</p>
              <p className="font-mono text-sm bg-white dark:bg-gray-800 p-2 rounded border">
                {currentAdmin ? `✅ ${currentAdmin.username} (${currentAdmin.role})` : '❌ Not logged in'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Connected Wallet:</p>
              <p className="font-mono text-sm bg-white dark:bg-gray-800 p-2 rounded border">
                {connectedWallet ? `🔗 ${connectedWallet.slice(0, 8)}...${connectedWallet.slice(-6)}` : '❌ Not connected'}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleSaveWithWallet}
            disabled={isLoading || !currentAdmin || !connectedWallet}
            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoading ? '⏳ Saving...' : '💾 Save Revenue Settings with Admin Wallet'}
          </button>
          
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Revenue settings are automatically applied. Use "Save with Admin Wallet" to create a permanent record with ownership tracking.
          </p>
        </div>
      </div>
    </div>
  );
}