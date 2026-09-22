# Lazy iterator pipelines — js-more 1839–1848

**What you practise:** writing a filter-and-take pipeline as a generator that pulls nothing until it is asked, stops one item after its last output, and closes the underlying iterator on every exit path.
**Prerequisites:** generator functions and `yield`; the iterator protocol (`next`, `return`, `done`); what `for...of` does when you `break` or `return` out of it; `try`/`finally` inside a generator.
**Exercises:** 1839: mode=even; take=2, 1840: mode=even; take=4, 1841: mode=positive; take=2, 1842: mode=positive; take=4, 1843: mode=square; take=2, 1844: mode=square; take=4, 1845: mode=negate; take=2, 1846: mode=negate; take=4, 1847: mode=double; take=2, 1848: mode=double; take=4.

## The problem in plain words

The input is any iterable of finite numbers. Return a lazy iterable that applies one transformation stage and then stops after at most `take` items.

"Lazy" is the whole exercise, and the prompt states it in three parts. Do not pull the input at construction — building the pipeline must read nothing. Do not pull beyond the last yielded item — once the take limit is reached, the source must not be advanced again. And close the underlying iterator with `return()` when the consumer stops early or the take limit is reached.

That last rule is what makes a pipeline safe over a source that holds a resource. A generator with a `finally` block — which is exactly what the test uses — runs that block when its `return()` is called, and not otherwise.

"Policy" is two knobs. `mode` selects the stage: `even` and `positive` are filters that pass values through unchanged; `square`, `negate` and `double` are maps that keep every value. `take` is the limit, 2 or 4.

## The contract you must honour

Taken from `prompts/1839.txt` and `tests/1839.cjs`:

- `solve(source)` returns an iterable. The test spreads it with `[...iterator]` and also drives it with `for...of`.
- Construction pulls nothing: `const iterator=solve(source());eq(pulls,0)`. The source counts a pull on every `yield` it performs.
- The values are the source filtered and mapped, then cut to `cfg.take`. The test computes its own expectation with `values.filter(...).map(...).slice(0,cfg.take)`.
- The source is closed exactly once after a full run: `eq(closed,1)`. `closed` is incremented by the source's `finally`.
- The pull count is asserted exactly. The test recomputes it: walk the values, counting each, and stop as soon as `kept` reaches `cfg.take`. So the pipeline must stop pulling the moment the limit is reached, not one item later.
- Breaking out early closes the source too: `for(const x of solve(source())){void x;break;}eq(closed,1)`.
- An empty input works: `deep([...solve([])],[])`.
- `check` is defined in the test but this family asserts with `eq` and `deep` directly, since the input is an iterator rather than a cloneable value.
- The prompt's "Do not materialize input" is a structural requirement — the CONTRACT section's source-review clause covers it. `[...input]` would pass every assertion except the pull count, and on an infinite source it would never return at all.

## Approach

1. Return an immediately-invoked generator: `return (function* () { ... })()`. Calling a generator function creates the iterator without executing a single line of the body, which satisfies "do not pull at construction" for free.
2. Guard `cfg.take === 0` before the loop. With the count check placed after the `yield`, a zero limit would otherwise pull and emit one value before stopping. (No scenario in this family sets `take` to 0, but the guard is in the generated body.)
3. `for (const value of input)` drives the source one item at a time. `for...of` calls `next()` on demand and — crucially — calls `return()` on the source when the loop is exited by `break`, `return` or a throw.
4. Apply the filter modes with `continue`, so a rejected value emits nothing and the loop pulls the next one.
5. Compute the projection, `yield` it, and only then increment the count. When the count reaches `cfg.take`, `return` — which exits the `for...of` and therefore closes the source.
6. Nothing is accumulated. The only state is `emitted`.

The consumer controls the pace: every `next()` on the returned iterator resumes the generator body until the next `yield`. Memory is O(1) regardless of the source's length.

## Worked example — 1839 Lazy iterator pipelines / scenario 1

The instrumented source, quoted from line 9 of `tests/1839.cjs`:

```js
let pulls=0,closed=0;
function* source(){try{for(const n of [-2,-1,0,1,2,3,4,5,6,7,8,9]){pulls++;yield n;}}finally{closed++;}}
const iterator=solve(source());eq(pulls,0);
const result=[...iterator];
```

