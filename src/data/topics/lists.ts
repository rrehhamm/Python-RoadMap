import { defineStage } from '../define'
import { cf, ex, py } from '../links'

export const lists = defineStage('lists', [
  {
    id: 'a-create',
    title: 'Creating and reading lists',
    description:
      'A list stores an ordered sequence of values. In contest code you almost always build one straight from input with list(map(int, input().split())), or create a fixed-size one with [0] * n.',
    prerequisites: ['f-map', 'l-for'],
    difficulty: 'easy',
    estimatedMinutes: 30,
    objectives: ['Read an array of n integers from one line', 'Create a list of n zeros', 'Read n values given one per line'],
    syntax: `a = list(map(int, input().split()))
zeros = [0] * n
a = [int(input()) for _ in range(n)]     # one per line
grid = [[0] * m for _ in range(n)]       # 2D list`,
    commonMistakes: ['Building a 2D list with [[0] * m] * n — every row is the same object.', 'Reading the count n and then ignoring it, so a malformed line goes unnoticed while debugging.'],
    exercises: [ex('Read n and n integers, then print them in reverse order.'), ex('Read an n × m grid of characters into a list of strings.')],
    resources: [py('tutorial/datastructures.html', 'Tutorial: Data structures'), py('library/stdtypes.html#lists', 'Lists — Python docs')],
  },
  {
    id: 'a-iterate',
    title: 'Iterating over list elements',
    description:
      'Loop directly over values with for x in a when the position does not matter, over indices with range(len(a)) when you need neighbours, and with enumerate() when you need both.',
    prerequisites: ['a-create'],
    difficulty: 'easy',
    estimatedMinutes: 25,
    objectives: ['Pick between value, index, and enumerate iteration', 'Compare each element with its neighbour safely', 'Iterate two lists together with zip()'],
    syntax: `for x in a: ...
for i in range(len(a)): ...
for i, x in enumerate(a): ...
for x, y in zip(a, b): ...
for i in range(1, n):
    if a[i] < a[i - 1]: ...`,
    commonMistakes: ['Removing items from a list while looping over it.', 'Using range(len(a)) and then only ever reading a[i].'],
    exercises: [ex('Print every element that is larger than the one before it.'), cf(266, 'A', 'Stones on the Table')],
    resources: [py('library/functions.html#zip', 'zip() — Python docs')],
  },
  {
    id: 'a-indexing',
    title: 'Indexing and negative indexing',
    description:
      'a[0] is the first element and a[n - 1] the last. Negative indices count from the end: a[-1] is the last, a[-2] the second last. Indexing outside the list raises IndexError.',
    prerequisites: ['a-create'],
    difficulty: 'easy',
    estimatedMinutes: 20,
    objectives: ['Access first, last and middle elements', 'Use negative indices for "from the end"', 'Read 1-indexed problem statements correctly in 0-indexed code'],
    syntax: `a[0], a[-1]          # first, last
a[n // 2]            # middle (upper middle for even n)
a[k - 1]             # "k-th element" in a 1-indexed statement`,
    commonMistakes: ['Off-by-one when the statement is 1-indexed.', 'Accidentally using a[-1] as a "previous" element when i = 0, silently reading the last item.'],
    exercises: [ex('Print the first, last and middle elements of a list.'), ex('Given k (1-indexed), print the k-th element from the end.')],
  },
  {
    id: 'a-modify',
    title: 'Modifying list elements',
    description:
      'Lists are mutable: assign to a[i], append to the end, pop from the end, or insert/remove in the middle. Appending and popping at the end are O(1); inserting or removing at the front is O(n).',
    prerequisites: ['a-indexing'],
    difficulty: 'easy',
    estimatedMinutes: 25,
    objectives: ['Update elements by index', 'Use append() and pop() for building results', 'Know which list operations are slow'],
    syntax: `a[i] = 0
a.append(x)        # O(1)
last = a.pop()     # O(1)
a.insert(0, x)     # O(n) — avoid in loops
b = a[:]           # copy; b = a only copies the reference`,
    commonMistakes: ['b = a then modifying b — both names point to the same list.', 'Calling a.insert(0, x) or a.pop(0) inside a big loop (use collections.deque).'],
    exercises: [ex('Replace every negative number in a list with 0.'), ex('Build a new list containing only the even numbers using append().')],
  },
  {
    id: 'a-len',
    title: 'len()',
    description:
      'len() returns the number of items in a list, string, set or dict in O(1). It is how you get n when the problem does not give it, and how you guard against empty input.',
    prerequisites: ['a-create'],
    difficulty: 'easy',
    estimatedMinutes: 10,
    objectives: ['Use len() for lists, strings, sets and dicts', 'Use len() == 0 (or not a) to detect emptiness'],
    syntax: `n = len(a)
if len(s) > 10: ...
distinct = len(set(a))`,
    commonMistakes: ['Calling len() repeatedly inside a hot loop is fine (O(1)), but using it on a map object fails.'],
    exercises: [cf(71, 'A', 'Way Too Long Words'), ex('Print the number of distinct values in a list with len(set(a)).')],
    resources: [py('library/functions.html#len', 'len() — Python docs')],
  },
  {
    id: 'a-builtins',
    title: 'sum(), min(), and max()',
    description:
      'sum, min and max scan a list in O(n) and replace most hand-written accumulator loops. min/max also take a key= function and a default= value for empty input.',
    prerequisites: ['a-iterate'],
    difficulty: 'easy',
    estimatedMinutes: 20,
    objectives: ['Replace manual loops with sum/min/max', 'Use key= to find the element with the best property', 'Use default= to handle empty sequences'],
    syntax: `total = sum(a)
lo, hi = min(a), max(a)
longest = max(words, key=len)
best = max((x for x in a if x % 2 == 0), default=-1)`,
    commonMistakes: ['Calling max() on an empty list → ValueError.', 'Calling sum(a) inside a loop over a, turning O(n) into O(n²).'],
    exercises: [cf(702, 'A', 'Maximum Increase'), ex('Print the difference between the largest and smallest values.')],
    resources: [py('library/functions.html#max', 'max() — Python docs'), py('library/functions.html#min', 'min() — Python docs')],
  },
  {
    id: 'a-search',
    title: 'Searching for elements',
    description:
      'x in a checks membership and a.index(x) gives the first position, both by scanning the list in O(n). Writing the scan yourself lets you find the last occurrence, all occurrences, or the first match of a condition.',
    prerequisites: ['a-iterate', 'l-flags'],
    difficulty: 'easy',
    estimatedMinutes: 25,
    objectives: ['Find the first and last index of a value', 'Return -1 when the value is missing', 'Find the first element satisfying a condition'],
    syntax: `if x in a:
    i = a.index(x)       # first occurrence
last = max((i for i, v in enumerate(a) if v == x), default=-1)
first_neg = next((i for i, v in enumerate(a) if v < 0), -1)`,
    commonMistakes: ['Calling a.index(x) without checking x in a → ValueError.', 'Using x in a inside a loop over a large list (O(n²)); use a set later.'],
    exercises: [ex('Print the 1-based position of the first occurrence of x, or -1.'), ex('Print all positions where x appears.')],
  },
  {
    id: 'a-frequency',
    title: 'Counting element frequencies',
    description:
      'When values are small (say 0..100), a count list cnt[v] += 1 records how often each value appears. This is the stepping stone to dictionaries and Counter in Stage 7.',
    prerequisites: ['a-iterate', 'l-counting'],
    difficulty: 'easy',
    estimatedMinutes: 30,
    objectives: ['Build a frequency array for bounded values', 'Find the most frequent value', 'Use a.count(x) only for one-off checks'],
    syntax: `cnt = [0] * 101
for x in a:
    cnt[x] += 1
most = max(range(101), key=lambda v: cnt[v])`,
    commonMistakes: ['Calling a.count(x) for every x — O(n²).', 'Sizing the count array too small for the largest value.'],
    exercises: [cf(339, 'A', 'Helpful Maths', 'count the 1s, 2s and 3s.'), ex('Print each value from 1 to 10 with how many times it appears.')],
  },
  {
    id: 'a-minmax',
    title: 'Finding minimum and maximum values',
    description:
      'Beyond max(a), problems often ask for the position of the maximum, the second maximum, or both min and max in a single pass. Writing the loop yourself gives you full control over ties.',
    prerequisites: ['a-builtins', 'a-indexing'],
    difficulty: 'easy',
    estimatedMinutes: 30,
    objectives: ['Find the index of the first and last maximum', 'Track the two largest values in one pass', 'Decide how ties should be broken'],
    syntax: `best_i = 0
for i in range(1, n):
    if a[i] > a[best_i]:     # > keeps first max, >= keeps last
        best_i = i

first, second = float('-inf'), float('-inf')
for x in a:
    if x > first: first, second = x, first
    elif x > second: second = x`,
    commonMistakes: ['Using > vs >= carelessly when the problem cares which tied index you report.', 'Initialising the best value to 0 with negative inputs.'],
    exercises: [ex('Print the second largest distinct value, or -1 if it does not exist.'), ex('Count the moves needed to bring the maximum to the front and the minimum to the back (adjacent swaps).')],
  },
  {
    id: 'a-negatives',
    title: 'Handling negative numbers',
    description:
      'Negative values break many hidden assumptions: a running maximum starting at 0, a product that flips sign, abs() for distances, and Python\'s floor division rounding toward minus infinity.',
    prerequisites: ['a-minmax'],
    difficulty: 'easy',
    estimatedMinutes: 20,
    objectives: ['Initialise bests with the first element or infinity', 'Use abs() for distances', 'Predict // and % on negative values'],
    syntax: `best = a[0]                 # safe start for max
dist = abs(x - y)
-7 // 2 == -4 and -7 % 2 == 1
float('inf'), float('-inf')`,
    commonMistakes: ['Starting max at 0.', 'Assuming the largest product of two numbers uses the two largest values (two big negatives can win).'],
    exercises: [ex('Find the maximum product of any two numbers in a list that may contain negatives.'), ex('Print the value closest to zero; break ties toward the positive one.')],
  },
  {
    id: 'a-empty',
    title: 'Empty or missing-result cases',
    description:
      'Problems often say "print -1 if there is no answer". Decide up front what the program prints when nothing matches, and make sure every path produces output exactly once.',
    prerequisites: ['a-search'],
    difficulty: 'easy',
    estimatedMinutes: 20,
    objectives: ['Handle "no valid answer" explicitly', 'Use default= with min/max/next', 'Make sure the program prints exactly once'],
    syntax: `ans = -1
for i, x in enumerate(a):
    if ok(x):
        ans = i + 1
        break
print(ans)

print(min((x for x in a if x > 0), default=-1))`,
    commonMistakes: ['Printing inside the loop and again after it.', 'Forgetting the "impossible" case altogether because the samples never show it.'],
    exercises: [ex('Print the smallest positive number, or -1 if none exists.'), ex('Write three custom tests where the answer should be -1.')],
  },
  {
    id: 'a-constraints',
    title: 'Edge cases and input constraints',
    description:
      'The constraints section tells you the smallest and largest inputs. n = 1, all-equal values, maximum values and already-sorted input are the edge cases that catch the most wrong answers.',
    prerequisites: ['a-len', 'a-empty'],
    difficulty: 'medium',
    estimatedMinutes: 30,
    objectives: ['List edge cases from the constraints before coding', 'Test n = 1 and all-equal arrays', 'Notice when values can exceed what a naive approach handles'],
    commonMistakes: ['Testing only the provided samples.', 'Assuming n ≥ 2 when the statement allows n = 1.'],
    exercises: [ex('For any solved problem, write 4 edge-case tests: smallest n, largest values, all equal, already sorted.'), cf(469, 'A', 'I Wanna Be the Guy', 'watch the case where a player passes zero levels.')],
  },
])
