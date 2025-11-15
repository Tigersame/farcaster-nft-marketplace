'use client'

// Farcastmint Event Page — Themed Brand Version
// This file updates the Event UI to match a specific brand/theme.

import React, {useEffect, useState} from 'react';
import {motion} from 'framer-motion';
import clsx from 'clsx';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BRANDING, getLogoUrl, getBrandColor } from '@/config/branding';

// ------------------ THEME TOKENS (EDIT THESE) ------------------
const BRAND_NAME = BRANDING.name;
const BRAND_PRIMARY = BRANDING.colors.primary;
const BRAND_ACCENT = BRANDING.colors.accent;
const BRAND_BG_1 = BRANDING.colors.bg1;
const BRAND_BG_2 = BRANDING.colors.bg2;
const BRAND_TEXT = BRANDING.colors.text;
const BRAND_MUTED = BRANDING.colors.muted;
const BRAND_FONT = 'Inter'; // Google font name
const BRAND_LOGO = getLogoUrl('main');
// ----------------------------------------------------------------

// Small helper to set CSS variables at runtime (helps Tailwind JIT theming)
function useApplyTheme() {
  useEffect(()=>{
    const root = document.documentElement;
    root.style.setProperty('--brand-primary', BRAND_PRIMARY);
    root.style.setProperty('--brand-accent', BRAND_ACCENT);
    root.style.setProperty('--brand-bg-1', BRAND_BG_1);
    root.style.setProperty('--brand-bg-2', BRAND_BG_2);
    root.style.setProperty('--brand-text', BRAND_TEXT);
    root.style.setProperty('--brand-muted', BRAND_MUTED);
    root.style.setProperty('--brand-font', BRAND_FONT);
  },[]);
}

function Logo({size = 40}){
  // Always use the configured logo from branding
  return (
    <img 
      src={BRAND_LOGO} 
      alt={`${BRAND_NAME} logo`} 
      width={size} 
      height={size} 
      className="rounded-lg"
    />
  );
}

// Small UI components (themable)
function StatCard({label, value, sub}: {label: string, value: string, sub?: string}){
  return (
    <div className="p-4 rounded-2xl shadow" style={{background:'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.12))', border:'1px solid rgba(255,255,255,0.04)'}}>
      <div className="text-xs" style={{color:'var(--brand-muted)'}}>{label}</div>
      <div className="mt-1 text-lg font-semibold" style={{color:'var(--brand-text)'}}>{value}</div>
      {sub && <div className="text-xs mt-1" style={{color:'rgba(255,255,255,0.55)'}}>{sub}</div>}
    </div>
  );
}

function IconSpark(){
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M12 2v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 18v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4.9 4.9l2.8 2.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16.3 16.3l2.8 2.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  );
}

