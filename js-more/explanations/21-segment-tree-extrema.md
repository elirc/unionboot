# Segment-tree extrema — js-more 1919–1928

**What you practise:** the iterative segment tree — range queries and point updates in O(log n) — carrying enough information in each node to report *where* the extreme is, not just what it is.
**Prerequisites:** array-backed binary trees (children of `i` at `2i` and `2i+1`); bit shifts `>>=`; half-open ranges; writing a comparison that is total, so ties are never left to chance.
**Exercises:** 1919: min/first/pair, 1920: min/last/pair, 1921: max/first/pair, 1922: max/last/pair, 1923: min/first/index, 1924: min/last/index, 1925: max/first/index, 1926: max/last/index, 1927: min/value, 1928: max/value.

## The problem in plain words

You are given `{values, ops}`. A `set` operation writes one cell. A `query` operation asks for the extreme — the minimum or the maximum — over a half-open range `[start, end)`. The result is an array with one entry per query.

Scanning the range per query is O(n) each time. A segment tree precomputes the answer for every aligned block: the leaves hold the individual cells, each internal node holds the extreme of its two children, and any range can be covered by O(log n) of those nodes. A `set` then repairs one path from a leaf to the root, also O(log n).

The wrinkle that makes this family more than a textbook exercise is that most variants must report the *index* of the extreme. So a node cannot hold a bare number; it holds `{value, index}`, and merging two nodes has to break value ties by index, deterministically.

"Policy" is three knobs. `extreme` chooses minimum or maximum. `tie` chooses the first or the last index among equal values. `output` chooses the shape reported: the pair, the index alone, or the value alone.

## The contract you must honour

Taken from `tests/1919.cjs` and its siblings, whose model is `a.slice(start, end)` plus `indexOf`/`lastIndexOf`:

- The return value is a flat array of query results. `set` operations contribute nothing.
- A range is half-open: `{start:2, end:2}` is empty and its answer is `null`.
- The tie rule is exactly `op.start + (cfg.tie === 'last' ? range.lastIndexOf(value) : range.indexOf(value))` — an absolute index into the original array, not an offset within the slice.
- Under `output=pair` the answer is `{value, index}`, with those two keys. Under `output=index` it is a number; under `output=value` it is a number.
- `check({values:[], ops:[]}, [])` — an empty input is legal.
- `assert.throws(()=>solve({values:[], ops:[{type:'query', start:0, end:1}]}), /Range/)` — `end` beyond the array is `RangeError('Range')`. The reference throws `RangeError('Index')` for a bad `set` index; that one is not asserted here.
- `check` clones the input and finishes with `deep(input, before, 'Input must not mutate')`, so `values` must be copied before the first `set`.
- The prompt's "use O(log n) point updates/queries" is a source-review requirement — the `CONTRACT` section says complexity requirements "also need source review". A `Math.min(...range)` per query passes every assertion in the file.
- `cfg` for 1927 and 1928 has no `tie` key. `cfg.tie === 'first'` is then `false`, so merge keeps the higher index on a tie — invisible, because only the value is reported.

## Approach

1. Copy `input.values` into `values`. This is both the working array and the source of the bounds checks.
2. Round the leaf count up to a power of two: `let size = 1; while (size < values.length) size *= 2;`. Allocate `tree` with `size * 2` slots, all `null`. Slot 0 is unused; the root is slot 1; leaf `i` is slot `size + i`.
3. Write `merge(a, b)`, the one function that knows the policies. `null` means "no element", so `merge(null, x)` is `x`. Different values: `cfg.extreme` decides. Equal values: `cfg.tie` decides by index. Because it handles `null`, the padding leaves beyond `values.length` can never win.
4. Fill the leaves with `{value, index}` records, then build every internal node from `size - 1` down to 1. Each node is the merge of its children, so it is computed after them.
5. `set`: validate the index, update `values`, rewrite the leaf, then walk up with `at >>= 1`, recomputing each parent from its two children. That is one node per level.
6. `query`: validate, then run the standard bottom-up sweep with `left = size + start`, `right = size + end`. While `left < right`: if `left` is odd it is a right child, so it is a block that belongs to the range — take it and move on; if `right` is odd, step back to `right - 1` and take that block. Then halve both. The loop runs once per level.
7. Shape the answer per `cfg.output`, with `null` passed through untouched.

## Worked example — 1919 Segment-tree extrema / scenario 1 — extreme=min; tie=first; output=pair

The input, quoted from `tests/1919.cjs`:

