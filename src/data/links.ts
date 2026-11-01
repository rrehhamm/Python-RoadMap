import type { Exercise, Resource } from './types'

/**
 * Link builders. Every base URL here was checked to resolve. Codeforces
 * problem links point to long-standing classic problems; tag/rating filters
 * use Codeforces' own problemset query format.
 */

const PY = 'https://docs.python.org/3/'

export const py = (path: string, label: string): Resource => ({
  label,
  url: PY + path,
  kind: 'docs',
})

export const cpa = (path: string, label: string): Resource => ({
  label: `cp-algorithms: ${label}`,
  url: `https://cp-algorithms.com/${path}`,
  kind: 'article',
})

export const usaco = (path: string, label: string): Resource => ({
  label: `USACO Guide: ${label}`,
  url: `https://usaco.guide/${path}`,
  kind: 'article',
})

/** Codeforces problemset filtered by tags and/or a rating range like "800-800". */
export const cfSet = (tags: string[], label: string): Resource => ({
  label,
  url: `https://codeforces.com/problemset?tags=${tags.map(encodeURIComponent).join(',')}`,
  kind: 'practice',
})

/** A specific Codeforces problem, e.g. cf(4, 'A', 'Watermelon'). */
export const cf = (contest: number, index: string, name: string, task?: string): Exercise => ({
  text: task ? `CF ${contest}${index} — ${name}: ${task}` : `CF ${contest}${index} — ${name}`,
  url: `https://codeforces.com/problemset/problem/${contest}/${index}`,
})

export const ex = (text: string): Exercise => ({ text })

export const CSES: Resource = {
  label: 'CSES Problem Set',
  url: 'https://cses.fi/problemset/',
  kind: 'practice',
}

export const CSES_BOOK: Resource = {
  label: "Competitive Programmer's Handbook (PDF)",
  url: 'https://cses.fi/book/book.pdf',
  kind: 'article',
}

export const PYTHON_TUTOR: Resource = {
  label: 'Python Tutor — step through code visually',
  url: 'https://pythontutor.com/',
  kind: 'tool',
}
