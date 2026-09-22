// Exercise 58 — Binary search tree (recursion + invariant)
// Implement a BST of numbers with insert(value), has(value), and
// toArray() that returns an in-order traversal (which comes out
// SORTED — that's the invariant test).
// Left subtree < node < right subtree. Duplicates: ignore silently.
//
// Run with:  node 58-binary-search-tree.js

class BST {
  // your code here
}

const tree = new BST();
[50, 30, 70, 20, 40, 60, 80, 30].forEach((v) => tree.insert(v));
console.log(tree.toArray());   // expected: [ 20, 30, 40, 50, 60, 70, 80 ]
console.log(tree.has(40));     // expected: true
console.log(tree.has(45));     // expected: false
console.log(tree.toArray().every((v, i, a) => i === 0 || v > a[i - 1])); // expected: true
