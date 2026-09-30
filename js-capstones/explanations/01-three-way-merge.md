# Three-way document merge — js-capstones 3439

**What you practise:** merging two independent edits against a common ancestor, using a sentinel so that "key deleted" is a value the comparison can reason about.
**Prerequisites:** `Object.keys`, `Object.hasOwn` and `Object.fromEntries`; `Symbol` as a unique value; why a plain object is a hostile dictionary for arbitrary string keys.
**Exercises:** 3439: Merge independent flat-document edits.

## The problem in plain words

Two people started from the same document and edited it separately. You have all three versions: `base`, the ancestor they both began with, and `local` and `remote`, their results. Your job is to produce one merged document, plus the list of keys where the two edits genuinely disagreed.

The documents are flat: every own enumerable value is a string. There is no nesting, so every key can be decided on its own.

The rules, in the order the prompt states them, for each key:

1. If `local` and `remote` agree, take the agreed value. Nothing to decide.
2. Otherwise, if `local` still matches `base`, then `local` did not change this key and `remote` did — so take `remote`.
3. Otherwise, if `remote` still matches `base`, the mirror case — take `local`.
4. Otherwise both sides changed the key, and to different things. That is a conflict: record the key and keep `local`.

The word *absence* does a lot of work in those rules. A key missing from `local` means local deleted it, and deletion is an edit like any other. So "`local` matches `base`" has to be true when both are absent, and "`local` and `remote` agree" has to be true when both deleted the key. Absence has to be a first-class value in the comparison.

That is what the `missing` sentinel is for. `read(record, key)` returns the stored string when `Object.hasOwn` says the key is an own property, and the unique symbol `missing` otherwise. Every comparison is then an ordinary `===` between two strings or between two occurrences of the same symbol.

`??` preserves `''`: it falls back only for `null` or `undefined`. The problem with `record[key] ?? 'absent'` is a collision with the legitimate stored string `'absent'`, plus ordinary lookup can read inherited properties. Under this exact string-only contract, `Object.hasOwn(record, key) ? record[key] : undefined` can represent absence correctly because stored `undefined` is excluded. The reference uses a unique `Symbol` to make the separation explicit and avoid collisions if the value domain later expands. Logical OR (`||`), unlike `??`, would discard an empty string.

`Object.hasOwn` rather than `key in record` matters for a second reason. `'toString' in {}` is `true`, because the lookup walks the prototype chain. `Object.hasOwn({}, 'toString')` is `false`. The test feeds a record built from `JSON.parse('{"__proto__":"data","constructor":"ok"}')`, where those two names are ordinary own data properties, and they have to be merged like any other key.

## The contract you must honour

Taken from `tests/3439.cjs` and `prompts/3439.txt`:

- The signature is `solve(base, local, remote)` and the return value is `{value, conflicts}` — an object with exactly those two keys.
- `conflicts` is an array of key names, lexicographically sorted. The second test case asserts `['a','z']`.
- Absence means deletion. `solve({a:'x'}, {}, {})` asserts `{value:{},conflicts:[]}`: both sides deleted `a`, they agree, and the key is gone.
- `solve({a:'x'}, {a:'x'}, {})` asserts `{value:{},conflicts:[]}`: local left the key alone, remote deleted it, so rule 2 takes the remote deletion.
- A conflict keeps local, *including a local deletion*. In the second case, `solve({a:'x',z:'x'},{z:'local'},{a:'remote',z:'remote'})` asserts `{value:{z:'local'},conflicts:['a','z']}`. Key `a` conflicts — local deleted it, remote changed it — and local's deletion wins, so `a` does not appear in `value` even though it is listed in `conflicts`.
- The empty string is a value. `solve({}, {a:''}, {a:''})` asserts `{value:{a:''},conflicts:[]}`.
- `__proto__` and `constructor` are ordinary data keys. The special-record case asserts `deepEqual(solve({}, special, {}), {value: special, conflicts: []})`.
- Inputs must not change. The first case passes three `Object.freeze`d records, so any write throws under `'use strict'`.

## Approach

1. Create the sentinel: `const missing = Symbol('missing')`. A fresh symbol is unequal to everything else in the program.
2. Write `read(record, key)` as `Object.hasOwn(record, key) ? record[key] : missing`.
3. Collect the union of own key names from all three records into a `Set`, spread it to an array and `sort()`. The default sort is lexicographic on strings, which is what the prompt asks for.
4. For each key in that order, read the three values and apply the four rules to pick `selected`, pushing the key onto `conflicts` in the fourth case.
5. If `selected` is not `missing`, append `[key, selected]` to an entries array.
6. Return `{ value: Object.fromEntries(entries), conflicts }`.

Because the keys are visited in sorted order, `conflicts` is already sorted when the loop ends — there is no second sort.

`Object.fromEntries` is what makes `__proto__` safe on the way out. It defines each pair as an own data property. An accumulator written as `result[key] = selected` invokes the inherited `__proto__` setter for that key. In this string-only exercise the string assignment is ignored rather than creating an own data property; an object-valued assignment in a wider domain could replace the prototype.

## Worked example — 3439 Merge independent flat-document edits

Take the example from the prompt, which is also the first assertion in the test file:

