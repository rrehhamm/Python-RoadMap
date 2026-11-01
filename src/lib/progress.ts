import type { Topic, TopicStatus } from '../data/types'
import type { RoadmapIndex } from './graph'

/** Everything the learner has changed. This is the only persisted state. */
export interface ProgressState {
  statuses: Record<string, TopicStatus>
  /** Checked checklist item ids per topic (see checklistItems). */
  checklist: Record<string, string[]>
}

export const EMPTY_PROGRESS: ProgressState = { statuses: {}, checklist: {} }

/** What the UI shows: learner status, or whether an untouched topic is reachable. */
export type Availability = 'completed' | 'in_progress' | 'available' | 'locked'

export function statusOf(state: ProgressState, topic: Topic): TopicStatus {
  return state.statuses[topic.id] ?? topic.defaultStatus
}

export function missingPrerequisites(index: RoadmapIndex, state: ProgressState, topic: Topic): Topic[] {
  return topic.prerequisites
    .map((id) => index.topicById.get(id)!)
    .filter((p) => statusOf(state, p) !== 'completed')
}

export function isUnlocked(index: RoadmapIndex, state: ProgressState, topic: Topic): boolean {
  return missingPrerequisites(index, state, topic).length === 0
}

/**
 * Display state. Learner-set status always wins, so a topic started early
 * shows as in progress; only untouched topics can be "locked".
 */
export function availabilityOf(index: RoadmapIndex, state: ProgressState, topic: Topic): Availability {
  const s = statusOf(state, topic)
  if (s !== 'not_started') return s
  return isUnlocked(index, state, topic) ? 'available' : 'locked'
}

export interface ChecklistItem {
  id: string
  label: string
  kind: 'objective' | 'exercise'
}

export function checklistItems(topic: Topic): ChecklistItem[] {
  return [
    ...topic.objectives.map((label, i) => ({ id: `o${i}`, label, kind: 'objective' as const })),
    ...topic.exercises.map((e, i) => ({ id: `e${i}`, label: e.text, kind: 'exercise' as const })),
  ]
}

export interface Tally {
  total: number
  completed: number
  inProgress: number
  percent: number
}

export function tally(state: ProgressState, topics: Topic[]): Tally {
  let completed = 0
  let inProgress = 0
  for (const t of topics) {
    const s = statusOf(state, t)
    if (s === 'completed') completed++
    else if (s === 'in_progress') inProgress++
  }
  const total = topics.length
  return { total, completed, inProgress, percent: total ? Math.round((completed / total) * 100) : 0 }
}

const byCurriculum = (index: RoadmapIndex) => (a: Topic, b: Topic) =>
  index.depth.get(a.id)! - index.depth.get(b.id)! || index.order.get(a.id)! - index.order.get(b.id)!

export interface Recommendation {
  /** Best next topic, or null when everything reachable is done. */
  primary: Topic | null
  reason: 'continue' | 'next' | 'done'
  alternatives: Topic[]
}

/**
 * Next topic: finish something already started (if its prerequisites are
 * done), otherwise the shallowest unlocked topic. Locked topics are never
 * recommended.
 */
export function recommend(index: RoadmapIndex, state: ProgressState, count = 3): Recommendation {
  const sort = byCurriculum(index)
  const unlocked = index.topics.filter((t) => isUnlocked(index, state, t))
  const started = unlocked.filter((t) => statusOf(state, t) === 'in_progress').sort(sort)
  const fresh = unlocked.filter((t) => statusOf(state, t) === 'not_started').sort(sort)
  const ranked = [...started, ...fresh]
  if (!ranked.length) return { primary: null, reason: 'done', alternatives: [] }
  return {
    primary: ranked[0],
    reason: started.length ? 'continue' : 'next',
    alternatives: ranked.slice(1, count),
  }
}

/** The main-track stage the learner is working in right now. */
export function currentStageId(index: RoadmapIndex, state: ProgressState): string | null {
  const main = index.topics.filter((t) => index.stageById.get(t.stageId)!.track !== 'practice')
  // Stage order first: the "current stage" is the earliest stage with open work.
  const sort = (a: Topic, b: Topic) => index.order.get(a.id)! - index.order.get(b.id)!
  const started = main.filter((t) => statusOf(state, t) === 'in_progress').sort(sort)
  if (started.length) return started[0].stageId
  const next = main.filter((t) => availabilityOf(index, state, t) === 'available').sort(sort)
  if (next.length) return next[0].stageId
  return null
}
