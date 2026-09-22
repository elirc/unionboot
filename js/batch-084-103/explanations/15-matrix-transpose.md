# Transpose a rectangular matrix — js/batch-084-103 98

**What you practise:** building a fresh nested array by index arithmetic, and distinguishing a deep copy from a shallow one.
**Prerequisites:** arrays of arrays; `Array.from` with a length object; `Array.prototype.some` and `map`; reference identity versus structural equality.
**Exercises:** 98: Transpose a rectangular matrix.

## The problem in plain words

A matrix here is an array of rows, each row an array of cells. Transposing swaps the two axes: cell `(r, c)` of the input becomes cell `(c, r)` of the output. A 2×3 matrix transposes into a 3×2 one.

Reading that backwards gives the construction directly. Row `c` of the result is column `c` of the input — that is, the `c`-th cell of every input row, in row order. So the output has one row per input column, which is the hint in the header.

Two shape questions have to be answered before the loop can run. A matrix with no rows has no columns to count, so it transposes to `[]`. And a *ragged* matrix — rows of differing lengths — has no transpose at all, so it is an error.

Finally, "fresh" in the header means the arrays are new. It does not mean the cells are copied: the cells are carried across by reference, and the test proves it by asserting object identity.

## The contract you must honour

Taken from `tests/098-matrix-transpose.cjs`:

- `solve([[1,2,3],[4,5,6]])` asserts `[[1,4],[2,5],[3,6]]`.
- `solve([])` asserts `[]`.
- `solve([[],[]])` asserts `[]`. Two rows of zero columns transpose to zero rows, not to two empty rows.
- `solve([[1],[2,3]])` asserts a `RangeError` for the ragged input.
- With `const item = {}`, `solve([[item]])[0][0]` asserts *equal to* `item` via `assert.equal`, which is `===` for objects. So the cell must be the same object, not a clone.
- The input rows must not be mutated. The reference only reads them.

## Approach

1. Return `[]` immediately when `matrix.length === 0`; there is no first row to measure.
2. Take `width` from `matrix[0].length`.
3. Reject a ragged matrix: if any row's length differs from `width`, `throw new RangeError('Ragged matrix')`.
4. Build `width` output rows with `Array.from`. Output row `column` is `matrix.map(row => row[column])`.
5. Return the result.

Step 4 covers the all-empty-rows case with no extra code: `width` is `0`, and `Array.from({length: 0}, …)` is `[]`.

Cost is O(rows × columns), which is the size of the output — you cannot do better, since every cell must be placed.

## Worked example — 98 Transpose a rectangular matrix

Input, from the first assertion: `[[1,2,3],[4,5,6]]`.

`matrix.length` is `2`, so the early return is skipped. `width` is `matrix[0].length`, which is `3`. Both rows have length 3, so `some` finds no mismatch and nothing throws.

| output row index (`column`) | `matrix.map(row => row[column])` | result row |
| --- | --- | --- |
| 0 | `[[1,2,3][0], [4,5,6][0]]` | `[1,4]` |
| 1 | `[[1,2,3][1], [4,5,6][1]]` | `[2,5]` |
| 2 | `[[1,2,3][2], [4,5,6][2]]` | `[3,6]` |

Result `[[1,4],[2,5],[3,6]]`, asserted on line 4 of the test file.

The identity case on line 7 is worth tracing too. `solve([[item]])` has `width = 1`, so one output row is built as `[[item]].map(row => row[0])`, which is `[item]` — the same object reference, never copied. `assert.equal(solve([[item]])[0][0], item)` therefore passes.

The reference solution, as it now reads in `solutions/098-matrix-transpose.cjs`:

```js
function transpose(matrix) {
  if (matrix.length === 0) {
    return [];
  }
  const width = matrix[0].length;
  if (matrix.some((row) => row.length !== width)) {
    throw new RangeError('Ragged matrix');
  }
  return Array.from({ length: width }, (_, column) => matrix.map((row) => row[column]));
}
```

## Variations you could build

| Variation | What would change in the code |
| --- | --- |
| Rotate 90° clockwise instead of transposing | the same construction, with the rows read in reverse order inside the `map` |
| Pad a ragged matrix with a fill value instead of throwing | `width` becomes the maximum row length, and the cell read becomes a bounds check like exercise 85's |
| Transpose in place for a square matrix | swap `matrix[r][c]` with `matrix[c][r]` for `c > r`; O(1) extra space, but it mutates, which this exercise forbids |

## Pitfalls the tests are designed to catch

- **Deep-copying the cells.** `assert.equal` on the object cell compares with `===`, so a cloned cell fails even though it looks the same.
- **Returning `[[],[]]` for `[[],[]]`.** The third assertion expects `[]`: the output row count is the input *column* count, which is zero here.
- **Reading `matrix[0].length` before the empty check.** On `[]` that throws a `TypeError` about reading a property of `undefined`, not the intended `[]`.
- **Taking `width` as the maximum or the minimum row length.** Either silently accepts a ragged matrix and the fourth assertion stops throwing.
- **Checking raggedness with a `for` loop that starts at index 1 but compares against `matrix[0].length` recomputed each time.** Harmless here, but the `some` form states the intent in one line.
- **Mutating `matrix` to build the result.** Nothing in this test freezes the input, but the header forbids it and the reviewer reads the source.

## Try it yourself

1. Make the function accept and return a flat array with an explicit `width`, avoiding nested arrays entirely. What does the index arithmetic become?
2. Transpose twice and compare with the original using `deepEqual`. Should it be `===` equal as well? Explain your answer in terms of which arrays are fresh.
3. In words: this function produces a shallow copy. Describe a way a caller could use the result that would let them observe a change to the original, and one that would not.
