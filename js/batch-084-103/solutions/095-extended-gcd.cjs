// 95: Bezout coefficients with BigInt
// Given nonnegative BigInts a,b, return {gcd,x,y} with a*x+b*y=gcd. gcd must be nonnegative. For (0n,0n), use {gcd:0n,x:1n,y:0n}. Coefficients are not otherwise unique.
// Hint: Track coefficient pairs alongside Euclidean remainders.
// Test starter: node js/batch-084-103/verify.cjs --starters --id=95
'use strict';
// Why this works:
// The Euclidean algorithm repeatedly replaces the remainder pair (r, rNext)
// with (rNext, r - quotient * rNext) until the second one is zero; the first
// one is then the gcd. The "extended" part carries two coefficient pairs
// through the same steps so that a*x + b*y = r holds for every remainder r
// that appears.
// The invariant is seeded by two equations that are true by inspection:
// a*1n + b*0n = a and a*0n + b*1n = b. That is why x starts at (1n, 0n) and y
// starts at (0n, 1n). Each step subtracts the same quotient multiple from the
// coefficients as from the remainders, so the invariant survives untouched.
// Both inputs are nonnegative, so every remainder is nonnegative and the
// returned gcd is too.
// For (0n, 0n) the loop body never runs and the seeds are returned as they
// are: {gcd:0n, x:1n, y:0n}, which is the value the header specifies.
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
module.exports = extendedGcd;
