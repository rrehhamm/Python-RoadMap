import { defineStage } from '../define'
import { cf, cfSet, cpa, ex, py } from '../links'

export const math = defineStage('math', [
  {
    id: 'm-divmod',
    title: 'Integer division and modulo',
    description: 'n // k and n % k together describe how n splits into groups of k: full groups and leftovers. divmod(n, k) returns both. Ceiling division, rounding up to a multiple, and converting units all build on this.',
    prerequisites: ['l-modulo'],
    difficulty: 'easy',
    estimatedMinutes: 25,
    objectives: ['Split n into full groups and remainder', 'Compute ceil(a / b) with integers', 'Round n up to the next multiple of k'],
    syntax: `q, r = divmod(n, k)
ceil_div = (a + b - 1) // b      # or -(-a // b)
next_mult = (n + k - 1) // k * k`,
    commonMistakes: ['Using math.ceil(a / b) when a and b are huge.'],
    exercises: [cf(1, 'A', 'Theatre Square'), cf(977, 'A', 'Wrong Subtraction')],
    resources: [py('library/functions.html#divmod', 'divmod() — Python docs')],
  },
  {
    id: 'm-digits',
    title: 'Digit extraction',
    description: 'n % 10 is the last digit and n // 10 drops it. Repeating until n is 0 visits every digit from right to left. The string route, str(n), is simpler when you just need the digits in order.',
    prerequisites: ['m-divmod', 'l-while'],
    difficulty: 'easy',
    estimatedMinutes: 25,
    objectives: ['Extract digits arithmetically and with str()', 'Handle n = 0 correctly', 'Reverse a number arithmetically'],
    syntax: `while n > 0:
    d = n % 10
    n //= 10
digits = [int(c) for c in str(n)]`,
    commonMistakes: ['A while n > 0 loop that never runs for n = 0, so "0 has one digit" is lost.'],
    exercises: [cf(110, 'A', 'Nearly Lucky Number'), cf(271, 'A', 'Beautiful Year', 'check that all digits are distinct.')],
  },
  {
    id: 'm-digit-sum',
    title: 'Digit sums',
    description: 'The digit sum adds the digits of a number. It shows up in divisibility rules (divisible by 3 or 9 exactly when the digit sum is) and in many "repeat until one digit" puzzles.',
    prerequisites: ['m-digits'],
    difficulty: 'easy',
    estimatedMinutes: 20,
    objectives: ['Compute a digit sum two ways', 'Use the divisibility-by-3 and by-9 rules', 'Repeat the digit sum until one digit remains'],
    syntax: `s = sum(map(int, str(n)))
# digital root for n > 0:
root = 1 + (n - 1) % 9`,
    commonMistakes: ['Converting a negative number with str() and trying int("-").'],
    exercises: [ex('Find the smallest number ≥ n whose digit sum is divisible by 4.'), ex('Compute the digital root by repeated digit sums, then check it with the formula.')],
  },
  {
    id: 'm-divisors',
    title: 'Divisors and multiples',
    description: 'Divisors come in pairs (d, n // d), so checking d only up to √n finds them all in O(√n) instead of O(n). Counting multiples of k up to n is just n // k.',
    prerequisites: ['m-divmod', 'l-range'],
    difficulty: 'medium',
    estimatedMinutes: 35,
    objectives: ['List all divisors in O(√n)', 'Avoid double-counting the square root', 'Count multiples of k in a range [a, b]'],
    syntax: `divs = []
d = 1
while d * d <= n:
    if n % d == 0:
        divs.append(d)
        if d != n // d:
            divs.append(n // d)
    d += 1
count_in_range = b // k - (a - 1) // k`,
    commonMistakes: ['Looping d up to n for n up to 10⁹ — time limit exceeded.', 'Using int(n ** 0.5) for huge n; prefer math.isqrt(n).'],
    exercises: [ex('Print all divisors of n in increasing order.'), cf(1328, 'A', 'Divisibility Problem')],
    resources: [py('library/math.html#math.isqrt', 'math.isqrt — Python docs')],
  },
  {
    id: 'm-primes',
    title: 'Prime numbers',
    description: 'Test one number for primality by trial division up to √n. When you need all primes up to N, the Sieve of Eratosthenes finds them in about O(N log log N).',
    prerequisites: ['m-divisors', 'p-complexity'],
    difficulty: 'medium',
    estimatedMinutes: 40,
    objectives: ['Write an O(√n) primality test', 'Implement the sieve', 'Factorise n into primes by trial division'],
    syntax: `def is_prime(n):
    if n < 2: return False
    i = 2
    while i * i <= n:
        if n % i == 0: return False
        i += 1
    return True

sieve = [True] * (N + 1); sieve[0] = sieve[1] = False
for i in range(2, int(N ** 0.5) + 1):
    if sieve[i]:
        sieve[i*i::i] = [False] * len(range(i*i, N + 1, i))`,
    commonMistakes: ['Treating 1 as prime.', 'Running trial division separately for each of 10⁵ queries instead of sieving once.'],
    exercises: [cf(26, 'A', 'Almost Prime'), cf(230, 'B', 'T-primes', 'harder: needs a sieve plus a square check.')],
    resources: [cpa('algebra/sieve-of-eratosthenes.html', 'Sieve of Eratosthenes')],
  },
  {
    id: 'm-gcd-lcm',
    title: 'GCD and LCM',
    description: 'The greatest common divisor is the largest number dividing both a and b; the least common multiple is the smallest number both divide. They are linked: lcm(a, b) = a // gcd(a, b) * b.',
    prerequisites: ['m-divisors'],
    difficulty: 'easy',
    estimatedMinutes: 25,
    objectives: ['Use math.gcd and math.lcm', 'Derive LCM from GCD without overflow worries', 'Take the GCD of a whole list'],
    syntax: `from math import gcd, lcm
from functools import reduce
g = reduce(gcd, a)
l = a // gcd(a, b) * b`,
    commonMistakes: ['Assuming gcd(0, x) is an error — it is x.'],
    exercises: [ex('Find the GCD of a list of numbers.'), ex('Given a and b, find the smallest number divisible by both.')],
    resources: [py('library/math.html#math.gcd', 'math.gcd — Python docs')],
  },
  {
    id: 'm-euclid',
    title: 'Greatest common divisor algorithms',
    description: 'Euclid\'s algorithm uses gcd(a, b) = gcd(b, a % b) and finishes in O(log min(a, b)) steps. The extended version also finds x, y with ax + by = gcd(a, b), the key to modular inverses.',
    prerequisites: ['m-gcd-lcm'],
    difficulty: 'medium',
    estimatedMinutes: 35,
    objectives: ['Implement Euclid iteratively and recursively', 'Explain why it runs in logarithmic time', 'Implement the extended Euclidean algorithm'],
    syntax: `def gcd(a, b):
    while b:
        a, b = b, a % b
    return a

def ext_gcd(a, b):
    if b == 0: return a, 1, 0
    g, x, y = ext_gcd(b, a % b)
    return g, y, x - (a // b) * y`,
    commonMistakes: ['Swapping the order of x and y in the extended version.'],
    exercises: [ex('Trace gcd(252, 105) by hand.'), ex('Find integers x, y with 30x + 18y = 6.')],
    resources: [cpa('algebra/euclid-algorithm.html', 'Euclidean algorithm'), cpa('algebra/extended-euclid-algorithm.html', 'Extended Euclidean algorithm')],
  },
  {
    id: 'm-pow',
    title: 'Basic exponentiation',
    description: '** computes exact powers, but for "answer modulo 10⁹+7" use the built-in pow(base, exp, mod), which runs in O(log exp) by squaring. Knowing how binary exponentiation works lets you apply it to matrices later.',
    prerequisites: ['m-divmod'],
    difficulty: 'medium',
    estimatedMinutes: 30,
    objectives: ['Use pow(a, b, m) for modular powers', 'Implement binary exponentiation by hand', 'Reduce intermediate values modulo m'],
    syntax: `MOD = 10**9 + 7
pow(2, n, MOD)
pow(a, MOD - 2, MOD)      # modular inverse when MOD is prime

def power(a, b, m):
    r = 1
    while b:
        if b & 1: r = r * a % m
        a = a * a % m
        b >>= 1
    return r`,
    commonMistakes: ['Computing 2 ** n first and then taking % MOD for huge n — slow and memory-hungry.'],
    exercises: [ex('Compute 2^n mod 10⁹+7 for n up to 10¹⁸.'), ex('Implement power() and compare it with built-in pow on random inputs.')],
    resources: [cpa('algebra/binary-exp.html', 'Binary exponentiation'), py('library/functions.html#pow', 'pow() — Python docs')],
  },
  {
    id: 'm-patterns',
    title: 'Number patterns',
    description: 'Many easy maths problems hide a formula. Print the brute-force answers for n = 1..20, look for a pattern (periodic, arithmetic, quadratic), then prove or at least sanity-check it before submitting.',
    prerequisites: ['m-divisors', 'p-dry-run'],
    difficulty: 'medium',
    estimatedMinutes: 35,
    objectives: ['Generate small cases with brute force', 'Recognise arithmetic and periodic sequences', 'Use 1 + 2 + … + n = n(n+1)/2 and similar identities'],
    syntax: `for n in range(1, 21):
    print(n, brute(n))
total = n * (n + 1) // 2`,
    commonMistakes: ['Submitting a guessed formula that only matches the samples.'],
    exercises: [cf(318, 'A', 'Even Odds'), cf(486, 'A', 'Calculating Function')],
  },
  {
    id: 'm-number-theory',
    title: 'Introductory number theory',
    description: 'Modular arithmetic rules ((a + b) % m, (a · b) % m), prime factorisation, and counting divisors from the factorisation are the core of most rated-1000–1400 number theory problems.',
    prerequisites: ['m-primes', 'm-euclid'],
    difficulty: 'hard',
    estimatedMinutes: 60,
    objectives: ['Apply modular addition and multiplication rules', 'Count divisors from a prime factorisation', 'Recognise when a problem reduces to GCD or parity'],
    syntax: `def factorize(n):
    f = {}
    d = 2
    while d * d <= n:
        while n % d == 0:
            f[d] = f.get(d, 0) + 1
            n //= d
        d += 1
    if n > 1: f[n] = f.get(n, 0) + 1
    return f
# number of divisors = product of (e + 1)`,
    commonMistakes: ['Applying % to a subtraction and getting a negative in other languages (Python is fine, but stay aware).', 'Dividing under a modulus without a modular inverse.'],
    exercises: [cf(230, 'B', 'T-primes'), ex('Count the divisors of n ≤ 10¹² using factorisation.')],
    resources: [cfSet(['number theory', '1000-1200'], 'Codeforces: number theory, 1000–1200')],
  },
])