With `cfg = {"mode":"even","take":2}`:

| Consumer action | Generator body | `pulls` | `emitted` | Output |
| --- | --- | --- | --- | --- |
| `solve(source())` | not started — no line has run | 0 | — | — |
| first `next()` | enters the loop; pulls `-2`; `-2 % 2 === 0` so it is even; yields `-2` | 1 | 0 | `-2` |
| second `next()` | `++emitted` is 1, not 2; pulls `-1`; odd, so `continue`; pulls `0`; even; yields `0` | 3 | 1 | `0` |
| third `next()` | `++emitted` is 2, equal to `cfg.take`; `return` | 3 | 2 | done |

`result` is `[-2, 0]`, which matches the test's `projected`. `pulls` is `3`, which matches the test's recomputed `expectedPulls`: it counts `-2` (kept 1), `-1` (not kept), `0` (kept 2, break). And the `return` at step three exits the `for...of` over `source()`, so `for...of` calls `source().return()`, the source's `finally` runs, and `closed` becomes 1.

Two things are worth stopping on.

The `-2` case shows why the `even` filter is `value % 2 !== 0` and not `value % 2 === 1`: `-2 % 2` is `-0` in JavaScript, and `-0 !== 0` is `false`, so `-2` correctly passes. Had the test used `value % 2 === 1`, every negative even number would have been rejected.

The pull count is the real assertion. A pipeline that checks the limit *before* pulling instead of after yielding would pull a fourth item, `1`, before discovering it was done — `pulls` would be 4 and the test would fail even though the output was right.

**The early-exit case**, further along the same line:

```js
pulls=0;closed=0;for(const x of solve(source())){void x;break;}eq(closed,1);
```

The consumer takes one value and breaks. `break` makes the outer `for...of` call `return()` on the pipeline generator. A generator's `return()` resumes it as if a `return` statement had appeared at the `yield` — which unwinds the generator's own `for...of` over the source, which calls `return()` on the source, which runs its `finally`. One `break` from the outermost consumer closes the whole chain, because each `for...of` in the chain propagates the closure to the level below.

**The empty case:** `[...solve([])]` enters the `for...of`, which immediately reports done, so the generator falls off the end and returns `[]`.

**How `take` changes the trace.** Under 1840 (`take: 4`) the same source yields `[-2, 0, 2, 4]` and `pulls` is 7: `-2`, `-1`, `0`, `1`, `2`, `3`, `4` — four kept and three skipped. The source still holds eight unread values when the generator returns, and it is closed without them ever being pulled.

**How `mode` changes the trace.** All ten scenarios run against the same twelve values, so the pull count is a direct readout of how selective the mode is:

| Scenario | Mode | Output | `pulls` |
| --- | --- | --- | --- |
| 1839 | `even`, take 2 | `[-2,0]` | 3 |
| 1840 | `even`, take 4 | `[-2,0,2,4]` | 7 |
| 1841 | `positive`, take 2 | `[1,2]` | 5 |
| 1843 | `square`, take 2 | `[4,1]` | 2 |
| 1845 | `negate`, take 2 | `[2,1]` | 2 |
| 1847 | `double`, take 2 | `[-4,-2]` | 2 |

The three mapping modes reject nothing, so they always pull exactly `take` items. `positive` has to walk past `-2`, `-1`, `0` before it finds anything, so it pulls five to emit two.

**Why a generator rather than a hand-written iterator.** You could return `{[Symbol.iterator](){...}}` with your own `next`, and for the values alone it would work. Three of the assertions would not: a hand-written iterator has no `return` method unless you write one, so `closed` stays `0`; the suspended-state bookkeeping that `yield` gives you for free has to become explicit fields; and the `break` case needs you to forward the closure to the source by hand. The generator gets all three from the language.

The reference solution, as it now reads in `solutions/1839.cjs`:

```js
function lazyPipeline(input) {
  return (function* () {
    if (cfg.take === 0) return;
    let emitted = 0;
    for (const value of input) {
      if (cfg.mode === 'even' && value % 2 !== 0) continue;
      if (cfg.mode === 'positive' && value <= 0) continue;
      const projected =
        cfg.mode === 'square' ? value * value :
        cfg.mode === 'negate' ? -value :
        cfg.mode === 'double' ? value * 2 :
        value;
      yield projected;
      if (++emitted === cfg.take) return;
    }
  })();
}
```

