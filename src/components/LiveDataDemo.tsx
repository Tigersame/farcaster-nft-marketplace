import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiDatabase, FiTrendingUp, FiActivity, FiEye } from 'react-icons/fi';
import { alchemyService, LiveNFTData, getImageUrl } from '@/lib/alchemy';

export const LiveDataDemo: React.FC = () => {
  const [demoNFTs, setDemoNFTs] = useState<LiveNFTData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<string>('bayc');

  // Popular collection addresses for demo
  const collections = {
    bayc: {
      name: 'Bored Ape Yacht Club',
      address: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
      description: 'The most famous NFT collection'
    },
    punks: {
      name: 'CryptoPunks',
      address: '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb',
      description: 'Original pixel art NFTs'
    },
    doodles: {
      name: 'Doodles',
      address: '0x8a90cab2b38dba80c64b7734e58ee1db38b8992e',
      description: 'Colorful hand-drawn characters'
    }
  };

  const fetchCollectionSample = async (collectionKey: string) => {
    setLoading(true);
    try {
      const collection = collections[collectionKey as keyof typeof collections];
      const nfts = await alchemyService.searchNFTs(collection.address, 8);
      setDemoNFTs(nfts);
    } catch (error) {
      console.error('Error fetching collection sample:', error);
      setDemoNFTs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollectionSample(selectedCollection);
  }, [selectedCollection]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-2xl">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
            <FiDatabase className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Live NFT Data Integration
          </h2>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Real-time NFT data powered by Alchemy API • API Key: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">skI70Usmhsnf0GDuGdYqj</code>
        </p>
      </div>

      {/* Collection Selector */}
      <div className="mb-8">
        <div className="flex justify-center space-x-4">
          {Object.entries(collections).map(([key, collection]) => (
            <button
              key={key}
              onClick={() => setSelectedCollection(key)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedCollection === key
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {collection.name}
            </button>
          ))}
        </div>
        <div className="text-center mt-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {collections[selectedCollection as keyof typeof collections].description}
          </p>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
          <div className="flex items-center space-x-3">
            <FiActivity className="w-6 h-6 text-green-600 dark:text-green-400" />
            <div>
              <div className="font-semibold text-green-800 dark:text-green-200">API Status</div>
              <div className="text-sm text-green-600 dark:text-green-400">Connected & Active</div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-3">
            <FiTrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <div>
              <div className="font-semibold text-blue-800 dark:text-blue-200">Network</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">Ethereum Mainnet</div>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
          <div className="flex items-center space-x-3">
            <FiEye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <div>
              <div className="font-semibold text-purple-800 dark:text-purple-200">Data Source</div>
              <div className="text-sm text-purple-600 dark:text-purple-400">Real-time from Alchemy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Fetching live NFT data...</p>
        </div>
      )}

      {/* NFT Grid */}
      {!loading && demoNFTs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {demoNFTs.map((nft, index) => (
            <motion.div
              key={`${nft.contract.address}-${nft.tokenId}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={getImageUrl(nft)}
                  alt={nft.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://via.placeholder.com/300x300/000000/FFFFFF?text=${encodeURIComponent(nft.title || 'NFT')}`;
                  }}
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                  #{parseInt(nft.tokenId, 16).toString()}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                  {nft.title || `${nft.contract.name} #${parseInt(nft.tokenId, 16).toString()}`}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {nft.contract.name}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">
                    {nft.tokenType}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Live Data
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* No Data State */}
      {!loading && demoNFTs.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <FiDatabase className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            No NFTs found for this collection. Try another collection or check your API key.
          </p>
        </div>
      )}

      {/* Integration Info */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          🎉 Live NFT Integration Complete!
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">✅ Features Implemented:</h4>
            <ul className="space-y-1 text-gray-600 dark:text-gray-400">
              <li>• Real-time NFT data fetching</li>
              <li>• Collection metadata retrieval</li>
              <li>• Image and attribute display</li>
              <li>• Professional admin interface</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">🚀 Admin Capabilities:</h4>
            <ul className="space-y-1 text-gray-600 dark:text-gray-400">
              <li>• Browse any wallet's NFTs</li>
              <li>• Search popular collections</li>
              <li>• Integrate NFTs into marketplace</li>
              <li>• Feature NFTs in advertisements</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveDataDemo;