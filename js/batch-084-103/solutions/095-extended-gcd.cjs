// 95: Bezout coefficients with BigInt
// Given nonnegative BigInts a,b, return {gcd,x,y} with a*x+b*y=gcd. gcd must be nonnegative. For (0n,0n), use {gcd:0n,x:1n,y:0n}. Coefficients are not otherwise unique.
// Hint: Track coefficient pairs alongside Euclidean remainders.
// Test starter: node js/batch-084-103/verify.cjs --starters --id=95
'use strict';
function extendedGcd(a,b) {
  let r0=a,r1=b,x0=1n,x1=0n,y0=0n,y1=1n;
  while(r1!==0n){const q=r0/r1;[r0,r1]=[r1,r0-q*r1];[x0,x1]=[x1,x0-q*x1];[y0,y1]=[y1,y0-q*y1];}
  return {gcd:r0,x:x0,y:y0};
}
module.exports = extendedGcd;
