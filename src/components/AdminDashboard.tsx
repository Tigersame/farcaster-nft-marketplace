"use client";

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, X, LayoutDashboard, Image, Layers, Zap, 
  DollarSign, Shield, Palette, Database, AlertTriangle,
  CheckCircle, Clock, TrendingUp, Users, Activity
} from 'lucide-react';

// Admin wallet address (replace with your admin address)
const ADMIN_ADDRESSES = [
  '0xcaA2dC702DdF5625296d42aa13B37458d29d2e49', // Your admin address
];

interface NFT {
  tokenId: string;
  name: string;
  image: string;
  price: string;
  collection?: string;
  delisted?: boolean;
}

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  royaltyBps: number;
  royaltyRecipient: string;
}

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  userId: string;
  userAddress: string;
  payload: any;
  status: string;
}

interface SafeProposal {
  id: string;
  description: string;
  status: 'pending' | 'approved' | 'executed';
  confirmations: number;
  required: number;
}

export default function AdminDashboard() {
  const { address, isConnected } = useAccount();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // State
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [safeProposals, setSafeProposals] = useState<SafeProposal[]>([]);
  const [stats, setStats] = useState({
    totalNFTs: 0,
    totalRevenue: '0',
    activeListings: 0,
    pendingProposals: 0,
  });

  // Form states
  const [mintForm, setMintForm] = useState({ to: '', metadataUri: '' });
  const [collectionForm, setCollectionForm] = useState({
    name: '',
    slug: '',
    description: '',
    coverImage: '',
    royaltyBps: 0,
  });
  const [priceForm, setPriceForm] = useState({ tokenId: '', price: '' });
  const [withdrawForm, setWithdrawForm] = useState({ amount: '', to: '', safeAddress: '' });
  const [themeSettings, setThemeSettings] = useState({
    primaryColor: '#9333ea',
    secondaryColor: '#ec4899',
    headerStyle: 'gradient',
  });

  // Prevent hydration mismatch - only render on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check admin access
  useEffect(() => {
    if (isConnected && address) {
      const isAdminWallet = ADMIN_ADDRESSES.some(
        admin => admin.toLowerCase() === address.toLowerCase()
      );
      setIsAdmin(isAdminWallet);
    } else {
      setIsAdmin(false);
    }
  }, [address, isConnected]);

  // Load data
  useEffect(() => {
    if (isAdmin && isOpen) {
      loadAuditLogs();
      loadStats();
    }
  }, [isAdmin, isOpen]);

  const loadAuditLogs = async () => {
    try {
      const response = await fetch('/api/admin/audit-logs?limit=50');
      const data = await response.json();
      setAuditLogs(data.logs || []);
    } catch (error) {
      console.error('Error loading audit logs:', error);
    }
  };

  const loadStats = async () => {
    // Load stats from APIs
    setStats({
      totalNFTs: 127,
      totalRevenue: '45.8',
      activeListings: 89,
      pendingProposals: 2,
    });
  };

  const handleMint = async () => {
    if (!mintForm.to || !mintForm.metadataUri) {
      alert('Please fill all fields');
      return;
    }

    try {
      const response = await fetch('/api/admin/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: mintForm.to,
          metadataUri: mintForm.metadataUri,
          userId: address,
          userAddress: address,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert(`NFT minted successfully! Token ID: ${data.tokenId}`);
        setMintForm({ to: '', metadataUri: '' });
        loadAuditLogs();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Mint error:', error);
      alert('Failed to mint NFT');
    }
  };

  const handleCreateCollection = async () => {
    if (!collectionForm.name || !collectionForm.slug) {
      alert('Please fill required fields');
      return;
    }

    try {
      const response = await fetch('/api/admin/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...collectionForm,
          userId: address,
          userAddress: address,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Collection created successfully!');
        setCollectionForm({
          name: '',
          slug: '',
          description: '',
          coverImage: '',
          royaltyBps: 0,
        });
        loadAuditLogs();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Collection error:', error);
      alert('Failed to create collection');
    }
  };

  const handleSetPrice = async () => {
    if (!priceForm.tokenId || !priceForm.price) {
      alert('Please fill all fields');
      return;
    }

    try {
      const response = await fetch('/api/admin/price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenId: parseInt(priceForm.tokenId),
          price: priceForm.price,
          userId: address,
          userAddress: address,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Price set successfully!');
        setPriceForm({ tokenId: '', price: '' });
        loadAuditLogs();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Price error:', error);
      alert('Failed to set price');
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawForm.amount || !withdrawForm.to || !withdrawForm.safeAddress) {
      alert('Please fill all fields');
      return;
    }

    try {
      const response = await fetch('/api/admin/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: withdrawForm.amount,
          to: withdrawForm.to,
          safeAddress: withdrawForm.safeAddress,
          userId: address,
          userAddress: address,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert(`Withdrawal proposal created! Proposal ID: ${data.proposal.id}`);
        setWithdrawForm({ amount: '', to: '', safeAddress: '' });
        loadAuditLogs();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Withdraw error:', error);
      alert('Failed to create withdrawal proposal');
    }
  };

  const handleSaveTheme = async () => {
    try {
      for (const [key, value] of Object.entries(themeSettings)) {
        await fetch('/api/admin/theme', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key,
            value,
            userId: address,
            userAddress: address,
          }),
        });
      }
      alert('Theme saved successfully!');
      loadAuditLogs();
    } catch (error) {
      console.error('Theme error:', error);
      alert('Failed to save theme');
    }
  };

  // Prevent hydration mismatch - don't render on server
  if (!isMounted) return null;
  
  if (!isAdmin) return null;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[60] p-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300"
      >
        <Settings className="w-6 h-6" />
      </button>

      {/* Admin Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-5xl bg-gradient-to-br from-gray-900 via-black to-gray-900 border-l border-purple-500/20 shadow-2xl z-[80] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-purple-500/20 bg-black/40 backdrop-blur-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>
                    <p className="text-sm text-gray-400">{address?.slice(0, 6)}...{address?.slice(-4)}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 p-4 border-b border-purple-500/20 bg-black/20 overflow-x-auto">
                {[
                  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                  { id: 'nfts', label: 'NFT Management', icon: Image },
                  { id: 'collections', label: 'Collections', icon: Layers },
                  { id: 'mint', label: 'Minting', icon: Zap },
                  { id: 'finance', label: 'Finance', icon: DollarSign },
                  { id: 'roles', label: 'Roles', icon: Shield },
                  { id: 'theme', label: 'Theme', icon: Palette },
                  { id: 'audit', label: 'Audit Log', icon: Database },
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(100vh-180px)]">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white mb-4">Dashboard Overview</h3>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-400 text-sm">Total NFTs</p>
                            <p className="text-3xl font-bold text-white mt-1">{stats.totalNFTs}</p>
                          </div>
                          <Image className="w-10 h-10 text-purple-400" />
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-400 text-sm">Total Revenue</p>
                            <p className="text-3xl font-bold text-white mt-1">{stats.totalRevenue} ETH</p>
                          </div>
                          <TrendingUp className="w-10 h-10 text-green-400" />
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-400 text-sm">Active Listings</p>
                            <p className="text-3xl font-bold text-white mt-1">{stats.activeListings}</p>
                          </div>
                          <Activity className="w-10 h-10 text-blue-400" />
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-400 text-sm">Pending Proposals</p>
                            <p className="text-3xl font-bold text-white mt-1">{stats.pendingProposals}</p>
                          </div>
                          <Clock className="w-10 h-10 text-orange-400" />
                        </div>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="p-4 rounded-xl bg-white/5 border border-purple-500/20">
                      <h4 className="text-lg font-bold text-white mb-3">Recent Admin Actions</h4>
                      <div className="space-y-2">
                        {auditLogs.slice(0, 5).map(log => (
                          <div key={log.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                            <div className="flex items-center gap-3">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <div>
                                <p className="text-white text-sm font-medium">{log.action}</p>
                                <p className="text-gray-400 text-xs">{new Date(log.timestamp).toLocaleString()}</p>
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs ${
                              log.status === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
                            }`}>
                              {log.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'mint' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white">Mint NFT</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Recipient Address</label>
                        <input
                          type="text"
                          placeholder="0x..."
                          value={mintForm.to}
                          onChange={e => setMintForm({ ...mintForm, to: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-purple-500/20 text-white focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Metadata URI</label>
                        <input
                          type="text"
                          placeholder="ipfs://... or https://..."
                          value={mintForm.metadataUri}
                          onChange={e => setMintForm({ ...mintForm, metadataUri: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-purple-500/20 text-white focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                      <button
                        onClick={handleMint}
                        className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg transition"
                      >
                        Mint NFT
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'collections' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white">Create Collection</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-400 text-sm mb-2">Name *</label>
                          <input
                            type="text"
                            value={collectionForm.name}
                            onChange={e => setCollectionForm({ ...collectionForm, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-purple-500/20 text-white focus:border-purple-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-sm mb-2">Slug *</label>
                          <input
                            type="text"
                            value={collectionForm.slug}
                            onChange={e => setCollectionForm({ ...collectionForm, slug: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-purple-500/20 text-white focus:border-purple-500 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Description</label>
                        <textarea
                          value={collectionForm.description}
                          onChange={e => setCollectionForm({ ...collectionForm, description: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-purple-500/20 text-white focus:border-purple-500 focus:outline-none h-24"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Cover Image URL</label>
                        <input
                          type="text"
                          value={collectionForm.coverImage}
                          onChange={e => setCollectionForm({ ...collectionForm, coverImage: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-purple-500/20 text-white focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Royalty (basis points, 100 = 1%)</label>
                        <input
                          type="number"
                          value={collectionForm.royaltyBps}
                          onChange={e => setCollectionForm({ ...collectionForm, royaltyBps: parseInt(e.target.value) })}
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-purple-500/20 text-white focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                      <button
                        onClick={handleCreateCollection}
                        className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg transition"
                      >
                        Create Collection
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'nfts' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white">Set NFT Price</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Token ID</label>
                        <input
                          type="number"
                          value={priceForm.tokenId}
                          onChange={e => setPriceForm({ ...priceForm, tokenId: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-purple-500/20 text-white focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Price (ETH)</label>
                        <input
                          type="text"
                          value={priceForm.price}
                          onChange={e => setPriceForm({ ...priceForm, price: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-purple-500/20 text-white focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                      <button
                        onClick={handleSetPrice}
                        className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg transition"
                      >
                        Set Price
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'finance' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white">Withdraw Revenue (Gnosis Safe)</h3>
                    <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 mb-4">
                      <div className="flex items-center gap-2 text-yellow-400">
                        <AlertTriangle className="w-5 h-5" />
                        <p className="text-sm">This creates a Gnosis Safe multisig proposal. It requires approval from other signers.</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Amount (ETH)</label>
                        <input
                          type="text"
                          value={withdrawForm.amount}
                          onChange={e => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-purple-500/20 text-white focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Recipient Address</label>
                        <input
                          type="text"
                          placeholder="0x..."
                          value={withdrawForm.to}
                          onChange={e => setWithdrawForm({ ...withdrawForm, to: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-purple-500/20 text-white focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Gnosis Safe Address</label>
                        <input
                          type="text"
                          placeholder="0x..."
                          value={withdrawForm.safeAddress}
                          onChange={e => setWithdrawForm({ ...withdrawForm, safeAddress: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-purple-500/20 text-white focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                      <button
                        onClick={handleWithdraw}
                        className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg transition"
                      >
                        Create Withdrawal Proposal
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'theme' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white">Theme Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Primary Color</label>
                        <input
                          type="color"
                          value={themeSettings.primaryColor}
                          onChange={e => setThemeSettings({ ...themeSettings, primaryColor: e.target.value })}
                          className="w-full h-12 rounded-lg bg-white/5 border border-purple-500/20 cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Secondary Color</label>
                        <input
                          type="color"
                          value={themeSettings.secondaryColor}
                          onChange={e => setThemeSettings({ ...themeSettings, secondaryColor: e.target.value })}
                          className="w-full h-12 rounded-lg bg-white/5 border border-purple-500/20 cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Header Style</label>
                        <select
                          value={themeSettings.headerStyle}
                          onChange={e => setThemeSettings({ ...themeSettings, headerStyle: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-purple-500/20 text-white focus:border-purple-500 focus:outline-none"
                        >
                          <option value="gradient">Gradient</option>
                          <option value="solid">Solid</option>
                          <option value="transparent">Transparent</option>
                        </select>
                      </div>
                      <button
                        onClick={handleSaveTheme}
                        className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg transition"
                      >
                        Save Theme Settings
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'audit' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white">Audit Log</h3>
                    <div className="space-y-2">
                      {auditLogs.map(log => (
                        <div key={log.id} className="p-4 rounded-lg bg-white/5 border border-purple-500/10">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium">{log.action}</span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              log.status === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
                            }`}>
                              {log.status}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm">{new Date(log.timestamp).toLocaleString()}</p>
                          <p className="text-gray-500 text-xs mt-1">{log.userAddress}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'roles' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white">Role Management</h3>
                    <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                      <p className="text-blue-400 text-sm">
                        Role management requires Gnosis Safe multisig approval. Use the smart contract directly or Safe UI for role changes.
                      </p>
                    </div>
                    <div className="grid gap-3">
                      {['MINTER_ROLE', 'CURATOR_ROLE', 'FINANCE_ROLE', 'PAUSER_ROLE', 'UPGRADER_ROLE'].map(role => (
                        <div key={role} className="p-4 rounded-lg bg-white/5 border border-purple-500/10">
                          <h4 className="text-white font-medium">{role}</h4>
                          <p className="text-gray-400 text-sm mt-1">
                            {role === 'MINTER_ROLE' && 'Can mint new NFTs'}
                            {role === 'CURATOR_ROLE' && 'Can manage collections and set prices'}
                            {role === 'FINANCE_ROLE' && 'Can withdraw revenue'}
                            {role === 'PAUSER_ROLE' && 'Can pause/unpause marketplace'}
                            {role === 'UPGRADER_ROLE' && 'Can upgrade smart contracts'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
