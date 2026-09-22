# Revision event replay — js-capstones 3440

**What you practise:** replaying an event log safely — validating before deduplicating, deduplicating idempotently, and checking an invariant after every step rather than only at the end.
**Prerequisites:** `Number.isSafeInteger`; `Map` for keyed deduplication; `Array.prototype.sort` with a numeric comparator; `Array.prototype.entries` for index-plus-value iteration.
**Exercises:** 3440: Replay idempotent ordered account events.

## The problem in plain words

An account starts at a known balance. A set of events is delivered, each one a `{id, revision, delta}` record: a unique identifier for the event, its position in the sequence, and the amount it changes the balance by. The events may arrive out of order, and the same event may arrive more than once, because delivery is at-least-once.

Your job is to replay them and report the final state.

*Idempotent* is the key word. Receiving the same event twice must have the same effect as receiving it once — but only when the two copies really are the same event. If two records share an ID and disagree about the revision or the delta, that is not a redelivery, it is a bug or an attack, and it must be rejected.

The revisions must form the exact sequence `1..N` with no gaps and no repeats. A gap means an event was lost; a repeat means two different events claim the same position. Either way the log cannot be trusted, so the whole call throws.

Finally, the account may never be overdrawn, and the balance may never leave the safe-integer range — at any point during the replay, not merely at the end. A sequence that dips below zero and comes back up is still invalid.

The prompt fixes the order of the three stages, and that ordering is testable: "Validate every event before deduplicating."

## The contract you must honour

Taken from `tests/3440.cjs` and `prompts/3440.txt`:

- The signature is `solve(initial, events)` and the return value is `{balance, revision, applied}`, where `revision` is `N`, the number of unique events, and `applied` is the array of IDs in revision order.
- `solve(10, [b, a, a])` with `a = {id:'a',revision:1,delta:5}` and `b = {id:'b',revision:2,delta:-3}` asserts `{balance:12, revision:2, applied:['a','b']}`. The input order is `b` first; the output order is by revision. The repeated `a` is ignored, not applied twice — had it been applied twice the balance would be 17.
- `solve(0, [])` asserts `{balance:0, revision:0, applied:[]}`. An empty log is valid.
- `solve(0, [{id:'a',revision:2,delta:0}])` throws: one event whose revision is 2, so the sequence is not `1..1`.
- `solve(0, [a, {id:'b',revision:1,delta:0}])` throws: two distinct IDs both claiming revision 1.
- `solve(0, [a, {id:'a',revision:1,delta:6}])` throws: the same ID with a different delta.
- `solve(0, [{id:'a',revision:1,delta:-1},{id:'b',revision:2,delta:1}])` throws: the balance dips to `-1` before returning to `0`.
- `solve(Number.MAX_SAFE_INTEGER, [a])` throws: adding 5 leaves the safe-integer range.
- `solve(-1, [])` throws: the opening balance is negative.
- `solve(0, [{id:'',revision:1,delta:0}])` throws: an empty ID.
- `solve(0, [{id:'x',revision:1,delta:0.5}])` throws: a fractional delta.
- Inputs must not change. The first case freezes both the array and the two event objects.

Note that every failing case is asserted with a bare `assert.throws(fn)`, so the error *type* and *message* are not pinned. The reference uses `Error` with descriptive messages; you are free to choose your own, and should keep them descriptive.

## Approach

**Stage 1 — validate.** Check `initial` first: a nonnegative safe integer. Then walk `events` in input order and check each record: it must exist, its `id` must be a nonempty string, its `revision` a safe integer at least 1, its `delta` a safe integer. Throw on the first failure.

**Stage 2 — deduplicate, inside the same walk.** Look the ID up in a `Map`. If it is already there and either the revision or the delta differs, throw. If it is already there and both match, skip it — that is the idempotent redelivery. If it is not there, store it. The first sighting is the one kept; the map entry is never overwritten.

Validation and deduplication share one loop, but validation happens *first within each iteration*. That is what makes a malformed duplicate throw rather than being quietly skipped.

**Stage 3 — order and apply.** Sort the unique events by revision. Walk them with an index; the event at index `i` must carry revision `i + 1`, or the log has a gap or a collision. Add its delta to the running balance, check the balance is still a nonnegative safe integer, and record the ID.

The single positional check is enough to prove the whole `1..N` property. There are `N` distinct IDs, each revision is at least 1, the list is sorted ascending, and every revision equals its index plus one — so the revisions are exactly `1, 2, …, N`. No separate gap scan is needed.

## Worked example — 3440 Replay idempotent ordered account events

Take the example from the prompt, which is the first assertion in the test file: `initial = 10`, `events = [b, a, a]` where `a = {id:'a',revision:1,delta:5}` and `b = {id:'b',revision:2,delta:-3}`.

Stage 1 and 2, walking the input in order:

