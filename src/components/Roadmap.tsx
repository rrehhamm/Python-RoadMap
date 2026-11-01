import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { layoutStages } from '../lib/layout'
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from '../motion/gsap'
import { tally } from '../lib/progress'
import { useRoadmap } from '../state/roadmap'
import { StageCard } from './StageCard'
import { PracticeRail } from './PracticeRail'

interface EdgePath {
  key: string
  d: string
  kind: 'stage' | 'stage-done' | 'prereq' | 'dependent'
}

const GRAPH_MIN_WIDTH = 761 // below this the roadmap is a vertical list

export function Roadmap() {
  const { index, progress, hoveredId } = useRoadmap()
  const { placements, columns } = useMemo(() => layoutStages(index), [index])
  const containerRef = useRef<HTMLDivElement>(null)
  const [paths, setPaths] = useState<EdgePath[]>([])
  const [size, setSize] = useState({ w: 0, h: 0 })

  const placementOf = useMemo(() => new Map(placements.map((p) => [p.stageId, p])), [placements])
  const stageDone = useCallback(
    (id: string) => {
      const t = tally(progress, index.topicsByStage.get(id)!)
      return t.completed === t.total
    },
    [index, progress],
  )

  const compute = useCallback(() => {
    const c = containerRef.current
    if (!c) return
    const cr = c.getBoundingClientRect()
    const next: EdgePath[] = []
    if (window.innerWidth >= GRAPH_MIN_WIDTH) {
      const rect = (el: Element) => {
        const r = el.getBoundingClientRect()
        return { l: r.left - cr.left, r: r.right - cr.left, t: r.top - cr.top, b: r.bottom - cr.top, cx: r.left - cr.left + r.width / 2, cy: r.top - cr.top + r.height / 2 }
      }
      const stageEl = (id: string) => c.querySelector(`[data-stage-id="${id}"]`)
      const gap = parseFloat(getComputedStyle(c).getPropertyValue('--graph-gap')) || 40

      for (const e of index.stageEdges) {
        const a = stageEl(e.from)
        const b = stageEl(e.to)
        if (!a || !b) continue
        const s = rect(a)
        const t = rect(b)
        const pa = placementOf.get(e.from)!
        const pb = placementOf.get(e.to)!
        let d: string
        if (pb.row - pa.row > 1) {
          // Long edge: route down the gutter beside the source column so it never runs behind a card.
          const right = pa.col < columns - 1 && pb.col >= pa.col
          const gx = right ? s.r + gap / 2 : s.l - gap / 2
          const y1 = s.b + 18
          const y2 = t.t - 18
          d = `M${s.cx},${s.b} C${s.cx},${y1} ${gx},${s.b} ${gx},${y1 + 12} L${gx},${y2 - 12} C${gx},${t.t} ${t.cx},${y2} ${t.cx},${t.t}`
        } else {
          const dy = Math.max(20, (t.t - s.b) / 2)
          d = `M${s.cx},${s.b} C${s.cx},${s.b + dy} ${t.cx},${t.t - dy} ${t.cx},${t.t}`
        }
        next.push({ key: `${e.from}>${e.to}`, d, kind: stageDone(e.from) ? 'stage-done' : 'stage' })
      }

      // Topic-level connections for the hovered/focused topic.
      const focus = hoveredId ? index.topicById.get(hoveredId) : null
      const target = focus ? c.querySelector(`[data-topic-id="${focus.id}"]`) : null
      if (focus && target) {
        const endpoint = (id: string) => c.querySelector(`[data-topic-id="${id}"]`) ?? stageEl(index.topicById.get(id)!.stageId)
        const link = (fromId: string, toEl: Element, fromEl: Element, kind: EdgePath['kind']) => {
          const s = rect(fromEl)
          const t = rect(toEl)
          let d: string
          if (t.cx - s.cx > 60) d = `M${s.r},${s.cy} C${s.r + 50},${s.cy} ${t.l - 50},${t.cy} ${t.l},${t.cy}`
          else if (s.cx - t.cx > 60) d = `M${s.l},${s.cy} C${s.l - 50},${s.cy} ${t.r + 50},${t.cy} ${t.r},${t.cy}`
          else {
            const bulge = Math.min(70, 18 + Math.abs(t.cy - s.cy) / 6)
            d = `M${s.l},${s.cy} C${s.l - bulge},${s.cy} ${t.l - bulge},${t.cy} ${t.l},${t.cy}`
          }
          next.push({ key: `${kind}:${fromId}`, d, kind })
        }
        for (const p of focus.prerequisites) {
          const el = endpoint(p)
          if (el) link(p, target, el, 'prereq')
        }
        for (const dep of index.dependents.get(focus.id)!) {
          const el = c.querySelector(`[data-topic-id="${dep}"]`)
          if (el) link(dep, el, target, 'dependent')
        }
      }
    }
    setSize((prev) => (prev.w === c.scrollWidth && prev.h === c.scrollHeight ? prev : { w: c.scrollWidth, h: c.scrollHeight }))
    setPaths((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next))
  }, [index, placementOf, columns, hoveredId, stageDone])

  // Recompute after every render (cards expand, filters change) and on resize.
  useLayoutEffect(() => {
    compute()
  })
  useEffect(() => {
    const c = containerRef.current
    if (!c) return
    const ro = new ResizeObserver(() => compute())
    ro.observe(c)
    window.addEventListener('resize', compute)
    document.fonts?.ready.then(compute).catch(() => {})
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', compute)
    }
  }, [compute])

  // Stage cards fade in as they scroll into view. Opacity only: the SVG edges
  // are measured from card positions, so moving the cards would misplace them.
  useGSAP(
    () => {
      const c = containerRef.current
      if (!c || prefersReducedMotion()) return
      const cards = gsap.utils.toArray<HTMLElement>('.cell, .rail', c)
      gsap.set(cards, { opacity: 0 })
      gsap.from('.edges', { opacity: 0, duration: 0.8, delay: 0.5 })
      ScrollTrigger.batch(cards, {
        start: 'top 92%',
        once: true,
        onEnter: (els) => gsap.to(els, { opacity: 1, duration: 0.5, ease: 'power1.out', stagger: 0.07, overwrite: true }),
      })
      // Cards grow and shrink as stages expand, so keep trigger positions fresh.
      let raf = 0
      const ro = new ResizeObserver(() => {
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(() => ScrollTrigger.refresh())
      })
      ro.observe(c)
      return () => {
        cancelAnimationFrame(raf)
        ro.disconnect()
      }
    },
    { scope: containerRef },
  )

  const requiresOf = (stageId: string) =>
    index.stageEdges.filter((e) => e.to === stageId).map((e) => index.stageById.get(e.from)!)

  const ordered = [...placements].sort((a, b) => a.row - b.row || a.col - b.col)

  return (
    <div className="roadmap" ref={containerRef}>
      <svg className="edges" width={size.w} height={size.h} aria-hidden="true">
        <defs>
          <marker id="arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L8,4 L0,8 z" className="arrow-head" />
          </marker>
        </defs>
        {paths.map((p) => (
          <path key={p.key} d={p.d} className={`edge edge--${p.kind}`} markerEnd={p.kind.startsWith('stage') ? 'url(#arrow)' : undefined} />
        ))}
      </svg>

      <div className="graph" style={{ ['--cols' as string]: columns }} aria-label="Main learning path">
        {ordered.map((p) => (
          <div key={p.stageId} className="cell" style={{ gridRow: p.row + 1, gridColumn: p.col + 1 }}>
            <StageCard stage={index.stageById.get(p.stageId)!} requires={requiresOf(p.stageId)} />
          </div>
        ))}
      </div>

      <PracticeRail />
    </div>
  )
}
