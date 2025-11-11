"use client";

import React, { useState, useEffect } from "react";
import { useMiniApp } from "@/contexts/MiniAppContext";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/Button";
import sdk from "@farcaster/frame-sdk";

type TabType = "actions" | "context" | "wallet";

export default function MiniAppDemo() {
  const miniApp = useMiniApp();
  const { isConnected, address } = useAccount();
  const [activeTab, setActiveTab] = useState<TabType>("actions");
  const [capabilities, setCapabilities] = useState<any>(null);
  const [isFullObjectOpen, setIsFullObjectOpen] = useState(false);

  // Fetch capabilities on mount
  useEffect(() => {
    const fetchCapabilities = async () => {
      try {
        const caps = await sdk.getCapabilities();
        setCapabilities(caps);
      } catch (error) {
        console.error('Failed to get capabilities:', error);
      }
    };
    fetchCapabilities();
  }, []);

  const handleTabChange = async (tab: TabType) => {
    try {
      await sdk.haptics.selectionChanged();
    } catch (error) {
      console.log('Haptics not supported:', error);
    }
    setActiveTab(tab);
  };

  const triggerHaptic = async (style: 'light' | 'medium' | 'heavy') => {
    try {
      await sdk.haptics.impactOccurred(style);
    } catch (error) {
      console.log('Haptics not supported:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-xl mx-auto p-3">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Farcaster Mini App Demo
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Test all Farcaster SDK features
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          {(['actions', 'context', 'wallet'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`
                px-4 py-2 font-medium capitalize transition-colors
                ${activeTab === tab
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Actions Tab */}
        {activeTab === "actions" && (
          <div className="space-y-4">
            {/* SDK Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">SDK Actions</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Open URL</h4>
                  <Button onClick={() => miniApp.openUrl('https://base.org')}>
                    Open Base.org
                  </Button>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">View Profile</h4>
                  <Button onClick={() => miniApp.viewProfile(3)}>
                    View @dwr.eth (FID 3)
                  </Button>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Compose Cast</h4>
                  <Button onClick={() => miniApp.composeCast('Hello from FarcastSea NFT Marketplace! 🌊')}>
                    Compose Cast
                  </Button>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Close Mini App</h4>
                  <Button onClick={() => miniApp.close()}>
                    Close
                  </Button>
                </div>
              </div>
            </div>

            {/* Haptics */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Haptic Feedback</h3>
              <div className="flex gap-2 flex-wrap">
                <Button onClick={() => triggerHaptic('light')}>Light</Button>
                <Button onClick={() => triggerHaptic('medium')}>Medium</Button>
                <Button onClick={() => triggerHaptic('heavy')}>Heavy</Button>
                <Button onClick={() => miniApp.triggerHaptic('light')}>Via Context</Button>
              </div>
            </div>

            {/* Runtime Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Runtime Info</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">SDK Loaded:</span>
                  <span className={`text-sm font-medium ${miniApp.isSDKLoaded ? 'text-green-600' : 'text-red-600'}`}>
                    {miniApp.isSDKLoaded ? '✓ Yes' : '✗ No'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Ready:</span>
                  <span className={`text-sm font-medium ${miniApp.isReady ? 'text-green-600' : 'text-yellow-600'}`}>
                    {miniApp.isReady ? '✓ Yes' : '⏳ Loading...'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Base App:</span>
                  <span className={`text-sm font-medium ${miniApp.isBaseApp ? 'text-blue-600' : 'text-gray-600'}`}>
                    {miniApp.isBaseApp ? '✓ Yes (FID 309857)' : '✗ No'}
                  </span>
                </div>
              </div>
              
              {capabilities && (
                <div className="mt-3 p-2 bg-gray-100 dark:bg-gray-900 rounded">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Capabilities:</p>
                  <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">
                    {JSON.stringify(capabilities, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Context Tab */}
        {activeTab === "context" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setIsFullObjectOpen(!isFullObjectOpen)}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors mb-3"
              >
                <span className={`transform transition-transform ${isFullObjectOpen ? "rotate-90" : ""}`}>
                  ➤
                </span>
                <span className="font-medium">Full Context Object</span>
              </button>

              {isFullObjectOpen && miniApp.context && (
                <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded-lg">
                  <pre className="font-mono text-xs text-gray-900 dark:text-white whitespace-pre-wrap break-words">
                    {JSON.stringify(miniApp.context, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {miniApp.context && (
              <div className="space-y-3">
                {/* User Info */}
                {miniApp.context.user && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">User</h3>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">FID:</span> {miniApp.context.user.fid}
                      </p>
                      {miniApp.context.user.username && (
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-medium">Username:</span> @{miniApp.context.user.username}
                        </p>
                      )}
                      {miniApp.context.user.displayName && (
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-medium">Display Name:</span> {miniApp.context.user.displayName}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Client Info */}
                {miniApp.context.client && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Client</h3>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Client FID:</span> {miniApp.context.client.clientFid}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Platform:</span> {miniApp.context.client.platformType || 'unknown'}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Added:</span> {miniApp.context.client.added ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Wallet Tab */}
        {activeTab === "wallet" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Wallet Connection</h3>
              
              {!isConnected ? (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Connect your wallet to access all features
                  </p>
                  <ConnectButton />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                      ✓ Wallet Connected
                    </span>
                    <ConnectButton />
                  </div>
                  
                  <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded-lg">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Address:</p>
                    <p className="text-xs font-mono text-gray-900 dark:text-white break-all">
                      {address}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Token Actions</h4>
                    <div className="flex gap-2">
                      <Button onClick={() => miniApp.viewToken('0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913')}>
                        View USDC
                      </Button>
                      <Button onClick={() => miniApp.swapToken({})}>
                        Swap Tokens
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
