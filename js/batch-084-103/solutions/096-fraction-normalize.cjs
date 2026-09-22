// 96: Normalize a rational number
// Given BigInt numerator and denominator, return [numerator,denominator] reduced to lowest terms, with positive denominator. Zero normalizes to [0n,1n]. A zero denominator throws RangeError.
// Hint: Normalize the sign, then divide both values by their greatest common divisor.
// Test starter: node js/batch-084-103/verify.cjs --starters --id=96
'use strict';
function normalizeFraction(n,d) {
  if(d===0n)throw new RangeError('Zero denominator');
  if(d<0n){n=-n;d=-d;}
  let a=n<0n?-n:n,b=d;while(b!==0n)[a,b]=[b,a%b];
  return [n/a,d/a];
}
module.exports = normalizeFraction;
