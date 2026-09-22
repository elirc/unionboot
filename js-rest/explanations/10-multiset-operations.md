# Multiset operations — js-rest 140–143

**What you practise:** set algebra that respects multiplicity, by counting occurrences into a `Map` instead of collapsing duplicates into a `Set`.
**Prerequisites:** [01 Index records](01-index-records.md) for `Map` folds; the counter idiom `map.set(k, (map.get(k) || 0) + 1)`; numeric sort comparators.
**Exercises:** 140: Multiset intersection, 141: Multiset union, 142: Multiset subtract, 143: Multiset symmetric.

## The problem in plain words

The input is `{a: number[], b: number[]}`. A multiset — sometimes called a bag — is a collection where an element can appear several times and the count matters. `[1,1,2]` is not the same multiset as `[1,2]`.

The four classical set operations all have multiset versions, and each is defined by a rule on the two counts. Intersection takes the smaller count, union the larger, subtraction the shortfall, symmetric difference the absolute gap. The prompt is explicit: "Do not treat duplicates as a simple set."

"Policy" is that count rule. Everything else — tally each side, collect the candidate values, sort them, emit each value the required number of times — is shared.

The result is sorted ascending, and a value that survives with count `k` appears `k` times in a row.

## The contract you must honour

Taken from `tests/140.cjs` through `tests/143.cjs`:

- `{"a":[1,1,2],"b":[1,3,3]}` asserts `[1]` for intersection, `[1,1,2,3,3]` for union, `[1,2]` for subtract and `[1,2,3,3]` for symmetric.
- `{"a":[],"b":[]}` asserts `[]` in all four.
- `{"a":[4,4],"b":[4,4]}` asserts `[4,4]` for intersection, `[4,4]` for union, `[]` for subtract and `[]` for symmetric. This is the case that proves the rules are on counts, not on membership: a plain set union would also say `[4]`, and a multiset union says `[4,4]` because `max(2, 2)` is 2 — not `[4,4,4,4]`, which is what concatenation would give.
- The return value is a flat array of numbers in ascending order.
- Every case ends with `assert.deepEqual(input, before, 'Input must not mutate')` against a `structuredClone`, so neither array may be sorted or spliced.

Work the first case through the union rule to see why `[1,1,2,3,3]` is right: `a` has `1` twice, `b` once, so `max(2, 1) = 2` copies of `1`; `2` appears once in `a` and zero times in `b`, so one copy; `3` appears zero times in `a` and twice in `b`, so two copies.

## Approach

1. Write a small `tally` helper that folds an array into a `Map` from value to count: `counts.set(value, (counts.get(value) || 0) + 1)`. The `|| 0` supplies the starting count for a value seen for the first time.
2. Tally both sides.
3. Build the candidate values: `[...new Set([...countsA.keys(), ...countsB.keys()])]`, then `sort((x, y) => x - y)`. The numeric comparator is required — the default sort would place `10` before `2`.
4. For each candidate value, read `inA` and `inB` (again `|| 0` for absent), apply the policy rule to get a repeat count, and push the value that many times.
5. Return the collected array.

Cost: O(n + m) to tally, O(k log k) to sort the k distinct values, plus the size of the output.

A `Map` is used rather than an object for the same reason as in family 01 — arbitrary keys without prototype surprises — and it keeps numeric keys as numbers, where an object would turn them into strings and `"10"` would sort before `"2"` in unexpected places.

## Worked example — 140 Multiset intersection

The first input in `tests/140.cjs`, on line 2, is `{"a":[1,1,2],"b":[1,3,3]}`.

Tallying:

| Side | Walk | Resulting counts |
| --- | --- | --- |
| `a` | `1` → 1, `1` → 2, `2` → 1 | `{1: 2, 2: 1}` |
| `b` | `1` → 1, `3` → 1, `3` → 2 | `{1: 1, 3: 2}` |

Candidate values: keys of `a` are `[1, 2]`, keys of `b` are `[1, 3]`; spread gives `[1, 2, 1, 3]`, the `Set` gives `{1, 2, 3}`, and the numeric sort gives `[1, 2, 3]`.

Now the emit loop under the intersection rule `min(inA, inB)`:

| value | `inA` | `inB` | `min` | pushed |
| --- | --- | --- | --- | --- |
| 1 | 2 | 1 | 1 | `1` |
| 2 | 1 | 0 | 0 | — |
| 3 | 0 | 2 | 0 | — |

Result `[1]`, asserted on line 2 as `assert.deepEqual(solve(input),[1])`.

