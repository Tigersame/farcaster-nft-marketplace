'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useAccount } from 'wagmi';

export default function IconManager() {
  const { settings, updateSettings, hasPermission, currentAdmin, createContent } = useAdmin();
  const { address: connectedWallet } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadMode, setUploadMode] = useState<'logo' | 'favicon' | 'custom' | null>(null);

  if (!hasPermission('canManageIcons')) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🚫</div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Access Denied
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          You don't have permission to manage icons.
        </p>
      </div>
    );
  }

  const handleFileUpload = async (file: File, type: 'logo' | 'favicon' | 'custom', customName?: string) => {
    setIsLoading(true);
    try {
      // Create a mock URL for the uploaded file (in production, upload to your storage)
      const mockUrl = URL.createObjectURL(file);
      
      if (type === 'logo') {
        await updateSettings({ logoUrl: mockUrl });
      } else if (type === 'favicon') {
        await updateSettings({ faviconUrl: mockUrl });
      } else if (type === 'custom' && customName) {
        const newCustomIcons = { ...settings.customIcons, [customName]: mockUrl };
        await updateSettings({ customIcons: newCustomIcons });
      }
      
      setUploadMode(null);
    } catch (error) {
      console.error('Error uploading icon:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeCustomIcon = async (iconName: string) => {
    const newCustomIcons = { ...settings.customIcons };
    delete newCustomIcons[iconName];
    await updateSettings({ customIcons: newCustomIcons });
  };

  const defaultIcons = [
    { name: 'heart', emoji: '❤️', description: 'Like/Favorite' },
    { name: 'star', emoji: '⭐', description: 'Rating/Featured' },
    { name: 'fire', emoji: '🔥', description: 'Trending/Hot' },
    { name: 'gem', emoji: '💎', description: 'Premium/Rare' },
    { name: 'rocket', emoji: '🚀', description: 'Launch/New' },
    { name: 'crown', emoji: '👑', description: 'VIP/Special' },
    { name: 'lightning', emoji: '⚡', description: 'Fast/Quick' },
    { name: 'money', emoji: '💰', description: 'Price/Value' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Icon Manager 🖼️
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage logos, favicons, and custom icons for your marketplace
        </p>
      </div>

      {/* Main Icons Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Logo Management */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Logo
          </h2>
          
          <div className="text-center">
            <div className="mb-4">
              {settings.logoUrl ? (
                <img 
                  src={settings.logoUrl} 
                  alt="Current Logo"
                  className="h-16 w-auto mx-auto rounded-lg border border-gray-300 dark:border-gray-600"
                />
              ) : (
                <div className="h-16 w-16 mx-auto bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🏢</span>
                </div>
              )}
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Recommended: 200x50px, PNG/SVG format
            </p>
            
            <button
              onClick={() => setUploadMode('logo')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Upload New Logo
            </button>
          </div>
        </div>

        {/* Favicon Management */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Favicon
          </h2>
          
          <div className="text-center">
            <div className="mb-4">
              {settings.faviconUrl ? (
                <img 
                  src={settings.faviconUrl} 
                  alt="Current Favicon"
                  className="h-8 w-8 mx-auto rounded border border-gray-300 dark:border-gray-600"
                />
              ) : (
                <div className="h-8 w-8 mx-auto bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                  <span className="text-sm">🏢</span>
                </div>
              )}
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Recommended: 32x32px, ICO/PNG format
            </p>
            
            <button
              onClick={() => setUploadMode('favicon')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Upload New Favicon
            </button>
          </div>
        </div>
      </div>

      {/* Custom Icons */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Custom Icons
          </h2>
          <button
            onClick={() => setUploadMode('custom')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Add Custom Icon
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Object.entries(settings.customIcons).map(([name, url]) => (
            <div key={name} className="relative group">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-600">
                <img 
                  src={url} 
                  alt={name}
                  className="h-8 w-8 mx-auto mb-2"
                />
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                  {name}
                </p>
              </div>
              <button
                onClick={() => removeCustomIcon(name)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
          
          {Object.keys(settings.customIcons).length === 0 && (
            <div className="col-span-full text-center py-8">
              <div className="text-4xl mb-2">📁</div>
              <p className="text-gray-500 dark:text-gray-400">
                No custom icons uploaded yet
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Default Icon Library */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Default Icon Library
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {defaultIcons.map((icon) => (
            <div key={icon.name} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-600">
              <div className="text-2xl mb-2">{icon.emoji}</div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {icon.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {icon.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Wallet-Based Save */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
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
            onClick={async () => {
              if (!currentAdmin || !connectedWallet) {
                alert('Admin must be logged in and wallet connected to save changes');
                return;
              }

              setIsLoading(true);
              try {
                const iconData = {
                  logoUrl: settings.logoUrl,
                  faviconUrl: settings.faviconUrl,
                  customIcons: settings.customIcons,
                  savedByWallet: connectedWallet,
                  adminId: currentAdmin.id,
                  timestamp: new Date().toISOString()
                };

                const contentId = await createContent('setting', `Icon Settings - ${new Date().toLocaleString()}`, iconData);
                
                alert(`Icons saved successfully!\nContent ID: ${contentId}\nSaved by wallet: ${connectedWallet}`);
              } catch (error) {
                console.error('Error saving icons with wallet:', error);
                alert('Failed to save icons');
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={isLoading || !currentAdmin || !connectedWallet}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoading ? '⏳ Saving...' : '💾 Save Icons with Admin Wallet'}
          </button>
          
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Icon changes are automatically applied. Use "Save with Admin Wallet" to create a permanent record with ownership tracking.
          </p>
        </div>
      </div>

      {/* Upload Modal */}
      {uploadMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Upload {uploadMode === 'logo' ? 'Logo' : uploadMode === 'favicon' ? 'Favicon' : 'Custom Icon'}
            </h3>
            
            <div className="space-y-4">
              {uploadMode === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Icon Name
                  </label>
                  <input
                    type="text"
                    id="customIconName"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter icon name"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Select File
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const customName = uploadMode === 'custom' 
                        ? (document.getElementById('customIconName') as HTMLInputElement)?.value
                        : undefined;
                      
                      if (uploadMode !== 'custom' || customName) {
                        handleFileUpload(file, uploadMode, customName);
                      }
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setUploadMode(null)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}