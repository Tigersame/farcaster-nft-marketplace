// components/FrontPage.jsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const PAGE_SIZE = 12;

/* ---------- Top Header ---------- */
function TopHeader() {
  return (
    <header className="sticky top-0 z-40 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-md border-b border-white/6">
      <div className="max-w-[1440px] mx-auto px-6 py-3 flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
              <path d="M0 0h10v10H0z" fill="#1a1a1a"/>
              <circle cx="5" cy="5" r="2.5" fill="white"/>
              <path d="M0 14c0-2.2 1.8-4 4-4h6v10H0V14z" fill="#1a1a1a"/>
            </svg>
          </div>
          <div className="hidden md:flex flex-col leading-tight">
            <div className="font-bold">Farcast</div>
            <div className="font-bold -mt-1">Mints</div>
          </div>
        </div>

        <div className="flex-1 max-w-2xl mx-6">
          <div className="relative">
            <input
              aria-label="Search NFTs"
              placeholder="Search NFTs, collections, creators..."
              className="w-full rounded-full bg-white/5 px-4 py-2 outline-none border border-white/6 placeholder:text-gray-400 focus:border-purple-500 transition"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ConnectButton />
          <a href="/mint" className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 text-white hover:from-purple-700 hover:to-indigo-600 transition">Mint</a>
        </div>
      </div>
    </header>
  );
}

