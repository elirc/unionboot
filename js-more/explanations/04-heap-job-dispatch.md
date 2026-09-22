# Heap job dispatch — js-more 1749–1758

**What you practise:** simulating a non-preemptive scheduler on a virtual clock, and ordering the ready jobs with a hand-written binary heap whose key changes every round.
**Prerequisites:** [03 Weighted interval scheduling](03-weighted-interval-scheduling.md) for "copy before you reorder"; array-backed binary heaps (parent of `i` is `(i-1)>>1`); `Math.min` with spread; why a simulation must not read the wall clock.
**Exercises:** 1749: direction=high; aging=0, 1750: direction=high; aging=1, 1751: direction=high; aging=2, 1752: direction=high; aging=3, 1753: direction=high; aging=4, 1754: direction=low; aging=0, 1755: direction=low; aging=1, 1756: direction=low; aging=2, 1757: direction=low; aging=3, 1758: direction=low; aging=4.

## The problem in plain words

The input is an array of jobs, `{id, arrival, duration, priority}`, with `arrival >= 0` and `duration > 0`. One processor runs them one at a time. Once a job starts it runs to completion — that is what "non-preemptive" means. Return the execution records `{id, start, end}` in the order they ran.

The clock is virtual. It starts at 0, advances by a job's duration whenever one finishes, and jumps forward to the next arrival when nothing has arrived yet. The prompt is explicit: "No real clock or timer". Every number in the output is derived from the arrivals and durations in the input.

"Policy" is how the ready jobs are ordered at each dispatch. `direction=high` runs the largest priority first, `direction=low` the smallest. On top of that sits `aging`: a job that has been waiting gets a bonus of `aging * (now - arrival)` subtracted from its score, so the longer it waits the sooner it goes. With `aging = 0` there is no bonus and priority alone decides. Equal scores fall back to input order.

The prompt also says "Rebuild ready heap as aging changes", which is the key structural hint: the score depends on `now`, so a heap built at one dispatch is ordered by keys that are stale at the next one.

## The contract you must honour

Taken from `prompts/1749.txt` and `tests/1749.cjs`:

- The input is the jobs array itself. `check([],[])` is the first assertion: no jobs means `[]`.
- The output is an array of `{id, start, end}` objects, in dispatch order, with `end === start + duration`.
- The clock starts at 0 and only jumps when nothing is ready: the reference does `if (!waiting.some(job => job.arrival <= now)) now = Math.min(...waiting.map(job => job.arrival))`. The test's `oracle` does the same. A job that arrives long after the others — `{id:'e',arrival:30,...}` in the hand-written case — starts exactly at its arrival, not at the previous end.
- The ordering key is, in the prompt's words, "heap-order ready jobs by `-priority - 0*(now-arrival)`, ascending; ties input order". The `0` there is this scenario's `aging`. Lower key dispatches first.
- Ties are broken by position in `input`, so the position must be captured before anything is reordered. The oracle sorts with `... || a.i - b.i` where `i` is the input index.
- `check` clones the input and asserts `'Input must not mutate'`. The reference copies every job with `{...job, index}` and only ever splices its own `waiting` array.
- The second block of the test runs twelve inputs, `priority` from 0 to 11, over the same three jobs. It is designed so that the `old` job's priority crosses the point where `aging` changes the winner.
- The prompt's CONTRACT adds that structural requirements "also need source review": the reviewer expects an actual heap, built with sift-up, not `ready.sort(...)[0]`.

## Approach

1. Copy the jobs, recording the input position: `input.map((job, index) => ({...job, index}))`. This array, `waiting`, is the set of jobs not yet dispatched.
2. Keep `let now = 0` and `const out = []`.
3. Loop while `waiting` is non-empty:
   - If no waiting job has `arrival <= now`, the processor is idle: set `now` to the smallest arrival among the waiting jobs.
   - Define `rank(job)` for this instant: `(cfg.direction === 'high' ? -job.priority : job.priority) - cfg.aging * (now - job.arrival)`. Negating the priority for `high` turns "largest first" into the same ascending comparison `low` already uses, so one comparator serves both directions.
   - Define `beats(child, parent)` as `rank(child) < rank(parent) || (rank(child) === rank(parent) && child.index < parent.index)`.
   - Build a fresh heap from the ready jobs: push each one onto an array and sift it up while it beats its parent. After every push the heap property holds, so `heap[0]` is the minimum.
   - Dispatch `heap[0]`: remove it from `waiting` with `splice(waiting.indexOf(job), 1)` — the heap holds the same object references, so `indexOf` finds it — push `{id, start: now, end: now + duration}`, and advance `now`.
4. Return `out`.

