# Group consecutive equal values — js/batch-084-103 84

**What you practise:** splitting a flat array into runs of neighbouring equal values, and choosing an equality test deliberately.
**Prerequisites:** `for…of` over an array; `Array.prototype.push`; the difference between `===`, `==` and `Object.is`.
**Exercises:** 84: Group consecutive equal values.

## The problem in plain words

You are given an array of primitive values. Neighbouring equal values form a *run*: in `[1,1,2,1]` the runs are `1,1`, then `2`, then `1` on its own. Your job is to return those runs as an array of arrays.

The word that carries the weight is *consecutive*. The `1` at the end is a separate run from the two `1`s at the start, even though the value is the same. A grouping function that keyed on the value would merge them; this one must not.

The second decision is what "equal" means. JavaScript has three answers, and they disagree in exactly two places: `NaN === NaN` is `false`, and `0 === -0` is `true`. The header names `Object.is`, which reverses both of those: `Object.is(NaN, NaN)` is `true` and `Object.is(0, -0)` is `false`.

## The contract you must honour

Taken from `tests/084-adjacent-groups.cjs`:

- The return value is an array of arrays. `solve([1,1,2,1])` asserts `[[1,1],[2],[1]]`, so the two separated runs of `1` stay separate.
- `solve([])` asserts `[]`, not `[[]]`.
- `solve([NaN,NaN,0,-0])` asserts `[[NaN,NaN],[0],[-0]]`. Both halves matter: the two `NaN`s must land in one run, and `0` and `-0` must land in different runs.
- The last case builds its input with `Object.freeze(['a','a','b'])`. A frozen array throws on any write in strict mode, so the input must be read only.

## Approach

1. Start with an empty array of `groups`.
2. Walk the input once. For each value, look at the run currently being built — that is always the last element of `groups`.
3. If a run exists and its final element is equal to the incoming value under `Object.is`, push the value onto that run.
4. Otherwise start a new run: `groups.push([value])`.
5. Return `groups`.

This is O(n) time and O(n) output, and it needs no lookup table. The comparison only ever looks one position back, which is exactly why separated runs never merge.

## Worked example — 84 Group consecutive equal values

Input, from the third assertion in the test file: `[NaN, NaN, 0, -0]`.

| Value read | Last element of current run | `Object.is` match? | `groups` after the step |
| --- | --- | --- | --- |
| `NaN` | no run yet | — | `[[NaN]]` |
| `NaN` | `NaN` | yes | `[[NaN,NaN]]` |
| `0` | `NaN` | no | `[[NaN,NaN],[0]]` |
| `-0` | `0` | no | `[[NaN,NaN],[0],[-0]]` |

Expected output `[[NaN,NaN],[0],[-0]]`, asserted on line 6 of the test file with `assert.deepEqual`.

The reference solution, as it now reads in `solutions/084-adjacent-groups.cjs`:

```js
function groupRuns(values) {
  const groups = [];
  for (const value of values) {
    const currentRun = groups[groups.length - 1];
    if (currentRun && Object.is(currentRun[currentRun.length - 1], value)) {
      currentRun.push(value);
    } else {
      groups.push([value]);
    }
  }
  return groups;
}
```

## Variations you could build

| Variation | What would change in the code |
| --- | --- |
| Return `[value, count]` pairs instead of runs | the run becomes a counter object; `push` becomes `count++` |
| Group by a key function, `groupRunsBy(values, keyOf)` | compare `keyOf(value)` with a remembered `lastKey` instead of the run's last element |
| Merge runs shorter than a minimum length into their neighbour | a second pass over `groups`, since the decision needs the run's finished length |

## Pitfalls the tests are designed to catch

- **Using `===` for the comparison.** `NaN === NaN` is `false`, so `[NaN,NaN]` would come back as `[[NaN],[NaN]]` and fail the third assertion.
- **Using `==` or a `Map` keyed on the value.** Either would merge the leading and trailing `1` in `[1,1,2,1]` into one group.
- **Treating `0` and `-0` as the same value.** `deepEqual` in `node:assert/strict` distinguishes them, so `[[NaN,NaN],[0,-0]]` fails.
- **Writing to the input.** The fourth case passes `Object.freeze(['a','a','b'])` and the solution file is under `'use strict'`, so an assignment into that array throws a `TypeError` rather than being silently ignored.
- **Returning `[[]]` for empty input.** The loop body never runs, so `groups` must be returned as the empty array it started as; seeding it with one empty run would fail the second assertion.

## Try it yourself

1. Add a `maxRunLength` parameter that starts a new run once the current one is full, so `groupRuns([1,1,1], 2)` gives `[[1,1],[1]]`. Where does the extra condition go?
2. Write the inverse function: given `[[1,1],[2],[1]]`, rebuild `[1,1,2,1]`. Which array method does it in one line?
3. In words: `Object.is` differs from `===` in exactly two cases. Name both, and describe an input where switching to `===` would change this function's output but the test as written would still pass.
