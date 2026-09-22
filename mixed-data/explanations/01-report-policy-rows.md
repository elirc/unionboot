# Report policy, rows shape — mixed-data 384–413 and 474–503

**What you practise:** running one fixed four-stage report pipeline — filter, copy, sort, cut — and reading the policy out of the prompt instead of inventing it.
**Prerequisites:** `Array.prototype.filter`, `map`, `sort` with a comparator and `slice`; object spread (`{...record}`); for the TypeScript half, `readonly T[]` parameters and what `@ts-expect-error` means.
**Exercises:** 60 of them. The JavaScript half is 384–413 (`solutions/<id>.cjs`), the TypeScript half is 474–503 (`solutions/<id>.ts`). Every title has the form `Report policy N: <status>, min <M>, rows`; the full ID-to-policy table is at the bottom of this doc.

## The problem in plain words

You are handed a flat array of records. Each record is `{id, amount, status, team}`: a string identifier, a finite number, the string `"open"` or `"closed"`, and a team name. The array is not sorted and the caller still owns it.

You have to produce a small report. A report has a *policy*, and a policy in this track is three independent decisions: which records count (a status rule and a minimum amount), which of the surviving records make it into the window (a sort order plus a skip and a take), and what the window is rendered as. This doc covers the third decision's `rows` setting: the answer is an array of `{id, amount}` objects, one per selected record, in window order.

That is the whole family. There are 135 exercises in `mixed-data/` and they are all this pipeline with different arguments. What makes them worth doing one after another is that the arguments interact: `min 40` plus `take 2` can return fewer than two rows, and `skip 1` on a one-record input returns nothing at all. The tests are built to hit exactly those interactions.

The JavaScript exercises and the TypeScript exercises pose the same problem. The TypeScript ones add a second gate: a type fixture under `types/` that must keep failing to compile in the places it says it should.

## The contract you must honour

Taken from `tests/384.cjs` and `tests/474.cjs`; every test file in the track has the same four cases with the same two input arrays.

- The parameter is the array itself, not a wrapper object. `solve(input)` where `input` is `[{id, amount, status, team}, …]`.
- Every case clones the input first — `const before = structuredClone(input);` — and finishes with `assert.deepEqual(input, before, 'Input must not mutate')`. Sorting the argument in place fails with that message.
- `assert` is `require('node:assert/strict')`, so `assert.deepEqual` is the strict deep comparison. A returned row carrying `status` or `team` as well as `id` and `amount` is an extra own property and fails.
- Empty input returns `[]`. Case 2 is `const input=[];` and asserts `assert.deepEqual(solve(input),[])` in all 60 rows exercises.
- Case 1 and case 4 hold the same five records in opposite input orders and assert the same output. Output order therefore comes from your comparator, never from the caller's order.
- Ties on `amount` are broken by `id` ascending in code-unit order — that is, by JavaScript's default `<` on strings, which compares UTF-16 code units. The supplied test data has no tied amounts, so the tie-break is a prompt requirement the reviewer reads in the source rather than something case 1 catches.
- The window is `skip` then `take`, applied after the sort. Taking more rows than exist is not an error; you return what there is.
- For 474–503 the exported signature must stay exactly `export function solve(input: readonly {id:string;amount:number;status:'open'|'closed';team:string}[]): {id:string;amount:number}[]`. `types/<id>.ts` imports it and depends on that exact shape.

## Approach

1. **Filter.** Keep records whose `amount` is at least the policy minimum, and — when the policy names a status — whose `status` equals that string. `filter` returns a new array, so nothing is written back yet.
2. **Copy.** Map each survivor to `{...record}`. `filter` gives you a new array but the elements inside it are still the caller's objects. Copying once here means no later stage can reach them, which is what keeps the `'Input must not mutate'` assertion green even if you later decide to write into a record.
3. **Sort.** Sort the copies with a two-level comparator: the amount difference first, and if that is `0`, the id comparison. `a - b` sorts ascending, `b - a` descending. The `||` works because a comparator's `0` is falsy, so a zero amount difference falls through to the id comparison.
4. **Cut.** `slice(skip, skip + take)`. `slice` never throws and never mutates; if the array is shorter than `skip`, you get `[]`.
5. **Shape.** Map the selected records to `{id: record.id, amount: record.amount}`. Building a fresh object here, rather than returning the copy, is what drops `status` and `team` from the result.