```js
base   = { a: 'old' }
local  = { a: 'new' }
remote = { a: 'old', b: 'x' }
```

The union of own keys is `{'a','b'}`, sorted to `['a','b']`.

| key | `base` | `local` | `remote` | rule that fires | `selected` | `conflicts` |
| --- | --- | --- | --- | --- | --- | --- |
| `a` | `'old'` | `'new'` | `'old'` | 1: `'new' === 'old'`? no. 2: `'new' === 'old'`? no. 3: `'old' === 'old'`? **yes** — remote unchanged, take local | `'new'` | `[]` |
| `b` | `missing` | `missing` | `'x'` | 1: `missing === 'x'`? no. 2: `missing === missing`? **yes** — local unchanged, take remote | `'x'` | `[]` |

Both selections are strings, so both are emitted. `Object.fromEntries([['a','new'],['b','x']])` is `{a:'new', b:'x'}`, and `conflicts` is `[]`.

Result `{value:{a:'new',b:'x'},conflicts:[]}`, asserted on line 4 of the test file against three frozen inputs.

Now the conflict case from line 5, which exercises the fourth rule twice:

```js
base   = { a: 'x', z: 'x' }
local  = { z: 'local' }
remote = { a: 'remote', z: 'remote' }
```

| key | `base` | `local` | `remote` | rule that fires | `selected` | emitted? | `conflicts` |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `a` | `'x'` | `missing` (deleted) | `'remote'` | 1 no, 2 no, 3 no → conflict, keep local | `missing` | no | `['a']` |
| `z` | `'x'` | `'local'` | `'remote'` | 1 no, 2 no, 3 no → conflict, keep local | `'local'` | yes | `['a','z']` |

Result `{value:{z:'local'},conflicts:['a','z']}`. Key `a` is listed as a conflict *and* absent from the merged document, because the local edit that won was a deletion.

The reference solution, as it now reads in `solutions/3439.cjs`:

```js
function solve(base, local, remote) {
  const missing = Symbol('missing');
  const read = (record, key) => (Object.hasOwn(record, key) ? record[key] : missing);
  const allKeys = new Set([
    ...Object.keys(base),
    ...Object.keys(local),
    ...Object.keys(remote),
  ]);
  const entries = [];
  const conflicts = [];
  for (const key of [...allKeys].sort()) {
    const baseValue = read(base, key);
    const localValue = read(local, key);
    const remoteValue = read(remote, key);
    let selected;
    if (localValue === remoteValue) {
      selected = localValue;
    } else if (localValue === baseValue) {
      selected = remoteValue;
    } else if (remoteValue === baseValue) {
      selected = localValue;
    } else {
      conflicts.push(key);
      selected = localValue;
    }
    if (selected !== missing) {
      entries.push([key, selected]);
    }
  }
  return { value: Object.fromEntries(entries), conflicts };
}
```

## Variations you could build

| Variation | What would change in the code |
| --- | --- |
| Conflicts keep `remote` instead of `local` | one line: `selected = remoteValue` in the fourth branch |
| Conflicts keep both, as `{local, remote}` markers | the value type stops being a string, so the sentinel comparison still works but `Object.fromEntries` now carries objects |
| Nested documents, merged recursively | the four rules stay, but equality becomes structural and `read` has to descend; see exercise 3441 for the traversal shape |
| Report which side won for each non-conflicting key | a third array filled in the same loop; nothing else moves |

## Pitfalls the tests are designed to catch

- **Using a colliding string fallback or inherited lookup.** `??` correctly preserves `{a:''}`. A string fallback can equal an allowed stored string; `record[key]` may also read a prototype value. Check own-property presence separately. `undefined` is a valid sentinel under this string-only contract, though the reference uses a symbol.
- **Using `key in record` instead of `Object.hasOwn`.** Inherited names such as `constructor` and `toString` would read as present on every record.
- **Accumulating with `result[key] = selected`.** The `__proto__` string assignment fails to create an own data property, and `deepEqual` against the parsed special record fails.
- **Treating a conflicted local deletion as "keep base".** Line 5 asserts that key `a` is absent from `value`, not that it is restored to `'x'`.
- **Sorting `conflicts` but iterating the keys in insertion order.** It would pass this test, but the merged entries would then depend on argument order; sorting once up front makes both outputs deterministic.
- **Writing into `base`, `local` or `remote`.** The first case freezes all three, and `'use strict'` turns a write into a `TypeError`.
- **Returning a `Map` or adding extra keys to the result.** `deepEqual` pins the shape to exactly `{value, conflicts}`.

## Try it yourself

1. Add a fourth argument `onConflict` that receives `(key, localValue, remoteValue)` and returns the value to keep. What do you pass it when one side is `missing`?
2. Write the inverse check: given `base` and a merge result, decide whether the merge could have come from a given pair of edits. Which rule is impossible to invert?
3. In words: explain why a fresh `Symbol` is a safe sentinel here while the string `'__missing__'` is not, and name the exact input that would break the string version.

## Independent boundary practice

Continue with the [advanced trace and executable counterexamples](../../advanced-practice/README.md). The lab distinguishes nullish coalescing, fallback collisions, and inherited lookup without changing any learner starter.
