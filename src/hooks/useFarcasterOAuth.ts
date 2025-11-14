// Custom hook for Farcaster OAuth integration
import { useState, useEffect } from 'react'

interface FarcasterProfile {
  username?: string
  displayName?: string
  avatar?: string
  fid?: number
  bio?: string
}

export function useFarcasterOAuth() {
  const [profile, setProfile] = useState<FarcasterProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    
    // Fetch current user profile
    fetch('/api/farcaster/me')
      .then(async (response) => {
        if (!mounted) return
        if (response.ok) {
          const json = await response.json()
          setProfile(json)
        } else {
          setProfile(null)
        }
        setLoading(false)
      })
      .catch(() => {
        if (mounted) {
          setProfile(null)
          setLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [])

  async function connect() {
    // Redirect to server-side OAuth flow
    window.location.href = '/api/farcaster/auth'
  }

  async function disconnect() {
    // Call logout endpoint to clear session cookie
    await fetch('/api/farcaster/logout', { method: 'POST' })
    setProfile(null)
  }

  return { profile, loading, connect, disconnect }
}
