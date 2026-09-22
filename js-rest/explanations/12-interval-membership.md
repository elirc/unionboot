# Interval membership — js-rest 148–151

**What you practise:** the four interval conventions — closed, open, left-closed, right-closed — and why the choice of `<` versus `<=` is a specification decision, not a style one.
**Prerequisites:** `Array.prototype.filter`; object destructuring; guard clauses.
**Exercises:** 148: Interval membership: closed, 149: Interval membership: open, 150: Interval membership: left-closed, 151: Interval membership: right-closed.

## The problem in plain words

The input is `{start, end, values}`. You must return the values that fall inside the interval from `start` to `end`, in their original order, keeping duplicates.

An interval has two ends, and each end can be *included* or *excluded*. That gives four combinations, and mathematics has names and notation for all four: closed `[start, end]`, open `(start, end)`, left-closed `[start, end)` and right-closed `(start, end]`. Each of the four exercises implements one.

"Policy" is which ends are included, which shows up as exactly two comparison operators in one filter.

There is one shared validation rule: if `start > end` the interval is malformed and you must throw, regardless of variant. Note that `start === end` is *not* malformed — it is a degenerate interval, and the four conventions disagree about whether anything can be in it. Closed admits that one value; the other three admit nothing.

## The contract you must honour

Taken from `tests/148.cjs` through `tests/151.cjs`:

- `{"start":1,"end":3,"values":[0,1,2,3,4]}` asserts `[1,2,3]` for closed, `[2]` for open, `[1,2]` for left-closed and `[2,3]` for right-closed. The five values are chosen so that each boundary decision is visible.
- `{"start":2,"end":2,"values":[2]}` — the degenerate interval — asserts `[2]` for closed and `[]` for the other three.
- `{"start":3,"end":1,"values":[]}` asserts `assert.throws(()=>solve(input), e=>e instanceof Error && e.message==="Invalid interval")` in all four. The message is exactly `Invalid interval`, and `values` is empty, so the guard must run before any filtering.
- The output preserves input order and duplicates; it is not sorted and not de-duplicated.
- Every case ends with `assert.deepEqual(input, before, 'Input must not mutate')` against a `structuredClone`.

## Approach

1. Destructure `const { start, end, values } = input;`. Reading only.
2. Guard: `if (start > end) throw new Error('Invalid interval');`. Strictly greater, so `start === end` passes through.
3. Return `values.filter(value => …)` with the variant's two comparisons joined by `&&`. `filter` allocates a new array and visits elements in index order, which gives you "preserve order and duplicates" for free.

One pass, O(n), no allocation beyond the result.

The four predicates:

| Convention | Notation | Predicate |
| --- | --- | --- |
| closed | `[start, end]` | `value >= start && value <= end` |
| open | `(start, end)` | `value > start && value < end` |
| left-closed | `[start, end)` | `value >= start && value < end` |
| right-closed | `(start, end]` | `value > start && value <= end` |

Left-closed is worth remembering beyond this exercise: it is the convention JavaScript's `slice`, Python's ranges, and the `{start, end}` spans in [08 Locate character runs](08-locate-character-runs.md) all use. Its virtue is that adjacent intervals tile without overlap and without gaps: `[0, 3)` and `[3, 5)` cover `0..4` exactly once each.

## Worked example — 148 Interval membership: closed

The first input in `tests/148.cjs`, on line 2, is `{"start":1,"end":3,"values":[0,1,2,3,4]}`.

The guard: `1 > 3` is false, so nothing is thrown.

Now the filter, one row per value:

| value | `value >= 1` | `value <= 3` | kept |
| --- | --- | --- | --- |
| 0 | false | true | no |
| 1 | **true** | true | yes |
| 2 | true | true | yes |
| 3 | true | **true** | yes |
| 4 | true | false | no |

Result `[1,2,3]`, asserted as `assert.deepEqual(solve(input),[1,2,3])`. The two bold cells are the boundary decisions, and they are the only rows that differ between the four exercises: under the open convention row `1` fails `value > 1` and row `3` fails `value < 3`, leaving `[2]`; left-closed keeps row `1` and drops row `3`; right-closed does the reverse.

