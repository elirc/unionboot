# mixed-data explanations — 384 to 518

135 exercises, one problem. Every exercise in this track is the same report pipeline — filter, copy, sort, cut, shape — with different arguments. There is no second algorithm hiding anywhere in the set.

Because of that, this directory holds four documents rather than 135. The three family docs are split by the only axis that changes the code's *structure*, the output shape; the other axes change arguments and are covered by a table inside each doc.

## The three-axis design

Each exercise's title is `Report policy N: <status>, min <M>, <shape>` and its prompt is one sentence that spells out four knobs.

| Axis | Values | Effect |
| --- | --- | --- |
| status | `any`, `open`, `closed` | whether the filter predicate tests `record.status`, and against what |
| min | `0`, `10`, `20`, `30`, `40` | the literal in `record.amount >= M`; the comparison is always `>=` |
| shape | `rows`, `total`, `groups` | what the selected window is rendered as — the one axis that changes the body's structure |
| sort / skip / take | ascending or descending; skip `0` or `1`; take `2`, `3` or `4` | the comparator's sign and the two arguments to `slice(skip, skip + take)` |

3 statuses × 5 minimums × 3 shapes is 45 distinct policy strings, and each of those appears with a small number of sort/skip/take configurations, giving 135 exercises. The tie-break — id ascending in UTF-16 code-unit order — never varies.

The two axes to keep separate in your head are the *window* and the *report*. Filtering decides who is eligible; sorting and slicing decide which of the eligible records are in the window; the shape describes only the window. Summing or grouping the eligible set instead of the window is the single most common wrong answer in this track, and the test data is chosen so that the two differ.

## The JavaScript / TypeScript split

| IDs | Language | Files |
| --- | --- | --- |
| 384–453 | JavaScript | `starters/<id>.cjs`, `solutions/<id>.cjs` |
| 454–518 | TypeScript | `starters/<id>.ts`, `solutions/<id>.ts`, plus `types/<id>.ts` |

Tests are always `tests/<id>.cjs`, in CommonJS, regardless of the exercise's language: the verifier compiles the TypeScript to `.build/` first and grades the emitted JavaScript. Every test file in the track uses the same four cases — five mixed records, an empty array, a single record with `amount: 0`, and those same five records in reverse order — so if you can predict the four results you have understood the policy.

The two halves overlap in policy, not in language. 384–453 cover 70 policies in JavaScript; 454–518 cover 65 more in TypeScript, including all the skip-1 windows. The TypeScript exercises are not harder problems — they are the same problems with the contract written down in types.

## The `tsc` gate

`mixed-data/verify.cjs` begins by running `tsc -p mixed-data/tsconfig.json` over every `.ts` file under `solutions/`, `starters/` and `types/`. If the compiler reports anything, the verifier prints the compiler output and exits `1` before running a single test — including when you asked for one `--id`. Budget 20–60 seconds for that step on every invocation, and prefer one full-track run to several single-ID runs.

The config is strict, and three settings matter while you work:

- `noUncheckedIndexedAccess` — reading `someRecord[key]` gives `T | undefined`, so a `?? 0` before arithmetic is required by the compiler, not merely prudent.
- `exactOptionalPropertyTypes` — an optional property cannot be set to `undefined` explicitly.
- `"types": []` — no Node type definitions are loaded. `require`, `process`, `__dirname` and `console` do not exist in a `.ts` file here.

`types/<id>.ts` is a negative fixture. It imports `solve` from your solution and then makes two calls that are each preceded by `@ts-expect-error`: one passing an invalid `status` literal and one passing a string `amount`. Those lines must *fail* to compile. Widening a parameter type makes them succeed, at which point TypeScript reports `Unused '@ts-expect-error' directive` and the whole track goes red. Keep every exported signature exactly as generated.

## The four docs

| Doc | Shape | IDs | Count | What it adds |
| --- | --- | --- | --- | --- |
| [01 Report policy, rows](01-report-policy-rows.md) | `rows` | 384–413 (JS), 474–503 (TS) | 60 | The pipeline itself, plus projecting to `{id, amount}` |
| [02 Report policy, total](02-report-policy-total.md) | `total` | 414–443 (JS), 504–518 (TS) | 45 | Aggregating to `{count, total}` over the window only |
| [03 Report policy, groups](03-report-policy-groups.md) | `groups` | 444–453 (JS), 454–473 (TS) | 30 | Bucketing by `team`, then `[team, totalAmount]` pairs sorted by team |
| this file | — | 384–518 | 135 | The axes, the language split, the compiler gate |

Each doc contains a compact axis table, a table of the sort/skip/take configurations with the IDs that share them, and a full ID-to-policy lookup so you can find any exercise's four knobs without opening its prompt.

## Suggested order

1. Read **01 rows** and solve 384. It is the shortest policy in the track: no status test, minimum `0`, skip `0`.
2. Solve 389 (the same policy, descending) and 394 (the same policy, `open` only) to see one axis move at a time.
3. Read **02 total** and solve 414, then 419 — the same policy with the sort flipped, so a different four of the five records are summed. Then 434, where the take drops to two and the window/eligible distinction becomes unmissable.
4. Read **03 groups** and solve 444, then 449.
5. Move to the TypeScript half at 454. The problem is one you have already solved; spend the time on the signature, the fixture and the compiler messages.
6. Work the skip-1 windows last: 474 onwards. `slice(skip, skip + take)` is the only new idea, and it is the one place `slice(skip, take)` stops looking correct.

## Running the verifier

```text
node mixed-data/verify.cjs                 # all 135, about a minute including the compiler gate
node mixed-data/verify.cjs --id=384        # one exercise, same compiler gate first
node mixed-data/verify.cjs --starters      # grade the starters instead of the solutions
```

Blank starters compile but throw `Error: TODO exercise <id>` at runtime, by design. The verifier prints one `PASS <id> <title>` or `FAIL <id> <stack>` line per exercise and ends with a count.
