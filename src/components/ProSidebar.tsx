'use client'

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useAccount } from "wagmi"

const NAV = [
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "Marketplace", href: "/marketplace", icon: StoreIcon },
  { label: "Collections", href: "/collections", icon: GridIcon },
  { label: "Collection Pro", href: "/collection-pro", icon: LayersIcon },
  { label: "Create NFT", href: "/create", icon: PlusIcon },
  { label: "Mint", href: "/mint", icon: LightningIcon },
  { label: "My NFTs", href: "/my-nfts", icon: StackIcon },
  { label: "Swap", href: "/swap", icon: ArrowIcon },
  { label: "Swap Settings", href: "/swap/settings", icon: CogIcon },
]

interface ProSidebarProps {
  compactDefault?: boolean
  profile?: {
    name: string
    address: string
    avatar?: string | null
  }
}

export default function ProSidebar({ 
  compactDefault = false, 
  profile = { name: "User", address: "0x0000...0000", avatar: null } 
}: ProSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { address, isConnected } = useAccount()
  
  const [collapsed, setCollapsed] = useState(compactDefault)
  const [randomFlow, setRandomFlow] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  // Use wallet address if connected
  const displayAddress = isConnected && address ? address : profile.address

  useEffect(() => {
    const saved = localStorage.getItem("randomFlow") === "1"
    setRandomFlow(saved)
  }, [])

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener("click", onDocClick)
    return () => document.removeEventListener("click", onDocClick)
  }, [])

  function toggleRandom() {
    const next = !randomFlow
    setRandomFlow(next)
    localStorage.setItem("randomFlow", next ? "1" : "0")
  }

  // prefetch next route for snappy transitions
  useEffect(() => {
    const activeIndex = NAV.findIndex((n) => n.href === pathname)
    const next = NAV[activeIndex + 1]
    if (next) {
      router.prefetch(next.href)
    }
  }, [pathname, router])

  return (
    <aside
      className={`flex flex-col h-screen sticky top-0 bg-[#0f1724] text-slate-200 transition-all duration-200 border-r border-gray-800 z-40 ${
        collapsed ? "w-20" : "w-64"
      }`}
      aria-label="Main navigation"
    >
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-indigo-500 flex items-center justify-center text-white font-semibold flex-shrink-0"
            aria-hidden
          >
            F
          </div>
          {!collapsed && (
            <div>
              <div className="text-lg font-semibold leading-tight">FarcastMints</div>
              <div className="text-xs text-white/60">NFT Marketplace</div>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed((c) => !c)}
          className="p-2 rounded-md hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-colors"
          aria-pressed={collapsed}
          aria-label={collapsed ? "Open sidebar" : "Collapse sidebar"}
        >
          <CollapseIcon rotated={collapsed} />
        </button>
      </div>

      {/* Profile Section */}
      {!collapsed && (
        <div className="px-3 py-3 border-b border-white/5">
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen((s) => !s)}
              className="w-full flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-colors"
              aria-haspopup="true"
              aria-expanded={profileOpen}
              aria-label="Open profile menu"
            >
              <Avatar src={profile.avatar} name={profile.name} />
              <div className="text-left flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{profile.name}</div>
                <div className="text-xs text-white/50 truncate">{shortAddr(displayAddress)}</div>
              </div>
              <svg className={`w-4 h-4 transition-transform ${profileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.14 }}
                  className="absolute left-0 right-0 mt-2 bg-[#0b1220] border border-white/5 rounded-lg shadow-lg z-50 overflow-hidden"
                  role="menu"
                >
                  <div className="border-b border-white/5">
                    <Link href="/my-nfts" className="block px-3 py-2 hover:bg-white/5 transition-colors text-sm">
                      My NFTs
                    </Link>
                    <Link href="/profile" className="block px-3 py-2 hover:bg-white/5 transition-colors text-sm">
                      Profile
                    </Link>
                    <Link href="/settings" className="block px-3 py-2 hover:bg-white/5 transition-colors text-sm">
                      Settings
                    </Link>
                  </div>
                  <button
                    onClick={() => { setProfileOpen(false); /* trigger signOut flow */ }}
                    className="w-full text-left px-3 py-2 hover:bg-white/5 transition-colors text-sm text-red-400"
                  >
                    Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 overflow-auto">
        <ul className="space-y-1 relative">
          {NAV.map((item) => {
            const active = pathname === item.href
            return (
              <li key={item.href} className="relative">
                <Link
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-150 hover:bg-white/5
                    ${collapsed ? "justify-center" : ""}
                    ${active ? "bg-white/5" : ""}
                  `}
                  aria-current={active ? "page" : undefined}
                >
                  <span
                    className={`relative flex items-center justify-center w-9 h-9 rounded-md
                      ${active ? "text-white" : "text-white/80"}
                    `}
                  >
                    <item.icon />
                    {/* motion active pill background */}
                    <AnimatePresence>
                      {active && !collapsed && (
                        <motion.span
                          layoutId="active-pill"
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.96 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="absolute -inset-1 rounded-lg bg-gradient-to-r from-purple-600/20 to-indigo-600/10 ring-1 ring-purple-700/30 shadow-[0_6px_18px_rgba(99,102,241,0.08)]"
                          style={{ zIndex: -1 }}
                        />
                      )}
                    </AnimatePresence>
                  </span>

                  {!collapsed && (
                    <>
                      <div className="flex-1">
                        <div className={`text-sm font-medium ${active ? "text-white" : "text-white/85"}`}>
                          {item.label}
                        </div>
                      </div>

                      {/* active badge with animated microinteraction */}
                      <div className="ml-2">
                        <AnimatePresence>
                          {active && (
                            <motion.span
                              initial={{ x: 6, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              exit={{ x: 6, opacity: 0 }}
                              transition={{ duration: 0.18 }}
                              className="text-xs px-2 py-1 rounded-full bg-gradient-to-br from-purple-600 to-indigo-500 text-white/95 shadow-sm"
                            >
                              Active
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                    </>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Divider */}
        <div className="mt-6 border-t border-white/5 pt-4 px-1">
          {!collapsed && <div className="text-xs text-white/50 px-2 mb-2">Quick Actions</div>}

          <div className="space-y-2 px-1">
            <button
              onClick={() => router.push("/create")}
              className="w-full group flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-colors"
            >
              <span className="w-9 h-9 flex items-center justify-center rounded-md bg-indigo-500/20 text-indigo-300">
                <PlusIcon />
              </span>
              {!collapsed && <span className="text-sm">Create new NFT</span>}
            </button>

            <button
              onClick={() => router.push("/swap")}
              className="w-full group flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-colors"
            >
              <span className="w-9 h-9 flex items-center justify-center rounded-md bg-emerald-500/10 text-emerald-300">
                <ArrowIcon />
              </span>
              {!collapsed && <span className="text-sm">Swap Tokens</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* Footer: random toggle + wallet */}
      <div className="px-3 py-4 border-t border-white/5">
        <div className={`flex items-center gap-3 rounded-md p-2 ${collapsed ? "justify-center" : ""}`}>
          <label className="flex items-center gap-3 w-full cursor-pointer">
            <input
              type="checkbox"
              checked={randomFlow}
              onChange={toggleRandom}
              className="sr-only"
              aria-label="Toggle random flow"
            />
            <span className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-9 h-9 rounded-md bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                <DiceIcon />
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">Random Flow</div>
                  <div className="text-xs text-white/50">Navigate in random order</div>
                </div>
              )}
            </span>

            {!collapsed && (
              <div className={`text-xs px-2 py-1 rounded-full transition-colors ${randomFlow ? "bg-emerald-500/20 text-emerald-300" : "bg-white/5 text-white/60"}`}>
                {randomFlow ? "ON" : "OFF"}
              </div>
            )}
          </label>
        </div>

        {/* Wallet badge */}
        {!collapsed && (
          <div className="mt-3">
            <button
              onClick={() => router.push("/my-nfts")}
              className="w-full flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-colors"
            >
              <span className={`w-3 h-3 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-gray-500'} shadow-sm`} aria-hidden />
              <span className="text-sm font-medium truncate">{shortAddr(displayAddress)}</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}

/* ---------- small helpers & icons ---------- */

function shortAddr(addr: string) {
  if (!addr) return "Connect"
  if (addr.length <= 12) return addr
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

function Avatar({ src, name = "User", size = "sm" }: { src?: string | null; name?: string; size?: "sm" | "md" }) {
  const sizes = { sm: "w-8 h-8", md: "w-12 h-12" }
  const initials = name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()
  return src ? (
    <img src={src} alt={name} className={`rounded-full object-cover flex-shrink-0 ${sizes[size]}`} />
  ) : (
    <div className={`rounded-full bg-gradient-to-br from-purple-600 to-indigo-500 text-white flex items-center justify-center flex-shrink-0 ${sizes[size]}`}>
      <span className="font-medium text-xs">{initials}</span>
    </div>
  )
}

function CollapseIcon({ rotated }: { rotated: boolean }) {
  return (
    <svg className={`w-5 h-5 transform transition-transform ${rotated ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M15 18l-6-6 6-6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* Icon components below: keep them simple & small */
function HomeIcon() { return (<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M3 10.5L12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10.5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>) }
function StoreIcon(){ return (<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.2"/></svg>) }
function GridIcon(){ return (<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" stroke="currentColor" strokeWidth="1.2"/></svg>) }
function LayersIcon(){ return (<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M12 2l9 5-9 5-9-5 9-5zm0 7l9 5-9 5-9-5 9-5z" stroke="currentColor" strokeWidth="1.2"/></svg>) }
function PlusIcon(){ return (<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>) }
function LightningIcon(){ return (<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" stroke="currentColor" strokeWidth="1.2"/></svg>) }
function StackIcon(){ return (<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M3 7l9 5 9-5M3 12l9 5 9-5M3 17l9 5 9-5" stroke="currentColor" strokeWidth="1.2"/></svg>) }
function ArrowIcon(){ return (<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>) }
function CogIcon(){ return (<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.2"/><path d="M12 1v6m0 6v10M23 12h-6m-6 0H1" stroke="currentColor" strokeWidth="1.2"/></svg>) }
function DiceIcon(){ return (<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.2"/><circle cx="8" cy="8" r="1" fill="currentColor"/><circle cx="16" cy="8" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="8" cy="16" r="1" fill="currentColor"/><circle cx="16" cy="16" r="1" fill="currentColor"/></svg>) }
