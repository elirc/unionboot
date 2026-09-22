# Nearest point — js-rest 116–119

**What you practise:** finding an argmin — the *index* of the best element, not the element — under four different distance metrics, with a stable tie rule.
**Prerequisites:** `Math.abs`, `Math.hypot`, `Math.max`; why `<` and `<=` give different tie behaviour; array destructuring.
**Exercises:** 116: Nearest point: euclidean distance, 117: Nearest point: manhattan distance, 118: Nearest point: chebyshev distance, 119: Nearest point: squared distance.

## The problem in plain words

The input is `{origin: [x, y], points: [[x, y], ...]}`. All coordinates are finite numbers. You must return the index — a position in `points`, not the point itself — of the point closest to the origin.

A distance metric is just a rule for turning two coordinate gaps, `dx` and `dy`, into one number. The four variants use four standard rules, and they genuinely disagree: for origin `[0,0]` and points `[[2,2],[3,0]]`, euclidean says the first point wins (2.83 against 3) while manhattan says the second does (4 against 3).

"Policy" here is the metric. The scan, the tie rule and the empty case are shared.

Two details make this more than a one-liner. First, the answer is an index, so you cannot sort — sorting loses the original positions unless you carry them along, and sorting the input array is forbidden anyway. Second, ties go to the first point, which decides whether the comparison is `<` or `<=`.

## The contract you must honour

Taken from `tests/116.cjs` through `tests/119.cjs`:

- `{"origin":[0,0],"points":[]}` asserts `-1` in all four variants. That is the "no answer" marker; it is not `null` and not `undefined`.
- `{"origin":[0,0],"points":[[2,2],[3,0]]}` asserts `0` for 116, `1` for 117, `0` for 118 and `0` for 119. This is the case that separates manhattan from the rest.
- `{"origin":[1,1],"points":[[1,2],[2,1]]}` asserts `0` in all four. Both points are one unit away under every metric, so this is the tie case: the earlier index wins.
- The return value is a number: an index into `points`, or `-1`.
- Every case ends with `assert.deepEqual(input, before, 'Input must not mutate')` against a `structuredClone`. The prompt spells it out: "Do not sort/mutate input."

## Approach

1. Read the origin once: `const [originX, originY] = input.origin;`. Destructuring reads, it does not write.
2. Keep two running variables: `bestDistance`, seeded with `Infinity`, and `bestIndex`, seeded with `-1`.
3. Walk `points` by index with a plain `for` loop. You need the index, and you need it to be the *original* index.
4. For each point compute `dx = Math.abs(x - originX)` and `dy = Math.abs(y - originY)`, then apply the metric to get one number.
5. Replace the best only when `distance < bestDistance`. Strict less-than is the tie rule: a later point that merely equals the current best does not displace it.
6. Return `bestIndex`. An empty `points` array never enters the loop, so the `-1` seed falls straight through and no special case is needed.

One pass, O(n), no allocation beyond two numbers.

The four metrics, given `dx` and `dy` as absolute gaps:

| Metric | Formula | Informal meaning |
| --- | --- | --- |
| euclidean | `Math.hypot(dx, dy)` | straight-line distance |
| manhattan | `dx + dy` | walking along a street grid |
| chebyshev | `Math.max(dx, dy)` | how many king moves on a chessboard |
| squared | `dx*dx + dy*dy` | euclidean without the square root |

Squared distance deserves a note. It is not a distance in the geometric sense — the numbers are wrong — but squaring is monotonic on non-negative values, so it orders points exactly as euclidean does. For a nearest-point search that is all you need, and you skip a square root per point. That is why 116 and 119 assert the same answers on all three cases.

## Worked example — 116 Nearest point: euclidean distance

The first input in `tests/116.cjs` is `{"origin":[0,0],"points":[]}`. `bestIndex` stays at its `-1` seed and the loop body never runs, which line 2 asserts.

The second case, on line 3, is `{"origin":[0,0],"points":[[2,2],[3,0]]}`:

| index | point | `dx` | `dy` | `Math.hypot(dx, dy)` | `< bestDistance`? | `bestDistance` | `bestIndex` |
| --- | --- | --- | --- | --- | --- | --- | --- |
| — | — | — | — | — | — | `Infinity` | `-1` |
| 0 | `[2,2]` | 2 | 2 | 2.828… | yes | 2.828… | 0 |
| 1 | `[3,0]` | 3 | 0 | 3 | no | 2.828… | 0 |

