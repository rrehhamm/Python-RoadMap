import { defineStage } from '../define'
import { CSES_BOOK, cfSet, cpa, ex } from '../links'

export const advanced = defineStage('advanced', [
  {
    id: 'x-sliding',
    title: 'Sliding window',
    description: 'A window [l, r] slides across the array: extend r, and shrink l while the window breaks a rule. Each index enters and leaves once, so problems like "longest subarray with at most k distinct values" run in O(n).',
    prerequisites: ['h-two-pointers', 'h-freq-dict'],
    difficulty: 'medium',
    estimatedMinutes: 50,
    objectives: ['Write fixed-size and variable-size windows', 'Maintain window state incrementally', 'Know when the window must shrink'],
    syntax: `l = 0
cnt = {}
for r, x in enumerate(a):
    cnt[x] = cnt.get(x, 0) + 1
    while len(cnt) > k:
        cnt[a[l]] -= 1
        if cnt[a[l]] == 0: del cnt[a[l]]
        l += 1
    best = max(best, r - l + 1)`,
    commonMistakes: ['Recomputing the window from scratch each step (O(n·k)).'],
    exercises: [ex('Longest substring without repeating characters.'), ex('Maximum sum of any window of size k.')],
    resources: [cfSet(['two pointers', '1300-1500'], 'Codeforces: two pointers, 1300–1500')],
  },
  {
    id: 'x-bits',
    title: 'Bit manipulation',
    description: 'Integers are bit strings. &, |, ^, << and >> test and change bits; masks from 0 to 2ⁿ - 1 enumerate every subset of n items. XOR has the handy property x ^ x = 0.',
    prerequisites: ['m-digits', 'g-recursion'],
    difficulty: 'medium',
    estimatedMinutes: 45,
    objectives: ['Test, set and clear the k-th bit', 'Enumerate subsets with bitmasks', 'Use XOR to find the unpaired element'],
    syntax: `(x >> k) & 1        # k-th bit
x | (1 << k)        # set
x & ~(1 << k)       # clear
x.bit_count()       # popcount (Python 3.10+)
for mask in range(1 << n): ...`,
    commonMistakes: ['Operator precedence: x & 1 == 0 parses as x & (1 == 0). Use parentheses.'],
    exercises: [ex('Find the only number that appears once when all others appear twice.'), ex('Check all 2ⁿ subsets for one with sum exactly s (n ≤ 20).')],
    resources: [cpa('algebra/bit-manipulation.html', 'Bit manipulation'), cfSet(['bitmasks', '1000-1300'], 'Codeforces: bitmasks, 1000–1300')],
  },
  {
    id: 'x-intervals',
    title: 'Interval problems',
    description: 'Interval problems — merge overlaps, pick the most non-overlapping, count maximum overlap — almost always start by sorting by start or end, then sweeping left to right.',
    prerequisites: ['ss-key', 'g-greedy'],
    difficulty: 'medium',
    estimatedMinutes: 45,
    objectives: ['Merge overlapping intervals', 'Select the maximum number of disjoint intervals by earliest end', 'Count maximum overlap with a sweep of +1/-1 events'],
    syntax: `iv.sort()
merged = [iv[0]]
for s, e in iv[1:]:
    if s <= merged[-1][1]:
        merged[-1][1] = max(merged[-1][1], e)
    else:
        merged.append([s, e])`,
    commonMistakes: ['Sorting by start when the greedy needs earliest end.', 'Treating touching endpoints inconsistently.'],
    exercises: [ex('Maximum number of non-overlapping meetings.'), ex('Maximum number of guests present at the same time.')],
  },
  {
    id: 'x-mono-stack',
    title: 'Monotonic stack',
    description: 'A stack kept in increasing (or decreasing) order answers "nearest smaller/greater element to the left or right" for every index in O(n) total, because each index is pushed and popped once.',
    prerequisites: ['d-stack', 'h-patterns'],
    difficulty: 'hard',
    estimatedMinutes: 50,
    objectives: ['Find the next greater element for each index', 'Compute the largest rectangle in a histogram', 'Explain the amortised O(n) bound'],
    syntax: `res = [-1] * n
st = []                    # indices, values decreasing
for i, x in enumerate(a):
    while st and a[st[-1]] < x:
        res[st.pop()] = i
    st.append(i)`,
    commonMistakes: ['Storing values instead of indices when you need positions.'],
    exercises: [ex('Next greater element to the right for every index.'), ex('Largest rectangle in a histogram.')],
    resources: [cpa('data_structures/stack_queue_modification.html', 'Minimum stack / queue')],
  },
  {
    id: 'x-dsu',
    title: 'Disjoint Set Union (DSU)',
    description: 'DSU (union-find) keeps track of which elements are in the same group, with near-constant-time union and find using path compression and union by size. It handles dynamic connectivity and Kruskal\'s MST.',
    prerequisites: ['g-components'],
    difficulty: 'hard',
    estimatedMinutes: 50,
    objectives: ['Implement find with path compression', 'Union by size', 'Count components as edges are added'],
    syntax: `parent = list(range(n)); size = [1] * n
def find(x):
    while parent[x] != x:
        parent[x] = parent[parent[x]]
        x = parent[x]
    return x
def union(a, b):
    a, b = find(a), find(b)
    if a == b: return False
    if size[a] < size[b]: a, b = b, a
    parent[b] = a; size[a] += size[b]
    return True`,
    commonMistakes: ['Comparing parent[a] == parent[b] instead of find(a) == find(b).'],
    exercises: [ex('Process edges one by one and print the number of components after each.'), ex("Minimum spanning tree with Kruskal's algorithm.")],
    resources: [cpa('data_structures/disjoint_set_union.html', 'Disjoint Set Union'), cfSet(['dsu', '1200-1500'], 'Codeforces: dsu, 1200–1500')],
  },
  {
    id: 'x-adv-graph',
    title: 'Advanced graph algorithms',
    description: 'Beyond BFS/DFS/Dijkstra: minimum spanning trees, cycle detection in directed graphs, bipartite checks, Floyd–Warshall for all pairs on small n, and lowest common ancestor on trees.',
    prerequisites: ['g-shortest', 'g-topo', 'x-dsu'],
    difficulty: 'hard',
    estimatedMinutes: 90,
    objectives: ['Build an MST with Kruskal', 'Check bipartiteness with BFS colouring', 'Run Floyd–Warshall for n ≤ 400'],
    commonMistakes: ['Applying an O(n³) algorithm to n = 10⁵.'],
    exercises: [ex('Check whether a graph can be 2-coloured.'), ex('All-pairs shortest distances for n ≤ 100.')],
    resources: [cfSet(['graphs', '1300-1600'], 'Codeforces: graphs, 1300–1600'), CSES_BOOK],
  },
  {
    id: 'x-adv-dp',
    title: 'Advanced dynamic programming',
    description: 'Harder DP adds dimensions or structure: knapsack, DP over subsets with bitmasks, DP on trees, and interval DP. The method stays the same — state, transition, order — but states need more thought.',
    prerequisites: ['g-memo', 'x-bits'],
    difficulty: 'hard',
    estimatedMinutes: 120,
    objectives: ['Solve 0/1 knapsack in O(n·W)', 'Write a bitmask DP over subsets', 'Write a DP over a rooted tree'],
    syntax: `dp = [0] * (W + 1)
for w, v in items:
    for c in range(W, w - 1, -1):   # backwards for 0/1
        dp[c] = max(dp[c], dp[c - w] + v)`,
    commonMistakes: ['Iterating capacity forwards in 0/1 knapsack (that solves the unbounded version).'],
    exercises: [ex('0/1 knapsack with n ≤ 100, W ≤ 10⁵.'), ex('Travelling salesman for n ≤ 15 with bitmask DP.')],
    resources: [cfSet(['dp', '1400-1700'], 'Codeforces: dp, 1400–1700')],
  },
  {
    id: 'x-adv-nt',
    title: 'Advanced number theory',
    description: 'Modular inverses, combinations nCr mod p with precomputed factorials, Euler\'s totient and the linear sieve power many 1400+ problems. They build directly on GCD, fast exponentiation and factorisation.',
    prerequisites: ['m-number-theory', 'm-pow'],
    difficulty: 'hard',
    estimatedMinutes: 90,
    objectives: ['Compute nCr mod p with factorial tables', "Compute Euler's totient", 'Use Fermat for modular inverses'],
    syntax: `MOD = 10**9 + 7
fact = [1] * (N + 1)
for i in range(1, N + 1): fact[i] = fact[i - 1] * i % MOD
inv = [1] * (N + 1)
inv[N] = pow(fact[N], MOD - 2, MOD)
for i in range(N, 0, -1): inv[i - 1] = inv[i] * i % MOD
def C(n, r): return fact[n] * inv[r] % MOD * inv[n - r] % MOD if 0 <= r <= n else 0`,
    commonMistakes: ['Using Fermat inverses with a non-prime modulus.'],
    exercises: [ex('Number of paths in an n × m grid modulo 10⁹+7.'), ex("Compute Euler's totient for all numbers up to 10⁶.")],
    resources: [cpa('algebra/phi-function.html', "Euler's totient function"), cpa('algebra/module-inverse.html', 'Modular inverse')],
  },
])
