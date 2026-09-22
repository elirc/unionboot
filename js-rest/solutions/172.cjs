// 172: Interpolated percentile 0
// Input finite-number array. Sort a copy. Return percentile 0 using linear interpolation at (length-1)*p/100; null if empty. Do not mutate input.
// Tests: node js-rest/verify.cjs --id=172 [--starters]
// Study tests/172.cjs for examples.
function solve(input) {
if(!input.length)return null;const a=[...input].sort((x,y)=>x-y),index=(a.length-1)*0/100,lo=Math.floor(index),hi=Math.ceil(index);return a[lo]+(a[hi]-a[lo])*(index-lo);
}
module.exports=solve;
