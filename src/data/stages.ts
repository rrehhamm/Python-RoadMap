import type { Stage } from './types'

export const STAGES: Stage[] = [
  { id: 'fundamentals', number: 1, title: 'Python Fundamentals', summary: 'Read input, store values, make decisions.' },
  { id: 'loops', number: 2, title: 'Loops & Counting', summary: 'Repeat work and keep running totals.' },
  { id: 'lists', number: 3, title: 'Lists & Array Basics', summary: 'Store many values and scan them.' },
  { id: 'problem-solving', number: 4, title: 'Problem-Solving Foundations', summary: 'Turn a statement into a correct, fast program.' },
  { id: 'strings', number: 5, title: 'Strings', summary: 'Index, slice and count characters.' },
  { id: 'math', number: 6, title: 'Mathematical Foundations', summary: 'Digits, divisors, primes and GCD.' },
  { id: 'hashing', number: 7, title: 'Arrays, Sets & Hashing', summary: 'Dictionaries, prefix sums, two pointers.' },
  { id: 'search-sort', number: 8, title: 'Searching & Sorting', summary: 'Sort with keys, binary search the answer.' },
  { id: 'data-structures', number: 9, title: 'Core Data Structures', summary: 'Stacks, queues, heaps, trees, graphs.' },
  { id: 'algorithms', number: 10, title: 'Core Algorithms', summary: 'Recursion, greedy, BFS/DFS, intro DP.' },
  { id: 'advanced', number: 11, title: 'Advanced Patterns', summary: 'Sliding window, DSU, bitmasks, harder DP.' },
  {
    id: 'codeforces',
    number: 12,
    title: 'Codeforces Practice',
    summary: 'Runs alongside every stage. Ratings are rough difficulty milestones.',
    track: 'practice',
  },
]
