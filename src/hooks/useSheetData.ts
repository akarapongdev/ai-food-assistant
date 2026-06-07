import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchLocation } from '../lib/sheets'
import type { Restaurant } from '../types'

interface SheetState {
  data: Restaurant[]
  loading: boolean
  error: string | null
  refreshing: boolean
}

interface SheetResult extends SheetState {
  /** Re-fetches the active tab (cache-busting), keeping current data visible. */
  refetch: () => Promise<void>
}

/** In-memory cache so re-selecting a previously loaded tab is instant. */
const cache = new Map<string, Restaurant[]>()

export function useSheetData(tabKey: string): SheetResult {
  const [state, setState] = useState<SheetState>(() => ({
    data: cache.get(tabKey) ?? [],
    loading: !cache.has(tabKey),
    error: null,
    refreshing: false,
  }))

  // Keep the latest tab key reachable from the stable refetch callback.
  const tabRef = useRef(tabKey)
  tabRef.current = tabKey

  useEffect(() => {
    let cancelled = false

    const cached = cache.get(tabKey)
    if (cached) {
      setState({ data: cached, loading: false, error: null, refreshing: false })
      return
    }

    setState({ data: [], loading: true, error: null, refreshing: false })

    fetchLocation(tabKey)
      .then((data) => {
        if (cancelled) return
        cache.set(tabKey, data)
        setState({ data, loading: false, error: null, refreshing: false })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const message = err instanceof Error ? err.message : 'Failed to load data.'
        setState({ data: [], loading: false, error: message, refreshing: false })
      })

    return () => {
      cancelled = true
    }
  }, [tabKey])

  const refetch = useCallback(async () => {
    const key = tabRef.current
    setState((s) => ({ ...s, refreshing: true, error: null }))
    try {
      const data = await fetchLocation(key)
      cache.set(key, data)
      // Only apply if the user hasn't switched tabs meanwhile.
      if (tabRef.current === key) {
        setState({ data, loading: false, error: null, refreshing: false })
      } else {
        setState((s) => ({ ...s, refreshing: false }))
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to refresh data.'
      setState((s) => ({ ...s, refreshing: false, error: message }))
    }
  }, [])

  return { ...state, refetch }
}
