'use client';

import React, { useState, Suspense } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import ThemeCustomizer from '@/components/admin/ThemeCustomizer';
import IconManager from '@/components/admin/IconManager';
import FeesManager from '@/components/admin/FeesManager';
import RevenueManager from '@/components/admin/RevenueManager';
import AdsManager from '@/components/admin/AdsManager';
// import NFTManager from '@/components/admin/NFTManager'; // Temporarily disabled
import CollectionManager from '@/components/admin/CollectionManager';
import LiveFeedManager from '@/components/admin/LiveFeedManager';
import AdminStats from '@/components/admin/AdminStats';
import ContentManager from '@/components/admin/ContentManager';

interface TabItem {
  id: string;
  label: string;
  icon: string;
  component: React.ComponentType;
  permission?: keyof import('@/contexts/AdminContext').AdminPermissions;
}

const tabs: TabItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', component: AdminStats },
  { id: 'content', label: 'My Content', icon: '📝', component: ContentManager },
  { id: 'revenue', label: 'Revenue', icon: '💳', component: RevenueManager, permission: 'canManageFees' },
  { id: 'ads', label: 'Advertisements', icon: '🎯', component: AdsManager, permission: 'canManageSettings' },
  { id: 'themes', label: 'Themes', icon: '🎨', component: ThemeCustomizer, permission: 'canManageThemes' },
  { id: 'icons', label: 'Icons', icon: '🖼️', component: IconManager, permission: 'canManageIcons' },
  { id: 'fees', label: 'Fees', icon: '💰', component: FeesManager, permission: 'canManageFees' },
  // Temporarily disabled due to compilation issues
  // { id: 'nfts', label: 'NFTs', icon: '🖼️', component: NFTManager, permission: 'canManageNFTs' },
  { id: 'collections', label: 'Collections', icon: '📂', component: CollectionManager, permission: 'canManageCollections' },
  { id: 'feed', label: 'Live Feed', icon: '📡', component: LiveFeedManager, permission: 'canManageFeed' },
];

export default function AdminDashboard() {
  const { currentAdmin, logout, hasPermission } = useAdmin();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Filter tabs based on permissions
  const availableTabs = tabs.filter(tab => 
    !tab.permission || hasPermission(tab.permission)
  );

  const ActiveComponent = availableTabs.find(tab => tab.id === activeTab)?.component || AdminStats;

  if (!currentAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please log in to access the admin panel.
          </p>
          <a
            href="/admin/login"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Marketplace Control Panel
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Admin Info */}
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {currentAdmin.username}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {currentAdmin.role.replace('_', ' ')}
                </p>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => {
                  logout();
                  window.location.href = '/admin/login';
                }}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>

              {/* Back to Marketplace */}
              <a
                href="/"
                className="inline-flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
                View Marketplace
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white dark:bg-gray-800 shadow-sm min-h-[calc(100vh-89px)] border-r border-gray-200 dark:border-gray-700">
          <div className="p-4">
            <div className="space-y-1">
              {availableTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-3 text-lg">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <ActiveComponent />
          </div>
        </main>
      </div>
    </div>
  );
}