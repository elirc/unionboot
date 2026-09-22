// 87: Rolling fixed-window sums
// Return the sum of every contiguous window of size k over finite numbers. k must be a positive integer or throw RangeError. k larger than input length returns []. Target O(n).
// Hint: Add the entering value and subtract the departing value.
// Test starter: node js/batch-084-103/verify.cjs --starters --id=87
'use strict';
// Why this works:
// A sliding window. `sum` always holds the total of the values currently
// inside the window. Moving the window one step to the right adds the entering
// value nums[i] and subtracts the value that has just dropped out, nums[i - k].
// Each element is therefore added once and subtracted at most once, which
// meets the O(n) target stated in the header; recomputing each window from
// scratch would be O(n * k).
// The window is only full once i reaches k - 1, so output starts at that
// index. If the array is shorter than k the index is never reached and the
// result is the empty array.
// k is validated first: the test asserts RangeError for k = 0 and for k = 1.5,
// so both the "positive" and the "integer" halves of the check are exercised.
function windowSums(nums, k) {
  if (!Number.isInteger(k) || k < 1) {
    throw new RangeError('Invalid window');
  }
  const sums = [];
  let sum = 0;
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];
    if (i >= k) {
      sum -= nums[i - k];
    }
    if (i >= k - 1) {
      sums.push(sum);
    }
  }
  return sums;
}
module.exports = windowSums;
