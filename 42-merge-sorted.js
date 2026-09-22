// Exercise 42 — Merge sorted arrays (two pointers)
// Write mergeSorted(a, b) — merge two already-sorted arrays into one
// sorted array. Two-pointer walk, no sort() call allowed.
//
// Run with:  node 42-merge-sorted.js

function mergeSorted(a, b) {
  // your code here
}

console.log(mergeSorted([1, 3, 5], [2, 4, 6]));    // expected: [ 1, 2, 3, 4, 5, 6 ]
console.log(mergeSorted([1, 2, 3], []));           // expected: [ 1, 2, 3 ]
console.log(mergeSorted([1, 1, 2], [1, 3]));       // expected: [ 1, 1, 1, 2, 3 ]
console.log(mergeSorted([], []));                  // expected: []
