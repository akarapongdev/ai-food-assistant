import type { Restaurant } from '../types'

interface RestaurantTableProps {
  data: Restaurant[]
  loading: boolean
}

function bestLink(r: Restaurant): string | null {
  return r.url || r.website || null
}

export function RestaurantTable({ data, loading }: RestaurantTableProps) {
  if (loading) {
    return <p className="table__status">Loading restaurants…</p>
  }

  if (data.length === 0) {
    return <p className="table__status">No restaurants found for this location.</p>
  }

  return (
    <div className="table__wrap">
      <table className="table">
        <thead>
          <tr>
            <th className="table__rank">#</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th className="table__num">Rating</th>
            <th className="table__num">Reviews</th>
            <th>Neighborhood</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r, i) => {
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
  )
}
