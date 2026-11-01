import { useCallback, useEffect, useReducer } from 'react'
import type { TopicStatus } from '../data/types'
import { EMPTY_PROGRESS, type ProgressState } from '../lib/progress'
import type { ProgressRepository } from '../lib/storage'

export type ProgressAction =
  | { type: 'setStatus'; topicId: string; status: TopicStatus }
  | { type: 'toggleCheck'; topicId: string; itemId: string }
  | { type: 'replace'; state: ProgressState }
  | { type: 'reset' }

export function progressReducer(state: ProgressState, action: ProgressAction): ProgressState {
  switch (action.type) {
    case 'setStatus': {
      const statuses = { ...state.statuses }
      if (action.status === 'not_started') delete statuses[action.topicId]
      else statuses[action.topicId] = action.status
      return { ...state, statuses }
    }
    case 'toggleCheck': {
      const current = state.checklist[action.topicId] ?? []
      const checked = current.includes(action.itemId)
      const next = checked ? current.filter((i) => i !== action.itemId) : [...current, action.itemId]
      const statuses = { ...state.statuses }
      // Ticking the first item of an untouched topic means you've started it.
      if (!checked && !statuses[action.topicId]) statuses[action.topicId] = 'in_progress'
      return { statuses, checklist: { ...state.checklist, [action.topicId]: next } }
    }
    case 'replace':
      return action.state
    case 'reset':
      return { ...EMPTY_PROGRESS }
  }
}

export function useProgress(repo: ProgressRepository) {
  const [state, dispatch] = useReducer(progressReducer, repo, (r) => r.load())

  useEffect(() => {
    repo.save(state)
  }, [repo, state])

  const setStatus = useCallback((topicId: string, status: TopicStatus) => dispatch({ type: 'setStatus', topicId, status }), [])
  const toggleCheck = useCallback((topicId: string, itemId: string) => dispatch({ type: 'toggleCheck', topicId, itemId }), [])
  const reset = useCallback(() => dispatch({ type: 'reset' }), [])

  return { state, setStatus, toggleCheck, reset }
}
