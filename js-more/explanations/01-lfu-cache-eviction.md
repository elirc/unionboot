# LFU cache eviction — js-more 1719–1728

**What you practise:** replaying a stream of cache operations against a fixed-capacity store, and choosing a victim by least-frequently-used with an explicit tie-break.
**Prerequisites:** `Map` (`get`, `set`, `has`, `delete`, `size`) and why it beats a plain object for arbitrary string keys; `Array.prototype.sort` with a chained comparator; the difference between a cache *hit* and a cache *miss*.
**Exercises:** 1719: capacity=2; tie=oldest, 1720: capacity=2; tie=newest, 1721: capacity=3; tie=oldest, 1722: capacity=3; tie=newest, 1723: capacity=4; tie=oldest, 1724: capacity=4; tie=newest, 1725: capacity=5; tie=oldest, 1726: capacity=5; tie=newest, 1727: capacity=6; tie=oldest, 1728: capacity=6; tie=newest.

## The problem in plain words

You are given `{ops: [...]}`. Each element is one instruction to a cache. A `get` carries `{type:'get', key}` and asks what is stored under that key. A `put` carries `{type:'put', key, value}` and stores a value. Keys are strings; values are primitives and never `null`.

The cache is small. It can hold at most `capacity` entries. When a `put` introduces a key the cache has never seen and the cache is already full, one existing entry has to go. LFU — least frequently used — means the entry that has been accessed the fewest times is the one that goes.

That rule alone is not enough, because two entries can have the same access count. That is what "policy" means in this family: `tie=oldest` evicts the one whose last successful access was earliest, `tie=newest` evicts the one whose last successful access was latest. The ten exercises are the same twenty-five lines of code with `capacity` and that one comparison changed.

The result is `{reads, entries}`. `reads` is the list of answers the `get` operations produced, in the order they were asked. `entries` is what survives in the cache at the end, as `[key, value, frequency]` triples sorted by key.

## The contract you must honour

Taken from `prompts/1719.txt` and `tests/1719.cjs`:

- Export one CommonJS function: `module.exports=solve`. The graded file exports the function under the name `lfu`, which is fine — the verifier only checks `typeof solve === 'function'`.
- Each call creates independent state. There is no module-level cache; every `lfu(input)` starts with an empty `Map`. The test calls the function four times in a row and expects no carry-over.
- A new key is inserted with frequency `1`.
- A `get` that hits and a `put` that replaces an existing key each increment that entry's frequency and update its "last accessed" position.
- A `get` that misses pushes `null` into `reads` and touches nothing: no frequency change, no position change, and no insertion of the missing key.
- Eviction happens only when a `put` introduces a key not already present *and* the cache is at capacity. Replacing an existing key never evicts, however full the cache is.
- `entries` is an array of `[key, value, frequency]`, sorted by code-unit key order. The first test case asserts `{reads:[],entries:[]}` for `{ops:[]}`, so an empty run returns two empty arrays, not `null`.
- An operation whose `type` is neither `'get'` nor `'put'` throws. The test is `assert.throws(()=>solve({ops:[{type:'bad'}]}),/Unknown operation/)`, and the reference throws `new Error('Unknown operation')`.
- `check(input, expected)` clones the input with `structuredClone` before the call and finishes with `deep(input, before, 'Input must not mutate')`. You may not sort `input.ops`, rewrite `op.value`, or attach bookkeeping fields to the operation objects.
- The prompt's CONTRACT section adds: no network, DOM, timers, filesystem or random data, and "Algorithmic complexity/structural sharing requirements also need source review" — a human reads the file, so the LFU bookkeeping has to be real, not faked by re-deriving counts at the end.

## Approach

1. Create `const entries = new Map()` mapping key to a small record `{value, frequency, touched}`. A `Map` is required here rather than an object literal, because the generated test stores a key named `'__proto__'`. Writing `obj['__proto__'] = {...}` changes the object's prototype instead of storing data, and reading it back gives you `Object.prototype`.
2. Keep `let serial = 0`. Every successful access assigns `item.touched = serial++`. This is a monotone counter, not a clock: the prompt forbids timers, and a counter is all the tie-break needs, because it only ever compares two `touched` values.
3. Keep `const reads = []` and push into it once per `get`, hit or miss.
4. Walk `input.ops` once. Three branches:
   - `get`: look the key up. Push `item.value` on a hit, `null` on a miss. On a hit only, bump `frequency` and re-stamp `touched`.
   - `put` on an existing key: overwrite `value`, bump `frequency`, re-stamp `touched`. No eviction.
   - `put` on a new key: if `entries.size === cfg.capacity`, choose and delete a victim first, then insert `{value, frequency: 1, touched: serial++}`.
   - anything else: `throw new Error('Unknown operation')`.
