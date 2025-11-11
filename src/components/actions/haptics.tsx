"use client";

import { useCallback } from "react";
import sdk from "@farcaster/frame-sdk";
import { Button } from "@/components/ui/Button";

export function HapticsAction() {
  const triggerImpact = useCallback(async (style: 'light' | 'medium' | 'heavy') => {
    try {
      await sdk.haptics.impactOccurred(style);
    } catch (error) {
      console.log('Haptics not supported:', error);
    }
  }, []);

  const triggerSelection = useCallback(async () => {
    try {
      await sdk.haptics.selectionChanged();
    } catch (error) {
      console.log('Haptics not supported:', error);
    }
  }, []);

  const triggerNotification = useCallback(async (type: 'success' | 'warning' | 'error') => {
    try {
      await sdk.haptics.notificationOccurred(type);
    } catch (error) {
      console.log('Haptics not supported:', error);
    }
  }, []);

  return (
    <div className="space-y-4">
      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg my-2">
        <pre className="font-mono text-xs text-emerald-500 dark:text-emerald-400">sdk.haptics</pre>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Impact Feedback</h4>
        <div className="flex gap-2">
          <Button onClick={() => triggerImpact('light')}>Light</Button>
          <Button onClick={() => triggerImpact('medium')}>Medium</Button>
          <Button onClick={() => triggerImpact('heavy')}>Heavy</Button>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Selection Changed</h4>
        <Button onClick={triggerSelection}>Trigger Selection</Button>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Notification Feedback</h4>
        <div className="flex gap-2">
          <Button onClick={() => triggerNotification('success')}>Success</Button>
          <Button onClick={() => triggerNotification('warning')}>Warning</Button>
          <Button onClick={() => triggerNotification('error')}>Error</Button>
        </div>
      </div>
    </div>
  );
}
