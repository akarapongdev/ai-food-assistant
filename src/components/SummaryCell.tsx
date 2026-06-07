import { useThaiSummary } from '../hooks/useThaiSummary'

interface SummaryCellProps {
  summary: string
}

export function SummaryCell({ summary }: SummaryCellProps) {
  const { text, loading } = useThaiSummary(summary)

  if (!summary) return <span className="muted">—</span>

  // Keep the English original available on hover via the title attribute.
  return (
    <span className="summary-text" title={summary}>
      {loading ? <span className="muted">กำลังแปล…</span> : text}
    </span>
  )
}
