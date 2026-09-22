// Exercise 28 — Tree sum (recursion on trees)
// Count the total of all `value` fields in this nested tree.
// Write treeSum(node) recursively. Handle an empty tree (null) → 0.
//
// Run with:  node 28-tree-sum.js

const tree = {
  value: 1,
  children: [
    { value: 2, children: [{ value: 4, children: [] }, { value: 5, children: [] }] },
    { value: 3, children: [{ value: 6, children: [] }] },
  ],
};

function treeSum(node) {
  // your code here
}

console.log(treeSum(tree)); // expected: 21
console.log(treeSum(null)); // expected: 0
