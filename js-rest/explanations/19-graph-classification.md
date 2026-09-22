# Graph classification — js-rest 176–179

**What you practise:** summarising an edge list into `Set`s of node labels, then classifying every node by its degree pattern.
**Prerequisites:** `Set` construction from an array; `Array.prototype.map` and `filter`; the idea of in-degree and out-degree.
**Exercises:** 176: Graph classification: sources, 177: Graph classification: sinks, 178: Graph classification: isolated, 179: Graph classification: self-looped.

## The problem in plain words

The input is `{nodes: string[], edges: [from, to][]}` — a directed graph. Node labels are unique. Every edge references nodes that exist, and the same edge may be listed more than once.

Four standard descriptions of a node fall out of its edges. A **source** has no edges arriving at it — it only sends. A **sink** has no edges leaving it — it only receives. An **isolated** node has neither, so it is both a source and a sink. A **self-looped** node has an edge from itself to itself.

"Policy" is which of those four descriptions to report. The answer is always a sorted array of labels.

The efficient shape is to summarise the edges once into membership sets, then ask a constant-time question per node. Scanning the edge list inside a loop over the nodes would be O(nodes × edges); summarising first is O(nodes + edges).

Note that duplicate edges are allowed but never change an answer: all four questions are about *whether* an edge exists, not how many. A `Set` collapses duplicates for free, which is why the prompt can permit them without adding a rule.

## The contract you must honour

Taken from `tests/176.cjs` through `tests/179.cjs`:

- The shared graph `{"nodes":["a","b","c","d"],"edges":[["a","b"],["b","b"],["a","b"]]}` asserts `["a","c","d"]` for sources, `["c","d"]` for sinks, `["c","d"]` for isolated and `["b"]` for self-looped. Note `["a","b"]` appears twice and changes nothing.
- `{"nodes":[],"edges":[]}` asserts `[]` in all four.
- `{"nodes":["x"],"edges":[]}` asserts `["x"]` for sources, sinks and isolated, and `[]` for self-looped. A node with no edges qualifies for the three "absence" policies and fails the one "presence" policy.
- The return value is an array of label strings in ascending lexical order.
- Every case ends with `assert.deepEqual(input, before, 'Input must not mutate')` against a `structuredClone`, so `input.nodes` may not be sorted in place.

Work the shared graph through by hand. Edge targets are `b`, `b`, `b`, so only `b` has incoming edges — sources are everything else, `a`, `c`, `d`. Edge origins are `a`, `b`, `a`, so `a` and `b` have outgoing edges — sinks are `c` and `d`. Isolated needs both absences, which again is `c` and `d`. The only edge whose ends match is `["b","b"]`, so `b` is the sole self-looped node.

Sinks and isolated give the same answer here because no node has an incoming edge without also having an outgoing one. A graph with a pure receiver would separate them.

## Approach

1. Build the membership sets you need from `input.edges`:
   - `hasIncoming = new Set(edges.map(edge => edge[1]))` — every node that is some edge's target;
   - `hasOutgoing = new Set(edges.map(edge => edge[0]))` — every node that is some edge's origin;
   - `hasSelfLoop = new Set(edges.filter(edge => edge[0] === edge[1]).map(edge => edge[0]))` — filter first, then collect.
   Each of `map` and `filter` allocates a new array, so `input.edges` is only read.
2. Filter `input.nodes` with the policy's test. `filter` returns a new array, so the input node list is untouched.
3. Sort that new array with `.sort()`. The default comparator orders strings lexically, which is what "sorted labels" means here.
4. Return it.

Cost: O(edges) to summarise, O(nodes) to classify, O(k log k) to sort.

The reference for each exercise builds only the sets that exercise needs — one for 176, 177 and 179, two for 178 — so reading a file tells you immediately which facts its policy depends on.

## Worked example — 176 Graph classification: sources

The first input in `tests/176.cjs`, on line 2, is the shared graph:

```js
{"nodes":["a","b","c","d"],"edges":[["a","b"],["b","b"],["a","b"]]}
```

Summarising the edges:

| edge | `edge[0]` (origin) | `edge[1]` (target) |
| --- | --- | --- |
| `["a","b"]` | `a` | `b` |
| `["b","b"]` | `b` | `b` |
| `["a","b"]` | `a` | `b` |

