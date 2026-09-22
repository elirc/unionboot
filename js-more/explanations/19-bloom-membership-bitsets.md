# Bloom membership bitsets — js-more 1899–1908

**What you practise:** implementing a Bloom filter — a bit array plus a family of hash functions — and reasoning about a data structure that is allowed to be wrong in one direction.
**Prerequisites:** rolling hashes and the `%` operator; `String.prototype.charCodeAt`; `Array.prototype.every`; `Array.from` with a length and a mapping function.
**Exercises:** 1899: bits=7; hashes=2, 1900: bits=7; hashes=3, 1901: bits=11; hashes=2, 1902: bits=11; hashes=3, 1903: bits=17; hashes=2, 1904: bits=17; hashes=3, 1905: bits=23; hashes=2, 1906: bits=23; hashes=3, 1907: bits=31; hashes=2, 1908: bits=31; hashes=3.

## The problem in plain words

A Bloom filter answers "have I seen this before?" using a fixed amount of memory, no matter how many values it has seen. It stores no values at all — only bits.

Adding a value hashes it to a handful of positions and sets those bits to 1. Asking about a value hashes it the same way and answers true only if *every* one of those bits is already 1. Bits are never cleared.

That gives an asymmetric guarantee. If a value was added, all of its bits are set, so the answer is always true: there are no false negatives. If it was not added, its bits might still all be set by other values, so the answer can be a false positive. The prompt says so: "false positives intentional". This family's boards are deliberately tiny — 7 bits — so false positives show up in the very first test.

The input is a flat list of `{type, value}` operations, and the output is `{answers, bits}`: the results of the `has` operations in order, and the bit array rendered as a string with index 0 first.

"Policy" is two numbers: how many bits the filter has, and how many positions each value probes.

## The contract you must honour

Taken from `tests/1899.cjs` and its siblings, which compare against an independent oracle built on a `Set` of indices:

- The hash functions are specified exactly, not left to you. Quoting the prompt: "Hash a starts0, update (a*31+charCode)%m; b starts0, update (b*17+charCode+1)%m." Here `m` is `cfg.bits`.
- The probe positions are `(a + i * (b || 1)) % m` for `i` from 0. The `b || 1` matters: a value whose `b` hashes to 0 would otherwise put every probe on the same bit.
- `check([], {answers: [], bits: '0'.repeat(cfg.bits)})` — an empty operation list gives an all-zero bit string of the configured length.
- `bits` is a string of `'0'` and `'1'`, index 0 first, not an array and not a number.
- `answers` holds one boolean per `has`, in order. `add` contributes nothing to `answers`.
- The empty string is a legal value: the operations include `{type:'add', value:''}` and `{type:'has', value:''}`. Its hashes are both 0 before the `b || 1` step.
- `'__proto__'` is a value like any other; the test includes it. It is hashed to numbers, so nothing about it can touch an object prototype — provided your bit store is indexed by number.
- `assert.throws(()=>solve([{type:'bad',value:'a'}]), /Unknown operation/)`. The reference throws `new Error('Unknown operation')`.
- `check` clones with `structuredClone` and finishes with `deep(input, before, 'Input must not mutate')`.

## Approach

1. Allocate the bit array once: `Array(cfg.bits).fill(0)`. A plain array indexed by integer is the whole store.
2. Write `positions(text)` to run both rolling hashes in one pass over the characters, then build the probe list with `Array.from({length: cfg.hashes}, (_, i) => (a + i * (b || 1)) % cfg.bits)`. Taking `% cfg.bits` at every step of the rolling hash keeps the numbers small and is what the prompt specifies.
3. Loop the operations. Compute the positions once per operation — both branches need them.
4. `add`: set each position to 1. Setting an already-set bit is a no-op, which is why a Bloom filter cannot support deletion.
5. `has`: `indexes.every(index => bits[index] === 1)`. With `cfg.hashes` probes this is O(cfg.hashes), independent of how many values have been added.
6. Anything else: `throw new Error('Unknown operation')`.
7. Return `{answers, bits: bits.join('')}`.

