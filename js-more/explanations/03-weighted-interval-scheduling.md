# Weighted interval scheduling — js-more 1739–1748

**What you practise:** a one-dimensional dynamic program over intervals sorted by end time, with a binary search for the last compatible job and a tie-break that compares whole schedules rather than totals.
**Prerequisites:** [01 LFU cache eviction](01-lfu-cache-eviction.md) for comparator chaining; binary search on a sorted array; why `Array.prototype.sort` needs a copy when the input must survive; `JSON.stringify` on an array of strings.
**Exercises:** 1739: gap=0; tie=fewer, 1740: gap=0; tie=more, 1741: gap=1; tie=fewer, 1742: gap=1; tie=more, 1743: gap=2; tie=fewer, 1744: gap=2; tie=more, 1745: gap=3; tie=fewer, 1746: gap=3; tie=more, 1747: gap=4; tie=fewer, 1748: gap=4; tie=more.

## The problem in plain words

The input is an array of jobs, `{id, start, end, value}`. Ids are unique lowercase ASCII strings, `start < end`, and `value` is non-negative. Pick a set of jobs that do not overlap, so that the total value is as large as possible, and return `{value, ids}` with the ids in time order.

"Do not overlap" is looser or stricter depending on the policy. The prompt words it as "consecutive jobs require `previous.end + gap <= next.start`". With `gap` at 0, a job that ends at 4 and one that starts at 4 are compatible. With `gap` at 2, the second job has to start at 6 or later. The ten exercises run `gap` from 0 to 4.

The second policy knob decides what happens when two different schedules reach the same total value. `tie=fewer` prefers the schedule with fewer jobs, `tie=more` the one with more. If the counts are equal too, the smaller `JSON.stringify(ids)` wins. That last rule is what makes the answer unique, and it is why the dynamic program has to carry the id list along rather than only a running total.

Doing nothing is a legal schedule: for an empty input the answer is `{value:0, ids:[]}`.

## The contract you must honour

Taken from `prompts/1739.txt` and `tests/1739.cjs`:

- The input is the jobs array itself, not an object wrapping it. `solve([])` is the first assertion and must return `{value:0,ids:[]}`.
- The return value is `{value, ids}` — a total and an array of id strings, in increasing time order.
- Compatibility is `previous.end + cfg.gap <= next.start`. The test's brute-force `oracle` rejects a candidate set with `selected.some((x,i)=>i&&selected[i-1].end+cfg.gap>x.start)` after sorting that set by end time, so it applies the same rule.
- Tie-breaking is, in order: larger `value`; then `cfg.tie` on `ids.length`; then smaller `JSON.stringify(ids)`. The oracle spells out the same chain, so the answer is pinned down exactly — there is no "any optimal schedule" latitude.
- `check` clones the input and asserts `'Input must not mutate'`. `sort` is in place, so the reference sorts a copy.
- The second block of the test runs six inputs, one per `gap` value from 0 to 5, but `cfg.gap` stays whatever the scenario fixed. The loop variable only moves the jobs apart; it does not change the policy.
- The prompt's CONTRACT adds the usual "Algorithmic complexity/structural sharing requirements also need source review". The intended shape is sort plus binary search per job, not the exponential enumeration the oracle uses.

## Approach

1. Copy and sort: `const jobs = [...input].sort((left, right) => left.end - right.end || (left.id < right.id ? -1 : 1))`. After this, "every job that could precede job `i`" is a prefix of `jobs`, because compatibility only depends on end times. The id tie-break makes the sorted order deterministic when two jobs end together.
2. Keep `best`, an array of answers, where `best[i]` is the best schedule using only the first `i` sorted jobs. Seed it with `best[0] = {value: 0, ids: []}`. Storing the whole answer, not just the number, is what lets the tie-break look at `ids`.
3. Write the policy once, in a `better(left, right)` helper: value, then `cfg.tie` on length, then `JSON.stringify` order.
4. For each job `i`, binary-search the largest `lo` such that every job before index `lo` ends early enough: the loop narrows `[lo, hi]` while `jobs[mid].end + cfg.gap <= jobs[i].start`. `best[lo]` is then the best schedule that job `i` may be appended to.
5. Push `better(best[i], {value: best[lo].value + jobs[i].value, ids: [...best[lo].ids, jobs[i].id]})`. `best[i]` is "skip job `i`"; the object built here is "take job `i`".
6. Return `best.at(-1)`.

The sort is O(n log n), the loop is n binary searches at O(log n) each plus an O(k) array copy for the ids, so the whole thing is O(n log n) in comparisons. The oracle in the test is O(2^n), which is why its inputs are six jobs and three jobs.

Because `ids` is rebuilt with a spread on every step, no entry of `best` is ever mutated after it is stored. That matters: `best[lo]` may be read again by a later job, and an in-place `push` would corrupt it.

## Worked example — 1739 Weighted interval scheduling / scenario 1

