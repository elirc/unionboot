# Union-find components — js-more 1759–1768

**What you practise:** the disjoint-set union structure with full path compression, and a representative-selection policy that is decided by node number rather than by tree size.
**Prerequisites:** `Array.from({length:n},(_,i)=>i)` to seed an identity array; `Set` for counting distinct values; the difference between `Error` and `RangeError`; [01 LFU cache eviction](01-lfu-cache-eviction.md) for the "unknown operation throws" pattern.
**Exercises:** 1759: size=3; root=minimum, 1760: size=3; root=maximum, 1761: size=4; root=minimum, 1762: size=4; root=maximum, 1763: size=5; root=minimum, 1764: size=5; root=maximum, 1765: size=6; root=minimum, 1766: size=6; root=maximum, 1767: size=7; root=minimum, 1768: size=7; root=maximum.

## The problem in plain words

You start with `size` nodes numbered `0` to `size-1`, each in a group of its own. The input is an array of operations. `{type:'union',a,b}` merges the groups containing `a` and `b`. `{type:'same',a,b}` asks whether `a` and `b` are already in the same group and records the answer.

A disjoint-set forest represents the groups as trees. `parent[i]` points one step towards the root of `i`'s tree; a node whose parent is itself is the root, and the root is the group's representative. Two nodes are in the same group exactly when they have the same root.

"Policy" here is which representative survives a merge. `root=minimum` keeps the lower-numbered of the two roots and points the higher one at it. `root=maximum` does the opposite. This is unusual — a real implementation would link by rank or size to keep the trees shallow — but it makes the reported roots predictable, which is what the test asserts. The other knob is simply how many nodes exist, from 3 to 7.

The answer is `{answers, roots, components}`: the booleans from the `same` operations in order, the representative of every node after compressing the whole forest, and the number of distinct groups.

## The contract you must honour

Taken from `prompts/1759.txt` and `tests/1759.cjs`:

- The input is the operations array itself. `check([], {answers:[], roots:Array.from({length:cfg.size},(_,i)=>i), components:cfg.size})` is the first assertion: with no operations every node is its own representative and there are `size` components.
- `roots` is reported "after compressing every node", so it has one entry per node, in node order — not one entry per group.
- `components` is a count, not a list.
- An out-of-range or non-integer node throws `RangeError('Unknown node')`. The test asserts `assert.throws(()=>solve([{type:'same',a:-1,b:0}]),/Unknown node/)`, and the prompt names the constructor: `RangeError`, not `Error`.
- An unrecognised operation type throws `Error('Unknown operation')`.
- The node check comes first. In the reference both `op.a` and `op.b` are validated before `op.type` is looked at, so `{type:'nonsense',a:-1,b:0}` reports the bad node rather than the bad type.
- The prompt requires "full path compression". The test cannot observe it directly — the reported `roots` would be the same without it — so this is one of the requirements the CONTRACT section covers with "Algorithmic complexity/structural sharing requirements also need source review".
- `check` clones the input and asserts `'Input must not mutate'`. The operations are only read.
- The test builds its expectation with an independent model: an array of group arrays merged with `[...a,...b]`, from which it derives the roots as `Math.min(...g)` or `Math.max(...g)` according to `cfg.root`.

## Approach

1. `const parent = Array.from({length: cfg.size}, (_, i) => i)`. Every node starts as its own root.
2. Write `find(x)` in two passes. The first walks `parent` up to the root. The second walks the same chain again, pointing every node it passes directly at the root. This is full path compression: after `find(x)` returns, `x` and every node between it and the root are one hop from the root.

   The second loop needs care. `parent[x] = root` would lose the way forward, so the next node is read into a local first:

   ```js
   while (parent[x] !== x) {
     const next = parent[x];
     parent[x] = root;
     x = next;
   }
   ```

3. For each operation, validate both node fields with `Number.isInteger(value) && value >= 0 && value < n` and throw `RangeError('Unknown node')` if either fails.
4. Resolve both roots with `find`. For `union`, if the roots differ, compute which one survives from `cfg.root` and set `parent[absorbed] = survivor`. For `same`, push `rootA === rootB`. Anything else throws `Error('Unknown operation')`.
5. Afterwards, `parent.map((_, i) => find(i))` gives the roots array and, as a side effect, flattens every remaining chain.
6. `new Set(roots).size` is the component count.

With path compression alone the amortised cost per operation is very close to constant — `O(log n)` worst case per find, far better in practice. At sizes 3 to 7 the constant factors are irrelevant; the structure is the lesson.

