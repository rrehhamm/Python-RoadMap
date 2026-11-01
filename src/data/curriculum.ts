import { STAGES } from './stages'
import type { Stage, Topic } from './types'
import { fundamentals } from './topics/fundamentals'
import { loops } from './topics/loops'
import { lists } from './topics/lists'
import { problemSolving } from './topics/problem-solving'
import { strings } from './topics/strings'
import { math } from './topics/math'
import { hashing } from './topics/hashing'
import { searchSort } from './topics/search-sort'
import { dataStructures } from './topics/data-structures'
import { algorithms } from './topics/algorithms'
import { advanced } from './topics/advanced'
import { codeforces } from './topics/codeforces'

export interface Curriculum {
  stages: Stage[]
  topics: Topic[]
}

export const CURRICULUM: Curriculum = {
  stages: STAGES,
  topics: [
    ...fundamentals,
    ...loops,
    ...lists,
    ...problemSolving,
    ...strings,
    ...math,
    ...hashing,
    ...searchSort,
    ...dataStructures,
    ...algorithms,
    ...advanced,
    ...codeforces,
  ],
}

export type { Stage, Topic }
