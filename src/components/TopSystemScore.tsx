import type { Restaurant } from '../types'

interface TopSystemScoreProps {
  data: Restaurant[]
}

export function TopSystemScore({ data }: TopSystemScoreProps) {
  const top = data
    .filter((r) => r.systemScore > 0)
    .sort((a, b) => b.systemScore - a.systemScore)
    .slice(0, 10)

  return (
    <section className="picks-section">
      <h2 className="picks-section__title">🏆 Top 10 (System Score)</h2>

      {top.length === 0 ? (
        <p className="picks-section__empty">ยังไม่มีคะแนนระบบ</p>
      ) : (
        <ol className="score-list">
          {top.map((r, i) => (
            <li className="score-list__item" key={`${r.title}-${i}`}>
              <span className="score-list__rank">{i + 1}</span>
              <span className="score-list__title">{r.title}</span>
              <span className="score-pill">{r.systemScore}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
