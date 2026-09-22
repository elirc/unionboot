// 113: Aggregate nested tree: count
// Input null or a tree {value:number,children:Tree[]}. Return count across all nodes. Empty tree returns 0. Use a stack to handle deep trees without recursive calls.
// Tests: node js-rest/verify.cjs --id=113 [--starters]
// Study tests/113.cjs for examples.
function solve(input) {
if(input===null)return 0;const stack=[input];let result=0;while(stack.length){const n=stack.pop();result++;stack.push(...n.children);}return result;
}
module.exports=solve;
