# Square matrix sums — js-rest 160–163

**What you practise:** validating the shape of a nested array, then selecting cells by an index relation rather than by value.
**Prerequisites:** nested arrays and `input[row][column]` indexing; `Array.prototype.some`; nested `for` loops.
**Exercises:** 160: Square matrix main sum, 161: Square matrix anti sum, 162: Square matrix above sum, 163: Square matrix below sum.

## The problem in plain words

The input is a square matrix: an array of rows, each row an array of finite numbers, with as many columns as there are rows. You must add up the cells in one particular region and return the total.

The four regions are all defined by a relation between the row index and the column index, not by the values in the cells. The main diagonal is `row === column`. The anti-diagonal runs the other way, `row + column === size - 1`. "Above" means strictly above the main diagonal, `column > row`. "Below" means strictly below it, `row > column`.

"Policy" is that relation, and it is one `if` condition.

Two edge rules sit on top. An empty matrix `[]` sums to `0` rather than throwing. And a matrix whose rows are not all the right length is rejected with an error.

Draw the 3×3 test matrix and the geometry becomes obvious:

```text
      col 0   col 1   col 2
row 0   1       2       3
row 1   4       5       6
row 2   7       8       9
```

Main diagonal: 1, 5, 9. Anti-diagonal: 3, 5, 7. Strictly above: 2, 3, 6. Strictly below: 4, 7, 8. The cell `5` sits on both diagonals and on neither of the triangles.

## The contract you must honour

Taken from `tests/160.cjs` through `tests/163.cjs`. These four files have **four** cases each:

- `[[1,2,3],[4,5,6],[7,8,9]]` asserts `15` for main (1+5+9), `15` for anti (3+5+7), `11` for above (2+3+6) and `19` for below (4+7+8). Main and anti coincide numerically on this matrix, which is a property of its symmetry, not a rule.
- `[]` asserts `0` in all four.
- `[[7]]` asserts `7` for main, `7` for anti, `0` for above and `0` for below. A 1×1 matrix has a single cell that sits on both diagonals and in neither triangle, which is what "strictly" buys you.
- `[[1,2]]` asserts `assert.throws(()=>solve(input), e=>e instanceof Error && e.message==="Not square")` in all four. The message is exactly `Not square`.
- The return value is a number.
- Every case ends with `assert.deepEqual(input, before, 'Input must not mutate')` against a `structuredClone`.

## Approach

1. Take the size from the row count: `const size = input.length;`.
2. Validate: `if (input.some(row => row.length !== size)) throw new Error('Not square');`. `some` stops at the first offending row. For `[]` there are no rows to disagree, so `some` returns `false` and the empty matrix passes — no separate empty case is needed.
3. Seed `sum = 0`.
4. Walk every cell with two nested loops over `row` and `column`, and add `input[row][column]` when the region relation holds.
5. Return `sum`.

The double loop is O(size²) even though the diagonals contain only `size` cells. A tighter loop for 160 would be `for (let i = 0; i < size; i++) sum += input[i][i];`. The reference keeps the uniform double-loop shape because it is the one shape that serves all four regions, and the difference between the variants then really is one line. For the two triangles, the double loop is the honest cost anyway.

## Worked example — 160 Square matrix main sum

The first input in `tests/160.cjs`, on line 2, is `[[1,2,3],[4,5,6],[7,8,9]]`.

Validation: `size` is 3, and each row has length 3, so `some` finds nothing and no error is thrown.

The nested loops visit all nine cells; the `row === column` test keeps three of them:

| row | column | `row === column` | cell | `sum` after |
| --- | --- | --- | --- | --- |
| 0 | 0 | yes | 1 | 1 |
| 0 | 1 | no | 2 | 1 |
| 0 | 2 | no | 3 | 1 |
| 1 | 0 | no | 4 | 1 |
| 1 | 1 | yes | 5 | 6 |
| 1 | 2 | no | 6 | 6 |
| 2 | 0 | no | 7 | 6 |
| 2 | 1 | no | 8 | 6 |
| 2 | 2 | yes | 9 | 15 |

Result `15`, asserted as `assert.deepEqual(solve(input),15)`. Swap the condition for `row + column === size - 1` and the kept cells become `(0,2)=3`, `(1,1)=5`, `(2,0)=7` — also 15, by coincidence of this matrix. Swap it for `column > row` and you keep `(0,1)=2`, `(0,2)=3`, `(1,2)=6`, giving 11.

The second case, `[]`, has `size === 0`, passes validation vacuously, and the outer loop never runs, so `0` is returned (line 3).

The third case, `[[7]]`, has `size === 1`. The single cell is `(0,0)`: `0 === 0` is true for main, `0 + 0 === 0` is true for anti, but `0 > 0` is false for both triangles. That is why main and anti assert `7` while above and below assert `0` (line 4).

The fourth case, `[[1,2]]`, has `size === 1` but the one row has length 2, so `some` fires and `Error('Not square')` is thrown (line 5).

The reference solution, as it now reads in `solutions/160.cjs`:

```js
function solve(input) {
  const size = input.length;
  if (input.some(row => row.length !== size)) {
    throw new Error('Not square');
  }
  let sum = 0;
  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      if (row === column) {
        sum += input[row][column];
      }
    }
  }
  return sum;
}
```

## Policy matrix — what changes between the variants

| ID | Variant | What differs in the prompt | What differs in the code |
| --- | --- | --- | --- |
| 160 | main | "Sum main diagonal cells" | `if (row === column)` |
| 161 | anti | "Sum anti-diagonal cells" | `if (row + column === size - 1)` |
| 162 | above | "Sum strictly above main diagonal cells" | `if (column > row)` |
| 163 | below | "Sum strictly below main diagonal cells" | `if (row > column)` |

## Pitfalls the tests are designed to catch

- **Getting the anti-diagonal off by one.** `row + column === size` keeps nothing on a 3×3 matrix and returns `0` instead of `15`. The relation is `size - 1` because indices run from `0` to `size - 1`.
- **Including the diagonal in a triangle.** `column >= row` for 162 adds 1, 5 and 9 to the total, giving `26` instead of `11`, and makes the `[[7]]` case return `7` instead of `0`.
- **Throwing on the empty matrix.** A guard like `if (input.length === 0) throw …` or `if (input[0].length !== size)` — the latter throws `TypeError` reading `length` of `undefined` — fails the second case, which asserts `0`.
- **Deriving the size from the first row.** `const size = input[0].length;` throws on `[]`, and on `[[1,2]]` it makes `size` 2, so the row-length check passes and the malformed matrix is accepted.
- **Checking only that rows agree with each other.** `[[1,2],[3,4],[5,6]]` has three consistent rows of length 2 and is still not square. The comparison must be against `input.length`.
- **Reordering rows or sorting anything.** Any write through `input` fails `assert.deepEqual(input, before, 'Input must not mutate')`.
- **Assuming main and anti are interchangeable because the first case gives 15 for both.** That is an accident of this matrix; `[[1,2],[3,4]]` gives 5 for main and 5 for anti too, but `[[1,2],[3,5]]` gives 6 and 5.

## Try it yourself

1. Add a `trace-ratio` variant returning the main sum divided by the total of all cells. What new edge case appears?
2. Rewrite 160 as a single loop over `i` and measure the difference on a 1000×1000 matrix. Does the same trick work for 162?
3. Allow rectangular matrices and define "main diagonal" for them. What does `size` become, and which of the four regions still make sense?
4. In words: explain why `[]` is accepted but `[[1,2]]` is rejected, in terms of what the `some` check actually asks.
