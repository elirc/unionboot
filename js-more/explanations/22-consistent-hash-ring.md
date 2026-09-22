# Consistent-hash ring — js-more 1929–1938

**What you practise:** consistent hashing — placing nodes and keys on a circle so that adding or removing a node moves as few keys as possible — and finding the successor position with a binary search.
**Prerequisites:** rolling hashes and `%`; `Array.prototype.sort` with a multi-level comparator; binary search on a sorted array; modular wrap-around with `%`.
**Exercises:** 1929: replicas=1; slots=97, 1930: replicas=1; slots=127, 1931: replicas=2; slots=97, 1932: replicas=2; slots=127, 1933: replicas=3; slots=97, 1934: replicas=3; slots=127, 1935: replicas=4; slots=97, 1936: replicas=4; slots=127, 1937: replicas=5; slots=97, 1938: replicas=5; slots=127.

## The problem in plain words

You have a set of nodes — servers, shards, cache boxes — and a stream of keys, and you must decide which node owns each key. The obvious answer, `hash(key) % nodeCount`, is terrible in practice: adding one node changes the modulus, and almost every key moves.

Consistent hashing fixes that. Imagine the numbers `0 … slots-1` arranged in a circle. Each node is hashed onto one or more points of that circle. A key is hashed onto the circle too, and it belongs to the first node position at or after it, walking clockwise and wrapping past the end back to the start. Now adding a node only steals the keys that fall in the arc just before its new position; everything else stays put.

The "one or more" is the `replicas` policy. One position per node gives a lumpy circle where one node can own most of the arc. Giving each node several positions — *virtual nodes*, hashed from `node + '#' + replica` — smooths the distribution without changing the lookup rule.

The input is `{nodes, keys}` and the output is an array of owners, one per key, in key order. With no nodes at all, every key answers `null`.

## The contract you must honour

Taken from `tests/1929.cjs`, whose oracle is a linear `find` over the same sorted ring:

- The hash is specified exactly: "hash starts0, for each char h=(31*h+code)%modulus", with the modulus being `cfg.slots`. The same function hashes both node labels and keys.
- A node's virtual positions come from `node + '#' + replica`, with `replica` counting from 0 — `'a#0'`, `'a#1'`, and so on.
- The ring is sorted "by position, then node ASCII, then replica". The oracle's comparator is `a.p - b.p || (a.node < b.node ? -1 : a.node > b.node ? 1 : a.replica - b.replica)`, and the reference uses the identical expression.
- Ownership is the first ring entry whose position is `>= hash(key)`, wrapping: `(slots.find(x => x.p >= hash(key)) || slots[0])?.node ?? null`.
- With `nodes: []` every key maps to `null`. The test runs that case first: `for (const nodes of [[], ['solo'], ['a','b','c'], ['a','c'], ['c','b','a']]) check({nodes, keys}, oracle(nodes, keys))`.
- `['a','b','c']` and `['c','b','a']` are both tested, so the answer must not depend on the order the nodes were given — the sort is what guarantees that.
- The key list includes the empty string, `'__proto__'`, and the thirty strings `'0'` … `'29'`. `'__proto__'` is only ever hashed to a number, so it cannot reach any prototype.
- `check` clones the input with `structuredClone` and finishes with `deep(input, before, 'Input must not mutate')` — so `input.nodes` must not be sorted in place.
- The prompt's "Use binary-search successor" is a source-review requirement; the oracle's own `find` is linear and would pass.

## Approach

