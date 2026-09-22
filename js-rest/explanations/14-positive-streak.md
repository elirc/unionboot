# Positive streak — js-rest 156–159

**What you practise:** collecting every maximal run that satisfies a predicate, then selecting one of them with a policy — and why collecting first makes all four policies trivial.
**Prerequisites:** two-pointer scanning with a manually advanced index; `Array.prototype.reduce` without a seed; [08 Locate character runs](08-locate-character-runs.md), which is the same problem over a string.
**Exercises:** 156: Positive streak: longest, 157: Positive streak: shortest, 158: Positive streak: first, 159: Positive streak: last.

## The problem in plain words

The input is an array of finite numbers. A streak is a contiguous stretch of strictly positive numbers — zero and negatives break it, and zero is explicitly *not* positive. You must return one streak as `{start, length}`, or `null` when the array contains no positive number at all.

"Policy" is which streak to pick: the longest, the shortest, the first or the last.

The shape that makes this easy is to do the two jobs separately. First scan once and record every streak. Then pick from that list. With the list in hand, "first" and "last" are array indexing, and "longest" and "shortest" are a single `reduce`.

Doing it in one fused pass is possible but fiddly, and it is where the tie rule tends to go wrong. The prompt states that rule for the two comparative variants: "First run wins equal lengths."

## The contract you must honour

Taken from `tests/156.cjs` through `tests/159.cjs`. These four files have **four** cases each:

- `[1,2,0,3,-1,4,5,6]` contains three streaks — `{start:0,length:2}`, `{start:3,length:1}`, `{start:5,length:3}` — and asserts `{"start":5,"length":3}` for longest, `{"start":3,"length":1}` for shortest, `{"start":0,"length":2}` for first and `{"start":5,"length":3}` for last. Longest and last happen to coincide on this input; only a different input would separate them.
- `[]` asserts `null` in all four.
- `[0,-2]` asserts `null` in all four. Zero does not start a streak, which is what "strictly positive" means.
- `[1]` asserts `{"start":0,"length":1}` in all four. A single positive number is a streak of length one.
- The return value is an object with exactly the keys `start` and `length`; `start` is the index of the streak's first element and `length` is its element count. There is no `end` key in this family — contrast [08 Locate character runs](08-locate-character-runs.md), which reports `{start, end, text}`.
- Every case ends with `assert.deepEqual(input, before, 'Input must not mutate')` against a `structuredClone`.

## Approach

1. Create `runs = []` and an index `i = 0`.
2. Loop while `i < input.length`:
   - if `input[i] <= 0`, this position is not part of any streak: `i++` and `continue`;
   - otherwise record `start = i`, advance `i` while the values stay positive, then push `{start, length: i - start}`.
   The outer loop does not advance `i` itself — the inner `while` has already moved it past the whole streak, which is what makes each recorded streak maximal and the total work linear.
3. If `runs` is empty, return `null`.
4. Apply the policy: `runs[0]`, `runs[runs.length - 1]`, or a `reduce` comparing lengths.

Cost: O(n) for the scan plus O(k) for the selection, where k is the number of streaks.

The `reduce` here is called without a seed, so the first element becomes the initial accumulator and the callback runs for elements 1 onwards. That is safe only because step 3 has already ruled out the empty array — `[].reduce(fn)` throws `TypeError: Reduce of empty array with no initial value`.

The tie rule lives in the comparison operator. `runs.reduce((best, run) => run.length > best.length ? run : best)` replaces the incumbent only on a *strictly* longer run, so among equals the earliest survives. Using `>=` would hand ties to the last run instead.

## Worked example — 156 Positive streak: longest

The first input in `tests/156.cjs`, on line 2, is `[1,2,0,3,-1,4,5,6]`:

| index | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| value | 1 | 2 | 0 | 3 | -1 | 4 | 5 | 6 |
| positive? | yes | yes | **no** | yes | **no** | yes | yes | yes |

The scan:

