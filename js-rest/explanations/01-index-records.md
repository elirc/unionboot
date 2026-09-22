# Index records — js-rest 104–107

**What you practise:** turning a list of records into a sorted key/value index while applying an explicit duplicate policy.
**Prerequisites:** `Map` methods `has`, `get`, `set`; `Array.prototype.sort` with a comparator; why a plain object is a poor dictionary for arbitrary string keys.
**Exercises:** 104: Index records: keep-first, 105: Index records: keep-last, 106: Index records: reject, 107: Index records: collect.

## The problem in plain words

You are handed `{rows: [{id, value}]}`. Each row is one observation: an identifier and a primitive value attached to it. Rows arrive in whatever order the caller had them, and the same identifier may appear more than once.

Your job is to fold those rows into an index — one entry per identifier — and hand it back as an array of `[id, value]` pairs sorted by identifier. The sort is what makes the result comparable between runs; the fold is what makes it an index rather than a list.

"Policy" here means: what happens when the same identifier shows up twice. There is no single right answer, which is exactly the point. A cache wants the newest write to win. An import validator wants a duplicate to be an error. A log grouper wants every value kept. The four exercises are the same twenty lines of code with that one decision changed.

The prompt also tells you which data structure to use and why: a `Map`. A plain object would turn an id of `'__proto__'` into a prototype reference rather than a data key, and `'constructor'` would appear to exist before you ever wrote it. A `Map` treats every string as an ordinary key.

## The contract you must honour

Taken from `tests/104.cjs` through `tests/107.cjs`:

- Input is `{rows: [...]}`. The rows array may be empty; `{"rows":[]}` must return `[]` in all four variants.
- The return value is an array of two-element arrays, `[id, value]`, not an object and not a `Map`.
- Ordering is ascending by id. With rows `[{"id":"b","value":2},{"id":"a","value":1}]` the asserted result is `[["a",1],["b",2]]`, so the output order is not the input order.
- 104 keeps the first value for a repeated id: rows `a→1` then `a→2` assert `[["a",1]]`.
- 105 keeps the last: the same rows assert `[["a",2]]`.
- 106 refuses duplicates. The test is `assert.throws(()=>solve(input), e=>e instanceof Error && e.message==="Duplicate id")`, so the thrown object must be an `Error` and the message must be exactly `Duplicate id` — not `Duplicate id: a`, not `duplicate id`.
- 107 always produces arrays. Even a single occurrence is wrapped: rows `b→2`, `a→1` assert `[["a",[1]],["b",[2]]]`, and the duplicate case asserts `[["a",[1,2]]]` with the values in the order they were read.
- Every case, including the throwing one, clones the input with `structuredClone` first and finishes with `assert.deepEqual(input, before, 'Input must not mutate')`. You may not sort `input.rows`, reverse it, or write into the row objects.

## Approach

1. Create an empty `Map`. It gives you insertion-order iteration and literal string keys, so `__proto__` is a key like any other.
2. Loop over `input.rows` once. For each row, apply the policy to decide what `map.set(row.id, …)` should do, or whether to throw.
3. Turn the map into an array of entries with `[...map]`. Spreading a `Map` yields `[key, value]` pairs, which is already the required output shape.
4. Sort that fresh array with an explicit comparator that compares ids as strings: `(left, right) => left[0] < right[0] ? -1 : left[0] > right[0] ? 1 : 0`. Sorting the entries array is safe because you built it; sorting `input.rows` would not be.
5. Return the sorted array.

The whole thing is O(n) for the fold plus O(k log k) for the sort, where k is the number of distinct ids. There is no cheaper shape available: you have to look at every row, and you have to order the distinct keys.

A note on the structure choice, because it recurs across this track. A `Map` is a separate key/value store with no inherited keys. A plain object inherits from `Object.prototype`, so `'toString' in obj` is true for an empty object, and assigning `obj['__proto__'] = 5` changes the object's prototype rather than storing a value. `Object.create(null)` avoids both problems but still coerces keys to strings and has no `size`. When a prompt in this track says "use a Map", that is the reason.

## Worked example — 104 Index records: keep-first

`tests/104.cjs` has three cases. Here is each one traced against the reference.

**Case 1, the first input in the file:** `{"rows":[]}`

| Step | Map contents | Notes |
| --- | --- | --- |
| loop | — | the loop body never runs |
| `[...map]` | `[]` | spreading an empty Map |
| `sort` | `[]` | sorting an empty array is a no-op |

Asserted on line 2: `assert.deepEqual(solve(input),[])`.

**Case 2:** `{"rows":[{"id":"b","value":2},{"id":"a","value":1}]}`