Cost is O(n) for the filter and the copy, O(k log k) for the sort of the k survivors, and O(take) for the window. Nothing in the prompts asks for better.

## Worked example — 384 Report policy 1: any, min 0, rows

Policy: status any, `amount >= 0`, sort ascending, skip 0, take 2.

**Case 1, the first input in `tests/384.cjs`:**

```js
const input = [
  {"id":"a","amount":5,"status":"open","team":"red"},
  {"id":"b","amount":15,"status":"closed","team":"blue"},
  {"id":"c","amount":25,"status":"open","team":"red"},
  {"id":"d","amount":35,"status":"closed","team":"blue"},
  {"id":"e","amount":45,"status":"open","team":"red"}
];
```

| Stage | Result |
| --- | --- |
| filter `amount >= 0` | all five survive; `status` is not tested because the policy says "any" |
| copy | five spread copies, same values, different object identities |
| sort ascending | `a 5`, `b 15`, `c 25`, `d 35`, `e 45` — already in that order here |
| `slice(0, 2)` | `a 5`, `b 15` |
| shape | `[{"id":"a","amount":5},{"id":"b","amount":15}]` |

That is the assertion on line 2 of the test: `assert.deepEqual(solve(input),[{"id":"a","amount":5},{"id":"b","amount":15}])`, followed by the mutation check.

Case 4 feeds the same five records in reverse (`e` first, `a` last) and asserts the same output — the sort is doing the work. Case 3 is a single record `{"id":"z","amount":0,…}` and asserts `[{"id":"z","amount":0}]`: `0 >= 0` is true, so the minimum of `0` is inclusive, and `slice(0, 2)` on one element returns that one element.

The reference, as `solutions/384.cjs` now reads:

```js
function solve(input) {
  // Step 1: keep the records this policy reports on.
  const eligible = input.filter((record) => record.amount >= 0);
  // Step 2: copy each survivor so nothing below can write into the caller.
  const candidates = eligible.map((record) => ({ ...record }));
  // Step 3: order by amount ascending, then by id ascending for ties.
  candidates.sort((left, right) =>
    left.amount - right.amount ||
    (left.id < right.id ? -1 : left.id > right.id ? 1 : 0));
  // Step 4: skip 0, take 2.
  const selected = candidates.slice(0, 2);
  // Step 5: project to the reported shape.
  return selected.map((record) => ({ id: record.id, amount: record.amount }));
}
```

### The TypeScript twin — 474 Report policy 91: any, min 0, rows

474 has the same status and minimum and the same ascending sort, and differs only in the window: skip 1, take 2, so `slice(1, 3)`. On case 1 that selects `b 15` and `c 25`, which is what `tests/474.cjs` asserts. On case 3 — the single record `z` — it selects nothing, and the test asserts `[]`.

Its signature line, which must survive your rewrite byte for byte:

```ts
export function solve(input: readonly {id:string;amount:number;status:'open'|'closed';team:string}[]): {id:string;amount:number}[] {
```

Two parts of that line are load-bearing beyond documentation. `readonly` removes `sort`, `push` and `splice` from the parameter's type, so the non-mutation rule is enforced at compile time and not only by the runtime assertion. And `status:'open'|'closed'` is a union of two string literals, not `string`.

`types/474.ts` is the fixture that checks it:

```ts
import {solve} from '../solutions/474';
const good=solve([]);void good;
// @ts-expect-error invalid status literal
solve([{id:'x',amount:1,status:'other',team:'t'}]);
// @ts-expect-error amount cannot be a string
solve([{id:'x',amount:'1',status:'open',team:'t'}]);
```

`@ts-expect-error` inverts the compiler: the next line **must** produce an error, and if it compiles cleanly TypeScript reports `Unused '@ts-expect-error' directive`. So widening `status` to `string`, or `amount` to `number|string`, does not merely weaken the types — it turns a passing fixture into a compile error. `verify.cjs` runs `tsc -p mixed-data/tsconfig.json` over every `.ts` file before it grades anything, so one loosened signature fails all 135 exercises at once with no per-ID attribution.

