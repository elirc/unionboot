// Exercise 44 — Power set (bitmask or recursion)
// Write subsets(nums) — ALL possible subsets of a distinct-number
// array. n elements → 2^n subsets, including [] and the full array.
// Order within each subset should follow the input order.
//
// Run with:  node 44-power-set.js

function subsets(nums) {
  // your code here
}

console.log(subsets([1, 2, 3]));
// expected: [
//   [],       [ 1 ],    [ 2 ],
//   [ 1, 2 ], [ 3 ],    [ 1, 3 ],
//   [ 2, 3 ], [ 1, 2, 3 ]
// ]  (any order of the 8 subsets is fine)

console.log(subsets([]).length); // expected: 1  (just the empty set)