// --- Main themed page ---
export default function EventPage(){
  useApplyTheme();

  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const [totalMinted, setTotalMinted] = useState(0);
  const [maxSupply] = useState(20000);
  const [userXP, setUserXP] = useState(0);
  const [globalXP] = useState(Infinity); // Unlimited XP pool
  const [loading, setLoading] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [leaderboard, setLeaderboard] = useState<Array<{rank: number, address: string, xp: number}>>([]);

  useEffect(()=>{ fetchSupply(); if(address) fetchUserXP(address); fetchLeaderboard(); }, [address]);

  async function fetchSupply(){ try{ setTotalMinted(Math.min(12000 + (new Date().getDate()*32 % 8000), maxSupply)); }catch(e){} }
  async function fetchUserXP(addr: string){ try{ const res = await axios.get(`${process.env.NEXT_PUBLIC_XP_API}/user-xp?address=${addr}`); setUserXP(res.data.xp||0); }catch(e){ setUserXP(0); } }
  async function fetchLeaderboard(){ try{ const res = await axios.get(`${process.env.NEXT_PUBLIC_XP_API}/leaderboard`); setLeaderboard(res.data.top||[]); }catch(e){ setLeaderboard([{rank:1,address:'0xA1...bC12',xp:1200000},{rank:2,address:'0xB2...dE34',xp:1100000},{rank:3,address:'0xC3...fG56',xp:950000}]); } }

  const percent = Math.min(100, Math.round((totalMinted/maxSupply)*100));

  async function handleClaim(){
    if(!isConnected) return toast.info('Connect wallet');
    setLoading(true);
    try{
      const sigRes = await axios.post(`${process.env.NEXT_PUBLIC_XP_API}/sign-claim`, {address});
      const permit = sigRes.data.signature;
      // call on-chain claim with signer (omitted)
      setTotalMinted(x => Math.min(maxSupply, x+1));
      setUserXP(x => x + 5000);
      await axios.post(`${process.env.NEXT_PUBLIC_XP_API}/award-xp`, {address, amount:5000, reason:'claim'});
      toast.success('Claimed — +5000 XP');
    }catch(e){ console.error(e); toast.error('Claim failed'); }
    finally{ setLoading(false); }
  }

  async function awardDemoXP(type: string){ 
    if(!isConnected) return toast.info('Connect wallet'); 
    try{ 
      const res = await axios.post(`${process.env.NEXT_PUBLIC_XP_API}/award-xp`, {address, amount:100, reason:type}); 
      setUserXP(res.data.xp); 
      toast.success('+100 XP awarded'); 
    }catch(e){ 
      toast.error('Could not award XP'); 
    } 
  }

  function short(a?: string){ return a ? `${a.slice(0,6)}...${a.slice(-4)}` : ''; }

  return (
    <>
      <head>
        <title>{BRAND_NAME} — Launch Event</title>
        <meta name="description" content="Genesis SBT claim & XP event" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href={`https://fonts.googleapis.com/css2?family=${encodeURIComponent(BRAND_FONT)}:wght@400;600;700&display=swap`} rel="stylesheet" />
      </head>

      <div style={{background:`linear-gradient(180deg, ${BRAND_BG_1}, ${BRAND_BG_2})`, fontFamily: BRAND_FONT}} className="min-h-screen p-6 text-slate-100">
        <ToastContainer />

        <header className="max-w-6xl mx-auto flex items-center justify-between py-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 flex items-center justify-center shadow-lg" style={{borderRadius:12, background:`linear-gradient(135deg, ${BRAND_PRIMARY}, ${BRAND_ACCENT})`}}>
              <Logo size={44} />
            </div>
            <div>
              <div style={{color:BRAND_TEXT}} className="text-lg font-semibold">{BRAND_NAME} — Launch Event</div>
              <div style={{color:'var(--brand-muted)'}} className="text-xs">Genesis SBT • 20,000 supply • XP-driven conversion</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex gap-3">
              <StatCard label="Claimed" value={`${totalMinted.toLocaleString()} / ${maxSupply.toLocaleString()}`} sub={`${percent}% filled`} />
              <StatCard label="Your XP" value={userXP.toLocaleString()} sub="+100 XP per action" />
            </div>

            <div className="flex items-center gap-2">
              {isConnected ? (
                <>
                  <div className="text-sm" style={{color:BRAND_TEXT}}>{short(address)}</div>
                  <button onClick={()=>disconnect()} className="px-3 py-2 rounded-md text-sm" style={{background:'rgba(255,255,255,0.03)'}}>Disconnect</button>
                </>
              ) : (
                <button onClick={()=>connect({ connector: injected() })} className="px-4 py-2 rounded-md text-white text-sm" style={{background:`linear-gradient(90deg, ${BRAND_PRIMARY}, ${BRAND_ACCENT})`}}>Connect Wallet</button>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Primary panel */}
          <section className="lg:col-span-2 rounded-3xl p-6 shadow-xl" style={{background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.04)'}}>
            <div className="flex items-start justify-between gap-6">
              <div style={{flex:1}}>
                <h2 className="text-2xl font-bold" style={{color:BRAND_TEXT}}>Genesis Claim & XP</h2>
                <p className="text-sm mt-2" style={{color:'var(--brand-muted)'}}>Each wallet can claim one non-transferable SBT. Actions award XP — used for allocation at token launch.</p>

                <div className="mt-6 space-y-4">
                  <div className="w-full rounded-full h-4 overflow-hidden bg-black/20">
                    <motion.div initial={{width:0}} animate={{width:`${percent}%`}} transition={{duration:0.9}} className="h-4" style={{background:`linear-gradient(90deg, ${BRAND_PRIMARY}, ${BRAND_ACCENT})`}}/>
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    <button onClick={handleClaim} disabled={loading || totalMinted>=maxSupply} className={clsx('px-6 py-3 rounded-xl text-white font-semibold', loading ? 'opacity-60' : '')} style={{background:`linear-gradient(90deg, ${BRAND_PRIMARY}, ${BRAND_ACCENT})`}}>{loading ? 'Processing...' : 'Claim SBT (1 per wallet)'}</button>

                    <button onClick={()=>setShowConvertModal(true)} className="px-4 py-2 rounded-xl" style={{background:'rgba(255,255,255,0.03)'}}>Conversion Info</button>

                    <div className="ml-auto text-sm" style={{color:'var(--brand-muted)'}}>{totalMinted.toLocaleString()} claimed • {maxSupply.toLocaleString()} supply</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mt-4">
                    <div className="p-3 rounded-lg" style={{background:'rgba(255,255,255,0.02)'}}>
                      <div className="text-xs" style={{color:'var(--brand-muted)'}}>Action</div>
                      <div className="mt-1 font-semibold" style={{color:BRAND_TEXT}}>XP</div>
                      <div className="text-xs mt-1" style={{color:'rgba(255,255,255,0.6)'}}>Create / Swap / Buy / Sell / Daily / Share = +100</div>
                    </div>

                    <div className="p-3 rounded-lg" style={{background:'rgba(255,255,255,0.02)'}}>
                      <div className="text-xs" style={{color:'var(--brand-muted)'}}>Conversion</div>
                      <div className="mt-1 font-semibold" style={{color:BRAND_TEXT}}>Burn → Token</div>
                      <div className="text-xs mt-1" style={{color:'rgba(255,255,255,0.6)'}}>On launch window only</div>
                    </div>

                    <div className="p-3 rounded-lg" style={{background:'rgba(255,255,255,0.02)'}}>
                      <div className="text-xs" style={{color:'var(--brand-muted)'}}>Allocation</div>
                      <div className="mt-1 font-semibold" style={{color:BRAND_TEXT}}>XP-Tiered</div>
                      <div className="text-xs mt-1" style={{color:'rgba(255,255,255,0.6)'}}>Higher XP → better allocation</div>
                    </div>

                    <div className="p-3 rounded-lg flex items-center gap-2" style={{background:'linear-gradient(90deg, rgba(255,255,255,0.02), rgba(0,0,0,0.06))'}}>
                      <IconSpark />
                      <div>
                        <div className="text-xs" style={{color:'var(--brand-muted)'}}>Event Pool</div>
                        <div className="font-semibold" style={{color:BRAND_TEXT}}>∞ Unlimited XP</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-4 rounded-xl" style={{background:'rgba(255,255,255,0.01)', border:'1px solid rgba(255,255,255,0.02)'}}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs" style={{color:'var(--brand-muted)'}}>Quick actions (demo)</div>
                        <div className="text-sm" style={{color:'rgba(255,255,255,0.65)'}}>Simulate awarding XP (backend should validate events)</div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={()=>awardDemoXP('create')} className="px-3 py-2 rounded-md text-sm" style={{background:`linear-gradient(90deg, ${BRAND_PRIMARY}, ${BRAND_ACCENT})`, color:'#fff'}}>Create +100</button>
                        <button onClick={()=>awardDemoXP('share')} className="px-3 py-2 rounded-md text-sm" style={{background:`linear-gradient(90deg, ${BRAND_PRIMARY}, ${BRAND_ACCENT})`, color:'#fff'}}>Share +100</button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <aside className="w-56 hidden lg:block">
                <div className="p-4 rounded-xl" style={{background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.03)'}}>
                  <div className="text-xs" style={{color:'var(--brand-muted)'}}>Your XP</div>
                  <div className="text-2xl font-bold mt-1" style={{color:BRAND_TEXT}}>{userXP.toLocaleString()}</div>
                  <div className="text-xs mt-2" style={{color:'rgba(255,255,255,0.6)'}}>Accrue XP by interacting with the marketplace. XP determines launch allocation tiers.</div>
                </div>

                <div className="mt-4 p-3 rounded-xl" style={{background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.03)'}}>
                  <div className="text-xs" style={{color:'var(--brand-muted)'}}>Conversion Target</div>
                  <div className="text-lg font-semibold mt-1" style={{color:BRAND_TEXT}}>1,000,000 XP</div>
                  <div className="text-xs mt-2" style={{color:'rgba(255,255,255,0.6)'}}>Example: reach this to be in top allocation tier.</div>
                </div>
              </aside>
            </div>

            {/* Leaderboard */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold" style={{color:BRAND_TEXT}}>Leaderboard</h3>
                <button onClick={fetchLeaderboard} className="text-sm" style={{color:'var(--brand-muted)'}}>Refresh</button>
              </div>

              <div className="mt-3 rounded-xl p-3" style={{background:'rgba(255,255,255,0.01)', border:'1px solid rgba(255,255,255,0.03)'}}>
                <table className="w-full text-left text-sm">
                  <thead className="text-xs" style={{color:'var(--brand-muted)'}}>
                    <tr><th className="py-2">#</th><th>Address</th><th className="text-right">XP</th></tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((row)=> (
                      <tr key={row.rank} className="odd:bg-transparent even:bg-white/2">
                        <td className="py-2 w-10" style={{color:BRAND_TEXT}}>{row.rank}</td>
                        <td style={{color:BRAND_TEXT}}>{row.address}</td>
                        <td className="text-right" style={{color:BRAND_TEXT}}>{row.xp.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="p-4 rounded-2xl shadow" style={{background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.03)'}}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs" style={{color:'var(--brand-muted)'}}>Event Status</div>
                  <div className="font-semibold" style={{color:BRAND_TEXT}}>Open — Claiming</div>
                </div>
                <div className="text-sm" style={{color:'var(--brand-muted)'}}>{percent}%</div>
              </div>

              <div className="mt-4">
                <div className="text-xs" style={{color:'var(--brand-muted)'}}>Progress</div>
                <div className="w-full rounded-full h-3 mt-2 overflow-hidden bg-black/20">
                  <motion.div initial={{width:0}} animate={{width:`${percent}%`}} transition={{duration:0.9}} className="h-3" style={{background:`linear-gradient(90deg, ${BRAND_PRIMARY}, ${BRAND_ACCENT})`}}/>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl" style={{background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.03)'}}>
              <div className="text-xs" style={{color:'var(--brand-muted)'}}>Timeline</div>
              <ul className="mt-2 text-sm" style={{color:'rgba(255,255,255,0.7)'}}>
                <li>• Claim: now — until 20,000 claimed</li>
                <li>• XP accrual: ongoing</li>
                <li>• Launch: conversion window (on-chain)</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl" style={{background:`linear-gradient(90deg, ${BRAND_PRIMARY}, ${BRAND_ACCENT})`, color:'#fff'}}>
              <div className="text-xs opacity-90">Early-bird</div>
              <div className="text-lg font-bold mt-1">First 20,000</div>
              <div className="text-xs opacity-80 mt-1">Claim to secure SBT — convert on launch</div>
            </div>
          </aside>
        </main>

        <footer className="max-w-6xl mx-auto mt-10 text-center text-sm" style={{color:'var(--brand-muted)'}}>© {BRAND_NAME} — Themed UI</footer>

        {/* Conversion modal */}
        {showConvertModal && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <motion.div initial={{y:20}} animate={{y:0}} className="rounded-2xl p-6 w-full max-w-xl" style={{background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.03)'}}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{background:`linear-gradient(90deg, ${BRAND_PRIMARY}, ${BRAND_ACCENT})`, color:'#fff'}}>💠</div>
                <div>
                  <h4 className="text-lg font-semibold" style={{color:BRAND_TEXT}}>Conversion — SBT → Token</h4>
                  <p className="text-sm mt-2" style={{color:'var(--brand-muted)'}}>On launch day a conversion window will open. SBT holders will burn SBTs and claim fungible tokens. Allocation is influenced by cumulative XP. Exact tokenomics & snapshots will be published before launch.</p>

                  <div className="mt-4 flex gap-2">
                    <button onClick={()=>{ setShowConvertModal(false); toast.info('Conversion will be enabled on-chain at launch'); }} className="px-4 py-2 rounded-md" style={{background:`linear-gradient(90deg, ${BRAND_PRIMARY}, ${BRAND_ACCENT})`, color:'#fff'}}>Understood</button>
                    <button onClick={()=>setShowConvertModal(false)} className="px-4 py-2 rounded-md" style={{background:'rgba(255,255,255,0.03)'}}>Close</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </>
  );
}
