# Dijkstra route policies — js-more 1769–1778

**What you practise:** shortest paths on a directed weighted graph with Dijkstra's settle-the-cheapest-first loop, a per-hop surcharge, and a deterministic tie-break between equal-cost routes.
**Prerequisites:** [04 Heap job dispatch](04-heap-job-dispatch.md) for "pick the minimum, then move on"; `Map` and `Set` keyed by string; `Infinity` as a sentinel; `JSON.stringify` on an array of strings.
**Exercises:** 1769: toll=0; tie=lexical, 1770: toll=0; tie=fewest, 1771: toll=1; tie=lexical, 1772: toll=1; tie=fewest, 1773: toll=2; tie=lexical, 1774: toll=2; tie=fewest, 1775: toll=3; tie=lexical, 1776: toll=3; tie=fewest, 1777: toll=4; tie=lexical, 1778: toll=4; tie=fewest.

## The problem in plain words

The input is `{nodes, edges, start}`. `nodes` is a list of unique ASCII labels, `edges` is a list of `[from, to, weight]` triples with strictly positive weights, and `start` is one of the labels. Return, for every node in the order it appears in `input.nodes`, an object `{node, cost, path}` giving the cheapest route from `start`.

Dijkstra's algorithm is the standard way to do this. Keep a tentative cost for every node, repeatedly settle the unsettled node with the smallest tentative cost, and relax the edges leaving it. Settling the cheapest first is what makes the algorithm correct, and it is why the weights must be strictly positive: once a node is settled, no route discovered later can be cheaper, because every route discovered later already costs at least as much and can only grow.

"Policy" is two knobs. `toll` is a fixed surcharge added to every hop, so the cost of a route is the sum of its weights plus `toll` times the number of edges. Raising the toll makes routes with fewer hops more attractive. `tie` decides between two routes that cost exactly the same: `lexical` takes the smaller `JSON.stringify(path)`, `fewest` first prefers the route with fewer nodes and only then compares the JSON form.

Unreachable nodes report `cost: null` and `path: []`. The start reports `cost: 0` and `path: [start]`.

## The contract you must honour

Taken from `prompts/1769.txt` and `tests/1769.cjs`:

- The return value is an array in `input.nodes` order — not keyed by node, not sorted by cost. The reference ends with `input.nodes.map(node => ({...}))`.
- Each element is exactly `{node, cost, path}`.
- `check({nodes:['a'],edges:[],start:'a'},[{node:'a',cost:0,path:['a']}])` is the first assertion. The start's path contains the start itself, and its cost is `0` even with a non-zero toll — the toll is per edge, and the start took no edges.
- Unreachable means `cost: null`, not `Infinity` and not `undefined`; `path` is `[]`, not `null`. The test graph has a node `'z'` with no edges at all, so this branch runs on every iteration.
- Every hop costs `weight + cfg.toll`. The test's `oracle` recurses with `cost + w + cfg.toll`.
- Equal-cost ties resolve by `cfg.tie`. The oracle's condition is `cfg.tie==='fewest'&&route.length!==prev.path.length?route.length<prev.path.length:lex`, where `lex` is `JSON.stringify(route)<JSON.stringify(prev.path)` — the same chain the reference's `compare` implements.
- `check` clones the input and asserts `'Input must not mutate'`. The prompt says "no mutation" in the TASK section as well. Routes are rebuilt with a spread, never pushed into.
- The oracle is a depth-first enumeration of all simple routes (`!route.includes(b)` prevents cycles), so it is genuinely independent of the reference. The prompt still says "Use Dijkstra", and the CONTRACT section notes that complexity requirements "also need source review".

## Approach

