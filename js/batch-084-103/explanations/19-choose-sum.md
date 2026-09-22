# Fixed-size combinations reaching a target — js/batch-084-103 102

**What you practise:** backtracking with a start index, and knowing which prunes are sound and which quietly lose answers.
**Prerequisites:** recursion with an explicit undo step; why `[...chosen]` and `chosen` are different values; lexicographic ordering.
**Exercises:** 102: Fixed-size combinations reaching a target.

## The problem in plain words

Given a list of integers, pick exactly `k` of them — by position, never reusing a position — and keep the picks whose total equals `target`. Return every such pick.

Two ordering rules fix the output. Inside a combination, the values appear in the order their positions appear in the input. Across combinations, the results are in lexicographic order *of the index tuples*: `[0,4]` before `[1,3]`, and so on.

The standard shape for this is backtracking: maintain a partial choice, extend it one element at a time, and undo the extension when that branch is exhausted. Passing a `start` index to each recursive call is what prevents a position being reused and keeps the indices ascending. Trying candidates in increasing index order is what produces the lexicographic output order for free.

The hint contains a warning worth taking seriously: "do not prune solely because a partial sum exceeds the target." That prune is standard for positive-only inputs, and it is wrong here, because negative values are allowed and an overshooting partial sum can come back down.

## The contract you must honour

Taken from `tests/102-choose-sum.cjs`:

- `solve([1,2,3,4,5],2,6)` asserts `[[1,5],[2,4]]`. Both pairs sum to 6, and `[1,5]` (indices 0 and 4) comes before `[2,4]` (indices 1 and 3).
- `solve([5,-4,2],2,1)` asserts `[[5,-4]]`. `5 + (-4)` is `1`. The partial sum after picking `5` is already above the target of `1`, so any implementation that prunes on that fails here.
- `solve([],0,0)` asserts `[[]]` — a single result, the empty combination, whose sum is 0.
- `solve([1],2,1)` asserts `[]`: there are not enough elements to pick 2.
- `solve([1,2],0,3)` asserts `[]`: the only 0-element combination sums to 0, which is not 3.
- Combinations are arrays of *values*, not of indices.

## Approach

1. Keep `out` for finished combinations and `chosen` as the partial one.
2. `visit(start, sum)`:
   - if `chosen.length === k`, the combination is complete: push a *copy* when `sum === target`, then return;
   - otherwise try each index `i` from `start` up to the last index that still leaves enough elements behind it. Push `nums[i]`, recurse with `i + 1` and the updated sum, then pop.
3. Call `visit(0, 0)` and return `out`.

The upper bound in step 2 is a count-based prune, and it is sound: choosing index `i` leaves `nums.length - 1 - i` positions after it, and `k - chosen.length - 1` more are still needed, so `i` can go no higher than `nums.length - (k - chosen.length)`. It rules out branches that provably cannot reach length `k` — it never rules out a branch on the basis of its sum.

Pushing `[...chosen]` rather than `chosen` matters because `chosen` is a single array reused across the whole search; storing it directly would store a reference that the later `pop` calls then empty out.

## Worked example — 102 Fixed-size combinations reaching a target

Input, from the second assertion: `nums = [5,-4,2]`, `k = 2`, `target = 1`.

`visit(0, 0)` with `chosen = []`. `stillNeeded` is 2, so `lastUsableStart` is `3 - 2 = 1`: `i` runs over `0` and `1`.

| call | `chosen` | `sum` | what happens |
| --- | --- | --- | --- |
| `visit(0,0)`, `i = 0` | `[5]` | — | push `5`, recurse |
| `visit(1,5)` | `[5]` | `5` | `stillNeeded` is 1, `lastUsableStart` is `3-1 = 2`; `i` runs over `1`, `2` |
| ↳ `i = 1` → `visit(2,1)` | `[5,-4]` | `1` | length is `k`; `1 === 1`, so push `[5,-4]` |
| ↳ `i = 2` → `visit(3,7)` | `[5,2]` | `7` | length is `k`; `7 !== 1`, discard |
| back in `visit(0,0)`, `i = 1` | `[-4]` | — | push `-4`, recurse |
| `visit(2,-4)` | `[-4]` | `-4` | `i` runs over `2` only |
| ↳ `i = 2` → `visit(3,-2)` | `[-4,2]` | `-2` | `-2 !== 1`, discard |

Result `[[5,-4]]`, asserted on line 5 of the test file.

Look at the second row: after picking `5` the running sum is `5`, already past the target of `1`. A sum-based prune would cut that branch and lose the only answer.

The reference solution, as it now reads in `solutions/102-choose-sum.cjs`:

```js
function chooseSum(nums, k, target) {
  const out = [];
  const chosen = [];
  function visit(start, sum) {
    if (chosen.length === k) {
      if (sum === target) {
        out.push([...chosen]);
      }
      return;
    }
    const stillNeeded = k - chosen.length;
    const lastUsableStart = nums.length - stillNeeded;
    for (let i = start; i <= lastUsableStart; i++) {
      chosen.push(nums[i]);
      visit(i + 1, sum + nums[i]);
      chosen.pop();
    }
  }
  visit(0, 0);
  return out;
}
```

## Variations you could build

| Variation | What would change in the code |
| --- | --- |
| Any size rather than exactly `k` | record a copy at every node whose sum matches, not only at depth `k`; the count-based bound disappears |
| Allow a position to be reused | recurse with `i` instead of `i + 1`, and the count-based bound stops being valid |
| Restrict to nonnegative inputs and prune on the sum | sort ascending first, then `if (sum > target) break` becomes sound — which is exactly why the header forbids it here |

## Pitfalls the tests are designed to catch

- **Pruning on the running sum.** `solve([5,-4,2],2,1)` returns `[]` instead of `[[5,-4]]`.
- **Pushing `chosen` instead of `[...chosen]`.** Every stored result ends up as the same array, emptied by the final `pop` calls, so `out` is a list of empty arrays.
- **Recursing with `i` instead of `i + 1`.** Positions get reused: `solve([1,2,3,4,5],2,6)` would also yield `[3,3]`.
- **Checking `sum === target` before `chosen.length === k`.** A partial choice that happens to hit the target would be recorded at the wrong length.
- **Returning `[]` for `solve([],0,0)`.** With `k = 0` the very first call is already complete, so the empty combination must be tested and kept.
- **Iterating candidates in any order other than ascending index.** The results would come out in the wrong order and `deepEqual` compares element by element.

## Try it yourself

1. Add a counter for how many times `visit` is called on `[1,2,3,4,5]` with `k = 2`. Compare it with `C(5,2)` and account for the difference.
2. Make the function return index tuples rather than value tuples. Which line changes, and does the ordering claim become easier to state?
3. In words: the count-based bound is described above as sound. Give the argument in one sentence, and then say what makes the sum-based prune unsound for this input domain.
