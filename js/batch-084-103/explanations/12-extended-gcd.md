# Bezout coefficients with BigInt — js/batch-084-103 95

**What you practise:** the extended Euclidean algorithm — carrying an algebraic invariant through a loop, not just a numeric result.
**Prerequisites:** the Euclidean algorithm for gcd; `BigInt` division (it truncates towards zero); destructuring assignment for simultaneous updates.
**Exercises:** 95: Bezout coefficients with BigInt.

## The problem in plain words

Bezout's identity says that for any two integers `a` and `b` there exist integers `x` and `y` with `a*x + b*y = gcd(a, b)`. This exercise asks you to produce not just the gcd but a pair of coefficients that witnesses it.

The plain Euclidean algorithm finds the gcd by repeatedly replacing the pair `(r, rNext)` with `(rNext, r mod rNext)` until the second entry is zero; the first is then the gcd. The "extended" version runs the same loop while dragging two extra pairs along, one tracking the coefficient of `a` and one the coefficient of `b`.

The coefficients are not unique — `30*(-1) + 18*2 = 6` and `30*2 + 18*(-3) = 6` are both valid for `gcd(30,18)`. The header says so, and the test reflects it: it checks the identity `a*x + b*y === gcd` rather than specific values of `x` and `y`.

One case is pinned down exactly. `gcd(0, 0)` is `0`, and the identity holds for any coefficients at all, so the header fixes the answer as `{gcd:0n, x:1n, y:0n}`.

## The contract you must honour

Taken from `tests/095-extended-gcd.cjs`:

- The return value is an object with the keys `gcd`, `x` and `y`, all `BigInt`.
- For each of `(30n,18n) → 6n`, `(17n,5n) → 1n`, `(0n,9n) → 9n` and `(0n,0n) → 0n`, the test asserts `r.gcd` equals the expected gcd *and* that `a*r.x + b*r.y` equals it too. So both the gcd and the identity are checked, but the individual coefficients are free.
- `solve(0n,0n)` is then asserted with `deepEqual` against `{gcd:0n, x:1n, y:0n}` exactly, so that one case has a required answer.
- The gcd must be nonnegative. The inputs are nonnegative, so every remainder is too, and this falls out.

## Approach

1. Seed three pairs from two equations that are true by inspection:
   - `a*1n + b*0n = a`, giving the first remainder `a` with coefficients `(1n, 0n)`;
   - `a*0n + b*1n = b`, giving the second remainder `b` with coefficients `(0n, 1n)`.
2. While the second remainder is not zero, compute `quotient = remainder / nextRemainder` (`BigInt` division truncates, which is what the algorithm needs).
3. Apply the same update to all three pairs simultaneously: the new second entry is `first - quotient * second`, and the old second entry becomes the new first. Destructuring assignment does all three in one step each, with no temporary variables.
4. When the loop ends, the first remainder is the gcd and the first entries of the two coefficient pairs are `x` and `y`.

Because every pair receives the identical linear update, the invariant `a*x + b*y = remainder` that held for both seeds holds for every later pair too. That is the entire proof.

## Worked example — 95 Bezout coefficients with BigInt

Input, from the first row of the test's table: `a = 30n`, `b = 18n`.

| step | `remainder` | `nextRemainder` | `quotient` | `x` | `nextX` | `y` | `nextY` |
| --- | --- | --- | --- | --- | --- | --- | --- |
| seed | `30n` | `18n` | — | `1n` | `0n` | `0n` | `1n` |
| 1 | `18n` | `12n` | `30n/18n = 1n` | `0n` | `1n` | `1n` | `-1n` |
| 2 | `12n` | `6n` | `18n/12n = 1n` | `1n` | `-1n` | `-1n` | `2n` |
| 3 | `6n` | `0n` | `12n/6n = 2n` | `-1n` | `3n` | `2n` | `-5n` |

The loop stops because `nextRemainder` is `0n`. The result is `{gcd: 6n, x: -1n, y: 2n}`.

Check the identity the way the test does: `30n * -1n + 18n * 2n` = `-30n + 36n` = `6n`, which equals the expected gcd. Asserted on line 5 of the test file, inside the loop over the four cases.

Check the invariant at an intermediate step too — step 2 has `remainder = 12n` with `x = 1n`, `y = -1n`: `30n*1n + 18n*(-1n)` = `12n`. It holds all the way down.

The reference solution, as it now reads in `solutions/095-extended-gcd.cjs`:

```js
function extendedGcd(a, b) {
  let remainder = a;
  let nextRemainder = b;
  let x = 1n;
  let nextX = 0n;
  let y = 0n;
  let nextY = 1n;
  while (nextRemainder !== 0n) {
    const quotient = remainder / nextRemainder;
    [remainder, nextRemainder] = [nextRemainder, remainder - quotient * nextRemainder];
    [x, nextX] = [nextX, x - quotient * nextX];
    [y, nextY] = [nextY, y - quotient * nextY];
  }
  return { gcd: remainder, x, y };
}
```

## Variations you could build

| Variation | What would change in the code |
| --- | --- |
| Return only the gcd | drop both coefficient pairs; the loop keeps just the remainder update |
| Modular inverse of `a` mod `m` | call this, check `gcd === 1n`, then return `((x % m) + m) % m` |
| Accept negative inputs | normalise the signs before the loop and adjust the coefficients afterwards, since the current code relies on nonnegative inputs for a nonnegative gcd |

## Pitfalls the tests are designed to catch

- **Updating the pairs in sequence rather than simultaneously.** Writing `remainder = nextRemainder;` then `nextRemainder = remainder - …` uses the value you just overwrote. Destructuring evaluates the whole right-hand side first, which is why the reference uses it.
- **Recomputing `quotient` after the remainders have moved.** It must be captured once, before any of the three updates.
- **Returning `{gcd:0n, x:0n, y:0n}` for `(0n,0n)`.** The identity holds, but the final `deepEqual` pins the answer to `{gcd:0n, x:1n, y:0n}`.
- **Mixing `Number` into the arithmetic.** `remainder / nextRemainder` on `BigInt` operands truncates; on `Number` operands it does not, and the algorithm silently stops working.
- **Using `%` and a separate division.** Equivalent, but then the quotient still has to be captured for the coefficient updates, so nothing is saved.
- **Swapping `x` and `y` in the return.** The test would catch it on `(30n,18n)`, since `30n*2n + 18n*(-1n)` is `42n`, not `6n`.

## Try it yourself

1. Add an assertion inside the loop that `a*x + b*y === remainder`, run the four test cases, and watch the invariant hold at every step.
2. Use the function to solve `17x ≡ 1 (mod 5)`. Which returned field is the answer, and what has to be done to it first?
3. In words: the test checks the identity rather than the coefficient values. Explain why a test that pinned `x` and `y` to specific numbers would be a worse test of this function.