5. To choose a victim, spread the map into a fresh array of `[key, item]` pairs and sort by `frequency` ascending, then by `touched` in the direction `cfg.tie` selects. The first element of the sorted array is the victim. Because `touched` is unique per entry, the comparator is a total order and no stability question arises.
6. At the end, spread the map again, sort by key with an explicit string comparator, and map each pair to `[key, item.value, item.frequency]`.

Cost is O(1) per `get` and per replacing `put`, plus O(k log k) for the sort on each evicting `put`, where k is the capacity — at most 6 here. The final sort is another O(k log k). A production LFU would keep frequency buckets to make eviction O(1); at capacity 6 the sort is both correct and clearer, and the prompt states no complexity bound for this family.

## Worked example — 1719 LFU cache eviction / scenario 1

`tests/1719.cjs` contains four checks: the empty case, a generated twelve-put case compared against an in-test brute-force `oracle`, a small hand-written case, and the error case. The hand-written one is the clearest, because it isolates the "replacement counts as an access" rule.

The input, quoted from line 12 of the test:

```js
check({ops:[{type:'put',key:'a',value:1},{type:'put',key:'a',value:2},{type:'get',key:'a'}]},{reads:[2],entries:[['a',2,3]]});
```

Trace, with `cfg = {"capacity":2,"tie":"oldest"}`:

| Step | Operation | Branch taken | `entries` after | `serial` | `reads` |
| --- | --- | --- | --- | --- | --- |
| start | — | — | `{}` | 0 | `[]` |
| 1 | `put a=1` | new key; `size` is 0, not 2, so no eviction | `{a: {value:1, frequency:1, touched:0}}` | 1 | `[]` |
| 2 | `put a=2` | existing key; replacement path | `{a: {value:2, frequency:2, touched:1}}` | 2 | `[]` |
| 3 | `get a` | hit | `{a: {value:2, frequency:3, touched:2}}` | 3 | `[2]` |

The final sort sees one pair, so the order is unchanged, and the map step produces `[['a', 2, 3]]`. The whole return value is `{reads:[2], entries:[['a',2,3]]}`, which is exactly what line 12 asserts. Note that `capacity` never mattered in this case and the tie-break comparator never ran: with one key there is nothing to choose between. That is deliberate — this case pins down the frequency rule alone.

The frequency `3` is the point of the case. One insert plus one replacement plus one hit is three accesses. If you treat a replacing `put` as "delete then insert", the frequency resets to `1` and the case fails on `entries`.

The empty case on line 9 is worth reading too:

```js
check({ops:[]},{reads:[],entries:[]});
```

The loop body never runs, `[...entries]` spreads an empty map to `[]`, and `.sort().map()` on `[]` gives `[]`.

The error case on line 13:

```js
assert.throws(()=>solve({ops:[{type:'bad'}]}),/Unknown operation/);
```

`{type:'bad'}` matches neither branch, so the `else` throws before anything is stored. Throwing a string instead of an `Error` would also satisfy this particular regex assertion, but the prompt states `throws Error('Unknown operation')`, and every other family in this track is checked with `e instanceof Error`. Throw an `Error`.

The remaining case builds twelve `put` operations with a `get` after every third, then appends a `put`/`get` pair on the key `'__proto__'` and one `get` on `'missing'`, and compares against `oracle(ops)` defined on line 10 of the test. That oracle keeps a plain array of rows and picks the victim with `Math.min` plus a `reduce`, so it is a genuinely independent implementation of the same policy — if your map bookkeeping drifts from the rules, the two disagree.

The reference solution, as it now reads in `solutions/1719.cjs`:

```js
function lfu(input) {
  const entries = new Map();
  const reads = [];
  let serial = 0;
  for (const op of input.ops) {
    if (op.type === 'get') {
      const item = entries.get(op.key);
      reads.push(item ? item.value : null);
      if (item) {
        item.frequency++;
        item.touched = serial++;
      }
    } else if (op.type === 'put') {
      if (entries.has(op.key)) {
        // Replacing an existing key counts as an access, not as an insert.
        const item = entries.get(op.key);
        item.value = op.value;
        item.frequency++;
        item.touched = serial++;
      } else {
        if (entries.size === cfg.capacity) {
          const ranked = [...entries].sort((left, right) =>
            left[1].frequency - right[1].frequency ||
            (cfg.tie === 'oldest'
              ? left[1].touched - right[1].touched
              : right[1].touched - left[1].touched));
          const victim = ranked[0];
          entries.delete(victim[0]);
        }
        entries.set(op.key, {value: op.value, frequency: 1, touched: serial++});
      }
    } else {
      throw new Error('Unknown operation');
    }
  }
  const sortedEntries = [...entries]
    .sort((left, right) => (left[0] < right[0] ? -1 : left[0] > right[0] ? 1 : 0))
    .map(([key, item]) => [key, item.value, item.frequency]);
  return {reads, entries: sortedEntries};
}
```

