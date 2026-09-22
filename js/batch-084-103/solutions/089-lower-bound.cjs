// 89: First valid insertion index
// For a sorted ascending array of finite numbers, return the first index whose value is >= target; return length if none. Duplicates must return their first position. O(log n), no mutation.
// Hint: Keep a half-open search interval [lo,hi).
// Test starter: node js/batch-084-103/verify.cjs --starters --id=89
'use strict';
// Why this works:
// Binary search over the half-open interval [lo, hi). The invariant is that
// every value before lo is known to be < target and every value from hi
// onwards is known to be >= target. Halving the interval until it is empty
// leaves lo at the first index whose value is >= target, which is the answer.
// The comparison nums[mid] < target is strict, so a value equal to the target
// moves hi down rather than lo up. That is what makes a run of duplicates
// collapse to its first position: the test asserts solve([1,3,3,7],3) is 1,
// not 2.
// If no value reaches the target, lo walks all the way to nums.length and that
// length is returned. An empty array starts with lo = hi = 0 and returns 0
// without entering the loop.
// Each step halves the interval, so this is O(log n) as the header requires,
// and the array is only read, never written.
function lowerBound(nums, target) {
  let lo = 0;
  let hi = nums.length;
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (nums[mid] < target) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  return lo;
}
module.exports = lowerBound;
