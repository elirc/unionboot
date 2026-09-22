# Quantize to a step — js-rest 120–123

**What you practise:** snapping numbers onto a grid with four different rounding modes, validating a parameter before use, and normalising negative zero.
**Prerequisites:** `Math.floor`, `Math.ceil`, `Math.trunc`; `Number.isFinite`; what `-0` is and how it differs from `0`.
**Exercises:** 120: Quantize to a step: floor, 121: Quantize to a step: ceil, 122: Quantize to a step: nearest-half-up, 123: Quantize to a step: toward-zero.

## The problem in plain words

The input is `{values: number[], step: number}`. Quantizing means forcing every value onto the nearest multiple of `step` — the way a price is snapped to whole cents, or a timestamp to five-minute buckets.

The mechanic is always the same three moves: divide by the step to find how many steps from zero the value sits, round that count to a whole number, multiply back by the step. Change the rounding and you change the variant.

"Policy" here is the rounding mode, and the four modes really do disagree. On the value `-3` with step `2`, the step count is `-1.5`: floor gives `-2` steps (`-4`), ceil gives `-1` step (`-2`), nearest-half-up gives `-1` step (`-2`), and toward-zero gives `-1` step (`-2`). Negative inputs are where rounding modes stop agreeing, which is why the shared test case is `[-3,-1,1,3]`.

Two extra requirements sit on top. The step must be validated before anything is computed, and the results must not contain negative zero.

## The contract you must honour

Taken from `tests/120.cjs` through `tests/123.cjs`:

- `{"values":[],"step":2}` asserts `[]` in all four variants. Validation passes and the map produces nothing.
- The shared case `{"values":[-3,-1,1,3],"step":2}` asserts `[-4,-2,0,2]` for floor, `[-2,0,2,4]` for ceil, `[-2,0,2,4]` for nearest-half-up and `[-2,0,0,2]` for toward-zero. Ceil and nearest-half-up agree on this input; only toward-zero produces a repeated `0`.
- `{"values":[1],"step":0}` asserts `assert.throws(()=>solve(input), e=>e instanceof Error && e.message==="Invalid step")` in all four. The message is exactly `Invalid step`.
- The return value is a new array of the same length as `values`, in the same order.
- Every case ends with `assert.deepEqual(input, before, 'Input must not mutate')` against a `structuredClone`.
- The prompt requires `-0` to be normalised to `0`, and this one **is** enforced. `assert.deepEqual` from `node:assert/strict` uses `Object.is` semantics for primitives, so it treats `-0` and `0` as different. In 121, `Math.ceil(-1 / 2)` is `-0` and `-0 * 2` is `-0`; in 123, `Math.trunc(-1 / 2)` is `-0` likewise. Both assert `0` at that position, so dropping the normalisation fails those two exercises outright.

## Approach

1. Validate first. `if (!Number.isFinite(step) || step <= 0) throw new Error('Invalid step');`. `Number.isFinite` rejects `NaN`, `Infinity` and `-Infinity` without the coercion that the global `isFinite` performs; the second half rejects zero and negatives. Doing this before the map means a bad step fails even when `values` is empty.
2. Map over `values`. `Array.prototype.map` allocates a new array, so the input is never written to.
3. Inside the callback: `const stepsFromZero = value / step;` — how many steps away from zero this value sits, as a fraction.
4. Round `stepsFromZero` with the variant's function, then multiply by `step` to get back into the original units.
5. Return `snapped || 0`. This is the negative-zero normaliser: `-0` is falsy, so `||` replaces it with `0`, while every non-zero result passes through unchanged and a genuine `0` maps to `0`.

Cost: one pass, O(n), no comparisons.

A note on why `-0` appears at all. In IEEE-754 floating point, zero carries a sign. `Math.trunc(-0.5)` is `-0`, and `-0 * 2` is `-0`. It prints as `0`, compares `-0 === 0` as true, and only `Object.is(-0, 0)` and `1/-0` reveal it. It leaks into JSON as `0` but into `Object.is`-based diffing as a change — see [06 Configuration diff](06-configuration-diff.md), where `Object.is` treats them as different.

## Worked example — 120 Quantize to a step: floor

The first input in `tests/120.cjs` is `{"values":[],"step":2}`. Validation passes because `2` is finite and positive; `[].map(...)` returns `[]`, asserted on line 2.

The second case, on line 3, is `{"values":[-3,-1,1,3],"step":2}`:

| value | `value / step` | `Math.floor(...)` | `× step` | `|| 0` | output |
| --- | --- | --- | --- | --- | --- |
| `-3` | `-1.5` | `-2` | `-4` | `-4` | `-4` |
| `-1` | `-0.5` | `-1` | `-2` | `-2` | `-2` |
| `1` | `0.5` | `0` | `0` | `0` | `0` |
| `3` | `1.5` | `1` | `2` | `2` | `2` |