## Policy matrix — what changes between the variants

`cfg.mode` selects which of the two `continue` guards is live and which arm of the projection applies. `cfg.take` is the limit compared against `emitted`.

| ID | Variant | What differs in the prompt | What differs in the code |
| --- | --- | --- | --- |
| 1839 | mode=even; take=2 | `{"mode":"even","take":2}` | `continue` when `value % 2 !== 0`; value passed through; stop after 2 |
| 1840 | mode=even; take=4 | `{"mode":"even","take":4}` | same filter; stop after 4 |
| 1841 | mode=positive; take=2 | `{"mode":"positive","take":2}` | `continue` when `value <= 0`; value passed through; stop after 2 |
| 1842 | mode=positive; take=4 | `{"mode":"positive","take":4}` | same filter; stop after 4 |
| 1843 | mode=square; take=2 | `{"mode":"square","take":2}` | no filter; projection `value * value`; stop after 2 |
| 1844 | mode=square; take=4 | `{"mode":"square","take":4}` | same projection; stop after 4 |
| 1845 | mode=negate; take=2 | `{"mode":"negate","take":2}` | no filter; projection `-value`; stop after 2 |
| 1846 | mode=negate; take=4 | `{"mode":"negate","take":4}` | same projection; stop after 4 |
| 1847 | mode=double; take=2 | `{"mode":"double","take":2}` | no filter; projection `value * 2`; stop after 2 |
| 1848 | mode=double; take=4 | `{"mode":"double","take":4}` | same projection; stop after 4 |

The two filtering modes and the three mapping modes never combine: a mode is either a filter or a map, which is why the same source of twelve values produces a different pull count for almost every scenario. `take` alone decides how far down the source the pipeline ever reaches.

## Pitfalls the tests are designed to catch

- **Materialising the input.** `[...input].filter(...).slice(...)` gives the right values and pulls all twelve items. `eq(pulls, expectedPulls)` fails, and on an infinite source the call never returns.
- **Pulling at construction.** Doing any work before the first `next()` — for example reading the first value to prime a buffer — fails `eq(pulls,0)` on the line after `solve(source())`.
- **Pulling one past the limit.** Checking `emitted === cfg.take` at the top of the loop, before the pull, costs one extra `next()` on the source. The recomputed `expectedPulls` catches it.
- **Never closing the source.** Returning a hand-rolled object with a `next` method but no `return` method leaves the source suspended, its `finally` never runs, and `eq(closed,1)` fails with `0`. A generator gets `return` for free.
- **Swallowing the early break.** If the generator's loop is a `while (true)` with manual `next()` calls instead of a `for...of`, the closure is not propagated and `break` in the consumer leaves the source open.
- **Closing more than once.** `eq(closed,1)` is an exact count. Calling `input.return?.()` explicitly *and* letting `for...of` do it would run the source's `finally` twice — though a well-behaved generator ignores the second call, a hand-written iterator may not.
- **Using `value % 2 === 1` for `even`'s complement.** `-1 % 2` is `-1`, not `1`, so every negative odd number would slip through. The reference tests `!== 0`.
- **Filtering after mapping.** For `even` and `positive` the projection is the identity, so the order is invisible here — but `square` would turn negatives positive, and the prompt's wording is "filter …, then take".
- **Counting before yielding.** `if (++emitted === cfg.take) return;` placed before the `yield` would emit one fewer value.

## Try it yourself

1. Add a `drop` stage that skips the first `n` accepted values before taking. Does it change the pull count for a given `take`?
2. Rewrite the pipeline as two chained generators — a filter stage feeding a take stage — and confirm `closed` is still exactly 1. Which generator's `return()` triggers the other's?
3. Feed the pipeline an infinite source (`function*(){let i=0;while(true)yield i++;}`) and confirm 1840 still terminates. What would `[...input]` do?
4. In words: a `for...of` loop calls `return()` on its iterator when the loop exits early, but not when the iterator reports done by itself. Explain why the reference still ends up closing the source in the full-run case, and name the statement that does it.
