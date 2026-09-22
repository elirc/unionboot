// 148: Interval membership: closed
// Input {start,end,values}. Reject start>end with Error('Invalid interval'). Return values within closed interval: start<=x<=end. Preserve order/duplicates.
// Tests: node js-rest/verify.cjs --id=148 [--starters]
// Study tests/148.cjs for examples.
function solve(input) {
if(input.start>input.end)throw new Error('Invalid interval');return input.values.filter(x=>x>=input.start&&x<=input.end);
}
module.exports=solve;
