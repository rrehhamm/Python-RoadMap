/**
 * Curriculum data model. Everything in src/data is pure data — no React,
 * no persistence — so the curriculum can be edited, tested, or served from
 * a backend without touching the presentation layer.
 */

export type TopicStatus = 'not_started' | 'in_progress' | 'completed'

export type Difficulty = 'easy' | 'medium' | 'hard'

export type ResourceKind = 'docs' | 'article' | 'practice' | 'tool'

export interface Resource {
  label: string
  url: string
  kind: ResourceKind
}

export interface Exercise {
  /** Short instruction the learner can act on. */
  text: string
  /** Optional link to a real judge problem or problem list. */
  url?: string
}

export interface Topic {
  /** Stable identifier — never derived from the title. */
  id: string
  title: string
  stageId: string
  /** One or two sentences explaining the concept. */
  description: string
  /** Topic ids that should be completed first. */
  prerequisites: string[]
  difficulty: Difficulty
  estimatedMinutes: number
  objectives: string[]
  /** Python syntax or idioms worth memorising. Rendered as a code block. */
  syntax?: string
  commonMistakes: string[]
  exercises: Exercise[]
  resources: Resource[]
  defaultStatus: TopicStatus
}

export interface Stage {
  id: string
  /** 1-based number shown in the UI. */
  number: number
  title: string
  summary: string
  /**
   * Practice tracks render in a side rail rather than the main graph.
   * Graph rows and stage-to-stage connections are derived from topic
   * prerequisites (see lib/graph.ts), so they are never hand-maintained.
   */
  track?: 'practice'
}
