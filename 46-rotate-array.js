// Exercise 46 — Rotate array (reversal trick)
// Write rotate(nums, k) that rotates the array to the right by k
// steps, IN PLACE with O(1) extra space if you can. k may be larger
// than the array length.
// The classic trick: reverse the whole array, then reverse the first
// k elements, then the rest.
//
// Run with:  node 46-rotate-array.js

function rotate(nums, k) {
  // your code here
}

const a = [1, 2, 3, 4, 5, 6, 7];
rotate(a, 3);
console.log(a); // expected: [ 5, 6, 7, 1, 2, 3, 4 ]

const b = [1, 2];
rotate(b, 5); // 5 mod 2 = 1 effective step
console.log(b); // expected: [ 2, 1 ]
