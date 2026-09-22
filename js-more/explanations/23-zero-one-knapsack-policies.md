# Zero-one knapsack policies — js-more 1939–1948

**What you practise:** the 0/1 knapsack dynamic program, written so that it carries the chosen items along with the value, and a tie-break rule that makes the answer unique.
**Prerequisites:** one-dimensional dynamic programming over a capacity axis; why the inner loop runs backwards; spread syntax for copying arrays; comparing arrays deterministically.
**Exercises:** 1939: capacity=4; tie=lighter, 1940: capacity=4; tie=heavier, 1941: capacity=5; tie=lighter, 1942: capacity=5; tie=heavier, 1943: capacity=6; tie=lighter, 1944: capacity=6; tie=heavier, 1945: capacity=7; tie=lighter, 1946: capacity=7; tie=heavier, 1947: capacity=8; tie=lighter, 1948: capacity=8; tie=heavier.

## The problem in plain words

You are given a list of items, each with an `id`, a positive integer `weight` and a non-negative `value`, and a capacity. Choose a subset whose total weight fits the capacity and whose total value is as large as possible. "Zero-one" means each item is either taken or not — no halves, no duplicates.

Maximum value alone does not pin down an answer: two different subsets can be worth the same. So the prompt adds a full ordering. Among equally valuable selections, prefer the lighter total weight — or the heavier one, under the other policy. If value *and* weight are equal, compare the JSON of the id arrays and take the smaller string.

That last rule sounds arbitrary, and it is: its job is not to be meaningful but to be *total*, so that the reference and the brute-force oracle can never disagree.

The result is not just a number. It is `{value, ids, weight}` — the total value, the chosen ids in the order the items were given, and the total weight.

"Policy" is two knobs: the capacity, and which side of a weight tie wins.

## The contract you must honour

Taken from `tests/1939.cjs`, which compares against a brute force over all `2**items.length` subsets:

- `check([], {value:0, ids:[], weight:0})` — an empty item list gives the empty selection, not `null`.
- The return shape is exactly `{value, ids, weight}`.
- `ids` is in original item order. The oracle builds it with `items.filter((_, i) => mask & (1 << i)).map(x => x.id)`, which walks the input from left to right.
- The ordering, quoted from the oracle: `candidate.value > best.value || (candidate.value === best.value && (weight !== best.weight ? (cfg.tie === 'lighter' ? weight < best.weight : weight > best.weight) : JSON.stringify(candidate.ids) < JSON.stringify(best.ids)))`.
- The same items are tested in two orders — `check(items, oracle(items))` and `check([...items].reverse(), oracle([...items].reverse()))` — so `ids` genuinely follows the input order rather than a fixed one.
- `assert.throws(()=>solve([{id:'a', weight:0, value:9}]), /Weight/)`. The reference throws `new RangeError('Weight')`; a non-integer or non-positive weight qualifies.
- `check` clones the input and ends with `deep(input, before, 'Input must not mutate')`.
- The prompt says "Dynamic programming". A brute force over subsets would pass the visible cases; the `CONTRACT` section is explicit that structural requirements need source review.

## Approach

1. Make `dp` an array of `cfg.capacity + 1` entries, each the empty selection `{value: 0, ids: [], weight: 0}`. `dp[w]` will hold the best selection that fits in capacity `w`.
2. Write `better(a, b)` as the ordering above, in three steps: value, then weight under `cfg.tie`, then `JSON.stringify(a.ids) < JSON.stringify(b.ids)`.
3. For each item: validate the weight, then loop `w` from `cfg.capacity` down to `item.weight`. The candidate that includes this item is built from `dp[w - item.weight]` — the best selection in the leftover capacity — with the item appended.
4. Assign `dp[w] = better(dp[w], candidate)`.
5. Return `dp[cfg.capacity]`.

The descending inner loop is the whole reason this is 0/1 rather than unbounded. When `w` counts down, `dp[w - item.weight]` has not yet been touched during this item's pass, so it still describes selections made *without* the current item. Counting up would let the item be picked twice.

Cost: O(items × capacity) cells, each doing an array copy for `ids`.

## Worked example — 1939 Zero-one knapsack policies / scenario 1 — capacity=4; tie=lighter

The items, quoted from `tests/1939.cjs`:

