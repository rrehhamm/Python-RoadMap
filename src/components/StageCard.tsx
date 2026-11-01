import { useRef } from 'react'
import type { Stage, Topic } from '../data/types'
import { tally } from '../lib/progress'
import { gsap, prefersReducedMotion, useGSAP } from '../motion/gsap'
import { useRoadmap } from '../state/roadmap'
import { StatusIcon } from './StatusIcon'
import { AVAILABILITY_LABEL, DIFFICULTY_LABEL, formatMinutes } from './format'

export function StageCard({ stage, requires }: { stage: Stage; requires: Stage[] }) {
  const { index, progress, currentStage, isExpanded, toggleStage, filtering, matches } = useRoadmap()
  const topics = index.topicsByStage.get(stage.id)!
  const t = tally(progress, topics)
  const open = isExpanded(stage.id)
  const visible = filtering ? topics.filter(matches) : topics
  const isCurrent = currentStage === stage.id
  const done = t.completed === t.total
  const bodyId = `stage-body-${stage.id}`
  const listRef = useRef<HTMLUListElement>(null)
  const userOpened = useRef(false)

  // Rows cascade in only when the user opens the stage themselves.
  useGSAP(
    () => {
      if (!open || !userOpened.current || !listRef.current || prefersReducedMotion()) return
      userOpened.current = false
      gsap.from(listRef.current.children, { opacity: 0, y: -6, duration: 0.28, ease: 'power2.out', stagger: 0.025, clearProps: 'all' })
    },
    { dependencies: [open] },
  )

  return (
    <section
      className={`stage${isCurrent ? ' stage--current' : ''}${done ? ' stage--done' : ''}${filtering && !visible.length ? ' stage--dim' : ''}`}
      data-stage-id={stage.id}
      aria-labelledby={`stage-title-${stage.id}`}
    >
      <header className="stage-head">
        <button
          type="button"
          className="stage-toggle"
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={() => {
            userOpened.current = !open
            toggleStage(stage.id)
          }}
          disabled={filtering}
        >
          <span className="stage-num mono">{String(stage.number).padStart(2, '0')}</span>
          <span className="stage-titles">
            <span className="stage-title" id={`stage-title-${stage.id}`}>
              {stage.title}
            </span>
            <span className="stage-summary">{stage.summary}</span>
          </span>
          <span className="stage-chev" aria-hidden="true" />
        </button>
        <div className="stage-meta">
          {isCurrent && <span className="badge badge--current">Current</span>}
          {done && <span className="badge badge--done">Done</span>}
          <span className="mono small muted" aria-label={`${t.completed} of ${t.total} topics completed`}>
            {t.completed}/{t.total}
          </span>
          <div className="bar" aria-hidden="true">
            <span className="bar-fill" style={{ width: `${t.percent}%` }} />
          </div>
        </div>
        {!open && <Pips topics={topics} />}
        {requires.length > 0 && (
          <p className="stage-requires small">
            <span className="muted">After</span> {requires.map((s) => s.title).join(', ')}
          </p>
        )}
      </header>
      {open && (
        <ul className="topics" id={bodyId} ref={listRef}>
          {visible.map((topic) => (
            <TopicRow key={topic.id} topic={topic} />
          ))}
          {!visible.length && <li className="topics-empty small muted">No matching topics</li>}
        </ul>
      )}
    </section>
  )
}

function Pips({ topics }: { topics: Topic[] }) {
  const { availability } = useRoadmap()
  return (
    <div className="pips" aria-hidden="true">
      {topics.map((t) => (
        <span key={t.id} className={`pip pip--${availability(t)}`} title={t.title} />
      ))}
    </div>
  )
}

export function TopicRow({ topic }: { topic: Topic }) {
  const { index, availability, openTopic, selectedId, hoveredId, setHoveredId } = useRoadmap()
  const a = availability(topic)
  const hovered = hoveredId ? index.topicById.get(hoveredId) : null
  const rel = hovered
    ? hovered.prerequisites.includes(topic.id)
      ? ' row--prereq'
      : topic.prerequisites.includes(hovered.id)
        ? ' row--dependent'
        : ''
    : ''

  return (
    <li>
      <button
        type="button"
        className={`row row--${a}${selectedId === topic.id ? ' row--selected' : ''}${rel}`}
        data-topic-id={topic.id}
        aria-label={`${topic.title} — ${AVAILABILITY_LABEL[a]}, ${DIFFICULTY_LABEL[topic.difficulty]}, about ${formatMinutes(topic.estimatedMinutes)}`}
        aria-current={selectedId === topic.id ? 'true' : undefined}
        onClick={(e) => openTopic(topic.id, e.currentTarget)}
        onMouseEnter={() => setHoveredId(topic.id)}
        onMouseLeave={() => setHoveredId(null)}
        onFocus={() => setHoveredId(topic.id)}
        onBlur={() => setHoveredId(null)}
      >
        <StatusIcon status={a} size={15} />
        <span className="row-title">{topic.title}</span>
        <span className={`diff diff--${topic.difficulty}`} aria-hidden="true">
          {DIFFICULTY_LABEL[topic.difficulty][0]}
        </span>
        <span className="row-min mono" aria-hidden="true">
          {formatMinutes(topic.estimatedMinutes)}
        </span>
      </button>
    </li>
  )
}