| `i` at top of loop | `input[i]` | Action | `runs` after | `i` after |
| --- | --- | --- | --- | --- |
| 0 | 1 | positive: inner loop runs to index 2 | `[{0,2}]` | 2 |
| 2 | 0 | not positive: skip | `[{0,2}]` | 3 |
| 3 | 3 | positive: inner loop runs to index 4 | `[{0,2},{3,1}]` | 4 |
| 4 | -1 | not positive: skip | `[{0,2},{3,1}]` | 5 |
| 5 | 4 | positive: inner loop runs to index 8 | `[{0,2},{3,1},{5,3}]` | 8 |
| 8 | — | `8 < 8` is false: loop ends | — | — |

Three streaks. Now the longest policy, via `reduce` with no seed:

| Step | `best` | `run` | `run.length > best.length` | `best` after |
| --- | --- | --- | --- | --- |
| seed | `{0,2}` | — | — | `{0,2}` |
| 1 | `{0,2}` | `{3,1}` | `1 > 2`, no | `{0,2}` |
| 2 | `{0,2}` | `{5,3}` | `3 > 2`, yes | `{5,3}` |

Result `{start: 5, length: 3}`, asserted on line 2. The shortest policy flips the comparison and ends on `{3,1}`; first returns `runs[0]`, `{0,2}`; last returns `runs[2]`, `{5,3}` — the same object longest picked, which is a coincidence of this input.

The third case, `[0,-2]`, never enters the inner loop, so `runs` stays empty and `null` is returned (line 4). The fourth, `[1]`, records one streak `{start: 0, length: 1}` and every policy returns it (line 5).

The reference solution, as it now reads in `solutions/156.cjs`:

```js
function solve(input) {
  const runs = [];
  let index = 0;
  while (index < input.length) {
    if (input[index] <= 0) {
      index++;
      continue;
    }
    const start = index;
    while (index < input.length && input[index] > 0) {
      index++;
    }
    runs.push({ start, length: index - start });
  }
  if (runs.length === 0) {
    return null;
  }
  return runs.reduce((best, run) => (run.length > best.length ? run : best));
}
```

## Policy matrix — what changes between the variants

| ID | Variant | What differs in the prompt | What differs in the code |
| --- | --- | --- | --- |
| 156 | longest | "longest contiguous run … First run wins equal lengths" | `reduce` with `run.length > best.length` |
| 157 | shortest | "shortest contiguous run … First run wins equal lengths" | `reduce` with `run.length < best.length` |
| 158 | first | "first contiguous run" | `return runs[0]`; no comparison |
| 159 | last | "last contiguous run" | `return runs[runs.length - 1]`; no comparison |

## Pitfalls the tests are designed to catch

- **Treating zero as positive.** `input[index] < 0` as the break test makes `[1,2,0,3,…]` one streak of four, so 156 returns `{start:0,length:4}` and 158 fails too. The third case, `[0,-2]`, asserts `null` and would return `{start:0,length:2}`.
- **Using `>=` in the longest comparison.** It hands ties to the last run. No visible case has two equal-longest streaks, so this is a prompt requirement the tests do not catch — and a difference you can see by comparing 156 with 159.
- **Advancing the index twice.** Writing `i++` after the inner `while` skips the element that broke the streak; on `[1,0,1]` the trailing streak is lost.
- **Returning `{start: 0, length: 0}` for an empty result.** All four assert `null` for `[]` and `[0,-2]`.
- **Calling `reduce` with no seed before the empty check.** `[].reduce(fn)` throws `TypeError`, so the `null` guard must come first.
- **Reporting `end` instead of `length`.** `assert.deepEqual` compares own keys; `{start: 5, end: 8}` fails against `{"start":5,"length":3}`.
- **Mutating the input to mark visited positions.** Writing `input[i] = 0` as you scan fails `assert.deepEqual(input, before, 'Input must not mutate')`.

## Try it yourself

1. Change the predicate to "strictly negative" without touching the selection policies. How many lines move?
2. Fuse the scan and the longest policy into one pass that never builds the `runs` array. Where does the tie rule live now, and is it still obvious?
3. Add a `count` variant returning how many streaks there are. Which of the four files is it closest to?
4. In words: 156 and 159 return the same object for the first test case. Construct an input where they differ, and say what that proves about the coverage of these tests.
