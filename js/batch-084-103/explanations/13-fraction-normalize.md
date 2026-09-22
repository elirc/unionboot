# Normalize a rational number — js/batch-084-103 96

**What you practise:** reducing a fraction to a canonical form, and separating the sign question from the magnitude question.
**Prerequisites:** the Euclidean algorithm for gcd (see doc 12); `BigInt` arithmetic and the unary minus on it; what "canonical form" means.
**Exercises:** 96: Normalize a rational number.

## The problem in plain words

`8/12`, `4/6` and `2/3` are the same number written three ways. A canonical form picks one of them so that two fractions can be compared by looking at their parts. The convention here is the usual one: reduce to lowest terms, and keep the sign on the numerator with the denominator always positive.

That splits the work in two. The sign is settled by looking at the denominator: if it is negative, negate both halves. Negating both leaves the value alone — `2/-6` and `-2/6` are the same number — but afterwards the sign, if there is one, lives on top.

The magnitude is settled by dividing both halves by their greatest common divisor. After that no integer above 1 divides both, which is what "lowest terms" means.

Zero is a fraction too. `0/-5` normalises to `0/1`, and it needs no special case: `gcd(0, 5)` is `5`, so both halves divide down to `0` and `1` on their own.

## The contract you must honour

Taken from `tests/096-fraction-normalize.cjs`:

- The return value is a two-element array `[numerator, denominator]` of `BigInt`, not an object.
- `solve(8n,12n)` asserts `[2n,3n]`.
- `solve(2n,-6n)` asserts `[-1n,3n]`, so the sign moves to the numerator rather than staying below.
- `solve(0n,-5n)` asserts `[0n,1n]`.
- `solve(-9n,-3n)` asserts `[3n,1n]`: two negatives cancel and the result is positive.
- `solve(1n,0n)` asserts a `RangeError`.

## Approach

1. Reject a zero denominator with `throw new RangeError('Zero denominator')` before anything else.
2. Copy the arguments into local variables, so the parameters themselves are never reassigned.
3. If the denominator is negative, negate both numerator and denominator.
4. Run the Euclidean algorithm on the *absolute value* of the numerator and the now-positive denominator. Using the absolute value keeps the divisor positive, so dividing by it cannot flip the sign back.
5. Return `[numerator / divisor, denominator / divisor]`.

`BigInt` division is exact here, because the divisor divides both operands by construction.

## Worked example — 96 Normalize a rational number

Input, from the third assertion: `n = 2n`, `d = -6n`.

Step 1: the denominator is not zero, so nothing throws.

Step 2, sign: `-6n < 0n`, so negate both. `numerator` becomes `-2n`, `denominator` becomes `6n`.

Step 3, gcd of `|−2n| = 2n` and `6n`:

| iteration | `a` | `b` | `a % b` | pair after |
| --- | --- | --- | --- | --- |
| seed | `2n` | `6n` | — | — |
| 1 | `2n` | `6n` | `2n % 6n = 2n` | `a = 6n`, `b = 2n` |
| 2 | `6n` | `2n` | `6n % 2n = 0n` | `a = 2n`, `b = 0n` |
| — | `2n` | `0n` | — | loop ends, divisor is `2n` |

Step 4: `[-2n / 2n, 6n / 2n]` is `[-1n, 3n]`.

Asserted on line 5 of the test file as `assert.deepEqual(solve(2n,-6n),[-1n,3n])`.

Note the first iteration: seeding with `a` smaller than `b` costs one extra swap-like step and then proceeds normally, so no ordering check is needed up front.

The reference solution, as it now reads in `solutions/096-fraction-normalize.cjs`:

```js
function normalizeFraction(n, d) {
  if (d === 0n) {
    throw new RangeError('Zero denominator');
  }
  let numerator = n;
  let denominator = d;
  if (denominator < 0n) {
    numerator = -numerator;
    denominator = -denominator;
  }
  let a = numerator < 0n ? -numerator : numerator;
  let b = denominator;
  while (b !== 0n) {
    [a, b] = [b, a % b];
  }
  const divisor = a;
  return [numerator / divisor, denominator / divisor];
}
```

## Variations you could build

| Variation | What would change in the code |
| --- | --- |
| Return `{n, d}` instead of a pair | only the return statement, but every caller has to change with it |
| Add two normalised fractions | cross-multiply into `[an*bd + bn*ad, ad*bd]`, then call this function on the result |
| Compare two fractions without dividing | compare `an*bd` with `bn*ad`, valid only once both denominators are known positive |

## Pitfalls the tests are designed to catch

- **Computing the gcd on the signed numerator.** `gcd` via `%` on a negative operand yields a negative result in JavaScript, and dividing by a negative divisor flips both signs: `solve(2n,-6n)` would come back as `[1n,-3n]` and fail.
- **Normalising the sign after reducing rather than before.** It can be made to work, but then the sign fix has to touch both halves again; doing it first means the divisor is positive by construction.
- **Special-casing zero.** Unnecessary, and a `numerator === 0n` shortcut that returns `[0n,1n]` early is fine only if it still runs after the zero-denominator check — `solve(0n,0n)` must throw.
- **Returning `[0n,-1n]` or `[-0n,1n]` for zero.** There is no `-0n`; `BigInt` has one zero. But a denominator left at `-1n` would fail the third assertion.
- **Throwing the wrong error type.** `assert.throws(fn, RangeError)` names the constructor, and a `TypeError` is not one.
- **Using `Number` for the gcd.** The inputs are `BigInt` and `%` between the two types throws a `TypeError`.

## Try it yourself

1. Add a third return element giving the sign as `-1n`, `0n` or `1n`. Can it be read off the normalised numerator alone?
2. Write `toFraction(decimalString)` that turns `'0.125'` into `[1n,8n]` using this function. What is the denominator before reduction?
3. In words: after normalisation, two fractions are equal exactly when their pairs are equal. State why that is true here and what would break it if the denominator were allowed to stay negative.
