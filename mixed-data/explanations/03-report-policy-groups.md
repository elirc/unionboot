# Report policy, groups shape — mixed-data 444–473

**What you practise:** the filter/copy/sort/cut pipeline again, finishing with a grouped aggregate — and keeping two different orderings straight, because the rows are ordered by amount but the result is ordered by team.
**Prerequisites:** [01 Report policy, rows](01-report-policy-rows.md) for the pipeline and [02 Report policy, total](02-report-policy-total.md) for aggregation; `Object.entries`; the `??` operator; for the TypeScript half, `Record<string, number>` and what `noUncheckedIndexedAccess` does to an index read.
**Exercises:** 30 of them. The JavaScript half is 444–453 (`solutions/<id>.cjs`), the TypeScript half is 454–473 (`solutions/<id>.ts`). Titles have the form `Report policy N: <status>, min <M>, groups`; the full ID-to-policy table is at the bottom of this doc.

## The problem in plain words

The input is the same flat array of `{id, amount, status, team}` records. The policy is the same three decisions. This shape renders the window as a grouped total: an array of `[team, totalAmount]` pairs, one pair per team that appears in the window, sorted by team name.

Two orderings live in the same function and they are not the same ordering. The amount sort decides *which* records are in the window — it runs before the slice and it is the only thing the skip and take see. The team sort decides how the finished pairs are laid out, and it runs at the very end over data that no longer has amounts attached to individual records. Mixing them up is the characteristic mistake of this shape: sorting the pairs by total, or emitting the teams in the order the records happened to be visited.

The word "only" in the prompt is also load-bearing: "grouping only selected rows". A team whose every record was cut by the slice does not appear in the output at all, not even with a total of `0`.

## The contract you must honour

Taken from `tests/444.cjs` and `tests/454.cjs`; every test in the track uses the same four cases.

- `solve(input)` takes the array directly. Each case clones it with `structuredClone` and afterwards asserts `assert.deepEqual(input, before, 'Input must not mutate')`.
- The return value is an array of two-element arrays: `[team, totalAmount]`. Not an object, not a `Map`. `tests/444.cjs` case 1 asserts `[["blue",15],["red",30]]`.
- The pairs are ordered by team name ascending, compared with `<` and `>` on strings — UTF-16 code-unit order. In case 1 that puts `"blue"` before `"red"` even though `red` has the larger total, which is the assertion that catches a sort-by-total mistake.
- Empty input returns `[]`. Case 2 asserts this in all 30 groups exercises.
- A team present in the window always appears, even when its total is `0`. Case 3 is the single record `{"id":"z","amount":0,"status":"open","team":"solo"}` and asserts `[["solo",0]]`.
- Cases 1 and 4 hold the same five records in opposite input orders and assert the same output, so neither the window nor the pair order may depend on input order.
- `assert` is `require('node:assert/strict')`, so the pairs are compared element by element with strict deep equality: `["blue", 15]` is not equal to `["blue", "15"]`.
- For 454–473 the exported signature must stay exactly `export function solve(input: readonly {id:string;amount:number;status:'open'|'closed';team:string}[]): [string,number][]`. That return type is an array of two-element *tuples*, which is what makes destructuring `([leftTeam], [rightTeam])` in the final comparator type-check.

## Approach

1. **Filter** on `record.amount >= M`, plus `record.status === '<status>'` when the policy names one.
2. **Copy** each survivor with `{...record}` so no later stage holds the caller's objects.
3. **Sort** the copies by amount — ascending or descending per the policy — with the id comparison as the tie-break.
4. **Cut** the window with `slice(skip, skip + take)`. Every groups exercise has skip 0, so the slice is `slice(0, take)`.
5. **Bucket** the window. Walk it once and add each amount into an accumulator keyed by team: `totalByTeam[record.team] = (totalByTeam[record.team] ?? 0) + record.amount`. The `?? 0` is what seeds a team the first time it is seen; `undefined + 5` would be `NaN`.
6. **Order the pairs.** `Object.entries(totalByTeam)` gives `[team, total]` pairs in insertion order — the order the teams first appeared in the window. Sort that array by team name to get the required order.

One pass to filter, one to copy, O(k log k) to sort the survivors, one pass over the window, and O(g log g) to sort the g distinct teams.

A note on the accumulator. The references use a plain object rather than a `Map`. That is safe here because the prompts guarantee valid records and the tests only ever use the teams `red`, `blue` and `solo`; a team literally named `__proto__` would be written to the prototype rather than stored as data. A `Map` plus `[...map]` would produce the same pairs and would not have that hole. The reference behaviour is left exactly as it was — this is a property of the supplied data, not a bug the tests expose.

## Worked example — 444 Report policy 61: any, min 0, groups

Policy: status any, `amount >= 0`, sort ascending, skip 0, take 3.

