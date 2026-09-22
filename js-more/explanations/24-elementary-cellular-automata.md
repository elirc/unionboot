# Elementary cellular automata — js-more 1949–1958

**What you practise:** a synchronous grid update driven by a bit-packed rule number, and an explicit boundary policy.
**Prerequisites:** binary numbers and the shift operator `>>`; `Array.prototype.map`; the difference between reading the old state and the new state during an update; modular arithmetic for wrap-around.
**Exercises:** 1949: rule=30; wrap=false, 1950: rule=30; wrap=true, 1951: rule=54; wrap=false, 1952: rule=54; wrap=true, 1953: rule=90; wrap=false, 1954: rule=90; wrap=true, 1955: rule=110; wrap=false, 1956: rule=110; wrap=true, 1957: rule=184; wrap=false, 1958: rule=184; wrap=true.

## The problem in plain words

An elementary cellular automaton is a row of cells, each 0 or 1, that steps forward in time. A cell's next value depends only on three cells in the current row: itself and its two neighbours. Three cells, each 0 or 1, gives eight possible neighbourhoods, and a *rule* is just a choice of output for each of those eight — eight bits, so a number from 0 to 255.

The numbering is Wolfram's and the prompt states it: "neighborhood code=left\*4+self\*2+right, next=(rule>>code)&1". Read the three cells as a binary number 0–7, then take that bit out of the rule number. Rule 30 is `00011110` in binary, so neighbourhoods 1, 2, 3 and 4 produce a 1 and the rest produce a 0.

The input is `{cells, steps}` and the output is the *history*: the starting row, then one row per step, so `steps + 1` rows in all.

"Policy" is two knobs. `rule` picks one of five well-known rules. `wrap` decides what lies beyond the ends of the row: nothing (read as 0), or the other end of the row (the row becomes a circle).

## The contract you must honour

Taken from `tests/1949.cjs` and its siblings, which check every combination of six starting rows and three step counts against an independent oracle:

```js
for (const cells of [[], [0], [1], [1,0,1], [0,0,1,0,0], [1,1,0,0,1,0,1]])
  for (const steps of [0, 1, 4])
    check({cells, steps}, oracle(cells, steps));
```

- The result includes the initial row: `steps: 0` returns one row, `steps: 4` returns five.
- Each row is a new array. The first row must be a copy of `input.cells`, not the same array — `check` deep-compares the input afterwards, so any later step that wrote through it would be caught.
- An empty starting row is legal and produces `steps + 1` empty rows. The prompt says so: "Empty cells produces steps+1 empty rows".
- Cells are the numbers `0` and `1`, not booleans. The oracle computes `Math.floor(cfg.rule / (2 ** bit)) % 2`, which yields a number.
- `assert.throws(()=>solve({cells:[], steps:-1}), /Steps/)` — a negative or non-integer `steps` is `RangeError('Steps')`. Note the cells are empty in that case, so the check cannot be hidden behind the loop.
- Under `wrap=false` the cells outside the row read as 0; under `wrap=true` index `-1` is the last cell and index `length` is the first. The oracle spells it as `cfg.wrap ? prior[(j + prior.length) % prior.length] : (prior[j] || 0)`.
- `check` clones with `structuredClone` and finishes with `deep(input, before, 'Input must not mutate')`.
- The update is synchronous — every cell in a new row is computed from the *old* row. Nothing in the assertions names this directly, but any sequential in-place update produces different rows and fails immediately.

## Approach

1. Validate `steps` first: `Number.isInteger(input.steps) && input.steps >= 0`, else `RangeError('Steps')`.
2. Copy the starting row and seed the history with a second copy. Two copies, because the working row will be replaced and the history row must not change under it.
3. For each step, define the neighbour reader for the current row. `wrap` picks between `cells[(i + cells.length) % cells.length]` and `cells[i] || 0`. The `+ cells.length` before the `%` is what makes `-1` wrap to the end — JavaScript's `%` keeps the sign of the dividend, so `-1 % 5` is `-1`.
4. Build the next row with `cells.map((value, i) => (cfg.rule >> (get(i-1)*4 + value*2 + get(i+1))) & 1)`. Because `map` returns a new array and reads the old one throughout, the update is synchronous for free.
5. Assign the new row, push a copy into the history, and repeat.

