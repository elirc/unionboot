# Async semaphore queues — js-more 1829–1838

**What you practise:** a counting semaphore built from promises alone — no timers, no polling — with an idempotent release that hands the permit straight to the next waiter, and a FIFO or LIFO queue policy.
**Prerequisites:** the `Promise` constructor and when its executor runs; microtasks and what `await Promise.resolve()` actually waits for; closures capturing a `resolve` function; [11 Wildcard topic bus](11-wildcard-topic-bus.md) for the factory-returning-an-object shape.
**Exercises:** 1829: permits=1; queue=fifo, 1830: permits=1; queue=lifo, 1831: permits=2; queue=fifo, 1832: permits=2; queue=lifo, 1833: permits=3; queue=fifo, 1834: permits=3; queue=lifo, 1835: permits=4; queue=fifo, 1836: permits=4; queue=lifo, 1837: permits=5; queue=fifo, 1838: permits=5; queue=lifo.

## The problem in plain words

`solve()` returns `{acquire, stats}`. `acquire()` returns a promise that settles with a *release function*. If a permit is free the promise settles immediately; if not, the request joins a queue and settles later, when someone releases.

A semaphore with `n` permits lets at most `n` callers hold one at a time. With `n = 1` it is a mutual-exclusion lock. `stats()` reports `{active, waiting}`: how many permits are out and how many requests are queued.

"Policy" is two knobs. `permits` is the capacity, 1 to 5. `queue` is which waiter gets the freed permit: `fifo` takes the one that has waited longest, `lifo` the most recent.

The prompt adds two rules that constrain *how*, not just *what*. "Release is idempotent" — calling the release function twice must not return two permits. And "hands permit directly to one waiter before later acquisitions" — when a permit is released and someone is waiting, that waiter gets it there and then, so an `acquire()` called afterwards cannot jump the queue.

## The contract you must honour

Taken from `prompts/1829.txt` and `tests/1829.cjs`:

- `solve()` takes no argument. Each call is an independent semaphore; the test's last assertion is `deep(solve().stats(),{active:0,waiting:0})`.
- `stats()` returns exactly `{active, waiting}`, both numbers.
- A fresh semaphore reports `{active:0,waiting:0}`.
- The first `cfg.permits` acquisitions settle without anyone releasing; after them `stats()` is `{active:cfg.permits,waiting:0}`.
- Queued acquisitions must not settle early. After three `acquire()` calls on a full semaphore and one `await Promise.resolve()`, the test asserts `deep(order,[])` and `deep(sem.stats(),{active:cfg.permits,waiting:3})`.
- `held[0]()` is called twice in a row. The second call must do nothing: the following assertion is still `{active:cfg.permits,waiting:2}`, so exactly one waiter was promoted.
- The grant order is asserted exactly: `deep(order,cfg.queue==='fifo'?[0,1,2]:[2,1,0])`.
- The test steps the microtask queue by hand with `await Promise.resolve()` between actions. That means the *timing* is part of the contract: after `held[0]()`, exactly one `.then` callback must be ready to run on the next turn. Inserting an extra `await`, deferring the hand-off with `queueMicrotask`, or resolving from a `.then` would shift everything by a turn and fail the very next assertion.
- The prompt forbids timers, polling and tasks scheduled by the semaphore itself.

## Approach

1. Keep `let active = 0` and `const waiting = []`. A queued request is stored as `{resolve}` — the `resolve` function of the promise `acquire()` already returned, parked until a permit frees up.
2. `grant(resolve)` is the only place a permit is taken. It increments `active` and calls `resolve(releaseFunction)`.
3. The release function closes over a `let released = false`. On the first call it sets the flag, decrements `active`, and — if anyone is waiting — immediately calls `grant` on the next waiter's `resolve`. On any later call it returns at once. That is the idempotence rule and the direct hand-off rule in four lines.
4. `cfg.queue` picks the waiter: `waiting.shift()` for FIFO, `waiting.pop()` for LIFO.
5. `acquire()` returns `new Promise(resolve => { if (active < cfg.permits) grant(resolve); else waiting.push({resolve}); })`. The executor runs synchronously, so a free permit is taken during the `acquire()` call itself and `stats()` sees it immediately, even though the caller only observes the release function one microtask later.
6. `stats()` reads the two variables.

