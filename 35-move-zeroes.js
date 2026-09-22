// Exercise 35 — Move zeroes (two pointers, in place)
// Write moveZeroes(nums) that moves every 0 to the END of the array
// while keeping the order of the non-zero elements. Must modify the
// array IN PLACE — no filter-and-concat building a new array.
//
// Run with:  node 35-move-zeroes.js

function moveZeroes(nums) {
  // your code here
}

const a = [0, 1, 0, 3, 12];
moveZeroes(a);
console.log(a); // expected: [ 1, 3, 12, 0, 0 ]

const b = [0, 0, 0];
moveZeroes(b);
console.log(b); // expected: [ 0, 0, 0 ]
