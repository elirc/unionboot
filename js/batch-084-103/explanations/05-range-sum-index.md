# Build a range-sum query function — js/batch-084-103 88

**What you practise:** paying an O(n) setup cost once so that every later query is O(1), and returning a closure that owns a private snapshot.
**Prerequisites:** closures and captured variables; prefix sums; half-open intervals `[start, end)`; `Number.isInteger`.
**Exercises:** 88: Build a range-sum query function.

## The problem in plain words

This exercise returns a function rather than a value. `rangeSumIndex(nums)` does some preparation and hands back `query(start, end)`, which answers "what is the sum of `nums[start]` up to but not including `nums[end]`?" — a half-open range, written `nums[start..end)`.

The point of the split is cost. Preparing an index is allowed to look at every element once; each individual query after that must be constant time, no matter how wide the range is.

A prefix-sum table gives exactly that. `prefix[i]` is the total of the first `i` values. Then the sum of a range is one subtraction: everything up to `end`, minus everything up to `start`.

The table is built when `rangeSumIndex` is called, which makes it a snapshot. If the caller changes `nums` afterwards, the queries keep answering about the array as it was — and the test checks precisely that.

## The contract you must honour

Taken from `tests/088-range-sum-index.cjs`:

- `rangeSumIndex(nums)` returns a function. The test calls it as `q(start, end)`.
- With `input = [2,-1,4,7]`: `q(1,3)` asserts `3` (that is `-1 + 4`), and `q(0,4)` asserts `12` (the whole array).
- `q(2,2)` asserts `0`. An empty range is legal and sums to zero.
- After `input[0] = 999`, `q(0,1)` still asserts `2`. The index is a snapshot taken at build time.
- `q(3,2)` asserts a `RangeError` — `end` below `start` is rejected.
- `q(0,5)` asserts a `RangeError` — `end` above `nums.length` is rejected.
- `solve([])(0,0)` asserts `0`. An empty array still yields a usable query for the empty range.

## Approach

1. Build `prefix`, starting at `[0]`. For each value in `nums`, push the previous total plus that value. The array ends up with `nums.length + 1` entries.
2. Return a `query` function that closes over `prefix`.
3. Inside `query`, reject a non-integer `start` or `end` with `RangeError`.
4. Reject bounds outside `0 <= start <= end <= nums.length`. Because `prefix.length` is `nums.length + 1`, that upper bound is written `end >= prefix.length`.
5. Return `prefix[end] - prefix[start]`.

Setup is O(n); each query is one array read, one array read and one subtraction.

## Worked example — 88 Build a range-sum query function

Input, from the first line of the test: `nums = [2,-1,4,7]`.

Building the table:

| step | value | `prefix` after the push |
| --- | --- | --- |
| seed | — | `[0]` |
| 1 | `2` | `[0,2]` |
| 2 | `-1` | `[0,2,1]` |
| 3 | `4` | `[0,2,1,5]` |
| 4 | `7` | `[0,2,1,5,12]` |

Answering the queries:

| call | computation | result | asserted |
| --- | --- | --- | --- |
| `q(1,3)` | `prefix[3] - prefix[1]` = `5 - 2` | `3` | line 4 |
| `q(0,4)` | `prefix[4] - prefix[0]` = `12 - 0` | `12` | line 5 |
| `q(2,2)` | `prefix[2] - prefix[2]` = `1 - 1` | `0` | line 5 |
| `q(0,1)` after `input[0]=999` | `prefix[1] - prefix[0]` = `2 - 0` | `2` | line 6 |

The reference solution, as it now reads in `solutions/088-range-sum-index.cjs`:

```js
function rangeSumIndex(nums) {
  const prefix = [0];
  for (const value of nums) {
    prefix.push(prefix[prefix.length - 1] + value);
  }
  return function query(start, end) {
    if (!Number.isInteger(start) || !Number.isInteger(end)) {
      throw new RangeError('Invalid range');
    }
    if (start < 0 || end < start || end >= prefix.length) {
      throw new RangeError('Invalid range');
    }
    return prefix[end] - prefix[start];
  };
}
```

## Variations you could build

| Variation | What would change in the code |
| --- | --- |
| Inclusive ranges, `query(start, end)` covering `end` | the subtraction becomes `prefix[end + 1] - prefix[start]`, and the upper bound shifts by one |
| A range-minimum index instead of a sum | a prefix table no longer works, because minimum is not invertible; you need a sparse table or a segment tree |
| Allow updates, `set(index, value)` | prefix sums become O(n) per update; a Fenwick tree makes both operations O(log n) |

## Pitfalls the tests are designed to catch

- **Closing over `nums` and summing on demand.** Queries stop being O(1), and worse, `input[0] = 999` would change the answer and fail the snapshot assertion.
- **Building the table without the leading zero.** Then `q(0, end)` needs a special case, and `q(2,2)` no longer falls out as `0`.
- **Writing the bound as `end > prefix.length`.** `prefix.length` is `nums.length + 1`, so that would accept `q(0,5)` on a four-element array and fail the sixth assertion.
- **Forgetting the `start <= end` check.** `q(3,2)` would return a negative number instead of throwing.
- **Skipping the integer check.** `q(0, 1.5)` would read `prefix[1.5]`, which is `undefined`, and return `NaN` silently.
- **Throwing `Error` rather than `RangeError`.** Both `assert.throws` calls name the constructor.

## Try it yourself

1. Add a `count(start, end)` method to the returned object so a caller can compute a mean. What does the returned value become — still a function, or an object?
2. Make the index reject a `nums` array containing a non-finite number at build time. Which error type fits, and why does the existing test not constrain your choice?
3. In words: explain what "snapshot" means here in terms of who owns the `prefix` array, and why nothing outside `rangeSumIndex` can reach it.