## Worked example — 1899 Bloom membership bitsets / scenario 1 — bits=7; hashes=2

`tests/1899.cjs` builds the operation list as

```js
const ops = [
  {type:'has', value:'a'},
  {type:'add', value:'a'},
  {type:'has', value:'a'},
  {type:'add', value:''},
  {type:'has', value:''},
  ...['b','aa','ab','z','__proto__'].map(value => ({type:'has', value}))
];
check(ops, oracle(ops));
```

First, the positions. `'a'` is char code 97. With `m = 7`: `a = 97 % 7 = 6`, `b = (97 + 1) % 7 = 0`. Two probes: `i=0` gives `(6 + 0) % 7 = 6`; `i=1` gives `(6 + 1×(0 || 1)) % 7 = 0`. So `'a'` probes bits 6 and 0.

The full probe table for the values in this test:

| Value | `a` | `b` | Probes |
| --- | --- | --- | --- |
| `'a'` | 6 | 0 | 6, 0 |
| `''` | 0 | 0 | 0, 1 |
| `'b'` | 0 | 1 | 0, 1 |
| `'aa'` | 3 | 0 | 3, 4 |
| `'ab'` | 4 | 1 | 4, 5 |
| `'z'` | 3 | 4 | 3, 0 |
| `'__proto__'` | 1 | 2 | 1, 2 |

Now the trace. Bits are shown index 0 first.

| Step | Operation | Probes | Bits after | Answer |
| --- | --- | --- | --- | --- |
| 1 | has `'a'` | 6, 0 | `0000000` | `false` |
| 2 | add `'a'` | 6, 0 | `1000001` | — |
| 3 | has `'a'` | 6, 0 | `1000001` | `true` |
| 4 | add `''` | 0, 1 | `1100001` | — |
| 5 | has `''` | 0, 1 | `1100001` | `true` |
| 6 | has `'b'` | 0, 1 | `1100001` | `true` |
| 7 | has `'aa'` | 3, 4 | `1100001` | `false` |
| 8 | has `'ab'` | 4, 5 | `1100001` | `false` |
| 9 | has `'z'` | 3, 0 | `1100001` | `false` |
| 10 | has `'__proto__'` | 1, 2 | `1100001` | `false` |

Expected output: `{answers: [false, true, true, true, false, false, false, false], bits: '1100001'}`.

Step 6 is the false positive, and it is not an accident of this write-up: `'b'` probes bits 0 and 1, both of which were set by `'a'` and `''`. The filter reports membership for a value nobody added. That is the structure working as designed, and the oracle — which tracks a `Set` of set indices, not a set of values — reports the same.

Step 9 shows the other side: `'z'` probes bit 3, which is clear, so a single zero is enough to answer `false` with certainty.

The test does not hard-code the table above. It calls `check(ops, oracle(ops))`, where `oracle` recomputes the indices with `reduce` and keeps them in a `Set`. Both implementations must agree bit for bit.

The reference solution, as it now reads in `solutions/1899.cjs`:

```js
function bloom(input) {
  const bits = Array(cfg.bits).fill(0);
  const answers = [];

  function positions(text) {
    let a = 0;
    let b = 0;
    for (const ch of text) {
      a = (a * 31 + ch.charCodeAt(0)) % cfg.bits;
      b = (b * 17 + ch.charCodeAt(0) + 1) % cfg.bits;
    }
    return Array.from({ length: cfg.hashes }, (_, i) => (a + i * (b || 1)) % cfg.bits);
  }

  for (const op of input) {
    const indexes = positions(op.value);
    if (op.type === 'add') {
      for (const index of indexes) {
        bits[index] = 1;
      }
    } else if (op.type === 'has') {
      answers.push(indexes.every(index => bits[index] === 1));
    } else {
      throw new Error('Unknown operation');
    }
  }

  return { answers, bits: bits.join('') };
}
```

## Policy matrix — what changes between the variants