1. `dist` is a `Map` from node to cost, seeded to `Infinity` for every node and then `0` for `input.start`. `paths` is a `Map` holding only the start's path, `[input.start]`. `done` is a `Set` of settled nodes.
2. Write `compare(left, right)` once, for two paths. If `cfg.tie === 'fewest'` and the lengths differ, the shorter wins. Otherwise compare `JSON.stringify` of each. Returning `-1 / 0 / 1` lets the same function serve both as a sort comparator and as an "is this route better" test.
3. Loop forever:
   - Build `available`: the nodes that are not settled and whose cost is no longer `Infinity`. These are exactly the reachable, unsettled nodes — this list *is* the priority queue, rebuilt each round.
   - Sort it by cost, breaking ties with `compare` on the stored paths, so the choice of which node to settle is as deterministic as the answer itself.
   - If it is empty, everything reachable has been settled; stop.
   - Settle `available[0]`: add it to `done`, then scan `input.edges` for edges leaving it.
4. Relax an edge `[from, to, weight]` when `from` is the settled node. The candidate cost is `dist.get(settled) + weight + cfg.toll` and the candidate route is `[...paths.get(settled), to]`. Replace the stored entry if the candidate is strictly cheaper, or if it ties and `compare(route, paths.get(to)) < 0`.
5. Finish by mapping `input.nodes` to `{node, cost, path}`, converting `Infinity` to `null` and a missing path to `[]`.

Selecting the minimum by rebuilding and sorting a list costs O(V log V) per round for O(V) rounds, and every round rescans all the edges: O(V² log V + V·E) overall. A binary heap keyed by cost would bring that down, at the price of also having to re-heap when a tie-break changes a stored path. The shape here keeps the tie-break in one function; the algorithm — settle cheapest first, then relax — is Dijkstra either way.

## Worked example — 1769 Dijkstra route policies / scenario 1

The hand-written graph, quoted from line 10 of `tests/1769.cjs`:

```js
for(let w=1;w<=10;w++){const input={nodes:['s','a','b','t','z'],start:'s',edges:[['s','a',1],['a','b',1],['b','t',1],['s','t',w],['a','t',w],['t','s',2]]};check(input,oracle(input));}
```

Five nodes. `z` appears in `nodes` but in no edge. There is a three-hop route `s → a → b → t` of total weight 3, and a direct edge `s → t` whose weight `w` the loop sweeps from 1 to 10. That is the whole design: the loop walks the direct edge past the three-hop route and out the other side.

**Iteration `w = 1`, with `cfg = {"tie":"lexical","toll":0}`.**

| Round | `available` (cost) | Settled | Relaxations | `dist` / `paths` after |
| --- | --- | --- | --- | --- |
| 1 | `s`(0) | `s` | `s→a` 1 beats ∞; `s→t` 1 beats ∞ | `a` 1 `[s,a]`, `t` 1 `[s,t]` |
| 2 | `a`(1), `t`(1) → tie, `["s","a"] < ["s","t"]` | `a` | `a→b` 2 beats ∞; `a→t` 1+1=2 loses to 1 | `b` 2 `[s,a,b]` |
| 3 | `t`(1), `b`(2) | `t` | `t→s` 1+2=3 loses to 0 | unchanged |
| 4 | `b`(2) | `b` | `b→t` 2+1=3 loses to 1 | unchanged |
| 5 | empty — `z` is still `Infinity` | — | — | loop breaks |

Result, in `input.nodes` order:

```js
[{node:'s',cost:0,path:['s']},
 {node:'a',cost:1,path:['s','a']},
 {node:'b',cost:2,path:['s','a','b']},
 {node:'t',cost:1,path:['s','t']},
 {node:'z',cost:null,path:[]}]
```

Round 2 is the only place the ordering tie-break is used for *selection*: `a` and `t` both cost 1, and `compare` puts `["s","a"]` before `["s","t"]` because at the sixth character `a` precedes `t`. Settling `t` first would have given the same final answer here — with positive weights, settling order among equal-cost nodes never changes the result — but the sort makes the run deterministic rather than dependent on `input.nodes` order.

