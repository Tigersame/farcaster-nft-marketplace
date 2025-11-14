'use client'

import React, { useEffect, useMemo, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import ReactDOM from "react-dom"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import NavigationBar from '@/components/NavigationBar'

/*
  CollectionPageFull.tsx
  - PRO Collection Page with filters, graphs, infinite scroll
  - Integrated with Next.js App Router
*/

const PAGE_SIZE = 12

interface NFTItem {
  id: string
  tokenId: number
  name: string
  image: string
  price: string
  traits?: Record<string, string>
}

interface Collection {
  id: string
  name: string
  description: string
  verified: boolean
  contractUrl: string
  itemsCount: number
  floorPrice: number
  volume: number
  image: string
  traits: Array<{ key: string; values: string[] }>
}

interface ActivityData {
  date: string
  volume: number
  floor: number
}

/* -----------------------
   Placeholder fetchers - Replace with your API
   -----------------------*/
async function fetchCollection(collectionId: string): Promise<Collection> {
  // TODO: Replace with your API endpoint
  await new Promise(r => setTimeout(r, 500))
  return {
    id: collectionId,
    name: "Base Apes Collection",
    description: "Premium PFP collection on Base network with unique traits and rarity",
    verified: true,
    contractUrl: "https://basescan.org/address/0x...",
    itemsCount: 1234,
    floorPrice: 0.12,
    volume: 84.9,
    image: "/placeholder-collection-hero.jpg",
    traits: [
      { key: "Background", values: ["Blue", "Green", "Red", "Purple", "Yellow"] },
      { key: "Eyes", values: ["Angry", "Happy", "Sleepy", "Laser"] },
      { key: "Accessories", values: ["None", "Hat", "Glasses", "Earring"] },
    ]
  }
}

async function fetchItemsPage(collectionId: string, page: number, pageSize = PAGE_SIZE): Promise<{ items: NFTItem[]; hasMore: boolean }> {
  // TODO: Replace with your API endpoint
  await new Promise(r => setTimeout(r, 700))
  const items = Array.from({ length: pageSize }).map((_, i) => {
    const id = `item-${page}-${i}`
    const tokenId = page * pageSize + i + 1
    return {
      id,
      tokenId,
      name: `Base Ape #${tokenId}`,
      image: `https://picsum.photos/seed/${id}/600/600`,
      price: (Math.random() * 0.02 + 0.001).toFixed(4),
      traits: {
        Background: ["Blue", "Green", "Red", "Purple", "Yellow"][Math.floor(Math.random() * 5)],
        Eyes: ["Angry", "Happy", "Sleepy", "Laser"][Math.floor(Math.random() * 4)],
        Accessories: ["None", "Hat", "Glasses", "Earring"][Math.floor(Math.random() * 4)],
      },
    }
  })
  return { items, hasMore: page < 6 }
}

async function fetchActivity(collectionId: string): Promise<ActivityData[]> {
  // TODO: Replace with your API endpoint
  await new Promise(r => setTimeout(r, 500))
  const days = 14
  const data = Array.from({ length: days }).map((_, i) => ({
    date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    volume: Number((Math.random() * 6).toFixed(2)),
    floor: Number((0.01 + Math.random() * 0.2).toFixed(3)),
  }))
  return data
}

/* -----------------------
   Hover preview portal
   -----------------------*/
function HoverPreviewPortal({ anchorRect, nft }: { anchorRect: DOMRect | null; nft: NFTItem | null }) {
  if (!anchorRect || !nft) return null
  const style: React.CSSProperties = {
    position: "fixed",
    top: Math.max(anchorRect.top - 10, 10),
    left: anchorRect.right + 12,
    width: 320,
    zIndex: 1200,
  }
  return ReactDOM.createPortal(
    <div style={style}>
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: -6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: -6 }}
        className="rounded-2xl overflow-hidden bg-gray-900 backdrop-blur border border-gray-700 shadow-2xl"
      >
        <div className="relative w-full h-40">
          <Image src={nft.image} alt={nft.name} fill className="object-cover" />
        </div>
        <div className="p-3 bg-gray-900">
          <div className="text-sm text-white font-medium">{nft.name}</div>
          <div className="text-xs text-gray-400 mt-1">#{nft.tokenId}</div>
          <div className="mt-3 flex items-center justify-between">
            <div className="text-sm font-semibold text-white">{nft.price} ETH</div>
            <button className="px-3 py-1 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium">Buy</button>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  )
}

