'use client'

interface NftFilterBarProps {
  selected: string
  onSelect?: (filter: string) => void
  onSortChange?: (sort: string) => void
}

export default function NftFilterBar({ selected, onSelect, onSortChange }: NftFilterBarProps) {
  const chips = ["All", "On Sale", "Auctions", "Owned", "Trending"]
  
  return (
    <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 px-4 py-2">
      <div className="max-w-6xl mx-auto flex items-center gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        {chips.map(c => (
          <button
            key={c}
            onClick={() => onSelect?.(c)}
            className={`whitespace-nowrap px-3 py-1 rounded-md text-sm font-medium transition-all ${
              selected === c 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            aria-pressed={selected === c}
          >
            {c}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <select 
            className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