Round 5 is the `z` branch. `z` has no incoming edge, so its `dist` is never lowered from `Infinity`, it never enters `available`, and the final map turns it into `{node:'z',cost:null,path:[]}`.

**Iteration `w = 3`, still `toll=0`, `tie=lexical`.** Now the direct edge costs exactly as much as the three-hop route, and the tie-break decides the reported path.

| Round | `available` (cost) | Settled | Relaxations |
| --- | --- | --- | --- |
| 1 | `s`(0) | `s` | `a` → 1 `[s,a]`; `t` → 3 `[s,t]` |
| 2 | `a`(1), `t`(3) | `a` | `b` → 2 `[s,a,b]`; `a→t` 1+3=4 loses to 3 |
| 3 | `b`(2), `t`(3) | `b` | `b→t` 2+1=**3**, ties with 3 → `compare` decides |
| 4 | `t`(3) | `t` | `t→s` 5 loses to 0 |

At round 3 the candidate route is `['s','a','b','t']` and the stored one is `['s','t']`. Under `tie=lexical` (1769) `compare` goes straight to the JSON strings: `["s","a","b","t"]` versus `["s","t"]`, and `"a"` beats `"t"` at the first differing character, so the longer route replaces the shorter one. `t` is reported as `{cost:3, path:['s','a','b','t']}`.

Under `tie=fewest` (1770) the same round takes the other branch: the lengths differ, 4 against 2, so `compare` returns a positive number and the stored `['s','t']` survives. Same cost, different path. That single round is the entire difference between the two files.

**What the toll does.** Under 1771 (`toll=1`) every hop costs one more, so at `w = 3` the direct edge costs 4 and the three-hop route costs 6. The tie is gone and no policy is consulted. The higher the toll, the more the direct edge wins; the test sweeps `w` from 1 to 10 so that for each toll setting some iterations favour the short route, some the long one, and at least one produces the exact tie.

The reference solution, as it now reads in `solutions/1769.cjs`:

```js
function dijkstra(input) {
  const dist = new Map(input.nodes.map(node => [node, Infinity]));
  dist.set(input.start, 0);
  const paths = new Map([[input.start, [input.start]]]);
  const done = new Set();
  const compare = (left, right) => {
    if (cfg.tie === 'fewest' && left.length !== right.length) return left.length - right.length;
    const leftJson = JSON.stringify(left);
    const rightJson = JSON.stringify(right);
    return leftJson < rightJson ? -1 : leftJson > rightJson ? 1 : 0;
  };
  while (true) {
    const available = input.nodes.filter(node => !done.has(node) && dist.get(node) !== Infinity);
    available.sort((left, right) =>
      dist.get(left) - dist.get(right) || compare(paths.get(left), paths.get(right)));
    if (!available.length) break;
    const settled = available[0];
    done.add(settled);
    for (const [from, to, weight] of input.edges) {
      if (from !== settled) continue;
      const candidate = dist.get(settled) + weight + cfg.toll;
      const route = [...paths.get(settled), to];
      const improves = candidate < dist.get(to);
      const tiesButSorts = candidate === dist.get(to) && compare(route, paths.get(to)) < 0;
      if (improves || tiesButSorts) {
        dist.set(to, candidate);
        paths.set(to, route);
      }
    }
  }
  return input.nodes.map(node => ({
    node,
    cost: dist.get(node) === Infinity ? null : dist.get(node),
    path: paths.get(node) || [],
  }));
}
```

## Policy matrix — what changes between the variants

`cfg.toll` appears once, in the candidate cost. `cfg.tie` appears once, in the first line of `compare`.