/* -----------------------
   Skeleton Card
   -----------------------*/
function SkeletonCard() {
  return (
    <div className="nft-card rounded-2xl bg-gray-900 animate-pulse border border-gray-800">
      <div className="w-full bg-gray-800 rounded-t-2xl" style={{ aspectRatio: '3/4' }}></div>
      <div className="p-4 space-y-2">
        <div className="h-4 w-3/5 bg-gray-800 rounded"></div>
        <div className="h-3 w-2/5 bg-gray-800 rounded"></div>
        <div className="h-8 w-full bg-gray-800 rounded mt-3"></div>
      </div>
    </div>
  )
}

/* -----------------------
   Sidebar filters component
   -----------------------*/
function SidebarFilters({ 
  traits, 
  selected, 
  toggleTrait, 
  onReset 
}: { 
  traits?: Array<{ key: string; values: string[] }>
  selected: Record<string, string>
  toggleTrait: (key: string, value: string) => void
  onReset: () => void
}) {
  return (
    <aside className="w-full lg:w-72 bg-gray-900 p-4 rounded-2xl border border-gray-800 lg:sticky lg:top-24 h-fit relative z-10">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Filters</h4>
        <button onClick={onReset} className="text-sm text-blue-400 hover:text-blue-300 transition-colors">Reset</button>
      </div>

      <div className="mt-4 space-y-4">
        {traits?.map(t => (
          <div key={t.key}>
            <div className="text-xs text-gray-300 font-medium mb-2">{t.key}</div>
            <div className="flex flex-wrap gap-2">
              {t.values.map(v => {
                const active = selected[t.key] === v
                return (
                  <button
                    key={v}
                    onClick={() => toggleTrait(t.key, v)}
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${
                      active ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    {v}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}

/* -----------------------
   ActivityGraphs component
   -----------------------*/
function ActivityGraphs({ data, loading }: { data: ActivityData[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="p-4 bg-gray-900 rounded-2xl border border-gray-800">
        <div className="h-40 animate-pulse bg-white/5 rounded"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-900 rounded-2xl border border-gray-800">
        <div className="text-sm font-medium text-gray-200 mb-2">Volume (14d)</div>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fill: '#9CA3AF' }} />
            <YAxis tick={{ fill: '#9CA3AF' }} />
            <Tooltip wrapperStyle={{ background: '#0b1220', border: '1px solid #111827' }} />
            <Area type="monotone" dataKey="volume" stroke="#3b82f6" fill="url(#volGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="p-4 bg-gray-900 rounded-2xl border border-gray-800">
        <div className="text-sm font-medium text-gray-200 mb-2">Floor Price (14d)</div>
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={data}>
            <XAxis dataKey="date" tick={{ fill: '#9CA3AF' }} />
            <YAxis tick={{ fill: '#9CA3AF' }} />
            <Tooltip wrapperStyle={{ background: '#0b1220' }} />
            <Line type="monotone" dataKey="floor" stroke="#7c3aed" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

/* -----------------------
   NFT Card component
   -----------------------*/
function NftCard({ 
  nft, 
  onHoverStart, 
  onHoverEnd 
}: { 
  nft: NFTItem
  onHoverStart: (nft: NFTItem, rect: DOMRect) => void
  onHoverEnd: () => void
}) {
  return (
    <motion.div
      layout
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
      className="nft-card rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 hover:border-blue-500 cursor-pointer transition-all flex flex-col"
      onMouseEnter={(e) => onHoverStart(nft, e.currentTarget.getBoundingClientRect())}
      onMouseLeave={() => onHoverEnd()}
      role="listitem"
    >
      <div className="relative w-full flex-shrink-0" style={{ aspectRatio: '1/1' }}>
        <Image src={nft.image} alt={nft.name} fill className="object-cover" loading="lazy" />
      </div>

      <div className="p-4 bg-gray-900 flex flex-col flex-grow">
        <div className="text-xs text-gray-400 mb-1">#{nft.tokenId}</div>
        <div className="text-sm font-semibold truncate text-white mb-3">{nft.name}</div>
        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="text-sm font-bold text-white">{nft.price} ETH</div>
          <button 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors rounded-lg text-xs font-semibold text-white whitespace-nowrap shadow-lg"
            onClick={(e) => {
              e.stopPropagation()
              // Handle buy action
              console.log('Buy NFT:', nft.id)
            }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </motion.div>
  )
}

/* -----------------------
   Main Collection Page
   -----------------------*/
export default function CollectionPageFull({ collectionId = "base-apes" }: { collectionId?: string }) {
  const router = useRouter()
  const [collection, setCollection] = useState<Collection | null>(null)
  const [traitsSelected, setTraitsSelected] = useState<Record<string, string>>({})
  const [items, setItems] = useState<NFTItem[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loadingPage, setLoadingPage] = useState(false)
  const [activity, setActivity] = useState<ActivityData[]>([])
  const [loadingActivity, setLoadingActivity] = useState(true)
  const [sortBy, setSortBy] = useState("newest")

  // hover preview state
  const [hoverNft, setHoverNft] = useState<NFTItem | null>(null)
  const [hoverRect, setHoverRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    let mounted = true
    fetchCollection(collectionId).then(c => { if (mounted) setCollection(c) })
    fetchActivity(collectionId).then(d => { if (mounted) { setActivity(d); setLoadingActivity(false) }})
    return () => { mounted = false }
  }, [collectionId])

  useEffect(() => {
    // initial page
    loadNextPage()
    // eslint-disable-next-line
  }, [])

  async function loadNextPage() {
    if (loadingPage || !hasMore) return
    setLoadingPage(true)
    const nextPage = page + 1
    const res = await fetchItemsPage(collectionId, nextPage)
    setItems(prev => [...prev, ...res.items])
    setPage(nextPage)
    setHasMore(res.hasMore)
    setLoadingPage(false)
  }

  // Intersection observer for infinite scroll
  const loadRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = loadRef.current
    if (!el) return
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !loadingPage && hasMore) {
          loadNextPage()
        }
      })
    }, { rootMargin: "300px" })
    io.observe(el)
    return () => io.disconnect()
  }, [loadingPage, hasMore])

  function toggleTrait(key: string, value: string) {
    setTraitsSelected(prev => {
      const updated = { ...prev }
      if (prev[key] === value) delete updated[key]
      else updated[key] = value
      return updated
    })
  }

  function resetFilters() {
    setTraitsSelected({})
  }

  function handleHoverStart(nft: NFTItem, rect: DOMRect) {
    setHoverNft(nft)
    setHoverRect(rect)
  }
  
  function handleHoverEnd() {
    setHoverNft(null)
    setHoverRect(null)
  }

  const filteredItems = useMemo(() => {
    if (!Object.keys(traitsSelected).length) return items
    return items.filter(it => {
      return Object.entries(traitsSelected).every(([k, v]) => it.traits?.[k] === v)
    })
  }, [items, traitsSelected])

  return (
    <div className="min-h-screen bg-[#0b0b0b] dark:bg-[#0b0b0b] text-white relative z-0">
      <NavigationBar title={collection?.name || "Collection"} />
      <Header />
      
      {/* Hero */}
      <div className="w-full bg-gradient-to-b from-gray-900 to-[#0b0b0b] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-start md:items-end gap-6">
          <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-[#1F2937] to-[#111827] flex items-center justify-center text-3xl font-bold shrink-0">
            {collection?.name?.charAt(0) ?? "B"}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold">{collection?.name ?? "Collection"}</h1>
              {collection?.verified && <span className="text-xs bg-blue-600 px-2 py-1 rounded-md">Verified</span>}
            </div>
            <p className="text-gray-400 mt-1">{collection?.description}</p>

            <div className="mt-3 flex items-center gap-6 flex-wrap">
              <div className="text-sm">
                <div className="text-lg font-semibold">{collection?.itemsCount ?? "--"}</div>
                <div className="text-xs text-gray-400">Items</div>
              </div>
              <div className="text-sm">
                <div className="text-lg font-semibold">{collection?.floorPrice ?? "--"} ETH</div>
                <div className="text-xs text-gray-400">Floor</div>
              </div>
              <div className="text-sm">
                <div className="text-lg font-semibold">{collection?.volume ?? "--"} ETH</div>
                <div className="text-xs text-gray-400">Volume</div>
              </div>
              {collection?.contractUrl && (
                <a 
                  href={collection.contractUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs bg-white/10 hover:bg-white/20 transition-colors px-3 py-1 rounded-md"
                >
                  Contract →
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content area with sidebar + main grid */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar filters & graphs (left on desktop) */}
        <div className="lg:col-span-1 space-y-6">
          <SidebarFilters 
            traits={collection?.traits} 
            selected={traitsSelected} 
            toggleTrait={toggleTrait} 
            onReset={resetFilters} 
          />

          <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800">
            <div className="mb-3 text-sm font-semibold">Activity</div>
            <ActivityGraphs data={activity} loading={loadingActivity} />
          </div>
        </div>

        {/* Main grid */}
        <div className="lg:col-span-3">
          {/* tabs and controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm font-medium">Items</button>
              <button className="px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-sm">Activity</button>
              <button className="px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-sm">Stats</button>
            </div>
            <div className="flex items-center gap-3">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest" className="bg-gray-800">Sort: Newest</option>
                <option value="price-low" className="bg-gray-800">Price: Low → High</option>
                <option value="price-high" className="bg-gray-800">Price: High → Low</option>
                <option value="popular" className="bg-gray-800">Most Popular</option>
              </select>
            </div>
          </div>

          {/* Results info */}
          {Object.keys(traitsSelected).length > 0 && (
            <div className="mb-4 text-sm text-gray-400">
              Showing {filteredItems.length} of {items.length} items
            </div>
          )}

          {/* Grid */}
          <div className="nft-grid" role="list" aria-label="Collection NFTs">
            {items.length === 0 && Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            {filteredItems.map(nft => (
              <NftCard key={nft.id} nft={nft} onHoverStart={handleHoverStart} onHoverEnd={handleHoverEnd} />
            ))}
          </div>

          {/* No results message */}
          {filteredItems.length === 0 && items.length > 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400">No items match your filters</div>
              <button onClick={resetFilters} className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg text-sm">
                Reset Filters
              </button>
            </div>
          )}

          {/* infinite load sentinel */}
          <div ref={loadRef} className="mt-8 flex justify-center">
            {loadingPage ? (
              <div className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading…</span>
                </div>
              </div>
            ) : hasMore ? (
              <div className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-400">Scroll to load more</div>
            ) : items.length > 0 ? (
              <div className="px-4 py-2 text-gray-400 text-sm">End of collection</div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Hover preview portal */}
      <AnimatePresence>{hoverNft && <HoverPreviewPortal anchorRect={hoverRect} nft={hoverNft} />}</AnimatePresence>
      
      <Footer />
    </div>
  )
}