**Case 1, the first input in `tests/444.cjs`:**

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
| sort ascending | `a 5 red`, `b 15 blue`, `c 25 red`, `d 35 blue`, `e 45 red` |
| `slice(0, 3)` | `a 5 red`, `b 15 blue`, `c 25 red` — `d` and `e` are cut |
| bucket | `red` → 5, then `blue` → 15, then `red` → 5 + 25 = 30 |
| `Object.entries` | `[["red",30],["blue",15]]` — insertion order, `red` first because `a` was visited first |
| sort by team | `[["blue",15],["red",30]]` |

The test asserts `[["blue",15],["red",30]]` on line 2. Two things are worth pausing on. `blue` total 15 comes before `red` total 30, so the pairs are not in total order. And `d 35 blue` was cut by the slice, so `blue` reports 15 rather than 50 — the grouping really is over the window only.

Case 4 is those five records in reverse input order and asserts the same pairs: the amount sort rebuilds the window and the team sort rebuilds the layout.

The reference, as `solutions/444.cjs` now reads:

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
  // Step 4: skip 0, take 3.
  const selected = candidates.slice(0, 3);
  // Step 5: add each selected amount into its team bucket.
  const totalByTeam = {};
  for (const record of selected) {
    totalByTeam[record.team] = (totalByTeam[record.team] ?? 0) + record.amount;
  }
  // Step 6: hand back [team, totalAmount] pairs in team-name order.
  const pairs = Object.entries(totalByTeam);
  pairs.sort(([leftTeam], [rightTeam]) =>
    leftTeam < rightTeam ? -1 : leftTeam > rightTeam ? 1 : 0);
  return pairs;
}
```

### The TypeScript twin — 454 Report policy 71: open, min 0, groups

454 shares the minimum, the ascending sort and the window (skip 0, take 3) with 444, and adds a status filter: only `open` records qualify. On case 1 the open records are `a 5 red`, `c 25 red` and `e 45 red` — exactly three, so the slice cuts nothing — and they are all on `red`, giving `[["red",75]]`, which is what `tests/454.cjs` asserts. The closed records `b` and `d` are gone before the sort ever sees them, which is why `blue` is absent rather than zero.

Its signature line, which must survive your rewrite byte for byte:

```ts
export function solve(input: readonly {id:string;amount:number;status:'open'|'closed';team:string}[]): [string,number][] {
```

The TypeScript body differs from the JavaScript one in a single annotation:

```ts
  const totalByTeam: Record<string, number> = {};
```

`mixed-data/tsconfig.json` sets `noUncheckedIndexedAccess: true`, so reading `totalByTeam[record.team]` has type `number | undefined` even though the record type says `number`. The compiler is modelling the fact that an arbitrary string key may be absent. That makes `?? 0` mandatory rather than defensive: without it the `+` is an error, not just a runtime `NaN` risk. The same config sets `"types": []`, so no Node globals exist in a `.ts` file here — `require`, `process` and `__dirname` will not compile.

`types/454.ts` is the fixture that pins the parameter type:

```ts
import {solve} from '../solutions/454';
const good=solve([]);void good;
// @ts-expect-error invalid status literal
solve([{id:'x',amount:1,status:'other',team:'t'}]);
// @ts-expect-error amount cannot be a string
solve([{id:'x',amount:'1',status:'open',team:'t'}]);
```

The line `// @ts-expect-error invalid status literal` says the call under it must fail to compile, and it does because `'other'` is not assignable to `'open'|'closed'`. Relax the parameter to `status:string` and that call becomes legal; the directive then has nothing to suppress and TypeScript reports `Unused '@ts-expect-error' directive`. Since `verify.cjs` runs `tsc -p mixed-data/tsconfig.json` over every `.ts` file in `solutions/`, `starters/` and `types/` before it grades anything, one loosened annotation fails all 135 exercises with a compiler error and no per-ID result.

## Policy matrix — what changes between the variants

| Axis | Values | Where it lands in the code |
| --- | --- | --- |
| status | `any` | no status test; predicate is `record.amount >= M` alone |
| | `open` | `&& record.status === 'open'` |
| | `closed` | `&& record.status === 'closed'` |
| min | `0`, `10`, `20`, `30`, `40` | the literal in `record.amount >= M`; `>=` keeps a record exactly on the minimum |
| sort | ascending | `left.amount - right.amount` |
| | descending | `right.amount - left.amount` |
| tie-break | always id ascending | `(left.id < right.id ? -1 : left.id > right.id ? 1 : 0)` |
| skip / take | see below; skip is `0` in all 30 | `slice(0, take)` |
| shape | always groups | bucket by `team`, then `Object.entries` sorted by team name |

Four sort/skip/take configurations, each shared by a block of IDs:

| Sort | Skip | Take | `slice(…)` | IDs |
| --- | --- | --- | --- | --- |
| ascending | 0 | 3 | `slice(0, 3)` | 444–448, 454–458 |
| descending | 0 | 3 | `slice(0, 3)` | 449–453 |
| descending | 0 | 4 | `slice(0, 4)` | 459–463, 469–473 |
| ascending | 0 | 4 | `slice(0, 4)` | 464–468 |

The team-name comparator never changes. Neither does the bucketing loop. Across all 30 exercises the only edits are the filter predicate, the sign of the amount comparison and the second argument to `slice`.

### Full lookup — every groups exercise

| ID | Language | Status | Min | Sort | Skip | Take |
| --- | --- | --- | --- | --- | --- | --- |
| 444 | JS | any | 0 | asc | 0 | 3 |
| 445 | JS | any | 10 | asc | 0 | 3 |
| 446 | JS | any | 20 | asc | 0 | 3 |
| 447 | JS | any | 30 | asc | 0 | 3 |
| 448 | JS | any | 40 | asc | 0 | 3 |
| 449 | JS | any | 0 | desc | 0 | 3 |
| 450 | JS | any | 10 | desc | 0 | 3 |
| 451 | JS | any | 20 | desc | 0 | 3 |
| 452 | JS | any | 30 | desc | 0 | 3 |
| 453 | JS | any | 40 | desc | 0 | 3 |
| 454 | TS | open | 0 | asc | 0 | 3 |
| 455 | TS | open | 10 | asc | 0 | 3 |
| 456 | TS | open | 20 | asc | 0 | 3 |
| 457 | TS | open | 30 | asc | 0 | 3 |
| 458 | TS | open | 40 | asc | 0 | 3 |
| 459 | TS | open | 0 | desc | 0 | 4 |
| 460 | TS | open | 10 | desc | 0 | 4 |
| 461 | TS | open | 20 | desc | 0 | 4 |
| 462 | TS | open | 30 | desc | 0 | 4 |
| 463 | TS | open | 40 | desc | 0 | 4 |
| 464 | TS | closed | 0 | asc | 0 | 4 |
| 465 | TS | closed | 10 | asc | 0 | 4 |
| 466 | TS | closed | 20 | asc | 0 | 4 |
| 467 | TS | closed | 30 | asc | 0 | 4 |
| 468 | TS | closed | 40 | asc | 0 | 4 |
| 469 | TS | closed | 0 | desc | 0 | 4 |
| 470 | TS | closed | 10 | desc | 0 | 4 |
| 471 | TS | closed | 20 | desc | 0 | 4 |
| 472 | TS | closed | 30 | desc | 0 | 4 |
| 473 | TS | closed | 40 | desc | 0 | 4 |

## Pitfalls the tests are designed to catch

- **Sorting the pairs by total.** Case 1 of 444 asserts `[["blue",15],["red",30]]`. Sorting by total descending gives `[["red",30],["blue",15]]` and fails; sorting by total ascending happens to agree here, which is why you should read the prompt rather than the example.
- **Returning `Object.entries` unsorted.** Insertion order depends on which record the window visited first. For case 1 that is `red` first, so the unsorted result is `[["red",30],["blue",15]]` — wrong. Case 4 would produce a different wrong answer again.
- **Grouping before the slice.** That gives `blue` a total of 50 on case 1 instead of 15, and adds nothing else visible, so it is easy to miss until you compare the numbers.
- **Grouping the eligible set and then slicing the pairs.** `slice(0, 3)` over pairs means "three teams", not "three records" — a different report entirely.
- **Missing the `?? 0` seed.** `undefined + 5` is `NaN`, and `["red", NaN]` fails deep equality against `["red", 30]`. Under `noUncheckedIndexedAccess` the TypeScript half will not even compile without the seed.
- **Dropping a zero total.** Case 3 asserts `[["solo",0]]`. A filter such as `pairs.filter(([, total]) => total)` to hide "empty" teams removes it.
- **Sorting the argument.** `input.sort(...)` reorders the caller's array and case 4 makes that visible; `assert.deepEqual(input, before, 'Input must not mutate')` reports it. In the TypeScript half the `readonly` parameter blocks it at compile time.
- **Returning a `Map` or an object.** The assertion compares against an array of arrays. `Object.fromEntries` output is not equal to `[["blue",15],["red",30]]`.
- **Loosening a TypeScript parameter type.** Covered above: it turns a good `@ts-expect-error` into `Unused '@ts-expect-error' directive` and takes the whole track down with it.

## Try it yourself

1. Change 444 to report `[team, count]` instead of `[team, totalAmount]`. Which of the six steps changes, and does the pair sort change at all?
2. Swap the plain-object accumulator for a `Map` and `[...map]`. Confirm the output is identical on all four cases, then explain what a team named `__proto__` does to each version.
3. 449 differs from 444 only in sort direction. Work out its case 1 answer by hand — which three records are in the window, and what does each team total? — then check it against `tests/449.cjs`.
4. In words: the id tie-break in step 3 never fires on the supplied test data, because no two records share an amount. Describe an input on which removing it would change the answer for 444, and say why the prompt still requires it.
