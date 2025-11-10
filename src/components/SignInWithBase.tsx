'use client';

import React, { useState } from 'react';
import { createBaseAccountSDK } from "@base-org/account";
import { motion } from 'framer-motion';
import { FiLogIn } from 'react-icons/fi';

interface SignInWithBaseProps {
  onSignIn: (address: string) => void;
  colorScheme?: 'light' | 'dark';
}

export default function SignInWithBase({ onSignIn, colorScheme = 'dark' }: SignInWithBaseProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Create Base Account SDK provider
      const provider = createBaseAccountSDK({
        appName: "Farcaster NFT Marketplace - AI Agent",
      }).getProvider();

      // 1. Get nonce from server
      const nonceResponse = await fetch('/api/auth/verify', { 
        method: 'GET' 
      });
      
      if (!nonceResponse.ok) {
        throw new Error('Failed to get authentication nonce');
      }

      const { nonce } = await nonceResponse.json();
      
      // 2. Connect with SIWE capability
      const connectResponse: any = await provider.request({
        method: "wallet_connect",
        params: [{
          version: "1",
          capabilities: {
            signInWithEthereum: {
              chainId: '0x2105', // Base mainnet (8453 in hex)
              nonce,
            },
          },
        }],
      });

      const { address } = connectResponse.accounts[0];

      // 3. Handle SIWE or fallback to manual signing
      if (connectResponse.signInWithEthereum) {
        const { message, signature } = connectResponse.signInWithEthereum;
        
        // Verify signature on server
        const verifyResponse = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address, message, signature })
        });

        if (!verifyResponse.ok) {
          throw new Error('Authentication failed');
        }

        const { sessionToken } = await verifyResponse.json();
        
        // Store session token in localStorage
        localStorage.setItem('auth_session', sessionToken);
        localStorage.setItem('auth_address', address);

        // Notify parent component
        onSignIn(address);
      } else {
        // Fallback: Manual signature flow
        const message = `Sign in to Farcaster NFT Marketplace\n\nNonce: ${nonce}\nChain ID: 8453`;
        
        const signature = await provider.request({
          method: 'personal_sign',
          params: [message, address],
        });

        // Verify signature on server
        const verifyResponse = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address, message, signature })
        });

        if (!verifyResponse.ok) {
          throw new Error('Authentication failed');
        }

        const { sessionToken } = await verifyResponse.json();
        
        localStorage.setItem('auth_session', sessionToken);
        localStorage.setItem('auth_address', address);

        onSignIn(address);
      }
    } catch (err: any) {
      console.error("Sign in failed:", err);
      setError(err.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <motion.button
        onClick={handleSignIn}
        disabled={isLoading}
        className={`w-full px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all ${
          colorScheme === 'dark'
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <FiLogIn className="text-xl" />
            <span>Sign In with Base</span>
          </>
        )}
      </motion.button>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm"
        >
          {error}
        </motion.div>
      )}

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Sign in securely using Base Account with SIWE
      </p>
    </div>
  );
}
