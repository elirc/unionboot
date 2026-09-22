// 158: Positive streak: first
// Input finite-number array. Return {start,length} for first contiguous run of strictly positive numbers, or null.  Zero/negative breaks a streak.
// Tests: node js-rest/verify.cjs --id=158 [--starters]
// Study tests/158.cjs for examples.
function solve(input) {
const runs=[];for(let i=0;i<input.length;){if(input[i]<=0){i++;continue;}const start=i;while(i<input.length&&input[i]>0)i++;runs.push({start,length:i-start});}if(!runs.length)return null;return runs[0];
}
module.exports=solve;