Cost: O(steps × cells) time, and the same in output size, which is inherent — the history *is* the answer.

## Worked example — 1949 Elementary cellular automata / scenario 1 — rule=30; wrap=false

Take the fifth starting row from the test list, `[0,0,1,0,0]`, with `steps: 4`, `cfg.rule = 30` and `cfg.wrap = false`.

First, decode the rule. `30` in binary is `00011110`, so:

| Neighbourhood | Code | Bit of 30 | Next |
| --- | --- | --- | --- |
| `000` | 0 | 0 | 0 |
| `001` | 1 | 1 | 1 |
| `010` | 2 | 1 | 1 |
| `011` | 3 | 1 | 1 |
| `100` | 4 | 1 | 1 |
| `101` | 5 | 0 | 0 |
| `110` | 6 | 0 | 0 |
| `111` | 7 | 0 | 0 |

Step 1, from `[0,0,1,0,0]`. Positions −1 and 5 read as 0 because `wrap` is false.

| `i` | left, self, right | Code | Next |
| --- | --- | --- | --- |
| 0 | 0, 0, 0 | 0 | 0 |
| 1 | 0, 0, 1 | 1 | 1 |
| 2 | 0, 1, 0 | 2 | 1 |
| 3 | 1, 0, 0 | 4 | 1 |
| 4 | 0, 0, 0 | 0 | 0 |

New row `[0,1,1,1,0]`.

Step 2, from `[0,1,1,1,0]`:

| `i` | left, self, right | Code | Next |
| --- | --- | --- | --- |
| 0 | 0, 0, 1 | 1 | 1 |
| 1 | 0, 1, 1 | 3 | 1 |
| 2 | 1, 1, 1 | 7 | 0 |
| 3 | 1, 1, 0 | 6 | 0 |
| 4 | 1, 0, 0 | 4 | 1 |

New row `[1,1,0,0,1]`.

Steps 3 and 4 continue the same way, giving `[1,0,1,1,1]` and then `[1,0,1,0,0]`. The full expected history:

```text
[0,0,1,0,0]   the initial row
[0,1,1,1,0]
[1,1,0,0,1]
[1,0,1,1,1]
[1,0,1,0,0]
```

Five rows for four steps. Row 1 position 0 is where the boundary policy shows: with `wrap=true` (scenario 2, ID 1950) the left neighbour of cell 0 would be cell 4 rather than a phantom 0, and the histories diverge from the first step.

Step 2 row 0 is worth reading closely. The cell itself is 0, its right neighbour is 1, and its left neighbour is off the end — so the code is `0*4 + 0*2 + 1 = 1`, and bit 1 of 30 is set. This is how rule 30 grows into the empty space on its left even though the initial row had nothing there.

The test asserts this via `check({cells, steps}, oracle(cells, steps))`; the oracle computes the same bit with `Math.floor(cfg.rule / (2 ** bit)) % 2` instead of a shift, and builds each new row from `history.at(-1)`.

The reference solution, as it now reads in `solutions/1949.cjs`:

```js
function automaton(input) {
  if (!Number.isInteger(input.steps) || input.steps < 0) {
    throw new RangeError('Steps');
  }
  let cells = [...input.cells];
  const history = [[...cells]];
  for (let step = 0; step < input.steps; step++) {
    const get = i => (cfg.wrap ? cells[(i + cells.length) % cells.length] : (cells[i] || 0));
    cells = cells.map((value, i) => (cfg.rule >> (get(i - 1) * 4 + value * 2 + get(i + 1))) & 1);
    history.push([...cells]);
  }
  return history;
}
```

## Policy matrix — what changes between the variants

`cfg.rule` appears once, in the shift; `cfg.wrap` appears once, in `get`. Nothing else changes across the family.