| Step | Action | Map contents |
| --- | --- | --- |
| row `b→2` | `has('b')` is false, so set | `{b: 2}` |
| row `a→1` | `has('a')` is false, so set | `{b: 2, a: 1}` |
| `[...map]` | insertion order | `[["b",2],["a",1]]` |
| `sort` | `'a' < 'b'`, so `a` moves first | `[["a",1],["b",2]]` |

Asserted on line 3: `assert.deepEqual(solve(input),[["a",1],["b",2]])`. Note that the Map is still in insertion order at step three — the sort, not the Map, is what fixes the output order.

**Case 3, the policy case:** `{"rows":[{"id":"a","value":1},{"id":"a","value":2}]}`

| Step | Action | Map contents |
| --- | --- | --- |
| row `a→1` | `has('a')` is false, so set | `{a: 1}` |
| row `a→2` | `has('a')` is **true**, so skip | `{a: 1}` |
| `[...map]` | one entry | `[["a",1]]` |
| `sort` | single element | `[["a",1]]` |

Asserted on line 4: `assert.deepEqual(solve(input),[["a",1]])`, followed by the mutation check.

The reference solution, as it now reads in `solutions/104.cjs`:

```js
function solve(input) {
  const valueById = new Map();
  for (const row of input.rows) {
    if (!valueById.has(row.id)) {
      valueById.set(row.id, row.value);
    }
  }
  const pairs = [...valueById];
  pairs.sort((left, right) => (left[0] < right[0] ? -1 : left[0] > right[0] ? 1 : 0));
  return pairs;
}
```

## Policy matrix — what changes between the variants

| ID | Variant | What differs in the prompt | What differs in the code |
| --- | --- | --- | --- |
| 104 | keep-first | "Duplicate policy: keep-first" | `set` is guarded by `if (!map.has(row.id))` |
| 105 | keep-last | "Duplicate policy: keep-last" | the guard is dropped; `set` is unconditional |
| 106 | reject | "reject throws Error for duplicates" | `if (map.has(row.id)) throw new Error("Duplicate id")` before the `set` |
| 107 | collect | "collect returns arrays even for a single value" | the value is an array: seed with `[]` on first sight, then `map.get(row.id).push(row.value)` |

## Pitfalls the tests are designed to catch

- **Using a plain object instead of a `Map`.** The visible tests only use ids `a` and `b`, so an object survives them, but the prompt states the requirement and the reviewer reads the source. `{}['__proto__']` is an object, not `undefined`, so the keep-first guard would misfire on that id.
- **Sorting `input.rows`.** `Array.prototype.sort` reorders in place. Every case ends with `assert.deepEqual(input, before, 'Input must not mutate')`, and `before` is a `structuredClone` taken before the call, so a reordered input fails with that message. Sort the entries array instead.
- **Relying on default sort order.** `sort()` with no comparator converts elements to strings; on `[["a",1],["b",2]]` that happens to work, but the moment values differ in type the comparison stops being about the id. The reference compares the ids explicitly.
- **Wrong error type in 106.** The predicate is `e instanceof Error && e.message==="Duplicate id"`. `throw "Duplicate id"` throws a string and fails the `instanceof` half.
- **Unwrapped single values in 107.** Case 2 asserts `[["a",[1]],["b",[2]]]`. Returning `[["a",1],["b",2]]` for ids seen once fails even though no id repeated.
- **Losing order inside a 107 group.** The duplicate case asserts `[["a",[1,2]]]`, so values must be appended, not unshifted.
- **Assuming a `Map` reorders on overwrite in 105.** It does not: `set` on an existing key updates the value and leaves the key where it was. That does not matter here only because the entries are sorted afterwards.

## Checking your work

Run one exercise at a time:

```text
node js-rest/verify.cjs --id=104
```

Three things to check by eye before you run it:

- Does anything you call `sort` on come from `input`? If yes, you have a mutation bug even if the tests happen to pass.
- Is your dictionary a `Map`? The prompt requires it and the reviewer reads the file.
- For 106, is the throw a `new Error(...)` with the exact string `Duplicate id`?

A useful self-test the suite does not include: feed `{rows:[{id:'__proto__',value:1}]}` to your solution. A `Map`-based version returns `[["__proto__",1]]`; an object-based one either returns `[]` or throws.

## Try it yourself

1. Add a fifth policy, `sum`, that adds numeric values for a repeated id and returns `[id, total]` pairs. Which line of the fold changes, and does the sort change at all?
2. Change the sort to descending without touching the fold. How many characters does it take?
3. Make 107 return groups sorted by group size, longest first, with ties broken by id. Where does that belong — in the fold, or after it?
4. In words: 105 overwrites the value but leaves the key in its original insertion position. Describe an output requirement that would make that difference visible, and say why it is invisible in these four exercises.
