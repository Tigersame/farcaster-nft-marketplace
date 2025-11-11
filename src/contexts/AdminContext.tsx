'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Admin permission types
export interface AdminPermissions {
  canManageThemes: boolean;
  canManageIcons: boolean;
  canManageFees: boolean;
  canManageNFTs: boolean;
  canManageCollections: boolean;
  canManageFeed: boolean;
  canManageUsers: boolean;
  canViewAnalytics: boolean;
  canExportData: boolean;
  canManageSettings: boolean;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: AdminPermissions;
  lastLogin?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Content ownership tracking
export interface ContentOwnership {
  createdBy: string; // Admin user ID
  createdAt: Date;
  updatedBy: string; // Admin user ID
  updatedAt: Date;
  version: number;
}

export interface OwnedContent {
  id: string;
  type: 'nft' | 'collection' | 'theme' | 'setting' | 'feed_item';
  title: string;
  data: any;
  ownership: ContentOwnership;
  isActive: boolean;
}

export interface AdminCreatedNFT extends OwnedContent {
  type: 'nft';
  data: {
    tokenId: string;
    name: string;
    description: string;
    imageUrl: string;
    price: string;
    royalty: number;
    attributes: Array<{ trait_type: string; value: string }>;
  };
}

export interface AdminCreatedCollection extends OwnedContent {
  type: 'collection';
  data: {
    name: string;
    description: string;
    symbol: string;
    bannerImage: string;
    floorPrice: string;
    totalItems: number;
    tags: string[];
  };
}

export interface AdminCreatedTheme extends OwnedContent {
  type: 'theme';
  data: {
    name: string;
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
      card: string;
      border: string;
    };
    preset: boolean;
  };
}

export interface MarketplaceSettings {
  // Theme settings
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  cardBackground: string;
  borderColor: string;
  
  // Icon settings
  logoUrl: string;
  faviconUrl: string;
  customIcons: Record<string, string>;
  
  // Fee settings
  platformFee: number; // Percentage
  royaltyFee: number; // Percentage
  listingFee: number; // In ETH
  transactionFee: number; // Percentage
  withdrawalFee: number; // In ETH
  
  // Revenue collection settings
  revenueWallet: string; // Admin wallet address for collecting revenue
  autoWithdrawThreshold: number; // Auto withdraw when balance reaches this amount (in ETH)
  enableAutoWithdraw: boolean;
  withdrawalSchedule: 'immediate' | 'daily' | 'weekly' | 'monthly';
  
  // General settings
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  socialLinks: {
    twitter?: string;
    discord?: string;
    telegram?: string;
  };
  
  // Feature flags
  features: {
    enableChat: boolean;
    enableSocialProof: boolean;
    enableFrames: boolean;
    enableCollections: boolean;
    enableAnalytics: boolean;
  };
}

interface AdminContextType {
  // Auth state
  isLoggedIn: boolean;
  currentAdmin: AdminUser | null;
  
  // Settings state
  settings: MarketplaceSettings;
  
  // Owned content state
  ownedContent: OwnedContent[];
  
  // Auth methods
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  
  // Settings methods
  updateSettings: (newSettings: Partial<MarketplaceSettings>) => Promise<boolean>;
  resetSettings: () => void;
  exportSettings: () => string;
  importSettings: (settingsJson: string) => boolean;
  saveSettings: () => Promise<boolean>;
  
  // Content ownership methods
  createContent: (type: OwnedContent['type'], title: string, data: any) => Promise<string>;
  updateContent: (id: string, data: any) => Promise<boolean>;
  deleteContent: (id: string) => Promise<boolean>;
  getContentByType: (type: OwnedContent['type']) => OwnedContent[];
  getContentById: (id: string) => OwnedContent | null;
  transferOwnership: (contentId: string, newOwnerId: string) => Promise<boolean>;
  
  // Backup and versioning
  createBackup: () => string;
  restoreBackup: (backupData: string) => Promise<boolean>;
  getVersionHistory: (contentId: string) => ContentOwnership[];
  
