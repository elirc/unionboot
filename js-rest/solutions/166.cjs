// 166: Tree labels in level-order
// Input null or {label:string,children:Node[]}. Return labels in level-order, respecting child order. No mutation; trees contain no cycles. leaves-only uses depth-first order.
// Tests: node js-rest/verify.cjs --id=166 [--starters]
// Study tests/166.cjs for examples.
// Why this works:
// A null tree has no labels, so the empty array is returned before anything
// is visited.
// Policy level-order: this is a breadth-first walk, so it uses a queue rather
// than recursion. The queue is an array plus a read cursor: nodes are read
// from the front with the index and appended at the back, which avoids the
// cost of shift() and keeps every node in arrival order.
// Because the cursor never passes a node before the whole previous level has
// been appended, labels come out one depth at a time.
// Labels are copied into a new array; the tree itself is only read.
function solve(input) {
  if (input === null) {
    return [];
  }
  const labels = [];
  const queue = [input];
  for (let cursor = 0; cursor < queue.length; cursor++) {
    const node = queue[cursor];
    labels.push(node.label);
    for (const child of node.children) {
      queue.push(child);
    }
  }
  return labels;
}
module.exports=solve;
