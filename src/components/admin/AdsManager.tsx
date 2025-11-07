'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useAccount } from 'wagmi';

interface AdBanner {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  position: 'top' | 'bottom' | 'sidebar' | 'inline';
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  clickCount: number;
  impressionCount: number;
  targetAudience: 'all' | 'collectors' | 'creators' | 'traders';
  priority: number;
  createdBy: string;
}

export default function AdsManager() {
  const { hasPermission, currentAdmin, createContent } = useAdmin();
  const { address: connectedWallet } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<string>('top');
  
  // Mock ad data
  const [ads, setAds] = useState<AdBanner[]>([
    {
      id: '1',
      title: 'Top NFT Collection',
      description: 'Trending Bored Apes - Up to 40% Off',
      imageUrl: 'https://via.placeholder.com/728x90/000000/FFFFFF?text=BORED+APES+SALE',
      linkUrl: '/collection/bored-apes',
      position: 'top',
      isActive: true,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      clickCount: 1250,
      impressionCount: 45000,
      targetAudience: 'collectors',
      priority: 1,
      createdBy: 'admin'
    },
    {
      id: '2', 
      title: 'New Listing Alert',
      description: 'Fresh CryptoPunks just dropped!',
      imageUrl: 'https://via.placeholder.com/300x250/FF6B35/FFFFFF?text=NEW+PUNKS',
      linkUrl: '/collection/cryptopunks',
      position: 'sidebar',
      isActive: true,
      startDate: new Date(),
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      clickCount: 890,
      impressionCount: 32000,
      targetAudience: 'all',
      priority: 2,
      createdBy: 'admin'
    },
    {
      id: '3',
      title: 'Creator Spotlight',
      description: 'Featured Artist: Digital Dreams Collection',
      imageUrl: 'https://via.placeholder.com/728x90/8B5CF6/FFFFFF?text=ARTIST+SPOTLIGHT',
      linkUrl: '/creator/digital-dreams',
      position: 'bottom',
      isActive: true,
      startDate: new Date(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      clickCount: 567,
      impressionCount: 28000,
      targetAudience: 'creators',
      priority: 3,
      createdBy: 'admin'
    }
  ]);

  const [newAd, setNewAd] = useState({
    title: '',
    description: '',
    imageUrl: '',
    linkUrl: '',
    position: 'top' as AdBanner['position'],
    targetAudience: 'all' as AdBanner['targetAudience'],
    priority: 1,
    durationDays: 7
  });

  if (!hasPermission('canManageSettings')) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🚫</div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Access Denied
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          You don't have permission to manage advertisements.
        </p>
      </div>
    );
  }

  const handleCreateAd = async () => {
    if (!newAd.title || !newAd.imageUrl || !newAd.linkUrl) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const adData: AdBanner = {
        id: `ad-${Date.now()}`,
        title: newAd.title,
        description: newAd.description,
        imageUrl: newAd.imageUrl,
        linkUrl: newAd.linkUrl,
        position: newAd.position,
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + newAd.durationDays * 24 * 60 * 60 * 1000),
        clickCount: 0,
        impressionCount: 0,
        targetAudience: newAd.targetAudience,
        priority: newAd.priority,
        createdBy: currentAdmin?.username || 'admin'
      };

      setAds(prev => [...prev, adData]);
      setShowCreateModal(false);
      setNewAd({
        title: '',
        description: '',
        imageUrl: '',
        linkUrl: '',
        position: 'top',
        targetAudience: 'all',
        priority: 1,
        durationDays: 7
      });

      alert('Advertisement created successfully!');
    } catch (error) {
      console.error('Error creating ad:', error);
      alert('Failed to create advertisement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAd = (adId: string) => {
    setAds(prev => prev.map(ad => 
      ad.id === adId ? { ...ad, isActive: !ad.isActive } : ad
    ));
  };

  const handleDeleteAd = (adId: string) => {
    if (confirm('Are you sure you want to delete this advertisement?')) {
      setAds(prev => prev.filter(ad => ad.id !== adId));
    }
  };

  const handleSaveWithWallet = async () => {
    if (!currentAdmin || !connectedWallet) {
      alert('Admin must be logged in and wallet connected to save changes');
      return;
    }

    setIsLoading(true);
    try {
      const adsData = {
        advertisements: ads,
        settings: { selectedPosition },
        savedByWallet: connectedWallet,
        adminId: currentAdmin.id,
        timestamp: new Date().toISOString()
      };

      const contentId = await createContent('setting', `Ads Configuration - ${new Date().toLocaleString()}`, adsData);
      
      alert(`Advertisements saved successfully!\nContent ID: ${contentId}\nSaved by wallet: ${connectedWallet}`);
    } catch (error) {
      console.error('Error saving ads with wallet:', error);
      alert('Failed to save advertisements');
    } finally {
      setIsLoading(false);
    }
  };

  const getAdPreview = (ad: AdBanner) => {
    const sizes = {
      top: 'w-full h-24 max-w-4xl',
      bottom: 'w-full h-24 max-w-4xl', 
      sidebar: 'w-72 h-64',
      inline: 'w-full h-32 max-w-2xl'
    };

    return sizes[ad.position] || sizes.top;
  };

  const filteredAds = selectedPosition === 'all' 
    ? ads 
    : ads.filter(ad => ad.position === selectedPosition);

  const totalStats = {
    totalClicks: ads.reduce((sum, ad) => sum + ad.clickCount, 0),
    totalImpressions: ads.reduce((sum, ad) => sum + ad.impressionCount, 0),
    activeAds: ads.filter(ad => ad.isActive).length,
    ctr: ads.reduce((sum, ad) => sum + ad.impressionCount, 0) > 0 
      ? ((ads.reduce((sum, ad) => sum + ad.clickCount, 0) / ads.reduce((sum, ad) => sum + ad.impressionCount, 0)) * 100).toFixed(2)
      : '0.00'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">🎯 Advertisement Manager</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create and manage HTML ads for top NFTs and new listings
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg"
        >
          ✨ Create New Ad
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Clicks</p>
              <p className="text-2xl font-bold">{totalStats.totalClicks.toLocaleString()}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <span className="text-2xl">👆</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Impressions</p>
              <p className="text-2xl font-bold">{totalStats.totalImpressions.toLocaleString()}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <span className="text-2xl">👁️</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Active Ads</p>
              <p className="text-2xl font-bold">{totalStats.activeAds}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <span className="text-2xl">🎯</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">CTR</p>
              <p className="text-2xl font-bold">{totalStats.ctr}%</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter by Position:
            </label>
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Positions</option>
              <option value="top">Top Banner</option>
              <option value="bottom">Bottom Banner</option>
              <option value="sidebar">Sidebar</option>
              <option value="inline">Inline</option>
            </select>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            {filteredAds.length} ads • Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Ads List */}
      <div className="space-y-4">
        {filteredAds.map((ad) => (
          <div key={ad.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{ad.title}</h3>
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                    ad.isActive 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                  }`}>
                    {ad.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="px-3 py-1 text-xs rounded-full font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {ad.position}
                  </span>
                  <span className="px-3 py-1 text-xs rounded-full font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                    Priority {ad.priority}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">{ad.description}</p>
                <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                  <span>👆 {ad.clickCount.toLocaleString()} clicks</span>
                  <span>👁️ {ad.impressionCount.toLocaleString()} views</span>
                  <span>🎯 {ad.targetAudience}</span>
                  <span>📅 Ends {ad.endDate.toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => handleToggleAd(ad.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    ad.isActive
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300'
                      : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300'
                  }`}
                >
                  {ad.isActive ? 'Pause' : 'Activate'}
                </button>
                <button
                  onClick={() => handleDeleteAd(ad.id)}
                  className="px-4 py-2 bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 rounded-lg text-sm font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Ad Preview */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Preview ({ad.position} position):</p>
              <div className={`bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-500 ${getAdPreview(ad)}`}>
                <div className="text-center p-4">
                  <div className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-1">{ad.title}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{ad.description}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    🔗 {ad.linkUrl}
                  </div>
                </div>
              </div>
            </div>

            {/* HTML Code */}
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">HTML Code:</p>
              <div className="bg-gray-900 text-green-400 p-3 rounded-lg text-sm overflow-x-auto">
                <code>{`<div class="nft-ad-banner ${ad.position}" data-ad-id="${ad.id}">
  <a href="${ad.linkUrl}" target="_blank" rel="noopener">
    <img src="${ad.imageUrl}" alt="${ad.title}" style="width:100%;height:auto;border-radius:8px;" />
  </a>
</div>`}</code>
              </div>
            </div>
          </div>
        ))}

        {filteredAds.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Advertisements Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {selectedPosition !== 'all' 
                ? `No ads found for ${selectedPosition} position. Try changing the filter or create a new ad.`
                : 'Create your first advertisement to start promoting NFTs and collections.'
              }
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Create Advertisement
            </button>
          </div>
        )}
      </div>

      {/* Wallet-Based Save */}
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-violet-200 dark:border-violet-800">
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
            className="w-full px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoading ? '⏳ Saving...' : '💾 Save Ads Configuration with Admin Wallet'}
          </button>
          
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Advertisement changes are applied immediately. Use "Save with Admin Wallet" to create a permanent record with ownership tracking.
          </p>
        </div>
      </div>

      {/* Create Ad Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                ✨ Create New Advertisement
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ad Title *
                  </label>
                  <input
                    type="text"
                    value={newAd.title}
                    onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Top NFT Collection"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Position *
                  </label>
                  <select
                    value={newAd.position}
                    onChange={(e) => setNewAd({ ...newAd, position: e.target.value as AdBanner['position'] })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="top">Top Banner</option>
                    <option value="bottom">Bottom Banner</option>
                    <option value="sidebar">Sidebar</option>
                    <option value="inline">Inline</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newAd.description}
                  onChange={(e) => setNewAd({ ...newAd, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={3}
                  placeholder="Trending Bored Apes - Up to 40% Off"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Image URL *
                </label>
                <input
                  type="url"
                  value={newAd.imageUrl}
                  onChange={(e) => setNewAd({ ...newAd, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://example.com/banner.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Link URL *
                </label>
                <input
                  type="url"
                  value={newAd.linkUrl}
                  onChange={(e) => setNewAd({ ...newAd, linkUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="/collection/bored-apes"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target Audience
                  </label>
                  <select
                    value={newAd.targetAudience}
                    onChange={(e) => setNewAd({ ...newAd, targetAudience: e.target.value as AdBanner['targetAudience'] })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">All Users</option>
                    <option value="collectors">Collectors</option>
                    <option value="creators">Creators</option>
                    <option value="traders">Traders</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Priority
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newAd.priority}
                    onChange={(e) => setNewAd({ ...newAd, priority: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={newAd.durationDays}
                    onChange={(e) => setNewAd({ ...newAd, durationDays: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAd}
                disabled={isLoading || !newAd.title || !newAd.imageUrl || !newAd.linkUrl}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isLoading ? 'Creating...' : 'Create Advertisement'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}