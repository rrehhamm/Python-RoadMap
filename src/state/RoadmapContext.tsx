import { useCallback, useMemo, useState, type ReactNode } from 'react'
import type { Topic } from '../data/types'
import { useProgress } from '../hooks/useProgress'
import { availabilityOf, currentStageId, statusOf } from '../lib/progress'
import { createLocalStorageRepository, type ProgressRepository } from '../lib/storage'
import { INDEX, RoadmapCtx, type Ctx, type StatusFilter } from './roadmap'

const defaultRepo = createLocalStorageRepository('cp-roadmap:progress', new Set(INDEX.topics.map((t) => t.id)))

const UI_KEY = 'cp-roadmap:ui'
function loadExpanded(): Set<string> | null {
  try {
    const raw = localStorage.getItem(UI_KEY)
    const parsed = raw ? (JSON.parse(raw) as { expanded?: unknown }) : null
    return Array.isArray(parsed?.expanded) ? new Set(parsed.expanded.filter((x): x is string => typeof x === 'string')) : null
  } catch {
    return null
  }
}
function saveExpanded(s: Set<string>) {
  try {
    localStorage.setItem(UI_KEY, JSON.stringify({ expanded: [...s] }))
  } catch {
    /* ignore */
  }
}

let lastOpener: HTMLElement | null = null

export function RoadmapProvider({ children, repo = defaultRepo }: { children: ReactNode; repo?: ProgressRepository }) {
  const index = INDEX
  const { state, setStatus, toggleCheck, reset } = useProgress(repo)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [query, setQuery] = useState('')

  const currentStage = useMemo(() => currentStageId(index, state), [index, state])

  // Default: expand the current stage plus any stage with work in it.
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const saved = loadExpanded()
    if (saved) return saved
    const s = new Set<string>()
    const cur = currentStageId(index, state)
    if (cur) s.add(cur)
    for (const t of index.topics) if (statusOf(state, t) !== 'not_started') s.add(t.stageId)
    s.add('codeforces')
    return s
  })

  const updateExpanded = useCallback((fn: (s: Set<string>) => Set<string>) => {
    setExpanded((prev) => {
      const next = fn(new Set(prev))
      saveExpanded(next)
      return next
    })
  }, [])

  const q = query.trim().toLowerCase()
  const filtering = filter !== 'all' || q.length > 0
  const matches = useCallback(
    (t: Topic) => (filter === 'all' || statusOf(state, t) === filter) && (!q || t.title.toLowerCase().includes(q)),
    [filter, q, state],
  )

  const value: Ctx = {
    index,
    progress: state,
    setStatus,
    toggleCheck,
    resetProgress: reset,
    availability: (t) => availabilityOf(index, state, t),
    currentStage,
    selectedId,
    openTopic: (id, opener) => {
      if (opener) lastOpener = opener
      setSelectedId(id)
    },
    closeTopic: () => {
      setSelectedId(null)
      const el = lastOpener
      lastOpener = null
      if (el?.isConnected) requestAnimationFrame(() => el.focus())
    },
    hoveredId,
    setHoveredId,
    filter,
    setFilter,
    query,
    setQuery,
    filtering,
    matches,
    isExpanded: (id) => (filtering ? index.topicsByStage.get(id)!.some(matches) : expanded.has(id)),
    toggleStage: (id) => updateExpanded((s) => (s.has(id) ? (s.delete(id), s) : s.add(id))),
    setAllExpanded: (open) => updateExpanded(() => (open ? new Set(index.stages.map((s) => s.id)) : new Set())),
  }

  return <RoadmapCtx.Provider value={value}>{children}</RoadmapCtx.Provider>
}

