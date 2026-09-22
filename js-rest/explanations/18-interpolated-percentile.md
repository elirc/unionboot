# Interpolated percentile — js-rest 172–175

**What you practise:** computing a percentile with linear interpolation, sorting a copy rather than the input, and why the numeric comparator is mandatory.
**Prerequisites:** `Array.prototype.sort` and its default string ordering; `Math.floor`/`Math.ceil`; linear interpolation between two values.
**Exercises:** 172: Interpolated percentile 0, 173: Interpolated percentile 25, 174: Interpolated percentile 75, 175: Interpolated percentile 100.

## The problem in plain words

The input is an array of finite numbers, in no particular order. A percentile answers "what value sits at this point in the distribution?" — the 25th percentile is the value a quarter of the way up the sorted data.

The awkward part is that a quarter of the way up usually is not a whole position. With four sorted values, the positions are 0, 1, 2 and 3, and the 25th percentile sits at position `(4 - 1) * 25 / 100 = 0.75` — three quarters of the way from the first value to the second. Linear interpolation blends the two neighbours in that proportion.

"Policy" is the percentile requested, `p`. Everything else — the empty guard, the sorted copy, the position formula, the blend — is shared, and only the number changes.

The formula the prompt specifies is `(length - 1) * p / 100`. Using `length - 1` means percentile 0 lands exactly on the first element and percentile 100 exactly on the last, which is why those two variants never interpolate at all.

## The contract you must honour

Taken from `tests/172.cjs` through `tests/175.cjs`:

- `[]` asserts `null` in all four. There is no percentile of no data.
- `[30,0,20,10]` asserts `0` for p=0, `7.5` for p=25, `22.5` for p=75 and `30` for p=100. The input is deliberately unsorted, so a solution that skips the sort gets the wrong answer.
- `[4]` asserts `4` in all four. With one element, `length - 1` is `0`, so every percentile lands on position 0.
- The return value is a number, or `null` for the empty case. `7.5` and `22.5` are not integers, so rounding the result fails.
- Every case ends with `assert.deepEqual(input, before, 'Input must not mutate')` against a `structuredClone`. The prompt says it twice: "Sort a copy" and "Do not mutate input".

Work `[30,0,20,10]` at p=25 by hand: sorted it is `[0,10,20,30]`; the position is `(4-1) * 25/100 = 0.75`; the neighbours are `sorted[0] = 0` and `sorted[1] = 10`; the blend is `0 + (10 - 0) * 0.75 = 7.5`. That is the asserted value.

## Approach

1. Guard the empty array and return `null` before sorting.
2. Copy and sort: `const sorted = [...input].sort((a, b) => a - b);`. The spread makes a new array so `sort`, which reorders in place, cannot touch the caller's data. The comparator is required — see below.
3. Compute `position = (sorted.length - 1) * percentile / 100`.
4. Take the two neighbouring indices, `lowerIndex = Math.floor(position)` and `upperIndex = Math.ceil(position)`. When `position` is a whole number these are the same index, and the blend collapses to that single value.
5. Blend: `sorted[lowerIndex] + (sorted[upperIndex] - sorted[lowerIndex]) * (position - lowerIndex)`. The fraction `position - lowerIndex` is how far along the gap the percentile sits.
6. Return the blend.

Cost: O(n log n), dominated by the sort.

On the comparator. `[10, 9, 100].sort()` returns `[10, 100, 9]`, because with no comparator `sort` converts every element to a string and orders them lexically — `"10"` before `"100"` before `"9"`. The test data here is `[30,0,20,10]`, which sorts to `[0,10,20,30]` as strings too, so the visible tests do **not** catch a missing comparator. It is a prompt-level requirement and the reviewer reads the file.

## Worked example — 173 Interpolated percentile 25

This family's second variant is the one that actually exercises the interpolation, so it makes the better trace. The first input in `tests/173.cjs` is `[]`: the guard returns `null` (line 2).

The second case, on line 3, is `[30,0,20,10]`:

| Step | Value |
| --- | --- |
| copy | `[30,0,20,10]` — a new array |
| sort ascending | `[0,10,20,30]` |
| `sorted.length - 1` | `3` |
| `position = 3 * 25 / 100` | `0.75` |
| `lowerIndex = Math.floor(0.75)` | `0` |
| `upperIndex = Math.ceil(0.75)` | `1` |
| `fraction = 0.75 - 0` | `0.75` |
| `sorted[0]` | `0` |
| `sorted[1]` | `10` |
| blend `0 + (10 - 0) * 0.75` | `7.5` |