  // Permission checks
  hasPermission: (permission: keyof AdminPermissions) => boolean;
  canModifyContent: (contentId: string) => boolean;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Default admin permissions
const SUPER_ADMIN_PERMISSIONS: AdminPermissions = {
  canManageThemes: true,
  canManageIcons: true,
  canManageFees: true,
  canManageNFTs: true,
  canManageCollections: true,
  canManageFeed: true,
  canManageUsers: true,
  canViewAnalytics: true,
  canExportData: true,
  canManageSettings: true,
};

const ADMIN_PERMISSIONS: AdminPermissions = {
  canManageThemes: true,
  canManageIcons: true,
  canManageFees: true,
  canManageNFTs: true,
  canManageCollections: true,
  canManageFeed: true,
  canManageUsers: false,
  canViewAnalytics: true,
  canExportData: false,
  canManageSettings: false,
};

const MODERATOR_PERMISSIONS: AdminPermissions = {
  canManageThemes: false,
  canManageIcons: false,
  canManageFees: false,
  canManageNFTs: true,
  canManageCollections: true,
  canManageFeed: true,
  canManageUsers: false,
  canViewAnalytics: false,
  canExportData: false,
  canManageSettings: false,
};

// Default marketplace settings
const DEFAULT_SETTINGS: MarketplaceSettings = {
  // Theme settings
  primaryColor: '#6366f1',
  secondaryColor: '#8b5cf6',
  accentColor: '#06b6d4',
  backgroundColor: '#ffffff',
  textColor: '#111827',
  cardBackground: '#f9fafb',
  borderColor: '#e5e7eb',
  
  // Icon settings
  logoUrl: '/logo.png',
  faviconUrl: '/favicon.ico',
  customIcons: {},
  
  // Fee settings
  platformFee: 2.5, // 2.5%
  royaltyFee: 10, // 10%
  listingFee: 0.001, // 0.001 ETH
  transactionFee: 1, // 1%
  withdrawalFee: 0.005, // 0.005 ETH
  
  // Revenue collection settings
  revenueWallet: '', // Admin wallet address for collecting revenue
  autoWithdrawThreshold: 10, // Auto withdraw when balance reaches 10 ETH
  enableAutoWithdraw: false,
  withdrawalSchedule: 'weekly' as const,
  
  // General settings
  siteName: 'FarcastSea',
  siteDescription: 'The premier NFT marketplace for Farcaster community',
  contactEmail: 'admin@farcastsea.com',
  socialLinks: {
    twitter: 'https://twitter.com/farcaster',
    discord: 'https://discord.gg/farcaster',
  },
  
  // Feature flags
  features: {
    enableChat: true,
    enableSocialProof: true,
    enableFrames: true,
    enableCollections: true,
    enableAnalytics: true,
  },
};

// Mock admin users (in production, this would come from a database)
const MOCK_ADMINS: AdminUser[] = [
  {
    id: '1',
    username: 'superadmin',
    email: 'super@admin.com',
    role: 'super_admin',
    permissions: SUPER_ADMIN_PERMISSIONS,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  {
    id: '2',
    username: 'admin',
    email: 'admin@admin.com',
    role: 'admin',
    permissions: ADMIN_PERMISSIONS,
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
  },
  {
    id: '3',
    username: 'moderator',
    email: 'mod@admin.com',
    role: 'moderator',
    permissions: MODERATOR_PERMISSIONS,
    isActive: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date(),
  },
];

interface AdminProviderProps {
  children: ReactNode;
}

export function AdminProvider({ children }: AdminProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [settings, setSettings] = useState<MarketplaceSettings>(DEFAULT_SETTINGS);
  const [ownedContent, setOwnedContent] = useState<OwnedContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate unique ID for content
  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Load saved settings and auth state on mount
  useEffect(() => {
    try {
      // Load settings from localStorage
      const savedSettings = localStorage.getItem('marketplace-admin-settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }

      // Load owned content
      const savedContent = localStorage.getItem('marketplace-admin-content');
      if (savedContent) {
        const parsed = JSON.parse(savedContent);
        // Convert date strings back to Date objects
        const contentWithDates = parsed.map((content: any) => ({
          ...content,
          ownership: {
            ...content.ownership,
            createdAt: new Date(content.ownership.createdAt),
            updatedAt: new Date(content.ownership.updatedAt)
          }
        }));
        setOwnedContent(contentWithDates);
      }

      // Load admin session
      const savedSession = localStorage.getItem('marketplace-admin-session');
      if (savedSession) {
        const session = JSON.parse(savedSession);
        const admin = MOCK_ADMINS.find(a => a.id === session.adminId);
        if (admin && session.expires > Date.now()) {
          setCurrentAdmin(admin);
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem('marketplace-admin-session');
        }
      }
    } catch (error) {
      console.error('Error loading admin state:', error);
      setError('Failed to load admin settings');
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock authentication - in production, this would be a real API call
      const admin = MOCK_ADMINS.find(a => 
        a.username === username && 
        a.isActive
      );

      if (!admin) {
        setError('Invalid credentials');
        return false;
      }

      // Simple password check (in production, use proper hashing)
      const validPasswords: Record<string, string> = {
        'superadmin': 'super123',
        'admin': 'admin123',
        'moderator': 'mod123',
      };

      if (validPasswords[username] !== password) {
        setError('Invalid credentials');
        return false;
      }

      // Set session
      const session = {
        adminId: admin.id,
        expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      };
      localStorage.setItem('marketplace-admin-session', JSON.stringify(session));

      setCurrentAdmin(admin);
      setIsLoggedIn(true);
      return true;

    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('marketplace-admin-session');
    setCurrentAdmin(null);
    setIsLoggedIn(false);
    setError(null);
  };

  const updateSettings = async (newSettings: Partial<MarketplaceSettings>): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      
      // Save to localStorage
      localStorage.setItem('marketplace-admin-settings', JSON.stringify(updatedSettings));
      
      return true;
    } catch (error) {
      console.error('Error updating settings:', error);
      setError('Failed to update settings');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem('marketplace-admin-settings');
  };

  const exportSettings = (): string => {
    return JSON.stringify(settings, null, 2);
  };

  const importSettings = (settingsJson: string): boolean => {
    try {
      const newSettings = JSON.parse(settingsJson);
      setSettings({ ...DEFAULT_SETTINGS, ...newSettings });
      localStorage.setItem('marketplace-admin-settings', JSON.stringify(newSettings));
      return true;
    } catch (error) {
      console.error('Error importing settings:', error);
      setError('Invalid settings format');
      return false;
    }
  };

  const hasPermission = (permission: keyof AdminPermissions): boolean => {
    if (!currentAdmin) return false;
    return currentAdmin.permissions[permission];
  };

  // New ownership and content management methods
  const saveSettings = async (): Promise<boolean> => {
    try {
      localStorage.setItem('marketplace-admin-settings', JSON.stringify(settings));
      localStorage.setItem('marketplace-admin-content', JSON.stringify(ownedContent));
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Failed to save settings');
      return false;
    }
  };

  const createContent = async (
    type: OwnedContent['type'], 
    title: string, 
    data: any
  ): Promise<string> => {
    if (!currentAdmin) throw new Error('No admin logged in');

    const id = generateId();
    const newContent: OwnedContent = {
      id,
      type,
      title,
      data,
      ownership: {
        createdBy: currentAdmin.id,
        createdAt: new Date(),
        updatedBy: currentAdmin.id,
        updatedAt: new Date(),
        version: 1,
      },
      isActive: true,
    };

    setOwnedContent(prev => [...prev, newContent]);
    localStorage.setItem('marketplace-admin-content', JSON.stringify([...ownedContent, newContent]));
    
    return id;
  };

  const updateContent = async (id: string, data: any): Promise<boolean> => {
    if (!currentAdmin) return false;

    try {
      setOwnedContent(prev => prev.map(content => {
        if (content.id === id) {
          return {
            ...content,
            data: { ...content.data, ...data },
            ownership: {
              ...content.ownership,
              updatedBy: currentAdmin.id,
              updatedAt: new Date(),
              version: content.ownership.version + 1,
            },
          };
        }
        return content;
      }));

      const updatedContent = ownedContent.map(content => {
        if (content.id === id) {
          return {
            ...content,
            data: { ...content.data, ...data },
            ownership: {
              ...content.ownership,
              updatedBy: currentAdmin.id,
              updatedAt: new Date(),
              version: content.ownership.version + 1,
            },
          };
        }
        return content;
      });

      localStorage.setItem('marketplace-admin-content', JSON.stringify(updatedContent));
      return true;
    } catch (error) {
      console.error('Error updating content:', error);
      setError('Failed to update content');
      return false;
    }
  };

  const deleteContent = async (id: string): Promise<boolean> => {
    if (!currentAdmin) return false;

    try {
      const updatedContent = ownedContent.filter(content => content.id !== id);
      setOwnedContent(updatedContent);
      localStorage.setItem('marketplace-admin-content', JSON.stringify(updatedContent));
      return true;
    } catch (error) {
      console.error('Error deleting content:', error);
      setError('Failed to delete content');
      return false;
    }
  };

  const getContentByType = (type: OwnedContent['type']): OwnedContent[] => {
    return ownedContent.filter(content => content.type === type && content.isActive);
  };

  const getContentById = (id: string): OwnedContent | null => {
    return ownedContent.find(content => content.id === id) || null;
  };

  const transferOwnership = async (contentId: string, newOwnerId: string): Promise<boolean> => {
    if (!currentAdmin || !hasPermission('canManageUsers')) return false;

    try {
      setOwnedContent(prev => prev.map(content => {
        if (content.id === contentId) {
          return {
            ...content,
            ownership: {
              ...content.ownership,
              createdBy: newOwnerId,
              updatedBy: currentAdmin.id,
              updatedAt: new Date(),
              version: content.ownership.version + 1,
            },
          };
        }
        return content;
      }));

      const updatedContent = ownedContent.map(content => {
        if (content.id === contentId) {
          return {
            ...content,
            ownership: {
              ...content.ownership,
              createdBy: newOwnerId,
              updatedBy: currentAdmin.id,
              updatedAt: new Date(),
              version: content.ownership.version + 1,
            },
          };
        }
        return content;
      });

      localStorage.setItem('marketplace-admin-content', JSON.stringify(updatedContent));
      return true;
    } catch (error) {
      console.error('Error transferring ownership:', error);
      setError('Failed to transfer ownership');
      return false;
    }
  };

  const createBackup = (): string => {
    const backupData = {
      settings,
      ownedContent,
      timestamp: new Date().toISOString(),
      version: '1.0',
      createdBy: currentAdmin?.id,
    };
    return JSON.stringify(backupData, null, 2);
  };

  const restoreBackup = async (backupData: string): Promise<boolean> => {
    if (!currentAdmin || !hasPermission('canManageSettings')) return false;

    try {
      const parsed = JSON.parse(backupData);
      
      if (parsed.settings) {
        setSettings({ ...DEFAULT_SETTINGS, ...parsed.settings });
        localStorage.setItem('marketplace-admin-settings', JSON.stringify(parsed.settings));
      }
      
      if (parsed.ownedContent) {
        setOwnedContent(parsed.ownedContent);
        localStorage.setItem('marketplace-admin-content', JSON.stringify(parsed.ownedContent));
      }
      
      return true;
    } catch (error) {
      console.error('Error restoring backup:', error);
      setError('Failed to restore backup');
      return false;
    }
  };

  const getVersionHistory = (contentId: string): ContentOwnership[] => {
    // In a real app, this would fetch from a database
    const content = getContentById(contentId);
    return content ? [content.ownership] : [];
  };

  const canModifyContent = (contentId: string): boolean => {
    if (!currentAdmin) return false;
    if (hasPermission('canManageUsers')) return true; // Super admin can modify anything
    
    const content = getContentById(contentId);
    return content ? content.ownership.createdBy === currentAdmin.id : false;
  };

  const value: AdminContextType = {
    isLoggedIn,
    currentAdmin,
    settings,
    ownedContent,
    login,
    logout,
    updateSettings,
    resetSettings,
    exportSettings,
    importSettings,
    saveSettings,
    createContent,
    updateContent,
    deleteContent,
    getContentByType,
    getContentById,
    transferOwnership,
    createBackup,
    restoreBackup,
    getVersionHistory,
    hasPermission,
    canModifyContent,
    isLoading,
    error,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}