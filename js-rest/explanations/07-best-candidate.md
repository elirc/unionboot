# Best candidate — js-rest 128–131

**What you practise:** finding the maximum in one pass while keeping every element that reaches it, so that four different tie-breaking policies can be served from the same scan.
**Prerequisites:** running-maximum loops; the difference between `>` and `>=`; throwing typed errors.
**Exercises:** 128: Best candidate with first ties, 129: Best candidate with last ties, 130: Best candidate with all ties, 131: Best candidate with error ties.

## The problem in plain words

The input is an array of `{id: string, score: number}`. You must report the candidate with the highest score — a leaderboard winner, a best bid, a top-ranked search result.

The interesting part is what happens when two candidates share the top score. Real systems answer this differently. A first-come-first-served auction picks the earliest bid. A last-write-wins cache picks the latest. A reporting tool lists everyone. A system that must not guess raises an error and asks a human.

"Policy" here is the tie rule. All four variants scan the array the same way; they differ only in what they do with the list of tied ids once the scan is over.

The shape that makes this easy is to keep not just the best score but the *ids that reached it*. Then "first" is the head of that list, "last" is its tail, "all" is the list itself, and "error" is a length check.

## The contract you must honour

Taken from `tests/128.cjs` through `tests/131.cjs`:

- The empty array asserts `null` for 128, 129 and 131, and `[]` for 130. The empty answer follows the return type, not the policy.
- `[{"id":"a","score":1},{"id":"b","score":2}]` — no tie — asserts `"b"` for 128, 129 and 131, and `["b"]` for 130.
- `[{"id":"a","score":2},{"id":"b","score":2}]` — a tie — asserts `"a"` for 128, `"b"` for 129, `["a","b"]` for 130, and for 131 `assert.throws(()=>solve(input), e=>e instanceof Error && e.message==="Tied score")`. The message is exactly `Tied score`.
- 130 returns an array of ids in input order; the other three return a single id string or `null`.
- Every case ends with `assert.deepEqual(input, before, 'Input must not mutate')` against a `structuredClone`, so the candidates may not be sorted in place.

## Approach

1. Handle the empty input before the loop, returning `null` (or `[]` for 130). This also guarantees the `-Infinity` seed below is always replaced.
2. Keep two running variables: `bestScore`, seeded with `-Infinity`, and `bestIds`, seeded with `[]`.
3. For each candidate:
   - if `candidate.score > bestScore`, a new record has been set: assign `bestScore` and **replace** `bestIds` with `[candidate.id]`;
   - else if `candidate.score === bestScore`, this candidate ties the record: **append** its id.
   - Otherwise it is below the record and contributes nothing.
4. After the loop, `bestIds` holds every top scorer in input order. Apply the policy: `bestIds[0]`, `bestIds[bestIds.length - 1]`, `bestIds`, or throw when `bestIds.length > 1`.

One pass, O(n), and the only allocation is the tied-id list, which is usually one element long.

Note why the check in step 3 is `>` and not `>=`. With `>=`, an equal score would *restart* the list instead of appending, and every tie would collapse to the last candidate — which happens to be right for 129 and wrong for the other three.

For 131, the tie can only be detected once every candidate has been seen: a second `a`-scoring candidate could still be beaten by a later, higher one. That is why the throw sits after the loop and not inside it.

## Worked example — 128 Best candidate with first ties

The first input in `tests/128.cjs` is `[]`. The guard returns `null` immediately, asserted on line 2.

The second case, on line 3, is `[{"id":"a","score":1},{"id":"b","score":2}]`:

| candidate | `score > bestScore`? | `score === bestScore`? | `bestScore` after | `bestIds` after |
| --- | --- | --- | --- | --- |
| — | — | — | `-Infinity` | `[]` |
| `a` (1) | `1 > -Infinity`, yes | — | `1` | `["a"]` |
| `b` (2) | `2 > 1`, yes | — | `2` | `["b"]` |

`bestIds` is `["b"]`, and `bestIds[0]` is `"b"` — asserted as `assert.deepEqual(solve(input),"b")`. The same scan gives `"b"` for 129 (the last of one element) and `["b"]` for 130, and 131 does not throw because the list has length 1.

The third case, on line 4, is the tie `[{"id":"a","score":2},{"id":"b","score":2}]`:

