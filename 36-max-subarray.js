// Exercise 36 — Maximum subarray (Kadane's algorithm)
// Write maxSubArray(nums) — the largest sum of any CONTIGUOUS slice.
// The one-pass trick: at each element, decide "extend the running
// sum, or restart from here?" and track the best seen.
//
// Run with:  node 36-max-subarray.js

function maxSubArray(nums) {
  // your code here
}

console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // expected: 6   ([4,-1,2,1])
console.log(maxSubArray([5, 4, -1, 7, 8]));                // expected: 23  (take everything)
console.log(maxSubArray([-3, -1, -2]));                    // expected: -1