| input position | event | validation | `unique.get(id)` | action | `unique` after |
| --- | --- | --- | --- | --- | --- |
| 0 | `b` | id `'b'` nonempty, revision `2` ≥ 1, delta `-3` safe | absent | store | `{b}` |
| 1 | `a` | id `'a'` nonempty, revision `1` ≥ 1, delta `5` safe | absent | store | `{b, a}` |
| 2 | `a` again | passes the same checks | present, revision `1` and delta `5` both match | skip | `{b, a}` |

Stage 3. `[...unique.values()]` is `[b, a]` in insertion order; sorting by revision gives `[a, b]`.

| index | event | revision check | balance before | `+ delta` | balance after | valid? | `applied` |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | `a` | `1 === 0 + 1` ✓ | `10` | `+5` | `15` | nonnegative safe integer ✓ | `['a']` |
| 1 | `b` | `2 === 1 + 1` ✓ | `15` | `-3` | `12` | ✓ | `['a','b']` |

Return `{balance: 12, revision: 2, applied: ['a','b']}`, asserted on line 5 of the test file.

Two things to notice. The input order was `b, a`, and the output order is `a, b` — the revision decides, not arrival. And the duplicate `a` contributed nothing; applying it twice would have produced `17`.

Contrast with the dip case on line 10: `initial = 0`, events with deltas `-1` at revision 1 and `+1` at revision 2. The final balance would be `0`, which is legal — but after the first step the balance is `-1`, and the check inside the loop catches it there.

The reference solution, as it now reads in `solutions/3440.cjs`:

```js
function solve(initial, events) {
  if (!Number.isSafeInteger(initial) || initial < 0) {
    throw Error('Invalid initial balance');
  }
  const unique = new Map();
  for (const event of events) {
    const valid =
      event &&
      typeof event.id === 'string' &&
      event.id.length > 0 &&
      Number.isSafeInteger(event.revision) &&
      event.revision >= 1 &&
      Number.isSafeInteger(event.delta);
    if (!valid) {
      throw Error('Invalid event');
    }
    const firstSighting = unique.get(event.id);
    if (
      firstSighting &&
      (firstSighting.revision !== event.revision || firstSighting.delta !== event.delta)
    ) {
      throw Error('Conflicting event ID');
    }
    if (!firstSighting) {
      unique.set(event.id, event);
    }
  }
  const ordered = [...unique.values()].sort((a, b) => a.revision - b.revision);
  const applied = [];
  let balance = initial;
  for (const [index, event] of ordered.entries()) {
    if (event.revision !== index + 1) {
      throw Error('Revision gap or collision');
    }
    balance += event.delta;
    if (!Number.isSafeInteger(balance) || balance < 0) {
      throw Error('Invalid balance');
    }
    applied.push(event.id);
  }
  return { balance, revision: ordered.length, applied };
}
```

## Variations you could build

| Variation | What would change in the code |
| --- | --- |
| Allow the balance to go negative but cap it at a floor | the per-step check becomes a comparison with the floor; the safe-integer half stays |
| Return the balance after each step, as a history | a second array filled alongside `applied` |
| Allow revisions to start at an arbitrary base `r0` | the positional check becomes `event.revision !== index + r0`, with `r0` read from the first sorted event |
| Apply events transactionally, returning the last good state instead of throwing | the throw in stage 3 becomes a `break`, and the return reports how many were applied |

## Pitfalls the tests are designed to catch

- **Deduplicating before validating.** `solve(0, [a, {id:'a',revision:1,delta:6}])` must throw. A version that skips any repeated ID without comparing its fields would silently accept it.
- **Overwriting the map entry on a repeat.** Last-write-wins turns a conflicting redelivery into a silent change of history.
- **Checking the balance only at the end.** The dip case ends at `0` and must still throw.
- **Using `Number.isInteger` instead of `Number.isSafeInteger`.** `solve(Number.MAX_SAFE_INTEGER, [a])` must throw, and `9007199254740996` is an integer as far as `Number.isInteger` is concerned.
- **Sorting `events` in place.** The first case freezes the array, so `events.sort(...)` throws a `TypeError` under `'use strict'` — a failure, but for the wrong reason. Sort the extracted values instead.
- **Checking only that revisions are unique, or only that they are contiguous.** The positional check covers both at once; either check alone lets one of the two throwing cases through.
- **Accepting a falsy but non-empty id, or rejecting a `delta` of `0`.** `''` must be rejected and `0` must be accepted; the test has a case for each.
- **Reporting `revision` as the largest revision seen rather than the count.** They are equal here precisely because the sequence is `1..N` — but computing it as `ordered.length` is what makes the empty-log case return `0` rather than `-Infinity`.

## Try it yourself

1. Add a `maxDelta` guard rejecting any single event whose delta exceeds it. Which stage does it belong to, and does that choice change any existing assertion?
2. Make the function accept events already known to be applied — a `since` revision — and replay only the newer ones. What happens to the `1..N` requirement?
3. In words: the reference proves the `1..N` property with one comparison inside a loop. State the argument in full, and identify which of the three premises would fail if revisions were allowed to be zero.
