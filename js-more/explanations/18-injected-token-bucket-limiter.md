# Injected token-bucket limiter — js-more 1889–1898

**What you practise:** a rate limiter built as a closure over injected time, so that it is testable without waiting for anything.
**Prerequisites:** closures holding mutable state; returning an object of methods from a function; default parameters (`take(cost = 1)`); `Math.min`; `Number.isFinite`.
**Exercises:** 1889: capacity=2; refill=0.5, 1890: capacity=2; refill=1, 1891: capacity=3; refill=0.5, 1892: capacity=3; refill=1, 1893: capacity=4; refill=0.5, 1894: capacity=4; refill=1, 1895: capacity=5; refill=0.5, 1896: capacity=5; refill=1, 1897: capacity=6; refill=0.5, 1898: capacity=6; refill=1.

## The problem in plain words

A token bucket is the standard way to say "at most this much, this often". The bucket holds tokens up to a capacity. Time passing adds tokens at a fixed rate. An action costs tokens: if there are enough, it is allowed and the tokens are spent; if not, it is denied and nothing is spent.

The twist in this family is the word *injected*. `solve({now})` is handed a function that reports the time, and that is the only clock it may use. There is no `Date.now()`, no `setTimeout`, no waiting. The test moves a plain variable — `let time = 0; … time = 100;` — and the bucket sees a hundred units go by in an instant. This is dependency injection, and it is why the whole suite runs in milliseconds.

`solve` does not do the limiting; it *returns* a limiter: an object with a `take(cost = 1)` method that reports `{allowed, tokens}`. Each call to `solve` builds a fresh bucket with its own state, which the test checks by creating a second one.

"Policy" is two numbers: `capacity` — the starting balance and the cap — and `refill`, the tokens earned per unit of virtual time.

## The contract you must honour

Taken from `tests/1889.cjs`, which is written entirely in terms of `cfg`, so one reading covers all ten:

- `solve({now})` returns an object with a `take` method. The bucket starts full: `cfg.capacity` tokens.
- `take()` with no argument costs 1. The reference spells that as a default parameter.
- The return value is `{allowed, tokens}` — a boolean and the balance *after* the call. `deep(bucket.take(cfg.capacity), {allowed:true, tokens:0})` is the first assertion.
- A denial changes nothing: `deep(bucket.take(), {allowed:false, tokens:0})` immediately afterwards. The prompt calls this "Denial retains balance".
- Refill is proportional and capped. After `time = 1`, `deep(bucket.take(0.5), {allowed:true, tokens: cfg.refill - 0.5})` — one unit of time earned exactly `cfg.refill` tokens. After `time = 100`, `deep(bucket.take(1), {allowed:true, tokens: cfg.capacity - 1})` — 99 units would earn far more than capacity, so the balance is capped first.
- Fractional costs and balances are allowed; `0.5` appears in the assertions.
- `assert.throws(()=>bucket.take(0), /Invalid cost/)` — a cost of zero, a negative cost or a non-finite cost is `RangeError('Invalid cost')`.
- `assert.throws(()=>bucket.take(), /Time reversed/)` after `time = 99` — the injected clock must be monotonic, and a step backwards is `RangeError('Time reversed')`.
- The last line builds a second bucket over its own clock and asserts `{allowed:true, tokens: cfg.capacity - 1}`: state must live per call, not in a module-level variable.
- Note what is *not* checked here: the file defines a `check` helper with the `structuredClone` mutation guard, but this test never calls it. The "Preserve inputs" line in the prompt still holds — do not write to the object you were handed — but no assertion in this family enforces it.
- The prompt's "No real timers" is a source-review requirement, as the `CONTRACT` section says.

## Approach

1. Capture the state in `solve`'s scope: `let tokens = cfg.capacity;` and `let last = input.now();`. Because both are closed over by `take`, every call to `solve` gets its own pair.
2. Read the clock once per `take`, into a local. Calling `input.now()` twice in one method risks two different answers.
3. Reject reversed time before doing anything else. If `time < last`, `throw new RangeError('Time reversed')`.
4. Refill: `tokens = Math.min(cfg.capacity, tokens + (time - last) * cfg.refill)`, then set `last = time`. The `Math.min` is what makes an idle bucket stop at capacity instead of growing without bound.
5. Validate the cost: `!Number.isFinite(cost) || cost <= 0` is `RangeError('Invalid cost')`.
6. Spend or deny: if `tokens < cost`, return `{allowed:false, tokens}` without touching the balance; otherwise subtract and return `{allowed:true, tokens}`.

