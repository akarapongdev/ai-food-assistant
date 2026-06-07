import { useMemo } from 'react'
import type { Restaurant } from '../types'
import { useThaiSummary } from '../hooks/useThaiSummary'

interface TopPicksProps {
  data: Restaurant[]
  locationLabel: string
}

const MEDALS = ['🥇', '🥈', '🥉']

function bestLink(r: Restaurant): string | null {
  return r.url || r.website || null
}

function PickCard({ restaurant, index }: { restaurant: Restaurant; index: number }) {
  const { text: thaiSummary, loading } = useThaiSummary(restaurant.summary)
  const link = bestLink(restaurant)

  return (
    <article className="pick">
      <div className="pick__top">
        <span className="pick__medal">{MEDALS[index] ?? `#${index + 1}`}</span>
        <span className="pick__score" title="System score">
          {restaurant.systemScore}
        </span>
      </div>

      <h3 className="pick__name">{restaurant.title}</h3>
      {restaurant.subTitle && <p className="pick__subname">{restaurant.subTitle}</p>}
      {restaurant.categoryName && (
        <p className="pick__category">{restaurant.categoryName}</p>
      )}

      <p className="pick__summary">
        {loading ? <span className="muted">กำลังแปล…</span> : thaiSummary}
      </p>

      {link && (
        <a
          className="pick__link"
          href={link}
          target="_blank"
          rel="noreferrer noopener"
        >
          ดูร้าน →
        </a>
      )}
    </article>
  )
}

export function TopPicks({ data, locationLabel }: TopPicksProps) {
  const picks = useMemo(
    () =>
      data
        .filter((r) => r.systemScore > 0)
        .sort((a, b) => b.systemScore - a.systemScore)
        .slice(0, 3),
    [data],
  )

  return (
    <section className="picks-section">
      <h2 className="picks-section__title">
        ⭐ แนะนำสำหรับย่าน{locationLabel}
      </h2>

      {picks.length === 0 ? (
        <p className="picks-section__empty">ยังไม่มีคำแนะนำสำหรับย่านนี้</p>
      ) : (
        <div className="picks-grid">
          {picks.map((r, i) => (
            <PickCard key={`${r.title}-${i}`} restaurant={r} index={i} />
          ))}
        </div>
      )}
    </section>
  )
}
