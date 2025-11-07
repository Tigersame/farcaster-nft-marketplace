'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useAccount } from 'wagmi';

export default function ThemeCustomizer() {
  const { settings, updateSettings, hasPermission, currentAdmin, createContent } = useAdmin();
  const { address: connectedWallet } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  if (!hasPermission('canManageThemes')) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🚫</div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Access Denied
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          You don't have permission to manage themes.
        </p>
      </div>
    );
  }

  const handleColorChange = async (colorKey: keyof typeof settings, value: string) => {
    setIsLoading(true);
    try {
      await updateSettings({ [colorKey]: value });
    } catch (error) {
      console.error('Error updating color:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveWithWallet = async () => {
    if (!currentAdmin || !connectedWallet) {
      alert('Admin must be logged in and wallet connected to save changes');
      return;
    }

    setIsLoading(true);
    try {
      // Create content with wallet association
      const themeData = {
        settings: settings,
        savedByWallet: connectedWallet,
        adminId: currentAdmin.id,
        timestamp: new Date().toISOString()
      };

      const contentId = await createContent('theme', `Theme Settings - ${new Date().toLocaleString()}`, themeData);
      
      // Also update settings normally
      await updateSettings(settings);
      
      alert(`Theme saved successfully!\nContent ID: ${contentId}\nSaved by wallet: ${connectedWallet}`);
    } catch (error) {
      console.error('Error saving theme with wallet:', error);
      alert('Failed to save theme');
    } finally {
      setIsLoading(false);
    }
  };

  const presetThemes = [
    {
      name: 'OpenSea Classic',
      description: 'Inspired by the world\'s largest NFT marketplace',
      colors: {
        primaryColor: '#2081e2',
        secondaryColor: '#1868b7',
        accentColor: '#1565d8',
        backgroundColor: '#ffffff',
        textColor: '#04111d',
        cardBackground: '#fbfdff',
        borderColor: '#e5e8eb',
      }
    },
    {
      name: 'SuperRare Dark',
      description: 'Premium dark theme for sophisticated collectors',
      colors: {
        primaryColor: '#000000',
        secondaryColor: '#1a1a1a',
        accentColor: '#ffffff',
        backgroundColor: '#0a0a0a',
        textColor: '#ffffff',
        cardBackground: '#1a1a1a',
        borderColor: '#2a2a2a',
      }
    },
    {
      name: 'Foundation Art',
      description: 'Clean minimalist design focused on artwork',
      colors: {
        primaryColor: '#000000',
        secondaryColor: '#333333',
        accentColor: '#f7931e',
        backgroundColor: '#ffffff',
        textColor: '#000000',
        cardBackground: '#fafafa',
        borderColor: '#e6e6e6',
      }
    },
    {
      name: 'Nifty Gateway',
      description: 'Modern purple gradient theme',
      colors: {
        primaryColor: '#6c5ce7',
        secondaryColor: '#a29bfe',
        accentColor: '#fd79a8',
        backgroundColor: '#ffffff',
        textColor: '#2d3436',
        cardBackground: '#f8f9fa',
        borderColor: '#ddd6fe',
      }
    },
    {
      name: 'Magic Eden',
      description: 'Warm purple with professional contrast',
      colors: {
        primaryColor: '#8b5cf6',
        secondaryColor: '#7c3aed',
        accentColor: '#a855f7',
        backgroundColor: '#ffffff',
        textColor: '#111827',
        cardBackground: '#faf5ff',
        borderColor: '#e9d5ff',
      }
    },
    {
      name: 'Rarible Vibrant',
      description: 'Colorful and energetic theme',
      colors: {
        primaryColor: '#ffc107',
        secondaryColor: '#ff9800',
        accentColor: '#e91e63',
        backgroundColor: '#ffffff',
        textColor: '#212529',
        cardBackground: '#fff8e1',
        borderColor: '#ffecb3',
      }
    },
    {
      name: 'Blur Professional',
      description: 'Clean professional trader-focused design',
      colors: {
        primaryColor: '#ff6b35',
        secondaryColor: '#f7931e',
        accentColor: '#ff8c42',
        backgroundColor: '#ffffff',
        textColor: '#1a1a1a',
        cardBackground: '#fafafa',
        borderColor: '#e5e5e5',
      }
    },
    {
      name: 'LooksRare Green',
      description: 'Premium green theme with dark accents',
      colors: {
        primaryColor: '#0ce466',
        secondaryColor: '#0abd5b',
        accentColor: '#08a045',
        backgroundColor: '#ffffff',
        textColor: '#0f172a',
        cardBackground: '#f0fdf4',
        borderColor: '#bbf7d0',
      }
    },
    {
      name: 'Crypto.com Blue',
      description: 'Corporate blue with modern aesthetics',
      colors: {
        primaryColor: '#003cda',
        secondaryColor: '#0047ab',
        accentColor: '#1e40af',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        cardBackground: '#f8fafc',
        borderColor: '#e2e8f0',
      }
    },
    {
      name: 'Midnight Pro',
      description: 'Sophisticated dark theme for night trading',
      colors: {
        primaryColor: '#3b82f6',
        secondaryColor: '#1d4ed8',
        accentColor: '#60a5fa',
        backgroundColor: '#0f172a',
        textColor: '#f8fafc',
        cardBackground: '#1e293b',
        borderColor: '#334155',
      }
    }
  ];

  const applyPresetTheme = async (preset: typeof presetThemes[0]) => {
    setIsLoading(true);
    try {
      await updateSettings(preset.colors);
    } catch (error) {
      console.error('Error applying preset theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Theme Customizer 🎨
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Customize the appearance of your marketplace
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              previewMode
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {previewMode ? 'Exit Preview' : 'Preview Mode'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Color Customization */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Color Palette
          </h2>
          
          <div className="space-y-4">
            {[
              { key: 'primaryColor', label: 'Primary Color', description: 'Main brand color' },
              { key: 'secondaryColor', label: 'Secondary Color', description: 'Accent brand color' },
              { key: 'accentColor', label: 'Accent Color', description: 'Highlight color' },
              { key: 'backgroundColor', label: 'Background Color', description: 'Page background' },
              { key: 'textColor', label: 'Text Color', description: 'Primary text color' },
              { key: 'cardBackground', label: 'Card Background', description: 'Card and section backgrounds' },
              { key: 'borderColor', label: 'Border Color', description: 'Border and divider color' },
            ].map(({ key, label, description }) => (
              <div key={key} className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {description}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={settings[key as keyof typeof settings] as string}
                    onChange={(e) => handleColorChange(key as keyof typeof settings, e.target.value)}
                    className="w-12 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                    disabled={isLoading}
                  />
                  <input
                    type="text"
                    value={settings[key as keyof typeof settings] as string}
                    onChange={(e) => handleColorChange(key as keyof typeof settings, e.target.value)}
                    className="w-24 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    disabled={isLoading}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preset Themes */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🎨 Professional Marketplace Themes
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Professionally designed themes inspired by leading NFT marketplaces
          </p>
          
          <div className="grid grid-cols-1 gap-4">
            {presetThemes.map((preset, index) => (
              <div
                key={index}
                className="group relative overflow-hidden border border-gray-200 dark:border-gray-600 rounded-lg hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-200"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {preset.name}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        {preset.description}
                      </p>
                    </div>
                    <button
                      onClick={() => applyPresetTheme(preset)}
                      disabled={isLoading}
                      className="ml-4 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 text-sm font-medium shadow-sm hover:shadow-md transform hover:scale-105"
                    >
                      {isLoading ? '⏳' : 'Apply'}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      {Object.entries(preset.colors).slice(0, 5).map(([key, color], colorIndex) => (
                        <div key={colorIndex} className="flex flex-col items-center">
                          <div
                            className="w-8 h-8 rounded-lg border-2 border-white dark:border-gray-700 shadow-sm"
                            style={{ backgroundColor: color }}
                            title={`${key}: ${color}`}
                          />
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate w-8 text-center">
                            {key.replace('Color', '').slice(0, 3)}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {Object.keys(preset.colors).length} colors
                    </div>
                  </div>
                </div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preview Section */}
      {previewMode && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Live Preview
          </h2>
          
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
            <div 
              className="rounded-lg p-6 space-y-4"
              style={{ 
                backgroundColor: settings.backgroundColor,
                color: settings.textColor,
                border: `1px solid ${settings.borderColor}`
              }}
            >
              <h3 
                className="text-xl font-bold"
                style={{ color: settings.primaryColor }}
              >
                Sample NFT Marketplace
              </h3>
              
              <div 
                className="p-4 rounded-lg"
                style={{ backgroundColor: settings.cardBackground }}
              >
                <h4 
                  className="font-semibold mb-2"
                  style={{ color: settings.secondaryColor }}
                >
                  Featured NFT
                </h4>
                <p style={{ color: settings.textColor }}>
                  This is how your marketplace will look with the current theme settings.
                </p>
                <button
                  className="mt-3 px-4 py-2 rounded-lg text-white font-medium"
                  style={{ backgroundColor: settings.accentColor }}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wallet-Based Save */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
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
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSaveWithWallet}
              disabled={isLoading || !currentAdmin || !connectedWallet}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLoading ? '⏳ Saving...' : '💾 Save Theme with Admin Wallet'}
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              🔄 Refresh
            </button>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Theme changes are automatically saved locally. Use "Save with Admin Wallet" to create a permanent record with ownership tracking.
          </p>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Advanced Theme Settings
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              CSS Custom Properties
            </label>
            <textarea
              className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-mono"
              placeholder="--custom-property: value;"
              defaultValue={`:root {
  --primary: ${settings.primaryColor};
  --secondary: ${settings.secondaryColor};
  --accent: ${settings.accentColor};
}`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Theme Export/Import
            </label>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                📥 Export Current Theme
              </button>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                📤 Import Theme
              </button>
              <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                🔄 Reset to Default
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}