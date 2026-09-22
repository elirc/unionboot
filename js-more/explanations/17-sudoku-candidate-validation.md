# Sudoku candidate validation — js-more 1879–1888

**What you practise:** validating a grid by collecting its constraint groups, then listing the legal digits for one blank cell.
**Prerequisites:** nested arrays and `board.map(line => line[i])` to read a column; `Set` for membership; integer division with `Math.floor` to find a box; truthiness of `0`.
**Exercises:** 1879: box=1; diagonal=false, 1880: box=1; diagonal=true, 1881: box=2; diagonal=false, 1882: box=2; diagonal=true, 1883: box=3; diagonal=false, 1884: box=3; diagonal=true, 1885: box=4; diagonal=false, 1886: box=4; diagonal=true, 1887: box=5; diagonal=false, 1888: box=5; diagonal=true.

## The problem in plain words

The input is `{board, row, col}`. The board is an n × n grid of integers, where n is `box * box` and `box` is the policy. `0` means blank; any other value is a placed digit between 1 and n. The classic puzzle is `box = 3`, so n = 9; this family also runs the degenerate `box = 1` (a 1 × 1 board whose only digit is 1) and the large `box = 5` (a 25 × 25 board).

Two questions are answered in one call. First: is the board legal at all — does any row, column or box repeat a digit? Second, if it is legal: which digits could legally go into the cell at `(row, col)`?

The order matters and the prompt states it: "Coordinates checked on valid board only." A board with a conflict returns `{valid:false, candidates:[]}` and the coordinates are never examined, even if they are nonsense. A misshapen board or an out-of-range cell value, on the other hand, is thrown out before anything else.

"Policy" is two knobs. `box` sets the size and the box geometry. `diagonal` turns the puzzle into the "X-Sudoku" variant, where the two main diagonals are constraint groups as well.

## The contract you must honour

Taken from `tests/1879.cjs` and its siblings, which are written once against `n = cfg.box * cfg.box`:

- Return shape is always `{valid, candidates}`: a boolean and an array, never `null` and never a bare array.
- An empty board on a board of size n is fully open: `check({board, row:0, col:0}, {valid:true, candidates: Array.from({length:n},(_,i)=>i+1)})` — the candidates are ascending, starting at 1.
- An occupied cell yields no candidates: after `board[0][0] = 1`, `check({board, row:0, col:0}, {valid:true, candidates:[]})`.
- With n > 1, a neighbouring blank loses the digit already in its row: `check({board, row:0, col:1}, {valid:true, candidates: Array.from({length:n-1},(_,i)=>i+2)})`.
- A repeated digit anywhere makes the whole board invalid: `dup[0][0]=1; dup[0][1]=1; check({board:dup, row:0, col:0}, {valid:false, candidates:[]})`.
- The diagonal policy is asserted directly. With `diagonal[0][0] = 1` and the query cell at `(cfg.box, cfg.box)` — which is on the main diagonal for n > 1 — the expected candidates are `Array.from({length:n},(_,i)=>i+1).filter(x => !cfg.diagonal || x !== 1)`: digit 1 survives when `diagonal` is false and is removed when it is true.
- A wrong shape throws: `assert.throws(()=>solve({board:[],row:0,col:0}), /Invalid board/)`. The reference throws `new RangeError('Invalid board')`; a cell outside `0..n` throws `new RangeError('Invalid cell')` and a bad coordinate `new RangeError('Invalid coordinate')`. Only `Invalid board` is asserted by these tests.
- `check` clones with `structuredClone` and ends with `deep(input, before, 'Input must not mutate')`. Reading the board is fine; writing a trial digit into it and undoing it is not.

## Approach

1. Compute `n = cfg.box * cfg.box` and validate the shape: `board.length === n` and every row `line.length === n`, otherwise `RangeError('Invalid board')`.
2. Validate every cell: an integer in `0..n`, otherwise `RangeError('Invalid cell')`.
3. Collect the constraint groups into one array, so that "is this board legal" becomes one uniform check:
   - each row, `board[i]`;
   - each column, `board.map(line => line[i])`;
   - each box, walked with two `cfg.box`-sized loops from every `(top, leftEdge)` that is a multiple of `cfg.box`;
   - under `diagonal`, `board.map((line,i)=>line[i])` and `board.map((line,i)=>line[n-i-1])`.
4. A group repeats if, after dropping the blanks, its `Set` is smaller than the array: `group.filter(Boolean)` removes exactly the zeros, because `0` is the only falsy value a valid cell can hold. If any group repeats, return `{valid:false, candidates:[]}`.
5. Only now validate `row` and `col`. An occupied cell returns `{valid:true, candidates:[]}`.
6. Build the `used` set: the cell's whole row, its whole column, its box, and — under `diagonal`, and only when the cell is actually on a diagonal — that diagonal. The set will contain `0` as well, which is harmless because `0` is never a candidate.
7. Return the ascending digits `1..n` that are not in `used`.

