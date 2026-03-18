// src/hooks/useVolunteers.js
import { useState, useEffect, useCallback } from 'react'
import { getAllVolunteers } from '../services/volunteers'

export function useVolunteers() {
  const [volunteers, setVolunteers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllVolunteers()
      setVolunteers(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { volunteers, loading, error, refetch: fetch }
}