Rebuilding the heap each round is O(k) pushes with O(log k) sift-up each, so O(k log k) per dispatch, and there are n dispatches. That is not the cheapest possible scheduler, but it is the shape the prompt asks for, and it is the only correct shape once `aging` is non-zero: the ranks of all waiting jobs shift by different amounts every time `now` moves, so a heap cannot be carried across rounds.

## Worked example — 1749 Heap job dispatch / scenario 1

The hand-written job list, quoted from line 8 of `tests/1749.cjs`:

```js
const jobs=[{id:'a',arrival:0,duration:3,priority:2},{id:'b',arrival:0,duration:1,priority:0},{id:'c',arrival:2,duration:2,priority:5},{id:'d',arrival:4,duration:1,priority:-3},{id:'e',arrival:30,duration:1,priority:5}];
```

Input positions: `a` 0, `b` 1, `c` 2, `d` 3, `e` 4. With `cfg = {"direction":"high","aging":0}`, `rank(job)` is simply `-job.priority`.

| Round | `now` | Waiting | Ready (`arrival <= now`) | Ranks | `heap[0]` | Record pushed | `now` after |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 0 | a,b,c,d,e | a, b | a `-2`, b `-0` | `a` | `{id:'a',start:0,end:3}` | 3 |
| 2 | 3 | b,c,d,e | b, c | b `-0`, c `-5` | `c` | `{id:'c',start:3,end:5}` | 5 |
| 3 | 5 | b,d,e | b, d | b `-0`, d `3` | `b` | `{id:'b',start:5,end:6}` | 6 |
| 4 | 6 | d,e | d | d `3` | `d` | `{id:'d',start:6,end:7}` | 7 |
| 5 | 7 → 30 | e | none at 7, so `now` jumps to 30 | e `-5` | `e` | `{id:'e',start:30,end:31}` | 31 |

The result is

```js
[{id:'a',start:0,end:3},{id:'c',start:3,end:5},{id:'b',start:5,end:6},{id:'d',start:6,end:7},{id:'e',start:30,end:31}]
```

and the test asserts it as `check(jobs, oracle(jobs))`, where `oracle` on line 9 is an independent implementation that sorts the ready list instead of heaping it.

Three things in that table are worth naming.

Round 1 shows the heap doing real work. Both `a` and `b` are ready. `a` is pushed first, so `heap = [a]`. `b` is pushed at index 1; its parent is index 0; `beats(b, a)` asks whether `-0 < -2`, which is false, so no swap. `heap[0]` stays `a`.

Round 3 shows the ordering of a negative priority. `d` has `priority: -3`, so under `direction: 'high'` its rank is `3` — the worst of any job here. It only runs because nothing else is left.

Round 5 shows the idle jump. At `now = 7` the only waiting job arrives at 30, so `waiting.some(job => job.arrival <= 7)` is false and `now` becomes `Math.min(30)`. Without that jump the record would read `{id:'e',start:7,end:8}` and the times would be fiction.

The second block of the test is the one that exercises `aging`:

```js
for(let priority=0;priority<12;priority++){const rows=[{id:'start',arrival:0,duration:5,priority:99},{id:'old',arrival:1,duration:1,priority},{id:'new',arrival:4,duration:1,priority:5}];check(rows,oracle(rows));}
```

`start` is alone at `now = 0` and runs from 0 to 5. The interesting dispatch is the second one, at `now = 5`, with `old` (arrived at 1) and `new` (arrived at 4, priority 5) both ready.

- Under 1749, `aging = 0`: `rank(old) = -priority`, `rank(new) = -5`. `old` goes first when `priority > 5`, and also when `priority === 5`, because the ranks tie and `old` has the smaller input index. So `old` leads for `priority >= 5`.
- Under 1750, `aging = 1`: `rank(old) = -priority - (5 - 1) = -priority - 4` and `rank(new) = -5 - (5 - 4) = -6`. `old` now leads for `priority >= 2`. It waited three units longer, and each unit is worth one point of priority.

That is the whole meaning of the aging knob, in one comparison.

The reference solution, as it now reads in `solutions/1749.cjs`:

```js
function heapDispatch(input) {
  const waiting = input.map((job, index) => ({...job, index}));
  const out = [];
  let now = 0;
  while (waiting.length) {
    if (!waiting.some(job => job.arrival <= now)) {
      now = Math.min(...waiting.map(job => job.arrival));
    }
    const rank = job => (cfg.direction === 'high' ? -job.priority : job.priority) - cfg.aging * (now - job.arrival);
    const beats = (child, parent) =>
      rank(child) < rank(parent) || (rank(child) === rank(parent) && child.index < parent.index);
    const heap = [];
    for (const job of waiting.filter(candidate => candidate.arrival <= now)) {
      heap.push(job);
      let i = heap.length - 1;
      while (i > 0) {
        const parent = (i - 1) >> 1;
        if (!beats(heap[i], heap[parent])) break;
        [heap[i], heap[parent]] = [heap[parent], heap[i]];
        i = parent;
      }
    }
    const job = heap[0];
    // Heap contains the same job objects that sit in waiting, so indexOf works.
    waiting.splice(waiting.indexOf(job), 1);
    out.push({id: job.id, start: now, end: now + job.duration});
    now += job.duration;
  }
  return out;
}
```