```js
const values = [4,1,7,1,7,3];
const ops = [
  {type:'query', start:0, end:6},
  {type:'query', start:1, end:4},
  {type:'set',   index:1, value:9},
  {type:'query', start:0, end:6},
  {type:'set',   index:2, value:9},
  {type:'query', start:0, end:6},
  {type:'query', start:2, end:2}
];
```

Six values, so `size` climbs to 8 and `tree` has 16 slots. Leaves 8–13 hold the values; 14 and 15 stay `null`.

| Slot | Covers | Content after the build |
| --- | --- | --- |
| 8–13 | cells 0–5 | `{4,0} {1,1} {7,2} {1,3} {7,4} {3,5}` |
| 14, 15 | padding | `null`, `null` |
| 7 | padding | `merge(null, null) = null` |
| 6 | cells 4–5 | `merge({7,4},{3,5}) = {3,5}` |
| 5 | cells 2–3 | `merge({7,2},{1,3}) = {1,3}` |
| 4 | cells 0–1 | `merge({4,0},{1,1}) = {1,1}` |
| 3 | cells 4–7 | `merge({3,5}, null) = {3,5}` |
| 2 | cells 0–3 | `merge({1,1},{1,3})` — equal values, `tie=first` → `{1,1}` |
| 1 | everything | `merge({1,1},{3,5}) = {1,1}` |

Slot 2 is the tie in action: two cells hold 1, and the policy keeps index 1.

**Query 1, `[0,6)`.** `left = 8`, `right = 14`.

| Pass | `left`, `right` | Action | `result` |
| --- | --- | --- | --- |
| 1 | 8, 14 | both even; halve | `null` |
| 2 | 4, 7 | `right` odd → take slot 6 (`{3,5}`), `right` becomes 6; halve | `{3,5}` |
| 3 | 2, 3 | `right` odd → take slot 2 (`{1,1}`), `right` becomes 2; halve | `{1,1}` |
| end | 1, 1 | `left < right` is false | `{1,1}` |

Answer `{value:1, index:1}`. Two nodes were read, not six cells.

**Query 2, `[1,4)`.** `left = 9`, `right = 12`. Pass 1: `left` is odd → take slot 9 (`{1,1}`), `left` becomes 10; `right` is even; halve to 5 and 6. Pass 2: `left` is odd → take slot 5 (`{1,3}`); `merge({1,1},{1,3})` is a tie, so `tie=first` keeps `{1,1}`; halve to 3 and 3, loop ends. Answer `{value:1, index:1}`.

**`set` 1 → 9.** `values` becomes `[4,9,7,1,7,3]`; leaf 9 becomes `{9,1}`; slot 4 is recomputed as `merge({4,0},{9,1}) = {4,0}`, slot 2 as `merge({4,0},{1,3}) = {1,3}`, slot 1 as `merge({1,3},{3,5}) = {1,3}`. Three parents touched.

**Query 3, `[0,6)`** now returns `{value:1, index:3}` — the remaining 1.

**`set` 2 → 9** leaves the minimum where it is, so **query 4** also returns `{value:1, index:3}`.

**Query 5, `[2,2)`.** `left = right = 10`, so the loop body never runs and `result` stays `null`. The answer is `null`, not `{value:undefined}`.

Expected output: `[{value:1,index:1}, {value:1,index:1}, {value:1,index:3}, {value:1,index:3}, null]`. The test builds the same array with `Math.min(...range)` and `indexOf`, then calls `check({values, ops}, answers)`.

The reference solution, as it now reads in `solutions/1919.cjs`:

```js
function segmentTree(input) {
  const values = [...input.values];
  let size = 1;
  while (size < values.length) {
    size *= 2;
  }
  const tree = Array(size * 2).fill(null);

  const merge = (a, b) => {
    if (a === null) return b;
    if (b === null) return a;
    if (a.value !== b.value) {
      return (cfg.extreme === 'min' ? a.value < b.value : a.value > b.value) ? a : b;
    }
    return (cfg.tie === 'first' ? a.index < b.index : a.index > b.index) ? a : b;
  };

  values.forEach((value, index) => { tree[size + index] = { value, index }; });
  for (let i = size - 1; i > 0; i--) {
    tree[i] = merge(tree[2 * i], tree[2 * i + 1]);
  }

  const answers = [];
  for (const op of input.ops) {
    if (op.type === 'set') {
      if (!Number.isInteger(op.index) || op.index < 0 || op.index >= values.length) {
        throw new RangeError('Index');
      }
      values[op.index] = op.value;
      let at = size + op.index;
      tree[at] = { value: op.value, index: op.index };
      while (at > 1) {
        at >>= 1;
        tree[at] = merge(tree[at * 2], tree[at * 2 + 1]);
      }
    } else if (op.type === 'query') {
      if (!Number.isInteger(op.start) || !Number.isInteger(op.end) || op.start < 0 || op.end < op.start || op.end > values.length) {
        throw new RangeError('Range');
      }
      let left = size + op.start;
      let right = size + op.end;
      let result = null;
      while (left < right) {
        if (left % 2) result = merge(result, tree[left++]);
        if (right % 2) result = merge(result, tree[--right]);
        left >>= 1;
        right >>= 1;
      }
      answers.push(result === null ? null : cfg.output === 'index' ? result.index : cfg.output === 'value' ? result.value : result);
    } else {
      throw new Error('Unknown operation');
    }
  }

  return answers;
}
```

