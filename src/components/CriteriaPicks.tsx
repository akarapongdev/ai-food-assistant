import { useState } from 'react'
import { CRITERIA, topByCriterion } from '../lib/criteria'
import { useThaiSummary } from '../hooks/useThaiSummary'
import type { Restaurant } from '../types'

interface CriteriaPicksProps {
  data: Restaurant[]
}

const MEDALS = ['🥇', '🥈', '🥉']

function Card({ restaurant, index }: { restaurant: Restaurant; index: number }) {
  const link = restaurant.website || null
  const { text: thaiSummary, loading } = useThaiSummary(restaurant.summary)
  const meta = [
    restaurant.totalScore > 0 ? `★ ${restaurant.totalScore.toFixed(1)}` : null,
    restaurant.reviewsCount > 0 ? `${restaurant.reviewsCount.toLocaleString()} รีวิว` : null,
    restaurant.price || null,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <article className="pick">
      <div className="pick__top">
        <span className="pick__medal">{MEDALS[index] ?? `#${index + 1}`}</span>
      </div>
      <h4 className="pick__name">{restaurant.title}</h4>
      {restaurant.subTitle && <p className="pick__subname">{restaurant.subTitle}</p>}
      {restaurant.categoryName && (
        <p className="pick__category">{restaurant.categoryName}</p>
      )}
      <p className="group-card__meta">{meta || '—'}</p>
      {restaurant.summary && (
        <p className="pick__summary" title={restaurant.summary}>
          {loading ? <span className="muted">กำลังแปล…</span> : thaiSummary}
        </p>
      )}
      {link && (
        <a className="pick__link" href={link} target="_blank" rel="noreferrer noopener">
          ดูร้าน →
        </a>
      )}
    </article>
  )
}

export function CriteriaPicks({ data }: CriteriaPicksProps) {
  const [activeKey, setActiveKey] = useState(CRITERIA[0].key)
  const criterion = CRITERIA.find((c) => c.key === activeKey) ?? CRITERIA[0]
  const picks = topByCriterion(data, criterion, 3)

  return (
    <section className="picks-section">
      <h2 className="picks-section__title">🍽️ แนะนำตามโอกาส</h2>

      <div className="crit-tabs" role="tablist">
        {CRITERIA.map((c) => (
          <button
            key={c.key}
            type="button"
            role="tab"
            aria-selected={c.key === activeKey}
            className={`crit-tab ${c.key === activeKey ? 'crit-tab--active' : ''}`}
            onClick={() => setActiveKey(c.key)}
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      {picks.length === 0 ? (
        <p className="picks-section__empty">ยังไม่มีข้อมูลเพียงพอ</p>
      ) : (
        <div className="picks-grid">
          {picks.map((r, i) => (
            <Card key={`${r.title}-${i}`} restaurant={r} index={i} />
          ))}
        </div>
      )}
    </section>
  )
}