Nothing in here schedules anything. The only asynchrony is the one JavaScript gives you for free: resolving a promise queues its `.then` callbacks as microtasks.

## Worked example — 1829 Async semaphore queues / scenario 1

With `cfg = {"permits":1,"queue":"fifo"}` the semaphore is a plain mutex. The test walks it step by step; the `order` array records which waiter was granted when.

The setup, quoted from line 9 of `tests/1829.cjs`:

```js
const sem=solve();deep(sem.stats(),{active:0,waiting:0});
const held=[];for(let i=0;i<cfg.permits;i++)held.push(await sem.acquire());
deep(sem.stats(),{active:cfg.permits,waiting:0});
const order=[],granted=[];
const waiting=[0,1,2].map(i=>sem.acquire().then(release=>{order.push(i);granted.push(release);}));
await Promise.resolve();deep(order,[]);deep(sem.stats(),{active:cfg.permits,waiting:3});
```

| Step | What runs | `active` | `waiting` | `order` |
| --- | --- | --- | --- | --- |
| `solve()` | nothing | 0 | `[]` | `[]` |
| `await sem.acquire()` | executor sees `0 < 1`, so `grant` runs: `active` becomes 1 and the promise resolves with the release function | 1 | `[]` | `[]` |
| three `sem.acquire()` calls | each executor sees `1 < 1` is false, so each pushes `{resolve}` | 1 | 3 entries | `[]` |
| `await Promise.resolve()` | no queued `.then` has anything to run — none of the three promises has settled | 1 | 3 | `[]` |

Then the release, quoted from the same line:

```js
held[0]();held[0]();await Promise.resolve();
deep(order,[cfg.queue==='fifo'?0:2]);deep(sem.stats(),{active:cfg.permits,waiting:2});
```

| Step | What runs | `active` | `waiting` | `order` |
| --- | --- | --- | --- | --- |
| first `held[0]()` | `released` was `false`: set it, `active` drops to 0, `waiting.length` is 3 so `waiting.shift()` takes waiter 0 and `grant` runs — `active` back to 1, waiter 0's promise resolved | 1 | 2 | `[]` |
| second `held[0]()` | `released` is `true`: returns immediately | 1 | 2 | `[]` |
| `await Promise.resolve()` | waiter 0's `.then` was queued when its promise resolved, so it runs now: pushes `0` into `order` and its release into `granted` | 1 | 2 | `[0]` |

The assertion `{active:1,waiting:2}` is what catches a non-idempotent release. If the second `held[0]()` had decremented again and promoted a second waiter, `waiting` would be 1.

Note also that `active` never dropped below 1 as far as any *other* code could observe. The decrement and the re-grant happen in the same synchronous call, which is the direct hand-off the prompt requires: an `acquire()` issued between them is impossible, because there is no point between them at which other code can run.

The rest of the sequence:

```js
granted[0]();await Promise.resolve();granted[1]();await Promise.all(waiting);
deep(order,cfg.queue==='fifo'?[0,1,2]:[2,1,0]);
```

| Step | Effect |
| --- | --- |
| `granted[0]()` | waiter 0 releases; `waiting.shift()` takes waiter 1 and grants it |
| `await Promise.resolve()` | waiter 1's `.then` runs: `order` is `[0,1]` |
| `granted[1]()` | waiter 1 releases; `waiting.shift()` takes waiter 2 and grants it |
| `await Promise.all(waiting)` | waiter 2's `.then` runs: `order` is `[0,1,2]` |

Under 1830 (`queue: 'lifo'`) exactly one expression differs — `waiting.pop()` instead of `waiting.shift()` — and every step above promotes the other end of the queue: waiter 2 first, then 1, then 0, so `order` is `[2,1,0]`.

Under a multi-permit scenario such as 1833 (`permits: 3`) the opening changes shape: the `for` loop acquires three times before the queue starts filling, `stats()` reports `{active:3,waiting:0}`, and the three queued waiters are promoted one at a time exactly as above. The test's final line `for(const release of held.slice(1))release();` is what returns the extra permits; at `permits: 1` that slice is empty.

The reference solution, as it now reads in `solutions/1829.cjs`:

