// 129: Best candidate with last ties
// Input array of {id:string,score:number}. Return id or null of maximum-score candidates, using last tie policy.  Empty returns null.
// Tests: node js-rest/verify.cjs --id=129 [--starters]
// Study tests/129.cjs for examples.
function solve(input) {
if(!input.length)return null;let best=-Infinity,ids=[];for(const r of input){if(r.score>best){best=r.score;ids=[r.id];}else if(r.score===best)ids.push(r.id);}return ids[ids.length-1];
}
module.exports=solve;
