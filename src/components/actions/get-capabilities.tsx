"use client";

import { useState, useCallback } from "react";
import sdk from "@farcaster/frame-sdk";
import { Button } from "@/components/ui/Button";

export function GetCapabilitiesAction() {
  const [capabilities, setCapabilities] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCapabilities = useCallback(async () => {
    setLoading(true);
    try {
      const caps = await sdk.getCapabilities();
      setCapabilities(caps);
    } catch (error) {
      console.error('Failed to get capabilities:', error);
      setCapabilities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="mb-4">
      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
        <pre className="font-mono text-xs text-emerald-500 dark:text-emerald-400">sdk.getCapabilities</pre>
      </div>
      
      <Button onClick={fetchCapabilities} isLoading={loading}>
        Get Capabilities
      </Button>

      {capabilities && (
        <div className="mt-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <pre className="font-mono text-xs text-gray-900 dark:text-white whitespace-pre-wrap break-words">
            {JSON.stringify(capabilities, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
