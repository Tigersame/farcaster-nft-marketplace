'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiUpload, FiZap, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import { useMintNFT, useGetPlatformFee } from '@/lib/contracts/useMarketplace'
import { parseEther } from 'viem'

interface Property {
  trait_type: string
  value: string
}

export default function MintPortal() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('0.05')
  const [supply, setSupply] = useState('1')
  const [properties, setProperties] = useState<Property[]>([])
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState('')
  
  const { mintNFT, isLoading, isSuccess, txHash } = useMintNFT()
  const { platformFee } = useGetPlatformFee()

  // Mock stats
  const [totalMinted, setTotalMinted] = useState(122)
  const maxSupply = 500

  useEffect(() => {
    if (isSuccess) {
      setTotalMinted(prev => prev + 1)
      // Reset form
      setTimeout(() => {
        setName('')
        setDescription('')
        setFilePreview(null)
        setFileName('')
        setProperties([])
      }, 2000)
    }
  }, [isSuccess])

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = () => setFilePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  function addProperty() {
    setProperties([...properties, { trait_type: '', value: '' }])
  }

  function updateProperty(index: number, field: 'trait_type' | 'value', value: string) {
    const updated = [...properties]
    updated[index][field] = value
    setProperties(updated)
  }

  function removeProperty(index: number) {
    setProperties(properties.filter((_, i) => i !== index))
  }

  async function handleMint() {
    if (!name || !filePreview) {
      alert('Please fill in name and upload an image')
      return
    }

    // Create metadata URI (in production, upload to IPFS)
    const metadata = {
      name,
      description,
      image: filePreview,
      attributes: properties.filter(p => p.trait_type && p.value)
    }
    const metadataURI = `ipfs://QmExample${Date.now()}`

    // Mint with 5% royalty
    mintNFT(metadataURI, 500)
  }

  const platformFeeAmount = parseFloat(price) * (platformFee / 100)
  const youReceive = parseFloat(price) * (1 - platformFee / 100)

  const sampleGallery = Array.from({length: 6}, (_, i) => ({
    id: i + 1,
    title: `Genesis #${String(i + 1).padStart(3, '0')}`,
    creator: '0x' + Math.random().toString(16).slice(2, 6),
    price: (Math.random() * 0.5 + 0.05).toFixed(2)
  }))

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#141414] to-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-white/5 backdrop-blur-md bg-black/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#7A5AF8] to-[#00D2FF] flex items-center justify-center shadow-xl shadow-purple-500/20">
                <span className="text-black font-bold text-lg">🌊</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                FarcastMints
              </h1>
            </div>
            
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <a href="/front" className="text-gray-400 hover:text-white transition-colors">Explore</a>
              <a href="/collections" className="text-gray-400 hover:text-white transition-colors">Collections</a>
              <a href="/my-nfts" className="text-gray-400 hover:text-white transition-colors">My NFTs</a>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#7A5AF8] to-[#00D2FF] text-black font-semibold shadow-lg shadow-purple-500/30"
              >
                Connect Wallet
              </motion.button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Mint Box - Spans 2 columns on desktop */}
          <section className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-3xl p-6 md:p-8 backdrop-blur-xl border border-white/10 shadow-2xl"
            >
              {/* Hero Text */}
              <div className="mb-6">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent mb-2">
                  🚀 Mint Your NFT Now
                </h2>
                <p className="text-gray-400">Create a unique piece — upload art, set details and mint instantly on Base.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Left: Preview */}
                <div className="flex flex-col items-center justify-center">
                  <motion.div 
                    whileHover={{ scale: 1.02, rotateY: 5 }}
                    className="relative w-full max-w-[320px] aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-white/10 shadow-2xl"
                  >
                    {filePreview ? (
                      <img src={filePreview} alt="NFT Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-8">
                        <SampleNFTPreview />
                      </div>
                    )}
                    
                    {/* Glowing border effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
                  </motion.div>

                  {fileName && (
                    <p className="mt-3 text-sm text-gray-400 text-center truncate max-w-[320px]">
                      📁 {fileName}
                    </p>
                  )}
                </div>

                {/* Right: Form */}
                <div className="flex flex-col gap-4">
                  
                  {/* Name */}
                  <label className="block">
                    <span className="text-sm font-medium text-gray-300 mb-1 block">Name *</span>
                    <input 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="My Awesome NFT"
                      className="w-full rounded-xl p-3 bg-black/40 border border-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none text-white placeholder-gray-500"
                    />
                  </label>

                  {/* Description */}
                  <label className="block">
                    <span className="text-sm font-medium text-gray-300 mb-1 block">Description</span>
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Tell the story of your NFT..."
                      rows={3}
                      className="w-full rounded-xl p-3 bg-black/40 border border-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none text-white placeholder-gray-500 resize-none"
                    />
                  </label>

                  {/* Price & Supply */}
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <span className="text-sm font-medium text-gray-300 mb-1 block">Price (ETH)</span>
                      <input 
                        type="number"
                        step="0.001"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full rounded-xl p-3 bg-black/40 border border-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none text-white"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium text-gray-300 mb-1 block">Supply</span>
                      <input 
                        type="number"
                        value={supply}
                        onChange={(e) => setSupply(e.target.value)}
                        className="w-full rounded-xl p-3 bg-black/40 border border-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none text-white"
                      />
                    </label>
                  </div>

                  {/* Upload */}
                  <label className="block">
                    <span className="text-sm font-medium text-gray-300 mb-1 block">Upload Image *</span>
                    <div className="relative">
                      <input 
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label 
                        htmlFor="file-upload"
                        className="flex items-center justify-center gap-2 w-full rounded-xl p-3 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 border border-purple-500/30 hover:border-purple-500/50 transition-all cursor-pointer group"
                      >
                        <FiUpload className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium">Choose file (PNG, JPG, GIF)</span>
                      </label>
                    </div>
                  </label>

                  {/* Properties */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-300">Properties (optional)</span>
                      <button
                        onClick={addProperty}
                        className="text-xs px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                      >
                        + Add
                      </button>
                    </div>
                    
                    {properties.map((prop, i) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <input
                          placeholder="Type"
                          value={prop.trait_type}
                          onChange={(e) => updateProperty(i, 'trait_type', e.target.value)}
                          className="flex-1 rounded-lg p-2 bg-black/40 border border-white/10 text-sm outline-none focus:border-purple-500/50"
                        />
                        <input
                          placeholder="Value"
                          value={prop.value}
                          onChange={(e) => updateProperty(i, 'value', e.target.value)}
                          className="flex-1 rounded-lg p-2 bg-black/40 border border-white/10 text-sm outline-none focus:border-purple-500/50"
                        />
                        <button
                          onClick={() => removeProperty(i)}
                          className="px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-sm transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Fee Breakdown */}
                  <div className="mt-2 p-4 rounded-xl bg-gradient-to-r from-gray-900/60 to-gray-800/60 border border-white/5">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Listing Price</span>
                        <span className="text-white font-medium">{price} ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Platform Fee ({platformFee}%)</span>
                        <span className="text-white font-medium">{platformFeeAmount.toFixed(4)} ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Gas Fee (est.)</span>
                        <span className="text-white font-medium">~$0.50</span>
                      </div>
                      <div className="border-t border-white/10 pt-2 flex justify-between">
                        <span className="text-gray-300 font-medium">You'll receive</span>
                        <span className="text-green-400 font-bold">{youReceive.toFixed(4)} ETH</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">
                      {totalMinted} / {maxSupply} minted
                    </span>
                  </div>

                  {/* Mint Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleMint}
                    disabled={isLoading || !name || !filePreview}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#7A5AF8] to-[#00D2FF] text-black font-bold text-lg shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
                        />
                        <span>Minting NFT...</span>
                      </>
                    ) : (
                      <>
                        <FiZap className="w-5 h-5" />
                        <span>Mint NFT 🔥</span>
                      </>
                    )}
                  </motion.button>

                  {/* Status Messages */}
                  {isSuccess && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 flex items-start gap-3"
                    >
                      <FiCheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-green-400 font-medium">Mint successful!</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Your NFT has been minted. Transaction hash: {txHash?.slice(0, 10)}...
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {isLoading === false && !isSuccess && name && filePreview && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-start gap-3"
                    >
                      <FiAlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-yellow-400 text-sm">
                          Demo mode: Click to simulate minting (2-second delay)
                        </p>
                      </div>
                    </motion.div>
                  )}

                </div>
              </div>

              {/* Gallery Preview */}
              <div className="mt-10">
                <h3 className="text-xl font-bold mb-4">Collection Preview</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {sampleGallery.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ y: -8, scale: 1.05 }}
                      className="group rounded-xl overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-purple-500/30 transition-all cursor-pointer"
                    >
                      <div className="aspect-square flex items-center justify-center p-3 bg-gradient-to-br from-gray-900 to-black">
                        <SampleGalleryNFT index={item.id} />
                      </div>
                      <div className="p-3">
                        <div className="font-semibold text-sm mb-1">{item.title}</div>
                        <div className="text-xs text-gray-400 mb-2">by {item.creator}</div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-purple-400 font-medium">{item.price} ETH</span>
                          <button className="text-xs px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 transition-colors">
                            View
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

            </motion.div>
          </section>

          {/* Right Sidebar - Stats & Activity */}
          <aside className="flex flex-col gap-6">
            
            {/* Collection Stats */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl p-6 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10"
            >
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500" />
                Collection Stats
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-black/30">
                  <div className="text-xs text-gray-400 mb-1">Total Supply</div>
                  <div className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    {maxSupply}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-black/30">
                  <div className="text-xs text-gray-400 mb-1">Floor Price</div>
                  <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    0.05 Ξ
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-black/30">
                  <div className="text-xs text-gray-400 mb-1">Owners</div>
                  <div className="text-xl font-bold text-white">78</div>
                </div>
                <div className="p-3 rounded-xl bg-black/30">
                  <div className="text-xs text-gray-400 mb-1">Volume</div>
                  <div className="text-xl font-bold text-white">12.4 Ξ</div>
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl p-6 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10"
            >
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Recent Activity
              </h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3 p-3 rounded-lg bg-black/20 border border-white/5">
                  <span className="text-green-400">✓</span>
                  <div>
                    <p className="text-white">Minted Token #101</p>
                    <p className="text-gray-400 text-xs mt-1">by 0xA3...f2 · 2m ago</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-lg bg-black/20 border border-white/5">
                  <span className="text-blue-400">↗</span>
                  <div>
                    <p className="text-white">Token #99 transferred</p>
                    <p className="text-gray-400 text-xs mt-1">to 0xB1...9a · 5m ago</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-lg bg-black/20 border border-white/5">
                  <span className="text-purple-400">🏷️</span>
                  <div>
                    <p className="text-white">New listing: Token #88</p>
                    <p className="text-gray-400 text-xs mt-1">at 0.08 ETH · 12m ago</p>
                  </div>
                </li>
              </ul>
            </motion.div>

            {/* Quick Actions */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl p-6 bg-gradient-to-br from-purple-600/10 to-cyan-600/10 backdrop-blur-xl border border-purple-500/20"
            >
              <h4 className="font-bold text-lg mb-3">Need Help?</h4>
              <p className="text-sm text-gray-300 mb-4">
                Learn how to mint, list and sell your NFTs on Base network.
              </p>
              <button className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-sm font-medium">
                View Guide
              </button>
            </motion.div>

          </aside>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-sm text-gray-500">
            Built with ❤️ — FarcastMints on Base Network
          </p>
        </div>
      </footer>

    </div>
  )
}

/* SVG Components for Preview */
function SampleNFTPreview() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="preview-gradient" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#7A5AF8" />
          <stop offset="100%" stopColor="#00D2FF" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" rx="18" fill="url(#preview-gradient)" />
      <g transform="translate(18,18)">
        <circle cx="70" cy="60" r="34" fill="rgba(255,255,255,0.12)" />
        <rect x="12" y="120" width="120" height="24" rx="8" fill="rgba(0,0,0,0.18)" />
      </g>
      <text x="20" y="190" fontSize="14" fill="rgba(255,255,255,0.95)" fontFamily="sans-serif">
        FarcasterSea Preview
      </text>
    </svg>
  )
}

function SampleGalleryNFT({ index }: { index: number }) {
  const colors = ['#7A5AF8', '#00D2FF', '#FF6B6B', '#FFD166', '#4ADE80', '#C084FC']
  const color = colors[index % colors.length]
  
  return (
    <svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`gallery-gradient-${index}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>
      <rect width="200" height="200" rx="14" fill={`url(#gallery-gradient-${index})`} />
      <g transform="translate(20,20)">
        <circle cx="60" cy="40" r="28" fill="rgba(255,255,255,0.12)" />
        <rect x="8" y="84" width="100" height="20" rx="6" fill="rgba(0,0,0,0.18)" />
      </g>
      <text x="14" y="180" fontSize="12" fill="rgba(255,255,255,0.9)" fontFamily="sans-serif">
        Token #{index}
      </text>
    </svg>
  )
}
