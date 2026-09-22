// Exercise 32 — Diff two arrays (Sets & efficiency)
// Write diff(a, b) that returns { onlyInA, onlyInB, common } —
// unique values in each and the shared ones, all sorted ascending.
// Assume arrays of numbers. Your solution should be roughly O(n log n),
// NOT O(n²) — no nested filter loops.
//
// Run with:  node 32-diff-arrays.js

function diff(a, b) {
  // your code here
}

console.log(diff([1, 2, 3, 4], [3, 4, 5, 6]));
// expected: { onlyInA: [ 1, 2 ], onlyInB: [ 5, 6 ], common: [ 3, 4 ] }

console.log(diff([], [1])); // expected: { onlyInA: [], onlyInB: [ 1 ], common: [] }
