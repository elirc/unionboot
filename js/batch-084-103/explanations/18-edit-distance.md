# Levenshtein edit distance — js/batch-084-103 101

**What you practise:** a two-dimensional dynamic program compressed into a single rolling row, and the bookkeeping that compression requires.
**Prerequisites:** the idea of a DP table and its recurrence; `Math.min` with three arguments; `Array.from` with a mapping function.
**Exercises:** 101: Levenshtein edit distance.

## The problem in plain words

The edit distance between two strings is the smallest number of single-character insertions, deletions and substitutions that turn one into the other. Each operation costs 1. `kitten` to `sitting` is 3: substitute `k`→`s`, substitute `e`→`i`, insert `g`.

The standard solution builds a table `D` where `D[i][j]` is the distance between the first `i` characters of `a` and the first `j` characters of `b`. The recurrence has three options at each cell:

- delete `a[i-1]`, leaving the problem `D[i-1][j]`, cost + 1;
- insert `b[j-1]`, leaving `D[i][j-1]`, cost + 1;
- match or substitute, leaving `D[i-1][j-1]`, cost + 0 if the two characters are equal and + 1 if not.

Take the smallest of the three. The edges are easy: turning an empty string into `j` characters costs `j` insertions, and turning `i` characters into an empty string costs `i` deletions.

Look at which cells the recurrence reads: the one above, the one to the left, and the one diagonally above-left. Nothing else. So the whole table is unnecessary — one row suffices, as long as the above-left value is saved before it gets overwritten. The header requires this rolling-row form, and the hint names exactly the problem it creates: "Save the old diagonal before overwriting each DP cell."

## The contract you must honour

Taken from `tests/101-edit-distance.cjs`:

- `solve('kitten','sitting')` asserts `3`.
- `solve('','abc')` asserts `3`, and `solve('abc','')` asserts `3`. Either string may be empty.
- `solve('same','same')` asserts `0`.
- `solve('ab','ba')` asserts `2`. A transposition is *not* a single operation here — this is Levenshtein, not Damerau-Levenshtein.
- The header says the inputs are ASCII, so indexing with `a[i-1]` is safe; no code-point handling is required.

## Approach

1. Seed `row` as `[0, 1, 2, …, b.length]`. That is row 0 of the table: the cost of building each prefix of `b` from an empty `a`.
2. For each `i` from 1 to `a.length`:
   - save `row[0]` into `diagonal` — it is the above-left neighbour for the first real cell of this row — then set `row[0] = i`, the cost of deleting `i` characters;
   - for each `j` from 1 to `b.length`:
     - `above` is `row[j]` *before* it is written: the cell from the previous row, so deletion costs `above + 1`;
     - `row[j-1]` has already been written this row: the cell to the left, so insertion costs `row[j-1] + 1`;
     - `diagonal` is the above-left cell: substitution costs `diagonal + 0` when `a[i-1] === b[j-1]`, and `diagonal + 1` otherwise;
     - write the minimum into `row[j]`, then set `diagonal = above` for the next column.
3. Return `row[b.length]`.

Time is O(|a| × |b|); space is O(|b|) rather than O(|a| × |b|).

## Worked example — 101 Levenshtein edit distance

Take the smallest interesting case, `solve('ab','ba')`, asserted on line 5 of the test file.

Row 0 (the seed) is `[0,1,2]`.

Row `i = 1`, matching `a[0] = 'a'`. `diagonal` starts as `row[0]` = `0`; then `row[0] = 1`.

| `j` | `b[j-1]` | `above` (old `row[j]`) | deletion | insertion (`row[j-1]+1`) | substitution | new `row[j]` | `diagonal` for next |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `'b'` | `1` | `2` | `1 + 1 = 2` | `0 + 1 = 1` (`'a' !== 'b'`) | `1` | `1` |
| 2 | `'a'` | `2` | `3` | `1 + 1 = 2` | `1 + 0 = 1` (`'a' === 'a'`) | `1` | `2` |

Row is now `[1,1,1]`.

Row `i = 2`, matching `a[1] = 'b'`. `diagonal` starts as `row[0]` = `1`; then `row[0] = 2`.

| `j` | `b[j-1]` | `above` | deletion | insertion | substitution | new `row[j]` | `diagonal` for next |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `'b'` | `1` | `2` | `2 + 1 = 3` | `1 + 0 = 1` (`'b' === 'b'`) | `1` | `1` |
| 2 | `'a'` | `1` | `2` | `1 + 1 = 2` | `1 + 1 = 2` (`'b' !== 'a'`) | `2` | `1` |

Row is now `[2,1,2]`, and `row[b.length]` is `row[2]` = `2`. That is the asserted answer: two substitutions, since a swap is not a primitive operation here.

The reference solution, as it now reads in `solutions/101-edit-distance.cjs`:

```js
function editDistance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i++) {
    let diagonal = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const above = row[j];
      const deletion = above + 1;
      const insertion = row[j - 1] + 1;
      const substitution = diagonal + (a[i - 1] === b[j - 1] ? 0 : 1);
      row[j] = Math.min(deletion, insertion, substitution);
      diagonal = above;
    }
  }
  return row[b.length];
}
```

## Variations you could build

| Variation | What would change in the code |
| --- | --- |
| Different costs per operation | replace the three `+ 1`s with named cost constants; the structure is unchanged |
| Damerau-Levenshtein, counting a transposition as one edit | a fourth candidate that needs the row from *two* steps back, so one rolling row is no longer enough |
| Longest common subsequence length | take the maximum of the two neighbours, and only extend the diagonal on a match |

## Pitfalls the tests are designed to catch

- **Reading `row[j]` after writing it.** The write destroys the "above" value, which is why `above` is captured first and then reused as the next `diagonal`.
- **Updating `diagonal` before using it.** It must be the value from the *previous* column's `above`, so the assignment goes at the end of the body.
- **Forgetting `row[0] = i`.** The left edge of the table would stay at 0 and every distance would come out too small; `solve('abc','')` would return `0` instead of `3`.
- **Seeding the row with zeros.** `solve('','abc')` would return `0`; the seed must be `0,1,2,…`.
- **Expecting a transposition to cost 1.** `solve('ab','ba')` asserts `2`.
- **Allocating the full `(|a|+1) × (|b|+1)` matrix.** It gives the right answers, but the header requires the rolling row and the reviewer reads the source.

## Try it yourself

1. Add a guard that swaps the arguments so the rolling row is always over the shorter string. Does the answer change? Should it?
2. Return the sequence of operations, not just the count. What does that cost in space, and why?
3. In words: state, for cell `(i, j)`, exactly which three cells the recurrence reads, and explain how each one maps to a variable in the loop above.
