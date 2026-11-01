import { beforeEach, describe, expect, it } from 'vitest'
import { CURRICULUM } from '../data/curriculum'
import { buildIndex, validateCurriculum } from '../lib/graph'
import {
  EMPTY_PROGRESS,
  availabilityOf,
  currentStageId,
  recommend,
  tally,
  type ProgressState,
} from '../lib/progress'
import { createLocalStorageRepository, sanitize } from '../lib/storage'
import { progressReducer } from '../hooks/useProgress'

const index = buildIndex(CURRICULUM)
const t = (id: string) => index.topicById.get(id)!
const withStatuses = (s: ProgressState['statuses']): ProgressState => ({ statuses: s, checklist: {} })
const completeAll = (pred: (id: string) => boolean): ProgressState =>
  withStatuses(Object.fromEntries(index.topics.filter((x) => pred(x.id)).map((x) => [x.id, 'completed'])))

describe('curriculum data', () => {
  it('is valid: unique ids, known prerequisites, no cycles', () => {
    expect(validateCurriculum(CURRICULUM)).toEqual([])
  })

  it('covers all 12 stages with the requested topics', () => {
    expect(index.stages).toHaveLength(12)
    expect(index.topics.length).toBeGreaterThanOrEqual(110)
    for (const s of index.stages) expect(index.topicsByStage.get(s.id)!.length).toBeGreaterThan(0)
  })

  it('gives every topic distinct, non-placeholder content', () => {
    const descriptions = new Set(index.topics.map((x) => x.description))
    expect(descriptions.size).toBe(index.topics.length)
    for (const x of index.topics) {
      expect(x.objectives.length, x.id).toBeGreaterThan(0)
      expect(x.exercises.length, x.id).toBeGreaterThan(0)
    }
  })

  it('uses only https links on known hosts', () => {
    const hosts = new Set(['docs.python.org', 'cp-algorithms.com', 'usaco.guide', 'codeforces.com', 'cses.fi', 'pythontutor.com'])
    for (const x of index.topics) {
      for (const u of [...x.resources.map((r) => r.url), ...x.exercises.flatMap((e) => (e.url ? [e.url] : []))]) {
        const url = new URL(u)
        expect(url.protocol).toBe('https:')
        expect(hosts.has(url.hostname), u).toBe(true)
      }
    }
  })

  it('derives the stage graph described in the brief', () => {
    const edges = index.stageEdges.map((e) => `${e.from}>${e.to}`).sort()
    expect(edges).toContain('fundamentals>loops')
    expect(edges).toContain('loops>lists')
    expect(edges).toContain('lists>problem-solving')
    for (const s of ['strings', 'math', 'hashing']) expect(edges).toContain(`problem-solving>${s}`)
    expect(edges).toContain('hashing>search-sort')
    expect(edges).toContain('algorithms>advanced')
    expect(index.tiers[0]).toEqual(['fundamentals'])
    expect(index.tiers.find((r) => r.includes('strings'))).toEqual(['strings', 'math', 'hashing'])
    // the practice track is not part of the main graph
    expect(index.tiers.flat()).not.toContain('codeforces')
  })
})

describe('availability and locking', () => {
  it('starts with only root topics available', () => {
    const avail = index.topics.filter((x) => availabilityOf(index, EMPTY_PROGRESS, x) === 'available').map((x) => x.id)
    expect(avail).toEqual(['f-print-input'])
  })

  it('unlocks a topic once all of its prerequisites are complete', () => {
    expect(availabilityOf(index, EMPTY_PROGRESS, t('f-variables'))).toBe('locked')
    const s = withStatuses({ 'f-print-input': 'completed' })
    expect(availabilityOf(index, s, t('f-variables'))).toBe('available')
    // in-progress prerequisites do not unlock
    const s2 = withStatuses({ 'f-print-input': 'in_progress' })
    expect(availabilityOf(index, s2, t('f-variables'))).toBe('locked')
  })

  it('shows learner-set status even when prerequisites are incomplete', () => {
    const s = withStatuses({ 'g-bfs': 'in_progress' })
    expect(availabilityOf(index, s, t('g-bfs'))).toBe('in_progress')
  })
})

