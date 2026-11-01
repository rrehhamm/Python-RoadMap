import { defineStage } from '../define'
import { cf, ex, py, PYTHON_TUTOR } from '../links'

export const loops = defineStage('loops', [
  {
    id: 'l-for',
    title: 'for loops',
    description:
      'A for loop runs its body once for each item of a sequence — a range of numbers, a list, or the characters of a string. It is the default tool whenever you know how many times to repeat.',
    prerequisites: ['f-if', 'f-arithmetic'],
    difficulty: 'easy',
    estimatedMinutes: 40,
    objectives: [
      'Loop over a range, a list and a string',
      'Read n lines of input with a for loop',
      'Use break and continue deliberately',
    ],
    syntax: `for i in range(5):        # 0..4
    print(i)

for _ in range(n):        # repeat n times, index unused
    a, b = map(int, input().split())

for ch in "abc":
    print(ch)`,
    commonMistakes: [
      'Changing the loop variable inside the body and expecting the loop to skip ahead — it will not.',
      'Indenting print inside the loop when it should run once after it.',
    ],
    exercises: [
      ex('Print the multiplication table of n from 1 to 10.'),
      cf(282, 'A', 'Bit++', 'read n statements in a loop.'),
      cf(71, 'A', 'Way Too Long Words'),
    ],
    resources: [py('tutorial/controlflow.html#for-statements', 'Tutorial: for statements'), PYTHON_TUTOR],
  },
  {
    id: 'l-range',
    title: 'range(start, stop)',
    description:
      'range(start, stop, step) produces integers from start up to but not including stop. The half-open interval means range(n) gives exactly n values, and range(1, n + 1) gives 1..n.',
    prerequisites: ['l-for'],
    difficulty: 'easy',
    estimatedMinutes: 20,
    objectives: [
      'Generate 1..n inclusive without off-by-one errors',
      'Count down with a negative step',
      'Iterate over indices with range(len(a))',
    ],
    syntax: `range(5)          # 0 1 2 3 4
range(1, 6)       # 1 2 3 4 5
range(0, 10, 3)   # 0 3 6 9
range(5, 0, -1)   # 5 4 3 2 1`,
    commonMistakes: [
      'range(1, n) when 1..n was intended — it stops at n - 1.',
      'range(n, 0) with no step — it is empty.',
    ],
    exercises: [ex('Print all multiples of 7 between a and b inclusive.'), ex('Print n down to 1 on one line.')],
    resources: [py('library/functions.html#func-range', 'range() — Python docs')],
  },
  {
    id: 'l-while',
    title: 'while loops',
    description:
      'A while loop repeats as long as its condition is true. Use it when the number of iterations is not known in advance — stripping digits off a number, simulating a process, or reading until a sentinel.',
    prerequisites: ['f-if'],
    difficulty: 'easy',
    estimatedMinutes: 30,
    objectives: [
      'Write a while loop with a clear stopping condition',
      'Convert a for loop into an equivalent while loop and back',
      'Simulate a process step by step until it ends',
    ],
    syntax: `while n > 0:
    digit = n % 10
    n //= 10

while True:
    line = input()
    if line == "0":
        break`,
    commonMistakes: [
      'Forgetting to update the variable in the condition (infinite loop).',
      'Off-by-one when the loop should run one more or one fewer time — trace it with a tiny input.',
    ],
    exercises: [
      ex('Count how many times n can be halved (n //= 2) before reaching 0.'),
      cf(791, 'A', 'Bear and Big Brother', 'simulate year by year.'),
    ],
    resources: [py('reference/compound_stmts.html#the-while-statement', 'The while statement — language reference')],
  },
  {
    id: 'l-counters',
    title: 'Loop counters',
    description:
      'A counter is a variable initialised before the loop and incremented inside it. It answers "how many iterations happened" or "which step am I on" without relying on the loop index.',
    prerequisites: ['l-for'],
    difficulty: 'easy',
    estimatedMinutes: 20,
    objectives: ['Initialise counters outside the loop', 'Use += 1 to count events', 'Use enumerate() when you need both index and value'],
    syntax: `steps = 0
while n != 1:
    n = n // 2 if n % 2 == 0 else 3 * n + 1
    steps += 1

for i, x in enumerate(a, start=1):
    print(i, x)`,
    commonMistakes: ['Resetting the counter inside the loop.', 'Starting at 1 when the problem counts from 0 (or vice versa).'],
    exercises: [ex('Count the steps of the Collatz sequence from n to 1.'), cf(266, 'A', 'Stones on the Table')],
    resources: [py('library/functions.html#enumerate', 'enumerate() — Python docs')],
  },
  {
    id: 'l-accumulators',
    title: 'Accumulators and conditional sums',
    description:
      'An accumulator builds a result across iterations — a running sum, product or maximum. Adding an if inside the loop turns it into a conditional sum, like "sum of the even numbers".',
    prerequisites: ['l-counters', 'f-if'],
    difficulty: 'easy',
    estimatedMinutes: 30,
    objectives: ['Keep a running total, product, or best-so-far', 'Add only the values that satisfy a condition', 'Pick the right starting value (0 for sums, 1 for products)'],
    syntax: `total = 0
for x in a:
    if x % 2 == 0:
        total += x

even_sum = sum(x for x in a if x % 2 == 0)   # same, one line`,
    commonMistakes: ['Starting a product at 0.', 'Starting a running maximum at 0 when values can be negative.'],
    exercises: [ex('Sum all numbers from 1 to n that are divisible by 3 or 5.'), cf(116, 'A', 'Tram', 'track the running passenger count and its maximum.')],
    resources: [py('library/functions.html#sum', 'sum() — Python docs')],
  },
  {
    id: 'l-counting',
    title: 'Counting matching elements',
    description:
      'Many easy problems ask "how many items satisfy X". It is a counter plus a condition — and once you see it, sum(1 for x in a if cond) or sum(cond for x in a) expresses it in one line.',
    prerequisites: ['l-counters', 'f-logical'],
    difficulty: 'easy',
    estimatedMinutes: 25,
    objectives: ['Count items matching a compound condition', 'Count adjacent pairs that match a rule', 'Translate "how many" questions into a counting loop'],
    syntax: `cnt = 0
for x in a:
    if lo <= x <= hi:
        cnt += 1

pairs = sum(1 for i in range(n - 1) if s[i] == s[i + 1])`,
    commonMistakes: ['Comparing a[i] with a[i + 1] up to i = n - 1 (index out of range).'],
    exercises: [cf(158, 'A', 'Next Round'), cf(266, 'A', 'Stones on the Table'), ex('Count the numbers in a list that are strictly between their neighbours.')],
  },
  {
    id: 'l-flags',
    title: 'Boolean flags',
    description:
      'A flag is a bool that starts in one state and flips when something happens during the loop — "found a negative", "saw a repeat". Python also offers for…else and any()/all() for the same idea.',
    prerequisites: ['l-for', 'f-booleans'],
    difficulty: 'easy',
    estimatedMinutes: 25,
    objectives: ['Use a flag to remember an event across iterations', 'Rewrite a flag loop with any() or all()', 'Use for…else to detect "loop finished without break"'],
    syntax: `found = False
for x in a:
    if x < 0:
        found = True
        break

found = any(x < 0 for x in a)
sorted_ok = all(a[i] <= a[i + 1] for i in range(len(a) - 1))`,
    commonMistakes: ['Setting the flag back to False in an else branch inside the loop, erasing an earlier hit.'],
    exercises: [ex('Print YES if a list is strictly increasing.'), ex('Print YES if any two adjacent numbers in a list are equal.')],
    resources: [py('library/functions.html#any', 'any() — Python docs'), py('library/functions.html#all', 'all() — Python docs')],
  },
  {
    id: 'l-modulo',
    title: 'Modulo operator (%)',
    description:
      'a % b is the remainder after dividing a by b. It tests divisibility (a % b == 0), wraps values around a cycle (day of week, clock hours), and extracts the last digit (n % 10).',
    prerequisites: ['f-arithmetic'],
    difficulty: 'easy',
    estimatedMinutes: 25,
    objectives: ['Test divisibility with % == 0', 'Wrap an index around a cycle', 'Know that Python % is never negative for positive b'],
    syntax: `n % 2 == 0          # even
(day + k) % 7       # wrap around the week
n % 10              # last digit
-3 % 5              # 2 in Python (C++ gives -3)`,
    commonMistakes: ['Assuming % behaves like C++ for negatives.', 'Dividing by zero when b can be 0.'],
    exercises: [ex('Given today\'s weekday (0–6) and k days later, print the new weekday.'), cf(1328, 'A', 'Divisibility Problem')],
  },
  {
    id: 'l-even-odd',
    title: 'Even and odd number problems',
    description:
      'Parity is one of the most common observations in beginner Codeforces problems: sums of two odds are even, swapping preserves parity counts, and so on. Counting evens and odds often replaces a brute-force search.',
    prerequisites: ['l-modulo', 'l-for'],
    difficulty: 'easy',
    estimatedMinutes: 30,
    objectives: ['Count evens and odds in a list', 'Reason about the parity of sums and products', 'Spot parity arguments in problem statements'],
    syntax: `evens = sum(1 for x in a if x % 2 == 0)
odds = n - evens
# odd + odd = even, odd + even = odd, odd * anything even = even`,
    commonMistakes: ['Checking x % 2 == 1 for negative numbers in other languages; in Python it works, but x % 2 != 0 is clearer.'],
    exercises: [cf(4, 'A', 'Watermelon'), cf(318, 'A', 'Even Odds'), ex('Can a list be split into pairs with even sums? Reason with parity counts.')],
  },
  {
    id: 'l-infinite',
    title: 'Avoiding infinite loops',
    description:
      'An infinite loop shows up on the judge as "Time limit exceeded", which hides the real bug. Every loop needs a variable that changes toward the exit condition on every path through the body.',
    prerequisites: ['l-while'],
    difficulty: 'easy',
    estimatedMinutes: 20,
    objectives: ['Identify what makes a loop terminate', 'Check that every branch updates the loop variable', 'Add a temporary iteration cap while debugging'],
    syntax: `i = 0
while i < n:
    if a[i] == 0:
        i += 1      # forgetting this line hangs the program
        continue
    i += 1`,
    commonMistakes: ['A continue that skips the update at the bottom of the loop.', 'Floating-point conditions like while x != 1.0 that never become exactly true.'],
    exercises: [ex('Find and fix the bug: a while loop that skips zeros with continue but never advances.'), ex('Write a loop that halves n until it is odd, and prove it always stops for n > 0.')],
    resources: [PYTHON_TUTOR],
  },
])
