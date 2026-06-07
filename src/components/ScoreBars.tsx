import type { SubScores } from '../types'

interface ScoreBarsProps {
  scores: SubScores | null
}

const FIELDS: { key: keyof SubScores; label: string }[] = [
  { key: 'ratingReviewQuality', label: 'Rating' },
  { key: 'groupSuitability', label: 'Group' },
  { key: 'priceSuitability', label: 'Price' },
  { key: 'travelConvenience', label: 'Travel' },
  { key: 'dataCompleteness', label: 'Data' },
  { key: 'uniquenessExperience', label: 'Unique' },
]

export function ScoreBars({ scores }: ScoreBarsProps) {
  if (!scores) return <span className="muted">—</span>

  // Normalize bar width against the largest sub-score in this row.
  const max = Math.max(1, ...FIELDS.map((f) => scores[f.key]))

  return (
    <div className="bars">
      {FIELDS.map((f) => {
        const value = scores[f.key]
        return (
          <div className="bars__row" key={f.key} title={`${f.label}: ${value}`}>
            <span className="bars__label">{f.label}</span>
            <span className="bars__track">
              <span
                className="bars__fill"
                style={{ width: `${(value / max) * 100}%` }}
              />
            </span>
            <span className="bars__value">{value}</span>
          </div>
        )
      })}
    </div>
  )
}