The hand-written job list, quoted from line 9 of `tests/1739.cjs`:

```js
const jobs=[{id:'c',start:0,end:8,value:10},{id:'a',start:0,end:2,value:5},{id:'b',start:2,end:4,value:5},{id:'d',start:5,end:6,value:0},{id:'e',start:9,end:11,value:6},{id:'f',start:13,end:15,value:6}];check(jobs,oracle(jobs));
```

With `cfg = {"gap":0,"tie":"fewer"}`, sorting by end time gives:

| index | id | start | end | value |
| --- | --- | --- | --- | --- |
| 0 | `a` | 0 | 2 | 5 |
| 1 | `b` | 2 | 4 | 5 |
| 2 | `d` | 5 | 6 | 0 |
| 3 | `c` | 0 | 8 | 10 |
| 4 | `e` | 9 | 11 | 6 |
| 5 | `f` | 13 | 15 | 6 |

Now the loop, with `best[0] = {value:0, ids:[]}`:

| i | job | `lo` (binary search) | skipping = `best[i]` | taking | `better` picks | `best[i+1]` |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | `a` start 0 | 0 — nothing precedes it | `{0,[]}` | `{5,['a']}` | higher value | `{5,['a']}` |
| 1 | `b` start 2 | 1 — `a` ends at 2, and `2+0<=2` | `{5,['a']}` | `{10,['a','b']}` | higher value | `{10,['a','b']}` |
| 2 | `d` start 5 | 2 — `b` ends at 4, `4+0<=5` | `{10,['a','b']}` | `{10,['a','b','d']}` | equal value, `tie=fewer` keeps 2 jobs | `{10,['a','b']}` |
| 3 | `c` start 0 | 0 — `a` ends at 2, `2+0<=0` is false | `{10,['a','b']}` | `{10,['c']}` | equal value, `tie=fewer` takes 1 job | `{10,['c']}` |
| 4 | `e` start 9 | 4 — `c` ends at 8, `8+0<=9` | `{10,['c']}` | `{16,['c','e']}` | higher value | `{16,['c','e']}` |
| 5 | `f` start 13 | 5 — `e` ends at 11, `11+0<=13` | `{16,['c','e']}` | `{22,['c','e','f']}` | higher value | `{22,['c','e','f']}` |

`best.at(-1)` is `{value:22, ids:['c','e','f']}`, and `ids` is in time order because each step appended to a schedule made only of earlier-ending jobs.

Row `i = 2` is the `value: 0` job doing its job. Adding `d` costs nothing and gains nothing, so the totals tie at 10 and only the policy separates them. Under `tie=fewer` (1739) `d` is dropped; under `tie=more` (1740) the same input keeps it and the answer becomes `{22,['a','b','d','e','f']}` — the value is the same, the schedule is not.

Row `i = 3` shows why the ids have to be carried. `{10,['a','b']}` and `{10,['c']}` are worth the same, and the choice between them is made on length alone. A dynamic program that stored only numbers could not make it.

The second block of the test is smaller and isolates `gap` directly:

```js
for(let gap=0;gap<=5;gap++){const rows=[{id:'a',start:0,end:1,value:2},{id:'b',start:1+gap,end:2+gap,value:2},{id:'c',start:0,end:2+gap,value:4}];check(rows,oracle(rows));}
```

Take the first iteration, `gap` variable 0, still under `cfg.gap = 0`. Sorted by end: `a`(end 1), `b`(end 2), `c`(end 2) — `b` before `c` because `'b' < 'c'`.

| i | job | `lo` | skipping | taking | result |
| --- | --- | --- | --- | --- | --- |
| 0 | `a` | 0 | `{0,[]}` | `{2,['a']}` | `{2,['a']}` |
| 1 | `b` start 1 | 1, since `1+0<=1` | `{2,['a']}` | `{4,['a','b']}` | `{4,['a','b']}` |
| 2 | `c` start 0 | 0, since `1+0<=0` is false | `{4,['a','b']}` | `{4,['c']}` | tie on value, `fewer` → `{4,['c']}` |

So 1739 answers `{value:4, ids:['c']}` and 1740 answers `{value:4, ids:['a','b']}` for the identical input. When the loop variable reaches `gap = 1` the rows become `a`(0–1), `b`(1–2), `c`(0–3); under `cfg.gap = 0` that changes nothing structurally, but under `cfg.gap = 1` (1741, 1742) `a` and `b` stop being compatible — `1 + 1 <= 1` is false — and the two-job schedule disappears.

The reference solution, as it now reads in `solutions/1739.cjs`:

