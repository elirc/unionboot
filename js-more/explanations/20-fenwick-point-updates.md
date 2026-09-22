# Fenwick point updates — js-more 1909–1918

**What you practise:** the Fenwick (binary indexed) tree — prefix sums that survive point updates in O(log n) — and the bit trick `i & -i` that makes it work.
**Prerequisites:** binary representation of integers; two's complement negation, so that `i & -i` is the lowest set bit; prefix sums; half-open versus closed ranges.
**Exercises:** 1909: set/exclusive/sum, 1910: set/inclusive/sum, 1911: add/exclusive/sum, 1912: add/inclusive/sum, 1913: set/exclusive/average, 1914: set/inclusive/average, 1915: add/exclusive/average, 1916: add/inclusive/average, 1917: set/exclusive/sum + initialOffset 1, 1918: add/inclusive/average + initialOffset 1.

## The problem in plain words

You are given `{values, ops}`: an array of numbers and a list of operations over it. An `update` changes one cell. A `range` asks for the total of a slice. The answer to every `range` goes into an output array, and the final state of the values comes back alongside it.

The naive implementation is two lines — write the cell, `slice().reduce()` the range — and it is O(n) per query. The prompt asks for something better: "O(log n) updates/queries after setup". A Fenwick tree delivers that by storing, in slot `i`, the sum of a block of cells whose length is the lowest set bit of `i`. Walking up or down through those blocks touches one slot per set bit, so at most about `log₂ n` of them.

The tree is 1-based: slot 0 is unused. That is not decoration — the `i & -i` trick needs a non-zero index to make progress.

"Policy" is three knobs, plus a fourth on two variants. `update` decides whether an update replaces a cell or adds to it. `inclusive` decides whether a range's `end` is inside the range. `output` decides between the sum and the mean. `initialOffset` shifts every starting value before the tree is built.

## The contract you must honour

Taken from `tests/1909.cjs` and its siblings, which build the expected answers with a plain-array model:

- Return shape is `{answers, values}` — the range results in order, and the array after all updates.
- The values array in the result must be a copy. The test's `check` clones the input and finishes with `deep(input, before, 'Input must not mutate')`, so writing through `input.values` fails with that message.
- `check({values:[], ops:[]}, {answers:[], values:[]})` — an empty input is legal and must not divide by anything.
- Range ends follow the policy: the test's last operation is `{type:'range', start:4, end: cfg.inclusive ? 4 : 5}`, and both forms must cover the single cell at index 4.
- `assert.throws(()=>solve({values:[1], ops:[{type:'update', index:1, value:2}]}), /Index/)` — an out-of-bounds index is `RangeError('Index')`.
- `assert.throws(()=>solve({values:[1], ops:[{type:'range', start:-1, end:0}]}), /Range/)` — a bad range is `RangeError('Range')`. Validation happens on the *normalized* end, after the inclusive shift.
- The reference also throws `new Error('Unknown operation')` for an unrecognized `type`; no test in this family asserts it.
- With `output=average` an empty range yields `null`, not `0` and not `NaN`. The test's model is `range.length ? sum / range.length : null`.
- With `initialOffset` (1917, 1918) the starting values are shifted: the test's model is `values.map(x => x + (cfg.initialOffset || 0))`. Values supplied later by an `update` are *not* shifted.
- The prompt's "O(log n) updates/queries after setup" is a source-review requirement — the `CONTRACT` section says structural and complexity requirements "also need source review". A correct O(n) implementation passes every assertion here.

## Approach

1. Copy the values into a local `nums`. It is both your working state and the snapshot you return.
2. Allocate `tree` with `nums.length + 1` zeros. Index 0 is never read or written.
3. `add(at, value)` adds `value` to position `at` (0-based) by walking `i = at + 1`, `i += i & -i`, while `i < tree.length`. Each step jumps to the next slot whose block covers `at`.
4. `sum(end)` totals the first `end` cells by walking `i = end`, `i -= i & -i`, while `i > 0`. Each step drops one set bit, and `i` reaches 0 in at most `log₂ n` steps.
5. Seed the tree with `nums.forEach((x, i) => add(i, x))`. That is O(n log n); an O(n) build exists and is one of the extensions below.
6. For an `update`, validate the index, compute the new cell value under the policy, feed the *delta* `next - nums[index]` to `add`, then store `next`. The tree only ever learns differences.
7. For a `range`, normalize `end` under `inclusive`, validate, then `sum(end) - sum(start)`. Divide by `end - start` for the average, guarding the empty case.

