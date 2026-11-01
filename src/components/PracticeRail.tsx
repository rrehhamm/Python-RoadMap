import { tally } from '../lib/progress'
import { useRoadmap } from '../state/roadmap'
import { TopicRow } from './StageCard'

/**
 * Practice track (Codeforces). Shown beside the main graph because it runs in
 * parallel with every stage; each milestone notes which stages it pairs with.
 */
export function PracticeRail() {
  const { index, progress, filtering, matches } = useRoadmap()
  const stage = index.stages.find((s) => s.track === 'practice')
  if (!stage) return null
  const topics = index.topicsByStage.get(stage.id)!
  const visible = filtering ? topics.filter(matches) : topics
  const t = tally(progress, topics)

  return (
    <aside className="rail" aria-labelledby="rail-title">
      <section className={`stage stage--practice${filtering && !visible.length ? ' stage--dim' : ''}`} data-stage-id={stage.id}>
        <header className="stage-head">
          <div className="stage-toggle stage-toggle--static">
            <span className="stage-num mono">{String(stage.number).padStart(2, '0')}</span>
            <span className="stage-titles">
              <span className="stage-title" id="rail-title">
                {stage.title}
              </span>
              <span className="stage-summary">{stage.summary}</span>
            </span>
          </div>
          <div className="stage-meta">
            <span className="badge">Parallel track</span>
            <span className="mono small muted" aria-label={`${t.completed} of ${t.total} milestones completed`}>
              {t.completed}/{t.total}
            </span>
            <div className="bar" aria-hidden="true">
              <span className="bar-fill" style={{ width: `${t.percent}%` }} />
            </div>
          </div>
        </header>
        <ol className="topics topics--rail">
          {visible.map((topic) => {
            const links = index.practiceLinks.get(topic.id) ?? []
            return (
              <li key={topic.id} className="rail-item">
                <ul className="topics topics--bare">
                  <TopicRow topic={topic} />
                </ul>
                {links.length > 0 && (
                  <p className="rail-pairs small muted">
                    Pairs with{' '}
                    {links
                      .map((id) => index.stageById.get(id)!)
                      .sort((a, b) => a.number - b.number)
                      .map((s) => s.title)
                      .join(' · ')}
                  </p>
                )}
              </li>
            )
          })}
          {!visible.length && <li className="topics-empty small muted">No matching milestones</li>}
        </ol>
      </section>
    </aside>
  )
}