`edges.map(edge => edge[1])` gives `["b","b","b"]`, and `new Set([...])` collapses that to `{b}`. The three duplicates cost nothing.

Now the filter over `input.nodes`, in node order:

| node | `hasIncoming.has(node)` | `!hasIncoming.has(node)` | kept |
| --- | --- | --- | --- |
| `a` | false | true | yes |
| `b` | **true** | false | no |
| `c` | false | true | yes |
| `d` | false | true | yes |

The filtered array is `["a","c","d"]`; it is already in lexical order, and the sort leaves it alone. Line 2 asserts `assert.deepEqual(solve(input),["a","c","d"])`.

The third case, `{"nodes":["x"],"edges":[]}`, produces an empty `hasIncoming`, so `x` passes and the answer is `["x"]`. For 179 the same input produces an empty `hasSelfLoop`, so `x` fails and the answer is `[]` — the one place the four exercises split three against one.

The reference solution, as it now reads in `solutions/176.cjs`:

```js
function solve(input) {
  const hasIncoming = new Set(input.edges.map(edge => edge[1]));
  const sources = input.nodes.filter(node => !hasIncoming.has(node));
  return sources.sort();
}
```

And the self-loop set from `solutions/179.cjs`, the only variant that filters the edges before collecting labels:

```js
  const hasSelfLoop = new Set(
    input.edges.filter(edge => edge[0] === edge[1]).map(edge => edge[0])
  );
```

## Policy matrix — what changes between the variants

| ID | Variant | What differs in the prompt | What differs in the code |
| --- | --- | --- | --- |
| 176 | sources | "nodes with no incoming edges" | `!hasIncoming.has(node)` |
| 177 | sinks | "nodes with no outgoing edges" | `!hasOutgoing.has(node)` |
| 178 | isolated | "nodes with neither incoming nor outgoing edges" | `!hasIncoming.has(node) && !hasOutgoing.has(node)`; both sets are built |
| 179 | self-looped | "nodes with an edge to themselves" | `hasSelfLoop.has(node)`, built from edges where `edge[0] === edge[1]` |

## Pitfalls the tests are designed to catch

- **Swapping `edge[0]` and `edge[1]`.** Sources and sinks are mirror images, so the mistake produces the other exercise's answer: 176 would return `["c","d"]` instead of `["a","c","d"]`.
- **Forgetting that a self-loop is both incoming and outgoing.** In the shared graph, `b` has `["b","b"]`, so it is neither a source nor a sink. A self-loop check that excluded loops from the degree sets would wrongly report `b` as isolated.
- **Sorting `input.nodes` in place.** `input.nodes.sort()` fails `assert.deepEqual(input, before, 'Input must not mutate')`. Sorting the filtered array is safe because `filter` allocated it.
- **Returning nodes that only appear in edges.** The answer is drawn from `input.nodes`; the prompt promises edges reference existing nodes, so the two agree, but a solution built from edge labels alone would miss `c` and `d` entirely — they appear in no edge.
- **Counting edges instead of testing membership.** Duplicate edges are permitted, so `a → b` listed twice must not make `b` "more incoming" than once. A `Set` is immune; a count-based threshold is not.
- **Reporting isolated nodes as the intersection of the sources and sinks *arrays*.** Correct in result, but it is two filters plus an intersection where one filter with `&&` suffices.
- **Assuming sinks and isolated are the same policy.** They agree on all three visible cases. A graph such as `{"nodes":["p","q"],"edges":[["p","q"]]}` separates them: `q` is a sink but not isolated.

## Try it yourself

1. Add an `internal` variant: nodes with both an incoming and an outgoing edge. Which existing file is it closest to, and what happens to `b` in the shared graph?
2. Return in-degree and out-degree per node instead of a classification. Which data structure replaces the `Set`s, and why can you no longer ignore duplicate edges?
3. Build the three sets in a single pass over the edges instead of three `map` calls. Is it faster in any way that matters at this size?
4. In words: sinks and isolated give the same answer for all three test cases. Construct a graph that separates them and explain what the tests therefore do not prove.
