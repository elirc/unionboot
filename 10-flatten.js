// Exercise 10 — Flatten one level (arrays)
// Write flatten(arr) — takes an array that may contain nested arrays
// and returns a single-level array. (No Array.prototype.flat allowed!)
//
// Run with:  node 10-flatten.js

function flatten(arr) {
  // your code here
}

console.log(flatten([1, [2, 3], [4, [5]]]));
// expected: [ 1, 2, 3, 4, [ 5 ] ]  (only ONE level flattened)
console.log(flatten([[], [1], [2, 3]])); // expected: [ 1, 2, 3 ]
