import { defineStage } from '../define'
import { CSES, cf, cfSet, cpa, ex, py, usaco } from '../links'

export const algorithms = defineStage('algorithms', [
  {
    id: 'g-recursion',
    title: 'Recursion',
    description: 'A recursive function solves a problem by calling itself on a smaller version, with a base case that stops. Python limits recursion depth to about 1000 by default, so deep recursion needs care.',
    prerequisites: ['p-dry-run', 'm-digit-sum'],
    difficulty: 'medium',
    estimatedMinutes: 45,
    objectives: ['Write a recursive function with a correct base case', 'Trace the call stack for a small input', 'Raise the recursion limit or convert to a loop when needed'],
    syntax: `import sys
sys.setrecursionlimit(10**6)

def digit_sum(n):
    if n < 10:
        return n
    return n % 10 + digit_sum(n // 10)`,
    commonMistakes: ['Missing base case → RecursionError.', 'Raising the limit too high and crashing the interpreter on deep inputs; prefer iteration for depth ~10⁵.'],
    exercises: [ex('Write recursive factorial, power and digit-sum functions.'), ex('Print all binary strings of length n recursively.')],
    resources: [py('library/sys.html#sys.setrecursionlimit', 'sys.setrecursionlimit — Python docs')],
  },
  {
    id: 'g-backtracking',
    title: 'Backtracking',
    description: 'Backtracking builds a solution one choice at a time and undoes the choice when it leads nowhere. It enumerates permutations, subsets and placements, and works when n is small (around 20 or less).',
    prerequisites: ['g-recursion'],
    difficulty: 'hard',
    estimatedMinutes: 60,
    objectives: ['Generate all subsets and permutations', 'Prune branches that cannot succeed', 'Estimate the search size from n'],
    syntax: `def go(i, cur):
    if i == n:
        results.append(cur[:]); return
    go(i + 1, cur)          # skip a[i]
    cur.append(a[i])
    go(i + 1, cur)          # take a[i]
    cur.pop()               # undo`,
    commonMistakes: ['Appending cur instead of a copy, so every saved result changes later.'],
    exercises: [ex('Print all permutations of 1..n in lexicographic order.'), ex('Solve n-queens for n ≤ 8 and count the solutions.')],
    resources: [CSES],
  },
  {
    id: 'g-greedy',
    title: 'Greedy algorithms',
    description: 'A greedy algorithm makes the locally best choice at each step and never revisits it. It is fast and simple but only correct when you can argue that a best choice now never hurts later — check it against brute force.',
    prerequisites: ['ss-key'],
    difficulty: 'medium',
    estimatedMinutes: 50,
    objectives: ['Recognise when sorting plus a greedy choice works', 'Find a counterexample to a wrong greedy idea', 'Justify a greedy with an exchange argument'],
    syntax: `coins = [100, 20, 10, 5, 1]
count = 0
for c in coins:
    count += n // c
    n %= c`,
    commonMistakes: ['Trusting a greedy because it passes the samples.'],
    exercises: [cf(996, 'A', 'Hit the Lottery'), cf(160, 'A', 'Twins'), cf(489, 'B', 'BerSU Ball')],
    resources: [cfSet(['greedy', '800-1000'], 'Codeforces: greedy, 800–1000')],
  },
  {
    id: 'g-bfs',
    title: 'Breadth-first search (BFS)',
    description: 'BFS explores a graph level by level using a queue. In an unweighted graph it finds the shortest number of edges from the start to every node in O(n + m).',
    prerequisites: ['d-deque', 'd-adjacency'],
    difficulty: 'medium',
    estimatedMinutes: 50,
    objectives: ['Implement BFS with deque and a distance array', 'Find shortest paths on a grid', 'Reconstruct the path with a parent array'],
    syntax: `from collections import deque
dist = [-1] * n
dist[s] = 0
q = deque([s])
while q:
    u = q.popleft()
    for v in adj[u]:
        if dist[v] == -1:
            dist[v] = dist[u] + 1
            q.append(v)`,
    commonMistakes: ['Marking nodes visited when popped instead of when pushed, causing duplicates in the queue.'],
    exercises: [ex('Shortest path in a grid maze from S to E.'), ex('Count how many nodes are exactly k edges from node 1.')],
    resources: [cpa('graph/breadth-first-search.html', 'Breadth-first search'), usaco('silver/graph-traversal', 'Graph Traversal')],
  },
  {
    id: 'g-dfs',
    title: 'Depth-first search (DFS)',
    description: 'DFS follows one path as deep as possible before backtracking. It powers reachability, cycle detection and tree computations. In Python, an explicit stack avoids recursion-depth limits.',
    prerequisites: ['g-recursion', 'd-adjacency'],
    difficulty: 'medium',
    estimatedMinutes: 50,
    objectives: ['Implement DFS recursively and with a stack', 'Compute subtree sizes on a tree', 'Detect a cycle in an undirected graph'],
    syntax: `seen = [False] * n
stack = [s]
while stack:
    u = stack.pop()
    if seen[u]: continue
    seen[u] = True
    for v in adj[u]:
        if not seen[v]:
            stack.append(v)`,
    commonMistakes: ['Recursive DFS on a path of 10⁵ nodes hitting the recursion limit.'],
    exercises: [ex('Check whether node t is reachable from node s.'), ex('Compute subtree sizes for a rooted tree.')],
    resources: [cpa('graph/depth-first-search.html', 'Depth-first search')],
  },
  {
    id: 'g-components',
    title: 'Connected components',
    description: 'Run BFS or DFS from every unvisited node; each run discovers one connected component. Counting components answers "how many groups" and "how many edges to connect everything" (components - 1).',
    prerequisites: ['g-dfs'],
    difficulty: 'medium',
    estimatedMinutes: 35,
    objectives: ['Count connected components', 'Label each node with its component id', 'Count islands in a grid'],
    syntax: `comp = [-1] * n
c = 0
for s in range(n):
    if comp[s] == -1:
        # BFS/DFS from s, setting comp[v] = c
        c += 1`,
    commonMistakes: ['Starting the search only from node 0.'],
    exercises: [ex('Count the islands of "#" in a grid.'), ex('Print the minimum roads needed to connect all cities.')],
    resources: [cpa('graph/search-for-connected-components.html', 'Connected components')],
  },
  {
    id: 'g-topo',
    title: 'Topological sorting',
    description: 'A topological order lists the nodes of a directed acyclic graph so every edge points forward — exactly how this roadmap orders prerequisites. Kahn\'s algorithm repeatedly removes nodes with no incoming edges.',
    prerequisites: ['g-dfs', 'g-bfs'],
    difficulty: 'medium',
    estimatedMinutes: 45,
    objectives: ["Implement Kahn's algorithm with in-degrees", 'Detect a cycle when not all nodes are output', 'Produce the lexicographically smallest order with a heap'],
    syntax: `indeg = [0] * n
for u in range(n):
    for v in adj[u]: indeg[v] += 1
q = deque(i for i in range(n) if indeg[i] == 0)
order = []
while q:
    u = q.popleft(); order.append(u)
    for v in adj[u]:
        indeg[v] -= 1
        if indeg[v] == 0: q.append(v)`,
    commonMistakes: ['Not checking len(order) == n to detect cycles.'],
    exercises: [ex('Order courses given prerequisite pairs, or report that it is impossible.')],
    resources: [cpa('graph/topological-sort.html', 'Topological sorting')],
  },
  {
    id: 'g-shortest',
    title: 'Shortest path algorithms',
    description: 'For non-negative weights, Dijkstra\'s algorithm with a heap finds shortest distances in O((n + m) log n). BFS covers unweighted graphs, and 0-1 BFS covers weights that are only 0 or 1.',
    prerequisites: ['g-bfs', 'd-heap'],
    difficulty: 'hard',
    estimatedMinutes: 60,
    objectives: ['Implement Dijkstra with heapq', 'Skip stale heap entries', 'Choose between BFS, 0-1 BFS and Dijkstra'],
    syntax: `import heapq
INF = float('inf')
dist = [INF] * n; dist[s] = 0
h = [(0, s)]
while h:
    d, u = heapq.heappop(h)
    if d > dist[u]: continue
    for v, w in adj[u]:
        if d + w < dist[v]:
            dist[v] = d + w
            heapq.heappush(h, (dist[v], v))`,
    commonMistakes: ['Using Dijkstra with negative edge weights.', 'Forgetting the stale-entry check, making it much slower.'],
    exercises: [ex('Shortest travel time between two cities with weighted roads.')],
    resources: [cpa('graph/dijkstra.html', "Dijkstra's algorithm"), cfSet(['shortest paths'], 'Codeforces: shortest paths')],
  },
  {
    id: 'g-dp-intro',
    title: 'Introductory dynamic programming',
    description: 'Dynamic programming solves a problem by combining answers to overlapping smaller subproblems. Define the state, the transition between states, and the base cases — the rest is filling a table.',
    prerequisites: ['g-recursion', 'h-dict'],
    difficulty: 'hard',
    estimatedMinutes: 60,
    objectives: ['Define a DP state in one sentence', 'Write the transition and base cases', 'Solve classic 1D problems: stairs, coin change'],
    syntax: `# ways to climb n stairs taking 1 or 2 steps
dp = [0] * (n + 1)
dp[0] = 1
for i in range(1, n + 1):
    dp[i] = dp[i - 1] + (dp[i - 2] if i >= 2 else 0)`,
    commonMistakes: ['Defining a state that does not contain enough information to make the next decision.'],
    exercises: [ex('Minimum coins to make sum x (coin change).'), ex('Number of ways to reach the bottom-right of a grid moving right/down.')],
    resources: [usaco('gold/intro-dp', 'Introduction to DP'), CSES],
  },
  {
    id: 'g-memo',
    title: 'Memoization and tabulation',
    description: 'Memoization caches a recursive function\'s results (top-down); tabulation fills a table in order (bottom-up). In Python, functools.cache makes memoization one line, while tabulation avoids recursion limits.',
    prerequisites: ['g-dp-intro'],
    difficulty: 'hard',
    estimatedMinutes: 45,
    objectives: ['Memoize with functools.cache', 'Convert a memoized solution to a table', 'Pick the fill order for a 2D table'],
    syntax: `from functools import cache

@cache
def f(i):
    if i <= 1: return i
    return f(i - 1) + f(i - 2)`,
    commonMistakes: ['Memoizing a function with a list argument (lists are unhashable).', 'Deep memoized recursion hitting the recursion limit.'],
    exercises: [ex('Longest common subsequence of two strings, top-down then bottom-up.')],
    resources: [py('library/functools.html#functools.cache', 'functools.cache — Python docs'), cfSet(['dp', '1100-1300'], 'Codeforces: dp, 1100–1300')],
  },
])
