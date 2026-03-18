// src/hooks/useAuth.js
import { useState, useEffect } from 'react'
import { subscribeToAuthState } from '../services/auth'

export function useAuth() {
  const [user, setUser] = useState(undefined) // undefined = loading
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((u) => {
      setUser(u)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return { user, loading, isAdmin: !!user }
}
