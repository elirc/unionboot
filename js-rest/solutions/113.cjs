// 113: Aggregate nested tree: count
// Input null or a tree {value:number,children:Tree[]}. Return count across all nodes. Empty tree returns 0. Use a stack to handle deep trees without recursive calls.
// Tests: node js-rest/verify.cjs --id=113 [--starters]
// Study tests/113.cjs for examples.
// Why this works:
// The prompt asks for a stack rather than recursion so that a very deep tree
// cannot exhaust the JavaScript call stack.
// An ordinary array is the stack: pop a node, fold it into the running
// result, then push its children so they are visited later.
// Policy count: node.value is ignored; every visited node adds one.
// A null tree short-circuits to 0 before the loop starts.
// Only reads happen, so the tree the caller passed in is unchanged.
function solve(input) {
  if (input === null) {
    return 0;
  }
  const stack = [input];
  let nodeCount = 0;
  while (stack.length > 0) {
    const node = stack.pop();
    nodeCount++;
    for (const child of node.children) {
      stack.push(child);
    }
  }
  return nodeCount;
}
module.exports=solve;
