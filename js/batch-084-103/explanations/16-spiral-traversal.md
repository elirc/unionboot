# Walk a matrix clockwise — js/batch-084-103 99

**What you practise:** driving a traversal from four shrinking boundaries, and guarding the degenerate cases where the last two edges would repeat work.
**Prerequisites:** nested loops with explicit bounds; optional chaining `?.` and `??`; why a single row is the hardest case in a spiral, not the easiest.
**Exercises:** 99: Walk a matrix clockwise.

## The problem in plain words

Walking a matrix in a spiral means: across the top row left to right, down the right column, back across the bottom row right to left, up the left column — and then repeat on the smaller rectangle you have left inside.

For a 3×3 matrix that is `1,2,3` then `6,9` then `8,7` then `4`, leaving `5` alone in the middle, which is emitted on the next turn of the loop.

The natural way to write it is four boundaries, `top`, `bottom`, `left`, `right`, fencing the rectangle not yet emitted. Each of the four walks is a simple loop, and each is followed by moving its boundary inwards by one.

The difficulty is entirely in the last two walks. Once `top` has moved past `bottom`, there is no bottom row left to walk — but the loop is already inside its body and would walk one anyway, emitting an already-emitted row a second time. A single-row matrix hits this on the very first turn. The header calls this out: "Handle single rows and columns without duplicates."

## The contract you must honour

Taken from `tests/099-spiral-traversal.cjs`:

- `solve([[1,2,3],[4,5,6],[7,8,9]])` asserts `[1,2,3,6,9,8,7,4,5]` — a flat array of cells, in spiral order, starting at the top left and turning clockwise.
- `solve([[1,2,3]])` asserts `[1,2,3]`. A single row is walked once, not once forwards and once back.
- `solve([[1],[2],[3]])` asserts `[1,2,3]`. A single column likewise.
- `solve([])` asserts `[]`.
- `solve([[]])` asserts `[]`: one row with zero columns yields nothing.
- The matrix is rectangular and must not be mutated.

## Approach

1. Set `top = 0`, `bottom = matrix.length - 1`, `left = 0`, `right = (matrix[0]?.length ?? 0) - 1`. The optional chaining is what lets `right` be computed at all when there are no rows — it becomes `-1`.
2. While `top <= bottom && left <= right`, the rectangle is non-empty:
   - walk the top row from `left` to `right`, then `top++`;
   - walk the right column from `top` to `bottom`, then `right--`;
   - **if `top <= bottom`**, walk the bottom row from `right` down to `left`, then `bottom--`;
   - **if `left <= right`**, walk the left column from `bottom` up to `top`, then `left++`.
3. Return the collected cells.

The two guards are the whole exercise. Each checks whether the rectangle still has a dimension left after the two earlier walks consumed one.

Empty input needs no special case: `bottom` is `-1` for `[]` and `right` is `-1` for `[[]]`, so in both cases the `while` condition is false immediately.

## Worked example — 99 Walk a matrix clockwise

Take the single-row case from line 5 of the test, because that is the one the guards exist for: `matrix = [[1,2,3]]`.

Initial boundaries: `top = 0`, `bottom = 0`, `left = 0`, `right = 2`.

| walk | range | cells emitted | boundary after |
| --- | --- | --- | --- |
| top row | columns 0..2 of row 0 | `1, 2, 3` | `top = 1` |
| right column | rows 1..0 — empty, loop body never runs | none | `right = 1` |
| bottom row, guarded | `top <= bottom` is `1 <= 0` — **false**, skipped | none | `bottom` unchanged at `0` |
| left column, guarded | `left <= right` is `0 <= 1` — true, rows `0` down to `1` — empty | none | `left = 1` |

Back to the loop condition: `top <= bottom` is `1 <= 0`, false. The loop ends with `[1,2,3]`, as asserted.

Without the bottom-row guard, the third walk would have run over columns `1` down to `0` of row `0` and emitted `2, 1` again, giving `[1,2,3,2,1]`.

The 3×3 case from line 4 runs the full cycle: `1,2,3` (top), `6,9` (right), `8,7` (bottom), `4` (left), then a second turn with `top = bottom = left = right = 1` emitting `5` from the top-row walk alone.

The reference solution, as it now reads in `solutions/099-spiral-traversal.cjs`:

```js
function spiral(matrix) {
  const out = [];
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = (matrix[0]?.length ?? 0) - 1;
  while (top <= bottom && left <= right) {
    for (let column = left; column <= right; column++) {
      out.push(matrix[top][column]);
    }
    top++;
    for (let row = top; row <= bottom; row++) {
      out.push(matrix[row][right]);
    }
    right--;
    if (top <= bottom) {
      for (let column = right; column >= left; column--) {
        out.push(matrix[bottom][column]);
      }
      bottom--;
    }
    if (left <= right) {
      for (let row = bottom; row >= top; row--) {
        out.push(matrix[row][left]);
      }
      left++;
    }
  }
  return out;
}
```

## Variations you could build

| Variation | What would change in the code |
| --- | --- |
| Counter-clockwise from the top left | walk down the left column first, then the bottom row, then up the right, then back along the top; the guards move with them |
| Fill a matrix in spiral order rather than read it | the `push` becomes an assignment, and the function needs the dimensions rather than a matrix |
| Return the coordinates instead of the values | `out.push([top, column])` and so on; useful for checking the traversal without the data |

## Pitfalls the tests are designed to catch

- **Dropping either guard.** `[[1,2,3]]` becomes `[1,2,3,2,1]` without the bottom guard; `[[1],[2],[3]]` becomes `[1,2,3,2]` without the left guard.
- **Guarding with `top < bottom` instead of `top <= bottom`.** That skips a legitimate final row and loses cells from the 3×3 case.
- **Reading `matrix[0].length` without the optional chaining.** `solve([])` then throws instead of returning `[]`.
- **Treating `[[]]` as a one-cell matrix.** `matrix.length` is `1` but the row is empty, so `right` is `-1` and the loop must not run.
- **Shrinking a boundary before its walk instead of after.** The first cell of each edge would be skipped.
- **Collecting into a `Set` to avoid duplicates.** It hides the bug instead of fixing it, and would also collapse legitimately repeated values.

## Try it yourself

1. Add a `startCorner` parameter accepting `'topLeft'` or `'bottomRight'`. How many of the four walks change?
2. Instrument the loop to print the four boundaries at the top of each turn, then run the 3×3 case and check the printout against the trace above.
3. In words: explain why the first two walks need no guard while the last two do, in terms of which boundary each walk has already consumed.
