// 114: Aggregate nested tree: min
// Input null or a tree {value:number,children:Tree[]}. Return min across all nodes. Empty tree returns null. Use a stack to handle deep trees without recursive calls.
// Tests: node js-rest/verify.cjs --id=114 [--starters]
// Study tests/114.cjs for examples.
function solve(input) {
if(input===null)return null;const stack=[input];let result=Infinity;while(stack.length){const n=stack.pop();result=Math.min(result,n.value);stack.push(...n.children);}return result;
}
module.exports=solve;
