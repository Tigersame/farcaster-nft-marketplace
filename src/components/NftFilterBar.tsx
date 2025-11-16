'use client'

interface NftFilterBarProps {
  selected: string
  onSelect?: (filter: string) => void
  onSortChange?: (sort: string) => void
}

export default function NftFilterBar({ selected, onSelect, onSortChange }: NftFilterBarProps) {
  const chips = ["All", "On Sale", "Auctions", "Owned", "Trending"]
  
  return (
    <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 px-2 sm:px-4 py-2">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
        {/* Filter chips - scrollable on mobile */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 w-full sm:w-auto pb-1">
          {chips.map(c => (
            <button
              key={c}
              onClick={() => onSelect?.(c)}
              className={`whitespace-nowrap px-2.5 sm:px-3 py-1.5 sm:py-1 rounded-md text-xs sm:text-sm font-medium transition-all min-h-[36px] ${
                selected === c 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              aria-pressed={selected === c}
            >
              {c}
            </button>
          ))}
        </div>
        
        {/* Sort dropdown */}
        <div className="w-full sm:w-auto sm:ml-auto">
          <select 
            className="w-full sm:w-auto rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[36px]"
            onChange={(e) => onSortChange?.(e.target.value)}
            aria-label="Sort NFTs"
          >
            <option value="newest">Sort: Newest</option>
            <option value="price-asc">Sort: Price ↑</option>
            <option value="price-desc">Sort: Price ↓</option>
            <option value="popular">Sort: Popular</option>
          </select>
        </div>
      </div>
    </div>
  )
}