| ID | Variant | What differs in the prompt | What differs in the code |
| --- | --- | --- | --- |
| 1769 | toll=0; tie=lexical | `{"tie":"lexical","toll":0}` | hop costs `weight + 0`; `compare` goes straight to the JSON comparison |
| 1770 | toll=0; tie=fewest | `{"tie":"fewest","toll":0}` | same cost; `compare` returns `left.length - right.length` when the lengths differ |
| 1771 | toll=1; tie=lexical | `{"tie":"lexical","toll":1}` | hop costs `weight + 1`; JSON tie-break |
| 1772 | toll=1; tie=fewest | `{"tie":"fewest","toll":1}` | hop costs `weight + 1`; length tie-break first |
| 1773 | toll=2; tie=lexical | `{"tie":"lexical","toll":2}` | hop costs `weight + 2`; JSON tie-break |
| 1774 | toll=2; tie=fewest | `{"tie":"fewest","toll":2}` | hop costs `weight + 2`; length tie-break first |
| 1775 | toll=3; tie=lexical | `{"tie":"lexical","toll":3}` | hop costs `weight + 3`; JSON tie-break |
| 1776 | toll=3; tie=fewest | `{"tie":"fewest","toll":3}` | hop costs `weight + 3`; length tie-break first |
| 1777 | toll=4; tie=lexical | `{"tie":"lexical","toll":4}` | hop costs `weight + 4`; JSON tie-break |
| 1778 | toll=4; tie=fewest | `{"tie":"fewest","toll":4}` | hop costs `weight + 4`; length tie-break first |

Note the interaction: `fewest` is only ever consulted on an exact cost tie, and a large toll makes such ties rarer. At `toll = 0` the three-hop route costs 3 and the direct edge costs `w`, so `w = 3` ties and 1769 and 1770 disagree there. At `toll = 4` the three-hop route costs 15 and the direct edge costs `w + 4`, which would only tie at `w = 11` — outside the loop's range — so 1777 and 1778 return identical results for every input in their own test file. The policy still differs; this graph just does not force it apart.

## Pitfalls the tests are designed to catch

- **Reporting `Infinity` for unreachable nodes.** `z` asserts `cost: null`. `deepEqual` does not treat `Infinity` and `null` as equal.
- **Returning `path: undefined` for an unreachable node.** `paths.get('z')` is `undefined`; the `|| []` is what turns it into the asserted empty array.
- **Adding the toll to the total instead of to each hop.** With three hops and `toll = 2`, the route costs 6 more, not 2 more. The oracle adds `cfg.toll` inside the recursion, once per edge.
- **Charging the toll for the start.** `cost: 0` is asserted for the start node in the single-node case, where `toll` may be 4.
- **Relaxing without the tie clause.** `candidate < dist.get(to)` alone leaves whichever equal-cost route arrived first, which depends on edge order rather than on policy. The `w = 3` round-3 case is exactly the one that catches it.
- **Comparing paths with `<` on the arrays.** `['s','a','b','t'] < ['s','t']` coerces to comma-joined strings and happens to agree here, but the prompt says "lexical JSON path" and the oracle uses `JSON.stringify`.
- **Mutating a stored path.** `paths.get(settled).push(to)` corrupts the settled node's own route, which is still needed for its other outgoing edges. Build `[...paths.get(settled), to]`.
- **Settling a node more than once, or settling by insertion order.** Without `done`, the loop never terminates on a graph with a cycle — and this graph has one, `t → s`.
- **Sorting the output by cost.** The result is in `input.nodes` order, which here is `s, a, b, t, z` — not cost order.

## Try it yourself

1. Add a `tie=mostHops` policy that prefers the route with the most nodes before falling back to JSON order. Which single line changes, and does the selection sort need the same change?
2. Replace the rebuild-and-sort `available` with a binary heap keyed by cost. What has to happen to a heap entry when a relaxation replaces a path at equal cost?
3. Make the function also report, for each node, how many distinct cheapest routes reach it. Can that be derived from `dist` and `paths` alone?
4. In words: the algorithm relies on positive weights. Construct a five-node graph with one negative edge where settling the cheapest node first produces a route the oracle would reject, and say which round goes wrong.
