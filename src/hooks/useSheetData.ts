import { useEffect, useState } from 'react'
import { fetchLocation } from '../lib/sheets'
import type { Restaurant } from '../types'

interface SheetState {
  data: Restaurant[]
  loading: boolean
  error: string | null
}

/** In-memory cache so re-selecting a previously loaded tab is instant. */
const cache = new Map<string, Restaurant[]>()

export function useSheetData(tabKey: string): SheetState {
  const [state, setState] = useState<SheetState>(() => ({
    data: cache.get(tabKey) ?? [],
    loading: !cache.has(tabKey),
    error: null,
  }))

  useEffect(() => {
    let cancelled = false

    const cached = cache.get(tabKey)
    if (cached) {
      setState({ data: cached, loading: false, error: null })
      return
    }

    setState({ data: [], loading: true, error: null })

    fetchLocation(tabKey)
      .then((data) => {
        if (cancelled) return
        cache.set(tabKey, data)
        setState({ data, loading: false, error: null })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const message = err instanceof Error ? err.message : 'Failed to load data.'
        setState({ data: [], loading: false, error: message })
      })

    return () => {
      cancelled = true
    }
  }, [tabKey])

  return state
}
