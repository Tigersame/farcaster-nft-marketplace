'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useAccount } from 'wagmi';

interface ActivityFeedItem {
  id: string;
  type: 'sale' | 'listing' | 'bid' | 'offer' | 'mint' | 'transfer';
  action: string;
  user: {
    address: string;
    displayName: string;
    avatar: string;
    verified: boolean;
  };
  nft: {
    id: string;
    name: string;
    collection: string;
    image: string;
    price?: number;
    currency: 'ETH' | 'WETH' | 'USDC';
  };
  timestamp: Date;
  txHash?: string;
  isVisible: boolean;
  isPinned: boolean;
  priority: 'low' | 'medium' | 'high';
}

export default function LiveFeedManager() {
  const { hasPermission, currentAdmin, createContent } = useAdmin();
  const { address: connectedWallet } = useAccount();
  const [feedItems, setFeedItems] = useState<ActivityFeedItem[]>([]);
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  if (!hasPermission('canManageFeed')) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🚫</div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Access Denied
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          You don't have permission to manage the live feed.
        </p>
      </div>
    );
  }

  const generateMockActivity = (): ActivityFeedItem => {
    const activities = [
      { type: 'sale' as const, action: 'bought', nftName: 'Bored Ape #7583', collection: 'Bored Ape Yacht Club', price: 45.2, currency: 'ETH' as const },
      { type: 'listing' as const, action: 'listed', nftName: 'CryptoPunk #4156', collection: 'CryptoPunks', price: 89.5, currency: 'ETH' as const },
      { type: 'bid' as const, action: 'placed a bid on', nftName: 'Fidenza #313', collection: 'Fidenza by Tyler Hobbs', price: 12.8, currency: 'WETH' as const },
      { type: 'offer' as const, action: 'made an offer on', nftName: 'Azuki #9605', collection: 'Azuki', price: 8.2, currency: 'ETH' as const },
      { type: 'mint' as const, action: 'minted', nftName: 'Doodle #8765', collection: 'Doodles', price: 0.08, currency: 'ETH' as const }
    ];

    const users = [
      { name: 'VaultCorp', avatar: '🏛️', verified: true },
      { name: 'NFTWhale', avatar: '🐋', verified: true },
      { name: 'ArtCollector', avatar: '🎨', verified: false },
      { name: 'DiamondHands', avatar: '💎', verified: true },
      { name: 'CryptoKing', avatar: '👑', verified: false }
    ];

    const activity = activities[Math.floor(Math.random() * activities.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    
    return {
      id: `activity-${Date.now()}-${Math.random()}`,
      type: activity.type,
      action: activity.action,
      user: {
        address: `0x${Math.random().toString(16).slice(2, 42)}`,
        displayName: user.name,
        avatar: user.avatar,
        verified: user.verified
      },
      nft: {
        id: `nft-${Math.floor(Math.random() * 10000)}`,
        name: activity.nftName,
        collection: activity.collection,
        image: `https://via.placeholder.com/64x64/000000/FFFFFF?text=NFT`,
        price: activity.price,
        currency: activity.currency
      },
      timestamp: new Date(Date.now() - Math.random() * 1000 * 60 * 30),
      txHash: `0x${Math.random().toString(16).slice(2, 66)}`,
      isVisible: true,
      isPinned: Math.random() > 0.9,
      priority: Math.random() > 0.7 ? 'high' : 'medium'
    };
  };

  useEffect(() => {
    // Initialize with some mock data
    const initialItems = Array.from({ length: 10 }, () => generateMockActivity());
    setFeedItems(initialItems.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
  }, []);

  useEffect(() => {
    if (!autoRefresh || !isLiveMode) return;

    const interval = setInterval(() => {
      const newActivity = generateMockActivity();
      setFeedItems(prev => [newActivity, ...prev].slice(0, 50)); // Keep only latest 50 items
    }, 5000); // New activity every 5 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, isLiveMode]);

  const handleSaveWithWallet = async () => {
    if (!currentAdmin || !connectedWallet) {
      alert('Admin must be logged in and wallet connected to save changes');
      return;
    }

    setIsLoading(true);
    try {
      const feedData = {
        feedItems: feedItems,
        settings: { isLiveMode, autoRefresh, filterType },
        savedByWallet: connectedWallet,
        adminId: currentAdmin.id,
        timestamp: new Date().toISOString()
      };

      const contentId = await createContent('feed_item', `Live Feed Settings - ${new Date().toLocaleString()}`, feedData);
      
      alert(`Live feed settings saved successfully!\nContent ID: ${contentId}\nSaved by wallet: ${connectedWallet}`);
    } catch (error) {
      console.error('Error saving live feed with wallet:', error);
      alert('Failed to save live feed settings');
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sale': return '💰';
      case 'listing': return '📝';
      case 'bid': return '🔨';
      case 'offer': return '💌';
      case 'mint': return '✨';
      case 'transfer': return '🔄';
      default: return '📈';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'sale': return 'text-green-600 bg-green-50 border-green-200';
      case 'listing': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'bid': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'offer': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'mint': return 'text-pink-600 bg-pink-50 border-pink-200';
      case 'transfer': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const filteredItems = feedItems.filter(item => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">📡 Live Activity Feed</h1>
          <p className="text-gray-600 dark:text-gray-400">
            OpenSea-style real-time marketplace activity stream
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsLiveMode(!isLiveMode)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isLiveMode 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {isLiveMode ? '🟢 Live' : '⏸️ Paused'}
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Auto Refresh</span>
            </label>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">All Activity</option>
              <option value="sale">Sales</option>
              <option value="listing">Listings</option>
              <option value="bid">Bids</option>
              <option value="offer">Offers</option>
              <option value="mint">Mints</option>
              <option value="transfer">Transfers</option>
            </select>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            {filteredItems.length} activities • Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {filteredItems.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-2">📊</div>
              <p>No activity found for the selected filter</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredItems.map((item) => (
                <div key={item.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${getActivityColor(item.type)}`}>
                      {getActivityIcon(item.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {item.user.displayName}
                        </span>
                        {item.user.verified && (
                          <span className="text-blue-500" title="Verified">✓</span>
                        )}
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                          {item.action}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {item.nft.name}
                        </span>
                        {item.nft.price && (
                          <>
                            <span className="text-gray-500 dark:text-gray-400">for</span>
                            <span className="font-bold text-green-600">
                              {item.nft.price} {item.nft.currency}
                            </span>
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {item.nft.collection}
                        </span>
                        <span className="text-xs text-gray-400">
                          {item.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {item.isPinned && (
                        <span className="text-yellow-500" title="Pinned">📌</span>
                      )}
                      <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        ⋯
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Wallet-Based Save */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
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
            className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoading ? '⏳ Saving...' : '💾 Save Live Feed Settings with Admin Wallet'}
          </button>
          
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Feed settings are applied in real-time. Use "Save with Admin Wallet" to create a permanent record with ownership tracking.
          </p>
        </div>
      </div>
    </div>
  );
}