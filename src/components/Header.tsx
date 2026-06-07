import { LOCATIONS } from '../config'
import { useWebhookTrigger } from '../hooks/useWebhookTrigger'

interface HeaderProps {
  activeTab: string
  onSelect: (key: string) => void
  onWebhookSuccess?: () => void
}

const STATUS_TEXT: Record<string, string> = {
  loading: 'กำลังประมวลผล…',
  success: 'สำเร็จ ✓',
  error: 'เกิดข้อผิดพลาด ✗',
}

export function Header({ activeTab, onSelect, onWebhookSuccess }: HeaderProps) {
  const { status, message, trigger } = useWebhookTrigger({
    onSuccess: onWebhookSuccess,
  })
  const isLoading = status === 'loading'

  return (
    <header className="header">
      <div className="header__row">
        <div className="header__brand">
          <h1 className="header__title">🍜 Food Ranking</h1>
          <p className="header__subtitle">Top-rated restaurants by neighborhood</p>
        </div>

        <div className="header__action">
          <button
            type="button"
            className="action-btn"
            disabled={isLoading || true}
            onClick={() => trigger({ location: activeTab })}
          >
            {isLoading && <span className="action-btn__spinner" aria-hidden />}
            {isLoading ? 'กำลังประมวลผล…' : '⚡ เรียกใช้ Workflow'}
          </button>

          {status !== 'idle' && (
            <span
              className={`action-status action-status--${status}`}
              role="status"
              title={status === 'error' ? message : undefined}
            >
              {STATUS_TEXT[status]}
            </span>
          )}
        </div>
      </div>

      <nav className="tabs" aria-label="Locations">
        {LOCATIONS.map((loc) => (
          <button
            key={loc.key}
            type="button"
            className={`tab ${activeTab === loc.key ? 'tab--active' : ''}`}
            aria-current={activeTab === loc.key ? 'page' : undefined}
            onClick={() => onSelect(loc.key)}
          >
            {loc.label}
          </button>
        ))}
      </nav>
    </header>
  )
}
