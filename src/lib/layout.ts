import type { RoadmapIndex } from './graph'

export interface Placement {
  stageId: string
  row: number
  col: number
}

/**
 * Places main-track stages on a grid: one row per tier, and each stage in
 * the column closest to the average of its parents so edges stay short.
 */
export function layoutStages(index: RoadmapIndex): { placements: Placement[]; columns: number } {
  const columns = Math.max(...index.tiers.map((t) => t.length), 1)
  const center = Math.floor((columns - 1) / 2)
  const colOf = new Map<string, number>()
  const placements: Placement[] = []

  index.tiers.forEach((tier, row) => {
    const taken = new Set<number>()
    const wanted = tier.map((id) => {
      const parents = index.stageEdges.filter((e) => e.to === id).map((e) => colOf.get(e.from)!)
      const ideal = parents.length ? parents.reduce((a, b) => a + b, 0) / parents.length : center
      return { id, ideal }
    })
    // A full row simply fills every column in data order.
    if (tier.length === columns) {
      tier.forEach((id, col) => {
        colOf.set(id, col)
        placements.push({ stageId: id, row, col })
      })
      return
    }
    for (const { id, ideal } of wanted) {
      let best = -1
      for (let c = 0; c < columns; c++) {
        if (taken.has(c)) continue
        if (best === -1 || Math.abs(c - ideal) < Math.abs(best - ideal)) best = c
      }
      taken.add(best)
      colOf.set(id, best)
      placements.push({ stageId: id, row, col: best })
    }
  })
  return { placements, columns }
}