The same table under the other three rules produces the other three assertions: union `max` gives `2, 1, 2` copies → `[1,1,2,3,3]`; subtract `max(inA - inB, 0)` gives `1, 1, 0` → `[1,2]`; symmetric `abs(inA - inB)` gives `1, 1, 2` → `[1,2,3,3]`. One trace, four answers.

The reference solution, as it now reads in `solutions/140.cjs`:

```js
function solve(input) {
  const tally = numbers => {
    const counts = new Map();
    for (const value of numbers) {
      counts.set(value, (counts.get(value) || 0) + 1);
    }
    return counts;
  };
  const countsA = tally(input.a);
  const countsB = tally(input.b);
  const allValues = [...new Set([...countsA.keys(), ...countsB.keys()])];
  allValues.sort((x, y) => x - y);
  const result = [];
  for (const value of allValues) {
    const inA = countsA.get(value) || 0;
    const inB = countsB.get(value) || 0;
    const repeats = Math.min(inA, inB);
    for (let i = 0; i < repeats; i++) {
      result.push(value);
    }
  }
  return result;
}
```

## Policy matrix — what changes between the variants

| ID | Variant | What differs in the prompt | What differs in the code |
| --- | --- | --- | --- |
| 140 | intersection | "Multiplicities use minimum" | `const repeats = Math.min(inA, inB)` |
| 141 | union | "Multiplicities use maximum" | `const repeats = Math.max(inA, inB)` |
| 142 | subtract | "Multiplicities use max(aCount-bCount,0)" | `const repeats = Math.max(inA - inB, 0)` |
| 143 | symmetric | "Multiplicities use absolute count difference" | `const repeats = Math.abs(inA - inB)` |

## Pitfalls the tests are designed to catch

- **Using a `Set` instead of counts.** A set intersection of `[1,1,2]` and `[1,3,3]` is `[1]`, which passes 140's first case by luck. It fails 141, where a set union gives `[1,2,3]` against the asserted `[1,1,2,3,3]`.
- **Implementing union as concatenation.** `[...a, ...b]` sorted gives `[1,1,1,2,3,3]` for the first case and `[4,4,4,4]` for the third — the asserted answers are `[1,1,2,3,3]` and `[4,4]`. Union is `max`, not sum.
- **Letting subtraction go negative.** Without the `Math.max(…, 0)` clamp, `3` in the first case has `inA - inB = -2`. `Array(-2)` throws `RangeError: Invalid array length`, and a naive loop just emits nothing — right answer, wrong reason. The clamp is the contract.
- **Default `sort()` on numbers.** `[2, 10].sort()` is `[10, 2]`. The visible data is single-digit, so only the reviewer and larger inputs see this.
- **Sorting `input.a`.** That fails `assert.deepEqual(input, before, 'Input must not mutate')`; sort the candidate array you built instead.
- **Iterating only `a`'s keys.** Union, symmetric and the emit loop all need values that appear only in `b`. The first case's `3` lives only in `b` and appears in two of the four asserted results.
- **Using an object as the tally.** Numeric keys become strings, so `counts` ends up keyed by `"1"`, and the values pushed into the result are strings. `assert.deepEqual` in `node:assert/strict` does not coerce, so `["1"]` fails against `[1]`.

## Checking your work

Run one exercise at a time:

```text
node js-rest/verify.cjs --id=140
```

Three things to check by eye first:

- Is the tally a `Map` keyed by numbers, not an object keyed by strings? An object turns `1` into `"1"` and the result array ends up full of strings.
- Is the candidate sort `(x, y) => x - y`?
- For 142, is the repeat count clamped with `Math.max(..., 0)`?

A useful self-test the suite does not include:

```js
solve({a: [2, 10, 10], b: [10]});
```

The candidate order must be `[2, 10]`, so intersection gives `[10]`, union `[2,10,10]`, subtract `[2,10]` and symmetric `[2,10]`. A default `sort()` puts `10` before `2` and every answer comes out in the wrong order.

## Try it yourself

1. Add a `sum` variant where multiplicities add, which is what concatenation gives. Which of the four assertions in each test file would it match?
2. Generalise the four into one function taking a `(inA, inB) => number` rule. Write the four rules as one-liners and check that each still reads clearly.
3. Make the values strings instead of numbers. Which line must change, and why does the `Map` survive unchanged?
4. In words: explain why multiset union takes the maximum rather than the sum, using the `{"a":[4,4],"b":[4,4]}` case as the example.