## Worked example — 1759 Union-find components / scenario 1

The hand-written operation list, quoted from line 9 of `tests/1759.cjs`:

```js
const ops=[{type:'same',a:0,b:1},{type:'union',a:0,b:1},{type:'union',a:2,b:1},{type:'same',a:0,b:2},{type:'union',a:cfg.size-1,b:2},{type:'same',a:cfg.size-1,b:0}];
```

With `cfg = {"root":"minimum","size":3}`, `cfg.size-1` is `2`, so the fifth operation is `union(2,2)`.

| Step | Operation | `find(a)`, `find(b)` | Action | `parent` after | `answers` |
| --- | --- | --- | --- | --- | --- |
| start | — | — | — | `[0,1,2]` | `[]` |
| 1 | `same 0 1` | 0, 1 | different roots | `[0,1,2]` | `[false]` |
| 2 | `union 0 1` | 0, 1 | survivor `min(0,1)=0`, absorbed `1` | `[0,0,2]` | `[false]` |
| 3 | `union 2 1` | 2, 0 | survivor `min(2,0)=0`, absorbed `2` | `[0,0,0]` | `[false]` |
| 4 | `same 0 2` | 0, 0 | same root | `[0,0,0]` | `[false,true]` |
| 5 | `union 2 2` | 0, 0 | roots equal, nothing to do | `[0,0,0]` | `[false,true]` |
| 6 | `same 2 0` | 0, 0 | same root | `[0,0,0]` | `[false,true,true]` |

The final pass calls `find` on 0, 1 and 2, all of which return `0`, so `roots` is `[0,0,0]` and `new Set([0,0,0]).size` is `1`. The return value is

```js
{answers:[false,true,true], roots:[0,0,0], components:1}
```

Step 3 is where `cfg.root` bites. `find(op.b)` is `find(1)`, which is `0`, so the two roots are `2` and `0`. Under `minimum` the survivor is `0`. Under `maximum` (1760) the survivor would be `2`, node `0` would be reparented, and the same six operations would end with `roots: [2,2,2]`. The `answers` array is identical in both — connectivity does not depend on which representative you name.

Step 5 is a self-union. `union(2,2)` resolves both sides to the same root, so `survivor` and `absorbed` are the same node and the write would be `parent[0] = 0` — a no-op. The `if (rootA !== rootB)` guard therefore does not change the answer; it states the intent, and it is the line you would extend if the exercise ever grew a union-by-size rule.

At `size = 3` the trees never get deep enough for compression to show. At `size = 7` (1767, 1768) it does. Suppose `union(1,2)` then `union(0,1)` under `minimum`:

| After | `parent` | Shape |
| --- | --- | --- |
| `union(1,2)` | `parent[2] = 1` | `2 → 1` |
| `union(0,1)` | `parent[1] = 0` | `2 → 1 → 0` |
| `find(2)` | `parent[2] = 0` | `2 → 0`, `1 → 0` |

The first walk of `find(2)` visits `2, 1, 0` and settles on root `0`. The second walk revisits `2` and `1` and repoints both at `0`. Node `2` was two hops from its root before the call and one hop after, permanently.

The empty case asserted on line 9 is the other end of the range: no operations, `parent` never changes, `roots` is `[0,1,2]` and `components` is `3`.

The error case on the same line:

```js
assert.throws(()=>solve([{type:'same',a:-1,b:0}]),/Unknown node/);
```

`-1` fails `value >= 0`, so `RangeError('Unknown node')` is thrown before `find` is ever called with a negative index — which matters, because `parent[-1]` is `undefined` and the `while` loop would spin on `undefined !== -1` forever.

The reference solution, as it now reads in `solutions/1759.cjs`:

```js
function unionFind(input) {
  const n = cfg.size;
  const parent = Array.from({length: n}, (_, i) => i);
  const answers = [];
  function find(x) {
    let root = x;
    while (parent[root] !== root) root = parent[root];
    while (parent[x] !== x) {
      const next = parent[x];
      parent[x] = root;
      x = next;
    }
    return root;
  }
  const inRange = value => Number.isInteger(value) && value >= 0 && value < n;
  for (const op of input) {
    if (!inRange(op.a) || !inRange(op.b)) throw new RangeError('Unknown node');
    const rootA = find(op.a);
    const rootB = find(op.b);
    if (op.type === 'union') {
      if (rootA !== rootB) {
        const survivor = cfg.root === 'minimum' ? Math.min(rootA, rootB) : Math.max(rootA, rootB);
        const absorbed = cfg.root === 'minimum' ? Math.max(rootA, rootB) : Math.min(rootA, rootB);
        parent[absorbed] = survivor;
      }
    } else if (op.type === 'same') {
      answers.push(rootA === rootB);
    } else {
      throw new Error('Unknown operation');
    }
  }
  const roots = parent.map((_, i) => find(i));
  return {answers, roots, components: new Set(roots).size};
}
```

