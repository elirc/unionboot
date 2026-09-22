# Tagged instructions — js-rest 168–171

**What you practise:** interpreting a list of tagged operations as a left fold, validating each tag before applying it, and recording an audit trail.
**Prerequisites:** accumulator loops; the `**` exponentiation operator; `Math.min`/`Math.max` clamping; shorthand object literals.
**Exercises:** 168: Process tagged add instructions, 169: Process tagged multiply instructions, 170: Process tagged power instructions, 171: Process tagged clamp instructions.

## The problem in plain words

The input is `{initial, steps}`. You start from `initial` and apply each step in order, each one transforming the running value. At the end you return both the final value and a `trace` — the running value after each step, which is the audit trail an operator would read to see how a number was arrived at.

Every step carries a `type` tag. Each exercise recognises exactly one tag, and a step carrying anything else is an error. That is deliberately strict: this is a dispatcher with one entry in its table, and the error path is what a real dispatcher needs most.

"Policy" is the operation: add, multiply, raise to a power, or clamp into a range.

The clamp variant is the odd one out in a second way: its step carries `min` and `max` rather than `value`, so the step *shape* changes with the policy, not just the arithmetic.

## The contract you must honour

Taken from `tests/168.cjs` through `tests/171.cjs`:

- `{"initial":2,"steps":[]}` asserts `{"value":2,"trace":[]}` in all four. With no steps, the value is the initial value and the trace is empty — the trace never contains `initial`.
- 168: `{"initial":2,"steps":[{"type":"add","value":3},{"type":"add","value":2}]}` asserts `{"value":7,"trace":[5,7]}`.
- 169: two `multiply` steps of 3 then 2 from `initial: 2` assert `{"value":12,"trace":[6,12]}`.
- 170: two `power` steps of 3 then 2 from `initial: 2` assert `{"value":64,"trace":[8,64]}` — so it is `2**3 = 8` then `8**2 = 64`, the running value as base.
- 171: steps `{"type":"clamp","min":3,"max":5}` then `{"type":"clamp","min":0,"max":1}` from `initial: 2` assert `{"value":1,"trace":[3,1]}`.
- `{"initial":0,"steps":[{"type":"nope"}]}` asserts `assert.throws(()=>solve(input), e=>e instanceof Error && e.message==="Unknown operation")` in all four. The message is exactly `Unknown operation`.
- The return value is an object with exactly the keys `value` and `trace`, and `trace.length === steps.length` on every successful run.
- Every case ends with `assert.deepEqual(input, before, 'Input must not mutate')` against a `structuredClone`, so the steps may not be annotated with their results.

## Approach

1. `let value = input.initial;` and `const trace = [];`.
2. For each `step` in `input.steps`:
   - check the tag first: `if (step.type !== 'add') throw new Error('Unknown operation');`
   - apply the operation to `value`;
   - `trace.push(value)` — after the update, so the trace records results, not inputs.
3. Return `{ value, trace }` using shorthand properties.

One pass, O(n).

Checking the tag before applying is what makes a bad step stop the run rather than be silently skipped. It also means the error can fire part-way through: in a longer input, earlier steps have already updated the local `value`, but since nothing was written back to `input`, the caller's data is untouched when the exception propagates.

The two `Math` calls in the clamp variant compose in a specific order: `Math.min(step.max, Math.max(step.min, value))`. The inner `Math.max` pulls a too-small value up to `min`; the outer `Math.min` pushes a too-large one down to `max`. Written the other way round the result is the same whenever `min <= max`, and differs when the range is inverted — which the prompt does not promise against.

## Worked example — 168 Process tagged add instructions

The first input in `tests/168.cjs` is `{"initial":2,"steps":[]}`. The loop never runs, so `value` is still `2` and `trace` is still `[]` — asserted on line 2 as `{"value":2,"trace":[]}`.

The second case, on line 3, is `{"initial":2,"steps":[{"type":"add","value":3},{"type":"add","value":2}]}`:

| # | step | tag check | `value` before | operation | `value` after | `trace` after |
| --- | --- | --- | --- | --- | --- | --- |
| — | — | — | — | start | 2 | `[]` |
| 1 | `add 3` | `'add' !== 'add'` is false: pass | 2 | `2 + 3` | 5 | `[5]` |
| 2 | `add 2` | pass | 5 | `5 + 2` | 7 | `[5,7]` |

