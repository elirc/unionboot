# Bounded event buffer — js-rest 144–147

**What you practise:** validating a capacity parameter, then applying one of four back-pressure policies as events arrive at a full buffer.
**Prerequisites:** `Number.isInteger`; `Array.prototype.push` and `shift`; `continue` in a loop; throwing typed errors.
**Exercises:** 144: Bounded event buffer: drop-oldest, 145: Bounded event buffer: drop-newest, 146: Bounded event buffer: reject, 147: Bounded event buffer: grow.

## The problem in plain words

The input is `{capacity, events}`. Events are primitives and arrive in order. The buffer can normally hold `capacity` of them. What should happen when the next event arrives and the buffer is already full?

Every real system answers this, and the four answers here are the four you meet in practice. A metrics ring buffer drops the oldest sample so it always shows the recent past. A rate-limited ingest drops the newest and keeps what it already accepted. A financial queue refuses the write and raises an error. An in-memory collector ignores the limit and grows.

"Policy" is that overflow decision. The validation, the loop and the return value are shared.

Note the asymmetry the tests make visible: drop-oldest and drop-newest both return `capacity` events but *different* ones, reject returns nothing at all because it throws, and grow returns every event.

## The contract you must honour

Taken from `tests/144.cjs` through `tests/147.cjs`. These four files have **four** cases each, one more than most families in this track:

- `{"capacity":2,"events":[]}` asserts `[]` in all four.
- `{"capacity":2,"events":["a","b"]}` asserts `["a","b"]` in all four. Exactly filling the buffer is not an overflow.
- `{"capacity":2,"events":["a","b","c"]}` is the policy case: `["b","c"]` for drop-oldest, `["a","b"]` for drop-newest, a throw of `Error("Overflow")` for reject, and `["a","b","c"]` for grow.
- `{"capacity":0,"events":[]}` asserts `assert.throws(()=>solve(input), e=>e instanceof Error && e.message==="Invalid capacity")` in all four — **including grow**. The prompt says grow "ignores the cap after validation", so validation still runs.
- Two distinct messages are asserted, exactly: `Invalid capacity` and `Overflow`.
- Every case ends with `assert.deepEqual(input, before, 'Input must not mutate')` against a `structuredClone`. The prompt spells it out: "leaving events unchanged".

## Approach

1. Validate the capacity first: `if (!Number.isInteger(capacity) || capacity < 1) throw new Error('Invalid capacity');`. `Number.isInteger` rejects `2.5`, `NaN`, `Infinity` and the string `"2"` without coercion; `< 1` rejects zero and negatives. Doing it before the loop is what makes the fourth case throw even though `events` is empty.
2. Create a fresh output array. Never build the result by mutating `input.events` — that is what the no-mutation assertion is guarding.
3. Walk `input.events` in order. Before each push, ask whether the buffer is already at capacity, and apply the policy:
   - drop-oldest: `buffer.shift()` removes the front element, then push;
   - drop-newest: `continue`, so the incoming event is discarded;
   - reject: `throw new Error("Overflow")`;
   - grow: there is no overflow branch at all.
4. Return the buffer.

Cost: O(n) pushes. `shift()` is O(k) in the buffer length, so drop-oldest is O(n·capacity) in the worst case; a real ring buffer would use a wrapping index instead, but the exercise is about the policy, not the micro-optimisation.

Note that the condition is `buffer.length === capacity` *before* the push, not `> capacity` after it. Checking afterwards would let the buffer momentarily exceed the cap, which matters for the reject policy: it must refuse the event, not accept it and then complain.

## Worked example — 144 Bounded event buffer: drop-oldest

The first input in `tests/144.cjs` is `{"capacity":2,"events":[]}`. `Number.isInteger(2)` is true and `2 >= 1`, so validation passes; the loop never runs; `[]` is returned, asserted on line 2.

The third case, on line 4, is the policy case: `{"capacity":2,"events":["a","b","c"]}`.

| event | `buffer.length` before | full? | action | buffer after |
| --- | --- | --- | --- | --- |
| — | 0 | — | start | `[]` |
| `"a"` | 0 | `0 === 2`? no | push | `["a"]` |
| `"b"` | 1 | `1 === 2`? no | push | `["a","b"]` |
| `"c"` | 2 | `2 === 2`? **yes** | `shift()` removes `"a"`, then push `"c"` | `["b","c"]` |