1. Write `hash(text)` once: `h = (h * 31 + ch.charCodeAt(0)) % cfg.slots`, starting at 0. Taking the modulus inside the loop keeps the number small and is what the prompt specifies.
2. Build the ring: for each node, for each replica index below `cfg.replicas`, push `{node, position: hash(node + '#' + replica), replica}`.
3. Sort it with the three-level comparator. Two different labels can hash to the same point — the modulus is under 128 — so the tie-breakers are not decoration; without them, `sort` stability would make the answer depend on input order.
4. Map over `input.keys`. An empty ring answers `null` immediately.
5. Binary search for the first entry with `position >= point`. The standard lower-bound loop is: `lo = 0`, `hi = ring.length`; while `lo < hi`, take `mid = (lo + hi) >> 1` and move `lo = mid + 1` when `ring[mid].position < point`, else `hi = mid`. It ends with `lo` pointing at the first entry that is not below `point`.
6. Wrap with `ring[lo % ring.length]`: when the key hashed past every position, `lo` equals `ring.length` and the modulo sends it back to entry 0 — the top of the circle.

Cost: O(n log n) to build the ring once, then O(log n) per key.

## Worked example — 1929 Consistent-hash ring / scenario 1 — replicas=1; slots=97

Take the third node set the test uses, `['a','b','c']`, with `cfg.replicas = 1` and `cfg.slots = 97`.

**Building the ring.** Each node gets one virtual position, hashed from the label with `#0` appended:

| Label hashed | Position |
| --- | --- |
| `'a#0'` | 66 |
| `'b#0'` | 57 |
| `'c#0'` | 48 |

Sorted by position, the ring is `c(48) → b(57) → a(66)`, and then back round to `c(48)`.

**Looking keys up.** A few of the keys from the test's list:

| Key | `hash(key)` | First position ≥ hash | Owner |
| --- | --- | --- | --- |
| `''` | 0 | 48 | `'c'` |
| `'a'` | 0 | 48 | `'c'` |
| `'b'` | 1 | 48 | `'c'` |
| `'__proto__'` | 10 | 48 | `'c'` |
| `'zz'` | 24 | 48 | `'c'` |
| `'0'` | 48 | 48 (exactly) | `'c'` |
| `'1'` | 49 | 57 | `'b'` |
| `'2'` | 50 | 57 | `'b'` |
| `'account-1'` | 83 | none — wraps | `'c'` |

Two rows are worth pausing on. `'0'` hashes to exactly 48, and the rule is "first position **at or after**", so it belongs to `c` rather than to `b`; a strict `>` would get it wrong. `'account-1'` hashes to 83, which is past every position on this ring, so the search ends with `lo === 3 === ring.length` and `3 % 3 === 0` picks `c` — the wrap.

The binary search for `'1'` (point 49) on `[48, 57, 66]` runs: `lo=0, hi=3`, `mid=1`, `ring[1].position = 57`, not `< 49`, so `hi=1`; `mid=0`, `ring[0].position = 48 < 49`, so `lo=1`; `lo === hi === 1`, answer `ring[1]`, which is `b`. Two comparisons.

Notice how lopsided this ring is with one replica each: `c` owns the arc from 67 round through 0 to 48, which is most of the circle. That is exactly the problem `cfg.replicas` exists to reduce — the siblings 1931–1938 scatter each node over 2 to 5 positions.

The test never writes these owners down. It calls `check({nodes, keys}, oracle(nodes, keys))` for all five node sets, and the oracle builds the same ring and walks it linearly.

The reference solution, as it now reads in `solutions/1929.cjs`:

```js
function hashRing(input) {
  const hash = text => {
    let h = 0;
    for (const ch of text) {
      h = (h * 31 + ch.charCodeAt(0)) % cfg.slots;
    }
    return h;
  };

  const ring = [];
  for (const node of input.nodes) {
    for (let replica = 0; replica < cfg.replicas; replica++) {
      ring.push({ node, position: hash(node + '#' + replica), replica });
    }
  }
  ring.sort((a, b) => a.position - b.position || (a.node < b.node ? -1 : a.node > b.node ? 1 : a.replica - b.replica));

  return input.keys.map(key => {
    if (!ring.length) return null;
    const point = hash(key);
    let lo = 0;
    let hi = ring.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (ring[mid].position < point) lo = mid + 1;
      else hi = mid;
    }
    return ring[lo % ring.length].node;
  });
}
```

