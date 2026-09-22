# Length of a strictly increasing subsequence — js/batch-084-103 100

**What you practise:** the patience-sorting approach to longest increasing subsequence, where a binary search inside the loop buys O(n log n) instead of O(n²).
**Prerequisites:** the lower-bound search from doc 06; the difference between a subsequence and a substring; why an array can be kept sorted by construction.
**Exercises:** 100: Length of a strictly increasing subsequence.

## The problem in plain words

A *subsequence* is what you get by deleting some elements and keeping the rest in order. It does not have to be contiguous: `[2,3,7,101]` is a subsequence of `[10,9,2,5,3,7,101,18]`. You must return the length of the longest one whose values strictly increase.

"Strictly" rules out equal neighbours: `[2,2,2]` has a longest increasing subsequence of length 1, not 3.

The O(n²) approach is dynamic programming — for each position, look back at every earlier smaller value. The O(n log n) approach that the header asks for keeps a much smaller piece of state.

Maintain an array `tails`, where `tails[i]` is the smallest value that can end an increasing subsequence of length `i + 1` among the values seen so far. That array is automatically sorted ascending, because a longer subsequence has to end on a larger value than a shorter prefix of it. Being sorted is what makes it searchable by bisection.

For each incoming value, find the first slot whose recorded tail is greater than or equal to it, and overwrite that slot. Overwriting makes the recorded tail for that length smaller, which can only make future values easier to append. If no slot qualifies, the value is larger than every tail and extends the array by one.

Only `tails.length` is meaningful at the end. The contents of `tails` are *not* a valid subsequence of the input — a common surprise.

## The contract you must honour

Taken from `tests/100-increasing-subsequence.cjs`:

- `solve([10,9,2,5,3,7,101,18])` asserts `4`. One witness is `2,3,7,101`; `2,5,7,101` is another.
- `solve([2,2,2])` asserts `1`: equal values do not extend a sequence.
- `solve([])` asserts `0`.
- `solve([5,4,3])` asserts `1`: a strictly decreasing array has no increasing pair.
- `solve([-3,-2,-1])` asserts `3`: negative values behave like any others.
- The return value is a length, a plain number, not the subsequence itself.

## Approach

1. Start with an empty `tails`.
2. For each value in the input, run a lower-bound binary search over `tails` for the first index whose tail is `>= value`. This is the same routine as exercise 89, with `tails.length` as the exclusive upper bound.
3. Write the value at that index. If the index equals `tails.length`, the write extends the array by exactly one.
4. Return `tails.length`.

The comparison inside the search is `tails[mid] < value` — strict. A value equal to an existing tail therefore lands on that tail's own slot and replaces it rather than extending, which is precisely the "strictly increasing" rule.

One binary search per element gives O(n log n).

## Worked example — 100 Length of a strictly increasing subsequence

Input, from the first assertion: `[10,9,2,5,3,7,101,18]`.

| value | lower-bound index in `tails` | action | `tails` after |
| --- | --- | --- | --- |
| `10` | 0 (empty array) | extend | `[10]` |
| `9` | 0 (`10 >= 9`) | replace | `[9]` |
| `2` | 0 (`9 >= 2`) | replace | `[2]` |
| `5` | 1 (`2 < 5`, past the end) | extend | `[2,5]` |
| `3` | 1 (`2 < 3`, `5 >= 3`) | replace | `[2,3]` |
| `7` | 2 (past the end) | extend | `[2,3,7]` |
| `101` | 3 (past the end) | extend | `[2,3,7,101]` |
| `18` | 3 (`7 < 18`, `101 >= 18`) | replace | `[2,3,7,18]` |

`tails.length` is `4`, asserted on line 4 of the test file.

The final `tails` is `[2,3,7,18]`, which is *not* a subsequence of the input in that order — `18` comes after `101` in the input, yet `101` is gone. That is the point about only the length being meaningful.

For `[2,2,2]`: the first `2` extends to `[2]`; the second finds index 0, because `tails[0] >= 2`, and replaces it; so does the third. Length `1`, as asserted on line 5.

The reference solution, as it now reads in `solutions/100-increasing-subsequence.cjs`:

```js
function lisLength(nums) {
  const tails = [];
  for (const value of nums) {
    let lo = 0;
    let hi = tails.length;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (tails[mid] < value) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    tails[lo] = value;
  }
  return tails.length;
}
```

## Variations you could build

| Variation | What would change in the code |
| --- | --- |
| Non-strictly increasing (equal values may extend) | the search comparison becomes `tails[mid] <= value` |
| Longest *decreasing* subsequence | run the same routine over the reversed input, or flip the comparison |
| Recover the subsequence itself, not just its length | record, per input position, which slot it landed in and its predecessor; the answer is then rebuilt by walking that chain backwards |

## Pitfalls the tests are designed to catch

- **Using `<=` in the search.** That is the non-strict variant, and `solve([2,2,2])` would return `3` instead of `1`.
- **Pushing instead of assigning.** `tails.push(value)` when the index is past the end and `tails[lo] = value` otherwise is the same thing written twice; assigning at `lo` covers both, because `lo` can equal `tails.length`.
- **Returning `tails` and reading its contents as the answer.** The length is correct; the contents are generally not a subsequence of the input.
- **Assuming contiguity.** A window-based reading of "subsequence" gives `2` for the first case, not `4`.
- **Falling back to the O(n²) DP.** It passes every assertion, but the header states the O(n log n) target and the reviewer reads the source.
- **Seeding `tails` with the first element before the loop.** Then `solve([])` needs a special case to return `0`.

## Try it yourself

1. Add a counter for how many times the binary search runs and confirm it is exactly `nums.length` for each test case.
2. Modify the function to return the actual subsequence for the first test input. How much extra state does it need?
3. In words: explain why `tails` is always sorted ascending, without appealing to the fact that the code happens to keep it that way.
