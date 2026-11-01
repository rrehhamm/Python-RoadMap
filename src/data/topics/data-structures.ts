import { defineStage } from '../define'
import { CSES, cf, cfSet, cpa, ex, py } from '../links'

export const dataStructures = defineStage('data-structures', [
  {
    id: 'd-stack',
    title: 'Stack',
    description: 'A stack is last-in, first-out. A Python list is already a fast stack: append() pushes and pop() removes the top, both O(1). Stacks handle matching brackets, undo, and "nearest previous" questions.',
    prerequisites: ['a-modify', 's-iterate'],
    difficulty: 'medium',
    estimatedMinutes: 35,
    objectives: ['Use a list as a stack', 'Check balanced brackets', 'Simulate removing adjacent pairs'],
    syntax: `st = []
for ch in s:
    if st and st[-1] == ch:
        st.pop()
    else:
        st.append(ch)`,
    commonMistakes: ['Popping from an empty stack — check "if st" first.'],
    exercises: [ex('Check whether a string of ()[]{} is balanced.'), ex('Repeatedly delete adjacent equal letters and print what remains.')],
  },
  {
    id: 'd-queue',
    title: 'Queue',
    description: 'A queue is first-in, first-out: items leave in the order they arrived. It models waiting lines, round-robin simulation, and is the engine of breadth-first search.',
    prerequisites: ['d-stack'],
    difficulty: 'medium',
    estimatedMinutes: 25,
    objectives: ['Explain FIFO versus LIFO', 'Simulate a queue process', 'Know why list.pop(0) is slow'],
    syntax: `from collections import deque
q = deque()
q.append(x)       # enqueue
x = q.popleft()   # dequeue, O(1)`,
    commonMistakes: ['Using list.pop(0), which is O(n) per call.'],
    exercises: [cf(266, 'B', 'Queue at the School'), ex('Simulate people taking turns until each has taken k items.')],
  },
  {
    id: 'd-deque',
    title: 'collections.deque',
    description: 'deque supports O(1) appends and pops at both ends, plus rotate(). It serves as a queue, a stack, or a sliding-window structure, and it is the standard choice for BFS in Python.',
    prerequisites: ['d-queue'],
    difficulty: 'medium',
    estimatedMinutes: 25,
    objectives: ['Push and pop at both ends', 'Use maxlen for a fixed-size window', 'Know that indexing the middle of a deque is O(n)'],
    syntax: `from collections import deque
d = deque([1, 2, 3])
d.appendleft(0); d.pop(); d.rotate(1)
window = deque(maxlen=k)`,
    commonMistakes: ['Random access d[i] in a loop over a long deque.'],
    exercises: [ex('Simulate a card game where cards move from the top to the bottom.')],
    resources: [py('library/collections.html#collections.deque', 'collections.deque — Python docs')],
  },
  {
    id: 'd-linked',
    title: 'Linked lists',
    description: 'A linked list stores nodes that point to the next node. Python rarely needs one directly, but next/prev arrays implement O(1) deletion from the middle — useful in simulation problems.',
    prerequisites: ['d-stack'],
    difficulty: 'medium',
    estimatedMinutes: 35,
    objectives: ['Build a singly linked list with a Node class', 'Delete from the middle with next/prev arrays', 'Reverse a linked list'],
    syntax: `nxt = list(range(1, n + 1)); prv = list(range(-1, n - 1))
def remove(i):
    if prv[i] >= 0: nxt[prv[i]] = nxt[i]
    if nxt[i] < n: prv[nxt[i]] = prv[i]`,
    commonMistakes: ['Losing the reference to the rest of the list while reversing.'],
    exercises: [ex('Reverse a linked list iteratively.'), ex('Josephus problem: remove every k-th person using next pointers.')],
  },
  {
    id: 'd-heap',
    title: 'Heap and priority queue',
    description: 'heapq keeps a list arranged so the smallest item is always at index 0. Push and pop cost O(log n). Push tuples to order by priority, and negate values to get a max-heap.',
    prerequisites: ['ss-key'],
    difficulty: 'medium',
    estimatedMinutes: 40,
    objectives: ['Push and pop with heapq', 'Build a max-heap by negation', 'Repeatedly take the smallest two items'],
    syntax: `import heapq
h = []
heapq.heappush(h, (dist, node))
d, u = heapq.heappop(h)
heapq.heapify(a)                 # O(n)
heapq.heappush(h, -x)            # max-heap trick`,
    commonMistakes: ['Assuming the heap list is fully sorted — only h[0] is guaranteed.'],
    exercises: [ex('Merge n ropes, always joining the two shortest, and print the total cost.'), ex('Keep the k largest numbers seen in a stream.')],
    resources: [py('library/heapq.html', 'heapq — Python docs')],
  },
  {
    id: 'd-trees',
    title: 'Trees',
    description: 'A tree is a connected graph with n nodes and n - 1 edges and no cycles. Rooting it gives parents, children, depth and subtree sizes — the basis of many medium-level problems.',
    prerequisites: ['d-linked'],
    difficulty: 'medium',
    estimatedMinutes: 45,
    objectives: ['Store a tree as an adjacency list', 'Compute parent and depth of every node', 'Compute subtree sizes'],
    syntax: `adj = [[] for _ in range(n + 1)]
for _ in range(n - 1):
    u, v = map(int, input().split())
    adj[u].append(v); adj[v].append(u)`,
    commonMistakes: ['Walking back to the parent and looping forever in an undirected tree.'],
    exercises: [ex('Compute the depth of every node from root 1.'), ex('Find the number of leaves.')],
    resources: [cfSet(['trees', '1000-1300'], 'Codeforces: trees, 1000–1300')],
  },
  {
    id: 'd-bst',
    title: 'Binary search trees',
    description: 'A BST keeps smaller keys to the left and larger to the right, giving O(height) search and insert. Python has no built-in balanced BST, so contests use sorted lists with bisect or other tricks.',
    prerequisites: ['d-trees', 'ss-binary'],
    difficulty: 'medium',
    estimatedMinutes: 40,
    objectives: ['Insert and search in a BST', 'Explain why an unbalanced BST degrades to O(n)', 'Use a sorted list + bisect as a substitute for small n'],
    syntax: `class Node:
    def __init__(self, key):
        self.key, self.left, self.right = key, None, None`,
    commonMistakes: ['Inserting sorted data into a plain BST and getting a linked list.'],
    exercises: [ex('Insert keys into a BST and print the in-order traversal.'), ex('Check whether a binary tree is a valid BST.')],
  },
  {
    id: 'd-graph-rep',
    title: 'Graph representation',
    description: 'A graph is nodes plus edges, directed or undirected, weighted or not. Choosing the right representation — adjacency list, matrix, or edge list — decides how fast later algorithms run.',
    prerequisites: ['h-dict', 'd-trees'],
    difficulty: 'medium',
    estimatedMinutes: 30,
    objectives: ['Read an edge list into a graph', 'Model a grid as an implicit graph', 'Distinguish directed and undirected edges'],
    syntax: `# grid neighbours
for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
    nr, nc = r + dr, c + dc
    if 0 <= nr < n and 0 <= nc < m: ...`,
    commonMistakes: ['Adding an undirected edge in only one direction.'],
    exercises: [ex('Read a grid and count the open neighbours of every cell.')],
  },
  {
    id: 'd-adjacency',
    title: 'Adjacency lists and matrices',
    description: 'An adjacency list uses O(n + m) memory and lists neighbours quickly; a matrix uses O(n²) but answers "is there an edge?" in O(1). Use lists for sparse graphs (almost always) and matrices for n ≤ ~1000.',
    prerequisites: ['d-graph-rep'],
    difficulty: 'medium',
    estimatedMinutes: 25,
    objectives: ['Build both representations from the same input', 'Compute degrees', 'Pick the representation from n and m'],
    syntax: `adj = [[] for _ in range(n)]
mat = [[False] * n for _ in range(n)]
for u, v in edges:
    adj[u].append(v); adj[v].append(u)
    mat[u][v] = mat[v][u] = True`,
    commonMistakes: ['Allocating an n × n matrix for n = 2·10⁵.'],
    exercises: [ex('Print the node with the highest degree.'), ex('Check whether three given nodes form a triangle using the matrix.')],
    resources: [cpa('graph/breadth-first-search.html', 'Graph basics through BFS'), CSES],
  },
])