## Policy matrix — what changes between the variants

The code is identical across the family. `cfg.replicas` controls the inner build loop; `cfg.slots` is the modulus inside `hash`, so it changes every position at once.

| ID | Variant | Semantic key | What differs in the code |
| --- | --- | --- | --- |
| 1929 | replicas=1; slots=97 | `{"replicas":1,"slots":97}` | one entry per node; `% 97` |
| 1930 | replicas=1; slots=127 | `{"replicas":1,"slots":127}` | one entry per node; `% 127`, a wider circle |
| 1931 | replicas=2; slots=97 | `{"replicas":2,"slots":97}` | `'#0'` and `'#1'` per node; ring twice as long |
| 1932 | replicas=2; slots=127 | `{"replicas":2,"slots":127}` | two entries per node on the wider circle |
| 1933 | replicas=3; slots=97 | `{"replicas":3,"slots":97}` | three entries per node |
| 1934 | replicas=3; slots=127 | `{"replicas":3,"slots":127}` | three entries, wider circle |
| 1935 | replicas=4; slots=97 | `{"replicas":4,"slots":97}` | four entries per node |
| 1936 | replicas=4; slots=127 | `{"replicas":4,"slots":127}` | four entries, wider circle |
| 1937 | replicas=5; slots=97 | `{"replicas":5,"slots":97}` | five entries per node — with three nodes the ring has 15 positions on 97 slots |
| 1938 | replicas=5; slots=127 | `{"replicas":5,"slots":127}` | five entries, wider circle |

With more replicas, duplicate positions become likely — 15 positions in 97 slots collide often — which is precisely when the node/replica tie-breakers in the comparator start to matter.

## Pitfalls the tests are designed to catch

- **`hash(key) % nodeCount`.** It answers every key, but it is not consistent hashing and it disagrees with the oracle as soon as the node list changes length. The whole point is the circle.
- **Sorting `input.nodes` in place.** `check` deep-compares the input afterwards with the message `'Input must not mutate'`. Build the ring array and sort that.
- **A comparator with only the position.** `sort` is stable in modern V8, so equal positions would keep the order the nodes arrived in — and `['a','b','c']` and `['c','b','a']` are both in the test, with the same expected answers.
- **Searching for `> point` instead of `>= point`.** Key `'0'` hashes to exactly 48, the same as `c`'s position, and must land on `c`.
- **Forgetting the wrap.** `'account-1'` at 83 is past the last position. `ring[lo]` would be `undefined`; `ring[lo % ring.length]` is entry 0.
- **Returning `undefined` rather than `null` for an empty ring.** The first node set in the test is `[]`, and `null` is asserted for every key.
- **Hashing the bare label instead of `node + '#' + replica`.** With `replicas: 1` that still produces a ring — a different one. The oracle hashes `'a#0'`.
- **Letting the rolling hash overflow.** Without `% cfg.slots` inside the loop, a long key drifts past exact integer arithmetic and the positions stop matching.

## Checking your work

```text
node js-more/verify.cjs --id=1929
node js-more/verify.cjs --starters --id=1929
```

Print your ring for `['a','b','c']` before running. For scenario 1 it should be exactly `c(48), b(57), a(66)`; if your positions differ, the hash or the `'#'` suffix is wrong and nothing downstream can be right.

## Try it yourself

1. Add a fourth node to the scenario-1 ring and count how many of the thirty numeric keys change owner. Then do the same for `replicas: 5`. Which moves fewer keys, and why?
2. Replace the binary search with `ring.findIndex(x => x.position >= point)`. Every test still passes — write down what a reviewer would object to.
3. Support weights: a node with weight 2 gets twice as many replicas. Where in the build loop does that go, and does the lookup change at all?
4. In words: explain why the wrap-around is `lo % ring.length` rather than a special case for `lo === ring.length`, and what the circle looks like at that point.
