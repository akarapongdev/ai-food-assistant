import { useCallback, useEffect, useRef, useState } from 'react'
import { LOCATIONS } from './config'
import { useSheetData } from './hooks/useSheetData'
import { Header } from './components/Header'
import { Overview } from './components/Overview'
import { TopPicks } from './components/TopPicks'
import { RestaurantTable } from './components/RestaurantTable'
import './App.css'

// The n8n workflow runs asynchronously (scrape + re-score), so we refetch a few
// times after a trigger to catch the sheet once it has been updated.
const REFRESH_DELAYS_MS = [5000, 20000, 45000]

function App() {
  const [activeTab, setActiveTab] = useState<string>(LOCATIONS[0].key)
  const { data, loading, error, refreshing, refetch } = useSheetData(activeTab)

  const locationLabel =
    LOCATIONS.find((l) => l.key === activeTab)?.label ?? activeTab

  // Track scheduled refresh timers so they can be cleared on unmount.
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout)
    },
    [],
  )

  const handleWebhookSuccess = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = REFRESH_DELAYS_MS.map((ms) =>
      setTimeout(() => {
        void refetch()
      }, ms),
    )
  }, [refetch])

  return (
    <div className="app">
      <Header
        activeTab={activeTab}
        onSelect={setActiveTab}
        onWebhookSuccess={handleWebhookSuccess}
      />

      <main className="content">
        <Overview activeTab={activeTab} data={data} loading={loading} error={error} />

        {refreshing && (
          <p className="refresh-banner">
            <span className="refresh-banner__spinner" aria-hidden />
            กำลังรีเฟรชข้อมูลหลังเรียกใช้ Workflow…
          </p>
        )}

        {!loading && !error && (
          <TopPicks data={data} locationLabel={locationLabel} />
        )}
        <RestaurantTable data={data} loading={loading} />
      </main>
    </div>
  )
}

export default App