```js
function weightedIntervals(input) {
  const jobs = [...input].sort((left, right) => left.end - right.end || (left.id < right.id ? -1 : 1));
  const best = [{value: 0, ids: []}];
  const better = (left, right) => {
    if (left.value !== right.value) return left.value > right.value ? left : right;
    if (left.ids.length !== right.ids.length) {
      const leftWins = cfg.tie === 'fewer'
        ? left.ids.length < right.ids.length
        : left.ids.length > right.ids.length;
      return leftWins ? left : right;
    }
    return JSON.stringify(left.ids) < JSON.stringify(right.ids) ? left : right;
  };
  for (let i = 0; i < jobs.length; i++) {
    // Binary search for the number of sorted jobs that job i may follow.
    let lo = 0;
    let hi = i;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (jobs[mid].end + cfg.gap <= jobs[i].start) lo = mid + 1;
      else hi = mid;
    }
    const prior = best[lo];
    const taking = {value: prior.value + jobs[i].value, ids: [...prior.ids, jobs[i].id]};
    const skipping = best[i];
    best.push(better(skipping, taking));
  }
  return best.at(-1);
}
```

## Policy matrix — what changes between the variants

`cfg.gap` appears in exactly one expression, the binary-search predicate. `cfg.tie` appears in exactly one expression, the length clause of `better`.

| ID | Variant | What differs in the prompt | What differs in the code |
| --- | --- | --- | --- |
| 1739 | gap=0; tie=fewer | `{"gap":0,"tie":"fewer"}` | predicate `end + 0 <= start`; equal-value ties keep the shorter schedule |
| 1740 | gap=0; tie=more | `{"gap":0,"tie":"more"}` | same predicate; equal-value ties keep the longer schedule |
| 1741 | gap=1; tie=fewer | `{"gap":1,"tie":"fewer"}` | predicate `end + 1 <= start`; shorter schedule on ties |
| 1742 | gap=1; tie=more | `{"gap":1,"tie":"more"}` | predicate `end + 1 <= start`; longer schedule on ties |
| 1743 | gap=2; tie=fewer | `{"gap":2,"tie":"fewer"}` | predicate `end + 2 <= start`; shorter schedule on ties |
| 1744 | gap=2; tie=more | `{"gap":2,"tie":"more"}` | predicate `end + 2 <= start`; longer schedule on ties |
| 1745 | gap=3; tie=fewer | `{"gap":3,"tie":"fewer"}` | predicate `end + 3 <= start`; shorter schedule on ties |
| 1746 | gap=3; tie=more | `{"gap":3,"tie":"more"}` | predicate `end + 3 <= start`; longer schedule on ties |
| 1747 | gap=4; tie=fewer | `{"gap":4,"tie":"fewer"}` | predicate `end + 4 <= start`; shorter schedule on ties |
| 1748 | gap=4; tie=more | `{"gap":4,"tie":"more"}` | predicate `end + 4 <= start`; longer schedule on ties |

The `JSON.stringify` clause is the same in all ten and is only reached when value and length both tie.

## Pitfalls the tests are designed to catch

- **Sorting the input in place.** `input.sort(...)` reorders the caller's array and fails `'Input must not mutate'`. `[...input].sort(...)` is the fix.
- **Sorting by start instead of end.** The prefix property the binary search relies on — "all compatible jobs come before index `lo`" — only holds when the array is ordered by end time.
- **Using `<` instead of `<=` in the compatibility test.** With `gap = 0`, jobs `a`(0–2) and `b`(2–4) are compatible; a strict `<` would reject them and the six-job case would lose 5 of its 22.
- **Greedy selection.** Taking the highest-value compatible job at each step gets `c` first and then `e`, `f` for 22 here, but it is not optimal in general and it would not reproduce the oracle across the gap loop.
- **Storing only totals.** Rows `i = 2` and `i = 3` of the trace both tie on value. Without the id lists there is nothing to break the tie with, and the result would depend on which branch you happened to write first.
- **Mutating a stored schedule.** `prior.ids.push(jobs[i].id)` corrupts `best[lo]`, which a later job may still read. Build a new array.
- **Comparing id sequences with `<` on the array.** `['a','b'] < ['c']` coerces both to strings and happens to agree with `JSON.stringify` here, but the prompt names the JSON form, and the oracle uses `JSON.stringify` literally.
- **Reversing the `tie` sense.** `fewer` prefers `left` when `left.ids.length < right.ids.length`, where `left` is the skip branch. Swapping the arguments to `better` inverts the policy without changing any totals, so `value` still matches and only `ids` fails.

## Try it yourself

1. Add a `tie=lexical-first` policy that skips the length rule and goes straight to the `JSON.stringify` comparison. Which row of the six-job trace changes?
2. The binary search assumes the array is sorted by end. Rewrite it as a linear scan backwards from `i` and measure how much of the code that removes — then say what input size makes the difference matter.
3. Make the function also return the jobs it rejected, in time order. Does that need a second pass, or can it come out of `best`?
4. In words: `best[i]` is indexed by "number of sorted jobs considered", while `lo` is indexed by "number of jobs that finish early enough". Explain why those two indexes can be used against the same array, and what would break if the sort had been by start time.