`cfg.bits` appears three times (array length, both hash moduli, the probe modulus) and `cfg.hashes` once (the probe count). Nothing else changes.

| ID | Variant | Semantic key | What differs in the code |
| --- | --- | --- | --- |
| 1899 | bits=7; hashes=2 | `{"bits":7,"hashes":2}` | 7-element array, `% 7`, two probes per value |
| 1900 | bits=7; hashes=3 | `{"bits":7,"hashes":3}` | same modulus, `Array.from({length:3})` — a third probe at `(a + 2×step) % 7` |
| 1901 | bits=11; hashes=2 | `{"bits":11,"hashes":2}` | 11-element array, `% 11` |
| 1902 | bits=11; hashes=3 | `{"bits":11,"hashes":3}` | 11 bits, three probes |
| 1903 | bits=17; hashes=2 | `{"bits":17,"hashes":2}` | 17 bits, two probes |
| 1904 | bits=17; hashes=3 | `{"bits":17,"hashes":3}` | 17 bits, three probes |
| 1905 | bits=23; hashes=2 | `{"bits":23,"hashes":2}` | 23 bits, two probes |
| 1906 | bits=23; hashes=3 | `{"bits":23,"hashes":3}` | 23 bits, three probes |
| 1907 | bits=31; hashes=2 | `{"bits":31,"hashes":2}` | 31 bits, two probes |
| 1908 | bits=31; hashes=3 | `{"bits":31,"hashes":3}` | 31 bits, three probes |

Every modulus is prime, which keeps the `(a + i × step)` probe sequence from cycling early. More bits mean fewer collisions; more hashes mean a value is harder to match by accident but sets more bits per add. The oracle follows `cfg`, so the expected `answers` differ between siblings even though the operations are the same.

## Pitfalls the tests are designed to catch

- **Storing the values.** A `Set` of strings answers every `has` correctly and produces no false positives — so step 6 above, `has 'b'` expecting `true`, fails. The structure is the exercise.
- **Dropping `|| 1`.** For `'a'` in scenario 1, `b` is 0, so without the guard both probes land on bit 6 and bit 0 is never set. The `has ''` and `has 'b'` answers change.
- **Using an object as the bit store.** `bits['__proto__']` would be a prototype reference rather than data. Indexing by number sidesteps it entirely, which is why the test includes `'__proto__'` as a value.
- **Reducing modulo only at the end.** `a = a * 31 + code` without the `% cfg.bits` each step drifts past `Number.MAX_SAFE_INTEGER` for long strings and stops matching the oracle. The prompt specifies the modulus inside the update.
- **Returning `bits` as an array.** It is `bits.join('')`, a string, index 0 first. Reversing it to read like a binary number fails the empty-input assertion's siblings.
- **Recording an answer for `add`.** `answers` has one entry per `has` only; the first assertion `check([], {answers: [], …})` and the mixed list both depend on it.
- **Supporting deletion.** Clearing bits would break other values that share them. The prompt says "No deletion", and the only writes are `bits[index] = 1`.
- **Letting an unknown type pass silently.** `assert.throws(()=>solve([{type:'bad',value:'a'}]), /Unknown operation/)` requires the `else` branch.

## Checking your work

```text
node js-more/verify.cjs --id=1899
node js-more/verify.cjs --starters --id=1899
```

Compute `positions('a')` by hand under your own `cfg` and compare with what your function returns. If those two numbers are right, the rest of the file is bookkeeping.

## Try it yourself

1. Add a third hash by extending the probe sequence rather than writing a new hash function. What is the smallest change, and why is `b || 1` still needed?
2. Count the false-positive rate: run 1000 distinct strings through a filter that has had 10 added, for `bits=7` and `bits=31`. Predict the direction of the change before you measure it.
3. Replace the number array with a single `BigInt` bitmask. Which operations get shorter, and which get harder to read?
4. In words: explain why a Bloom filter can never produce a false negative, referring to the fact that bits are only ever set.
