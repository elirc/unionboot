# First valid insertion index — js/batch-084-103 89

**What you practise:** binary search written as a half-open interval, and the one comparison that decides whether duplicates report their first or their last position.
**Prerequisites:** `while` loops with two moving bounds; why `Math.floor((lo+hi)/2)` is written as `lo + Math.floor((hi-lo)/2)`; the meaning of O(log n).
**Exercises:** 89: First valid insertion index.

## The problem in plain words

Given a sorted ascending array and a target, find the first index whose value is greater than or equal to the target. In C++ this operation is called `lower_bound`, and it answers a practical question: where would you insert the target to keep the array sorted, choosing the leftmost of the valid spots?

Three cases fall out of that definition. If the target is smaller than everything, the answer is `0`. If it is larger than everything, the answer is `nums.length` — one past the end, which is still a legal insertion point. And if the target appears more than once, the answer is the position of its *first* copy.

That last case is the whole exercise. A binary search that stops as soon as it happens to land on a matching value can return any of the duplicates. To always land on the first one, the search must keep narrowing even after it finds a match.

## The contract you must honour

Taken from `tests/089-lower-bound.cjs`:

- `solve([1,3,3,7],3)` asserts `1`, not `2`. The two `3`s report the index of the first.
- `solve([1,3,3,7],4)` asserts `3`. No value equals `4`, so the answer is the first value above it, `7` at index 3.
- `solve([],5)` asserts `0`. An empty array has exactly one insertion point.
- `solve([1,2],3)` asserts `2` — the length, because nothing reaches the target.
- `solve([1,2],-5)` asserts `0` — everything is already above the target.
- The header requires O(log n) and no mutation. Nothing here writes to `nums`.

## Approach

1. Keep a half-open interval `[lo, hi)`: `lo` starts at `0`, `hi` at `nums.length`. Half-open means `lo` is included and `hi` is not, which is why `hi` can legitimately equal the length.
2. The invariant to maintain is: every value at an index below `lo` is `< target`, and every value at an index from `hi` upwards is `>= target`.
3. While the interval is non-empty, take `mid` in the middle. If `nums[mid] < target`, the answer cannot be at `mid` or before, so `lo = mid + 1`. Otherwise `mid` might itself be the answer, so `hi = mid` — keeping `mid` inside the interval, since `hi` is exclusive.
4. When `lo === hi` the interval is empty and the invariant says `lo` is the first index whose value is `>= target`. Return it.

Each step halves the interval, so the loop runs at most `log2(n) + 1` times.

## Worked example — 89 First valid insertion index

Input, from the first assertion: `nums = [1,3,3,7]`, `target = 3`.

| step | `lo` | `hi` | `mid` | `nums[mid]` | `nums[mid] < 3`? | action |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 0 | 4 | `0 + floor(4/2)` = 2 | `3` | no | `hi = 2` |
| 2 | 0 | 2 | `0 + floor(2/2)` = 1 | `3` | no | `hi = 1` |
| 3 | 0 | 1 | `0 + floor(1/2)` = 0 | `1` | yes | `lo = 1` |
| — | 1 | 1 | — | — | — | interval empty, return `1` |

Notice step 2: the search had already landed on a `3` at index 2, and it kept going anyway. That is what walks it left to the first copy.

Expected output `1`, asserted on line 4 of the test file.

The reference solution, as it now reads in `solutions/089-lower-bound.cjs`:

```js
function lowerBound(nums, target) {
  let lo = 0;
  let hi = nums.length;
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (nums[mid] < target) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  return lo;
}
```

## Variations you could build

| Variation | What would change in the code |
| --- | --- |
| `upperBound`, the first index strictly *greater* than the target | the comparison becomes `nums[mid] <= target` |
| Search a descending array | the comparison flips to `nums[mid] > target` |
| Search by a key extractor, `lowerBoundBy(items, target, keyOf)` | compare `keyOf(items[mid])` instead of `nums[mid]` |

## Pitfalls the tests are designed to catch

- **Returning as soon as a match is found.** On `[1,3,3,7]` with target `3` the first probe lands on index 2 and an early return gives `2`, failing the first assertion.
- **Using `<=` instead of `<`.** That is `upperBound`: it returns `3` for the same input.
- **Using a closed interval `[lo, hi]` with `hi = nums.length - 1`.** Then the "not found" answer of `nums.length` needs a special case, and the empty array starts with `hi = -1`.
- **Writing `while (lo <= hi)` with a half-open interval.** `mid` can then be `nums.length`, and `nums[mid]` is `undefined`; every comparison with `undefined` is false, so the loop takes the `hi = mid` branch forever.
- **`Math.floor((lo + hi) / 2)` on very large arrays.** Not reachable in this test, but `lo + Math.floor((hi - lo) / 2)` is the habit worth forming because it cannot overflow.
- **Falling back to a linear scan.** It passes every assertion but not the stated O(log n) requirement, which the reviewer reads the source for.

## Try it yourself

1. Use this function to write `countEqual(nums, target)` in two calls and one subtraction. Which second search do you need?
2. Rewrite it recursively and compare: which version makes the invariant easier to state?
3. In words: explain why `hi = mid` rather than `hi = mid - 1`, and what would go wrong on `[3]` with target `3` if you used the latter.
