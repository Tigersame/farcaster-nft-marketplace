'use client'

import Image from "next/image"
import { useState } from "react"
import { Filter } from "lucide-react"

/**
 * Professional Collection Page Layout
 * Props:
 *   collection: { name, description, cover, totalSupply, floorPrice, volume, owners }
 *   items: [{ id, tokenId, name, image, price }]
 */

interface CollectionItem {
  id: string
  tokenId: string
  name: string
  image: string
  price: string
}

interface Collection {
  name?: string
  description?: string
  cover?: string
  totalSupply?: number
  floorPrice?: string
  volume?: string
  owners?: number
}

interface CollectionPageProProps {
  collection?: Collection
  items?: CollectionItem[]
}

export default function CollectionPagePro({ collection = {}, items = [] }: CollectionPageProProps) {
  const [tab, setTab] = useState("items")

  return (
    <main className="min-h-screen bg-[#05060a] text-white">
      
      {/* ==== HERO SECTION ==== */}
      <section className="relative w-full h-[320px] bg-gradient-to-b from-[#0f1724] to-[#05060a] border-b border-white/10">
        
        {/* BLUR BACKGROUND COVER */}
        {collection.cover && (
          <div className="absolute inset-0 -z-10 opacity-30">
            <Image 
              src={collection.cover} 
              alt="cover" 
              fill
              className="object-cover blur-sm" 
            />
          </div>
        )}

        {/* CONTENT */}
        <div className="absolute left-0 right-0 bottom-8 px-6 mx-auto max-w-[1440px] flex items-end gap-6">
          
          {/* Collection Avatar */}
          <div className="w-28 h-28 rounded-2xl bg-[#111827] flex items-center justify-center text-4xl font-bold shadow-lg overflow-hidden">
            {collection.name ? collection.name.charAt(0) : "C"}
          </div>

          {/* Collection Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-extrabold">
                {collection.name ?? "Collection"}
              </h1>
              <span className="px-2 py-1 rounded-md bg-blue-600 text-xs">
                ✓ Verified
              </span>
            </div>

            <p className="text-gray-300 mt-2 max-w-2xl">
              {collection.description}
            </p>

            {/* Stats Row */}
            <div className="mt-3 flex items-center gap-6 text-sm">
              <div>
                <div className="text-lg font-semibold">{collection.totalSupply ?? "--"}</div>
                <div className="text-xs text-gray-400">Total supply</div>
              </div>
              <div>
                <div className="text-lg font-semibold">{collection.floorPrice ?? "--"} ETH</div>
                <div className="text-xs text-gray-400">Floor</div>
              </div>
              <div>
                <div className="text-lg font-semibold">{collection.volume ?? "--"} ETH</div>
                <div className="text-xs text-gray-400">Volume</div>
              </div>
              <div>
                <div className="text-lg font-semibold">{collection.owners ?? "--"}</div>
                <div className="text-xs text-gray-400">Owners</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==== CONTENT SECTION ==== */}
      <section className="max-w-[1440px] mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-6 gap-8">
        
        {/* === LEFT FILTER SIDEBAR === */}
        <aside className="hidden lg:block lg:col-span-1 bg-[#071226] border border-white/6 rounded-xl p-4 sticky top-24 h-fit">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Filter size={16} /> Filters
          </h4>

          <div className="space-y-4 text-sm text-gray-300">
            {/* Price Filter */}
            <div>
              <div className="text-xs text-gray-400 mb-2">Price</div>
              <div className="flex gap-2">
                <input 
                  placeholder="Min" 
                  className="w-1/2 p-2 bg-white/5 rounded-md border border-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                />
                <input 
                  placeholder="Max" 
                  className="w-1/2 p-2 bg-white/5 rounded-md border border-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                />
              </div>
            </div>

            {/* Traits Filter */}
            <div>
              <div className="text-xs text-gray-400 mb-2">Traits</div>
              <div className="flex flex-col gap-2">
                <button className="p-2 bg-white/5 hover:bg-white/10 rounded-md text-left text-sm transition">
                  Background
                </button>
                <button className="p-2 bg-white/5 hover:bg-white/10 rounded-md text-left text-sm transition">
                  Eyes
                </button>
                <button className="p-2 bg-white/5 hover:bg-white/10 rounded-md text-left text-sm transition">
                  Rarity
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* === MAIN NFT GRID === */}
        <div className="lg:col-span-5">
          
          {/* Tabs & Controls */}
          <div className="flex items-center justify-between gap-4 mb-6 border-b border-white/10 pb-3">
            <div className="flex gap-4">
              <button 
                onClick={() => setTab("items")} 
                className={`pb-2 text-sm font-medium transition ${
                  tab === "items" 
                    ? "border-b-2 border-blue-500 text-white" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Items
              </button>
              <button 
                onClick={() => setTab("activity")} 
                className={`pb-2 text-sm font-medium transition ${
                  tab === "activity" 
                    ? "border-b-2 border-blue-500 text-white" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Activity
              </button>
              <button 
                onClick={() => setTab("traits")} 
                className={`pb-2 text-sm font-medium transition ${
                  tab === "traits" 
                    ? "border-b-2 border-blue-500 text-white" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Traits
              </button>
            </div>

            <div className="flex items-center gap-3">
              <select className="bg-white/5 p-2 rounded-md text-sm border border-white/6 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option>Sort: New</option>
                <option>Price: Low → High</option>
                <option>Price: High → Low</option>
                <option>Rarity</option>
              </select>
            </div>
          </div>

          {/* ITEMS TAB */}
          {tab === "items" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {items.map((nft) => (
                <article 
                  key={nft.id} 
                  className="bg-[#0e1319] border border-white/6 rounded-xl overflow-hidden shadow hover:shadow-lg transition transform hover:-translate-y-1 cursor-pointer"
                >
                  <div className="relative w-full aspect-[4/5]">
                    <Image 
                      src={nft.image} 
                      alt={nft.name} 
                      fill
                      className="object-cover rounded-t-xl" 
                    />
                  </div>

                  <div className="p-3">
                    <div className="text-xs text-gray-400">#{nft.tokenId}</div>
                    <div className="font-semibold mt-1">{nft.name}</div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="font-semibold">{nft.price ?? "—"} ETH</div>
                      <button className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-sm transition active:scale-95">
                        Buy
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* ACTIVITY TAB */}
          {tab === "activity" && (
            <div className="py-10 text-gray-400 text-center">
              <p>📈 Activity logs and chart will appear here.</p>
            </div>
          )}

          {/* TRAITS TAB */}
          {tab === "traits" && (
            <div className="py-10 text-gray-400 text-center">
              <p>🎨 Traits breakdown and filters will appear here.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
