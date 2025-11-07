'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';

interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  creator: string;
  nftCount: number;
  totalVolume: number;
  floorPrice: number;
  status: 'active' | 'featured' | 'hidden' | 'archived';
  createdAt: Date;
  tags: string[];
}

export default function CollectionManager() {
  const { hasPermission } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock collection data
  const [collections, setCollections] = useState<Collection[]>([
    {
      id: '1',
      name: 'Farcaster Genesis',
      description: 'The original Farcaster NFT collection featuring unique digital art pieces',
      image: '/api/placeholder/300/300',
      creator: 'farcaster.eth',
      nftCount: 156,
      totalVolume: 45.6,
      floorPrice: 2.1,
      status: 'featured',
      createdAt: new Date('2024-01-01'),
      tags: ['genesis', 'art', 'community'],
    },
    {
      id: '2',
      name: 'Base Builders',
      description: 'Exclusive collection for Base ecosystem contributors and builders',
      image: '/api/placeholder/300/300',
      creator: 'base.eth',
      nftCount: 89,
      totalVolume: 23.4,
      floorPrice: 1.5,
      status: 'active',
      createdAt: new Date('2024-01-15'),
      tags: ['utility', 'builders', 'base'],
    },
    {
      id: '3',
      name: 'Digital Dreams',
      description: 'Surreal digital landscapes and abstract compositions',
      image: '/api/placeholder/300/300',
      creator: 'artist.eth',
      nftCount: 234,
      totalVolume: 67.8,
      floorPrice: 0.8,
      status: 'active',
      createdAt: new Date('2024-02-01'),
      tags: ['art', 'abstract', 'dreams'],
    },
    {
      id: '4',
      name: 'Retro Pixels',
      description: 'Nostalgic pixel art inspired by classic video games',
      image: '/api/placeholder/300/300',
      creator: 'pixelmaster.eth',
      nftCount: 45,
      totalVolume: 12.3,
      floorPrice: 0.5,
      status: 'hidden',
      createdAt: new Date('2024-02-10'),
      tags: ['pixel', 'retro', 'gaming'],
    },
  ]);

  if (!hasPermission('canManageCollections')) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🚫</div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Access Denied
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          You don't have permission to manage collections.
        </p>
      </div>
    );
  }

  const filteredCollections = collections
    .filter(collection => {
      const matchesSearch = collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           collection.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           collection.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = filterStatus === 'all' || collection.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'oldest':
          return a.createdAt.getTime() - b.createdAt.getTime();
        case 'volume-high':
          return b.totalVolume - a.totalVolume;
        case 'volume-low':
          return a.totalVolume - b.totalVolume;
        case 'items-high':
          return b.nftCount - a.nftCount;
        case 'items-low':
          return a.nftCount - b.nftCount;
        default:
          return 0;
      }
    });

  const updateCollectionStatus = async (collectionId: string, newStatus: Collection['status']) => {
    setIsLoading(true);
    try {
      setCollections(prev => prev.map(collection => 
        collection.id === collectionId ? { ...collection, status: newStatus } : collection
      ));
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error updating collection status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCollection = async (collectionId: string) => {
    if (confirm('Are you sure you want to delete this collection? This action cannot be undone.')) {
      setIsLoading(true);
      try {
        setCollections(prev => prev.filter(collection => collection.id !== collectionId));
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error('Error deleting collection:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const bulkUpdateStatus = async (status: Collection['status']) => {
    if (selectedCollections.length === 0) return;
    
    setIsLoading(true);
    try {
      setCollections(prev => prev.map(collection => 
        selectedCollections.includes(collection.id) ? { ...collection, status } : collection
      ));
      setSelectedCollections([]);
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error bulk updating collections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: Collection['status']) => {
    switch (status) {
      case 'featured': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'hidden': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Collection Manager 📂
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Organize and manage NFT collections
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Create Collection
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { 
            label: 'Total Collections', 
            value: collections.length, 
            icon: '📂',
            color: 'bg-blue-500'
          },
          { 
            label: 'Featured', 
            value: collections.filter(c => c.status === 'featured').length, 
            icon: '⭐',
            color: 'bg-purple-500'
          },
          { 
            label: 'Total Volume', 
            value: `${collections.reduce((sum, c) => sum + c.totalVolume, 0).toFixed(1)} ETH`, 
            icon: '💰',
            color: 'bg-green-500'
          },
          { 
            label: 'Total Items', 
            value: collections.reduce((sum, c) => sum + c.nftCount, 0).toLocaleString(), 
            icon: '🖼️',
            color: 'bg-orange-500'
          },
        ].map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-2 rounded-lg`}>
                <span className="text-white text-xl">{stat.icon}</span>
              </div>
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
              placeholder="Search collections by name, creator, or tags..."
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
              <option value="active">Active</option>
              <option value="hidden">Hidden</option>
              <option value="archived">Archived</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="volume-high">Volume: High to Low</option>
              <option value="volume-low">Volume: Low to High</option>
              <option value="items-high">Items: Most to Least</option>
              <option value="items-low">Items: Least to Most</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedCollections.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                {selectedCollections.length} collection(s) selected
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => bulkUpdateStatus('featured')}
                  className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                >
                  Feature
                </button>
                <button
                  onClick={() => bulkUpdateStatus('active')}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                >
                  Activate
                </button>
                <button
                  onClick={() => bulkUpdateStatus('hidden')}
                  className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                >
                  Hide
                </button>
                <button
                  onClick={() => setSelectedCollections([])}
                  className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Collections Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCollections.map((collection) => (
              <div key={collection.id} className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedCollections.includes(collection.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCollections(prev => [...prev, collection.id]);
                      } else {
                        setSelectedCollections(prev => prev.filter(id => id !== collection.id));
                      }
                    }}
                    className="absolute top-2 left-2 z-10"
                  />
                  <div className="aspect-square bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                    <span className="text-white text-4xl">📂</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {collection.name}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(collection.status)}`}>
                      {collection.status}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {collection.description}
                  </p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Creator:</span>
                      <span className="text-gray-900 dark:text-white">{collection.creator}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Items:</span>
                      <span className="text-gray-900 dark:text-white">{collection.nftCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Volume:</span>
                      <span className="text-gray-900 dark:text-white">{collection.totalVolume} ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Floor:</span>
                      <span className="text-gray-900 dark:text-white">{collection.floorPrice} ETH</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-1">
                    {collection.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <select
                      value={collection.status}
                      onChange={(e) => updateCollectionStatus(collection.id, e.target.value as Collection['status'])}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      disabled={isLoading}
                    >
                      <option value="active">Active</option>
                      <option value="featured">Featured</option>
                      <option value="hidden">Hidden</option>
                      <option value="archived">Archived</option>
                    </select>
                    <button
                      onClick={() => deleteCollection(collection.id)}
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
          
          {filteredCollections.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📂</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No collections found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm || filterStatus !== 'all' ? 'Try adjusting your filters' : 'Start by creating your first collection'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Collection Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Create New Collection
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Collection Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter collection name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={3}
                  placeholder="Enter collection description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Creator Address
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="0x... or creator.eth"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="art, digital, abstract"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Collection Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Initial Status
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="active">Active</option>
                  <option value="featured">Featured</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Create Collection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}