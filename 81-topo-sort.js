// Exercise 81 — Install order for packages (Kahn topological sort)
// Write topoSort(nodes, edges). nodes: array of unique string ids.
// edges: array of [before, after] pairs meaning before must come first.
// Return ONE valid order as a new array containing every id exactly once.
// When several nodes are ready, pick the alphabetically smallest id
// (code-unit order) so output is deterministic. Duplicate edges are legal.
// Throw Error (message includes the word 'cycle') on any cycle, including
// self-loops. Edges only reference known ids; no self-mutation of inputs.
// Hint: compute in-degrees, keep a sorted ready list (insert or re-sort —
// n is small), decrement as you emit. Leftover nodes mean a cycle.
// Run with: node 81-topo-sort.js
const assert = require("node:assert/strict");
function topoSort(nodes, edges) {
  // your code here
  throw new Error("TODO: topoSort");
}
assert.deepEqual(topoSort(["b", "a", "c"], [["a", "c"], ["b", "c"]]), ["a", "b", "c"]);
assert.deepEqual(topoSort(["x"], []), ["x"]);
assert.throws(() => topoSort(["a", "b"], [["a", "b"], ["b", "a"]]), /cycle/);
console.log("81 sample checks passed");
