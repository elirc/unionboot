// 151: Interval membership: right-closed
// Input {start,end,values}. Reject start>end with Error('Invalid interval'). Return values within right-closed interval: start<x<=end. Preserve order/duplicates.
// Tests: node js-rest/verify.cjs --id=151 [--starters]
// Study tests/151.cjs for examples.
function solve(input) {
if(input.start>input.end)throw new Error('Invalid interval');return input.values.filter(x=>x>input.start&&x<=input.end);
}
module.exports=solve;
