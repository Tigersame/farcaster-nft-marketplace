'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi'
import { parseEther } from 'viem'

const GENESIS_SBT_ADDRESS = process.env.NEXT_PUBLIC_GENESIS_SBT_ADDRESS || '0x...'
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'

const GENESIS_SBT_ABI = [
  {
    "inputs": [],
    "name": "claimGenesisSBT",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "hasClaimedSBT",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalClaimed",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "remainingSupply",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
]

export default function GenesisClaimPage() {
  const { address, isConnected } = useAccount()
  const [claimed, setClaimed] = useState(false)
  const [stats, setStats] = useState({ claimed: 0, remaining: 20000 })
  const [celebrating, setCelebrating] = useState(false)

  // Check if user has already claimed
  const { data: hasClaimed } = useContractRead({
    address: GENESIS_SBT_ADDRESS,
    abi: GENESIS_SBT_ABI,
    functionName: 'hasClaimedSBT',
    args: [address],
    enabled: !!address,
  })

  // Get total claimed count
  const { data: totalClaimed, refetch: refetchStats } = useContractRead({
    address: GENESIS_SBT_ADDRESS,
    abi: GENESIS_SBT_ABI,
    functionName: 'totalClaimed',
  })

  // Get remaining supply
  const { data: remainingSupply } = useContractRead({
    address: GENESIS_SBT_ADDRESS,
    abi: GENESIS_SBT_ABI,
    functionName: 'remainingSupply',
  })

  // Claim SBT
  const { data: claimData, write: claimSBT, isLoading: isClaiming } = useContractWrite({
    address: GENESIS_SBT_ADDRESS,
    abi: GENESIS_SBT_ABI,
    functionName: 'claimGenesisSBT',
  })

  // Wait for transaction
  const { isLoading: isWaiting, isSuccess } = useWaitForTransaction({
    hash: claimData?.hash,
  })

  useEffect(() => {
    if (totalClaimed) {
      setStats(prev => ({ ...prev, claimed: Number(totalClaimed) }))
    }
    if (remainingSupply) {
      setStats(prev => ({ ...prev, remaining: Number(remainingSupply) }))
    }
  }, [totalClaimed, remainingSupply])

  useEffect(() => {
    if (hasClaimed) {
      setClaimed(true)
    }
  }, [hasClaimed])

  useEffect(() => {
    if (isSuccess) {
      setCelebrating(true)
      setClaimed(true)
      refetchStats()
      
      // Award XP on backend
      if (address) {
        awardGenesisXP(address)
      }

      setTimeout(() => setCelebrating(false), 5000)
    }
  }, [isSuccess, address])

  const awardGenesisXP = async (userAddress: string) => {
    try {
      await fetch(`${API_URL}/api/xp/genesis-sbt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: userAddress, tokenId: stats.claimed + 1 })
      })
    } catch (error) {
      console.error('Error awarding Genesis XP:', error)
    }
  }

  const handleClaim = () => {
    if (claimSBT) {
      claimSBT()
    }
  }

  const progressPercent = ((20000 - stats.remaining) / 20000) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pt-24 pb-12">
      {/* Celebration Confetti */}
      <AnimatePresence>
        {celebrating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50"
          >
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 0, 
                  y: -20, 
                  rotate: 0 
                }}
                animate={{ 
                  y: typeof window !== 'undefined' ? window.innerHeight + 20 : 1000, 
                  rotate: 360 
                }}
                transition={{ 
                  duration: 2 + Math.random() * 2, 
                  ease: 'linear' 
                }}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  background: ['#FFD700', '#FF69B4', '#00CED1', '#FF4500'][Math.floor(Math.random() * 4)]
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Genesis SBT Launch Event
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Claim your exclusive Genesis Soul Bound Token! First 20,000 users only.
            <br />
            <span className="text-yellow-400 font-semibold">Earn 500 XP + Exclusive Benefits</span>
          </p>
        </motion.div>

        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20"
        >
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {stats.claimed.toLocaleString()}
              </div>
              <div className="text-gray-300">Claimed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">
                {stats.remaining.toLocaleString()}
              </div>
              <div className="text-gray-300">Remaining</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-4 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500"
            />
          </div>
          <div className="text-center mt-2 text-sm text-gray-400">
            {progressPercent.toFixed(1)}% Claimed
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Genesis Holder Benefits
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: '✨', title: '500 XP Bonus', desc: 'Instant XP reward on claim' },
              { icon: '🎁', title: '20% Token Bonus', desc: 'Extra tokens on launch day' },
              { icon: '🏆', title: 'Exclusive Badge', desc: 'Genesis Holder status' },
              { icon: '🔥', title: 'Priority Access', desc: 'Early access to new features' },
              { icon: '💎', title: 'Non-Transferable', desc: 'Soul Bound to your wallet' },
              { icon: '🚀', title: 'Token Conversion', desc: 'Convert XP to tokens on launch' },
            ].map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-start gap-3 p-4 bg-white/5 rounded-lg"
              >
                <div className="text-3xl">{benefit.icon}</div>
                <div>
                  <div className="font-semibold text-white">{benefit.title}</div>
                  <div className="text-sm text-gray-400">{benefit.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Claim Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          {!isConnected ? (
            <button
              className="px-12 py-4 bg-gray-600 text-white rounded-full text-lg font-semibold cursor-not-allowed"
              disabled
            >
              Connect Wallet to Claim
            </button>
          ) : claimed ? (
            <div className="inline-block px-12 py-4 bg-green-600 text-white rounded-full text-lg font-semibold">
              ✅ Genesis SBT Claimed!
            </div>
          ) : stats.remaining === 0 ? (
            <div className="inline-block px-12 py-4 bg-red-600 text-white rounded-full text-lg font-semibold">
              ❌ All Genesis SBTs Claimed
            </div>
          ) : (
            <button
              onClick={handleClaim}
              disabled={isClaiming || isWaiting}
              className="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full text-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isClaiming || isWaiting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {isClaiming ? 'Claiming...' : 'Confirming...'}
                </span>
              ) : (
                '🏆 Claim Genesis SBT'
              )}
            </button>
          )}
          
          {claimed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-green-400"
            >
              🎉 Congratulations! You're now a Genesis Holder!
            </motion.p>
          )}
        </motion.div>

        {/* Info Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 p-6 bg-blue-900/30 border border-blue-500/30 rounded-xl"
        >
          <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
            <span>ℹ️</span> Important Information
          </h3>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Genesis SBTs are non-transferable (Soul Bound to your wallet)</li>
            <li>• Limited to 1 SBT per wallet address</li>
            <li>• Can be converted to tokens on official launch day</li>
            <li>• Genesis holders receive 20% bonus on token conversion</li>
            <li>• XP earned is convertible to tokens (1000 XP = 1 Token)</li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}
