import { defineStage } from '../define'
import { cf, cfSet, cpa, ex, py, usaco } from '../links'

export const searchSort = defineStage('search-sort', [
  {
    id: 'ss-linear',
    title: 'Linear search',
    description: 'Linear search checks elements one by one until it finds a match: O(n), works on any list, needs no preparation. It is the right choice for a single query on unsorted data.',
    prerequisites: ['a-search', 'p-complexity'],
    difficulty: 'easy',
    estimatedMinutes: 15,
    objectives: ['Write linear search returning an index or -1', 'Know when one O(n) scan beats sorting', 'Count comparisons in the worst case'],
    syntax: `def find(a, x):
    for i, v in enumerate(a):
        if v == x:
            return i
    return -1`,
    commonMistakes: ['Running a linear search per query when there are 10⁵ queries.'],
    exercises: [ex('Find the first index where a[i] > a[i + 1], or -1 if the list is sorted.')],
  },
  {
    id: 'ss-sorted',
    title: 'Python sorted() and list.sort()',
    description: 'sorted(a) returns a new sorted list; a.sort() sorts in place and returns None. Both are stable O(n log n) and accept reverse=True.',
    prerequisites: ['h-sort-tech'],
    difficulty: 'easy',
    estimatedMinutes: 20,
    objectives: ['Choose between sorted() and .sort()', 'Sort in descending order', 'Explain what a stable sort guarantees'],
    syntax: `b = sorted(a)
a.sort(reverse=True)
x = a.sort()      # x is None!`,
    commonMistakes: ['Writing a = a.sort() and losing the list.'],
    exercises: [cf(160, 'A', 'Twins'), ex('Print the k largest values in descending order.')],
    resources: [py('howto/sorting.html', 'Sorting Techniques — Python HOWTO')],
  },
  {
    id: 'ss-key',
    title: 'Sorting with custom keys',
    description: 'key= tells sort what to compare. Return a tuple to sort by several criteria, and negate numbers to flip one criterion. cmp_to_key exists for comparisons that cannot be expressed as a key.',
    prerequisites: ['ss-sorted'],
    difficulty: 'medium',
    estimatedMinutes: 30,
    objectives: ['Sort by a computed property', 'Sort by multiple criteria with tuples', 'Sort indices by the values they point to'],
    syntax: `people.sort(key=lambda p: (-p.score, p.name))
order = sorted(range(n), key=lambda i: a[i])
from functools import cmp_to_key`,
    commonMistakes: ['Trying reverse=True when only one of two criteria should be descending — negate that one instead.'],
    exercises: [cf(230, 'A', 'Dragons'), ex('Sort words by length, then alphabetically.')],
    resources: [py('howto/sorting.html#key-functions', 'Key functions — Sorting HOWTO'), usaco('silver/sorting-custom', 'Custom comparators')],
  },
  {
    id: 'ss-binary',
    title: 'Binary search',
    description: 'On sorted data, binary search halves the search range each step and finds an element in O(log n). It needs a monotone condition: everything before some point is "no" and everything after is "yes".',
    prerequisites: ['ss-sorted', 'p-constraints'],
    difficulty: 'medium',
    estimatedMinutes: 45,
    objectives: ['Implement binary search on a sorted list', 'State the loop invariant', 'Use the bisect module'],
    syntax: `lo, hi = 0, n - 1
while lo <= hi:
    mid = (lo + hi) // 2
    if a[mid] == x: break
    if a[mid] < x: lo = mid + 1
    else: hi = mid - 1

from bisect import bisect_left, bisect_right`,
    commonMistakes: ['Binary searching an unsorted list.', 'Updating lo = mid instead of mid + 1 and looping forever.'],
    exercises: [cf(706, 'B', 'Interesting drink'), cf(474, 'B', 'Worms')],
    resources: [py('library/bisect.html', 'bisect — Python docs'), cpa('num_methods/binary_search.html', 'Binary search'), usaco('silver/binary-search', 'Binary Search')],
  },
  {
    id: 'ss-boundaries',
    title: 'Search boundaries',
    description: 'Most binary search bugs come from boundaries. Pick one convention — for example lo is always "no" and hi is always "yes" — and keep it true through every update.',
    prerequisites: ['ss-binary'],
    difficulty: 'medium',
    estimatedMinutes: 30,
    objectives: ['Write binary search with a clear invariant', 'Choose initial lo and hi so the answer is always inside', 'Avoid infinite loops on two-element ranges'],
    syntax: `lo, hi = -1, n        # a[lo] fails, a[hi] passes (virtually)
while hi - lo > 1:
    mid = (lo + hi) // 2
    if ok(mid): hi = mid
    else: lo = mid
# hi = first index where ok() is true`,
    commonMistakes: ['Mixing conventions in one function.'],
    exercises: [ex('Find the first index where a[i] ≥ x without bisect.'), ex('Test your search on arrays of length 0, 1 and 2.')],
  },
  {
    id: 'ss-bounds',
    title: 'Lower bound and upper bound concepts',
    description: 'Lower bound is the first position with a value ≥ x; upper bound is the first with a value > x. Their difference counts occurrences of x, and they answer "how many values are ≤ x" in O(log n).',
    prerequisites: ['ss-boundaries'],
    difficulty: 'medium',
    estimatedMinutes: 25,
    objectives: ['Use bisect_left and bisect_right', 'Count values in a range [l, r]', 'Find the nearest value to x in a sorted list'],
    syntax: `from bisect import bisect_left, bisect_right
count_x = bisect_right(a, x) - bisect_left(a, x)
in_range = bisect_right(a, r) - bisect_left(a, l)`,
    commonMistakes: ['Confusing which bisect includes equal elements.'],
    exercises: [cf(706, 'B', 'Interesting drink'), cf(492, 'B', 'Vanya and Lanterns')],
  },
  {
    id: 'ss-answer',
    title: 'Binary search on the answer',
    description: 'When "can we do it with value X?" gets easier as X grows, binary search over X itself. You only need a check function, and the total cost is O(check × log range).',
    prerequisites: ['ss-bounds'],
    difficulty: 'hard',
    estimatedMinutes: 60,
    objectives: ['Recognise a monotone yes/no question', 'Write the check function separately', 'Pick a safe search range'],
    syntax: `def ok(x): ...          # True for all x >= answer
lo, hi = 0, 10**18
while hi - lo > 1:
    mid = (lo + hi) // 2
    if ok(mid): hi = mid
    else: lo = mid
print(hi)`,
    commonMistakes: ['A check function that is not actually monotone.', 'A range that does not include the true answer.'],
    exercises: [ex('Minimum time for k machines to produce n items (each machine i takes t[i] per item).'), ex('Maximum minimum distance when placing c items on n positions.')],
    resources: [cfSet(['binary search', '1100-1300'], 'Codeforces: binary search, 1100–1300')],
  },
  {
    id: 'ss-complexity',
    title: 'Time complexity of searching and sorting',
    description: 'Linear search O(n), binary search O(log n), sorting O(n log n). Sorting once and then binary searching q times costs O((n + q) log n), which beats q linear searches when q is large.',
    prerequisites: ['ss-binary', 'ss-key'],
    difficulty: 'medium',
    estimatedMinutes: 20,
    objectives: ['Compare sort-then-search against repeated linear search', 'Know that comparison sorts cannot beat O(n log n)', 'Use counting sort when values are small'],
    commonMistakes: ['Re-sorting inside a query loop.'],
    exercises: [ex('Estimate the operations for n = q = 2·10⁵ with and without sorting first.')],
  },
])
