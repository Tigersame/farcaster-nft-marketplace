/**
 * NFT Creation Component
 * Handles file upload, metadata input, and IPFS storage via Pinata
 */

'use client';

import React, { useState } from 'react';
import { useAccount } from 'wagmi';

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
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    externalUrl: '',
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

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('image', imageFile);
      formDataToSend.append('attributes', JSON.stringify(attributes));
      formDataToSend.append('externalUrl', formData.externalUrl);
      formDataToSend.append('creatorAddress', address || '');

      const response = await fetch('/api/nft/create', {
        method: 'POST',
        body: formDataToSend,
      });

      const result: CreateNFTResponse = await response.json();
      setUploadResult(result);

      if (result.success) {
        // Reset form
        setFormData({ name: '', description: '', externalUrl: '' });
        setImageFile(null);
        setImagePreview('');
        setAttributes([]);
      }
    } catch (error) {
      setUploadResult({
        success: false,
        error: 'Network error occurred',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        🎨 Create NFT
      </h2>

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
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Describe your NFT..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            External URL (Optional)
          </label>
          <input
            type="url"
            name="externalUrl"
            value={formData.externalUrl}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="https://example.com"
          />
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isUploading || !isConnected}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading to IPFS...
            </>
          ) : (
            '🚀 Create NFT'
          )}
        </button>
      </form>

      {/* Upload Result */}
      {uploadResult && (
        <div className={`mt-6 p-4 rounded-md ${uploadResult.success ? 'bg-green-50 dark:bg-green-900' : 'bg-red-50 dark:bg-red-900'}`}>
          {uploadResult.success ? (
            <div>
              <h3 className="text-lg font-medium text-green-800 dark:text-green-200 mb-2">
                ✅ NFT Created Successfully!
              </h3>
              <div className="space-y-2 text-sm text-green-700 dark:text-green-300">
                <p><strong>Metadata URL:</strong> <a href={uploadResult.data?.metadataUrl} target="_blank" rel="noopener noreferrer" className="underline">{uploadResult.data?.metadataUrl}</a></p>
                <p><strong>Image URL:</strong> <a href={uploadResult.data?.imageUrl} target="_blank" rel="noopener noreferrer" className="underline">{uploadResult.data?.imageUrl}</a></p>
                <p><strong>IPFS Hash:</strong> {uploadResult.data?.metadataHash}</p>
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
  );
};

export default NFTCreator;