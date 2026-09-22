// 149: Interval membership: open
// Input {start,end,values}. Reject start>end with Error('Invalid interval'). Return values within open interval: start<x<end. Preserve order/duplicates.
// Tests: node js-rest/verify.cjs --id=149 [--starters]
// Study tests/149.cjs for examples.
function solve(input) {
if(input.start>input.end)throw new Error('Invalid interval');return input.values.filter(x=>x>input.start&&x<input.end);
}
module.exports=solve;
