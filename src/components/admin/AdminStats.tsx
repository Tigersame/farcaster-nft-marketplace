'use client';

import React from 'react';
import { useAdmin } from '@/contexts/AdminContext';

export default function AdminStats() {
  const { currentAdmin, settings } = useAdmin();

  const stats = [
    {
      title: 'Total NFTs',
      value: '1,234',
      change: '+12%',
      changeType: 'increase',
      icon: '🖼️',
    },
    {
      title: 'Active Collections',
      value: '56',
      change: '+3',
      changeType: 'increase',
      icon: '📂',
    },
    {
      title: 'Total Volume',
      value: '2,456 ETH',
      change: '+18%',
      changeType: 'increase',
      icon: '💰',
    },
    {
      title: 'Active Users',
      value: '8,924',
      change: '+5%',
      changeType: 'increase',
      icon: '👥',
    },
  ];

  const recentActivity = [
    { type: 'nft_created', message: 'New NFT "Digital Dreams #123" created', time: '2 minutes ago' },
    { type: 'collection_updated', message: 'Collection "Pixel Art" updated', time: '5 minutes ago' },
    { type: 'fee_changed', message: 'Platform fee updated to 2.5%', time: '1 hour ago' },
    { type: 'theme_changed', message: 'Theme colors updated', time: '2 hours ago' },
    { type: 'user_registered', message: '15 new users registered', time: '3 hours ago' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'nft_created': return '🆕';
      case 'collection_updated': return '📝';
      case 'fee_changed': return '💰';
      case 'theme_changed': return '🎨';
      case 'user_registered': return '👤';
      default: return '📊';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {currentAdmin?.username}! 👋
        </h1>
        <p className="text-indigo-100">
          Here's what's happening with your marketplace today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div className="text-2xl">{stat.icon}</div>
              <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                stat.changeType === 'increase'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
              }`}>
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stat.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="text-lg">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Current Settings
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Platform Fee</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {settings.platformFee}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Royalty Fee</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {settings.royaltyFee}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Listing Fee</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {settings.listingFee} ETH
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Chat Enabled</span>
              <span className={`text-sm font-medium ${
                settings.features.enableChat 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {settings.features.enableChat ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Social Proof</span>
              <span className={`text-sm font-medium ${
                settings.features.enableSocialProof 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {settings.features.enableSocialProof ? 'Yes' : 'No'}
              </span>
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
          <button className="flex items-center justify-center p-4 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition-colors group">
            <div className="text-center">
              <div className="text-2xl mb-2">🎨</div>
              <div className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                Customize Theme
              </div>
            </div>
          </button>
          <button className="flex items-center justify-center p-4 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-lg transition-colors group">
            <div className="text-center">
              <div className="text-2xl mb-2">🖼️</div>
              <div className="text-sm font-medium text-green-700 dark:text-green-300">
                Add NFT
              </div>
            </div>
          </button>
          <button className="flex items-center justify-center p-4 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-lg transition-colors group">
            <div className="text-center">
              <div className="text-2xl mb-2">📂</div>
              <div className="text-sm font-medium text-purple-700 dark:text-purple-300">
                New Collection
              </div>
            </div>
          </button>
          <button className="flex items-center justify-center p-4 bg-orange-50 dark:bg-orange-900/30 hover:bg-orange-100 dark:hover:bg-orange-900/50 rounded-lg transition-colors group">
            <div className="text-center">
              <div className="text-2xl mb-2">💰</div>
              <div className="text-sm font-medium text-orange-700 dark:text-orange-300">
                Update Fees
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}