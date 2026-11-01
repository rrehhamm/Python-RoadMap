import type { TopicStatus } from '../data/types'
import { EMPTY_PROGRESS, type ProgressState } from './progress'

/**
 * Persistence boundary. The UI only talks to this interface, so swapping
 * localStorage for a backend means writing one new implementation
 * (load/save can become async-backed by caching + debounced writes).
 */
export interface ProgressRepository {
  load(): ProgressState
  save(state: ProgressState): void
  clear(): void
}

const VERSION = 1
const STATUSES: TopicStatus[] = ['not_started', 'in_progress', 'completed']

interface Envelope {
  version: number
  savedAt: string
  progress: ProgressState
}

/** Accepts unknown JSON and keeps only well-formed entries. */
export function sanitize(raw: unknown, knownIds?: Set<string>): ProgressState {
  if (!raw || typeof raw !== 'object') return { ...EMPTY_PROGRESS }
  const r = raw as Partial<ProgressState>
  const statuses: Record<string, TopicStatus> = {}
  const checklist: Record<string, string[]> = {}
  const keep = (id: string) => !knownIds || knownIds.has(id)
  if (r.statuses && typeof r.statuses === 'object') {
    for (const [id, s] of Object.entries(r.statuses)) {
      if (keep(id) && STATUSES.includes(s as TopicStatus)) statuses[id] = s as TopicStatus
    }
  }
  if (r.checklist && typeof r.checklist === 'object') {
    for (const [id, items] of Object.entries(r.checklist)) {
      if (keep(id) && Array.isArray(items)) checklist[id] = items.filter((x): x is string => typeof x === 'string')
    }
  }
  return { statuses, checklist }
}

export function createLocalStorageRepository(key: string, knownIds?: Set<string>): ProgressRepository {
  const storage = (): Storage | null => {
    try {
      return window.localStorage
    } catch {
      return null
    }
  }
  return {
    load() {
      try {
        const text = storage()?.getItem(key)
        if (!text) return { ...EMPTY_PROGRESS }
        const env = JSON.parse(text) as Partial<Envelope>
        if (env.version !== VERSION) return { ...EMPTY_PROGRESS }
        return sanitize(env.progress, knownIds)
      } catch {
        return { ...EMPTY_PROGRESS }
      }
    },
    save(progress) {
      try {
        const env: Envelope = { version: VERSION, savedAt: new Date().toISOString(), progress }
        storage()?.setItem(key, JSON.stringify(env))
      } catch {
        // Storage full or blocked (private mode): progress stays in memory.
      }
    },
    clear() {
      try {
        storage()?.removeItem(key)
      } catch {
        /* ignore */
      }
    },
  }
}
