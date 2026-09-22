# Breadth-first reachable labels — js/batch-084-103 103

**What you practise:** breadth-first search over a directed graph, marking nodes at the right moment, and using an index instead of `shift` for the queue.
**Prerequisites:** `Map` and `Set` basics; the `??` operator; why `Array.prototype.shift` is O(n); what "discovery order" means.
**Exercises:** 103: Breadth-first reachable labels.

## The problem in plain words

The graph is a `Map` from a label to the array of labels it points at. From a starting label, list everything you can get to by following arrows, including the start itself, in breadth-first discovery order: the start, then everything one hop away in the order the edges list them, then everything two hops away, and so on.

Three details make this more than a textbook BFS.

A key missing from the `Map` is a *leaf*, not an error. Graphs in this shape often list only the nodes that have outgoing edges, so `graph.get('d')` being `undefined` simply means `d` points at nothing.

Duplicate edges and cycles must not produce duplicate output. That is what the visited set is for — and *when* you add to it is the point of the hint. Marking a label when you enqueue it, rather than when you later come to process it, is what stops the same label being queued twice before either copy is looked at.

And the queue is walked with an index rather than drained with `shift`. `shift` moves every remaining element down one slot, which turns the traversal into O(n²) for a long queue. Keeping an index means nothing is removed, so the finished queue *is* the answer.

## The contract you must honour

Taken from `tests/103-graph-reachability.cjs`:

- The graph is `new Map([['a',['b','c','b']],['b',['d']],['c',['d','a']]])`. Note that `'a'` lists `'b'` twice, `'c'` points back at `'a'` forming a cycle, and `'d'` has no entry at all.
- `solve(graph,'a')` asserts `['a','b','c','d']`. The start comes first; `b` and `c` in edge order; `d` once, despite being reachable from both `b` and `c`.
- `solve(graph,'z')` asserts `['z']`. A start label absent from the map still appears in the output.
- `solve(new Map([['x',['x']]]),'x')` asserts `['x']`. A self-loop must not repeat the node.
- After all of that, `graph.get('a')` asserts `['b','c','b']` — unchanged. The adjacency arrays are read only.
- The result is an array in discovery order, not a `Set`.

## Approach

1. Seed the queue with `[start]` and the visited set with the same one label: `new Set(queue)`.
2. Walk the queue with an index `i` from 0, re-reading `queue.length` on every step so labels appended during the loop are visited in turn.
3. For the current label, read its neighbours as `graph.get(label) ?? []`.
4. For each neighbour not already in `seen`: add it to `seen` *and* push it onto `queue`, in that order and in the same step.
5. Return `queue`.

The loop terminates because a label is pushed only when it was not in `seen`, and it is added to `seen` at the same moment, so each distinct label is pushed at most once. The queue is therefore bounded by the number of distinct reachable labels.

## Worked example — 103 Breadth-first reachable labels

Input, from the first assertion: the graph above, starting at `'a'`.

| `i` | label at `queue[i]` | neighbours | decisions | `queue` after | `seen` after |
| --- | --- | --- | --- | --- | --- |
| — | seed | — | — | `['a']` | `{a}` |
| 0 | `a` | `['b','c','b']` | `b` new → enqueue; `c` new → enqueue; `b` again, already in `seen` → skip | `['a','b','c']` | `{a,b,c}` |
| 1 | `b` | `['d']` | `d` new → enqueue | `['a','b','c','d']` | `{a,b,c,d}` |
| 2 | `c` | `['d','a']` | `d` already seen → skip; `a` already seen → skip | unchanged | unchanged |
| 3 | `d` | no entry, so `[]` | nothing to do | unchanged | unchanged |

`i` reaches `4`, which is `queue.length`, so the loop ends. The result is `['a','b','c','d']`, asserted on line 5 of the test file.

Two rows carry the lesson. At `i = 0`, the repeated `b` in the edge list is rejected because `b` was added to `seen` the moment it was *enqueued*, not when it was later processed at `i = 1`. At `i = 2`, the cycle back to `a` is rejected for the same reason — `a` was in `seen` from the seed.

The reference solution, as it now reads in `solutions/103-graph-reachability.cjs`:

```js
function reachable(graph, start) {
  const queue = [start];
  const seen = new Set(queue);
  for (let i = 0; i < queue.length; i++) {
    const neighbours = graph.get(queue[i]) ?? [];
    for (const next of neighbours) {
      if (!seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  return queue;
}
```

## Variations you could build

| Variation | What would change in the code |
| --- | --- |
| Return the hop distance for each label | a parallel array or a `Map` from label to depth, written at the same moment as the enqueue |
| Depth-first order instead | replace the index walk with an explicit stack and pop from the end; discovery order changes accordingly |
| Shortest path back to the start | record each label's predecessor at enqueue time, then walk the chain backwards from the target |

## Pitfalls the tests are designed to catch

- **Marking on dequeue instead of on enqueue.** `a` lists `b` twice, so `b` would be enqueued twice before it is first processed, and the output would be `['a','b','c','b','d']`.
- **Omitting the visited check entirely.** The `c → a` cycle makes the loop run forever.
- **Forgetting to seed `seen` with the start.** The self-loop case `x → x` would then yield `['x','x']`.
- **Treating a missing key as an error.** `d` has no entry, and `solve(graph,'z')` starts from a label with no entry at all; both must succeed.
- **Draining the queue with `shift`.** It gives the right answer, but the header asks for the index form and the reviewer reads the source.
- **Sorting or otherwise rewriting an adjacency array.** The final assertion checks `graph.get('a')` is still `['b','c','b']`.
- **Returning the `Set`.** `deepEqual` against an array would fail, and a `Set` also loses the guarantee that the order is the discovery order.

## Try it yourself

1. Add an optional `maxDepth` so the search stops after a given number of hops. Where does the depth have to be recorded for that to work?
2. Change the graph so every node has an entry, some with empty arrays, and confirm the `?? []` becomes unnecessary — then argue for keeping it anyway.
3. In words: the loop condition re-reads `queue.length` on every step while the body pushes onto `queue`. Explain why that terminates, and name the single line that guarantees it.
