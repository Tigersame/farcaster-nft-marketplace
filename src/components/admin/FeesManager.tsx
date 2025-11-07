'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';

export default function FeesManager() {
  const { settings, updateSettings, hasPermission } = useAdmin();
  const [isLoading, setIsLoading] = useState(false);
  const [previewRevenue, setPreviewRevenue] = useState(false);

  if (!hasPermission('canManageFees')) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🚫</div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Access Denied
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          You don't have permission to manage fees.
        </p>
      </div>
    );
  }

  const updateFee = async (feeKey: keyof typeof settings, value: number) => {
    setIsLoading(true);
    try {
      await updateSettings({ [feeKey]: value });
    } catch (error) {
      console.error('Error updating fee:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const feeConfig = [
    {
      key: 'platformFee',
      label: 'Platform Fee',
      description: 'Percentage taken from each sale',
      type: 'percentage',
      min: 0,
      max: 10,
      step: 0.1,
      suffix: '%',
      recommendation: '2.5% (industry standard)',
    },
    {
      key: 'royaltyFee',
      label: 'Creator Royalty Fee',
      description: 'Percentage paid to original creator on resales',
      type: 'percentage',
      min: 0,
      max: 20,
      step: 0.5,
      suffix: '%',
      recommendation: '5-10% (most common)',
    },
    {
      key: 'listingFee',
      label: 'Listing Fee',
      description: 'One-time fee to list an NFT',
      type: 'eth',
      min: 0,
      max: 0.1,
      step: 0.001,
      suffix: ' ETH',
      recommendation: '0.001-0.005 ETH',
    },
    {
      key: 'transactionFee',
      label: 'Transaction Fee',
      description: 'Additional fee per transaction',
      type: 'percentage',
      min: 0,
      max: 5,
      step: 0.1,
      suffix: '%',
      recommendation: '0.5-1% (optional)',
    },
    {
      key: 'withdrawalFee',
      label: 'Withdrawal Fee',
      description: 'Fee for withdrawing earnings',
      type: 'eth',
      min: 0,
      max: 0.01,
      step: 0.001,
      suffix: ' ETH',
      recommendation: '0.002-0.005 ETH',
    },
  ];

  // Revenue projection calculations
  const calculateRevenue = () => {
    const mockData = {
      monthlySales: 1000,
      averageSalePrice: 0.5, // ETH
      monthlyListings: 500,
      monthlyWithdrawals: 200,
    };

    const platformRevenue = mockData.monthlySales * mockData.averageSalePrice * (settings.platformFee / 100);
    const transactionRevenue = mockData.monthlySales * mockData.averageSalePrice * (settings.transactionFee / 100);
    const listingRevenue = mockData.monthlyListings * settings.listingFee;
    const withdrawalRevenue = mockData.monthlyWithdrawals * settings.withdrawalFee;

    return {
      platform: platformRevenue,
      transaction: transactionRevenue,
      listing: listingRevenue,
      withdrawal: withdrawalRevenue,
      total: platformRevenue + transactionRevenue + listingRevenue + withdrawalRevenue,
    };
  };

  const revenue = calculateRevenue();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Fees Management 💰
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Configure marketplace fees and revenue settings
          </p>
        </div>
        <button
          onClick={() => setPreviewRevenue(!previewRevenue)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            previewRevenue
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          {previewRevenue ? 'Hide Revenue' : 'Preview Revenue'}
        </button>
      </div>

      {/* Revenue Preview */}
      {previewRevenue && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
          <h2 className="text-xl font-bold mb-4">💰 Monthly Revenue Projection</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{revenue.platform.toFixed(3)} ETH</div>
              <div className="text-green-100 text-sm">Platform Fees</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{revenue.transaction.toFixed(3)} ETH</div>
              <div className="text-green-100 text-sm">Transaction Fees</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{revenue.listing.toFixed(3)} ETH</div>
              <div className="text-green-100 text-sm">Listing Fees</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{revenue.withdrawal.toFixed(3)} ETH</div>
              <div className="text-green-100 text-sm">Withdrawal Fees</div>
            </div>
            <div className="text-center border-l border-green-300 pl-4">
              <div className="text-3xl font-bold">{revenue.total.toFixed(3)} ETH</div>
              <div className="text-green-100 text-sm">Total Revenue</div>
            </div>
          </div>
          <p className="text-green-100 text-sm mt-4">
            * Based on 1,000 monthly sales at 0.5 ETH average price
          </p>
        </div>
      )}

      {/* Fee Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {feeConfig.map((fee) => (
          <div
            key={fee.key}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {fee.label}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {fee.description}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {(settings[fee.key as keyof typeof settings] as number).toFixed(fee.type === 'eth' ? 3 : 1)}{fee.suffix}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Set {fee.label}
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min={fee.min}
                    max={fee.max}
                    step={fee.step}
                    value={settings[fee.key as keyof typeof settings] as number}
                    onChange={(e) => updateFee(fee.key as keyof typeof settings, parseFloat(e.target.value))}
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <input
                    type="number"
                    min={fee.min}
                    max={fee.max}
                    step={fee.step}
                    value={settings[fee.key as keyof typeof settings] as number}
                    onChange={(e) => updateFee(fee.key as keyof typeof settings, parseFloat(e.target.value))}
                    className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    💡 {fee.recommendation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fee Impact Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Fee Impact Analysis
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sample Transaction Breakdown */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3">
              Sample Sale: 1.0 ETH
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Sale Price:</span>
                <span className="font-medium">1.000 ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Platform Fee ({settings.platformFee}%):</span>
                <span className="text-red-600 dark:text-red-400">-{(1.0 * settings.platformFee / 100).toFixed(3)} ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Transaction Fee ({settings.transactionFee}%):</span>
                <span className="text-red-600 dark:text-red-400">-{(1.0 * settings.transactionFee / 100).toFixed(3)} ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Creator Royalty ({settings.royaltyFee}%):</span>
                <span className="text-orange-600 dark:text-orange-400">-{(1.0 * settings.royaltyFee / 100).toFixed(3)} ETH</span>
              </div>
              <hr className="border-gray-300 dark:border-gray-600" />
              <div className="flex justify-between font-bold">
                <span>Seller Receives:</span>
                <span className="text-green-600 dark:text-green-400">
                  {(1.0 - (settings.platformFee + settings.transactionFee + settings.royaltyFee) / 100).toFixed(3)} ETH
                </span>
              </div>
            </div>
          </div>

          {/* Competitive Analysis */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3">
              Competitive Rates
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">OpenSea:</span>
                <span>2.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Blur:</span>
                <span>0.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Foundation:</span>
                <span>15%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">SuperRare:</span>
                <span>15%</span>
              </div>
              <hr className="border-gray-300 dark:border-gray-600" />
              <div className="flex justify-between font-bold">
                <span>Your Platform:</span>
                <span className={`${
                  settings.platformFee <= 2.5 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {settings.platformFee}%
                </span>
              </div>
            </div>
          </div>

          {/* Fee Recommendations */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3">
              Recommendations
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <span className="text-green-500">✓</span>
                <span className="text-gray-600 dark:text-gray-400">
                  Keep platform fees competitive (≤2.5%)
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-green-500">✓</span>
                <span className="text-gray-600 dark:text-gray-400">
                  Balance creator royalties (5-10%)
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-green-500">✓</span>
                <span className="text-gray-600 dark:text-gray-400">
                  Minimize listing fees for adoption
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-500">💡</span>
                <span className="text-gray-600 dark:text-gray-400">
                  Consider dynamic fees based on volume
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => {
              updateFee('platformFee', 2.5);
              updateFee('royaltyFee', 7.5);
              updateFee('listingFee', 0.001);
              updateFee('transactionFee', 0);
              updateFee('withdrawalFee', 0.002);
            }}
            className="p-4 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg text-center transition-colors"
          >
            <div className="text-2xl mb-2">🔥</div>
            <div className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Competitive Setup
            </div>
          </button>
          
          <button
            onClick={() => {
              updateFee('platformFee', 1.0);
              updateFee('royaltyFee', 5.0);
              updateFee('listingFee', 0);
              updateFee('transactionFee', 0);
              updateFee('withdrawalFee', 0);
            }}
            className="p-4 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-lg text-center transition-colors"
          >
            <div className="text-2xl mb-2">🚀</div>
            <div className="text-sm font-medium text-green-700 dark:text-green-300">
              Growth Mode
            </div>
          </button>
          
          <button
            onClick={() => {
              updateFee('platformFee', 5.0);
              updateFee('royaltyFee', 15.0);
              updateFee('listingFee', 0.005);
              updateFee('transactionFee', 2.0);
              updateFee('withdrawalFee', 0.01);
            }}
            className="p-4 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-lg text-center transition-colors"
          >
            <div className="text-2xl mb-2">💎</div>
            <div className="text-sm font-medium text-purple-700 dark:text-purple-300">
              Premium Model
            </div>
          </button>
          
          <button
            onClick={() => {
              updateFee('platformFee', 2.5);
              updateFee('royaltyFee', 10);
              updateFee('listingFee', 0.001);
              updateFee('transactionFee', 1);
              updateFee('withdrawalFee', 0.005);
            }}
            className="p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg text-center transition-colors"
          >
            <div className="text-2xl mb-2">🔄</div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Reset Defaults
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}