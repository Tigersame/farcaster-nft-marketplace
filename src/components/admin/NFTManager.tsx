'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';

interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  creator: string;
  collection: string;
  status: 'draft' | 'published' | 'sold' | 'featured';
  createdAt: Date;
  views: number;
  likes: number;
}

export default function NFTManager() {
  const { hasPermission, currentAdmin } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [selectedNFTs, setSelectedNFTs] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get NFTs from the ownership system
  // TODO: Re-enable when admin context is properly working
  // const adminNFTs = getContentByType('nft');

  // Mock NFT data - in production, this would come from your database
  const [nfts, setNfts] = useState<NFT[]>([
    {
      id: '1',
      name: 'Farcaster Genesis #001',
      description: 'The first NFT in the Farcaster collection',
      image: '/api/placeholder/400/400',
      price: 2.5,
      creator: 'artist1.eth',
      collection: 'Farcaster Genesis',
      status: 'featured',
      createdAt: new Date('2024-01-15'),
      views: 1250,
      likes: 89,
    },
    {
      id: '2',
      name: 'Base Builder Badge',
      description: 'Exclusive badge for Base ecosystem builders',
      image: '/api/placeholder/400/400',
      price: 1.0,
      creator: 'builder.eth',
      collection: 'Base Builders',
      status: 'published',
      createdAt: new Date('2024-01-20'),
      views: 890,
      likes: 67,
    },
    {
      id: '3',
      name: 'Digital Dreams #123',
      description: 'An ethereal journey through digital landscapes',
      image: '/api/placeholder/400/400',
      price: 0.8,
      creator: 'dreamer.eth',
      collection: 'Digital Dreams',
      status: 'draft',
      createdAt: new Date('2024-01-25'),
      views: 234,
      likes: 12,
    },
  ]);

  if (!hasPermission('canManageNFTs')) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🚫</div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Access Denied
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          You don't have permission to manage NFTs.
        </p>
      </div>
    );
  }

  const filteredNFTs = nfts
    .filter(nft => {
      const matchesSearch = nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           nft.creator.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || nft.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'oldest':
          return a.createdAt.getTime() - b.createdAt.getTime();
        case 'price-high':
          return b.price - a.price;
        case 'price-low':
          return a.price - b.price;
        case 'popular':
          return b.views - a.views;
        default:
          return 0;
      }
    });

  const updateNFTStatus = async (nftId: string, newStatus: NFT['status']) => {
    setIsLoading(true);
    try {
      setNfts(prev => prev.map(nft => 
        nft.id === nftId ? { ...nft, status: newStatus } : nft
      ));
      // In production, make API call here
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    } catch (error) {
      console.error('Error updating NFT status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNFT = async (nftId: string) => {
    if (confirm('Are you sure you want to delete this NFT?')) {
      setIsLoading(true);
      try {
        setNfts(prev => prev.filter(nft => nft.id !== nftId));
        // In production, make API call here
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error('Error deleting NFT:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const bulkUpdateStatus = async (status: NFT['status']) => {
    if (selectedNFTs.length === 0) return;
    
    setIsLoading(true);
    try {
      setNfts(prev => prev.map(nft => 
        selectedNFTs.includes(nft.id) ? { ...nft, status } : nft
      ));
      setSelectedNFTs([]);
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error bulk updating NFTs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNFT = async (formData: any) => {
    setIsLoading(true);
    try {
      // TODO: Integrate with admin ownership system
      // const contentId = await createContent('nft', formData.name, {
      //   tokenId: Date.now().toString(),
      //   name: formData.name,
      //   description: formData.description,
      //   imageUrl: formData.imageUrl,
      //   price: formData.price,
      //   royalty: formData.royalty || 5,
      //   attributes: formData.attributes ? JSON.parse(formData.attributes) : [],
      // });

      // For now, just add to local state
      const newNFT: NFT = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        image: formData.imageUrl,
        price: parseFloat(formData.price),
        creator: currentAdmin?.username || 'Unknown',
        collection: formData.collection || 'Admin Created',
        status: 'draft',
        createdAt: new Date(),
        views: 0,
        likes: 0,
      };

      setNfts(prev => [newNFT, ...prev]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating NFT:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: NFT['status']) => {
    switch (status) {
      case 'featured': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'sold': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            NFT Manager 🖼️
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage all NFTs in your marketplace
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Add New NFT
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total NFTs', value: nfts.length, icon: '🖼️' },
          { label: 'Featured', value: nfts.filter(n => n.status === 'featured').length, icon: '⭐' },
          { label: 'Published', value: nfts.filter(n => n.status === 'published').length, icon: '✅' },
          { label: 'Drafts', value: nfts.filter(n => n.status === 'draft').length, icon: '📝' },
        ].map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <div className="text-2xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search NFTs by name or creator..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="flex space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="featured">Featured</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="sold">Sold</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedNFTs.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                {selectedNFTs.length} NFT(s) selected
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => bulkUpdateStatus('featured')}
                  className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                >
                  Feature
                </button>
                <button
                  onClick={() => bulkUpdateStatus('published')}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                >
                  Publish
                </button>
                <button
                  onClick={() => bulkUpdateStatus('draft')}
                  className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                >
                  Draft
                </button>
                <button
                  onClick={() => setSelectedNFTs([])}
                  className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* NFT Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNFTs.map((nft) => (
              <div key={nft.id} className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedNFTs.includes(nft.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedNFTs(prev => [...prev, nft.id]);
                      } else {
                        setSelectedNFTs(prev => prev.filter(id => id !== nft.id));
                      }
                    }}
                    className="absolute top-2 left-2 z-10"
                  />
                  <div className="aspect-square bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                    <span className="text-white text-4xl">🎨</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {nft.name}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(nft.status)}`}>
                      {nft.status}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 truncate">
                    {nft.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <span>By {nft.creator}</span>
                    <span>{nft.price} ETH</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <span>👁️ {nft.views}</span>
                    <span>❤️ {nft.likes}</span>
                    <span>{nft.createdAt.toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <select
                      value={nft.status}
                      onChange={(e) => updateNFTStatus(nft.id, e.target.value as NFT['status'])}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      disabled={isLoading}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="featured">Featured</option>
                      <option value="sold">Sold</option>
                    </select>
                    <button
                      onClick={() => deleteNFT(nft.id)}
                      className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                      disabled={isLoading}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredNFTs.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No NFTs found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm || filterStatus !== 'all' ? 'Try adjusting your filters' : 'Start by adding your first NFT'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create NFT Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add New NFT
            </h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const data = Object.fromEntries(formData.entries());
              handleCreateNFT(data);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    NFT Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter NFT name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={3}
                    placeholder="Enter description"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Price (ETH)
                  </label>
                  <input
                    name="price"
                    type="number"
                    step="0.001"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="0.000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Image URL
                  </label>
                  <input
                    name="imageUrl"
                    type="url"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="https://example.com/image.png"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isLoading ? 'Creating...' : 'Create NFT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}