Result `["b","c"]`, asserted as `assert.deepEqual(solve(input),["b","c"])`. Running the identical trace under the other policies: drop-newest hits the same `yes` and does nothing, leaving `["a","b"]`; reject throws at that point, so there is no return value; grow never asks the question and ends with `["a","b","c"]`.

The fourth case, on line 5, is `{"capacity":0,"events":[]}`. `Number.isInteger(0)` is `true`, so the first half of the guard passes, but `0 < 1` is true and the throw fires before `events` is touched — which is exactly why an empty event list still produces the error.

The reference solution, as it now reads in `solutions/144.cjs`:

```js
function solve(input) {
  const capacity = input.capacity;
  if (!Number.isInteger(capacity) || capacity < 1) {
    throw new Error('Invalid capacity');
  }
  const buffer = [];
  for (const event of input.events) {
    if (buffer.length === capacity) {
      buffer.shift();
    }
    buffer.push(event);
  }
  return buffer;
}
```

## Policy matrix — what changes between the variants

| ID | Variant | What differs in the prompt | What differs in the code |
| --- | --- | --- | --- |
| 144 | drop-oldest | "On capacity overflow drop-oldest" | the full branch is `buffer.shift()`, then the push runs |
| 145 | drop-newest | "On capacity overflow drop-newest" | the full branch is `continue`, so the push is skipped |
| 146 | reject | "On capacity overflow reject with Error(\"Overflow\")" | the full branch is `throw new Error("Overflow")` |
| 147 | grow | "grow ignores the cap after validation" | the full branch is removed entirely; validation stays |

## Pitfalls the tests are designed to catch

- **Skipping validation in 147.** "Grow" tempts you to delete the capacity check with the overflow branch. The fourth case asserts `Error("Invalid capacity")` for grow too.
- **Using the wrong message.** There are two, and they are not interchangeable: the capacity guard says `Invalid capacity`, the overflow says `Overflow`. Both predicates compare `e.message` exactly.
- **Rejecting zero with `capacity <= 0` only.** That works, but `capacity: 2.5` slips through without `Number.isInteger`; the prompt says "positive integer". No visible test covers a fractional capacity.
- **Using `capacity > 0` with the global `parseInt` or a truthiness test.** `!capacity` treats `0` correctly but also rejects nothing else; `parseInt("2")` accepts a string, which the prompt does not.
- **Building the result by mutating `input.events`.** `input.events.shift()` fails `assert.deepEqual(input, before, 'Input must not mutate')`.
- **Checking `buffer.length > capacity` after pushing.** The buffer transiently holds `capacity + 1` events, and for 146 the event has already been accepted before the error is raised — the wrong semantics even though the returned value would be discarded.
- **Using `pop()` instead of `shift()` in 144.** `pop` removes the newest, which is the drop-newest policy applied to the wrong end: the third case would return `["a","c"]` against the asserted `["b","c"]`.
- **Treating "exactly full" as overflow.** The second case fills the buffer precisely; if the check fires there, drop-oldest returns `["b"]` and fails.

## Checking your work

Run one exercise at a time:

```text
node js-rest/verify.cjs --id=144
```

Three things to check by eye first:

- Is the capacity guard present in **all four** files, including grow?
- Is the guard `!Number.isInteger(capacity) || capacity < 1`, so that `2.5` and `"2"` are rejected as well as `0`?
- Is the fullness test `buffer.length === capacity` *before* the push, rather than a length check afterwards?

A useful self-test the suite does not include:

```js
solve({capacity: 2.5, events: []});
```

All four must throw `Error('Invalid capacity')`. A guard written as `capacity <= 0` accepts `2.5` and returns `[]` instead. Then try `{capacity: 1, events: ['a','b','c']}`: drop-oldest gives `["c"]`, drop-newest `["a"]`, reject throws, grow `["a","b","c"]` — a capacity of one makes the four policies maximally different.

## Try it yourself

1. Add a `drop-oldest-half` policy that discards the oldest `Math.floor(capacity / 2)` events when the buffer fills. Which line changes?
2. Replace `shift()` with a wrapping write index so drop-oldest is O(1) per event. What has to happen at the end to return the events in arrival order?
3. Make the reject policy report which event overflowed, without changing the message the tests assert. Where would that information go?
4. In words: drop-oldest and drop-newest both return two events for the third case, but different ones. Describe a system where choosing the wrong one would be a serious bug.