Result `[-4,-2,0,2]`, asserted on line 3. Notice `-1`: floor rounds *down*, towards negative infinity, so `-0.5` becomes `-1`, not `0`. That is the difference from toward-zero, which gives `0` for the same value — and that is exactly why `tests/123.cjs` asserts `[-2,0,0,2]` with two zeroes in the middle.

The third case, on line 4, is `{"values":[1],"step":0}`. `Number.isFinite(0)` is true, so the first half of the guard passes, but `0 <= 0` is true, so the throw fires before `values` is read at all.

The reference solution, as it now reads in `solutions/120.cjs`:

```js
function solve(input) {
  const step = input.step;
  if (!Number.isFinite(step) || step <= 0) {
    throw new Error('Invalid step');
  }
  return input.values.map(value => {
    const stepsFromZero = value / step;
    const snapped = Math.floor(stepsFromZero) * step;
    return snapped || 0;
  });
}
```

## Policy matrix — what changes between the variants

| ID | Variant | What differs in the prompt | What differs in the code |
| --- | --- | --- | --- |
| 120 | floor | "Round each value/step using floor" | `Math.floor(stepsFromZero)` |
| 121 | ceil | "Round each value/step using ceil" | `Math.ceil(stepsFromZero)` |
| 122 | nearest-half-up | "nearest-half-up means Math.floor(x+0.5), including negatives" | `Math.floor(stepsFromZero + 0.5)` |
| 123 | toward-zero | "Round each value/step using toward-zero" | `Math.trunc(stepsFromZero)` |

## Pitfalls the tests are designed to catch

- **Validating after mapping, or not at all.** The third case passes `step: 0`, which makes `value / step` `Infinity`. Without the guard, `solve` returns `[Infinity]` instead of throwing, failing `assert.throws`.
- **Using the global `isFinite` instead of `Number.isFinite`.** `isFinite('2')` is `true` because it coerces the string. The prompt says the step must *be* finite, which is a statement about its type as well as its value.
- **Rejecting the step with `step < 0` instead of `step <= 0`.** Zero then slips through and the third case fails.
- **Using `Math.round` for nearest-half-up.** On this test data they agree only because of the normaliser: `Math.round(-0.5)` is `-0` and `Math.floor(-0.5 + 0.5)` is a plain `0`, and the `|| 0` flattens the difference before it reaches the assertion. The prompt names `Math.floor(x + 0.5)` explicitly, so that is what belongs in the file.
- **Confusing floor with toward-zero.** They are identical for positive values and differ for every negative non-integer. The shared case is deliberately half negative; a floor implementation submitted for 123 gives `[-2,-2,0,2]` and fails on the second element.
- **Dropping the `|| 0`.** This fails 121 and 123 immediately: both produce `-0` at the second position of the shared case, and `assert.deepEqual` under `node:assert/strict` compares primitives with `Object.is`, which separates `-0` from `0`. It happens to be invisible in 120 and 122, whose rounding never lands on `-0` for this data.
- **Mutating with a `for` loop that writes back into `input.values`.** That fails `assert.deepEqual(input, before, 'Input must not mutate')`; `map` avoids the question.

## Checking your work

Run one exercise at a time:

```text
node js-rest/verify.cjs --id=120
```

Two things to read your own file for:

- Is the negative-zero normalisation present? 121 and 123 fail without it; 120 and 122 pass either way on this data, so a green run on one of those two proves nothing.
- Is the validation `Number.isFinite(step)` rather than the global `isFinite`, and is the bound `<= 0` rather than `< 0`? Neither refinement is asserted: no test passes a fractional, infinite or string step.

The third check is one the tests do cover, but it is the easiest to get wrong by copying a sibling: does the rounding function match the variant's name? Floor and toward-zero agree on every positive value and differ on every negative one, so a quick sanity check is to run your solution on a single negative value.

A useful self-test the suite does not include:

```js
solve({values: [-0.5, -1.5, 1.5], step: 1});
```

Expected per variant: floor `[-1, -2, 1]`, ceil `[0, -1, 2]`, nearest-half-up `[0, -1, 2]`, toward-zero `[0, -1, 1]`. For ceil and toward-zero the first element is a zero produced by `Math.ceil(-0.5)` and `Math.trunc(-0.5)`, both of which are `-0` before normalisation; check `Object.is(result[0], 0)` on those two and confirm it is `true`.

## Try it yourself

1. Add a `banker's rounding` variant, where an exact half rounds to the nearest even step count. Which values in the shared case would change?
2. The reference divides then multiplies. Rewrite 120 using `value - (value % step)` and find an input where it disagrees. Which is right?
3. Allow a negative step, defining it as a step of `Math.abs(step)`. Which test would you have to add to prove your change works?
4. In words: `assert.deepEqual` cannot see the difference between `-0` and `0`. Name a JavaScript comparison that can, and describe a real situation where the difference would reach a user.