describe('progress tally', () => {
  it('is computed from statuses', () => {
    const stage1 = index.topicsByStage.get('fundamentals')!
    const s = withStatuses({ 'f-print-input': 'completed', 'f-variables': 'completed', 'f-split': 'in_progress' })
    expect(tally(s, stage1)).toEqual({ total: 10, completed: 2, inProgress: 1, percent: 20 })
    expect(tally(s, index.topics).completed).toBe(2)
    expect(tally(completeAll(() => true), index.topics).percent).toBe(100)
  })
})

describe('recommendation', () => {
  it('recommends the first topic on a fresh start', () => {
    const r = recommend(index, EMPTY_PROGRESS)
    expect(r.primary?.id).toBe('f-print-input')
    expect(r.reason).toBe('next')
  })

  it('prefers continuing an unlocked in-progress topic', () => {
    const s = withStatuses({ 'f-print-input': 'completed', 'f-variables': 'in_progress' })
    const r = recommend(index, s)
    expect(r.primary?.id).toBe('f-variables')
    expect(r.reason).toBe('continue')
  })

  it('never recommends a locked topic, even if it was started', () => {
    const s = withStatuses({ 'f-print-input': 'completed', 'g-dp-intro': 'in_progress' })
    const r = recommend(index, s, 50)
    const ids = [r.primary!, ...r.alternatives].map((x) => x.id)
    expect(ids).not.toContain('g-dp-intro')
    for (const id of ids) {
      for (const p of t(id).prerequisites) expect(s.statuses[p]).toBe('completed')
    }
  })

  it('introduces Codeforces practice early', () => {
    const s = completeAll((id) => id.startsWith('f-'))
    const r = recommend(index, s, 20)
    expect([r.primary!, ...r.alternatives].map((x) => x.id)).toContain('cf-beginner')
  })

  it('reports done when everything is complete', () => {
    expect(recommend(index, completeAll(() => true)).reason).toBe('done')
  })

  it('tracks the current stage', () => {
    expect(currentStageId(index, EMPTY_PROGRESS)).toBe('fundamentals')
    const s = completeAll((id) => id.startsWith('f-') || id.startsWith('l-'))
    expect(currentStageId(index, s)).toBe('lists')
  })
})

describe('reducer', () => {
  it('sets and clears statuses', () => {
    let s = progressReducer(EMPTY_PROGRESS, { type: 'setStatus', topicId: 'f-split', status: 'completed' })
    expect(s.statuses['f-split']).toBe('completed')
    s = progressReducer(s, { type: 'setStatus', topicId: 'f-split', status: 'not_started' })
    expect(s.statuses).not.toHaveProperty('f-split')
  })

  it('marks a topic in progress when its first checklist item is ticked', () => {
    let s = progressReducer(EMPTY_PROGRESS, { type: 'toggleCheck', topicId: 'f-map', itemId: 'o0' })
    expect(s.statuses['f-map']).toBe('in_progress')
    expect(s.checklist['f-map']).toEqual(['o0'])
    s = progressReducer(s, { type: 'toggleCheck', topicId: 'f-map', itemId: 'o0' })
    expect(s.checklist['f-map']).toEqual([])
  })
})

describe('localStorage repository', () => {
  beforeEach(() => localStorage.clear())

  it('round-trips progress', () => {
    const repo = createLocalStorageRepository('test-key')
    const s: ProgressState = { statuses: { 'f-split': 'completed' }, checklist: { 'f-split': ['o0', 'e1'] } }
    repo.save(s)
    expect(createLocalStorageRepository('test-key').load()).toEqual(s)
  })

  it('survives corrupt or foreign data', () => {
    localStorage.setItem('test-key', '{not json')
    expect(createLocalStorageRepository('test-key').load()).toEqual(EMPTY_PROGRESS)
    localStorage.setItem('test-key', JSON.stringify({ version: 999, progress: {} }))
    expect(createLocalStorageRepository('test-key').load()).toEqual(EMPTY_PROGRESS)
  })

  it('drops unknown ids and invalid statuses', () => {
    const known = new Set(['a'])
    expect(sanitize({ statuses: { a: 'completed', b: 'completed', c: 'bogus' }, checklist: { a: ['o0', 3] } }, known)).toEqual({
      statuses: { a: 'completed' },
      checklist: { a: ['o0'] },
    })
  })
})
