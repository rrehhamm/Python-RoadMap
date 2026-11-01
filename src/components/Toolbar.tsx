import { useMemo, useState } from 'react'
import { statusOf } from '../lib/progress'
import { useRoadmap, type StatusFilter } from '../state/roadmap'
import { StatusIcon } from './StatusIcon'

const FILTERS: Array<{ value: StatusFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'completed', label: 'Completed' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'not_started', label: 'Not started' },
]

export function Toolbar() {
  const { index, progress, filter, setFilter, query, setQuery, filtering, matches, setAllExpanded, resetProgress } = useRoadmap()

  const counts = useMemo(() => {
    const c: Record<StatusFilter, number> = { all: index.topics.length, completed: 0, in_progress: 0, not_started: 0 }
    for (const t of index.topics) c[statusOf(progress, t)]++
    return c
  }, [index, progress])

  const [confirming, setConfirming] = useState(false)
  const matchCount = filtering ? index.topics.filter(matches).length : null

  return (
    <div className="toolbar" role="region" aria-label="Filter roadmap">
      <div className="seg" role="radiogroup" aria-label="Filter by status">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            role="radio"
            aria-checked={filter === f.value}
            className="seg-btn"
            onClick={() => setFilter(f.value)}
          >
            {f.label}
            <span className="seg-count">{counts[f.value]}</span>
          </button>
        ))}
      </div>

      <label className="search">
        <span className="sr-only">Search topics</span>
        <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          placeholder="Search topics…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Escape' && setQuery('')}
        />
      </label>

      <div className="toolbar-end">
        {matchCount !== null && (
          <span className="muted small" role="status" data-testid="match-count">
            {matchCount} {matchCount === 1 ? 'topic matches' : 'topics match'}
          </span>
        )}
        {!filtering && (
          <>
            <button type="button" className="btn btn--ghost" onClick={() => setAllExpanded(true)}>
              Expand all
            </button>
            <button type="button" className="btn btn--ghost" onClick={() => setAllExpanded(false)}>
              Collapse all
            </button>
          </>
        )}
        {confirming ? (
          <span className="confirm" role="group" aria-label="Confirm reset">
            <span className="small">Clear all progress?</span>
            <button
              type="button"
              className="btn btn--danger-solid"
              onClick={() => {
                resetProgress()
                setConfirming(false)
              }}
            >
              Reset
            </button>
            <button type="button" className="btn" onClick={() => setConfirming(false)} autoFocus>
              Cancel
            </button>
          </span>
        ) : (
          <button type="button" className="btn btn--ghost btn--danger" onClick={() => setConfirming(true)}>
            Reset
          </button>
        )}
      </div>

      <ul className="legend" aria-label="Status legend">
        {(['completed', 'in_progress', 'available', 'locked'] as const).map((s) => (
          <li key={s}>
            <StatusIcon status={s} size={13} />
            {s === 'in_progress' ? 'In progress' : s === 'locked' ? 'Locked (prerequisites incomplete)' : s[0].toUpperCase() + s.slice(1)}
          </li>
        ))}
      </ul>
    </div>
  )
}