```js
function semaphore() {
  let active = 0;
  const waiting = [];
  function grant(resolve) {
    active++;
    let released = false;
    resolve(() => {
      if (released) return;
      released = true;
      active--;
      if (waiting.length) {
        const next = cfg.queue === 'fifo' ? waiting.shift() : waiting.pop();
        grant(next.resolve);
      }
    });
  }
  return {
    acquire() {
      return new Promise(resolve => {
        if (active < cfg.permits) grant(resolve);
        else waiting.push({resolve});
      });
    },
    stats() {
      return {active, waiting: waiting.length};
    },
  };
}
```

## Policy matrix — what changes between the variants

`cfg.permits` appears once, in the `acquire` guard. `cfg.queue` appears once, in the hand-off.

| ID | Variant | What differs in the prompt | What differs in the code |
| --- | --- | --- | --- |
| 1829 | permits=1; queue=fifo | `{"permits":1,"queue":"fifo"}` | `active < 1`; `waiting.shift()` |
| 1830 | permits=1; queue=lifo | `{"permits":1,"queue":"lifo"}` | `active < 1`; `waiting.pop()` |
| 1831 | permits=2; queue=fifo | `{"permits":2,"queue":"fifo"}` | `active < 2`; `waiting.shift()` |
| 1832 | permits=2; queue=lifo | `{"permits":2,"queue":"lifo"}` | `active < 2`; `waiting.pop()` |
| 1833 | permits=3; queue=fifo | `{"permits":3,"queue":"fifo"}` | `active < 3`; `waiting.shift()` |
| 1834 | permits=3; queue=lifo | `{"permits":3,"queue":"lifo"}` | `active < 3`; `waiting.pop()` |
| 1835 | permits=4; queue=fifo | `{"permits":4,"queue":"fifo"}` | `active < 4`; `waiting.shift()` |
| 1836 | permits=4; queue=lifo | `{"permits":4,"queue":"lifo"}` | `active < 4`; `waiting.pop()` |
| 1837 | permits=5; queue=fifo | `{"permits":5,"queue":"fifo"}` | `active < 5`; `waiting.shift()` |
| 1838 | permits=5; queue=lifo | `{"permits":5,"queue":"lifo"}` | `active < 5`; `waiting.pop()` |

Each test file adapts to `cfg.permits` — it acquires that many permits up front and always queues exactly three waiters — so every scenario exercises the same grant sequence with a different amount of slack.

## Pitfalls the tests are designed to catch

- **Resolving asynchronously.** Wrapping the hand-off in `queueMicrotask` or `Promise.resolve().then(...)` adds a turn. The very next assertion after `held[0]()` and one `await` is `deep(order,[0])`, so the extra turn shows up as an empty `order`.
- **Polling.** `setInterval` is forbidden outright, and it would also settle at the wrong time.
- **A non-idempotent release.** `held[0]()` is called twice. Without the `released` flag, `active` goes negative or a second waiter is promoted, and `{active:1,waiting:2}` fails.
- **Releasing by decrementing and letting `acquire` re-check.** The permit would then be free for a moment, and a later `acquire()` could take it ahead of the queue. The prompt names this: "hands permit directly to one waiter before later acquisitions".
- **Queuing the promise instead of its `resolve`.** What has to be stored is the ability to settle the promise later. Pushing the promise itself gives you nothing to call.
- **Reading `waiting.length` after shifting to build `stats`.** `stats()` is a live read of the two variables; it must not cache.
- **Getting the queue end backwards.** `shift` is FIFO, `pop` is LIFO. The `[0,1,2]` versus `[2,1,0]` assertion is the only thing that separates a scenario from its twin.
- **Incrementing `active` in `acquire` rather than in `grant`.** Then a queued request would count as active and `{active:1,waiting:3}` would read `{active:4,waiting:3}`.
- **Module-level state.** `active` and `waiting` live inside `semaphore()`. A shared array would make the final `solve().stats()` report the leftovers of the previous instance.

## Try it yourself

1. Add `tryAcquire()` that returns the release function synchronously, or `null` when no permit is free. How much of `grant` can you reuse?
2. Add a `drain()` that resolves once every permit has been returned. Can it be written without touching `grant`?
3. Make `stats()` also report the longest-waiting request's queue position. Which of the two queue policies makes that number meaningful?
4. In words: the release function decrements `active` and then calls `grant`, which increments it again. Explain why no observer can ever see the intermediate value, and name the one change to the code that would break that guarantee.