Cost: O(n²) to collect and check the groups, which is the size of the input, so nothing cheaper is available for the validity half.

## Worked example — 1879 Sudoku candidate validation / scenario 1 — box=1; diagonal=false

Scenario 1 is the smallest board this family builds: `cfg.box` is 1, so `n = 1`, the board is 1 × 1 and the only digit is 1. `tests/1879.cjs` starts with

```js
const n = cfg.box * cfg.box;
const empty = () => Array.from({length: n}, () => Array(n).fill(0));
const board = empty();
check({board, row:0, col:0}, {valid:true, candidates: Array.from({length:n},(_,i)=>i+1)});
```

so the first input is `{board: [[0]], row: 0, col: 0}` and the expected output is `{valid:true, candidates:[1]}`.

| Step | Check | State |
| --- | --- | --- |
| 1 | `board.length === 1` and row length 1 | shape ok |
| 2 | the single cell `0` is an integer in `0..1` | cells ok |
| 3 | groups: row 0 → `[0]`, column 0 → `[0]`; boxes: `top=0, leftEdge=0` → `[0]`; `diagonal` is false, so no diagonal groups | `groups = [[0],[0],[0]]` |
| 4 | each group: `[0].filter(Boolean)` is `[]`, `new Set([]).size === 0 === [].length` | no repeats |
| 5 | `row = 0`, `col = 0`, both integers in `0..0` | coordinates ok |
| 6 | `board[0][0]` is `0`, falsy, so the cell is blank | continue |
| 7 | `used` = row `[0]` ∪ column `[0]` ∪ box `[0]` | `used = {0}` |
| 8 | digits `[1]` filtered by `!used.has(digit)` | `[1]` |

Output `{valid:true, candidates:[1]}`, asserted by that first `check`.

The test then writes `board[0][0] = 1` into its own array and calls `check({board, row:0, col:0}, {valid:true, candidates:[]})`. Step 4 now sees `[1].filter(Boolean) === [1]`, a `Set` of size 1 — still no repeat — and step 6 finds `board[0][0]` truthy, so the function returns `{valid:true, candidates:[]}` without ever building `used`.

The block guarded by `if (n > 1)` is skipped for 1879 and 1880. For 1881 (`box=2`, n=4) it runs: with `board[0][0] = 1`, the cell `(0,1)` is in the same row, so `used` contains 1 and the candidates are `[2,3,4]` — the `Array.from({length:n-1},(_,i)=>i+2)` the test builds.

The final assertion is shape validation: `assert.throws(()=>solve({board:[],row:0,col:0}), /Invalid board/)`. An empty array has length 0, not `n`, so step 1 throws.

The reference solution, as it now reads in `solutions/1879.cjs`:

```js
function sudoku(input) {
  const n = cfg.box * cfg.box;
  const board = input.board;
  if (board.length !== n || board.some(line => line.length !== n)) {
    throw new RangeError('Invalid board');
  }
  for (const line of board) {
    for (const cell of line) {
      if (!Number.isInteger(cell) || cell < 0 || cell > n) {
        throw new RangeError('Invalid cell');
      }
    }
  }

  const groups = [];
  for (let i = 0; i < n; i++) {
    groups.push(board[i]);
    groups.push(board.map(line => line[i]));
  }
  for (let top = 0; top < n; top += cfg.box) {
    for (let leftEdge = 0; leftEdge < n; leftEdge += cfg.box) {
      const box = [];
      for (let i = 0; i < cfg.box; i++) {
        for (let j = 0; j < cfg.box; j++) {
          box.push(board[top + i][leftEdge + j]);
        }
      }
      groups.push(box);
    }
  }
  if (cfg.diagonal) {
    groups.push(board.map((line, i) => line[i]));
    groups.push(board.map((line, i) => line[n - i - 1]));
  }
  const repeats = group => {
    const filled = group.filter(Boolean);
    return new Set(filled).size !== filled.length;
  };
  if (groups.some(repeats)) {
    return { valid: false, candidates: [] };
  }

  const { row, col } = input;
  if (!Number.isInteger(row) || !Number.isInteger(col) || row < 0 || col < 0 || row >= n || col >= n) {
    throw new RangeError('Invalid coordinate');
  }
  if (board[row][col]) {
    return { valid: true, candidates: [] };
  }

  const used = new Set([...board[row], ...board.map(line => line[col])]);
  const boxRow = Math.floor(row / cfg.box) * cfg.box;
  const boxCol = Math.floor(col / cfg.box) * cfg.box;
  for (let i = 0; i < cfg.box; i++) {
    for (let j = 0; j < cfg.box; j++) {
      used.add(board[boxRow + i][boxCol + j]);
    }
  }
  if (cfg.diagonal && row === col) {
    board.forEach((line, i) => used.add(line[i]));
  }
  if (cfg.diagonal && row + col === n - 1) {
    board.forEach((line, i) => used.add(line[n - i - 1]));
  }
  return { valid: true, candidates: Array.from({ length: n }, (_, i) => i + 1).filter(digit => !used.has(digit)) };
}
```

