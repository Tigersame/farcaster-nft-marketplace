"use client";

import { useEffect } from "react";

export default function ErudaProvider() {
  useEffect(() => {
    // Disable Eruda in production to reduce console noise
    if (process.env.NODE_ENV === 'production') {
      return;
    }
    
    // Only enable if explicitly needed (can be toggled via env var)
    if (process.env.NEXT_PUBLIC_ENABLE_ERUDA !== 'true') {
      return;
    }
    
    import("eruda").then((eruda) => {
      if (!window.eruda) {
        window.eruda = eruda.default;
        const erudaInstance = eruda.default as {
          init: (config?: { 
            defaults?: { 
              displaySize?: number; 
              transparency?: number;
            };
            tool?: string[];
          }) => void;
          position: (config: { x: number; y: number }) => void;
        };
        erudaInstance.init({
          defaults: {
            displaySize: 50,
            transparency: 0.8,
          },
        });
        
        // Position the trigger button in bottom right corner
        setTimeout(() => {
          erudaInstance.position({ x: window.innerWidth - 60, y: window.innerHeight - 60 });
        }, 100);
        
        // Suppress the initialization log
        // console.log("Eruda initialized for debugging");
      }
    });
  }, []);

  return null;
}

declare global {
  interface Window {
    eruda?: unknown;
  }
}
