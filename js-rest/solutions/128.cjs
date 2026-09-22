// 128: Best candidate with first ties
// Input array of {id:string,score:number}. Return id or null of maximum-score candidates, using first tie policy.  Empty returns null.
// Tests: node js-rest/verify.cjs --id=128 [--starters]
// Study tests/128.cjs for examples.
function solve(input) {
if(!input.length)return null;let best=-Infinity,ids=[];for(const r of input){if(r.score>best){best=r.score;ids=[r.id];}else if(r.score===best)ids.push(r.id);}return ids[0];
}
module.exports=solve;