## Policy matrix — what changes between the variants

Both knobs live inside `rank`, and `rank` is the only expression that differs between the ten files.

| ID | Variant | What differs in the prompt | What differs in the code |
| --- | --- | --- | --- |
| 1749 | direction=high; aging=0 | `{"aging":0,"direction":"high"}` | `rank` is `-priority`; waiting time is ignored |
| 1750 | direction=high; aging=1 | `{"aging":1,"direction":"high"}` | `rank` is `-priority - 1*(now-arrival)` |
| 1751 | direction=high; aging=2 | `{"aging":2,"direction":"high"}` | `rank` is `-priority - 2*(now-arrival)` |
| 1752 | direction=high; aging=3 | `{"aging":3,"direction":"high"}` | `rank` is `-priority - 3*(now-arrival)` |
| 1753 | direction=high; aging=4 | `{"aging":4,"direction":"high"}` | `rank` is `-priority - 4*(now-arrival)` |
| 1754 | direction=low; aging=0 | `{"aging":0,"direction":"low"}` | `rank` is `+priority`; smallest priority dispatches first |
| 1755 | direction=low; aging=1 | `{"aging":1,"direction":"low"}` | `rank` is `priority - 1*(now-arrival)` |
| 1756 | direction=low; aging=2 | `{"aging":2,"direction":"low"}` | `rank` is `priority - 2*(now-arrival)` |
| 1757 | direction=low; aging=3 | `{"aging":3,"direction":"low"}` | `rank` is `priority - 3*(now-arrival)` |
| 1758 | direction=low; aging=4 | `{"aging":4,"direction":"low"}` | `rank` is `priority - 4*(now-arrival)` |

The aging term is subtracted in both directions, so it always favours the job that has waited longer, whichever way `direction` points. The idle-jump rule, the tie-break on input index, and the record shape are identical in all ten.

## Pitfalls the tests are designed to catch

- **Reading a real clock.** `Date.now()` or a timer makes the output non-deterministic and contradicts the prompt outright. Every time in the output comes from `arrival` and `duration`.
- **Never jumping the clock.** If you only advance `now` by durations, job `e` in the hand-written case starts at 7 instead of 30 and every field of that record is wrong.
- **Jumping the clock when something is ready.** The jump is guarded by `!waiting.some(job => job.arrival <= now)`. Jumping unconditionally would pull `now` backwards to an already-passed arrival.
- **Sorting instead of heaping.** `ready.sort(comparator)[0]` produces the same answers and passes the file. The prompt says "heap-order" and the CONTRACT says structural requirements need source review.
- **Carrying the heap across rounds.** With `aging > 0` the ranks of two waiting jobs move apart as `now` grows, so a heap ordered at `now = 5` can be wrong at `now = 6`. The prompt spells this out: "Rebuild ready heap as aging changes".
- **Losing the input order.** The tie-break is on position in `input`. If you sort or filter before recording `index`, ties resolve arbitrarily — the `priority === 5` iteration of the second loop is exactly the case that catches it.
- **Mutating the caller's jobs.** Writing `job.index = i` onto the input rows fails `'Input must not mutate'`. Spread a copy.
- **Removing the dispatched job by id.** Ids are unique in these tests, so `filter(j => j.id !== job.id)` happens to work; `indexOf` on the object is what the reference does, and it is the honest statement of "remove this one".
- **Applying `aging` before negating for `high`.** The expression is `(direction === 'high' ? -priority : priority) - aging * wait`. Negating the whole thing for `high` would also flip the aging bonus into a penalty.

## Try it yourself

1. Add a `direction=fifo` policy that ignores priority entirely and dispatches by arrival, then input order. How much of `rank` survives?
2. Replace the rebuild-every-round heap with a single heap that is only rebuilt when `cfg.aging !== 0`. Verify 1749 and 1754 still pass, and say in one sentence why the shortcut is safe only for those two.
3. Add the completed job's waiting time (`start - arrival`) to each record. Which of the twelve `priority` iterations shows the largest difference between 1749 and 1753?
4. In words: `heap[0]` is read but the heap is never popped, so no sift-down is ever written. Explain why the code is still correct, and what would have to change if two jobs were dispatched per round.
