# Robot navigation — js-rest 136–139

**What you practise:** running a small command interpreter over a state machine, using modular arithmetic for rotation and a lookup table for movement.
**Prerequisites:** the `%` operator and why `(i + 3) % 4` is a safe "minus one"; indexing a string; throwing on invalid input.
**Exercises:** 136: Robot navigation starting north, 137: Robot navigation starting east, 138: Robot navigation starting south, 139: Robot navigation starting west.

## The problem in plain words

The input is a string of commands. `L` turns the robot 90 degrees left, `R` turns it 90 degrees right, `F` moves it one unit in whatever direction it currently faces. Any other character is an error.

The robot starts at the origin `(0, 0)`. North increases `y`, east increases `x` — the usual mathematical axes, not screen coordinates where `y` grows downwards. You must return `{x, y, direction}`, with `direction` one of the letters `N`, `E`, `S`, `W`.

"Policy" here is the starting heading, and nothing else. The four exercises are byte-for-byte identical apart from one initial value, which makes them a clean demonstration of how much a single seed changes an output.

The trick that keeps the interpreter short is to store the four headings in clockwise order. Then turning right is "add one" and turning left is "subtract one", both modulo four, and the movement for a heading is one table lookup.

## The contract you must honour

Taken from `tests/136.cjs` through `tests/139.cjs`:

- `""` asserts `{"x":0,"y":0,"direction":"N"}` for 136, `…"E"` for 137, `…"S"` for 138 and `…"W"` for 139. With no commands, the answer is the starting state.
- `"FFRFL"` asserts `{"x":1,"y":2,"direction":"N"}` for 136, `{"x":2,"y":-1,"direction":"E"}` for 137, `{"x":-1,"y":-2,"direction":"S"}` for 138 and `{"x":-2,"y":1,"direction":"W"}` for 139. Note that in every case the final direction equals the starting direction, because `R` and `L` cancel.
- `"FX"` asserts `assert.throws(()=>solve(input), e=>e instanceof Error && e.message==="Invalid command")` in all four. The message is exactly `Invalid command`, and the valid `F` before the `X` does not save the run.
- The return value is an object with exactly the keys `x`, `y` and `direction`.
- Every case ends with `assert.deepEqual(input, before, 'Input must not mutate')`. The input is a string, so this is automatic.

## Approach

1. Lay out the headings clockwise: index 0 is N, 1 is E, 2 is S, 3 is W.
2. Build the movement table in the same order: `[[0, 1], [1, 0], [0, -1], [-1, 0]]` — north is `+1` on `y`, east is `+1` on `x`, south is `-1` on `y`, west is `-1` on `x`.
3. Keep the heading letters as a string, `'NESW'`, so the final direction is `nameByHeading[heading]`. A string indexes like an array here.
4. Seed `x = 0`, `y = 0`, and `heading` with the variant's starting index.
5. Iterate the command string with `for (const command of input)`, which yields one character at a time.
   - `'R'`: `heading = (heading + 1) % 4`.
   - `'L'`: `heading = (heading + 3) % 4`. Adding three is the same as subtracting one modulo four, and it avoids `-1 % 4`, which in JavaScript is `-1`, not `3`.
   - `'F'`: add the table's `dx` and `dy` to `x` and `y`.
   - anything else: `throw new Error('Invalid command')`.
6. Return `{x, y, direction: nameByHeading[heading]}`.

One pass over the commands, constant memory.

## Worked example — 136 Robot navigation starting north

The first input in `tests/136.cjs` is `""`. The loop body never runs, so the seeded state is returned: `{x: 0, y: 0, direction: 'N'}` — asserted on line 2.

The second case, on line 3, is `"FFRFL"`, starting at heading 0 (north):

| # | command | heading before | action | heading after | x | y |
| --- | --- | --- | --- | --- | --- | --- |
| — | — | — | start | 0 (N) | 0 | 0 |
| 1 | `F` | 0 (N) | add `[0, 1]` | 0 (N) | 0 | 1 |
| 2 | `F` | 0 (N) | add `[0, 1]` | 0 (N) | 0 | 2 |
| 3 | `R` | 0 (N) | `(0 + 1) % 4` | 1 (E) | 0 | 2 |
| 4 | `F` | 1 (E) | add `[1, 0]` | 1 (E) | 1 | 2 |
| 5 | `L` | 1 (E) | `(1 + 3) % 4` | 0 (N) | 1 | 2 |