## Policy matrix — what changes between the variants

Three independent axes. Nothing else differs between the 60 rows exercises.

| Axis | Values | Where it lands in the code |
| --- | --- | --- |
| status | `any` | no status test; the predicate is `record.amount >= M` alone |
| | `open` | `&& record.status === 'open'` |
| | `closed` | `&& record.status === 'closed'` |
| min | `0`, `10`, `20`, `30`, `40` | the literal in `record.amount >= M`; the comparison is `>=`, so a record exactly at the minimum is kept |
| sort | ascending | `left.amount - right.amount` |
| | descending | `right.amount - left.amount` |
| tie-break | always id ascending | `(left.id < right.id ? -1 : left.id > right.id ? 1 : 0)` — identical in all 135 |
| skip / take | see below | `slice(skip, skip + take)` |

The sort/skip/take axis is not free: each of the eight configurations below is shared by a fixed block of IDs.

| Sort | Skip | Take | `slice(…)` | IDs |
| --- | --- | --- | --- | --- |
| ascending | 0 | 2 | `slice(0, 2)` | 384–388, 394–398 |
| descending | 0 | 2 | `slice(0, 2)` | 389–393 |
| descending | 0 | 3 | `slice(0, 3)` | 399–403, 409–413 |
| ascending | 0 | 3 | `slice(0, 3)` | 404–408 |
| ascending | 1 | 2 | `slice(1, 3)` | 474–478, 484–488 |
| descending | 1 | 2 | `slice(1, 3)` | 479–483 |
| descending | 1 | 3 | `slice(1, 4)` | 489–493, 499–503 |
| ascending | 1 | 3 | `slice(1, 4)` | 494–498 |

Note the pattern the table makes obvious: `skip 0` is the JavaScript half and `skip 1` is the TypeScript half. That is the only systematic difference between the two languages in this shape.

### Full lookup — every rows exercise

| ID | Language | Status | Min | Sort | Skip | Take |
| --- | --- | --- | --- | --- | --- | --- |
| 384 | JS | any | 0 | asc | 0 | 2 |
| 385 | JS | any | 10 | asc | 0 | 2 |
| 386 | JS | any | 20 | asc | 0 | 2 |
| 387 | JS | any | 30 | asc | 0 | 2 |
| 388 | JS | any | 40 | asc | 0 | 2 |
| 389 | JS | any | 0 | desc | 0 | 2 |
| 390 | JS | any | 10 | desc | 0 | 2 |
| 391 | JS | any | 20 | desc | 0 | 2 |
| 392 | JS | any | 30 | desc | 0 | 2 |
| 393 | JS | any | 40 | desc | 0 | 2 |
| 394 | JS | open | 0 | asc | 0 | 2 |
| 395 | JS | open | 10 | asc | 0 | 2 |
| 396 | JS | open | 20 | asc | 0 | 2 |
| 397 | JS | open | 30 | asc | 0 | 2 |
| 398 | JS | open | 40 | asc | 0 | 2 |
| 399 | JS | open | 0 | desc | 0 | 3 |
| 400 | JS | open | 10 | desc | 0 | 3 |
| 401 | JS | open | 20 | desc | 0 | 3 |
| 402 | JS | open | 30 | desc | 0 | 3 |
| 403 | JS | open | 40 | desc | 0 | 3 |
| 404 | JS | closed | 0 | asc | 0 | 3 |
| 405 | JS | closed | 10 | asc | 0 | 3 |
| 406 | JS | closed | 20 | asc | 0 | 3 |
| 407 | JS | closed | 30 | asc | 0 | 3 |
| 408 | JS | closed | 40 | asc | 0 | 3 |
| 409 | JS | closed | 0 | desc | 0 | 3 |
| 410 | JS | closed | 10 | desc | 0 | 3 |
| 411 | JS | closed | 20 | desc | 0 | 3 |
| 412 | JS | closed | 30 | desc | 0 | 3 |
| 413 | JS | closed | 40 | desc | 0 | 3 |
| 474 | TS | any | 0 | asc | 1 | 2 |
| 475 | TS | any | 10 | asc | 1 | 2 |
| 476 | TS | any | 20 | asc | 1 | 2 |
| 477 | TS | any | 30 | asc | 1 | 2 |
| 478 | TS | any | 40 | asc | 1 | 2 |
| 479 | TS | any | 0 | desc | 1 | 2 |
| 480 | TS | any | 10 | desc | 1 | 2 |
| 481 | TS | any | 20 | desc | 1 | 2 |
| 482 | TS | any | 30 | desc | 1 | 2 |
| 483 | TS | any | 40 | desc | 1 | 2 |
| 484 | TS | open | 0 | asc | 1 | 2 |
| 485 | TS | open | 10 | asc | 1 | 2 |
| 486 | TS | open | 20 | asc | 1 | 2 |
| 487 | TS | open | 30 | asc | 1 | 2 |
| 488 | TS | open | 40 | asc | 1 | 2 |
| 489 | TS | open | 0 | desc | 1 | 3 |
| 490 | TS | open | 10 | desc | 1 | 3 |
| 491 | TS | open | 20 | desc | 1 | 3 |
| 492 | TS | open | 30 | desc | 1 | 3 |
| 493 | TS | open | 40 | desc | 1 | 3 |
| 494 | TS | closed | 0 | asc | 1 | 3 |
| 495 | TS | closed | 10 | asc | 1 | 3 |
| 496 | TS | closed | 20 | asc | 1 | 3 |
| 497 | TS | closed | 30 | asc | 1 | 3 |
| 498 | TS | closed | 40 | asc | 1 | 3 |
| 499 | TS | closed | 0 | desc | 1 | 3 |
| 500 | TS | closed | 10 | desc | 1 | 3 |
| 501 | TS | closed | 20 | desc | 1 | 3 |
| 502 | TS | closed | 30 | desc | 1 | 3 |
| 503 | TS | closed | 40 | desc | 1 | 3 |

