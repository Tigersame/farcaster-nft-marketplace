import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { alchemyService, LiveNFTData, getImageUrl, formatAttributes } from '@/lib/alchemy';
import { useAdmin } from '@/contexts/AdminContext';
import { LoadingSpinner } from './LoadingSpinner';

interface LiveNFTManagerProps {
  onNFTSelect?: (nft: LiveNFTData) => void;
}

export const LiveNFTManager: React.FC<LiveNFTManagerProps> = ({ onNFTSelect }) => {
  const { address } = useAccount();
  const { isLoggedIn, hasPermission } = useAdmin();
  const [nfts, setNfts] = useState<LiveNFTData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchAddress, setSearchAddress] = useState('');
  const [selectedNFT, setSelectedNFT] = useState<LiveNFTData | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Popular NFT addresses for demo
  const popularAddresses = [
    '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d', // BAYC
    '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb', // CryptoPunks
    '0x8a90cab2b38dba80c64b7734e58ee1db38b8992e', // Doodles
    '0x23581767a106ae21c074b2276d25e5c3e136a68b', // Moonbirds
  ];

  const fetchNFTs = async (ownerAddress: string) => {
    if (!ownerAddress) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const nftData = await alchemyService.getNFTsForOwner(ownerAddress, 20);
      setNfts(nftData);
      
      if (nftData.length === 0) {
        setError(`No NFTs found for address: ${ownerAddress}`);
      }
    } catch (err) {
      setError(`Failed to fetch NFTs: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setNfts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchAddress.trim()) {
      fetchNFTs(searchAddress.trim());
    }
  };

  const handleNFTClick = (nft: LiveNFTData) => {
    setSelectedNFT(nft);
    onNFTSelect?.(nft);
  };

  const formatPrice = (nft: LiveNFTData): string => {
    // Mock price calculation based on collection
    const basePrice = Math.random() * 10 + 0.1;
    return `${basePrice.toFixed(2)} ETH`;
  };

  if (!isLoggedIn || !hasPermission('canManageNFTs')) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600 dark:text-gray-400">Admin access required</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Live NFT Data Manager
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded text-sm ${
              viewMode === 'grid'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 rounded text-sm ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            List
          </button>
        </div>
      </div>

      {/* Search Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleAddressSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Wallet Address or ENS Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                placeholder="0x... or example.eth"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="submit"
                disabled={loading || !searchAddress.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : 'Fetch NFTs'}
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Quick Examples:</p>
            <div className="flex flex-wrap gap-2">
              {address && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchAddress(address);
                    fetchNFTs(address);
                  }}
                  className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-md text-sm hover:bg-green-200 dark:hover:bg-green-800"
                >
                  My NFTs
                </button>
              )}
              {popularAddresses.map((addr, index) => (
                <button
                  key={addr}
                  type="button"
                  onClick={() => {
                    setSearchAddress(addr);
                    fetchNFTs(addr);
                  }}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md text-sm hover:bg-blue-200 dark:hover:bg-blue-800"
                >
                  {['BAYC', 'Punks', 'Doodles', 'Moonbirds'][index]}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center p-8">
          <LoadingSpinner />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* NFT Grid/List */}
      {nfts.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Found {nfts.length} NFTs
          </p>
          
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {nfts.map((nft, index) => (
                <div
                  key={`${nft.contract.address}-${nft.tokenId}`}
                  onClick={() => handleNFTClick(nft)}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={getImageUrl(nft)}
                      alt={nft.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://via.placeholder.com/400x400/000000/FFFFFF?text=${encodeURIComponent(nft.title)}`;
                      }}
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {nft.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {nft.contract.name}
                    </p>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {formatPrice(nft)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {nfts.map((nft, index) => (
                <div
                  key={`${nft.contract.address}-${nft.tokenId}`}
                  onClick={() => handleNFTClick(nft)}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={getImageUrl(nft)}
                      alt={nft.title}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://via.placeholder.com/64x64/000000/FFFFFF?text=NFT`;
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {nft.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {nft.contract.name} • Token #{formatTokenId(nft.tokenId)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-blue-600 dark:text-blue-400">
                        {formatPrice(nft)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Last updated: {new Date(nft.timeLastUpdated).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* NFT Detail Modal */}
      {selectedNFT && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedNFT.title}
                </h3>
                <button
                  onClick={() => setSelectedNFT(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={getImageUrl(selectedNFT)}
                    alt={selectedNFT.title}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Details</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-600 dark:text-gray-400">Collection:</span> {selectedNFT.contract.name}</p>
                      <p><span className="text-gray-600 dark:text-gray-400">Token ID:</span> {formatTokenId(selectedNFT.tokenId)}</p>
                      <p><span className="text-gray-600 dark:text-gray-400">Contract:</span> {selectedNFT.contract.address}</p>
                      <p><span className="text-gray-600 dark:text-gray-400">Type:</span> {selectedNFT.tokenType}</p>
                    </div>
                  </div>

                  {selectedNFT.description && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Description</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedNFT.description}
                      </p>
                    </div>
                  )}

                  {selectedNFT.attributes && selectedNFT.attributes.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Attributes</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {formatAttributes(selectedNFT).slice(0, 8).map((attr, index) => (
                          <div
                            key={index}
                            className="bg-gray-100 dark:bg-gray-700 rounded-lg p-2"
                          >
                            <p className="text-xs text-gray-600 dark:text-gray-400 uppercase">
                              {attr.trait_type}
                            </p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {attr.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function (moved from alchemy.ts to avoid circular import)
const formatTokenId = (tokenId: string): string => {
  const id = parseInt(tokenId, 16).toString();
  return id.length > 6 ? `${id.slice(0, 6)}...` : id;
};

export default LiveNFTManager;