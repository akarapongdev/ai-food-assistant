import { LOCATIONS } from '../config'

interface HeaderProps {
  activeTab: string
  onSelect: (key: string) => void
}

export function Header({ activeTab, onSelect }: HeaderProps) {
  return (
    <header className="header">
      <div className="header__brand">
        <h1 className="header__title">🍜 Food Ranking</h1>
        <p className="header__subtitle">Top-rated restaurants by neighborhood</p>
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
