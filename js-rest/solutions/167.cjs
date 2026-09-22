// 167: Tree labels in leaves-only
// Input null or {label:string,children:Node[]}. Return labels in leaves-only, respecting child order. No mutation; trees contain no cycles. leaves-only uses depth-first order.
// Tests: node js-rest/verify.cjs --id=167 [--starters]
// Study tests/167.cjs for examples.
function solve(input) {
if(input===null)return [];const out=[];function visit(n){if(!n.children.length)out.push(n.label);for(const c of n.children)visit(c);}visit(input);return out;
}
module.exports=solve;
