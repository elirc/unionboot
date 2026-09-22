// Exercise 59 — Binary search (the O(log n) classic)
// Write bsearch(sortedArr, target) — the index of target, or -1.
// NO linear scanning. Watch your mid calculation and boundary
// updates — off-by-one errors live here.
//
// Run with:  node 59-binary-search.js

function bsearch(arr, target) {
  // your code here
}

console.log(bsearch([1, 3, 5, 7, 9, 11], 7));   // expected: 3
console.log(bsearch([1, 3, 5, 7, 9, 11], 1));   // expected: 0  (first)
console.log(bsearch([1, 3, 5, 7, 9, 11], 11));  // expected: 5  (last)
console.log(bsearch([1, 3, 5, 7, 9, 11], 6));   // expected: -1
console.log(bsearch([], 5));                    // expected: -1
