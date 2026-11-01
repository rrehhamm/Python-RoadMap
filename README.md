# Python → Competitive Programming Roadmap

An interactive, personal learning roadmap: 12 stages and 114 topics from `print()` to Codeforces 1100–1200, core data structures and algorithms. Topics unlock as their prerequisites are completed; a Codeforces practice track runs alongside from day one.

## Run

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build -> dist/
npm run build:single # one self-contained HTML file -> dist-single/index.html
```

Checks: `npm run lint`, `npm run typecheck`, `npm test`.

## How it is organised

```
src/
  data/            pure curriculum data, no React
    types.ts       Topic / Stage model (stable ids, prerequisites, content)
    stages.ts      the 12 stages
    topics/*.ts    one file per stage
    links.ts       resource/link builders (docs, cp-algorithms, USACO, Codeforces)
  lib/
    graph.ts       validates the curriculum; derives stage edges (transitive
                   reduction of topic prerequisites), rows, dependents, depth
    layout.ts      places stages on the desktop grid
    progress.ts    status, lock state, tallies, next-topic recommendation
    storage.ts     ProgressRepository interface + localStorage implementation
  hooks/useProgress.ts   reducer + persistence wiring
  state/           React context for UI state (selection, filters, expansion)
  components/      Overview, Toolbar, Roadmap (SVG edges), StageCard, PracticeRail, TopicDrawer
```

### Editing the curriculum

Add or change topics in `src/data/topics/*.ts`. Stage-to-stage arrows and the graph rows are **computed** from topic prerequisites, so you never edit layout by hand. `npm test` fails on duplicate ids, unknown prerequisites or cycles.

### Progress and persistence

- Only learner changes are stored: `{ statuses: {topicId: status}, checklist: {topicId: itemIds[]} }`.
- Everything shown (percentages, current stage, locks, recommendations) is derived from that state.
- Saved to `localStorage` under `cp-roadmap:progress` with a version envelope; corrupt or unknown entries are discarded on load.
- To move to a backend, implement `ProgressRepository` (`load`, `save`, `clear`) and pass it to `<RoadmapProvider repo={...}>`.

### Locking and recommendations

- A topic is **available** when all its prerequisites are completed, otherwise **locked**. Locks are soft: you can open a locked topic and start it early; a warning lists what's missing.
- **Recommended next**: an in-progress topic whose prerequisites are done; otherwise the unlocked, not-started topic with the shallowest prerequisite chain. Locked topics are never recommended.
- **Current stage**: earliest stage with an in-progress topic, otherwise the earliest stage with an available topic.
