import { defineStage } from '../define'
import { CSES_BOOK, cf, ex, py, PYTHON_TUTOR, usaco } from '../links'

export const problemSolving = defineStage('problem-solving', [
  {
    id: 'p-statements',
    title: 'Understanding problem statements',
    description:
      'Codeforces statements wrap a precise task in a story. Read once for the story, then again to extract the exact rule, the input format, the output format and the constraints. Most wrong answers on easy problems are reading errors.',
    prerequisites: ['f-split'],
    difficulty: 'easy',
    estimatedMinutes: 30,
    objectives: ['Restate a problem in one sentence without the story', 'Work through the sample input by hand', 'Spot words like "at least", "strictly", "distinct" and "any"'],
    commonMistakes: ['Skipping the notes section, which often explains the sample.', 'Missing "print any valid answer", which lets you choose the simplest one.'],
    exercises: [cf(158, 'A', 'Next Round', 'rewrite the rule in one sentence first.'), cf(112, 'A', 'Petya and Strings')],
  },
  {
    id: 'p-io',
    title: 'Identifying input and output',
    description:
      'Before any logic, write the code that reads the input exactly as described and prints something in the right format. Many problems have multiple test cases: the first line is t, and each test case repeats the format.',
    prerequisites: ['p-statements'],
    difficulty: 'easy',
    estimatedMinutes: 25,
    objectives: ['Write the reading skeleton for a multi-test-case problem', 'Print one answer per test case', 'Collect output in a list and print once for speed'],
    syntax: `t = int(input())
out = []
for _ in range(t):
    n = int(input())
    a = list(map(int, input().split()))
    out.append(str(solve(n, a)))
print("\\n".join(out))`,
    commonMistakes: ['Reading t but solving only one test case.', 'Leaving debug prints in the submission.'],
    exercises: [cf(1328, 'A', 'Divisibility Problem', 'a multi-test-case problem.'), ex('Write a reusable template file with the multi-test reading loop.')],
  },
  {
    id: 'p-decompose',
    title: 'Breaking problems into smaller steps',
    description:
      'Split the task into steps you already know how to code: read, transform, count, decide, print. If one step is still unclear, split it again until each piece is a pattern from earlier stages.',
    prerequisites: ['p-io'],
    difficulty: 'easy',
    estimatedMinutes: 30,
    objectives: ['List the steps of a solution before coding', 'Put each non-trivial step in its own function', 'Recognise steps you have solved before'],
    syntax: `def is_valid(x):
    ...

def solve(a):
    good = [x for x in a if is_valid(x)]
    return len(good)`,
    commonMistakes: ['Writing everything in one giant loop, making bugs hard to find.'],
    exercises: [cf(263, 'A', 'Beautiful Matrix', 'step 1: find the 1, step 2: compute the distance.'), ex('Pick a solved problem and rewrite it with one function per step.')],
  },
  {
    id: 'p-pseudocode',
    title: 'Writing pseudocode',
    description:
      'Pseudocode is the plan in plain words, written as numbered steps. It lets you check the logic against the samples before Python syntax gets in the way.',
    prerequisites: ['p-decompose'],
    difficulty: 'easy',
    estimatedMinutes: 20,
    objectives: ['Write 3–8 numbered steps for a problem before coding', 'Check the steps against the sample by hand', 'Translate each step into a few lines of Python'],
    commonMistakes: ['Writing pseudocode so vague ("find the answer") that it skips the hard part.'],
    exercises: [ex('Write pseudocode for "print the second largest distinct value", then code it.'), cf(236, 'A', 'Boy or Girl')],
  },
  {
    id: 'p-dry-run',
    title: 'Dry runs and trace tables',
    description:
      'A dry run executes the code by hand, writing the value of every variable after each step in a table. It is the fastest way to find off-by-one errors and wrong initial values.',
    prerequisites: ['p-pseudocode', 'l-for'],
    difficulty: 'easy',
    estimatedMinutes: 30,
    objectives: ['Build a trace table with one column per variable', 'Trace loops for 3–4 iterations', 'Find a bug by comparing the trace with the expected result'],
    syntax: `# i | x  | total
# 0 | 3  | 3
# 1 | -1 | 3   <- condition skipped negatives
# 2 | 5  | 8`,
    commonMistakes: ['Tracing what you meant to write instead of what the code says.'],
    exercises: [ex('Trace a loop computing the sum of digits of 4096 by hand.'), ex('Use Python Tutor to check your trace of the same loop.')],
    resources: [PYTHON_TUTOR],
  },
  {
    id: 'p-test-cases',
    title: 'Test cases and edge cases',
    description:
      'Samples only prove the code runs. Write your own small tests — minimum size, maximum values, all equal, no answer — and compare against a brute-force version when you are unsure.',
    prerequisites: ['p-dry-run', 'a-empty'],
    difficulty: 'medium',
    estimatedMinutes: 35,
    objectives: ['Write tests for minimum and maximum constraints', 'Write a test where the answer is "impossible"', 'Compare a fast solution against a brute-force one on random inputs'],
    syntax: `import random
for _ in range(1000):
    a = [random.randint(1, 5) for _ in range(random.randint(1, 6))]
    assert fast(a) == brute(a), a`,
    commonMistakes: ['Only testing inputs where the answer is "yes".'],
    exercises: [ex('Write a random stress test for any problem you solved with a clever trick.'), cf(160, 'A', 'Twins', 'test n = 1 and all-equal coins.')],
  },
  {
    id: 'p-brute-force',
    title: 'Brute-force solutions',
    description:
      'Brute force tries every possibility. With small constraints it is a complete solution; with large ones it is still useful as a correctness reference and as a way to discover patterns.',
    prerequisites: ['p-decompose', 'a-iterate'],
    difficulty: 'easy',
    estimatedMinutes: 35,
    objectives: ['Enumerate all pairs or all subsets of a small input', 'Decide from the constraints whether brute force is fast enough', 'Use brute-force output to find a pattern'],
    syntax: `best = 0
for i in range(n):
    for j in range(i + 1, n):
        best = max(best, a[i] + a[j])

from itertools import combinations, product
for x, y in combinations(a, 2): ...`,
    commonMistakes: ['Dismissing brute force without checking the constraints — n ≤ 100 means O(n³) is fine.'],
    exercises: [cf(271, 'A', 'Beautiful Year', 'just try the next years one by one.'), ex('Find the pair with the smallest difference by checking all pairs.')],
    resources: [py('library/itertools.html', 'itertools — combinations, permutations, product')],
  },
  {
    id: 'p-complexity',
    title: 'Time complexity: O(1), O(n), O(n²)',
    description:
      'Big-O counts how the work grows with input size. A rough budget for Python is around 10⁷ simple operations per second, so n = 2·10⁵ needs O(n) or O(n log n), while O(n²) only works up to a few thousand.',
    prerequisites: ['p-brute-force', 'l-range'],
    difficulty: 'medium',
    estimatedMinutes: 40,
    objectives: ['Count the loops to estimate complexity', 'Know the cost of common list, set and dict operations', 'Predict whether a solution passes for given n'],
    syntax: `# O(1): a[i], len(a), x in set
# O(n): sum(a), x in list, a.index(x), a.count(x)
# O(n log n): sorted(a)
# O(n^2): nested loops over a`,
    commonMistakes: ['Hiding an O(n) operation like x in list or a.count() inside an O(n) loop.', 'Assuming C++ speed: Python is often 10–50× slower.'],
    exercises: [ex('Label each of 5 of your past solutions with its complexity.'), ex('Rewrite an O(n²) duplicate check as O(n) with a set.')],
    resources: [usaco('bronze/time-comp', 'Time Complexity'), py('library/stdtypes.html#common-sequence-operations', 'Common sequence operations'), CSES_BOOK],
  },
  {
    id: 'p-constraints',
    title: 'Understanding problem constraints',
    description:
      'Constraints are the strongest hint in the statement. n ≤ 20 suggests subsets, n ≤ 5000 allows O(n²), n ≤ 2·10⁵ needs O(n log n), and values up to 10¹⁸ mean you must avoid floats.',
    prerequisites: ['p-complexity', 'a-constraints'],
    difficulty: 'medium',
    estimatedMinutes: 25,
    objectives: ['Map constraint sizes to acceptable complexities', 'Notice "sum of n over all test cases" limits', 'Choose integer arithmetic for very large values'],
    syntax: `# n <= 20        -> 2^n subsets
# n <= 500       -> O(n^3)
# n <= 5000      -> O(n^2)
# n <= 2*10^5    -> O(n log n) or O(n)
# n <= 10^18     -> O(log n) or O(1) maths`,
    commonMistakes: ['Ignoring that the sum of n across test cases is bounded, and over-estimating the work.'],
    exercises: [ex('For 5 problems, read only the constraints and guess the intended complexity before reading the rest.')],
  },
  {
    id: 'p-debugging',
    title: 'Debugging and common Python errors',
    description:
      'Learn to read a traceback from the bottom up: the last line names the error, the line above shows where it happened. Most beginner errors are ValueError (bad conversion), IndexError, TypeError and NameError.',
    prerequisites: ['p-dry-run'],
    difficulty: 'easy',
    estimatedMinutes: 30,
    objectives: ['Read a traceback and jump to the failing line', 'Recognise the four most common runtime errors', 'Debug with prints to stderr so they do not affect the answer'],
    syntax: `import sys
print("debug:", a, file=sys.stderr)   # not judged

# ValueError: int("") or int("3.5")
# IndexError: a[n]
# TypeError:  "a" + 1
# RecursionError: deep recursion (see sys.setrecursionlimit)`,
    commonMistakes: ['Leaving debug prints on stdout.', 'Changing code randomly instead of finding the first wrong variable.'],
    exercises: [ex('Deliberately trigger each of ValueError, IndexError and TypeError and read the traceback.'), ex('Fix a solution that fails with "too many values to unpack".')],
    resources: [py('tutorial/errors.html', 'Tutorial: Errors and exceptions')],
  },
])
