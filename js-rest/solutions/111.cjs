// 111: anti join by identifier
// Input {left:[{id,value}],right:[{id,value}]}, unique numeric ids per side. Return left-only [id,leftValue] rows sorted by id. Implement a anti join; null denotes an absent side. No mutation.
// Tests: node js-rest/verify.cjs --id=111 [--starters]
// Study tests/111.cjs for examples.
function solve(input) {
const a=new Map(input.left.map(r=>[r.id,r.value])),b=new Map(input.right.map(r=>[r.id,r.value]));const ids=[...new Set([...a.keys(),...b.keys()])].sort((x,y)=>x-y);return ids.filter(id=>a.has(id)&&!b.has(id)).map(id=>[id,a.get(id)]);
}
module.exports=solve;
