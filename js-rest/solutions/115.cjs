// 115: Aggregate nested tree: max
// Input null or a tree {value:number,children:Tree[]}. Return max across all nodes. Empty tree returns null. Use a stack to handle deep trees without recursive calls.
// Tests: node js-rest/verify.cjs --id=115 [--starters]
// Study tests/115.cjs for examples.
function solve(input) {
if(input===null)return null;const stack=[input];let result=-Infinity;while(stack.length){const n=stack.pop();result=Math.max(result,n.value);stack.push(...n.children);}return result;
}
module.exports=solve;
