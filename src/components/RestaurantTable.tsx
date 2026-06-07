import { useMemo, useState } from 'react'
import type { Restaurant } from '../types'
import { ScoreBars } from './ScoreBars'

interface RestaurantTableProps {
  data: Restaurant[]
  loading: boolean
}

type SortKey = 'totalScore' | 'reviewsCount' | 'systemScore'
type SortDir = 'asc' | 'desc'

const ALL = '__all__'

function bestLink(r: Restaurant): string | null {
  return r.url || r.website || null
}

export function RestaurantTable({ data, loading }: RestaurantTableProps) {
  const [category, setCategory] = useState<string>(ALL)
  const [sortKey, setSortKey] = useState<SortKey>('totalScore')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const categories = useMemo(
    () =>
      Array.from(new Set(data.map((r) => r.categoryName).filter(Boolean))).sort(
        (a, b) => a.localeCompare(b),
      ),
    [data],
  )

  const rows = useMemo(() => {
    const filtered =
      category === ALL ? data : data.filter((r) => r.categoryName === category)

    const sorted = [...filtered].sort((a, b) => {
      const diff = a[sortKey] - b[sortKey]
      const primary = sortDir === 'asc' ? diff : -diff
      if (primary !== 0) return primary
      // Stable tiebreak so equal values keep a sensible order.
      return b.reviewsCount - a.reviewsCount
    })

    return sorted
  }, [data, category, sortKey, sortDir])

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  function sortIndicator(key: SortKey) {
    if (key !== sortKey) return ' ↕'
    return sortDir === 'asc' ? ' ↑' : ' ↓'
  }

  if (loading) {
    return <p className="table__status">Loading restaurants…</p>
  }

  if (data.length === 0) {
    return <p className="table__status">No restaurants found for this location.</p>
  }

  return (
    <div className="table-block">
      <div className="filter-bar">
        <label className="filter-bar__field">
          <span>Category</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value={ALL}>All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <span className="filter-bar__count">
          Showing {rows.length} of {data.length}
        </span>
      </div>

      <div className="table__wrap">
        <table className="table">
          <thead>
            <tr>
              <th className="table__rank">#</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th
                className="table__num table__sortable"
                onClick={() => toggleSort('totalScore')}
              >
                Rating{sortIndicator('totalScore')}
              </th>
              <th
                className="table__num table__sortable"
                onClick={() => toggleSort('reviewsCount')}
              >
                Reviews{sortIndicator('reviewsCount')}
              </th>
              <th
                className="table__num table__sortable"
                onClick={() => toggleSort('systemScore')}
              >
                Score{sortIndicator('systemScore')}
              </th>
              <th className="table__scores">Scores</th>
              <th className="table__summary">Summary</th>
              <th>Neighborhood</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const link = bestLink(r)
              return (
                <tr key={`${r.title}-${i}`}>
                  <td className="table__rank">{i + 1}</td>
                  <td>
                    <div className="cell-name">{r.title}</div>
                    {r.subTitle && <div className="cell-subname">{r.subTitle}</div>}
                    {r.permanentlyClosed && (
                      <span className="badge badge--closed">Permanently closed</span>
                    )}
                    {!r.permanentlyClosed && r.temporarilyClosed && (
                      <span className="badge badge--temp">Temporarily closed</span>
                    )}
                  </td>
                  <td>{r.categoryName || '—'}</td>
                  <td>{r.price || '—'}</td>
                  <td className="table__num">
                    {r.totalScore > 0 ? `★ ${r.totalScore.toFixed(1)}` : '—'}
                  </td>
                  <td className="table__num">
                    {r.reviewsCount > 0 ? r.reviewsCount.toLocaleString() : '—'}
                  </td>
                  <td className="table__num">
                    {r.systemScore > 0 ? (
                      <span className="score-pill">{r.systemScore}</span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="table__scores">
                    <ScoreBars scores={r.scores} />
                  </td>
                  <td className="table__summary">
                    {r.summary ? (
                      <span className="summary-text" title={r.summary}>
                        {r.summary}
                      </span>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                  <td>{r.neighborhood || '—'}</td>
                  <td>
                    {link ? (
                      <a href={link} target="_blank" rel="noreferrer noopener">
                        View
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
