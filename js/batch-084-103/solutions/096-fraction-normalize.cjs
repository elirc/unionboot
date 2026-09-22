// 96: Normalize a rational number
// Given BigInt numerator and denominator, return [numerator,denominator] reduced to lowest terms, with positive denominator. Zero normalizes to [0n,1n]. A zero denominator throws RangeError.
// Hint: Normalize the sign, then divide both values by their greatest common divisor.
// Test starter: node js/batch-084-103/verify.cjs --starters --id=96
'use strict';
// Why this works:
// Sign first. If the denominator is negative, negating both halves leaves the
// value of the fraction unchanged and moves the sign, if there is one, onto
// the numerator. That is the canonical form the header asks for, and it is why
// solve(2n,-6n) comes back as [-1n,3n] rather than [1n,-3n].
// Then divide both halves by their greatest common divisor, computed with the
// Euclidean algorithm on the absolute value of the numerator and the (now
// positive) denominator. Taking the absolute value keeps the divisor positive,
// so the division cannot flip the sign back.
// Zero needs no special case: gcd(0n, d) is d, so 0n/d is 0n and d/d is 1n,
// giving [0n,1n].
// A zero denominator has no normal form at all and throws RangeError before
// anything else runs. The parameters are copied into local variables so the
// caller's bindings are untouched.
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
module.exports = normalizeFraction;
