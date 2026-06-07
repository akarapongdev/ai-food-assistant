import { useEffect, useState } from 'react'
import { translateToThai } from '../lib/translate'

interface ThaiSummary {
  text: string
  loading: boolean
}

/** Translates an English summary to Thai, exposing a loading state while pending. */
export function useThaiSummary(english: string): ThaiSummary {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!english) {
      setText('')
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    translateToThai(english).then((thai) => {
      if (cancelled) return
      setText(thai)
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [english])

  return { text, loading }
}