The order of steps 4 and 5 is worth stating plainly, because it is observable: the bucket refills and advances `last` even for a call that then throws `Invalid cost`. The test's `bucket.take(0)` happens at `time = 100`, when the bucket is already settled there, so it cannot tell the difference — but a reviewer reading your code can, and the reference does it in this order.

## Worked example — 1889 Injected token-bucket limiter / scenario 1 — capacity=2; refill=0.5

The whole of `tests/1889.cjs`'s runtime section, quoted:

```js
let time = 0;
const bucket = solve({now: () => time});
deep(bucket.take(cfg.capacity), {allowed:true, tokens:0});
deep(bucket.take(), {allowed:false, tokens:0});
time = 1;
deep(bucket.take(0.5), {allowed:true, tokens: cfg.refill - 0.5});
time = 100;
deep(bucket.take(1), {allowed:true, tokens: cfg.capacity - 1});
deep(bucket.take(cfg.capacity + 1), {allowed:false, tokens: cfg.capacity - 1});
assert.throws(() => bucket.take(0), /Invalid cost/);
time = 99;
assert.throws(() => bucket.take(), /Time reversed/);
let t = 0;
const other = solve({now: () => t});
deep(other.take(), {allowed:true, tokens: cfg.capacity - 1});
```

For 1889, `cfg.capacity` is 2 and `cfg.refill` is 0.5. The trace, with `tokens` and `last` shown after each step:

| Call | `time` | Refill applied | Cost | Outcome | `tokens` | `last` |
| --- | --- | --- | --- | --- | --- | --- |
| construct | 0 | — | — | — | 2 | 0 |
| `take(2)` | 0 | `min(2, 2 + 0×0.5) = 2` | 2 | allowed, 2 − 2 | 0 | 0 |
| `take()` | 0 | `min(2, 0 + 0) = 0` | 1 | `0 < 1`, denied | 0 | 0 |
| `take(0.5)` | 1 | `min(2, 0 + 1×0.5) = 0.5` | 0.5 | allowed, 0.5 − 0.5 | 0 | 1 |
| `take(1)` | 100 | `min(2, 0 + 99×0.5) = 2` (capped from 49.5) | 1 | allowed, 2 − 1 | 1 | 100 |
| `take(3)` | 100 | `min(2, 1 + 0) = 1` | 3 | `1 < 3`, denied | 1 | 100 |
| `take(0)` | 100 | `min(2, 1 + 0) = 1` | 0 | `cost <= 0` → throws | 1 | 100 |
| `take()` | 99 | — | — | `99 < 100` → throws | 1 | 100 |

The expected values in the assertions line up: `cfg.refill - 0.5` is `0` for 1889, and `cfg.capacity - 1` is `1`. Row four is the capping row — without `Math.min` the balance would be 49.5 and the fifth assertion, `take(3)` denied with `tokens: 1`, would fail.

The last two lines build a second bucket over a different variable and assert it starts full. If `tokens` lived at module scope, `other.take()` would see the first bucket's balance of 1 and return `{allowed:true, tokens:0}` — a mismatch.

The reference solution, as it now reads in `solutions/1889.cjs`:

```js
function tokenBucket(input) {
  let tokens = cfg.capacity;
  let last = input.now();
  return {
    take(cost = 1) {
      const time = input.now();
      if (time < last) {
        throw new RangeError('Time reversed');
      }
      tokens = Math.min(cfg.capacity, tokens + (time - last) * cfg.refill);
      last = time;
      if (!Number.isFinite(cost) || cost <= 0) {
        throw new RangeError('Invalid cost');
      }
      if (tokens < cost) {
        return { allowed: false, tokens };
      }
      tokens -= cost;
      return { allowed: true, tokens };
    }
  };
}
```

