// 130: Best candidate with all ties
// Input array of {id:string,score:number}. Return array of ids of maximum-score candidates, using all tie policy.  Empty returns [].
// Tests: node js-rest/verify.cjs --id=130 [--starters]
// Study tests/130.cjs for examples.
function solve(input) {
if(!input.length)return [];let best=-Infinity,ids=[];for(const r of input){if(r.score>best){best=r.score;ids=[r.id];}else if(r.score===best)ids.push(r.id);}return ids;
}
module.exports=solve;
