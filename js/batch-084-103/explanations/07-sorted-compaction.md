# Compact sorted duplicates in place — js/batch-084-103 90

**What you practise:** the read/write two-pointer pattern, and rewriting an array in place under an O(1) extra-space budget.
**Prerequisites:** indexed loops; `Array.prototype.length` as a writable property; what "in place" and "O(1) extra space" actually forbid.
**Exercises:** 90: Compact sorted duplicates in place.

## The problem in plain words

The input is a sorted array of numbers, possibly with repeats. You must leave it holding each distinct value exactly once, in order, with nothing after them — and return how many values that is.

"In place" means you rewrite the array the caller handed you rather than returning a new one. The test checks both halves: the returned count *and* the contents of the caller's array afterwards.

"O(1) extra space" means the amount of memory you use beyond the input does not grow with the input. Building a `Set` of the values, or a fresh output array, is O(n) extra and does not qualify even if you copy the result back afterwards.

The pattern that fits is two pointers over one array. Because the input is sorted, equal values sit next to each other, so you can decide whether a value is new by comparing it with the last value you decided to keep.

## The contract you must honour

Taken from `tests/090-sorted-compaction.cjs`:

- `solve(a)` with `a = [1,1,2,2,2,5]` asserts the return value `3`, and then asserts `a` itself deep-equals `[1,2,5]`. The array is truncated, not merely rearranged.
- `solve(b)` with `b = []` asserts `0` and `b` still `[]`.
- `solve(c)` with `c = [-3,-3,-1]` asserts `2` and `c` equal to `[-3,-1]`. Negative values behave like any others.
- None of the three inputs are frozen, because the function is required to write to them.

## Approach

1. Keep `write` at `0`. It is both the next slot to fill and the count of values kept so far.
2. Walk the array with `read` from `0` to the end.
3. A value is new when there is nothing kept yet (`write === 0`) or when it differs from `nums[write - 1]`, the last value kept.
4. For a new value, store it at `nums[write]` and advance `write`.
5. After the loop, set `nums.length = write` to drop the leftover tail, and return `write`.

`write` is never greater than `read`, so the store can only overwrite a slot that has already been read. That is what makes a single array enough.

## Worked example — 90 Compact sorted duplicates in place

Input, from the first case: `nums = [1,1,2,2,2,5]`.

| `read` | `nums[read]` | last kept (`nums[write-1]`) | new? | array after the step | `write` |
| --- | --- | --- | --- | --- | --- |
| 0 | `1` | none, `write === 0` | yes | `[1,1,2,2,2,5]` | 1 |
| 1 | `1` | `1` | no | unchanged | 1 |
| 2 | `2` | `1` | yes | `[1,2,2,2,2,5]` | 2 |
| 3 | `2` | `2` | no | unchanged | 2 |
| 4 | `2` | `2` | no | unchanged | 2 |
| 5 | `5` | `2` | yes | `[1,2,5,2,2,5]` | 3 |

Then `nums.length = 3` truncates the array to `[1,2,5]` and `3` is returned.

Both facts are asserted on line 4 of the test file: `assert.equal(solve(a),3)` followed by `assert.deepEqual(a,[1,2,5])`.

The reference solution, as it now reads in `solutions/090-sorted-compaction.cjs`:

```js
function compactSorted(nums) {
  let write = 0;
  for (let read = 0; read < nums.length; read++) {
    if (write === 0 || nums[read] !== nums[write - 1]) {
      nums[write] = nums[read];
      write++;
    }
  }
  nums.length = write;
  return write;
}
```

## Variations you could build

| Variation | What would change in the code |
| --- | --- |
| Keep up to two copies of each value | compare against `nums[write - 2]` and allow the write when `write < 2` |
| Remove every occurrence of one given value instead | the condition becomes `nums[read] !== victim`; sortedness is no longer needed |
| Return the removed values as well | that costs O(k) extra space, so the O(1) requirement has to be relaxed first |

## Pitfalls the tests are designed to catch

- **Returning a new array.** The test never looks at the return value as an array; it checks the caller's array, which an out-of-place version leaves untouched.
- **Forgetting `nums.length = write`.** The returned count would be right and the array would start with the right values, but `deepEqual(a,[1,2,5])` fails because the stale tail is still there.
- **Comparing with `nums[read - 1]` instead of `nums[write - 1]`.** On a sorted array those agree, so this passes — but it stops being equivalent the moment the input is not fully sorted, and it hides what the write pointer is for.
- **Using a `Set` or a `filter` and copying back.** Behaviourally correct, O(n) extra space, and the header states the budget.
- **Special-casing the empty array.** It is not needed: the loop body never runs, `nums.length = 0` is a no-op on an empty array, and `0` is returned.
- **Using `splice` inside the loop.** Removing while iterating shifts every later element and turns an O(n) pass into O(n²).

## Try it yourself

1. Rewrite the guard so it reads `read === 0 || …` instead of `write === 0 || …` and explain why both work for a sorted input.
2. Add a `compare` parameter so the function can compact by a key rather than by strict inequality. Does the O(1) budget survive?
3. In words: "in place" and "O(1) extra space" are not the same requirement. Describe an implementation that satisfies one and not the other.
