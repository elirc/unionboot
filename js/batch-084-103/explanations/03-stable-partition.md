# Partition with callback indices — js/batch-084-103 86

**What you practise:** splitting an array in two by a predicate while keeping order, and controlling how many times a caller's callback is invoked.
**Prerequisites:** `Array.prototype.forEach` and its `(value, index)` arguments; what "stable" means for a reordering operation; the cost of calling the same predicate twice.
**Exercises:** 86: Partition with callback indices.

## The problem in plain words

A partition splits one array into two: the values the predicate accepts, and everything else. The obvious implementation is `[values.filter(p), values.filter(v => !p(v))]`, and it is wrong for two reasons the test checks.

First, it calls the predicate twice per element. That matters whenever the predicate is expensive, keeps a counter, logs, or is simply not pure. Here the predicate is allowed to record every call, and the test compares that record against an exact expected list.

Second, `filter` only hands the predicate a value and an index — but the two-filter version numbers the second pass over the whole array again, so the indices it reports would be wrong relative to a single pass. The requirement is `predicate(value, index)` exactly once per item, with the index being the item's position in the input.

"Stable" here means the values inside each returned array appear in the same relative order as they did in the input. A single forward pass with `push` gives that for free.

## The contract you must honour

Taken from `tests/086-stable-partition.cjs`:

- The return value is a two-element array, `[matches, others]`, in that order. `solve([1,2,3,4], n => n % 2 === 0)` asserts `[[2,4],[1,3]]`.
- `solve([], () => true)` asserts `[[],[]]` — two empty arrays, not one.
- The predicate receives `(value, index)`. The third case pushes every call into `seen` and then asserts `seen` equals `[['a',0],['b',1],['c',2]]`, which pins down the call count, the call order and both arguments.
- That same case uses the predicate `(v, i) => i !== 1` and asserts the result `[['a','c'],['b']]`, so the split is driven by the index, not by the value.
- The input is a dense array and must not be mutated.

## Approach

1. Create two empty arrays, `matches` and `others`.
2. Walk the input with `forEach`, which supplies both the value and its index.
3. Call the predicate once and store nothing but its truthiness; append the value to `matches` or to `others`.
4. Return `[matches, others]`.

One pass, one predicate call per element, O(n).

## Worked example — 86 Partition with callback indices

Input, from the third case: `['a','b','c']` with the predicate `(v, i) => { seen.push([v, i]); return i !== 1; }`.

| index | value | call recorded in `seen` | predicate result | `matches` | `others` |
| --- | --- | --- | --- | --- | --- |
| 0 | `'a'` | `['a',0]` | `0 !== 1` — true | `['a']` | `[]` |
| 1 | `'b'` | `['b',1]` | `1 !== 1` — false | `['a']` | `['b']` |
| 2 | `'c'` | `['c',2]` | `2 !== 1` — true | `['a','c']` | `['b']` |

Two things are asserted about this run, on lines 6 and 7 of the test file: the returned value equals `[['a','c'],['b']]`, and `seen` equals `[['a',0],['b',1],['c',2]]`.

The reference solution, as it now reads in `solutions/086-stable-partition.cjs`:

```js
function partition(values, predicate) {
  const matches = [];
  const others = [];
  values.forEach((value, index) => {
    if (predicate(value, index)) {
      matches.push(value);
    } else {
      others.push(value);
    }
  });
  return [matches, others];
}
```

## Variations you could build

| Variation | What would change in the code |
| --- | --- |
| Partition into more than two buckets by a key function | the two arrays become a `Map` from key to array, filled with `get`/`set` |
| Return indices rather than values | `push(value)` becomes `push(index)` |
| Partition in place, moving matches to the front | a write pointer like exercise 90's, and stability for the second group is lost |

## Pitfalls the tests are designed to catch

- **Two `filter` calls.** `seen` would end up with six entries and fail the exact comparison on line 7.
- **Calling the predicate once but reading its result twice as `p(v) ? … : …` written out twice.** Same failure, for the same reason: count the calls, not the branches.
- **Dropping the index argument.** `values.forEach(value => …)` compiles fine and passes the first two assertions, then fails the third, where the predicate needs the index to decide.
- **Returning an object `{matches, others}`.** The test uses `deepEqual` against a two-element array, so the shape is fixed.
- **Reordering with `sort` or `reverse` to group matches together.** That both mutates the input and breaks stability.

## Try it yourself

1. Change the function so the predicate is also handed the whole array as a third argument, the way `Array.prototype.filter` does. Does the existing test still pass?
2. Write a version that short-circuits: stop calling the predicate as soon as one of the two buckets reaches a given size. What is the new return shape?
3. In words: give a concrete predicate for which the two-`filter` implementation returns a *different answer*, not merely a slower one.