Asserted as `assert.deepEqual(solve(input),7.5)`. The same trace for the other three: p=0 gives `position = 0`, so both indices are 0 and the answer is `sorted[0] = 0`; p=75 gives `position = 2.25`, blending `sorted[2] = 20` and `sorted[3] = 30` at a quarter of the way, `20 + 10 * 0.25 = 22.5`; p=100 gives `position = 3`, both indices 3, answer `30`.

The third case, `[4]`, has `length - 1 === 0`, so `position` is `0` for every percentile, both indices are 0, the fraction is 0, and the blend is `4 + (4 - 4) * 0 = 4` (line 4).

The reference solution, as it now reads in `solutions/173.cjs`:

```js
function solve(input) {
  if (input.length === 0) {
    return null;
  }
  const percentile = 25;
  const sorted = [...input].sort((a, b) => a - b);
  const position = (sorted.length - 1) * percentile / 100;
  const lowerIndex = Math.floor(position);
  const upperIndex = Math.ceil(position);
  const fraction = position - lowerIndex;
  return sorted[lowerIndex] + (sorted[upperIndex] - sorted[lowerIndex]) * fraction;
}
```

## Policy matrix — what changes between the variants

| ID | Variant | What differs in the prompt | What differs in the code |
| --- | --- | --- | --- |
| 172 | 0 | "Return percentile 0" | `const percentile = 0`; position is always 0, so it is the minimum |
| 173 | 25 | "Return percentile 25" | `const percentile = 25` |
| 174 | 75 | "Return percentile 75" | `const percentile = 75` |
| 175 | 100 | "Return percentile 100" | `const percentile = 100`; position is always `length - 1`, so it is the maximum |

## Pitfalls the tests are designed to catch

- **Sorting the input in place.** `input.sort(...)` fails `assert.deepEqual(input, before, 'Input must not mutate')` on the second case, whose input is unsorted. This is the single most likely failure in this family.
- **Not sorting at all.** With `[30,0,20,10]` unsorted, p=25 reads positions 0 and 1 as `30` and `0` and returns `7.5`… with the sign of the gap reversed, `30 + (0-30)*0.75 = 7.5`. Coincidentally the same number — but p=75 gives `20 + (10-20)*0.25 = 17.5` against the asserted `22.5`, so the case does catch it.
- **Omitting the numeric comparator.** The visible data happens to sort the same way as strings, so the tests stay green. The prompt requires a proper sort and the reviewer reads the file.
- **Using `length` instead of `length - 1`.** The position for p=100 becomes `4`, `sorted[4]` is `undefined`, and the arithmetic yields `NaN`.
- **Rounding the result.** `Math.round` turns `7.5` into `8` and `22.5` into `23` (`Math.round` rounds halves up), failing both interpolating variants.
- **Returning `0` for the empty array.** All four assert `null`; `0` would be indistinguishable from a real percentile of a dataset containing zero — the second case of 172 asserts exactly `0`.
- **Indexing with a fractional position.** `sorted[0.75]` is `undefined`, since array indices are integer-like strings. The floor and ceil are what make the lookup legal.

## Checking your work

Run one exercise at a time:

```text
node js-rest/verify.cjs --id=173
```

Three things to check by eye first:

- Is the sort applied to `[...input]` and not to `input`? This family is the one most likely to fail the mutation assertion.
- Is the comparator `(a, b) => a - b`? The test data sorts identically as strings, so the suite will not tell you.
- Is the position formula `(length - 1) * p / 100`, with the minus one?

A useful self-test the suite does not include:

```js
solve([9, 10, 100]);
```

Sorted numerically that is `[9, 10, 100]`, so p=0 gives `9`, p=25 gives `9.5`, p=75 gives `55`, p=100 gives `100`. With the default string sort the array becomes `[10, 100, 9]` and every answer is wrong. Afterwards, check that the array you passed in is still `[9, 10, 100]`.

## Try it yourself

1. Add a `median` variant. Which percentile is it, and what does the formula give for an even-length array?
2. Implement the "nearest rank" convention instead — round the position up and take that element, with no interpolation. Which of the four asserted values change?
3. Compute all four percentiles in one call without sorting four times. What does the function return?
4. In words: explain why `(length - 1) * p / 100` is used rather than `length * p / 100`, referring to what each gives for p=100 on a four-element array.