| candidate | branch taken | `bestScore` after | `bestIds` after |
| --- | --- | --- | --- |
| — | — | `-Infinity` | `[]` |
| `a` (2) | `2 > -Infinity`: new record | `2` | `["a"]` |
| `b` (2) | `2 > 2` is false; `2 === 2`: tie, append | `2` | `["a","b"]` |

Now the four policies read the same `["a","b"]` differently: 128 takes index 0 and returns `"a"`; 129 takes the last element and returns `"b"`; 130 returns the array; 131 sees `length > 1` and throws `Error("Tied score")`. Those are exactly the four assertions on line 4 of the four test files.

The reference solution, as it now reads in `solutions/128.cjs`:

```js
function solve(input) {
  if (input.length === 0) {
    return null;
  }
  let bestScore = -Infinity;
  let bestIds = [];
  for (const candidate of input) {
    if (candidate.score > bestScore) {
      bestScore = candidate.score;
      bestIds = [candidate.id];
    } else if (candidate.score === bestScore) {
      bestIds.push(candidate.id);
    }
  }
  return bestIds[0];
}
```

## Policy matrix — what changes between the variants

| ID | Variant | What differs in the prompt | What differs in the code |
| --- | --- | --- | --- |
| 128 | first ties | "using first tie policy. Empty returns null." | `return bestIds[0]` |
| 129 | last ties | "using last tie policy. Empty returns null." | `return bestIds[bestIds.length - 1]` |
| 130 | all ties | "Return array of ids … Empty returns []." | empty guard returns `[]`; `return bestIds` |
| 131 | error ties | "Throw Error(\"Tied score\") if top score is shared." | `if (bestIds.length > 1) throw new Error("Tied score")` before `return bestIds[0]` |

## Pitfalls the tests are designed to catch

- **Using `>=` in the record check.** It restarts the tied list on every equal score, so `bestIds` never holds more than one id. 128's third case then returns `"b"` instead of `"a"`, 130 returns `["b"]` instead of `["a","b"]`, and 131 never throws.
- **Throwing inside the loop in 131.** A second candidate at the current best is not yet a proven tie — a later candidate may beat them both. Throwing early would reject inputs whose top score turns out to be unique.
- **Returning `[]` from 128, 129 or 131 for the empty input.** Those three assert `null`. Conversely 130 asserts `[]`, not `null`; the empty answer matches the return type.
- **Sorting the candidates by score.** `input.sort(...)` fails `assert.deepEqual(input, before, 'Input must not mutate')`, and a sorted copy still needs a tie rule, so it buys nothing.
- **Seeding `bestScore` with `0`.** Every candidate could have a negative score, in which case nothing ever beats the seed and `bestIds` stays empty. The visible data is positive, so this bug hides; `-Infinity` plus the empty guard is the honest shape.
- **Returning the candidate object instead of the id.** `assert.deepEqual(solve(input),"b")` compares against a string.
- **Throwing a string in 131.** The predicate is `e instanceof Error && e.message==="Tied score"`; `throw "Tied score"` fails the first half.

## Checking your work

Run one exercise at a time:

```text
node js-rest/verify.cjs --id=128
```

Three things to check by eye first:

- Is the record test `>` and the tie test `===`? `>=` on the record test collapses every tie and breaks three of the four exercises.
- Does the empty guard return the same *type* as the success path — `null` for 128, 129 and 131, `[]` for 130?
- In 131, is the length check after the loop rather than inside it?

A useful self-test the suite does not include:

```js
solve([{id: 'a', score: 1}, {id: 'b', score: 5}, {id: 'c', score: 5}, {id: 'd', score: 2}]);
```

The tied list should be `["b","c"]`, so 128 gives `"b"`, 129 gives `"c"`, 130 gives `["b","c"]` and 131 throws. A solution that throws early in 131 would already have thrown on a two-element input; this one proves the tie is real only at the end.

## Try it yourself

1. Add a `lowest` variant that returns the minimum-score candidate under the first-tie rule. How much of the scan changes?
2. Make the tie rule a second sort key: among tied scores, pick the lexically smallest id. Does the one-pass shape still work?
3. Rewrite 130 with `filter` after finding the maximum with `reduce`. Count the passes over the array, and say when that matters.
4. In words: explain why 131 has to wait until the end of the scan to decide there is a tie, and construct an input where an early throw would be wrong.