## Policy matrix — what changes between the variants

The code is identical across the family; only the two numbers in `cfg` move. Both appear in `take`: `cfg.capacity` as the initial balance and the `Math.min` cap, `cfg.refill` as the multiplier on elapsed time.

| ID | Variant | Semantic key | What differs in the code |
| --- | --- | --- | --- |
| 1889 | capacity=2; refill=0.5 | `{"capacity":2,"refill":0.5}` | starts at 2, caps at 2, earns 0.5 tokens per unit |
| 1890 | capacity=2; refill=1 | `{"capacity":2,"refill":1}` | same cap, double the refill rate |
| 1891 | capacity=3; refill=0.5 | `{"capacity":3,"refill":0.5}` | cap 3, slow refill |
| 1892 | capacity=3; refill=1 | `{"capacity":3,"refill":1}` | cap 3, fast refill |
| 1893 | capacity=4; refill=0.5 | `{"capacity":4,"refill":0.5}` | cap 4, slow refill |
| 1894 | capacity=4; refill=1 | `{"capacity":4,"refill":1}` | cap 4, fast refill |
| 1895 | capacity=5; refill=0.5 | `{"capacity":5,"refill":0.5}` | cap 5, slow refill |
| 1896 | capacity=5; refill=1 | `{"capacity":5,"refill":1}` | cap 5, fast refill |
| 1897 | capacity=6; refill=0.5 | `{"capacity":6,"refill":0.5}` | cap 6, slow refill |
| 1898 | capacity=6; refill=1 | `{"capacity":6,"refill":1}` | cap 6, fast refill |

The interesting consequence of the second knob is the third assertion. At `time = 1` the bucket has earned exactly `cfg.refill` tokens, and the test spends `0.5` of them — so with `refill=0.5` the balance lands on `0`, and with `refill=1` on `0.5`. The same line of code covers both.

## Pitfalls the tests are designed to catch

- **Keeping state outside `solve`.** A module-level `let tokens` makes every bucket share a balance; the final two lines of the test build a second bucket and assert it starts full.
- **Forgetting the cap.** Without `Math.min`, the jump to `time = 100` gives 49.5 tokens for 1889, and the very next assertion — `take(cfg.capacity + 1)` denied — fails.
- **Refilling after spending.** The prompt says `take` "first refills elapsed×rate, capped, then spends iff enough". At `time = 1` the bucket has 0 tokens until it refills; spending first would deny a call the test expects to allow.
- **Not advancing `last`.** If `last` stays at its initial value, every call refills from time zero and the bucket is effectively unlimited.
- **Using `Date.now()` or a timer.** The prompt bans it, and the assertions would be non-deterministic. The clock arrives as `input.now`.
- **Treating cost 0 as free.** `take(0)` must throw `Invalid cost`, not return `{allowed:true}`. The guard is `cost <= 0`, not `cost < 0`.
- **Checking the cost before the clock.** `take()` at `time = 99` must report `Time reversed`; a cost check first would still reach the right error here, but reversing the two guards changes which error a call with both problems reports.
- **Reporting the balance before the spend.** `tokens` in the result is the balance after the deduction — the first assertion expects `0`, not `2`.
- **Returning a class instance with extra enumerable fields.** `deep` compares the returned object against `{allowed, tokens}` exactly; a third property fails.

## Checking your work

```text
node js-more/verify.cjs --id=1889
node js-more/verify.cjs --starters --id=1889
```

Before running, write out your bucket's `tokens` and `last` after each of the eight calls above under your own `cfg`. If `last` is not `100` by the sixth row, the refill bookkeeping is wrong.

## Try it yourself

1. Add a `peek()` method that reports the current balance without spending. Should it refill first? Justify your answer from the prompt's wording.
2. Make the bucket refuse a cost larger than `cfg.capacity` with an error instead of a denial. Which existing assertion would that break?
3. Replace the closure with a class and a private `#tokens` field. Does anything in the contract change?
4. In words: explain why injecting `now` makes the jump from `time = 1` to `time = 100` instant, and what a test for the same behaviour would have to do if the bucket called `Date.now()` itself.
