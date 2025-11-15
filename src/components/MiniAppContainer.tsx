'use client'

import { useMiniApp } from '@/contexts/MiniAppContext'

/**
 * Mini App Container
 * Enforces proper sizing and orientation as per Farcaster Mini App specification
 * https://miniapps.farcaster.xyz/docs/specification#size--orientation
 * 
 * Requirements:
 * - Vertical modal orientation
 * - Mobile: Device dimensions
 * - Web: 424x695px (iPhone 14 Pro Max dimensions)
 */
export function MiniAppContainer({ children }: { children: React.ReactNode }) {
  const { isSDKLoaded } = useMiniApp()

  // Only apply container constraints in Farcaster environment
  if (!isSDKLoaded) {
    return <>{children}</>
  }

  return (
    <div className="mini-app-container">
      {children}
      
      <style jsx>{`
        .mini-app-container {
          /* Vertical modal constraints */
          max-width: 424px;
          min-height: 695px;
          margin: 0 auto;
          position: relative;
          overflow-x: hidden;
          overflow-y: auto;
        }

        /* Mobile devices - use full viewport */
        @media (max-width: 768px) {
          .mini-app-container {
            max-width: 100vw;
            min-height: 100vh;
            width: 100%;
            height: 100%;
          }
        }

        /* Desktop/Web - fixed dimensions */
        @media (min-width: 769px) {
          .mini-app-container {
            width: 424px;
            height: 695px;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            overflow: hidden;
          }
        }

        /* Safe area handling for mobile */
        @supports (padding: env(safe-area-inset-top)) {
          .mini-app-container {
            padding-top: env(safe-area-inset-top);
            padding-bottom: env(safe-area-inset-bottom);
            padding-left: env(safe-area-inset-left);
            padding-right: env(safe-area-inset-right);
          }
        }
      `}</style>
    </div>
  )
}
