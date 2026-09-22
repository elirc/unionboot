# Encode BigInt without toString(radix) — js/batch-084-103 97

**What you practise:** writing positional notation by hand — the divide-and-remainder loop that every `toString(radix)` implements internally.
**Prerequisites:** `BigInt` division and `%`; indexing a string with `[]`; `Number()` conversion from a small `BigInt`.
**Exercises:** 97: Encode BigInt without toString(radix).

## The problem in plain words

Writing a number in base 16 means expressing it as a sum of powers of 16 and naming each coefficient with a digit. `255` is `15 * 16 + 15`, and since digit 15 is written `f`, the answer is `ff`.

The mechanical way to find those coefficients is repeated division. `value % radix` is the coefficient of the lowest power — the rightmost digit. Dividing `value` by `radix` (truncating) throws that digit away and shifts everything down one place, so the next remainder is the next digit up. Repeat until nothing is left.

Digits come out least significant first, so they have to be assembled in reverse: each new digit goes on the *front* of the result.

The header forbids `toString(radix)`, which would do all of this for you. It also fixes the alphabet as `0`–`9` then lowercase `a`–`z`, which is why the maximum base is 36.

## The contract you must honour

Taken from `tests/097-base-encode.cjs`:

- `solve(255n,16)` asserts `'ff'` — lowercase.
- `solve(10n,2)` asserts `'1010'`.
- `solve(0n,36)` asserts `'0'`. Zero has no digits under the loop, so it is a special case.
- `solve(35n,36)` asserts `'z'`, which pins the top of the alphabet.
- `solve(2n,1)` asserts a `RangeError` — base 1 is not a positional base.
- `solve(-1n,10)` asserts a `RangeError` — negatives are rejected rather than given a `-` sign.
- The value is a `BigInt`; the base is an ordinary `Number`.

## Approach

1. Validate first, as one combined `RangeError`: the base must be an integer in `2..36`, and the value must not be negative.
2. Return `'0'` for a value of `0n`, because the loop below would produce an empty string.
3. Set up the digit alphabet `'0123456789abcdefghijklmnopqrstuvwxyz'` and convert the base to a `BigInt` once, since `BigInt` and `Number` cannot be mixed in arithmetic.
4. While there is anything left: take `remaining % radix` as the next digit, look it up in the alphabet, and prepend it. Then divide `remaining` by `radix`.
5. Return the assembled string.

The remainder is always smaller than the radix, which is at most 36, so `Number(remaining % radix)` is exact and safe to use as a string index.

## Worked example — 97 Encode BigInt without toString(radix)

Input, from the first assertion: `value = 255n`, `base = 16`.

Validation passes; the value is not `0n`; `radix` is `16n`.

| iteration | `remaining` | `remaining % radix` | digit | `out` after prepending | `remaining / radix` |
| --- | --- | --- | --- | --- | --- |
| 1 | `255n` | `15n` | `digits[15]` = `'f'` | `'f'` | `15n` |
| 2 | `15n` | `15n` | `'f'` | `'ff'` | `0n` |
| — | `0n` | — | — | — | loop ends |

Result `'ff'`, asserted on line 4 of the test file.

The `solve(35n,36)` case is a single iteration: `35n % 36n` is `35n`, `digits[35]` is `'z'`, and `35n / 36n` truncates to `0n`.

The reference solution, as it now reads in `solutions/097-base-encode.cjs`:

```js
function encodeBase(value, base) {
  if (!Number.isInteger(base) || base < 2 || base > 36 || value < 0n) {
    throw new RangeError('Invalid input');
  }
  if (value === 0n) {
    return '0';
  }
  const digits = '0123456789abcdefghijklmnopqrstuvwxyz';
  const radix = BigInt(base);
  let remaining = value;
  let out = '';
  while (remaining > 0n) {
    out = digits[Number(remaining % radix)] + out;
    remaining /= radix;
  }
  return out;
}
```

## Variations you could build

| Variation | What would change in the code |
| --- | --- |
| Allow negative values with a `-` prefix | drop `value < 0n` from the guard, remember the sign, encode the absolute value |
| Write the decoder, `decodeBase(text, base)` | a loop of `total = total * radix + BigInt(digits.indexOf(ch))`, with an `indexOf` of `-1` as the error case |
| Support a caller-supplied alphabet, such as base58 | take `digits` as a parameter and derive the radix from its length |

## Pitfalls the tests are designed to catch

- **Appending digits instead of prepending.** `solve(10n,2)` would give `'0101'` rather than `'1010'`.
- **Forgetting the zero case.** The loop body never runs for `0n`, so an empty string is returned and the third assertion fails.
- **Using uppercase letters.** `solve(255n,16)` asserts `'ff'`, and `assert.equal` is case-sensitive.
- **Mixing `BigInt` and `Number` in the arithmetic.** `255n % 16` throws a `TypeError`, not a wrong answer, which is why the base is converted once up front.
- **Indexing the alphabet with a `BigInt`.** `digits[15n]` is `undefined`; string indices go through a `Number` conversion that a `BigInt` does not satisfy.
- **Accepting base 1 or base 37.** Both throwing assertions name `RangeError`, and base 1 in particular would loop forever, since `remaining / 1n` never shrinks.
- **Calling `value.toString(base)`.** The header forbids it, and the reviewer reads the source.

## Try it yourself

1. Add a `minDigits` parameter that left-pads with `'0'`. Does the padding belong inside the loop or after it?
2. Encode `255n` in base 2, 8, 16 and 36 by hand, then check your four answers against the function.
3. In words: `Number(remaining % radix)` is described above as exact. State the property of the remainder that makes that true, and name a line you could change that would make it untrue.
