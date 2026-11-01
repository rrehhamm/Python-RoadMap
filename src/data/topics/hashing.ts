import { defineStage } from '../define'
import { cf, cfSet, ex, py, usaco } from '../links'

export const hashing = defineStage('hashing', [
  {
    id: 'h-dict',
    title: 'Python dictionaries',
    description: 'A dict maps keys to values with average O(1) lookup, insert and delete. Keys must be hashable — numbers, strings and tuples work; lists do not.',
    prerequisites: ['a-frequency'],
    difficulty: 'easy',
    estimatedMinutes: 30,
    objectives: ['Create, read, update and delete entries', 'Use get() with a default and "in" for membership', 'Iterate over keys, values and items'],
    syntax: `d = {}
d["a"] = 1
d.get("b", 0)
if key in d: ...
for k, v in d.items(): ...
pos = {x: i for i, x in enumerate(a)}`,
    commonMistakes: ['Reading d[key] for a missing key → KeyError.', 'Using a list as a key; convert it to a tuple.'],
    exercises: [ex('Map each name to its phone number and answer q lookups.'), cf(4, 'C', 'Registration System')],
    resources: [py('library/stdtypes.html#mapping-types-dict-frozendict', 'dict — Python docs')],
  },
  {
    id: 'h-freq-dict',
    title: 'Frequency counting with dictionaries',
    description: 'When values are large or not numbers, count with a dict, defaultdict(int), or Counter. Counter also gives most_common() and supports adding and subtracting counts.',
    prerequisites: ['h-dict'],
    difficulty: 'easy',
    estimatedMinutes: 30,
    objectives: ['Count with dict.get, defaultdict and Counter', 'Find the most common element', 'Compare two multisets'],
    syntax: `from collections import Counter, defaultdict
c = Counter(a)
c.most_common(1)
dd = defaultdict(int)
for x in a: dd[x] += 1`,
    commonMistakes: ['Accessing a missing key on a Counter returns 0 but does not create the key — fine — while a plain dict raises.'],
    exercises: [cf(43, 'A', 'Football'), ex('Print the value that appears an odd number of times.')],
    resources: [py('library/collections.html', 'collections — Counter, defaultdict, deque')],
  },
  {
    id: 'h-sets',
    title: 'Sets',
    description: 'A set holds unique hashable values with O(1) average membership tests. Union, intersection and difference answer "which values appear in both / either / only one" questions directly.',
    prerequisites: ['h-dict'],
    difficulty: 'easy',
    estimatedMinutes: 25,
    objectives: ['Build sets and test membership', 'Use |, &, - and ^ on sets', 'Count distinct values with len(set(a))'],
    syntax: `s = set(a)
s.add(x); s.discard(x)
both = s1 & s2
either = s1 | s2
only_first = s1 - s2`,
    commonMistakes: ['Creating an empty set with {} — that is a dict. Use set().', 'Relying on set ordering.'],
    exercises: [cf(469, 'A', 'I Wanna Be the Guy'), cf(236, 'A', 'Boy or Girl')],
    resources: [py('library/stdtypes.html#set-types-set-frozenset', 'set — Python docs')],
  },
  {
    id: 'h-duplicates',
    title: 'Duplicate detection',
    description: 'len(set(a)) != len(a) answers "are there duplicates" in O(n). To find which values repeat, or the first repeat, keep a "seen" set while scanning.',
    prerequisites: ['h-sets'],
    difficulty: 'easy',
    estimatedMinutes: 20,
    objectives: ['Detect duplicates in O(n)', 'Find the first repeated value', 'Remove duplicates while keeping order'],
    syntax: `seen = set()
for x in a:
    if x in seen:
        print(x); break
    seen.add(x)
unique_in_order = list(dict.fromkeys(a))`,
    commonMistakes: ['Using nested loops for duplicate checks on large n.'],
    exercises: [cf(228, 'A', 'Is your horseshoe on the other hoof?'), ex('Print the array with duplicates removed, keeping first occurrences.')],
  },
  {
    id: 'h-membership',
    title: 'Membership testing',
    description: 'x in list scans every element (O(n)); x in set or x in dict uses hashing (O(1) on average). Converting a list to a set once before many lookups is one of the cheapest speedups in Python.',
    prerequisites: ['h-sets', 'p-complexity'],
    difficulty: 'easy',
    estimatedMinutes: 15,
    objectives: ['Choose set over list for repeated lookups', 'Explain the complexity difference', 'Answer many queries efficiently'],
    syntax: `allowed = set(a)        # O(n) once
for q in queries:
    print("YES" if q in allowed else "NO")   # O(1) each`,
    commonMistakes: ['Rebuilding the set inside the query loop.'],
    exercises: [ex('Answer q "is x in the array?" queries for n, q up to 2·10⁵.')],
  },
  {
    id: 'h-prefix',
    title: 'Prefix sums',
    description: 'pre[i] stores the sum of the first i elements, so any range sum a[l..r] becomes pre[r + 1] - pre[l] in O(1). It turns repeated O(n) range queries into O(1) each after O(n) setup.',
    prerequisites: ['a-builtins', 'p-complexity'],
    difficulty: 'medium',
    estimatedMinutes: 40,
    objectives: ['Build a prefix sum array of length n + 1', 'Answer range-sum queries in O(1)', 'Use itertools.accumulate'],
    syntax: `pre = [0] * (n + 1)
for i, x in enumerate(a):
    pre[i + 1] = pre[i] + x
range_sum = pre[r + 1] - pre[l]      # 0-indexed, inclusive

from itertools import accumulate
pre = [0, *accumulate(a)]`,
    commonMistakes: ['Off-by-one between 0- and 1-indexed queries.', 'Making pre the same length as a and losing the empty prefix.'],
    exercises: [cf(313, 'B', 'Ilya and Queries'), cf(433, 'B', "Kuriyama Mirai's Stones")],
    resources: [usaco('silver/prefix-sums', 'Introduction to Prefix Sums')],
  },
  {
    id: 'h-subarrays',
    title: 'Subarrays',
    description: 'A subarray is a contiguous block a[l..r]; there are about n²/2 of them. Prefix sums plus a dictionary of earlier prefix values count subarrays with a target sum in O(n).',
    prerequisites: ['h-prefix', 'h-freq-dict'],
    difficulty: 'medium',
    estimatedMinutes: 45,
    objectives: ['Distinguish subarrays from subsequences', 'Enumerate subarrays in O(n²) for small n', 'Count subarrays with sum k in O(n)'],
    syntax: `seen = {0: 1}
cur = ans = 0
for x in a:
    cur += x
    ans += seen.get(cur - k, 0)
    seen[cur] = seen.get(cur, 0) + 1`,
    commonMistakes: ['Forgetting to seed the dictionary with {0: 1} (the empty prefix).'],
    exercises: [ex('Find the maximum subarray sum (Kadane\'s algorithm).'), ex('Count subarrays whose sum equals k, with negatives allowed.')],
  },
  {
    id: 'h-sort-tech',
    title: 'Sorting-based techniques',
    description: 'Sorting first often makes a problem simple: duplicates become adjacent, the closest pair is a neighbouring pair, and greedy choices become "take from the smallest". The O(n log n) sort is usually affordable.',
    prerequisites: ['a-minmax', 'p-brute-force'],
    difficulty: 'medium',
    estimatedMinutes: 35,
    objectives: ['Sort to group equal values', 'Find the closest pair after sorting', 'Recognise "order does not matter" in statements'],
    syntax: `a.sort()
min_gap = min(a[i + 1] - a[i] for i in range(n - 1))`,
    commonMistakes: ['Sorting when the original indices are needed in the answer — sort (value, index) pairs instead.'],
    exercises: [cf(160, 'A', 'Twins'), cf(339, 'A', 'Helpful Maths')],
  },
  {
    id: 'h-two-pointers',
    title: 'Two pointers',
    description: 'Two indices move through a (usually sorted) array, each only forward, so the total work is O(n). Classic uses: pair with target sum, merging two sorted lists, and matching elements from two groups.',
    prerequisites: ['h-sort-tech'],
    difficulty: 'medium',
    estimatedMinutes: 45,
    objectives: ['Find a pair with a given sum in a sorted array', 'Merge two sorted arrays', 'Explain why the total work is linear'],
    syntax: `i, j = 0, n - 1
while i < j:
    s = a[i] + a[j]
    if s == target: break
    if s < target: i += 1
    else: j -= 1`,
    commonMistakes: ['Applying the pair-sum technique to an unsorted array.', 'Moving both pointers when only one should move.'],
    exercises: [cf(489, 'B', 'BerSU Ball'), cf(279, 'B', 'Books')],
    resources: [usaco('silver/two-pointers', 'Two Pointers'), cfSet(['two pointers', '1000-1300'], 'Codeforces: two pointers, 1000–1300')],
  },
  {
    id: 'h-patterns',
    title: 'Common array problem patterns',
    description: 'Most array problems combine a handful of moves: counting, prefix sums, sorting, two pointers, a "best so far" scan, or a hash map of earlier values. Naming the pattern is half the solution.',
    prerequisites: ['h-two-pointers', 'h-subarrays'],
    difficulty: 'medium',
    estimatedMinutes: 60,
    objectives: ['Match a problem to one of the core patterns', 'Combine two patterns in one solution', 'Keep a personal list of patterns with example problems'],
    commonMistakes: ['Forcing a favourite pattern onto every problem.'],
    exercises: [cf(368, 'B', 'Sereja and Suffixes'), cf(580, 'A', 'Kefa and First Steps'), ex('For 5 solved problems, write down which pattern each one used.')],
    resources: [cfSet(['implementation', '1000-1100'], 'Codeforces: implementation, 1000–1100')],
  },
])
