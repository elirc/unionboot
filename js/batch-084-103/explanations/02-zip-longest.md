# Zip uneven arrays — js/batch-084-103 85

**What you practise:** pairing two arrays of different lengths, and telling a *missing* slot apart from a slot that genuinely holds `undefined`.
**Prerequisites:** `Array.from` with a length object and a mapping function; default parameter values; why `??` is not a presence test.
**Exercises:** 85: Zip uneven arrays.

## The problem in plain words

Zipping two arrays means walking them in step and emitting a pair per position: `[1,2]` and `['a','b']` become `[[1,'a'],[2,'b']]`. The question this exercise asks is what happens when the two arrays are not the same length.

The answer here is "zip longest": the result runs to the length of the longer array, and any position the shorter array does not reach is filled with a `fill` value, which defaults to `null`.

That forces a precise definition of "does not reach". The naive test is to look at the value and see whether it is empty, but `undefined` is a legitimate value an array can hold. The header says so directly: "Preserve actual undefined entries." So the test has to be about the index, not the value: a position is missing when the index is at or past that array's `length`.

## The contract you must honour

Taken from `tests/085-zip-longest.cjs`:

- The result is an array of two-element arrays, one per index of the longer input.
- `solve([1,2],['a'])` asserts `[[1,'a'],[2,null]]`, so the default fill is `null`.
- `solve([],[],0)` asserts `[]`. Two empty arrays produce no pairs, and the fill value is never consulted.
- `solve([undefined],[2,3],'?')` asserts `[[undefined,2],['?',3]]`. Index 0 of the first array exists and holds `undefined`, so `undefined` is kept; index 1 is past its end, so it becomes `'?'`.
- `solve([],['x'],false)` asserts `[[false,'x']]`, so a falsy fill value such as `false` must survive.
- Neither input may be mutated. Nothing in this solution writes to either array.

## Approach

1. Compute `length` as `Math.max(a.length, b.length)`.
2. Build an array of that length. `Array.from({ length }, (_, index) => …)` does it in one pass and calls the mapper with each index.
3. For each index, pick from `a` when `index < a.length`, otherwise use `fill`. Do the same for `b`.
4. Return the array of pairs.

O(n) in the length of the longer input, and no intermediate arrays.

## Worked example — 85 Zip uneven arrays

Input, from the third assertion: `a = [undefined]`, `b = [2,3]`, `fill = '?'`.

`Math.max(1, 2)` is `2`, so two pairs are built.

| index | `index < a.length`? | left element | `index < b.length`? | right element | pair |
| --- | --- | --- | --- | --- | --- |
| 0 | `0 < 1` — yes | `a[0]`, which is `undefined` | `0 < 2` — yes | `2` | `[undefined, 2]` |
| 1 | `1 < 1` — no | `fill`, which is `'?'` | `1 < 2` — yes | `3` | `['?', 3]` |

Expected output `[[undefined,2],['?',3]]`, asserted on line 6 of the test file.

The reference solution, as it now reads in `solutions/085-zip-longest.cjs`:

```js
function zipLongest(a, b, fill = null) {
  const length = Math.max(a.length, b.length);
  return Array.from({ length }, (_, index) => [
    index < a.length ? a[index] : fill,
    index < b.length ? b[index] : fill,
  ]);
}
```

## Variations you could build

| Variation | What would change in the code |
| --- | --- |
| `zipShortest`, stopping at the shorter array | `Math.max` becomes `Math.min`; both bound checks become unnecessary |
| Separate fills per side, `fillA` and `fillB` | one extra parameter; each branch uses its own fill |
| Zip any number of arrays, `zipLongest(...arrays)` | the length is `Math.max(...arrays.map(a => a.length))` and each pair becomes `arrays.map(…)` |

## Pitfalls the tests are designed to catch

- **Using `a[index] ?? fill`.** That replaces a stored `undefined` as well as a missing index, so the third assertion comes back as `[['?',2],['?',3]]` and fails.
- **Using `a[index] || fill`.** Worse: it also replaces `0`, `''` and `false`.
- **Using the fill's truthiness anywhere.** The fourth assertion passes `false` as the fill and expects it in the output, so a check like `if (fill)` would drop it.
- **Iterating with `forEach` or `map` over the longer array.** Those skip holes, and more to the point they tie the traversal to one of the two inputs rather than to the index range.
- **Assuming the default fill is `undefined`.** It is `null`, and the first assertion checks it.

## Try it yourself

1. Add a fourth parameter `strict` that throws a `RangeError` when the two lengths differ instead of filling. Which line becomes a guard?
2. Write `unzip`, turning `[[1,'a'],[2,null]]` back into `[[1,2],['a',null]]`. Can you do it without knowing the pair length in advance?
3. In words: explain why `Array.from({length: n}, fn)` and `new Array(n).map(fn)` behave differently, and which of the two would silently break this exercise.
