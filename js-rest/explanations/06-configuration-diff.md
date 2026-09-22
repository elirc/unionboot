# Configuration diff — js-rest 124–127

**What you practise:** comparing two flat objects by own properties and classifying every key into exactly one of four buckets.
**Prerequisites:** `Object.keys`, `Object.hasOwn`, `Set`; the difference between `===`, `==` and `Object.is`; what "own property" means.
**Exercises:** 124: Configuration diff: added, 125: Configuration diff: removed, 126: Configuration diff: changed, 127: Configuration diff: unchanged.

## The problem in plain words

The input is `{before, after}`, two plain objects whose values are primitives. Think of a settings file at two points in time. You want to describe the difference in the vocabulary a human would use: which settings appeared, which disappeared, which were edited, which stayed put.

Each key falls into exactly one of those four buckets, decided by two questions: is the key present on each side, and — if present on both — are the two values the same value?

"Policy" here is which bucket to report. The classification logic is the same in all four files; only the boolean expression in the filter differs.

Two subtleties carry the exercise. First, "present" must mean *the object has this key*, not *the value is not undefined* — those come apart the moment a value is legitimately `undefined`. Second, "same value" is `Object.is`, not `===`, which changes the answer for `NaN` and for `-0`.

## The contract you must honour

Taken from `tests/124.cjs` through `tests/127.cjs`:

- The shared case `{"before":{"a":1,"b":2,"c":3},"after":{"a":1,"b":4,"d":5}}` asserts `["d"]` for added, `["c"]` for removed, `["b"]` for changed and `["a"]` for unchanged. The four results partition the four keys with no overlap and nothing left over.
- `{"before":{},"after":{}}` asserts `[]` in all four.
- `{"before":{"x":null},"after":{"x":null}}` asserts `[]` for added, removed and changed, and `["x"]` for unchanged. `null` is a value like any other and is equal to itself.
- The return value is an array of key strings in lexical order. The prompt says "lexically sorted keys"; the visible data is already sorted after filtering, so only the reviewer and larger inputs see the difference.
- Every case ends with `assert.deepEqual(input, before, 'Input must not mutate')` against a `structuredClone`. Neither object may gain or lose a key.
- Nothing in the tests exercises `NaN`, `-0` or an `undefined` value, so `Object.is` versus `===` and `hasOwn` versus a truthiness check are requirements from the prompt, not facts the assertions check.

## Approach

1. Destructure `const { before, after } = input;` for readability. This only reads.
2. Build the union of keys: `[...new Set([...Object.keys(before), ...Object.keys(after)])]`. `Object.keys` returns own enumerable string keys only, so inherited properties never enter. The `Set` removes the keys both sides share.
3. Filter that array with the variant's rule. Compute the two membership facts first — `Object.hasOwn(before, key)` and `Object.hasOwn(after, key)` — so the rule reads as a sentence.
4. Sort the filtered array with `.sort()`. Default sort compares as strings, which is what "lexically sorted" means. The array is one you built, so sorting it in place is safe.
5. Return it.

Cost: O(n + m) to build the union, O(k) to filter, O(k log k) to sort.

`Object.hasOwn(obj, key)` is the modern replacement for `Object.prototype.hasOwnProperty.call(obj, key)`. It answers "does this object itself carry this key", ignoring the prototype chain, and it is true even when the stored value is `undefined`. Writing `before[key] !== undefined` instead conflates "absent" with "present and undefined" and, on an object with a normal prototype, is fooled by inherited names.

`Object.is(a, b)` is `===` with two corrections: `Object.is(NaN, NaN)` is `true` where `NaN === NaN` is `false`, and `Object.is(0, -0)` is `false` where `0 === -0` is `true`. For a diff, both corrections are what you want: a setting that was `NaN` and still is has not changed, and a sign flip on zero has.

## Worked example — 124 Configuration diff: added

The first input in `tests/124.cjs`, on line 2, is the shared case:

```js
{"before":{"a":1,"b":2,"c":3},"after":{"a":1,"b":4,"d":5}}
```

| Step | State |
| --- | --- |
| `Object.keys(before)` | `["a","b","c"]` |
| `Object.keys(after)` | `["a","b","d"]` |
| spread both | `["a","b","c","a","b","d"]` |
| `new Set` | `{a, b, c, d}` |
| spread back | `["a","b","c","d"]` |

Now the filter, one row per candidate key:

