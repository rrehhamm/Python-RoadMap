import { useMemo } from 'react'
import { recommend, tally } from '../lib/progress'
import { useRoadmap } from '../state/roadmap'
import { formatMinutes } from './format'
import { StatusIcon } from './StatusIcon'

export function Overview() {
  const { index, progress, currentStage, openTopic, availability } = useRoadmap()
  const overall = useMemo(() => tally(progress, index.topics), [index, progress])
  const rec = useMemo(() => recommend(index, progress, 3), [index, progress])
  const stage = currentStage ? index.stageById.get(currentStage) : null
  const stageTally = stage ? tally(progress, index.topicsByStage.get(stage.id)!) : null

  return (
    <section className="overview" aria-label="Progress overview">
      <div className="ov-progress">
        <div className="ov-figure">
          <span className="ov-percent" data-testid="overall-percent">
            {overall.percent}
            <span className="ov-unit">%</span>
          </span>
          <span className="ov-caption">complete</span>
        </div>
        <div
          className="bar bar--lg"
          role="progressbar"
          aria-label="Overall roadmap progress"
          aria-valuenow={overall.percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span className="bar-fill" style={{ width: `${overall.percent}%` }} />
        </div>
        <dl className="ov-stats">
          <div>
            <dt>Completed</dt>
            <dd data-testid="overall-count">
              {overall.completed} / {overall.total}
            </dd>
          </div>
          <div>
            <dt>In progress</dt>
            <dd>{overall.inProgress}</dd>
          </div>
          <div>
            <dt>Current stage</dt>
            <dd data-testid="current-stage">
              {stage ? (
                <>
                  <span className="mono muted">{String(stage.number).padStart(2, '0')}</span> {stage.title}
                  {stageTally && <span className="muted"> · {stageTally.percent}%</span>}
                </>
              ) : (
                'All main stages done'
              )}
            </dd>
          </div>
        </dl>
      </div>

      <div className="ov-next" data-testid="recommendation">
        <h2 className="eyebrow">{rec.reason === 'continue' ? 'Continue where you left off' : rec.reason === 'next' ? 'Recommended next' : 'Roadmap complete'}</h2>
        {rec.primary ? (
          <>
            <button type="button" className="next-card" onClick={(e) => openTopic(rec.primary!.id, e.currentTarget)}>
              <StatusIcon status={availability(rec.primary)} />
              <span className="next-body">
                <span className="next-title">{rec.primary.title}</span>
                <span className="next-meta">
                  Stage {index.stageById.get(rec.primary.stageId)!.number} · {index.stageById.get(rec.primary.stageId)!.title} ·{' '}
                  {formatMinutes(rec.primary.estimatedMinutes)}
                </span>
              </span>
              <span className="next-go" aria-hidden="true">
                Open →
              </span>
            </button>
            {rec.alternatives.length > 0 && (
              <div className="next-alts">
                <span className="muted">Also unlocked:</span>
                {rec.alternatives.map((t) => (
                  <button key={t.id} type="button" className="chip chip--link" onClick={(e) => openTopic(t.id, e.currentTarget)}>
                    {t.title}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="muted">Every topic is complete. Keep upsolving and run virtual contests to stay sharp.</p>
        )}
      </div>
    </section>
  )
}