## Worked example — 1909 Fenwick point updates / scenario 1 — update=set; inclusive=false; output=sum

The input, quoted from `tests/1909.cjs`:

```js
const values = [2,4,6,8,10];
const ops = [
  {type:'range',  start:0, end:3},
  {type:'update', index:1, value:3},
  {type:'range',  start:1, end:3},
  {type:'update', index:4, value:-2},
  {type:'range',  start:4, end: cfg.inclusive ? 4 : 5}
];
```

For 1909, `cfg.inclusive` is false, so the last range is `start:4, end:5`.

**Building the tree.** Slots are 1-based; `tree[i]` covers the `i & -i` cells ending at position `i - 1`.

| Call | Slots touched | `tree` after |
| --- | --- | --- |
| `add(0, 2)` | 1, 2, 4 | `[0, 2, 2, 0, 2, 0]` |
| `add(1, 4)` | 2, 4 | `[0, 2, 6, 0, 6, 0]` |
| `add(2, 6)` | 3, 4 | `[0, 2, 6, 6, 12, 0]` |
| `add(3, 8)` | 4 | `[0, 2, 6, 6, 20, 0]` |
| `add(4, 10)` | 5 | `[0, 2, 6, 6, 20, 10]` |

Read the finished tree: `tree[1] = 2` is cell 0; `tree[2] = 6` is cells 0–1; `tree[4] = 20` is cells 0–3; `tree[5] = 10` is cell 4. `tree[3] = 6` is cell 2 alone.

**The operations.**

| Step | Operation | Work | Result |
| --- | --- | --- | --- |
| 1 | range 0–3 | `sum(3) = tree[3] + tree[2] = 6 + 6 = 12`; `sum(0) = 0` | answer `12` |
| 2 | update 1 → 3 | delta `3 − 4 = −1`; `add(1, −1)` touches slots 2 and 4 → `tree = [0,2,5,6,19,10]`; `nums[1] = 3` | — |
| 3 | range 1–3 | `sum(3) = 6 + 5 = 11`; `sum(1) = tree[1] = 2`; `11 − 2` | answer `9` |
| 4 | update 4 → −2 | delta `−2 − 10 = −12`; `add(4, −12)` touches slot 5 → `tree = [0,2,5,6,19,−2]`; `nums[4] = −2` | — |
| 5 | range 4–5 | `sum(5) = tree[5] + tree[4] = −2 + 19 = 17`; `sum(4) = tree[4] = 19`; `17 − 19` | answer `−2` |

Expected output: `{answers: [12, 9, −2], values: [2, 3, 6, 8, −2]}`.

Step 1 is worth reading twice. `sum(3)` walks `i = 3`, adds `tree[3]`, then `i -= 3 & -3 = 1`, landing on `i = 2`, adds `tree[2]`, then `i -= 2` reaches 0 and stops. Two slots, not three cells — that is the whole point of the structure, and on a 5-element array it is barely a saving. On a million elements it is 20 slots instead of a million.

Step 5 shows how a half-open range becomes two prefixes: `[4, 5)` is "the first 5 cells minus the first 4".

The test then checks `{values:[], ops:[]}` — `tree` has length 1, the loop never runs — and the two error cases.

The reference solution, as it now reads in `solutions/1909.cjs`:

```js
function fenwick(input) {
  const nums = [...input.values];
  const tree = Array(nums.length + 1).fill(0);
  const answers = [];
  const add = (at, value) => {
    for (let i = at + 1; i < tree.length; i += i & -i) {
      tree[i] += value;
    }
  };
  const sum = end => {
    let total = 0;
    for (let i = end; i > 0; i -= i & -i) {
      total += tree[i];
    }
    return total;
  };
  nums.forEach((x, i) => add(i, x));

  for (const op of input.ops) {
    if (op.type === 'update') {
      if (!Number.isInteger(op.index) || op.index < 0 || op.index >= nums.length) {
        throw new RangeError('Index');
      }
      const next = cfg.update === 'set' ? op.value : nums[op.index] + op.value;
      add(op.index, next - nums[op.index]);
      nums[op.index] = next;
    } else if (op.type === 'range') {
      const end = op.end + (cfg.inclusive ? 1 : 0);
      if (!Number.isInteger(op.start) || !Number.isInteger(end) || op.start < 0 || end < op.start || end > nums.length) {
        throw new RangeError('Range');
      }
      const value = sum(end) - sum(op.start);
      answers.push(cfg.output === 'average' ? (end === op.start ? null : value / (end - op.start)) : value);
    } else {
      throw new Error('Unknown operation');
    }
  }

  return { answers, values: nums };
}
```

