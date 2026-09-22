// 112: Aggregate nested tree: sum
// Input null or a tree {value:number,children:Tree[]}. Return sum across all nodes. Empty tree returns 0. Use a stack to handle deep trees without recursive calls.
// Tests: node js-rest/verify.cjs --id=112 [--starters]
// Study tests/112.cjs for examples.
// Why this works:
// The prompt asks for a stack rather than recursion so that a very deep tree
// cannot exhaust the JavaScript call stack.
// An ordinary array is the stack: pop a node, fold its value into the running
// result, then push its children so they are visited later.
// Policy sum: the accumulator starts at 0 and each node value is added.
// A null tree short-circuits to 0 before the loop starts.
// Only reads happen, so the tree the caller passed in is unchanged.
function solve(input) {
  if (input === null) {
    return 0;
  }
  const stack = [input];
  let total = 0;
  while (stack.length > 0) {
    const node = stack.pop();
    total += node.value;
    for (const child of node.children) {
      stack.push(child);
    }
  }
  return total;
}
module.exports=solve;