## Pitfalls the tests are designed to catch

- **Sorting the argument.** `input.sort(...)` reorders the caller's array in place. Case 4 hands you the records in descending order, so a sort of the argument is immediately visible to `assert.deepEqual(input, before, 'Input must not mutate')`. In TypeScript the `readonly` parameter stops you before the test does.
- **Returning the copy instead of a projection.** `selected` still carries `status` and `team`. `assert.deepEqual` under `node:assert/strict` compares own enumerable properties, so `{"id":"a","amount":5,"status":"open","team":"red"}` is not equal to `{"id":"a","amount":5}`.
- **`>` instead of `>=`.** Case 3 in the `min 0` exercises is a record with `amount: 0` and asserts it is kept. A strict `>` returns `[]` and fails that case alone.
- **Slicing before sorting.** The window is defined over the sorted order. `slice` first and you window the caller's arbitrary order; case 4 exists to catch exactly that, because it is case 1 shuffled.
- **`slice(skip, take)` instead of `slice(skip, skip + take)`.** With skip 0 the two are identical, so the mistake is invisible until you reach a skip-1 policy. On case 1 of 474, `slice(1, 2)` returns one row where `slice(1, 3)` returns two, and the test asserts two.
- **Default sort order.** `sort()` with no comparator stringifies elements. On objects that means every element becomes `"[object Object]"` and nothing moves. You need the comparator.
- **Dropping the tie-break.** `sort` is stable in modern V8, so equal amounts keep their input order and the visible tests pass. The prompt still requires the id comparison, and it is read in the source.
- **Loosening a TypeScript parameter type.** Covered above: it makes a `@ts-expect-error` line unused, which is itself an error, and the compiler gate runs before any test.

## Try it yourself

1. Add a `take` of `Infinity` to the policy — what does `slice(1, 1 + Infinity)` return, and is that the behaviour you want for "skip one, then everything"?
2. Write the descending comparator without `-`, using only `<` and `>`. Which version behaves differently if an amount is ever `NaN`, and does the prompt let that happen?
3. Change 474 to skip 2, take 1 and predict the case 1 result before you run it.
4. In words: the copy step in stage 2 is not needed to make the current tests pass, because nothing after it writes into a record. Describe a change to stage 5 that would make it necessary, and say why the reference keeps it anyway.
