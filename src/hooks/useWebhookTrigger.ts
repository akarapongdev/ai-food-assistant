import { useCallback, useEffect, useRef, useState } from 'react'
import { N8N_WEBHOOK_URL } from '../config'

export type WebhookStatus = 'idle' | 'loading' | 'success' | 'error'

interface WebhookOptions {
  /** Called once after the webhook request is fired successfully. */
  onSuccess?: () => void
}

interface WebhookTrigger {
  status: WebhookStatus
  message: string
  trigger: (params?: Record<string, string>) => Promise<void>
}

/**
 * Calls the n8n webhook (a GET-registered endpoint) and tracks the request
 * lifecycle (idle → loading → success | error). Success auto-resets shortly after.
 *
 * The webhook returns no CORS headers, so we use `mode: 'no-cors'`: the request
 * still reaches n8n and triggers the workflow exactly once, the promise resolves
 * (opaque response — status is unreadable), and only a genuine network failure
 * rejects. We therefore treat a resolved fetch as success.
 */
export function useWebhookTrigger(options: WebhookOptions = {}): WebhookTrigger {
  const [status, setStatus] = useState<WebhookStatus>('idle')
  const [message, setMessage] = useState('')
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Keep the latest callback reachable without re-creating `trigger`.
  const onSuccessRef = useRef(options.onSuccess)
  onSuccessRef.current = options.onSuccess

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current)
    },
    [],
  )

  const trigger = useCallback(async (params: Record<string, string> = {}) => {
    if (resetTimer.current) clearTimeout(resetTimer.current)
    setStatus('loading')
    setMessage('')

    const query = new URLSearchParams({
      source: 'food-ranking',
      triggeredAt: new Date().toISOString(),
      ...params,
    })
    const url = `${N8N_WEBHOOK_URL}?${query.toString()}`

    try {
      await fetch(url, { method: 'GET', mode: 'no-cors' })
      setStatus('success')
      setMessage('เรียกใช้ Workflow สำเร็จ')
      onSuccessRef.current?.()
      resetTimer.current = setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 4000)
    } catch (err: unknown) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'การเรียกใช้ล้มเหลว')
    }
  }, [])

  return { status, message, trigger }
}
