// 156: Positive streak: longest
// Input finite-number array. Return {start,length} for longest contiguous run of strictly positive numbers, or null. First run wins equal lengths. Zero/negative breaks a streak.
// Tests: node js-rest/verify.cjs --id=156 [--starters]
// Study tests/156.cjs for examples.
function solve(input) {
const runs=[];for(let i=0;i<input.length;){if(input[i]<=0){i++;continue;}const start=i;while(i<input.length&&input[i]>0)i++;runs.push({start,length:i-start});}if(!runs.length)return null;return runs.reduce((best,r)=>r.length>best.length?r:best);
}
module.exports=solve;
