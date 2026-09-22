// 164: Tree labels in preorder
// Input null or {label:string,children:Node[]}. Return labels in preorder, respecting child order. No mutation; trees contain no cycles. leaves-only uses depth-first order.
// Tests: node js-rest/verify.cjs --id=164 [--starters]
// Study tests/164.cjs for examples.
function solve(input) {
if(input===null)return [];const out=[];function visit(n){out.push(n.label);for(const c of n.children)visit(c);}visit(input);return out;
}
module.exports=solve;
