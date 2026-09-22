# Report policy, total shape — mixed-data 414–443 and 504–518

**What you practise:** the same filter/copy/sort/cut pipeline as the rows shape, finishing with an aggregate instead of a list — and noticing that the aggregate is over the *window*, not over everything that passed the filter.
**Prerequisites:** [01 Report policy, rows](01-report-policy-rows.md) — the pipeline is identical up to the last step; `Array.prototype.reduce` or a plain accumulator loop; for the TypeScript half, object return types and `@ts-expect-error`.
**Exercises:** 45 of them. The JavaScript half is 414–443 (`solutions/<id>.cjs`), the TypeScript half is 504–518 (`solutions/<id>.ts`). Titles have the form `Report policy N: <status>, min <M>, total`; the full ID-to-policy table is at the bottom of this doc.

## The problem in plain words

The input is the same flat array of `{id, amount, status, team}` records, and the policy is the same three decisions: who is eligible, which slice of the ordered eligible records forms the window, and what the window is rendered as.

Here the rendering is a summary object: `{count, total}`. `count` is how many records are in the window and `total` is the sum of their amounts.

The interesting word is *window*. It would be easy to read "return `{count, total}` for selected rows" as "count and sum everything that passed the filter", and on a small input the two often agree. They stop agreeing the moment the filter leaves more records than `take` allows, which is exactly what the supplied test data does: five records pass, and the take is four or two. The sort order then matters too, because a descending sort and an ascending sort select different records to add up.

So this shape is a test of reading order: filter, sort, cut, *then* aggregate.

## The contract you must honour

Taken from `tests/414.cjs` and `tests/504.cjs`; every test in the track uses the same four cases.

- `solve(input)` takes the array directly. Each case clones it with `structuredClone` and afterwards asserts `assert.deepEqual(input, before, 'Input must not mutate')`.
- The return value is an object with exactly the own properties `count` and `total`. `assert` is `require('node:assert/strict')`, so an extra property such as `rows` or `average` fails the comparison.
- Empty input returns `{"count":0,"total":0}`, not `{"count":0,"total":null}` and not `[]`. Case 2 asserts this in all 45 total exercises.
- The sum of an empty window is `0`. If you fold with `reduce` you must pass the initial value: `reduce((s, r) => s + r.amount)` with no seed throws `TypeError: Reduce of empty array with no initial value` on case 2.
- `count` is the window length, so it is capped by `take` and can be smaller when fewer records qualify. `tests/504.cjs` case 3 is a single record and asserts `{"count":0,"total":0}` — skip 1 leaves nothing.
- Cases 1 and 4 are the same five records in opposite order and assert the same result, so ordering comes from your comparator.
- For 504–518 the exported signature must stay exactly `export function solve(input: readonly {id:string;amount:number;status:'open'|'closed';team:string}[]): {count:number;total:number}`.

## Approach

1. **Filter** on `record.amount >= M`, plus `record.status === '<status>'` when the policy names one.
2. **Copy** each survivor with `{...record}`, so the stages below never hold the caller's objects.
3. **Sort** the copies: `left.amount - right.amount` for ascending or `right.amount - left.amount` for descending, falling through to an id comparison when the amounts tie.
4. **Cut** the window with `slice(skip, skip + take)`.
5. **Aggregate** the window: `count` is `selected.length`, `total` is the sum of `record.amount` over `selected`. A `for…of` accumulator and `selected.reduce((sum, r) => sum + r.amount, 0)` are the same computation; the readable references use the loop so the seed of `0` is impossible to forget.

O(n) to filter and copy, O(k log k) to sort the k survivors, O(take) to add up the window.

## Worked example — 414 Report policy 31: any, min 0, total

Policy: status any, `amount >= 0`, sort ascending, skip 0, take 4.

**Case 1, the first input in `tests/414.cjs`:**

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
| filter `amount >= 0` | all five survive; "status any" means status is never read |
| copy | five spread copies |
| sort ascending | `a 5`, `b 15`, `c 25`, `d 35`, `e 45` |
| `slice(0, 4)` | `a 5`, `b 15`, `c 25`, `d 35` — `e` is cut |
| aggregate | `count` = 4, `total` = 5 + 15 + 25 + 35 = 80 |

The test asserts `{"count":4,"total":80}` on line 2. This is the case that separates "sum the window" from "sum everything eligible": summing all five would give 125.

Case 3 is the single record `{"id":"z","amount":0,…}` and asserts `{"count":1,"total":0}`. A total of `0` is a real answer here, not a missing one — another reason the empty-window result has to be `0` rather than `null`.

