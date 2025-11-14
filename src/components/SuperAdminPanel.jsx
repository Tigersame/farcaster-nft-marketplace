// components/SuperAdminPanel.jsx
"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { 
  Settings, 
  Plus, 
  Trash2, 
  DollarSign, 
  Palette, 
  Image, 
  Wallet,
  Download,
  Lock,
  Unlock,
  Edit,
  Save,
  X,
  FileText,
  BarChart3,
  Users,
  TrendingUp,
  Zap,
  Shield
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ADMIN_ADDRESS = "0xcaA2dC702DdF5625296d42aa13B37458d29d2e49";

export default function SuperAdminPanel() {
  const { address, isConnected } = useAccount();
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showPanel, setShowPanel] = useState(false);
  
  // NFT Management
  const [nfts, setNfts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [showAddNFT, setShowAddNFT] = useState(false);
  const [showAddCollection, setShowAddCollection] = useState(false);
  
  // Theme Settings
  const [themeSettings, setThemeSettings] = useState({
    primaryColor: "#8B5CF6",
    secondaryColor: "#3B82F6",
    accentColor: "#10B981",
    headerStyle: "gradient",
    logoText: "FarcastMints"
  });
  
  // Revenue
  const [revenue, setRevenue] = useState({
    total: "125.5 ETH",
    pending: "12.3 ETH",
    withdrawn: "113.2 ETH"
  });
  
  // New NFT Form
  const [newNFT, setNewNFT] = useState({
    name: "",
    description: "",
    image: "",
    price: "",
    collection: "",
    tokenId: ""
  });
  
  // New Collection Form
  const [newCollection, setNewCollection] = useState({
    name: "",
    description: "",
    image: "",
    contractAddress: "",
    category: ""
  });

  useEffect(() => {
    if (isConnected && address) {
      setIsAdmin(address.toLowerCase() === ADMIN_ADDRESS.toLowerCase());
    } else {
      setIsAdmin(false);
    }
  }, [address, isConnected]);

  useEffect(() => {
    // Load NFTs from localStorage or API
    const savedNFTs = localStorage.getItem("admin_nfts");
    if (savedNFTs) {
      setNfts(JSON.parse(savedNFTs));
    }
    
    const savedCollections = localStorage.getItem("admin_collections");
    if (savedCollections) {
      setCollections(JSON.parse(savedCollections));
    }
    
    const savedTheme = localStorage.getItem("admin_theme");
    if (savedTheme) {
      setThemeSettings(JSON.parse(savedTheme));
    }
  }, []);

  const handleAddNFT = () => {
    if (!newNFT.name || !newNFT.price) {
      alert("Please fill in required fields");
      return;
    }
    
    const nft = {
      id: Date.now(),
      ...newNFT,
      createdAt: new Date().toISOString(),
      status: "active"
    };
    
    const updatedNFTs = [...nfts, nft];
    setNfts(updatedNFTs);
    localStorage.setItem("admin_nfts", JSON.stringify(updatedNFTs));
    
    setNewNFT({
      name: "",
      description: "",
      image: "",
      price: "",
      collection: "",
      tokenId: ""
    });
    setShowAddNFT(false);
    alert("NFT added successfully!");
  };

  const handleRemoveNFT = (id) => {
    if (confirm("Are you sure you want to remove this NFT?")) {
      const updatedNFTs = nfts.filter(nft => nft.id !== id);
      setNfts(updatedNFTs);
      localStorage.setItem("admin_nfts", JSON.stringify(updatedNFTs));
    }
  };

  const handleUpdatePrice = (id, newPrice) => {
    const updatedNFTs = nfts.map(nft => 
      nft.id === id ? { ...nft, price: newPrice } : nft
    );
    setNfts(updatedNFTs);
    localStorage.setItem("admin_nfts", JSON.stringify(updatedNFTs));
  };

  const handleAddCollection = () => {
    if (!newCollection.name || !newCollection.contractAddress) {
      alert("Please fill in required fields");
      return;
    }
    
    const collection = {
      id: Date.now(),
      ...newCollection,
      createdAt: new Date().toISOString(),
      nftCount: 0
    };
    
    const updatedCollections = [...collections, collection];
    setCollections(updatedCollections);
    localStorage.setItem("admin_collections", JSON.stringify(updatedCollections));
    
    setNewCollection({
      name: "",
      description: "",
      image: "",
      contractAddress: "",
      category: ""
    });
    setShowAddCollection(false);
    alert("Collection added successfully!");
  };

  const handleRemoveCollection = (id) => {
    if (confirm("Are you sure you want to remove this collection?")) {
      const updatedCollections = collections.filter(col => col.id !== id);
      setCollections(updatedCollections);
      localStorage.setItem("admin_collections", JSON.stringify(updatedCollections));
    }
  };

  const handleSaveTheme = () => {
    localStorage.setItem("admin_theme", JSON.stringify(themeSettings));
    alert("Theme settings saved!");
    // Apply theme to document
    document.documentElement.style.setProperty('--primary-color', themeSettings.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', themeSettings.secondaryColor);
  };

  const handleWithdrawRevenue = () => {
    if (confirm(`Withdraw ${revenue.pending} to your wallet?`)) {
      // In production, this would call a smart contract function
      alert(`Withdrawal initiated! ${revenue.pending} will be sent to ${address}`);
      setRevenue({
        ...revenue,
        withdrawn: (parseFloat(revenue.withdrawn) + parseFloat(revenue.pending)).toFixed(1) + " ETH",
        pending: "0 ETH"
      });
    }
  };

  if (!isConnected) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-500/20 border border-red-500 rounded-lg p-4 text-white">
        <Shield className="w-5 h-5 inline mr-2" />
        Please connect wallet to access admin panel
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      {/* Admin Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setShowPanel(!showPanel)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-2xl transition-all"
        title="Admin Panel"
      >
        <Settings className={`w-6 h-6 ${showPanel ? 'rotate-180' : ''} transition-transform`} />
      </motion.button>

      {/* Admin Panel */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-4xl bg-gray-900 border-l border-purple-500/20 shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-900 to-pink-900 p-6 border-b border-purple-500/20 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Shield className="w-7 h-7" />
                    Super Admin Panel
                  </h2>
                  <p className="text-purple-200 text-sm mt-1">
                    Full ownership control • {address?.slice(0, 6)}...{address?.slice(-4)}
                  </p>
                </div>
                <button
                  onClick={() => setShowPanel(false)}
                  className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Tabs */}
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {[
                  { id: "overview", label: "Overview", icon: BarChart3 },
                  { id: "nfts", label: "Manage NFTs", icon: Image },
                  { id: "collections", label: "Collections", icon: FileText },
                  { id: "theme", label: "Theme", icon: Palette },
                  { id: "revenue", label: "Revenue", icon: DollarSign },
                  { id: "settings", label: "Settings", icon: Settings }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center gap-2 transition-all ${
                        activeTab === tab.id
                          ? "bg-white text-purple-900 font-medium"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-6 rounded-xl border border-purple-500/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-sm">Total NFTs</p>
                          <p className="text-3xl font-bold text-white mt-1">{nfts.length}</p>
                        </div>
                        <Image className="w-12 h-12 text-purple-400" />
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-6 rounded-xl border border-blue-500/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-sm">Collections</p>
                          <p className="text-3xl font-bold text-white mt-1">{collections.length}</p>
                        </div>
                        <FileText className="w-12 h-12 text-blue-400" />
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-6 rounded-xl border border-green-500/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-sm">Total Revenue</p>
                          <p className="text-3xl font-bold text-white mt-1">{revenue.total}</p>
                        </div>
                        <TrendingUp className="w-12 h-12 text-green-400" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                    <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <button
                        onClick={() => { setActiveTab("nfts"); setShowAddNFT(true); }}
                        className="p-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors flex flex-col items-center gap-2"
                      >
                        <Plus className="w-6 h-6" />
                        Add NFT
                      </button>
                      <button
                        onClick={() => { setActiveTab("collections"); setShowAddCollection(true); }}
                        className="p-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors flex flex-col items-center gap-2"
                      >
                        <Plus className="w-6 h-6" />
                        Add Collection
                      </button>
                      <button
                        onClick={() => setActiveTab("theme")}
                        className="p-4 bg-pink-600 hover:bg-pink-700 rounded-lg text-white font-medium transition-colors flex flex-col items-center gap-2"
                      >
                        <Palette className="w-6 h-6" />
                        Customize Theme
                      </button>
                      <button
                        onClick={() => setActiveTab("revenue")}
                        className="p-4 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors flex flex-col items-center gap-2"
                      >
                        <Download className="w-6 h-6" />
                        Withdraw Funds
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Manage NFTs Tab */}
              {activeTab === "nfts" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-white">Manage NFTs</h3>
                    <button
                      onClick={() => setShowAddNFT(true)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium flex items-center gap-2 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      Add New NFT
                    </button>
                  </div>

                  {/* Add NFT Modal */}
                  {showAddNFT && (
                    <div className="bg-gray-800 p-6 rounded-xl border border-purple-500/30">
                      <h4 className="text-xl font-bold text-white mb-4">Add New NFT</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="NFT Name *"
                          value={newNFT.name}
                          onChange={(e) => setNewNFT({ ...newNFT, name: e.target.value })}
                          className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Price (ETH) *"
                          value={newNFT.price}
                          onChange={(e) => setNewNFT({ ...newNFT, price: e.target.value })}
                          className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Image URL"
                          value={newNFT.image}
                          onChange={(e) => setNewNFT({ ...newNFT, image: e.target.value })}
                          className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Token ID"
                          value={newNFT.tokenId}
                          onChange={(e) => setNewNFT({ ...newNFT, tokenId: e.target.value })}
                          className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Collection"
                          value={newNFT.collection}
                          onChange={(e) => setNewNFT({ ...newNFT, collection: e.target.value })}
                          className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 outline-none"
                        />
                        <textarea
                          placeholder="Description"
                          value={newNFT.description}
                          onChange={(e) => setNewNFT({ ...newNFT, description: e.target.value })}
                          className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 outline-none md:col-span-2"
                          rows="3"
                        />
                      </div>
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={handleAddNFT}
                          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium flex items-center gap-2 transition-colors"
                        >
                          <Save className="w-5 h-5" />
                          Add NFT
                        </button>
                        <button
                          onClick={() => setShowAddNFT(false)}
                          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* NFT List */}
                  <div className="space-y-3">
                    {nfts.length === 0 ? (
                      <div className="text-center py-12 text-gray-400">
                        <Image className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>No NFTs added yet. Add your first NFT to get started!</p>
                      </div>
                    ) : (
                      nfts.map((nft) => (
                        <div key={nft.id} className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                              {nft.image ? (
                                <img src={nft.image} alt={nft.name} className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                <Image className="w-8 h-8 text-white" />
                              )}
                            </div>
                            <div>
                              <h4 className="text-white font-bold">{nft.name}</h4>
                              <p className="text-gray-400 text-sm">{nft.collection || "No collection"} • Token #{nft.tokenId || "N/A"}</p>
                              <p className="text-purple-400 font-medium mt-1">{nft.price} ETH</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const newPrice = prompt("Enter new price (ETH):", nft.price);
                                if (newPrice) handleUpdatePrice(nft.id, newPrice);
                              }}
                              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                              title="Edit Price"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRemoveNFT(nft.id)}
                              className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
                              title="Remove NFT"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Collections Tab */}
              {activeTab === "collections" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-white">Manage Collections</h3>
                    <button
                      onClick={() => setShowAddCollection(true)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium flex items-center gap-2 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      Add Collection
                    </button>
                  </div>

                  {/* Add Collection Modal */}
                  {showAddCollection && (
                    <div className="bg-gray-800 p-6 rounded-xl border border-blue-500/30">
                      <h4 className="text-xl font-bold text-white mb-4">Add New Collection</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Collection Name *"
                          value={newCollection.name}
                          onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
                          className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Contract Address *"
                          value={newCollection.contractAddress}
                          onChange={(e) => setNewCollection({ ...newCollection, contractAddress: e.target.value })}
                          className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Image URL"
                          value={newCollection.image}
                          onChange={(e) => setNewCollection({ ...newCollection, image: e.target.value })}
                          className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Category"
                          value={newCollection.category}
                          onChange={(e) => setNewCollection({ ...newCollection, category: e.target.value })}
                          className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 outline-none"
                        />
                        <textarea
                          placeholder="Description"
                          value={newCollection.description}
                          onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
                          className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 outline-none md:col-span-2"
                          rows="3"
                        />
                      </div>
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={handleAddCollection}
                          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium flex items-center gap-2 transition-colors"
                        >
                          <Save className="w-5 h-5" />
                          Add Collection
                        </button>
                        <button
                          onClick={() => setShowAddCollection(false)}
                          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Collections List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {collections.length === 0 ? (
                      <div className="col-span-2 text-center py-12 text-gray-400">
                        <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>No collections added yet.</p>
                      </div>
                    ) : (
                      collections.map((collection) => (
                        <div key={collection.id} className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                {collection.image ? (
                                  <img src={collection.image} alt={collection.name} className="w-full h-full object-cover rounded-lg" />
                                ) : (
                                  <FileText className="w-6 h-6 text-white" />
                                )}
                              </div>
                              <div>
                                <h4 className="text-white font-bold">{collection.name}</h4>
                                <p className="text-gray-400 text-xs">{collection.category || "Uncategorized"}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveCollection(collection.id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                              title="Remove Collection"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-gray-400 text-sm mb-2">{collection.description}</p>
                          <p className="text-xs text-gray-500 font-mono truncate">{collection.contractAddress}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Theme Settings Tab */}
              {activeTab === "theme" && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white">Theme Customization</h3>
                  
                  <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-4">
                    <div>
                      <label className="text-white font-medium block mb-2">Primary Color</label>
                      <div className="flex gap-3 items-center">
                        <input
                          type="color"
                          value={themeSettings.primaryColor}
                          onChange={(e) => setThemeSettings({ ...themeSettings, primaryColor: e.target.value })}
                          className="w-20 h-12 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={themeSettings.primaryColor}
                          onChange={(e) => setThemeSettings({ ...themeSettings, primaryColor: e.target.value })}
                          className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-white font-medium block mb-2">Secondary Color</label>
                      <div className="flex gap-3 items-center">
                        <input
                          type="color"
                          value={themeSettings.secondaryColor}
                          onChange={(e) => setThemeSettings({ ...themeSettings, secondaryColor: e.target.value })}
                          className="w-20 h-12 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={themeSettings.secondaryColor}
                          onChange={(e) => setThemeSettings({ ...themeSettings, secondaryColor: e.target.value })}
                          className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-white font-medium block mb-2">Accent Color</label>
                      <div className="flex gap-3 items-center">
                        <input
                          type="color"
                          value={themeSettings.accentColor}
                          onChange={(e) => setThemeSettings({ ...themeSettings, accentColor: e.target.value })}
                          className="w-20 h-12 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={themeSettings.accentColor}
                          onChange={(e) => setThemeSettings({ ...themeSettings, accentColor: e.target.value })}
                          className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-white font-medium block mb-2">Logo Text</label>
                      <input
                        type="text"
                        value={themeSettings.logoText}
                        onChange={(e) => setThemeSettings({ ...themeSettings, logoText: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                      />
                    </div>

                    <div>
                      <label className="text-white font-medium block mb-2">Header Style</label>
                      <select
                        value={themeSettings.headerStyle}
                        onChange={(e) => setThemeSettings({ ...themeSettings, headerStyle: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                      >
                        <option value="gradient">Gradient</option>
                        <option value="solid">Solid</option>
                        <option value="transparent">Transparent</option>
                        <option value="glass">Glass Morphism</option>
                      </select>
                    </div>

                    <button
                      onClick={handleSaveTheme}
                      className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <Save className="w-5 h-5" />
                      Save Theme Settings
                    </button>
                  </div>
                </div>
              )}

              {/* Revenue Tab */}
              {activeTab === "revenue" && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white">Revenue Management</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-6 rounded-xl border border-green-500/30">
                      <p className="text-gray-300 text-sm mb-1">Total Revenue</p>
                      <p className="text-3xl font-bold text-white">{revenue.total}</p>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 p-6 rounded-xl border border-yellow-500/30">
                      <p className="text-gray-300 text-sm mb-1">Pending Withdrawal</p>
                      <p className="text-3xl font-bold text-white">{revenue.pending}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-6 rounded-xl border border-blue-500/30">
                      <p className="text-gray-300 text-sm mb-1">Already Withdrawn</p>
                      <p className="text-3xl font-bold text-white">{revenue.withdrawn}</p>
                    </div>
                  </div>

                  <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Wallet className="w-6 h-6" />
                      Withdraw Funds
                    </h4>
                    <p className="text-gray-400 mb-4">
                      Withdraw pending revenue to your admin wallet: <span className="text-purple-400 font-mono">{address}</span>
                    </p>
                    <button
                      onClick={handleWithdrawRevenue}
                      disabled={revenue.pending === "0 ETH"}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium flex items-center gap-2 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      Withdraw {revenue.pending}
                    </button>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white">Admin Settings</h3>
                  
                  <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                      <div>
                        <h4 className="text-white font-medium">Admin Address</h4>
                        <p className="text-gray-400 text-sm font-mono">{ADMIN_ADDRESS}</p>
                      </div>
                      <Shield className="w-8 h-8 text-green-500" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                      <div>
                        <h4 className="text-white font-medium">Connected Wallet</h4>
                        <p className="text-gray-400 text-sm font-mono">{address}</p>
                      </div>
                      <Wallet className="w-8 h-8 text-purple-500" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                      <div>
                        <h4 className="text-white font-medium">Access Level</h4>
                        <p className="text-gray-400 text-sm">Super Admin - Full Control</p>
                      </div>
                      <Zap className="w-8 h-8 text-yellow-500" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