```js
const items = [
  {id:'a', weight:2, value:4},
  {id:'b', weight:3, value:4},
  {id:'c', weight:4, value:8},
  {id:'d', weight:1, value:0},
  {id:'e', weight:5, value:9}
];
```

`cfg.capacity` is 4, `cfg.tie` is `'lighter'`. `dp` starts as five copies of `{value:0, ids:[], weight:0}`.

**Item `a` (w 2, v 4).** `w` runs 4, 3, 2. Each candidate is built from `dp[w-2]`, which is still empty, so each is `{4, ['a'], 2}` and beats the empty `dp[w]` on value.

| `dp[0]` | `dp[1]` | `dp[2]` | `dp[3]` | `dp[4]` |
| --- | --- | --- | --- | --- |
| `{0,[],0}` | `{0,[],0}` | `{4,[a],2}` | `{4,[a],2}` | `{4,[a],2}` |

**Item `b` (w 3, v 4).** `w` runs 4, 3.

- `w = 4`: candidate from `dp[1]` is `{4, ['b'], 3}`. Against `dp[4] = {4, ['a'], 2}`: values tie at 4, weights differ (2 versus 3), and `tie=lighter` keeps the weight-2 selection. `dp[4]` is unchanged.
- `w = 3`: candidate `{4, ['b'], 3}` versus `{4, ['a'], 2}` — same comparison, same outcome.

The row is unchanged. This is the tie policy doing visible work: under 1940 (`tie=heavier`) both cells would flip to `{4, ['b'], 3}`.

**Item `c` (w 4, v 8).** `w = 4` only. Candidate from `dp[0]` is `{8, ['c'], 4}`, and 8 > 4, so `dp[4] = {8, ['c'], 4}`.

**Item `d` (w 1, v 0).** `w` runs 4, 3, 2, 1.

- `w = 4`: candidate from `dp[3] = {4,[a],2}` is `{4, ['a','d'], 3}`; `dp[4]` is worth 8, so it keeps its place.
- `w = 3`: candidate from `dp[2]` is `{4, ['a','d'], 3}`; against `{4, ['a'], 2}` the values tie and the lighter wins — `dp[3]` unchanged.
- `w = 2`: candidate `{0, ['d'], 1}` loses on value.
- `w = 1`: candidate `{0, ['d'], 1}` against `{0, [], 0}` — values tie at 0, weights 0 versus 1, lighter keeps the empty selection.

**Item `e` (w 5, v 9).** The loop starts at `w = 4` and requires `w >= 5`, so it never runs. An item heavier than the capacity can never be taken.

Result: `dp[4] = {value: 8, ids: ['c'], weight: 4}`.

The brute force agrees: with capacity 4 the candidate subsets are `{}` (0), `{a}` (4), `{b}` (4), `{d}` (0), `{a,d}` (4, weight 3), `{b,d}` (4, weight 4) and `{c}` (8, weight 4). Eight is the best value and only `{c}` achieves it, so no tie-break is needed at the top — the ties were all resolved on the way.

The test then reverses the item list and checks again. Reversed, the same subset wins, but `ids` would come out as `['c']` either way; for a selection of two items the order in `ids` follows the reversed input.

The reference solution, as it now reads in `solutions/1939.cjs`:

```js
function knapsack(input) {
  const dp = Array.from({ length: cfg.capacity + 1 }, () => ({ value: 0, ids: [], weight: 0 }));
  const better = (a, b) => {
    if (a.value !== b.value) {
      return a.value > b.value ? a : b;
    }
    if (a.weight !== b.weight) {
      return (cfg.tie === 'lighter' ? a.weight < b.weight : a.weight > b.weight) ? a : b;
    }
    return JSON.stringify(a.ids) < JSON.stringify(b.ids) ? a : b;
  };

  for (const item of input) {
    if (!Number.isInteger(item.weight) || item.weight <= 0) {
      throw new RangeError('Weight');
    }
    for (let w = cfg.capacity; w >= item.weight; w--) {
      const without = dp[w - item.weight];
      dp[w] = better(dp[w], {
        value: without.value + item.value,
        ids: [...without.ids, item.id],
        weight: without.weight + item.weight
      });
    }
  }

  return dp[cfg.capacity];
}
```