The second case, on line 3, is `{"start":2,"end":2,"values":[2]}`. The guard passes because `2 > 2` is false. Then `2 >= 2 && 2 <= 2` is true, so closed returns `[2]`. Under any convention with a strict comparison the same value fails one half and the answer is `[]` — the assertion in the other three files.

The third case, on line 4, is `{"start":3,"end":1,"values":[]}`. `3 > 1` is true and the throw fires. Note that the filter would have returned `[]` harmlessly, so the only reason the test can tell a missing guard from a present one is that `assert.throws` requires an exception.

The reference solution, as it now reads in `solutions/148.cjs`:

```js
function solve(input) {
  const { start, end, values } = input;
  if (start > end) {
    throw new Error('Invalid interval');
  }
  return values.filter(value => value >= start && value <= end);
}
```

## Policy matrix — what changes between the variants

| ID | Variant | What differs in the prompt | What differs in the code |
| --- | --- | --- | --- |
| 148 | closed | "values within closed interval: start<=x<=end" | `value >= start && value <= end` |
| 149 | open | "values within open interval: start<x<end" | `value > start && value < end` |
| 150 | left-closed | "values within left-closed interval: start<=x<end" | `value >= start && value < end` |
| 151 | right-closed | "values within right-closed interval: start<x<=end" | `value > start && value <= end` |

## Pitfalls the tests are designed to catch

- **Rejecting `start === end`.** Writing the guard as `start >= end` throws on the second case, which asserts `[2]` for closed and `[]` — not an exception — for the other three.
- **Validating after filtering, or only when `values` is non-empty.** The third case passes an empty `values` array precisely to catch that: `assert.throws` fails if the function returns `[]` instead.
- **Swapping `start` and `end` to "fix" a reversed interval.** The prompt says reject, not repair. A silent swap returns `[]` and fails `assert.throws`.
- **Getting one boundary right and the other wrong.** Left-closed and right-closed are mirror images; the first case distinguishes them as `[1,2]` against `[2,3]`. Copying a sibling and changing only one operator produces the closed or open answer instead.
- **Sorting or de-duplicating the result.** The prompt says "Preserve order/duplicates". `filter` does that; `[...new Set(values)].filter(...)` does not, and a `sort()` on the result would also mutate nothing but still be wrong for unsorted input. No visible test has unsorted values, so this is a prompt requirement rather than an asserted one.
- **Mutating with `splice` instead of filtering.** Removing out-of-range values from `input.values` fails `assert.deepEqual(input, before, 'Input must not mutate')`.
- **Using `Math.min`/`Math.max` clamping instead of a membership test.** Clamping changes values; membership selects them. The return type gives it away: this family returns a subset, not a transformation.

## Checking your work

Run one exercise at a time:

```text
node js-rest/verify.cjs --id=148
```

Three things to check by eye first:

- Is the guard `start > end` and not `start >= end`? The degenerate interval is legal.
- Does the guard sit before the filter, so it fires even on an empty `values`?
- Do the two comparison operators match the variant's name? Write the notation — `[1,3]`, `(1,3)`, `[1,3)`, `(1,3]` — in the margin and check each end separately.

A useful self-test the suite does not include:

```js
solve({start: 1, end: 3, values: [3, 1, 2, 2, 0]});
```

Closed must return `[3, 1, 2, 2]` — original order, both duplicates kept, not sorted. Any solution that sorts or de-duplicates returns `[1, 2, 3]` or `[1, 2, 2, 3]` instead, and no test in the suite has unsorted values to catch it.

## Try it yourself

1. Add a variant that takes an `inclusive: {start: boolean, end: boolean}` flag and covers all four conventions in one function. Is the result easier or harder to read than four two-line files?
2. Write a function that, given two intervals in any of the four conventions, decides whether they overlap. How many boundary cases are there?
3. Extend the input to allow `start` or `end` to be `null`, meaning unbounded on that side. Which comparison disappears?
4. In words: explain why left-closed is the convention used by `slice` and by the run spans in family 08, using two adjacent intervals as your example.
