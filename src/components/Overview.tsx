import { LOCATIONS } from '../config'
import type { Restaurant } from '../types'

interface OverviewProps {
  activeTab: string
  data: Restaurant[]
  loading: boolean
  error: string | null
}

export function Overview({ activeTab, data, loading, error }: OverviewProps) {
  const label = LOCATIONS.find((l) => l.key === activeTab)?.label ?? activeTab

  if (error) {
    return (
      <section className="overview overview--error">
        <p className="overview__error">⚠️ {error}</p>
      </section>
    )
  }

  const avg =
    data.length > 0
      ? data.reduce((sum, r) => sum + r.totalScore, 0) / data.length
      : 0

  return (
    <section className="overview">
      <div className="overview__stat">
        <span className="overview__value">{loading ? '…' : data.length}</span>
        <span className="overview__label">restaurants in {label}</span>
      </div>
      <div className="overview__stat">
        <span className="overview__value">{loading ? '…' : avg.toFixed(2)}</span>
        <span className="overview__label">average rating ★</span>
      </div>
    </section>
  )
}
