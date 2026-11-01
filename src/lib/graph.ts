import type { Curriculum } from '../data/curriculum'
import type { Stage, Topic } from '../data/types'

/**
 * Pre-computed, read-only view of the curriculum graph. Built once from the
 * data so the UI never hand-maintains layout or connection lists.
 */
export interface RoadmapIndex {
  stages: Stage[]
  topics: Topic[]
  topicById: Map<string, Topic>
  stageById: Map<string, Stage>
  topicsByStage: Map<string, Topic[]>
  /** Topics that list this topic as a prerequisite. */
  dependents: Map<string, string[]>
  /** Longest prerequisite chain length ending at the topic (0 = no prereqs). */
  depth: Map<string, number>
  /** Global curriculum order used as a stable tiebreak. */
  order: Map<string, number>
  /** Stage-level edges after transitive reduction (main track only). */
  stageEdges: Array<{ from: string; to: string }>
  /** Main-track stages grouped into rows that can be studied in parallel. */
  tiers: string[][]
  /** For practice-track topics: the main-track stages their prerequisites come from. */
  practiceLinks: Map<string, string[]>
}

export function validateCurriculum(c: Curriculum): string[] {
  const errors: string[] = []
  const ids = new Set<string>()
  const stageIds = new Set(c.stages.map((s) => s.id))
  for (const t of c.topics) {
    if (ids.has(t.id)) errors.push(`Duplicate topic id: ${t.id}`)
    ids.add(t.id)
    if (!stageIds.has(t.stageId)) errors.push(`Unknown stage ${t.stageId} on ${t.id}`)
  }
  for (const t of c.topics) {
    for (const p of t.prerequisites) if (!ids.has(p)) errors.push(`Unknown prerequisite ${p} on ${t.id}`)
  }
  // cycle check
  const state = new Map<string, 0 | 1 | 2>()
  const byId = new Map(c.topics.map((t) => [t.id, t]))
  const visit = (id: string, path: string[]): void => {
    const s = state.get(id) ?? 0
    if (s === 2) return
    if (s === 1) {
      errors.push(`Cycle: ${[...path, id].join(' → ')}`)
      return
    }
    state.set(id, 1)
    for (const p of byId.get(id)?.prerequisites ?? []) if (byId.has(p)) visit(p, [...path, id])
    state.set(id, 2)
  }
  for (const t of c.topics) visit(t.id, [])
  return errors
}

export function buildIndex(c: Curriculum): RoadmapIndex {
  const errors = validateCurriculum(c)
  if (errors.length) throw new Error(`Invalid curriculum:\n${errors.join('\n')}`)

  const topicById = new Map(c.topics.map((t) => [t.id, t]))
  const stageById = new Map(c.stages.map((s) => [s.id, s]))
  const topicsByStage = new Map<string, Topic[]>(c.stages.map((s) => [s.id, []]))
  const dependents = new Map<string, string[]>(c.topics.map((t) => [t.id, []]))
  for (const t of c.topics) {
    topicsByStage.get(t.stageId)!.push(t)
    for (const p of t.prerequisites) dependents.get(p)!.push(t.id)
  }

  const depth = new Map<string, number>()
  const depthOf = (id: string): number => {
    const cached = depth.get(id)
    if (cached !== undefined) return cached
    const prereqs = topicById.get(id)!.prerequisites
    const d = prereqs.length ? 1 + Math.max(...prereqs.map(depthOf)) : 0
    depth.set(id, d)
    return d
  }
  c.topics.forEach((t) => depthOf(t.id))

  const order = new Map(c.topics.map((t, i) => [t.id, i]))

  // Stage graph from topic prerequisites, main track only.
  const main = c.stages.filter((s) => s.track !== 'practice')
  const mainIds = new Set(main.map((s) => s.id))
  const adj = new Map<string, Set<string>>(main.map((s) => [s.id, new Set()]))
  for (const t of c.topics) {
    if (!mainIds.has(t.stageId)) continue
    for (const p of t.prerequisites) {
      const from = topicById.get(p)!.stageId
      if (from !== t.stageId && mainIds.has(from)) adj.get(from)!.add(t.stageId)
    }
  }
  const reaches = (from: string, to: string, skipDirect: boolean): boolean => {
    const stack = [...adj.get(from)!].filter((n) => !(skipDirect && n === to))
    const seen = new Set<string>()
    while (stack.length) {
      const n = stack.pop()!
      if (n === to) return true
      if (seen.has(n)) continue
      seen.add(n)
      stack.push(...adj.get(n)!)
    }
    return false
  }
  const stageEdges: Array<{ from: string; to: string }> = []
  for (const [from, tos] of adj) for (const to of tos) if (!reaches(from, to, true)) stageEdges.push({ from, to })

  // Tier = longest path in the stage graph.
  const tierOf = new Map<string, number>()
  const tierFn = (id: string): number => {
    if (tierOf.has(id)) return tierOf.get(id)!
    const parents = main.filter((s) => adj.get(s.id)!.has(id)).map((s) => s.id)
    const t = parents.length ? 1 + Math.max(...parents.map(tierFn)) : 0
    tierOf.set(id, t)
    return t
  }
  main.forEach((s) => tierFn(s.id))
  const tiers: string[][] = []
  for (const s of main) (tiers[tierOf.get(s.id)!] ??= []).push(s.id)

  const practiceLinks = new Map<string, string[]>()
  for (const t of c.topics) {
    if (mainIds.has(t.stageId)) continue
    const linked = new Set<string>()
    for (const p of t.prerequisites) {
      const s = topicById.get(p)!.stageId
      if (mainIds.has(s)) linked.add(s)
    }
    practiceLinks.set(t.id, [...linked])
  }

  return {
    stages: c.stages,
    topics: c.topics,
    topicById,
    stageById,
    topicsByStage,
    dependents,
    depth,
    order,
    stageEdges,
    tiers,
    practiceLinks,
  }
}