## Policy matrix — what changes between the variants

| ID | Variant | Semantic key | What differs in the code |
| --- | --- | --- | --- |
| 1939 | capacity=4; tie=lighter | `{"capacity":4,"tie":"lighter"}` | `dp` has 5 cells; the tie line reads `a.weight < b.weight` |
| 1940 | capacity=4; tie=heavier | `{"capacity":4,"tie":"heavier"}` | the tie line reads `a.weight > b.weight` |
| 1941 | capacity=5; tie=lighter | `{"capacity":5,"tie":"lighter"}` | 6 cells; lighter wins ties |
| 1942 | capacity=5; tie=heavier | `{"capacity":5,"tie":"heavier"}` | 6 cells; heavier wins ties |
| 1943 | capacity=6; tie=lighter | `{"capacity":6,"tie":"lighter"}` | 7 cells; lighter wins ties |
| 1944 | capacity=6; tie=heavier | `{"capacity":6,"tie":"heavier"}` | 7 cells; heavier wins ties |
| 1945 | capacity=7; tie=lighter | `{"capacity":7,"tie":"lighter"}` | 8 cells; item `e` (weight 5) becomes reachable |
| 1946 | capacity=7; tie=heavier | `{"capacity":7,"tie":"heavier"}` | 8 cells; heavier wins ties |
| 1947 | capacity=8; tie=lighter | `{"capacity":8,"tie":"lighter"}` | 9 cells; `e` can now be combined with `a` or `b` |
| 1948 | capacity=8; tie=heavier | `{"capacity":8,"tie":"heavier"}` | 9 cells; heavier wins ties |

Two axes: five capacities × two tie rules. The capacity knob is not only a table width — it changes which items are reachable at all, which is why `e` (weight 5) is dead weight in 1939–1944 and live from 1945 on.

## Pitfalls the tests are designed to catch

- **Counting up in the inner loop.** `for (let w = item.weight; w <= cfg.capacity; w++)` turns this into the unbounded knapsack, where an item can be taken repeatedly. The five-item test has small weights, so it shows up quickly as an over-large value.
- **Storing only the value.** Then `ids` has to be reconstructed by a traceback, and the traceback has to reproduce the tie policy exactly. Carrying the selection in the cell avoids a second implementation of the same rule.
- **Sharing the `ids` array between cells.** `without.ids.push(item.id)` mutates the array that `dp[w - item.weight]` still holds. `[...without.ids, item.id]` makes a copy; the aliasing bug shows up as ids appearing in cells that never chose them.
- **An incomplete ordering.** Stopping after value and weight leaves genuine ties to whichever candidate happened to be compared first; the oracle compares JSON strings, so the reference must too.
- **Comparing id arrays with `<` directly.** `['a','b'] < ['a','c']` coerces both to strings and happens to work here, but `JSON.stringify` is what the oracle uses and what the prompt names ("lexical JSON id array").
- **Accepting weight 0.** `assert.throws(…, /Weight/)` uses `{id:'a', weight:0, value:9}`. The guard is `item.weight <= 0`, plus `Number.isInteger`.
- **Validating weights up front in a separate pass.** Harmless here, but note the reference throws as it reaches the bad item, so a valid prefix has already been processed — no observable difference, because the throw discards everything.
- **Returning `dp[cfg.capacity]` by reference and then mutating it.** Nothing in this family does, but `dp` cells are shared objects: `dp[4]` and `dp[3]` can be the same object.

## Checking your work

```text
node js-more/verify.cjs --id=1939
node js-more/verify.cjs --starters --id=1939
```

Print `dp` after each item for the five-item list. If `dp[4]` is anything other than `{4,['a'],2}` after item `b`, your tie policy is inverted.

## Try it yourself

1. Add a policy `tie='fewest'` preferring the selection with fewer items. Where does it sit in `better`, above or below the weight rule, and does the test's brute force still agree?
2. Make the table two-dimensional (`dp[i][w]`) and reconstruct `ids` by walking backwards. Which version is easier to get the tie rule right in?
3. Items are validated as they are reached. Write the two-line change that validates them all first, and say what becomes observable.
4. In words: explain why the descending inner loop makes each item usable at most once, naming the cell that would otherwise already contain the item.
