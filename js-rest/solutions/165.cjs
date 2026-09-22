// 165: Tree labels in postorder
// Input null or {label:string,children:Node[]}. Return labels in postorder, respecting child order. No mutation; trees contain no cycles. leaves-only uses depth-first order.
// Tests: node js-rest/verify.cjs --id=165 [--starters]
// Study tests/165.cjs for examples.
function solve(input) {
if(input===null)return [];const out=[];function visit(n){for(const c of n.children)visit(c);out.push(n.label);}visit(input);return out;
}
module.exports=solve;