## Policy matrix — what changes between the variants

`cfg.size` appears in the `parent` seed and in the range check. `cfg.root` appears only in the two lines that pick `survivor` and `absorbed`.

| ID | Variant | What differs in the prompt | What differs in the code |
| --- | --- | --- | --- |
| 1759 | size=3; root=minimum | `{"root":"minimum","size":3}` | 3 nodes; `survivor = Math.min(rootA, rootB)` |
| 1760 | size=3; root=maximum | `{"root":"maximum","size":3}` | 3 nodes; `survivor = Math.max(rootA, rootB)` |
| 1761 | size=4; root=minimum | `{"root":"minimum","size":4}` | 4 nodes; minimum survives |
| 1762 | size=4; root=maximum | `{"root":"maximum","size":4}` | 4 nodes; maximum survives |
| 1763 | size=5; root=minimum | `{"root":"minimum","size":5}` | 5 nodes; minimum survives |
| 1764 | size=5; root=maximum | `{"root":"maximum","size":5}` | 5 nodes; maximum survives |
| 1765 | size=6; root=minimum | `{"root":"minimum","size":6}` | 6 nodes; minimum survives |
| 1766 | size=6; root=maximum | `{"root":"maximum","size":6}` | 6 nodes; maximum survives |
| 1767 | size=7; root=minimum | `{"root":"minimum","size":7}` | 7 nodes; minimum survives |
| 1768 | size=7; root=maximum | `{"root":"maximum","size":7}` | 7 nodes; maximum survives |

`size` also changes the operations the test generates, because the fifth operation is `{type:'union',a:cfg.size-1,b:2}`. At size 3 that is the self-union traced above; at size 7 it merges node 6 into node 2's group, and the expected `roots` array is seven entries long.

## Pitfalls the tests are designed to catch

- **Throwing plain `Error` for a bad node.** The prompt distinguishes `RangeError('Unknown node')` from `Error('Unknown operation')`. The assertion here is a regex on the message, so this particular test would not catch it, but the distinction is stated in the prompt and the reviewer reads the source.
- **Validating after dispatching.** `find(-1)` reads `parent[-1]`, which is `undefined`, and `while (undefined !== -1)` never ends. Check the range first.
- **Half a path compression.** Setting `parent[x] = root` only for the node you were asked about leaves the intermediate nodes deep. The prompt says "full path compression".
- **Losing the chain during compression.** Writing `parent[x] = root; x = parent[x];` sets `x` to `root` immediately and stops after one node. Read `next` before overwriting.
- **Linking by size or rank.** The usual optimisation picks the larger tree as the survivor, which contradicts `cfg.root` and produces different `roots` values. Here the policy wins over the optimisation.
- **Reparenting the operands instead of their roots.** `parent[op.b] = op.a` merges the wrong things: `op.a` may not be a root, so `op.b`'s whole tree ends up hanging off the middle of another one and the reported representative is wrong. Always link root to root.
- **Returning the distinct roots as `components`.** It is `new Set(roots).size`, a number. The empty case asserts `components: cfg.size`.
- **Deriving `roots` from `parent` directly.** `parent` after the loop is not yet fully compressed; `parent[2]` could still be `1`. The prompt says the roots are reported "after compressing every node", which is what `parent.map((_, i) => find(i))` does.
- **Recording answers for `union` operations.** `answers` has one entry per `same` operation only — three operations in the traced case produce two `true`s and one `false`, not six entries.

## Try it yourself

1. Add a `{type:'size',a}` operation that pushes the number of nodes in `a`'s group into `answers`. What extra array do you need, and where does it have to be updated?
2. Implement union by size *in addition to* the `cfg.root` rule, by keeping the policy for the reported representative but the size rule for the actual tree shape. What does `roots` have to become?
3. Count how many times the inner `while` of `find` executes across the whole run, and compare `size = 7` with and without the second (compressing) loop.
4. In words: `components` could also be computed as `parent.filter((p, i) => p === i).length`. Explain why that is correct only after the final compression pass, and give an operation sequence where it would differ beforehand.
