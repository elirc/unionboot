// 165: Tree labels in postorder
// Input null or {label:string,children:Node[]}. Return labels in postorder, respecting child order. No mutation; trees contain no cycles. leaves-only uses depth-first order.
// Tests: node js-rest/verify.cjs --id=165 [--starters]
// Study tests/165.cjs for examples.
// Why this works:
// A null tree has no labels, so the empty array is returned before anything
// is visited.
// The walk is recursive, which the prompt allows here because these trees are
// stated to contain no cycles; the aggregate family 112-115 is the one that
// demands an explicit stack.
// Policy postorder: every child is visited first and the node's own label is
// pushed AFTER them, so a parent always appears later than all its
// descendants and the root is last.
// Labels are copied into a new array; the tree itself is only read.
function solve(input) {
  if (input === null) {
    return [];
  }
  const labels = [];
  const visit = node => {
    for (const child of node.children) {
      visit(child);
    }
    labels.push(node.label);
  };
  visit(input);
  return labels;
}
module.exports=solve;