Final state: `x: 1`, `y: 2`, `heading: 0`, so `direction` is `'NESW'[0]` — `"N"`. That is the assertion `{"x":1,"y":2,"direction":"N"}` on line 3.

Run the identical trace from heading 1 and you get 137's `{"x":2,"y":-1,"direction":"E"}`: two forward steps east to `x: 2`, a right turn to south, one step to `y: -1`, a left turn back to east. Only the seed moved.

The third case, `"FX"`, executes the `F` — `y` becomes 1 — and then falls through every branch on `X` and throws `Error('Invalid command')`. Nothing about the partially-updated state escapes, because it lived only in local variables.

The reference solution, as it now reads in `solutions/136.cjs`:

```js
function solve(input) {
  const moveByHeading = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  const nameByHeading = 'NESW';
  let x = 0;
  let y = 0;
  let heading = 0;
  for (const command of input) {
    if (command === 'L') {
      heading = (heading + 3) % 4;
    } else if (command === 'R') {
      heading = (heading + 1) % 4;
    } else if (command === 'F') {
      x += moveByHeading[heading][0];
      y += moveByHeading[heading][1];
    } else {
      throw new Error('Invalid command');
    }
  }
  return { x, y, direction: nameByHeading[heading] };
}
```

## Policy matrix — what changes between the variants

| ID | Variant | What differs in the prompt | What differs in the code |
| --- | --- | --- | --- |
| 136 | starting north | "Start at (0,0) facing north" | `let heading = 0` |
| 137 | starting east | "Start at (0,0) facing east" | `let heading = 1` |
| 138 | starting south | "Start at (0,0) facing south" | `let heading = 2` |
| 139 | starting west | "Start at (0,0) facing west" | `let heading = 3` |

## Pitfalls the tests are designed to catch

- **Writing the left turn as `(heading - 1) % 4`.** In JavaScript `-1 % 4` is `-1`, not `3`, so from north a left turn indexes `moveByHeading[-1]`, which is `undefined`, and the next `F` produces `NaN`. `"FFRFL"` ends with an `L`, so 136 would return `direction: undefined`.
- **Getting the axis convention backwards.** Using screen coordinates, where north decreases `y`, gives `{"x":1,"y":-2,…}` for 136's second case. The prompt states "north increases y".
- **Ordering the headings anticlockwise.** If the table is `N, W, S, E`, then `+1` is a left turn and every `R` goes the wrong way. The tests catch it because `"FFRFL"` contains one of each.
- **Ignoring unknown characters instead of throwing.** `"FX"` asserts a throw; skipping the `X` returns `{x: 0, y: 1, direction: "N"}` and fails `assert.throws`.
- **Validating the whole string up front.** Not wrong by the tests, but it changes the shape: the reference throws mid-walk, which is what a streaming interpreter does. Either passes; be deliberate.
- **Returning the heading index instead of its letter.** The assertion compares `direction` against `"N"`, not `0`.
- **Using `input.split('')` and a numeric loop.** Harmless here, but `for…of` over a string iterates by code point rather than UTF-16 unit, which is the more robust habit.

## Checking your work

Run one exercise at a time:

```text
node js-rest/verify.cjs --id=136
```

Three things to check by eye first:

- Is the left turn `(heading + 3) % 4`? A `- 1` produces `-1` from heading 0 and everything downstream becomes `undefined` or `NaN`.
- Is the heading table clockwise, `N, E, S, W`, matching `'NESW'`?
- Does north add to `y` rather than subtract from it?

A useful self-test the suite does not include:

```js
solve("LLLL");
```

Four left turns must return the starting state exactly: `{x: 0, y: 0, direction: <start letter>}`. A wrong modulo shows up here as an `undefined` direction. Then try `"LF"`: from north it should give `{x: -1, y: 0, direction: "W"}`.

## Try it yourself

1. Add a `B` command that moves one unit backwards without turning. Can you express it with the existing table?
2. Add a bounded grid: the robot may not leave `0 ≤ x,y ≤ 10`, and a step that would leave it is ignored. Which branch changes?
3. Support a repeat count, so `"F3"` means three forward steps. What does that do to the single-character loop?
4. In words: explain why `(heading + 3) % 4` and `(heading - 1 + 4) % 4` are the same, and say which you would rather read in six months.
