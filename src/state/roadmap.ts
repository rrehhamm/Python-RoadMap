import { createContext, useContext } from 'react'
import { CURRICULUM } from '../data/curriculum'
import type { Topic, TopicStatus } from '../data/types'
import { buildIndex, type RoadmapIndex } from '../lib/graph'
import type { Availability, ProgressState } from '../lib/progress'

export type StatusFilter = 'all' | TopicStatus

export const INDEX: RoadmapIndex = buildIndex(CURRICULUM)

export interface Ctx {
  index: RoadmapIndex
  progress: ProgressState
  setStatus: (id: string, s: TopicStatus) => void
  toggleCheck: (id: string, item: string) => void
  resetProgress: () => void
  availability: (t: Topic) => Availability
  currentStage: string | null

  selectedId: string | null
  openTopic: (id: string, opener?: HTMLElement | null) => void
  closeTopic: () => void

  hoveredId: string | null
  setHoveredId: (id: string | null) => void

  filter: StatusFilter
  setFilter: (f: StatusFilter) => void
  query: string
  setQuery: (q: string) => void
  filtering: boolean
  matches: (t: Topic) => boolean

  isExpanded: (stageId: string) => boolean
  toggleStage: (stageId: string) => void
  setAllExpanded: (open: boolean) => void
}

export const RoadmapCtx = createContext<Ctx | null>(null)

export function useRoadmap(): Ctx {
  const ctx = useContext(RoadmapCtx)
  if (!ctx) throw new Error('useRoadmap must be used inside RoadmapProvider')
  return ctx
}
