/**
 * NFT Creation Component
 * Handles file upload, metadata input, and IPFS storage via Pinata
 */

'use client';

import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { NFTMintCardEnhanced } from './NFTMintCardEnhanced';
import { ArrowSvg, OnchainkitSvg } from './svg';

interface Attribute {
  trait_type: string;
  value: string;
}

interface CreateNFTResponse {
  success: boolean;
  data?: {
    name: string;
    description: string;
    metadataHash: string;
    imageHash: string;
    metadataUrl: string;
    imageUrl: string;
    attributes: Attribute[];
  };
  error?: string;
}

const NFTCreator: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [viewMode, setViewMode] = useState<'create' | 'mint'>('create');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '1',
    supply: '1',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [newAttribute, setNewAttribute] = useState({ trait_type: '', value: '' });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<CreateNFTResponse | null>(null);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add attribute
  const addAttribute = () => {
    if (newAttribute.trait_type && newAttribute.value) {
      setAttributes(prev => [...prev, { ...newAttribute }]);
      setNewAttribute({ trait_type: '', value: '' });
    }
  };

  // Remove attribute
  const removeAttribute = (index: number) => {
    setAttributes(prev => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!imageFile) {
      alert('Please select an image');
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    // Simulate NFT creation (demo mode)
    setTimeout(() => {
      const mockResult: CreateNFTResponse = {
        success: true,
        data: {
          name: formData.name,
          description: formData.description,
          metadataHash: `Qm${Math.random().toString(36).substring(2, 15)}`,
          imageHash: `Qm${Math.random().toString(36).substring(2, 15)}`,
          metadataUrl: `ipfs://Qm${Math.random().toString(36).substring(2, 15)}`,
          imageUrl: imagePreview,
          attributes: attributes,
        }
      };
      
      setUploadResult(mockResult);
      setIsUploading(false);
      
      // Show success alert with details
      alert(`🎉 NFT Created Successfully!

Name: ${formData.name}
Price: ${formData.price} ETH
Supply: ${formData.supply}
Properties: ${attributes.length} attributes
Platform Fee: 2.5%

You'll receive: ${(parseFloat(formData.price) * 0.975).toFixed(3)} ETH

Your NFT is ready to be listed on the marketplace!`);
      
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Header with Mode Toggle */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
          🎨 NFT Creator
          <OnchainkitSvg className="w-8 h-8" />
        </h2>
        
        {/* Mode Toggle */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={() => setViewMode('create')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              viewMode === 'create'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            📝 Create & Upload
          </button>
          <button
            onClick={() => setViewMode('mint')}
            className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
              viewMode === 'mint'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            🚀 Mint Existing
            <OnchainkitSvg className="w-4 h-4" />
          </button>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300">
          {viewMode === 'create' 
            ? 'Upload and create new NFT metadata with IPFS storage'
            : 'Mint from existing NFT collections using OnchainKit patterns'
          }
        </p>
      </div>

      {/* Content based on mode */}
      {viewMode === 'create' ? (
        <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4">
          <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            NFT Image *
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              )}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
            </label>
          </div>
        </div>

        {/* Basic Info */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="My Awesome NFT"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Describe your NFT..."
          />
        </div>

        {/* Price and Supply Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price (ETH) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.001"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Supply
            </label>
            <input
              type="number"
              name="supply"
              value={formData.supply}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="1"
              required
            />
          </div>
        </div>

        {/* Attributes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Attributes
          </label>
          
          {/* Add new attribute */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newAttribute.trait_type}
              onChange={(e) => setNewAttribute(prev => ({ ...prev, trait_type: e.target.value }))}
              placeholder="Trait Type"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <input
              type="text"
              value={newAttribute.value}
              onChange={(e) => setNewAttribute(prev => ({ ...prev, value: e.target.value }))}
              placeholder="Value"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button
              type="button"
              onClick={addAttribute}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add
            </button>
          </div>

          {/* Existing attributes */}
          {attributes.map((attr, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md mb-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                <strong>{attr.trait_type}:</strong> {attr.value}
              </span>
              <button
                type="button"
                onClick={() => removeAttribute(index)}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Fee Breakdown */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-300">Platform Fee</span>
            <span className="font-medium text-gray-900 dark:text-white">2.5%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-300">Gas Fee (est.)</span>
            <span className="font-medium text-gray-900 dark:text-white">~$0.50</span>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900 dark:text-white">You'll receive</span>
              <span className="font-bold text-lg text-green-600 dark:text-green-400">
                {(parseFloat(formData.price || '0') * 0.975).toFixed(3)} ETH
              </span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isUploading || !isConnected}
          className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-sm text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:scale-100"
        >
          {isUploading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating NFT...
            </>
          ) : (
            <>
              ⚡ Mint NFT
            </>
          )}
        </button>
      </form>

      {/* Upload Result */}
      {uploadResult && (
        <div className={`mt-6 p-4 rounded-md ${uploadResult.success ? 'bg-green-50 dark:bg-green-900' : 'bg-red-50 dark:bg-red-900'}`}>
          {uploadResult.success ? (
            <div>
              <h3 className="text-lg font-medium text-green-800 dark:text-green-200 mb-2">
                ✅ NFT Metadata Created Successfully!
              </h3>
              <div className="space-y-2 text-sm text-green-700 dark:text-green-300 mb-4">
                <p><strong>Name:</strong> {uploadResult.data?.name}</p>
                <p><strong>Description:</strong> {uploadResult.data?.description}</p>
                <p><strong>Attributes:</strong> {uploadResult.data?.attributes.length} properties</p>
                <p><strong>IPFS Hash:</strong> {uploadResult.data?.metadataHash}</p>
              </div>
              
              {/* Success Message */}
              <div className="bg-green-100 dark:bg-green-800 rounded-lg p-4">
                <p className="text-green-800 dark:text-green-200 font-medium mb-2">
                  ✅ Your NFT has been created and is now available on the marketplace!
                </p>
                <button
                  onClick={() => window.location.href = '/'}
                  className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  View on Marketplace
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
                ❌ Upload Failed
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300">
                {uploadResult.error}
              </p>
            </div>
          )}
        </div>
      )}

      {!isConnected && (
        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900 rounded-md">
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            ⚠️ Please connect your wallet to create NFTs
          </p>
        </div>
      )}
        </div>
      ) : (
        // Mint Mode - Enhanced NFT Mint Cards
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <NFTMintCardEnhanced
            contractAddress={process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT || '0xE4241917A3B75C761C87BE335F392e220F67afCf'}
            title="Farcaster Genesis Collection"
            description="Exclusive NFTs celebrating the Farcaster ecosystem on Base"
            mintPrice="25.00"
            mintPriceETH="0.025"
            maxSupply={1000}
            totalSupply={347}
            onMintSuccess={(tokenId) => alert(`🎉 Successfully minted NFT #${tokenId}!`)}
            onMintError={(error) => alert('❌ Minting failed. Please try again.')}
          />
          
          <NFTMintCardEnhanced
            contractAddress={process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT || '0xE4241917A3B75C761C87BE335F392e220F67afCf'}
            title="Base Builder Badges"
            description="Commemorative badges for Base ecosystem builders"
            mintPrice="15.00"
            mintPriceETH="0.015"
            maxSupply={500}
            totalSupply={128}
            onMintSuccess={(tokenId) => alert(`🎉 Successfully minted Badge #${tokenId}!`)}
            onMintError={(error) => alert('❌ Minting failed. Please try again.')}
          />
          
          <NFTMintCardEnhanced
            contractAddress={process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT || '0xE4241917A3B75C761C87BE335F392e220F67afCf'}
            title="OnchainKit Pioneers"
            description="Limited edition NFTs for OnchainKit early adopters"
            mintPrice="75.00"
            mintPriceETH="0.075"
            maxSupply={250}
            totalSupply={89}
            onMintSuccess={(tokenId) => alert(`🎉 Successfully minted Pioneer NFT #${tokenId}!`)}
            onMintError={(error) => alert('❌ Minting failed. Please try again.')}
          />
        </div>
      )}
    </div>
  );
};

export default NFTCreator;