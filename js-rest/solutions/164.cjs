// 164: Tree labels in preorder
// Input null or {label:string,children:Node[]}. Return labels in preorder, respecting child order. No mutation; trees contain no cycles. leaves-only uses depth-first order.
// Tests: node js-rest/verify.cjs --id=164 [--starters]
// Study tests/164.cjs for examples.
// Why this works:
// A null tree has no labels, so the empty array is returned before anything
// is visited.
// The walk is recursive, which the prompt allows here because these trees are
// stated to contain no cycles; the aggregate family 112-115 is the one that
// demands an explicit stack.
// Policy preorder: the node's own label is pushed BEFORE its children are
// visited, and children are visited in their given order.
// Labels are copied into a new array; the tree itself is only read.
function solve(input) {
  if (input === null) {
    return [];
  }
  const labels = [];
  const visit = node => {
    labels.push(node.label);
    for (const child of node.children) {
      visit(child);
    }
  };
  visit(input);
  return labels;
}
module.exports=solve;