The reference, as `solutions/414.cjs` now reads:

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
  // Step 4: skip 0, take 4.
  const selected = candidates.slice(0, 4);
  // Step 5: count the selected rows and add up their amounts.
  let total = 0;
  for (const record of selected) {
    total += record.amount;
  }
  return { count: selected.length, total: total };
}
```

### The TypeScript twin — 504 Report policy 121: any, min 0, total

504 has the same status, the same minimum and the same ascending sort. Its window is skip 1, take 4, so `slice(1, 5)`: on case 1 it drops `a 5` and keeps `b`, `c`, `d`, `e`, giving `{"count":4,"total":120}` — the same count as 414 but a different total, because a different four records are in the window. On case 3 the single record is skipped and the assertion is `{"count":0,"total":0}`.

Its signature line, which must survive your rewrite byte for byte:

```ts
export function solve(input: readonly {id:string;amount:number;status:'open'|'closed';team:string}[]): {count:number;total:number} {
```

`readonly` on the parameter means the array type has no `sort`, `push` or `splice`, so the non-mutation rule is a compile error rather than a test failure. The return type `{count:number;total:number}` is an object type with exactly those two properties; returning an extra property from a fresh object literal is rejected by TypeScript's excess-property check as well as by the test.

`types/504.ts` is the fixture that pins the parameter type:

```ts
import {solve} from '../solutions/504';
const good=solve([]);void good;
// @ts-expect-error invalid status literal
solve([{id:'x',amount:1,status:'other',team:'t'}]);
// @ts-expect-error amount cannot be a string
solve([{id:'x',amount:'1',status:'open',team:'t'}]);
```

Read the second directive literally: the line below `// @ts-expect-error amount cannot be a string` is *required* to fail compilation. If you widened `amount` to `number|string`, that call would suddenly be legal, the directive would have nothing to suppress, and TypeScript would report `Unused '@ts-expect-error' directive` — a fresh error where there was none. `verify.cjs` runs `tsc -p mixed-data/tsconfig.json` over all of `solutions/`, `starters/` and `types/` before grading a single exercise, so that one edit turns the whole track red.

## Policy matrix — what changes between the variants

| Axis | Values | Where it lands in the code |
| --- | --- | --- |
| status | `any` | no status test; predicate is `record.amount >= M` alone |
| | `open` | `&& record.status === 'open'` |
| | `closed` | `&& record.status === 'closed'` |
| min | `0`, `10`, `20`, `30`, `40` | the literal in `record.amount >= M`; `>=` keeps a record sitting exactly on the minimum |
| sort | ascending | `left.amount - right.amount` |
| | descending | `right.amount - left.amount` |
| tie-break | always id ascending | `(left.id < right.id ? -1 : left.id > right.id ? 1 : 0)` |
| skip / take | see below | `slice(skip, skip + take)` |
| shape | always total | `{ count: selected.length, total: <sum over selected> }` |

Six sort/skip/take configurations are in play, each shared by a block of IDs:

| Sort | Skip | Take | `slice(…)` | IDs |
| --- | --- | --- | --- | --- |
| ascending | 0 | 4 | `slice(0, 4)` | 414–418, 424–428 |
| descending | 0 | 4 | `slice(0, 4)` | 419–423 |
| descending | 0 | 2 | `slice(0, 2)` | 429–433, 439–443 |
| ascending | 0 | 2 | `slice(0, 2)` | 434–438 |
| ascending | 1 | 4 | `slice(1, 5)` | 504–508, 514–518 |
| descending | 1 | 4 | `slice(1, 5)` | 509–513 |

The take of `2` blocks (429–443) are where the window/eligible distinction bites hardest: five records pass the `min 0` filter and only two are summed.

### Full lookup — every total exercise

| ID | Language | Status | Min | Sort | Skip | Take |
| --- | --- | --- | --- | --- | --- | --- |
| 414 | JS | any | 0 | asc | 0 | 4 |
| 415 | JS | any | 10 | asc | 0 | 4 |
| 416 | JS | any | 20 | asc | 0 | 4 |
| 417 | JS | any | 30 | asc | 0 | 4 |
| 418 | JS | any | 40 | asc | 0 | 4 |
| 419 | JS | any | 0 | desc | 0 | 4 |
| 420 | JS | any | 10 | desc | 0 | 4 |
| 421 | JS | any | 20 | desc | 0 | 4 |
| 422 | JS | any | 30 | desc | 0 | 4 |
| 423 | JS | any | 40 | desc | 0 | 4 |
| 424 | JS | open | 0 | asc | 0 | 4 |
| 425 | JS | open | 10 | asc | 0 | 4 |
| 426 | JS | open | 20 | asc | 0 | 4 |
| 427 | JS | open | 30 | asc | 0 | 4 |
| 428 | JS | open | 40 | asc | 0 | 4 |
| 429 | JS | open | 0 | desc | 0 | 2 |
| 430 | JS | open | 10 | desc | 0 | 2 |
| 431 | JS | open | 20 | desc | 0 | 2 |
| 432 | JS | open | 30 | desc | 0 | 2 |
| 433 | JS | open | 40 | desc | 0 | 2 |
| 434 | JS | closed | 0 | asc | 0 | 2 |
| 435 | JS | closed | 10 | asc | 0 | 2 |
| 436 | JS | closed | 20 | asc | 0 | 2 |
| 437 | JS | closed | 30 | asc | 0 | 2 |
| 438 | JS | closed | 40 | asc | 0 | 2 |
| 439 | JS | closed | 0 | desc | 0 | 2 |
| 440 | JS | closed | 10 | desc | 0 | 2 |
| 441 | JS | closed | 20 | desc | 0 | 2 |
| 442 | JS | closed | 30 | desc | 0 | 2 |
| 443 | JS | closed | 40 | desc | 0 | 2 |
| 504 | TS | any | 0 | asc | 1 | 4 |
| 505 | TS | any | 10 | asc | 1 | 4 |
| 506 | TS | any | 20 | asc | 1 | 4 |
| 507 | TS | any | 30 | asc | 1 | 4 |
| 508 | TS | any | 40 | asc | 1 | 4 |
| 509 | TS | any | 0 | desc | 1 | 4 |
| 510 | TS | any | 10 | desc | 1 | 4 |
| 511 | TS | any | 20 | desc | 1 | 4 |
| 512 | TS | any | 30 | desc | 1 | 4 |
| 513 | TS | any | 40 | desc | 1 | 4 |
| 514 | TS | open | 0 | asc | 1 | 4 |
| 515 | TS | open | 10 | asc | 1 | 4 |
| 516 | TS | open | 20 | asc | 1 | 4 |
| 517 | TS | open | 30 | asc | 1 | 4 |
| 518 | TS | open | 40 | asc | 1 | 4 |

## Pitfalls the tests are designed to catch

- **Summing the eligible records instead of the window.** On case 1 of 414 that gives `{"count":5,"total":125}` where the test asserts `{"count":4,"total":80}`. The prompt says "for selected rows", and "selected" means after the slice.
- **`reduce` with no initial value.** Case 2 is `[]`. `[].reduce((s, r) => s + r.amount)` throws `TypeError: Reduce of empty array with no initial value`, so the case fails as an exception rather than a wrong answer. Seed it with `0`.
- **Starting the accumulator at `''` or `undefined`.** `'' + 5` is `"5"` and `undefined + 5` is `NaN`; `assert.deepEqual` under `node:assert/strict` compares types, so `"80"` is not `80`.
- **Sorting the argument.** `input.sort(...)` reorders the caller's array; case 4 delivers the records in descending order so the reordering is visible, and `assert.deepEqual(input, before, 'Input must not mutate')` reports it.
- **`>` instead of `>=`.** The `min 0` exercises assert on a record with `amount: 0` in case 3.
- **Returning `{total, count}` with extra fields.** Strict deep equality compares own enumerable properties in both directions; a helpful `{count, total, rows}` fails.
- **Slicing before sorting.** The window is defined over the sorted order. Case 4 is case 1 shuffled, so windowing the input order gives a different answer on one of the two.
- **Loosening a TypeScript parameter type.** It converts a working `@ts-expect-error` into `Unused '@ts-expect-error' directive`, and the compiler gate runs before any test in the track.

## Try it yourself

1. Add an `average` to the report without changing `count` or `total`. What must it be when the window is empty, and which of the four test cases forces you to decide?
2. 434 and 439 differ only in sort direction — both are `closed, min 0, total` with skip 0 and take 2. Work out both answers for case 1 by hand, then check them against `tests/434.cjs` and `tests/439.cjs`.
3. Rewrite step 5 as a single `reduce` that produces the whole `{count, total}` object in one pass. Is it clearer? Does it still handle case 2?
4. In words: `count` is `selected.length`, never the number of records that passed the filter. Name one policy in the lookup table below where the two numbers are guaranteed equal for the supplied test data, and say why.
