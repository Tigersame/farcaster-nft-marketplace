'use client'

import { BASE_TOKENS } from '@/constants/tokens'
import { FaSearch, FaStar } from 'react-icons/fa'

export function TokenListInterface() {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold mb-4">Top Tokens on Base</h2>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search tokens" 
              className="w-full bg-gray-100 dark:bg-gray-900 pl-10 pr-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>
        
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {BASE_TOKENS.map((token, index) => (
            <div 
              key={token.symbol}
              className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm font-medium w-4">{index + 1}</span>
                <img src={token.image} alt={token.symbol} className="w-8 h-8 rounded-full" />
                <div>
                  <div className="font-bold">{token.name}</div>
                  <div className="text-sm text-gray-500">{token.symbol}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">$0.00</div>
                <div className="text-sm text-green-500">+0.00%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