Result `0`, asserted as `assert.deepEqual(solve(input),0)`. Under manhattan the same two rows give 4 and 3, so index 1 wins — that is exactly the assertion in `tests/117.cjs`.

The third case, on line 4, is the tie: origin `[1,1]`, points `[[1,2],[2,1]]`.

| index | point | `dx` | `dy` | distance | `< bestDistance`? | `bestIndex` |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | `[1,2]` | 0 | 1 | 1 | `1 < Infinity`, yes | 0 |
| 1 | `[2,1]` | 1 | 0 | 1 | `1 < 1`, no | 0 |

Result `0`. Change the comparison to `<=` and index 1 would win, failing this assertion in all four exercises at once.

The reference solution, as it now reads in `solutions/116.cjs`:

```js
function solve(input) {
  const [originX, originY] = input.origin;
  let bestDistance = Infinity;
  let bestIndex = -1;
  for (let index = 0; index < input.points.length; index++) {
    const [x, y] = input.points[index];
    const dx = Math.abs(x - originX);
    const dy = Math.abs(y - originY);
    const distance = Math.hypot(dx, dy);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  }
  return bestIndex;
}
```

## Policy matrix — what changes between the variants

| ID | Variant | What differs in the prompt | What differs in the code |
| --- | --- | --- | --- |
| 116 | euclidean | "nearest point by euclidean distance" | `const distance = Math.hypot(dx, dy)` |
| 117 | manhattan | "nearest point by manhattan distance" | `const distance = dx + dy` |
| 118 | chebyshev | "nearest point by chebyshev distance" | `const distance = Math.max(dx, dy)` |
| 119 | squared | "nearest point by squared distance" | `const distance = dx * dx + dy * dy` |

## Pitfalls the tests are designed to catch

- **Using `<=` in the comparison.** The third case of every exercise ties at distance 1 and asserts index `0`. `<=` makes the last tied point win and fails all four.
- **Sorting the points to find the smallest.** `input.points.sort(...)` fails `assert.deepEqual(input, before, 'Input must not mutate')`, and even a sorted copy loses the original indices the answer is made of.
- **Returning the point instead of its index.** `assert.deepEqual(solve(input), 0)` compares against a number; returning `[2,2]` fails.
- **Returning `null` or `undefined` for the empty case.** The first case of each test asserts exactly `-1`.
- **Forgetting `Math.abs` before a metric that needs it.** Manhattan on raw differences would give `-1 + 0 = -1` for a point below and left of the origin, which beats every real distance. Euclidean and squared survive without `abs` because squaring removes the sign; chebyshev and manhattan do not.
- **Mixing up chebyshev and manhattan.** `Math.max(dx, dy)` and `dx + dy` agree whenever one gap is zero, which is true for both points in the tie case — so only the `[[2,2],[3,0]]` case tells them apart.
- **Seeding `bestDistance` with `points[0]`'s distance but forgetting the empty guard.** Reading `input.points[0][0]` on an empty array throws `TypeError` instead of returning `-1`.

## Checking your work

Run one exercise at a time:

```text
node js-rest/verify.cjs --id=116
```

Three things to check by eye first:

- Is the comparison `<` and not `<=`? That single character is the tie rule, and all four exercises assert it.
- Are `dx` and `dy` wrapped in `Math.abs` before the metric is applied? Manhattan and chebyshev are wrong without it.
- Does the function return an index, seeded at `-1`, rather than a point or a distance?

A useful self-test the suite does not include: origin `[0,0]` with points `[[-3,0],[1,1]]`. Under manhattan the answer is index 1 (distance 2 against 3); a missing `Math.abs` gives `-3` for the first point and picks index 0.

## Try it yourself

1. Add a `farthest` variant under the euclidean metric. Which two lines change, and what should the tie rule be?
2. Make the metric a parameter so one function covers all four. What does that cost in readability, and would it still satisfy four separate prompts?
3. Extend the points to three dimensions. Which of the four formulas generalise unchanged, and which need a third term?
4. In words: explain why squared distance always picks the same index as euclidean, and give a task where substituting it would give the wrong answer.