Return `{value: 7, trace: [5,7]}`, asserted on line 3. The trace holds `5` and `7`, the results, not `3` and `2`, the operands, and not `2`, the initial value.

The same trace under the other policies, from the same `initial: 2`: multiply gives `2*3 = 6` then `6*2 = 12`; power gives `2**3 = 8` then `8**2 = 64`; clamp gives `min(5, max(3, 2)) = 3` then `min(1, max(0, 3)) = 1`. The clamp case is worth pausing on — the second step pulls the value back *down* to 1, so the trace `[3,1]` is not monotonic.

The third case, on line 4, is `{"initial":0,"steps":[{"type":"nope"}]}`. The first step fails the tag check before any arithmetic, and `Error('Unknown operation')` is thrown. Note the step has no `value` key at all, so applying it before checking would have produced `NaN` rather than an error.

The reference solution, as it now reads in `solutions/168.cjs`:

```js
function solve(input) {
  let value = input.initial;
  const trace = [];
  for (const step of input.steps) {
    if (step.type !== 'add') {
      throw new Error('Unknown operation');
    }
    value = value + step.value;
    trace.push(value);
  }
  return { value, trace };
}
```

## Policy matrix — what changes between the variants

| ID | Variant | What differs in the prompt | What differs in the code |
| --- | --- | --- | --- |
| 168 | add | "Each step must have type 'add'" | tag `'add'`; `value = value + step.value` |
| 169 | multiply | "Each step must have type 'multiply'" | tag `'multiply'`; `value = value * step.value` |
| 170 | power | "Apply raise current to step.value" | tag `'power'`; `value = value ** step.value` |
| 171 | clamp | "Apply clamp current between step.min and step.max" | tag `'clamp'`; `value = Math.min(step.max, Math.max(step.min, value))`; the step carries `min`/`max`, not `value` |

## Pitfalls the tests are designed to catch

- **Pushing to the trace before applying the step.** That records the *input* to each step, so 168's second case returns `trace: [2,5]` instead of `[5,7]`.
- **Including `initial` in the trace.** `trace: [2,5,7]` fails the length as well as the contents; the empty-steps case asserts `trace: []`.
- **Applying the step before checking the tag.** The third case's step has no `value`, so `0 + undefined` is `NaN` and the function returns `{value: NaN, trace: [NaN]}` instead of throwing.
- **Skipping unknown steps instead of throwing.** `if (step.type === 'add') { … }` with no `else` returns `{value: 0, trace: []}` for the third case and fails `assert.throws`.
- **Reversing the base and exponent in 170.** `step.value ** value` gives `3**2 = 9` then `2**9 = 512`, not `8` then `64`.
- **Writing the clamp as `Math.max(step.max, Math.min(step.min, value))`.** That is the composition inverted: for the first step it gives `max(5, min(3, 2)) = 5`, not `3`.
- **Annotating the steps with their results.** `step.result = value` writes into the caller's objects and fails `assert.deepEqual(input, before, 'Input must not mutate')`.
- **Returning extra keys.** `assert.deepEqual` compares own enumerable properties, so `{value, trace, steps}` fails against `{"value":7,"trace":[5,7]}`.

## Checking your work

Run one exercise at a time:

```text
node js-rest/verify.cjs --id=168
```

Three things to check by eye first:

- Does the tag check come before the arithmetic, inside the loop?
- Is `trace.push(value)` after the update, so the trace records results?
- Does the return use exactly `{ value, trace }`, with no extra keys?

A useful self-test the suite does not include:

```js
solve({initial: 1, steps: [{type: 'add', value: 1}, {type: 'nope'}, {type: 'add', value: 1}]});
```

It must throw `Error('Unknown operation')`, and the caller's `steps` array must be unchanged afterwards — no `result` fields, no removed entries. This is the case that shows the error can fire half-way through a run while still leaving the input intact, because everything you changed lived in a local variable.

## Try it yourself

1. Make one function accept all four tags by dispatching through a table of `{add, multiply, power, clamp}` functions. What happens to the error branch?
2. Add a `divide` tag that throws `Error('Division by zero')` when `step.value` is `0`. Where does that check go relative to the tag check?
3. Make the trace record `{type, value}` pairs instead of bare numbers. Which assertion in each test file would have to change?
4. In words: explain why the tag check comes before the arithmetic, using the third test case, whose step has no operand at all.
