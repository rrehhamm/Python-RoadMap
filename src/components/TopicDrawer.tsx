import { useEffect, useRef } from 'react'
import type { ResourceKind, TopicStatus } from '../data/types'
import { checklistItems, missingPrerequisites, statusOf } from '../lib/progress'
import { gsap, prefersReducedMotion, useGSAP } from '../motion/gsap'
import { useRoadmap } from '../state/roadmap'
import { StatusIcon } from './StatusIcon'
import { AVAILABILITY_LABEL, DIFFICULTY_LABEL, formatMinutes } from './format'

const STATUS_OPTIONS: Array<{ value: TopicStatus; label: string }> = [
  { value: 'not_started', label: 'Not started' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
]

const KIND_LABEL: Record<ResourceKind, string> = { docs: 'Docs', article: 'Guide', practice: 'Practice', tool: 'Tool' }

export function TopicDrawer() {
  const { index, progress, selectedId, closeTopic, openTopic, setStatus, toggleCheck, availability } = useRoadmap()
  const panelRef = useRef<HTMLElement>(null)
  const topic = selectedId ? index.topicById.get(selectedId) : null
  const pillRef = useRef<HTMLSpanElement>(null)
  const current = topic ? { id: topic.id, a: availability(topic) } : null
  const prev = useRef(current)

  // A short pop on the status pill when the open topic becomes completed.
  useGSAP(
    () => {
      const was = prev.current
      prev.current = current
      if (!current || !pillRef.current || was?.id !== current.id || was.a === current.a) return
      if (current.a !== 'completed' || prefersReducedMotion()) return
      gsap.fromTo(pillRef.current, { scale: 0.85 }, { scale: 1, duration: 0.45, ease: 'back.out(3)', clearProps: 'transform' })
    },
    { dependencies: [current?.id, current?.a] },
  )

  useEffect(() => {
    if (!topic) return
    panelRef.current?.focus()
    panelRef.current?.scrollTo({ top: 0 })
  }, [topic])

  useEffect(() => {
    if (!topic) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeTopic()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [topic, closeTopic])

  if (!topic) return null

  const stage = index.stageById.get(topic.stageId)!
  const status = statusOf(progress, topic)
  const a = availability(topic)
  const missing = missingPrerequisites(index, progress, topic)
  const items = checklistItems(topic)
  const checked = new Set(progress.checklist[topic.id] ?? [])
  const doneCount = items.filter((i) => checked.has(i.id)).length
  const allChecked = doneCount === items.length
  const dependents = index.dependents.get(topic.id)!.map((id) => index.topicById.get(id)!)
  const titleId = `drawer-title-${topic.id}`

  const chip = (id: string) => {
    const p = index.topicById.get(id)!
    const pa = availability(p)
    return (
      <li key={id}>
        <button type="button" className={`chip chip--topic chip--${pa}`} onClick={() => openTopic(p.id)}>
          <StatusIcon status={pa} size={13} />
          <span>{p.title}</span>
          <span className="sr-only"> ({AVAILABILITY_LABEL[pa]})</span>
        </button>
      </li>
    )
  }

  return (
    <>
      <div className="scrim" onClick={closeTopic} aria-hidden="true" />
      <aside data-lenis-prevent className="drawer" role="dialog" aria-modal="false" aria-labelledby={titleId} ref={panelRef} tabIndex={-1} data-testid="drawer">
        <div className="drawer-top">
          <p className="crumb mono small">
            Stage {String(stage.number).padStart(2, '0')} · {stage.title}
          </p>
          <button type="button" className="icon-btn" onClick={closeTopic} aria-label="Close topic details">
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <h2 className="drawer-title" id={titleId}>
          {topic.title}
        </h2>
        <div className="drawer-meta">
          <span className={`status-pill status-pill--${a}`} ref={pillRef}>
            <StatusIcon status={a} size={13} /> {AVAILABILITY_LABEL[a]}
          </span>
          <span className={`tag diff--${topic.difficulty}`}>{DIFFICULTY_LABEL[topic.difficulty]}</span>
          <span className="tag mono">~{formatMinutes(topic.estimatedMinutes)}</span>
        </div>

        <div className="seg seg--full" role="radiogroup" aria-label="Topic status">
          {STATUS_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={status === o.value}
              className={`seg-btn seg-btn--${o.value}`}
              onClick={() => setStatus(topic.id, o.value)}
            >
              {o.label}
            </button>
          ))}
        </div>

        {missing.length > 0 && (
          <div className="notice" role="note">
            <strong>{status === 'not_started' ? 'Locked:' : 'Heads up:'}</strong> finish{' '}
            {missing.length === 1 ? 'this prerequisite' : `these ${missing.length} prerequisites`} first. You can still read ahead
            {status === 'not_started' ? ' or start early.' : '.'}
            <ul className="chips">
              {missing.map((p) => chip(p.id))}
            </ul>
          </div>
        )}

        <p className="drawer-desc">{topic.description}</p>

        <section className="dsec" aria-labelledby="sec-check">
          <div className="dsec-head">
            <h3 id="sec-check">Completion checklist</h3>
            <span className="mono small muted" data-testid="checklist-count">
              {doneCount}/{items.length}
            </span>
          </div>
          <div className="bar" aria-hidden="true">
            <span className="bar-fill" style={{ width: `${(doneCount / items.length) * 100}%` }} />
          </div>
          {allChecked && status !== 'completed' && (
            <button type="button" className="btn btn--primary btn--block" onClick={() => setStatus(topic.id, 'completed')}>
              Everything checked — mark as completed
            </button>
          )}
          <h4 className="dsub">Learning objectives</h4>
          <ul className="checks">
            {items
              .filter((i) => i.kind === 'objective')
              .map((i) => (
                <li key={i.id}>
                  <label className="check">
                    <input type="checkbox" checked={checked.has(i.id)} onChange={() => toggleCheck(topic.id, i.id)} />
                    <span>{i.label}</span>
                  </label>
                </li>
              ))}
          </ul>
          <h4 className="dsub">Practice exercises</h4>
          <ul className="checks">
            {topic.exercises.map((e, n) => {
              const id = `e${n}`
              return (
                <li key={id}>
                  <label className="check">
                    <input type="checkbox" checked={checked.has(id)} onChange={() => toggleCheck(topic.id, id)} />
                    <span>{e.text}</span>
                  </label>
                  {e.url && (
                    <a className="ext small" href={e.url} target="_blank" rel="noreferrer">
                      Open problem<span className="sr-only"> (opens in a new tab)</span> ↗
                    </a>
                  )}
                </li>
              )
            })}
          </ul>
        </section>

        {topic.syntax && (
          <section className="dsec" aria-labelledby="sec-syntax">
            <h3 id="sec-syntax">Key syntax &amp; patterns</h3>
            <pre className="code" tabIndex={0}>
              <code>{topic.syntax}</code>
            </pre>
          </section>
        )}

        {topic.commonMistakes.length > 0 && (
          <section className="dsec" aria-labelledby="sec-mistakes">
            <h3 id="sec-mistakes">Common mistakes</h3>
            <ul className="bullets">
              {topic.commonMistakes.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </section>
        )}

        <section className="dsec" aria-labelledby="sec-prereq">
          <h3 id="sec-prereq">Prerequisites</h3>
          {topic.prerequisites.length ? (
            <ul className="chips">
              {topic.prerequisites.map((id) => (
                chip(id)
              ))}
            </ul>
          ) : (
            <p className="muted small">None — a good place to start.</p>
          )}
          {dependents.length > 0 && (
            <>
              <h4 className="dsub">Unlocks</h4>
              <ul className="chips">
                {dependents.map((d) => (
                  chip(d.id)
                ))}
              </ul>
            </>
          )}
        </section>

        {topic.resources.length > 0 && (
          <section className="dsec" aria-labelledby="sec-res">
            <h3 id="sec-res">Resources</h3>
            <ul className="resources">
              {topic.resources.map((r) => (
                <li key={r.url}>
                  <a href={r.url} target="_blank" rel="noreferrer">
                    <span className={`kind kind--${r.kind}`}>{KIND_LABEL[r.kind]}</span>
                    <span>{r.label}</span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </aside>
    </>
  )
}
