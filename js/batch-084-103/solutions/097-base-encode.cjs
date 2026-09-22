// 97: Encode BigInt without toString(radix)
// Return the base-2-through-36 lowercase representation of a nonnegative BigInt. Reject invalid bases with RangeError and negative values with RangeError. Do not use toString(radix). Zero returns "0".
// Hint: Collect remainder digits in reverse order.
// Test starter: node js/batch-084-103/verify.cjs --starters --id=97
'use strict';
// Why this works:
// Repeated division by the radix peels digits off the right-hand end. The
// remainder (remaining % radix) is the least significant digit not yet
// emitted, and the quotient (remaining / radix, which truncates for BigInt)
// removes it. Because digits arrive least significant first, each one is
// prepended to the result rather than appended.
// The digit alphabet is indexed by Number(remaining % radix). That remainder
// is always smaller than the radix, which is at most 36, so converting it to a
// Number is exact.
// Zero would produce no digits at all, because the loop body never runs, so it
// is returned as '0' before the loop.
// Validation is a single RangeError covering a non-integer base, a base
// outside 2..36, and a negative value; the test asserts RangeError for
// solve(2n,1) and solve(-1n,10).
// `value` is copied into `remaining` so the parameter itself is never changed.
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
module.exports = encodeBase;
