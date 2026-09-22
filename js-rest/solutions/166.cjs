// 166: Tree labels in level-order
// Input null or {label:string,children:Node[]}. Return labels in level-order, respecting child order. No mutation; trees contain no cycles. leaves-only uses depth-first order.
// Tests: node js-rest/verify.cjs --id=166 [--starters]
// Study tests/166.cjs for examples.
function solve(input) {
if(input===null)return [];const out=[];const q=[input];for(let i=0;i<q.length;i++){out.push(q[i].label);q.push(...q[i].children);}return out;
}
module.exports=solve;
