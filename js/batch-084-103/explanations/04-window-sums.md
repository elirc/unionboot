# Rolling fixed-window sums — js/batch-084-103 87

**What you practise:** the sliding-window technique — keeping a running aggregate up to date in O(1) per step instead of recomputing it.
**Prerequisites:** indexed `for` loops; `Number.isInteger`; throwing built-in error types; what O(n) versus O(n·k) means for a loop nest.
**Exercises:** 87: Rolling fixed-window sums.

## The problem in plain words

A window of size `k` is a contiguous stretch of `k` values. Over `[1,2,3,4]` with `k = 2` the windows are `[1,2]`, `[2,3]` and `[3,4]`, and their sums are `3`, `5` and `7`. You must return that list of sums.

The straightforward way is a loop inside a loop: for every start position, add up the next `k` values. That costs O(n·k), and the header sets a target of O(n).

The sliding-window trick is that consecutive windows overlap in `k − 1` positions. Moving from `[1,2]` to `[2,3]` adds `3` and removes `1`; everything in between is already in the total. So carry one running `sum`, add the value entering the window, subtract the value leaving it, and each element is touched a constant number of times.

## The contract you must honour

Taken from `tests/087-window-sums.cjs`:

- `solve([1,2,3,4],2)` asserts `[3,5,7]`: there are `n − k + 1` windows.
- `solve([-2,3,-1],1)` asserts `[-2,3,-1]`. With `k = 1` every element is its own window, and negative values are ordinary.
- `solve([1],2)` asserts `[]`. A window larger than the array produces nothing — it is not an error.
- `solve([],0)` asserts a `RangeError`, so `k = 0` is rejected.
- `solve([1],1.5)` asserts a `RangeError`, so a non-integer `k` is rejected too. Note that the first of these has an empty array and the second a non-empty one: the validation runs before anything else, independent of the input.

## Approach

1. Validate `k` first: `Number.isInteger(k)` and `k >= 1`, otherwise `throw new RangeError('Invalid window')`.
2. Keep `sum` at 0 and walk the array with an index `i`.
3. Add `nums[i]` — the value entering the window.
4. If `i >= k`, subtract `nums[i - k]` — the value that has just fallen out the back.
5. If `i >= k - 1` the window is full, so push the current `sum`.
6. Return the collected sums.

Each index is added once and subtracted at most once, which is the O(n) the header asks for.

## Worked example — 87 Rolling fixed-window sums

Input, from the first assertion: `nums = [1,2,3,4]`, `k = 2`.

| `i` | `nums[i]` added | `i >= k`? subtract `nums[i-k]` | `sum` | `i >= k-1`? push | output so far |
| --- | --- | --- | --- | --- | --- |
| 0 | `+1` | `0 >= 2` — no | `1` | `0 >= 1` — no | `[]` |
| 1 | `+2` | `1 >= 2` — no | `3` | `1 >= 1` — yes | `[3]` |
| 2 | `+3` | `2 >= 2` — yes, `−1` | `5` | yes | `[3,5]` |
| 3 | `+4` | `3 >= 2` — yes, `−2` | `7` | yes | `[3,5,7]` |

Expected output `[3,5,7]`, asserted on line 4 of the test file.

The reference solution, as it now reads in `solutions/087-window-sums.cjs`:

```js
function windowSums(nums, k) {
  if (!Number.isInteger(k) || k < 1) {
    throw new RangeError('Invalid window');
  }
  const sums = [];
  let sum = 0;
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];
    if (i >= k) {
      sum -= nums[i - k];
    }
    if (i >= k - 1) {
      sums.push(sum);
    }
  }
  return sums;
}
```

## Variations you could build

| Variation | What would change in the code |
| --- | --- |
| Rolling maximum instead of sum | a running total no longer works; you need a deque of candidate indices to stay O(n) |
| Rolling mean | divide `sum` by `k` at the push, nothing else |
| Windows that step by `s` positions rather than 1 | keep the same running sum but only push when `(i - k + 1) % s === 0` |

## Pitfalls the tests are designed to catch

- **Rebuilding each window with `slice` and `reduce`.** It passes every assertion but misses the stated O(n) target, which the reviewer reads the source for.
- **Validating `k` only when the array is non-empty.** `solve([],0)` must still throw, and it is the first of the two throwing assertions.
- **Using `typeof k === 'number'` instead of `Number.isInteger`.** `1.5` is a number and would slip through, failing the last assertion.
- **Throwing `Error` rather than `RangeError`.** `assert.throws(fn, RangeError)` checks the constructor.
- **Starting the output at `i >= k` instead of `i >= k - 1`.** That drops the first window, giving `[5,7]`.
- **Treating `k > nums.length` as an error.** The header and the third assertion both say it returns `[]`.

## Try it yourself

1. Extend the function so `k` may be `Infinity`, meaning "one window covering everything". Which of the two guards has to change?
2. Add an optional `minCount` so that a partial window at the end is emitted when at least that many values are available. Where in the loop does it belong?
3. In words: the running sum accumulates floating-point error that a fresh `slice(…).reduce(…)` would not. Describe an input where the two disagree, and explain why this test suite cannot catch it.
