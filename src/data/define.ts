import type { Topic } from './types'

type TopicInput = Omit<Topic, 'stageId' | 'defaultStatus' | 'resources' | 'commonMistakes'> &
  Partial<Pick<Topic, 'defaultStatus' | 'resources' | 'commonMistakes'>>

/** Builds a stage's topic list, filling in the stage id and defaults. */
export function defineStage(stageId: string, topics: TopicInput[]): Topic[] {
  return topics.map((t) => ({
    defaultStatus: 'not_started',
    resources: [],
    commonMistakes: [],
    ...t,
    stageId,
  }))
}
