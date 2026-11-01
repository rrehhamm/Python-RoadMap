import { defineStage } from '../define'
import { cf, ex, py, PYTHON_TUTOR } from '../links'

export const fundamentals = defineStage('fundamentals', [
  {
    id: 'f-print-input',
    title: 'print() and input()',
    description:
      'input() reads one whole line from standard input and always returns a string. print() writes values to standard output, separated by spaces and followed by a newline. Every judge problem starts and ends with these two.',
    prerequisites: [],
    difficulty: 'easy',
    estimatedMinutes: 30,
    objectives: [
      'Read a single line of input and print it back',
      'Control separators and line endings with sep= and end=',
      'Explain why input() returns a string even when you type a number',
    ],
    syntax: `name = input()            # reads "Ada"
print("Hello,", name)       # Hello, Ada
print(1, 2, 3, sep="-")     # 1-2-3
print("no newline", end="")
print(*[4, 5, 6])           # 4 5 6  (unpack a list)`,
    commonMistakes: [
      'Printing extra text like "Answer:" — judges compare output exactly.',
      'Calling input() with a prompt string; the prompt gets printed and breaks the expected output.',
      'Forgetting that a trailing space or missing newline is usually fine, but extra words are not.',
    ],
    exercises: [
      ex('Read your name and print "Hello, <name>!" with no space before the "!".'),
      ex('Print the numbers 1 to 5 on one line separated by commas using a single print call.'),
      ex('Read two lines and print them in reverse order.'),
    ],
    resources: [
      py('library/functions.html#print', 'print() — Python docs'),
      py('library/functions.html#input', 'input() — Python docs'),
      py('tutorial/inputoutput.html', 'Tutorial: Input and Output'),
    ],
  },
  {
    id: 'f-variables',
    title: 'Variables and data types',
    description:
      'A variable is a name bound to a value. The core types you will use constantly are int (whole numbers of any size), float (decimals), str (text) and bool (True/False). type() tells you what you are holding.',
    prerequisites: ['f-print-input'],
    difficulty: 'easy',
    estimatedMinutes: 35,
    objectives: [
      'Create variables of type int, float, str and bool',
      'Use type() to inspect a value',
      'Know that Python ints never overflow, unlike C++ int',
    ],
    syntax: `n = 10            # int
price = 9.99      # float
word = "abc"      # str
ok = True         # bool
print(type(n))    # <class 'int'>
a, b = 3, 4       # multiple assignment
a, b = b, a       # swap without a temp variable`,
    commonMistakes: [
      'Using a name like list, sum or input as a variable — it hides the built-in function.',
      'Comparing floats with == (0.1 + 0.2 != 0.3). Prefer integers when the problem allows.',
    ],
    exercises: [
      ex('Swap two variables in one line and print both.'),
      ex('Print the type of 7, 7.0, "7" and True.'),
      ex('Compute 2 ** 100 and notice Python prints the exact value.'),
    ],
    resources: [
      py('tutorial/introduction.html', 'Tutorial: An informal introduction to Python'),
      py('library/stdtypes.html#numeric-types-int-float-complex', 'Numeric types'),
    ],
  },
  {
    id: 'f-type-conversion',
    title: 'int(), str(), and type conversion',
    description:
      'Because input() gives you text, you must convert it before doing arithmetic. int("42") gives 42, str(42) gives "42", float("2.5") gives 2.5. Conversions fail loudly with ValueError when the text is not a valid number.',
    prerequisites: ['f-variables'],
    difficulty: 'easy',
    estimatedMinutes: 30,
    objectives: [
      'Convert input text to int and float before calculating',
      'Convert numbers back to str to join them with text',
      'Recognise the ValueError raised by int("3.5") or int("")',
    ],
    syntax: `n = int(input())          # "42"  -> 42
x = float(input())        # "2.5" -> 2.5
s = str(n) + "!"          # "42!"
digits = len(str(n))      # count digits of a number
int("  7 ")               # 7 — surrounding whitespace is fine
int("3.5")                # ValueError`,
    commonMistakes: [
      'Writing input() + 1 — that is str + int and raises TypeError.',
      'Using int() on a float string; convert with float() first or read it as int if the problem guarantees integers.',
      'Concatenating "Total: " + total where total is an int.',
    ],
    exercises: [
      ex('Read a number n and print n + 1.'),
      ex('Read an integer and print how many digits it has using str().'),
      cf(4, 'A', 'Watermelon', 'read one integer and decide with a condition.'),
    ],
    resources: [
      py('library/functions.html#int', 'int() — Python docs'),
      py('library/functions.html#func-str', 'str() — Python docs'),
    ],
  },
  {
    id: 'f-split',
    title: 'input().split()',
    description:
      'Most problems put several values on one line, like "3 7". split() breaks a string on whitespace into a list of strings: "3 7".split() is ["3", "7"]. You then convert each piece.',
    prerequisites: ['f-type-conversion'],
    difficulty: 'easy',
    estimatedMinutes: 25,
    objectives: [
      'Read two or three numbers from one line and unpack them',
      'Know that split() with no argument handles multiple spaces',
      'Split on a custom separator like "," when needed',
    ],
    syntax: `a, b = input().split()          # strings
a, b = int(a), int(b)
x, y, z = input().split()
parts = "1,2,3".split(",")      # ['1', '2', '3']`,
    commonMistakes: [
      'Unpacking into the wrong number of variables → "too many values to unpack".',
      'Using split(" ") instead of split(): it breaks on double spaces and leaves empty strings.',
    ],
    exercises: [
      ex('Read two integers on one line and print their sum.'),
      ex('Read a line of words and print how many words it contains.'),
      cf(50, 'A', 'Domino piling', 'read M and N from one line.'),
    ],
    resources: [py('library/stdtypes.html#string-methods', 'str.split() and other string methods')],
  },
  {
    id: 'f-map',
    title: 'map() and list(map())',
    description:
      'map(int, input().split()) applies int to every piece in one step. Unpack it directly for a fixed count, or wrap it in list(...) when you need to index or loop over the values more than once.',
    prerequisites: ['f-split'],
    difficulty: 'easy',
    estimatedMinutes: 30,
    objectives: [
      'Read a fixed number of integers with a, b = map(int, input().split())',
      'Read a whole array with list(map(int, input().split()))',
      'Understand that a map object is consumed after one pass',
    ],
    syntax: `n, k = map(int, input().split())
arr = list(map(int, input().split()))

# The standard opening of most solutions:
n = int(input())
a = list(map(int, input().split()))

# Faster for very large input:
import sys
input = sys.stdin.readline`,
    commonMistakes: [
      'Indexing a map object: m[0] fails — convert with list() first.',
      'Looping over the same map twice; the second loop sees nothing.',
      'Reading with sys.stdin.readline and forgetting it keeps the trailing "\\n" on string input (use .strip()).',
    ],
    exercises: [
      ex('Read n, then n integers on the next line, and print their sum.'),
      ex('Read three integers and print the largest without using max().'),
      cf(546, 'A', 'Soldier and Bananas'),
    ],
    resources: [py('library/functions.html#map', 'map() — Python docs'), py('library/sys.html', 'sys module (sys.stdin)')],
  },
  {
    id: 'f-arithmetic',
    title: 'Arithmetic operators',
    description:
      'Python has + - * for the basics, / for true division (always a float), // for floor division, % for remainder and ** for powers. Competitive programming leans heavily on // and % because answers are usually integers.',
    prerequisites: ['f-variables'],
    difficulty: 'easy',
    estimatedMinutes: 35,
    objectives: [
      'Choose between / and // for a given problem',
      'Use ** for exponentiation and pow(a, b, m) for modular power',
      'Predict operator precedence without extra parentheses',
    ],
    syntax: `7 / 2    # 3.5   float division
7 // 2   # 3     floor division
-7 // 2  # -4    floors toward -infinity
7 % 2    # 1
2 ** 10  # 1024
(a + b - 1) // b   # ceiling division without floats`,
    commonMistakes: [
      'Using / and then int() on huge numbers — floats lose precision above about 2**53.',
      'Expecting -7 // 2 to be -3 as in C++; Python floors.',
      'Writing math.ceil(a / b) for big integers instead of (a + b - 1) // b.',
    ],
    exercises: [
      ex('Read a and b and print a // b, a % b and a / b.'),
      cf(1, 'A', 'Theatre Square', 'needs ceiling division with large values.'),
      cf(617, 'A', 'Elephant'),
    ],
    resources: [py('library/stdtypes.html#numeric-types-int-float-complex', 'Numeric types and operators')],
  },
  {
    id: 'f-comparison',
    title: 'Comparison operators',
    description:
      'Comparisons (==, !=, <, <=, >, >=) produce a bool. Python lets you chain them, so 1 <= x <= 10 reads exactly like maths. Strings compare lexicographically, character by character.',
    prerequisites: ['f-arithmetic'],
    difficulty: 'easy',
    estimatedMinutes: 20,
    objectives: [
      'Write chained comparisons like lo <= x < hi',
      'Know that "10" < "9" is True for strings but 10 < 9 is False for ints',
      'Distinguish = (assignment) from == (comparison)',
    ],
    syntax: `x == y, x != y
1 <= x <= 100        # chained
"apple" < "banana"   # True, lexicographic
"Z" < "a"            # True — uppercase sorts first`,
    commonMistakes: [
      'Comparing numbers that are still strings straight from input().',
      'Using "is" instead of == for values; "is" checks identity.',
    ],
    exercises: [
      ex('Read two integers and print "bigger", "smaller" or "equal" for the first one.'),
      cf(791, 'A', 'Bear and Big Brother'),
    ],
    resources: [py('library/stdtypes.html#comparisons', 'Comparisons — Python docs')],
  },
  {
    id: 'f-if',
    title: 'if, elif, and else',
    description:
      'Branching lets the program choose between outputs. Conditions are checked top to bottom and only the first true branch runs. Indentation, not braces, defines which lines belong to a branch.',
    prerequisites: ['f-comparison'],
    difficulty: 'easy',
    estimatedMinutes: 35,
    objectives: [
      'Write if / elif / else chains whose branches do not overlap',
      'Order conditions so special cases are checked first',
      'Use a conditional expression for short choices',
    ],
    syntax: `if n % 2 == 0:
    print("even")
elif n < 0:
    print("negative odd")
else:
    print("odd")

print("YES" if ok else "NO")   # conditional expression`,
    commonMistakes: [
      'Mixing tabs and spaces in indentation.',
      'Using separate if statements where elif was intended, so two branches run.',
      'Printing "Yes" when the judge expects "YES" (check the statement — many CF problems accept any case, some do not).',
    ],
    exercises: [
      cf(4, 'A', 'Watermelon', 'mind the special case w = 2.'),
      ex('Read a score 0–100 and print a grade A/B/C/D/F.'),
      cf(1328, 'A', 'Divisibility Problem'),
    ],
    resources: [py('tutorial/controlflow.html#if-statements', 'Tutorial: if statements')],
  },
  {
    id: 'f-logical',
    title: 'Logical operators: and, or, not',
    description:
      'and, or and not combine conditions. They short-circuit: in a and b, b is not evaluated when a is false. This matters when the second check would crash, such as indexing past the end of a list.',
    prerequisites: ['f-if'],
    difficulty: 'easy',
    estimatedMinutes: 25,
    objectives: [
      'Combine conditions with and / or and negate with not',
      'Use short-circuiting to guard risky checks',
      'Simplify nested ifs into one combined condition',
    ],
    syntax: `if a > 0 and b > 0: ...
if x < lo or x > hi: ...
if not found: ...
if i < len(a) and a[i] == t: ...   # safe: short-circuit`,
    commonMistakes: [
      'Writing if x == 1 or 2 — always true. Use x == 1 or x == 2, or x in (1, 2).',
      'Using & and | (bitwise) instead of and / or on booleans with comparisons, which breaks precedence.',
    ],
    exercises: [
      ex('Print "YES" if a year is a leap year (divisible by 4 and not by 100, or divisible by 400).'),
      ex('Read three side lengths and decide whether they form a valid triangle.'),
    ],
    resources: [py('library/stdtypes.html#boolean-operations-and-or-not', 'Boolean operations — Python docs')],
  },
  {
    id: 'f-booleans',
    title: 'Boolean values: True and False',
    description:
      'bool is a subtype of int: True == 1 and False == 0, so sum() over a list of comparisons counts how many are true. Empty strings, empty lists, 0 and None are "falsy" in an if.',
    prerequisites: ['f-comparison'],
    difficulty: 'easy',
    estimatedMinutes: 20,
    objectives: [
      'Store the result of a comparison in a variable and reuse it',
      'Count true conditions with sum()',
      'Know which values are falsy',
    ],
    syntax: `is_even = n % 2 == 0
count = sum(x > 0 for x in a)   # booleans add as 0/1
if not a:                        # empty list is falsy
    print(-1)`,
    commonMistakes: [
      'Writing if flag == True: instead of if flag:.',
      'Treating 0 as "missing" with if not value: when 0 is a valid answer.',
    ],
    exercises: [
      ex('Read n integers and print how many are positive using sum() with a comparison.'),
      cf(231, 'A', 'Team', 'count friends who are sure on each line.'),
    ],
    resources: [py('library/stdtypes.html#truth-value-testing', 'Truth value testing'), PYTHON_TUTOR],
  },
])
