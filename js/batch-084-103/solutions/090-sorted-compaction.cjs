// 90: Compact sorted duplicates in place
// Given a sorted dense array of finite numbers, remove duplicate values in place, truncate its length, and return the new length. Use O(1) extra space. Empty input stays empty.
// Hint: A write pointer advances only for a value unlike the previous retained value.
// Test starter: node js/batch-084-103/verify.cjs --starters --id=90
'use strict';
// Why this works:
// Two indices walk the same array. `read` visits every element in turn;
// `write` marks the slot where the next kept element goes, and is also the
// count of elements kept so far.
// Because the input is sorted, equal values are adjacent, so a value is new
// exactly when it differs from the last value already kept, nums[write - 1].
// The first element has nothing before it, which is the write === 0 case.
// `write` is never greater than `read`, so the assignment nums[write] =
// nums[read] can only overwrite a slot that has already been read. That is why
// no second array is needed and the extra space stays O(1), as the header
// requires.
// Setting nums.length = write truncates the array in place. The test inspects
// the array itself afterwards (it expects [1,2,5]), not only the returned
// count, so the truncation is not optional.
function compactSorted(nums) {
  let write = 0;
  for (let read = 0; read < nums.length; read++) {
    if (write === 0 || nums[read] !== nums[write - 1]) {
      nums[write] = nums[read];
      write++;
    }
  }
  nums.length = write;
  return write;
}
module.exports = compactSorted;
