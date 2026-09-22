// 112: Aggregate nested tree: sum
// Input null or a tree {value:number,children:Tree[]}. Return sum across all nodes. Empty tree returns 0. Use a stack to handle deep trees without recursive calls.
// Tests: node js-rest/verify.cjs --id=112 [--starters]
// Study tests/112.cjs for examples.
function solve(input) {
if(input===null)return 0;const stack=[input];let result=0;while(stack.length){const n=stack.pop();result+=n.value;stack.push(...n.children);}return result;
}
module.exports=solve;
