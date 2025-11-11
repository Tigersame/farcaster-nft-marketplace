"use client";

import { useState, useCallback } from "react";
import sdk from "@farcaster/frame-sdk";
import { Button } from "@/components/ui/Button";

export function GetChainsAction() {
  const [chains, setChains] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchChains = useCallback(async () => {
    setLoading(true);
    try {
      const chainList = await sdk.wallet.getChains();
      setChains(chainList);
    } catch (error) {
      console.error('Failed to get chains:', error);
      setChains([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="mb-4">
      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
        <pre className="font-mono text-xs text-emerald-500 dark:text-emerald-400">sdk.wallet.getChains</pre>
      </div>
      
      <Button onClick={fetchChains} isLoading={loading}>
        Get Chains
      </Button>

      {chains && (
        <div className="mt-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <pre className="font-mono text-xs text-gray-900 dark:text-white whitespace-pre-wrap break-words">
            {JSON.stringify(chains, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