## Policy matrix — what changes between the variants

Each prompt's POLICIES block ends with a `Semantic key`, a JSON object copied verbatim into the solution's `cfg` line. Two knobs vary.

| ID | Variant | What differs in the prompt | What differs in the code |
| --- | --- | --- | --- |
| 1719 | capacity=2; tie=oldest | `{"capacity":2,"tie":"oldest"}` | `cfg.capacity` is 2; tie comparator is `left.touched - right.touched` |
| 1720 | capacity=2; tie=newest | `{"capacity":2,"tie":"newest"}` | `cfg.capacity` is 2; tie comparator flips to `right.touched - left.touched` |
| 1721 | capacity=3; tie=oldest | `{"capacity":3,"tie":"oldest"}` | `cfg.capacity` is 3; ascending `touched` tie-break |
| 1722 | capacity=3; tie=newest | `{"capacity":3,"tie":"newest"}` | `cfg.capacity` is 3; descending `touched` tie-break |
| 1723 | capacity=4; tie=oldest | `{"capacity":4,"tie":"oldest"}` | `cfg.capacity` is 4; ascending `touched` tie-break |
| 1724 | capacity=4; tie=newest | `{"capacity":4,"tie":"newest"}` | `cfg.capacity` is 4; descending `touched` tie-break |
| 1725 | capacity=5; tie=oldest | `{"capacity":5,"tie":"oldest"}` | `cfg.capacity` is 5; ascending `touched` tie-break |
| 1726 | capacity=5; tie=newest | `{"capacity":5,"tie":"newest"}` | `cfg.capacity` is 5; descending `touched` tie-break |
| 1727 | capacity=6; tie=oldest | `{"capacity":6,"tie":"oldest"}` | `cfg.capacity` is 6; ascending `touched` tie-break |
| 1728 | capacity=6; tie=newest | `{"capacity":6,"tie":"newest"}` | `cfg.capacity` is 6; descending `touched` tie-break |

Only one expression differs between an `oldest` file and its `newest` twin: the second clause of the eviction comparator. `capacity` only ever appears in `entries.size === cfg.capacity`. Every test file carries its own copy of the same `cfg` object, and its `oracle` reads `cfg.capacity` and `cfg.tie` too, so the test and the reference agree on the policy by construction.

## Pitfalls the tests are designed to catch

- **Using a plain object as the store.** The generated case puts the key `'__proto__'` and then gets it back. With `const entries = {}`, `entries['__proto__'] = {...}` does not create an own property, so the following `get` misses and `reads` disagrees with the oracle.
- **Letting a miss count as an access.** The generated case ends with `{type:'get',key:'missing'}`. If you insert a placeholder or bump a counter on a miss, the surviving `entries` differ from `oracle`'s. The prompt states "Miss returns null and does not touch".
- **Treating a replacing `put` as a fresh insert.** The hand-written case asserts frequency `3` for key `a`. Delete-then-insert gives `1`.
- **Evicting on a replacement.** If the eviction check runs before you know whether the key is new, a full cache loses an entry every time an existing key is overwritten. `entries` then comes out short.
- **Mutating `input`.** `check` deep-compares against a `structuredClone` taken before the call and reports `'Input must not mutate'`. Sorting `input.ops`, or storing bookkeeping on the op objects, fails there rather than on the result.
- **Sorting the surviving entries with a bare `sort()`.** The default comparator stringifies each element. On `[key, item]` pairs that turns an object into `[object Object]` and the key comparison stops being about the key. Pass the explicit comparator.
- **Comparing `touched` the wrong way for `newest`.** Sorting ascending and taking the last element is not the same as sorting descending and taking the first once frequencies differ, because the primary `frequency` clause would be reversed too. Flip only the tie clause, as the reference does.
- **Returning a `Map` or an object for `entries`.** `deep` compares against an array of three-element arrays.

## Try it yourself

1. Add an `evictions` counter to the return value, listing the evicted keys in order. Which branch of the loop is the only one that has to change?
2. Replace the sort-based victim search with a single pass that tracks the best candidate so far. Write the comparison so that `cfg.tie` is consulted once, not once per element, and confirm it still handles the case where every entry has the same frequency.
3. Add an eleventh policy, `tie=lexical`, that breaks frequency ties by smallest key rather than by `touched`. Does `touched` still need to be maintained?
4. In words: the reference re-stamps `touched` on a replacing `put`, which makes replacement look like a recent access. Describe a sequence of operations for 1719 where removing that one line changes which key is evicted, and say which of `reads` or `entries` would reveal it.