## Policy matrix — what changes between the variants

All three knobs live in two expressions: `merge`, and the `answers.push` line.

| ID | Variant | Semantic key | What differs in the code |
| --- | --- | --- | --- |
| 1919 | min; first; pair | `{"extreme":"min","output":"pair","tie":"first"}` | baseline: `a.value < b.value`; ties keep the lower index; push the record |
| 1920 | min; last; pair | `{"extreme":"min","output":"pair","tie":"last"}` | the tie line flips to `a.index > b.index` |
| 1921 | max; first; pair | `{"extreme":"max","output":"pair","tie":"first"}` | the value line flips to `a.value > b.value` |
| 1922 | max; last; pair | `{"extreme":"max","output":"pair","tie":"last"}` | both comparisons flip |
| 1923 | min; first; index | `{"extreme":"min","output":"index","tie":"first"}` | push `result.index` instead of `result` |
| 1924 | min; last; index | `{"extreme":"min","output":"index","tie":"last"}` | last-index tie, push `result.index` |
| 1925 | max; first; index | `{"extreme":"max","output":"index","tie":"first"}` | maximum, push `result.index` |
| 1926 | max; last; index | `{"extreme":"max","output":"index","tie":"last"}` | maximum, last-index tie, push `result.index` |
| 1927 | min; value | `{"extreme":"min","output":"value"}` | push `result.value`; no `tie` key, so ties keep the higher index and are unobservable |
| 1928 | max; value | `{"extreme":"max","output":"value"}` | maximum, push `result.value` |

Note the shape of the family: `tie` only matters when the index is reported, which is why the two `output=value` variants drop it from `cfg` altogether.

## Pitfalls the tests are designed to catch

- **Storing bare numbers in the tree.** Then the index has to be recovered with a scan, which is O(n) and usually gets the tie wrong. The record travels with the value.
- **Reporting an index relative to the slice.** The test computes `op.start + range.indexOf(value)`. A query over `[1,4)` that reports 0 instead of 1 fails.
- **Breaking ties by accident.** `a.value <= b.value ? a : b` silently implements `tie=first` for minimum and `tie=last` for maximum. Compare values and indices separately.
- **Letting padding leaves win.** With `size` rounded up, slots beyond the data exist. They are `null`, and `merge` must return the other operand rather than compare `null.value`.
- **Returning something other than `null` for an empty range.** `{start:2, end:2}` is in the test, and `null` is asserted.
- **Aliasing `input.values`.** `const values = input.values` makes the first `set` mutate the caller's array; `deep(input, before, 'Input must not mutate')` catches it.
- **Rebuilding the whole tree after a `set`.** Correct, but O(n) per update, against the prompt's requirement. The repair walk is `while (at > 1) { at >>= 1; … }`.
- **Forgetting `left++` / `--right` in the query sweep.** Taking a node without advancing past it either loops forever or double-counts. Double-counting is invisible for min and max, which makes it a bug you only find by reading.
- **Using `values.length` as `size`.** The sweep relies on `size` being a power of two so that `left >>= 1` lands on real parents.

## Checking your work

```text
node js-more/verify.cjs --id=1919
node js-more/verify.cjs --starters --id=1919
```

Print `tree` after the build for `[4,1,7,1,7,3]` and compare with the table above. If slot 2 is `{1,3}` rather than `{1,1}`, your tie policy is inverted.

## Try it yourself

1. Add an `output` of `'count'` reporting how many cells in the range hold the extreme value. What has to change in `merge`, and is the merge still associative?
2. Make `set` lazy: batch the updates and repair only before the next query. Which assertion in the test would notice if you got the batching wrong?
3. Replace the iterative sweep with a recursive query and confirm it gives identical tie results. Which version is easier to be sure about?
4. In words: explain why `left % 2` means "this node is a right child" and why that makes it a block wholly inside the range.
