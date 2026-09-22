// 167: Tree labels in leaves-only
// Input null or {label:string,children:Node[]}. Return labels in leaves-only, respecting child order. No mutation; trees contain no cycles. leaves-only uses depth-first order.
// Tests: node js-rest/verify.cjs --id=167 [--starters]
// Study tests/167.cjs for examples.
// Why this works:
// A null tree has no labels, so the empty array is returned before anything
// is visited.
// The walk is the same depth-first, children-in-order walk as preorder, which
// is what the prompt means by "leaves-only uses depth-first order".
// Policy leaves-only: a label is pushed only when the node has no children,
// so internal nodes are traversed but never recorded. A single childless root
// counts as a leaf and is returned.
// Labels are copied into a new array; the tree itself is only read.
function solve(input) {
  if (input === null) {
    return [];
  }
  const labels = [];
  const visit = node => {
    if (node.children.length === 0) {
      labels.push(node.label);
    }
    for (const child of node.children) {
      visit(child);
    }
  };
  visit(input);
  return labels;
}
module.exports=solve;