## Policy matrix — what changes between the variants

Only `cfg` changes; the code above is shared by all ten.

| ID | Variant | Semantic key | What differs in the code |
| --- | --- | --- | --- |
| 1879 | box=1; diagonal=false | `{"box":1,"diagonal":false}` | `n = 1`; one 1×1 box; the `if (cfg.diagonal)` block is skipped |
| 1880 | box=1; diagonal=true | `{"box":1,"diagonal":true}` | `n = 1`; both diagonal groups are pushed and are the same single cell |
| 1881 | box=2; diagonal=false | `{"box":2,"diagonal":false}` | `n = 4`; four 2×2 boxes; no diagonal groups |
| 1882 | box=2; diagonal=true | `{"box":2,"diagonal":true}` | `n = 4` plus the two diagonals, and `used` grows when `row===col` or `row+col===3` |
| 1883 | box=3; diagonal=false | `{"box":3,"diagonal":false}` | `n = 9`, the classic grid |
| 1884 | box=3; diagonal=true | `{"box":3,"diagonal":true}` | `n = 9` X-Sudoku |
| 1885 | box=4; diagonal=false | `{"box":4,"diagonal":false}` | `n = 16`; digits run to 16 |
| 1886 | box=4; diagonal=true | `{"box":4,"diagonal":true}` | `n = 16` plus diagonals |
| 1887 | box=5; diagonal=false | `{"box":5,"diagonal":false}` | `n = 25`; 625 cells, 75 groups |
| 1888 | box=5; diagonal=true | `{"box":5,"diagonal":true}` | `n = 25` plus diagonals |

The two axes are independent: five sizes × two diagonal settings.

## Pitfalls the tests are designed to catch

- **Counting blanks as duplicates.** An empty 9 × 9 board has nine zeros in every row. `group.filter(Boolean)` drops them; `new Set(group).size !== group.length` without the filter reports every empty board as invalid, and the very first `check` catches it.
- **Hard-coding 9 or 3.** Everything is derived from `cfg.box`. The `box=1` and `box=5` variants exist to break a hard-coded grid.
- **Checking coordinates before the board.** The prompt says coordinates are checked on a valid board only, so a conflicting board must return `{valid:false,candidates:[]}` rather than throw on a bad coordinate.
- **Adding a diagonal to `used` for a cell that is not on it.** `row === col` and `row + col === n - 1` are separate conditions, and a centre cell can satisfy both. Guarding with `cfg.diagonal &&` alone would remove digits the test expects to survive — the diagonal case asserts the candidate list exactly.
- **Writing into the board to test a digit.** `check` deep-compares `input` against a `structuredClone` taken before the call, with the message `'Input must not mutate'`. Build a `Set` instead.
- **Forgetting that `0` lands in `used`.** It does, via the row and column spread, and it is harmless because candidates start at 1. Filtering it out is unnecessary; relying on its absence is a bug.
- **Using an object instead of a `Set` for `used`.** Keys would be coerced to strings, so `used.has(digit)` with a number would never match.
- **Treating `candidates` as unordered.** `assert.deepEqual` on arrays is order-sensitive; the digits must be ascending, which `Array.from({length:n},(_,i)=>i+1).filter(...)` gives for free.

## Checking your work

```text
node js-more/verify.cjs --id=1879
node js-more/verify.cjs --starters --id=1879
```

If you are working on a larger `box`, sketch the box boundaries first: `Math.floor(row / cfg.box) * cfg.box` is the top edge of the cell's box, and getting that expression wrong is the most common way to pass `box=1` and fail `box=3`.

## Try it yourself

1. The validity phase builds every group as an array. Rewrite it so the row/column/box scan is a single pass that fails fast on the first repeat. Does it change the complexity?
2. Add a policy `anti-knight`, where two cells a knight's move apart may not hold the same digit. Which of the two phases does it belong in — or both?
3. Return the candidates as a bitmask number instead of an array. What would the `box=5` variant need to be careful about?
4. In words: for `box=1` the board has exactly one cell and one legal digit. Say what each of the three groups (row, column, box) contributes, and why they are all the same group.
