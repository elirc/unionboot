// 131: Best candidate with error ties
// Input array of {id:string,score:number}. Return id or null of maximum-score candidates, using error tie policy. Throw Error("Tied score") if top score is shared. Empty returns null.
// Tests: node js-rest/verify.cjs --id=131 [--starters]
// Study tests/131.cjs for examples.
function solve(input) {
if(!input.length)return null;let best=-Infinity,ids=[];for(const r of input){if(r.score>best){best=r.score;ids=[r.id];}else if(r.score===best)ids.push(r.id);}if(ids.length>1)throw new Error("Tied score");return ids[0];
}
module.exports=solve;
