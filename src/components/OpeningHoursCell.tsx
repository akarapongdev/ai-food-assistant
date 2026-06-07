import type { OpeningHour } from '../types'

interface OpeningHoursCellProps {
  hours: OpeningHour[]
}

const TODAY = new Date().toLocaleDateString('en-US', { weekday: 'long' })

export function OpeningHoursCell({ hours }: OpeningHoursCellProps) {
  if (hours.length === 0) return <span className="muted">—</span>

  const today = hours.find((h) => h.day === TODAY)
  const fullWeek = hours.map((h) => `${h.day}: ${h.hours}`).join('\n')

  return (
    <span className="hours-cell" title={fullWeek}>
      {today ? today.hours : 'ดูเวลาทำการ'}
    </span>
  )
}
