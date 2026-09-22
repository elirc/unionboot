// 115: Aggregate nested tree: max
// Input null or a tree {value:number,children:Tree[]}. Return max across all nodes. Empty tree returns null. Use a stack to handle deep trees without recursive calls.
// Tests: node js-rest/verify.cjs --id=115 [--starters]
// Study tests/115.cjs for examples.
// Why this works:
// The prompt asks for a stack rather than recursion so that a very deep tree
// cannot exhaust the JavaScript call stack.
// An ordinary array is the stack: pop a node, fold its value into the running
// result, then push its children so they are visited later.
// Policy max: the accumulator starts at -Infinity so the first real value
// always replaces it. A non-null tree always has at least a root, so the
// seed can never leak into the returned value.
// Empty case: a null tree returns null, not -Infinity.
function solve(input) {
  if (input === null) {
    return null;
  }
  const stack = [input];
  let largest = -Infinity;
  while (stack.length > 0) {
    const node = stack.pop();
    largest = Math.max(largest, node.value);
    for (const child of node.children) {
      stack.push(child);
    }
  }
  return largest;
}
module.exports=solve;