| key | `hasOwn(before)` | `hasOwn(after)` | `!inBefore && inAfter` | kept |
| --- | --- | --- | --- | --- |
| `a` | true | true | false | no |
| `b` | true | true | false | no |
| `c` | true | false | false | no |
| `d` | false | true | **true** | yes |

The filtered array is `["d"]`, the sort leaves one element alone, and line 2 asserts `assert.deepEqual(solve(input),["d"])`.

Run the same table with the other three rules and you get `c` for removed (`inBefore && !inAfter`), `b` for changed (`2` against `4`, so `!Object.is` is true), and `a` for unchanged (`1` against `1`). Every key lands in exactly one bucket.

The third case, `{"before":{"x":null},"after":{"x":null}}`, is worth a line: `x` is on both sides and `Object.is(null, null)` is `true`, so it is unchanged, not changed — asserted as `["x"]` in `tests/127.cjs` and as `[]` in the other three.

The reference solution, as it now reads in `solutions/124.cjs`:

```js
function solve(input) {
  const { before, after } = input;
  const allKeys = [...new Set([...Object.keys(before), ...Object.keys(after)])];
  const selected = allKeys.filter(key => {
    const inBefore = Object.hasOwn(before, key);
    const inAfter = Object.hasOwn(after, key);
    return !inBefore && inAfter;
  });
  return selected.sort();
}
```

## Policy matrix — what changes between the variants

| ID | Variant | What differs in the prompt | What differs in the code |
| --- | --- | --- | --- |
| 124 | added | "keys that were added" | `!inBefore && inAfter` |
| 125 | removed | "keys that were removed" | `inBefore && !inAfter` |
| 126 | changed | "keys that were changed" | `inBefore && inAfter && !Object.is(before[key], after[key])` |
| 127 | unchanged | "keys that were unchanged" | `inBefore && inAfter && Object.is(before[key], after[key])` |

## Pitfalls the tests are designed to catch

- **Testing presence with truthiness.** `if (before[key])` treats `0`, `''`, `false` and `null` as absent. The third case stores `null` under `x` on both sides; a truthiness check reports it as neither present nor absent and fails 127's `["x"]`.
- **Testing presence with `!== undefined`.** Closer, but it still cannot distinguish a key that is missing from a key whose value is `undefined`. `Object.hasOwn` is the question you actually mean.
- **Using `in` instead of `Object.hasOwn`.** `'toString' in before` is `true` for every plain object, because `in` walks the prototype chain. `Object.keys` would not have produced that key, so it does not bite here — but it would the moment you iterate differently.
- **Using `===` instead of `Object.is` in 126 and 127.** The visible data never contains `NaN` or `-0`, so the tests stay green. The prompt names `Object.is`, and the reviewer reads the file. A config value of `NaN` compared with `===` is reported as changed on every run.
- **Only iterating one side.** Looping over `Object.keys(before)` finds removed and changed but can never find added; looping over `after` is the mirror. The union is what makes one shape serve all four.
- **Skipping the sort.** After filtering the shared case each variant has one key, so order is unobservable in the tests. The prompt says "lexically sorted keys"; with more keys an unsorted result is wrong.
- **Sorting `Object.keys(before)` in place.** `Object.keys` returns a fresh array, so this is actually safe — but sorting anything reached through `input` is not. Keep sorting to arrays you built.

## Checking your work

Run one exercise at a time:

```text
node js-rest/verify.cjs --id=124
```

Two requirements here come from the prompt rather than from an assertion, so read your own file:

- Is presence tested with `Object.hasOwn`, not with truthiness and not with `!== undefined`?
- Is value equality `Object.is`, not `===`?

And one the tests do cover only weakly: the result must be lexically sorted. Each variant selects a single key from the shared case, so ordering is unobservable in the suite.

A useful self-test the suite does not include:

```js
solve({before: {a: NaN, b: 0, c: 1}, after: {a: NaN, b: -0, c: 1}});
```

Under `Object.is`, `changed` is `["b"]` and `unchanged` is `["a","c"]`. Under `===` the answers swap for both keys, which is exactly the bug the prompt is guarding against.

## Try it yourself

1. Write a single function that returns all four buckets at once as `{added, removed, changed, unchanged}`. How many passes does it need?
2. Extend the comparison to nested objects, so `{a: {b: 1}}` against `{a: {b: 2}}` reports `a` as changed. What does "same value" now have to mean?
3. Add a `renamed` bucket: a key removed and a key added whose values are identical. Is that decidable from the input alone?
4. In words: give a configuration value for which `===` and `Object.is` disagree, and explain which answer a diff tool should report.