| ID | Variant | Semantic key | What differs in the code |
| --- | --- | --- | --- |
| 1949 | rule=30; wrap=false | `{"rule":30,"wrap":false}` | `30 >> code`; out-of-range reads are `cells[i] \|\| 0` |
| 1950 | rule=30; wrap=true | `{"rule":30,"wrap":true}` | `get` becomes `cells[(i + cells.length) % cells.length]` |
| 1951 | rule=54; wrap=false | `{"rule":54,"wrap":false}` | `54 >> code` — `00110110` |
| 1952 | rule=54; wrap=true | `{"rule":54,"wrap":true}` | rule 54 on a circular row |
| 1953 | rule=90; wrap=false | `{"rule":90,"wrap":false}` | `90 >> code` — `01011010`, the left-XOR-right rule |
| 1954 | rule=90; wrap=true | `{"rule":90,"wrap":true}` | rule 90 on a circular row |
| 1955 | rule=110; wrap=false | `{"rule":110,"wrap":false}` | `110 >> code` — `01101110` |
| 1956 | rule=110; wrap=true | `{"rule":110,"wrap":true}` | rule 110 on a circular row |
| 1957 | rule=184; wrap=false | `{"rule":184,"wrap":false}` | `184 >> code` — `10111000`, the traffic rule |
| 1958 | rule=184; wrap=true | `{"rule":184,"wrap":true}` | rule 184 on a circular row |

Five rules × two boundary policies. The rules are chosen for their characters — 90 is a deterministic fractal, 30 looks random, 110 is capable of universal computation, 184 models traffic flow — but the code treats them all as eight bits to shift out.

## Pitfalls the tests are designed to catch

- **Updating in place.** `for (let i = 0; i < cells.length; i++) cells[i] = …` makes cell `i+1` read a neighbour that has already stepped. `map` into a new array, or write into a separate `next`.
- **Pushing the working row instead of a copy.** `history.push(cells)` stores a reference; the next step replaces the variable, so with `map` the stored row survives — but a sequential implementation that writes into the same array would corrupt every row in the history. Copying is the safe habit, and the first row must be copied because it comes from `input.cells`.
- **`cells[i] % cells.length` for the wrap.** With `i = -1` that is `-1`, and `cells[-1]` is `undefined`. Add `cells.length` first.
- **Reading out-of-range cells as `undefined`.** `undefined * 4` is `NaN`, and `rule >> NaN` is `rule >> 0`. The `|| 0` is what turns the edge into a zero.
- **Getting the code order backwards.** `right*4 + self*2 + left` is a different automaton — it mirrors every rule. The prompt fixes it as `left*4 + self*2 + right`.
- **Checking `steps` inside the loop.** With `cells: []` the loop still runs `steps` times, but the test's throwing case uses `steps: -1`, where the loop body never runs. The guard must be before the loop.
- **Returning booleans.** `(rule >> code) & 1` gives `0` or `1`; `Boolean(...)` gives `false`/`true`, which fails `assert.deepEqual` from `node:assert/strict`.
- **Omitting the initial row.** The history has `steps + 1` entries. With `steps: 0` the expected result is one row, not zero.

## Checking your work

```text
node js-more/verify.cjs --id=1949
node js-more/verify.cjs --starters --id=1949
```

Write out your rule's eight-row table before you code. If `(cfg.rule >> 7) & 1` does not match what you expect for neighbourhood `111`, the shift direction is wrong and every later row will be.

## Try it yourself

1. Render the history as text, `'.'` for 0 and `'#'` for 1, and run rule 90 for 16 steps from a single 1 in the middle of 33 cells. Name the shape you get.
2. Rule 184 is the "traffic" rule: a 1 moves right if the cell ahead is empty. Verify that claim from its eight-row table, and say what `wrap=true` means physically.
3. Generalize the code to a rule number given as an array of eight bits. Which line changes, and does the policy matrix still make sense?
4. In words: explain why a synchronous update needs two arrays, using step 2 above and the cells at positions 1 and 2.