## Policy matrix — what changes between the variants

| ID | Variant | Semantic key | What differs in the code |
| --- | --- | --- | --- |
| 1909 | set; exclusive; sum | `{"inclusive":false,"output":"sum","update":"set"}` | baseline: `next = op.value`; `end = op.end`; push `value` |
| 1910 | set; inclusive; sum | `{"inclusive":true,"output":"sum","update":"set"}` | `end = op.end + 1` before validation |
| 1911 | add; exclusive; sum | `{"inclusive":false,"output":"sum","update":"add"}` | `next = nums[op.index] + op.value` |
| 1912 | add; inclusive; sum | `{"inclusive":true,"output":"sum","update":"add"}` | both of the above |
| 1913 | set; exclusive; average | `{"inclusive":false,"output":"average","update":"set"}` | push `value / (end - op.start)`, or `null` when the range is empty |
| 1914 | set; inclusive; average | `{"inclusive":true,"output":"average","update":"set"}` | inclusive end plus the average |
| 1915 | add; exclusive; average | `{"inclusive":false,"output":"average","update":"add"}` | additive update plus the average |
| 1916 | add; inclusive; average | `{"inclusive":true,"output":"average","update":"add"}` | all three knobs |
| 1917 | set; exclusive; sum; initialOffset=1 | `{"inclusive":false,"initialOffset":1,"output":"sum","update":"set"}` | `nums` is `input.values.map(x => x + cfg.initialOffset)` instead of a plain copy |
| 1918 | add; inclusive; average; initialOffset=1 | `{"inclusive":true,"initialOffset":1,"output":"average","update":"add"}` | the offset seed plus the additive, inclusive, averaging knobs |

Note where each knob lives: `update` inside the update branch, `inclusive` in one `+ (… ? 1 : 0)`, `output` in the `answers.push`, `initialOffset` only in the seeding line. None of them touches `add` or `sum`.

## Pitfalls the tests are designed to catch

- **Feeding the tree the new value instead of the delta.** `add(index, next)` would add the value on top of the old one. The tree stores sums, so a point update is always `next - nums[index]`, and `nums[index]` must be read before it is overwritten.
- **Writing through `input.values`.** `const nums = input.values` aliases the caller's array; every update then mutates it and `deep(input, before, 'Input must not mutate')` fails.
- **Validating the raw `end`.** With `inclusive` the normalized end can be `nums.length`, which is legal, while the raw end is `nums.length - 1`. Validate after the shift, as the reference does.
- **Returning `0` or `NaN` for an empty average.** The model is `range.length ? sum / range.length : null`. `end === op.start` is the empty test, and `0 / 0` is `NaN`, which is not `null`.
- **Starting the tree at index 0.** `i & -i` is 0 when `i` is 0, so `i += i & -i` never advances and `add` loops forever, or `sum` never terminates. The `+ 1` in `add` and the `i > 0` in `sum` keep it 1-based.
- **Using `i & -i` on a non-integer.** The guard `Number.isInteger(op.index)` is there for a reason: `1.5` would pass a plain `< nums.length` check and corrupt the walk.
- **Replacing the tree with a running `reduce`.** Every assertion still passes, and the prompt's O(log n) requirement is broken. This is checked by source review.
- **Reusing `tree` between calls.** Everything is allocated inside `fenwick`, so each call starts clean; the prompt's "Each call creates independent state" depends on it.

## Checking your work

```text
node js-more/verify.cjs --id=1909
node js-more/verify.cjs --starters --id=1909
```

Print your `tree` after the seeding loop for `[2,4,6,8,10]` and compare it with `[0, 2, 6, 6, 20, 10]` above. If that matches, `sum` and `add` are consistent with each other.

## Try it yourself

1. Replace the seeding loop with the O(n) build: copy the values into `tree[i+1]`, then for each `i` add `tree[i]` into `tree[i + (i & -i)]` when that index is in range. Verify the tree comes out identical.
2. Add a `range` variant that reports the maximum instead of the sum. Why can a Fenwick tree not do this with the same two walks?
3. Support `update` with a non-integer index by rejecting it earlier, and write the assertion you would add to the test to catch it.
4. In words: explain why `sum(end) - sum(start)` is correct for a half-open range, and what would have to change if ranges were closed on both ends everywhere rather than shifted by the policy.