/* ---------- Simple NFT Card ---------- */
function NftCard({ nft, onOpen }) {
  return (
    <article className="rounded-2xl bg-[#0b0c10] border border-white/6 overflow-hidden shadow-md hover:shadow-xl transition transform hover:-translate-y-1">
      <div className="relative w-full aspect-[4/5] bg-gray-900">
        <Image
          src={nft.image}
          alt={nft.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover"
          placeholder={nft.imageBlur ? "blur" : "empty"}
          blurDataURL={nft.imageBlur || undefined}
        />
        <div className="absolute left-3 top-3 px-2 py-1 text-xs bg-black/60 rounded-full text-white backdrop-blur-sm">Featured</div>
      </div>

      <div className="p-3">
        <div className="text-xs text-gray-400">#{nft.tokenId}</div>
        <h3 className="font-semibold text-lg truncate" title={nft.name}>{nft.name}</h3>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm font-medium">{nft.price ?? "—"} ETH</div>
          <button onClick={() => onOpen?.(nft)} className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 text-white text-sm hover:from-purple-700 hover:to-indigo-600 transition">
            Buy
          </button>
        </div>
      </div>
    </article>
  );
}

/* ---------- Carousel: CSS scroll-snap ---------- */
function FeaturedCarousel({ items }) {
  return (
    <section className="py-8">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Featured Drops</h2>
          <div className="text-sm text-gray-400">Curated picks</div>
        </div>

        <div className="snap-x snap-mandatory overflow-x-auto no-scrollbar flex gap-6 pb-3">
          {items.map((n) => (
            <div key={n.id} className="snap-start min-w-[360px]">
              <motion.div whileHover={{ scale: 1.03 }} className="">
                <NftCard nft={n} onOpen={() => console.log("open", n)} />
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Trending collections grid ---------- */
function CollectionsGrid({ items }) {
  return (
    <section className="py-6 bg-transparent">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Trending Collections</h2>
          <div className="text-sm text-gray-400">Based on volume</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((c) => (
            <div key={c.id} className="rounded-2xl overflow-hidden bg-[#071021] border border-white/6 p-3 flex gap-3 items-center hover:border-white/12 transition cursor-pointer">
              <div className="w-16 h-16 relative rounded-md overflow-hidden bg-gray-800 flex-shrink-0">
                <Image src={c.image} alt={c.name} fill sizes="64px" className="object-cover" />
              </div>
              <div>
                <div className="font-semibold">{c.name}</div>
                <div className="text-xs text-gray-400">{c.floor} ETH • {c.volume} ETH</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Main FrontPage ---------- */
export default function FrontPage() {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [recent, setRecent] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const sentinel = useRef();

  useEffect(() => {
    // Replace with your production endpoints
    fetch("/api/featured").then(r => r.json()).then(setFeatured).catch(() => setFeatured(sampleFeatured()));
    fetch("/api/trending").then(r => r.json()).then(setTrending).catch(() => setTrending(sampleTrending()));
    loadMore(); // initial recent
  }, []);

  async function loadMore() {
    if (!hasMore) return;
    const next = page + 1;
    try {
      const res = await fetch(`/api/recent?page=${next}`);
      if (!res.ok) throw new Error("No data");
      const json = await res.json();
      setRecent(prev => [...prev, ...(json.items || json)]);
      setPage(next);
      if (!json.items || json.items.length < PAGE_SIZE) setHasMore(false);
    } catch (err) {
      // fallback demo
      const demo = sampleRecent(next);
      setRecent(prev => [...prev, ...demo]);
      setPage(next);
      if (next >= 5) setHasMore(false);
    }
  }

  useEffect(() => {
    if (!sentinel.current) return;
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) loadMore();
    }, { rootMargin: "400px" });
    io.observe(sentinel.current);
    return () => io.disconnect();
  }, [sentinel.current, page, hasMore]);

  return (
    <>
      <TopHeader />

      <main className="min-h-screen bg-[#05060a] text-white">
        {/* Full Hero Banner */}
        <section className="relative w-full min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a0f3e] via-[#1e3a8a] to-[#0d47a1]"></div>
          
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 via-transparent to-blue-600/20 animate-pulse"></div>
          
          {/* Content */}
          <div className="relative z-10 max-w-[1440px] mx-auto px-6 py-16 md:py-24 text-center">
            {/* Title */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 tracking-tight">
              FarcastMints
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-3xl lg:text-4xl text-white/90 max-w-4xl mx-auto mb-12 font-light leading-relaxed">
              A next-gen NFT marketplace built on Base<br className="hidden md:block" />
              with seamless Farcaster integration
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="/marketplace" className="px-10 py-5 rounded-full bg-white text-blue-900 font-bold text-lg hover:bg-white/90 transition cursor-pointer shadow-2xl shadow-white/20">
                Explore Marketplace
              </a>
              <a href="/mint" className="px-10 py-5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm font-bold text-lg transition cursor-pointer border-2 border-white/30">
                Create NFT
              </a>
            </div>
          </div>

          {/* Bottom fade to main content */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#05060a] to-transparent"></div>
        </section>

        {/* Stats bar */}
        <section className="max-w-[1440px] mx-auto px-6 py-8 mb-12 -mt-16 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-8 shadow-2xl">
            <div className="text-center">
              <div className="text-3xl font-bold">10K+</div>
              <div className="text-sm text-gray-400 mt-1">NFTs Listed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">2.5K+</div>
              <div className="text-sm text-gray-400 mt-1">Collectors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm text-gray-400 mt-1">Creators</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">$2M+</div>
              <div className="text-sm text-gray-400 mt-1">Volume Traded</div>
            </div>
          </div>
        </section>

        {/* Featured Carousel */}
        <FeaturedCarousel items={featured} />
        <CollectionsGrid items={trending} />

        {/* Recent / infinite grid */}
        <section className="max-w-[1440px] mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Recently Listed</h2>
            <div className="text-sm text-gray-400">Live marketplace activity</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recent.map(n => <NftCard key={n.id} nft={n} onOpen={(x)=>console.log("open",x)} />)}
          </div>

          <div ref={sentinel} className="mt-8 text-center text-gray-400">
            {hasMore ? "Loading more..." : "End of results"}
          </div>
        </section>

        {/* Newsletter / footer CTA */}
        <section className="py-12 border-t border-white/6">
          <div className="max-w-[900px] mx-auto px-6 text-center">
            <h3 className="text-2xl font-semibold">Get notified about drops</h3>
            <p className="text-gray-400 mt-2">Join our newsletter for curated drops and announcements.</p>
            <div className="mt-4 flex justify-center gap-2 max-w-md mx-auto">
              <input placeholder="Your email" className="flex-1 px-4 py-2 rounded-l-lg bg-white/5 border border-white/6 focus:outline-none focus:border-purple-500 transition" />
              <button className="px-6 py-2 rounded-r-lg bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 transition font-medium">Subscribe</button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

/* ---------- demo fallback data ---------- */
function sampleFeatured(){
  return Array.from({length:6}).map((_,i)=>({
    id: "f"+i, 
    tokenId:i+1, 
    name:`Featured #${i+1}`, 
    image:`https://picsum.photos/seed/feat${i}/800/1000`, 
    imageBlur: `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjEwMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwMCIgaGVpZ2h0PSIxMDAwIiBmaWxsPSIjMTExIi8+PC9zdmc+`, 
    price:(0.001*(i+2)).toFixed(4)
  }));
}
function sampleTrending(){
  return Array.from({length:8}).map((_,i)=>({
    id: "c"+i, 
    name:`Collection ${i+1}`, 
    image:`https://picsum.photos/seed/col${i}/300/300`, 
    floor:(0.01*i).toFixed(3), 
    volume:(Math.random()*100).toFixed(1)
  }));
}
function sampleRecent(page){
  return Array.from({length:PAGE_SIZE}).map((_,i)=>({
    id:"r"+page+"-"+i, 
    tokenId: page*PAGE_SIZE+i+1, 
    name:`Recent #${page*PAGE_SIZE+i+1}`, 
    image:`https://picsum.photos/seed/recent${page}-${i}/600/800`, 
    price:(0.001*(Math.random()*10)).toFixed(4)
  }));
}
