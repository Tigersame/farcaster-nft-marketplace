'use client'

import { useEffect } from 'react'

interface EmbedMetaTagsProps {
  imageUrl: string
  buttonTitle?: string
  url?: string
  name?: string
  splashImageUrl?: string
  splashBackgroundColor?: string
}

/**
 * Client component to inject Farcaster Mini App embed metadata
 * Based on: https://docs.base.org/mini-apps/core-concepts/embeds-and-previews
 */
export function EmbedMetaTags({
  imageUrl,
  buttonTitle = 'Open App',
  url = 'https://farcastmints.com',
  name = 'FarcastMints',
  splashImageUrl = 'https://farcastmints.com/splash.png',
  splashBackgroundColor = '#0f1f3d'
}: EmbedMetaTagsProps) {
  useEffect(() => {
    // Check if meta tag already exists
    let metaTag = document.querySelector('meta[name="fc:miniapp"]') as HTMLMetaElement
    
    if (!metaTag) {
      metaTag = document.createElement('meta')
      metaTag.name = 'fc:miniapp'
      document.head.appendChild(metaTag)
    }

    // Update the content
    const content = JSON.stringify({
      version: 'next',
      imageUrl,
      button: {
        title: buttonTitle,
        action: {
          type: 'launch_frame',
          url,
          name,
          splashImageUrl,
          splashBackgroundColor
        }
      }
    })

    metaTag.content = content

    // Cleanup function
    return () => {
      // Keep the meta tag on unmount for better caching
    }
  }, [imageUrl, buttonTitle, url, name, splashImageUrl, splashBackgroundColor])

  return null // This component doesn't render anything
}
