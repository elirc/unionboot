// 88: Build a range-sum query function
// Return query(start,end) summing nums[start..end), in O(1) per query after O(n) setup. Reject noninteger indices or bounds outside 0 <= start <= end <= length with RangeError. Capture a snapshot, not later input mutations.
// Hint: A prefix array with an initial zero makes empty ranges natural.
// Test starter: node js/batch-084-103/verify.cjs --starters --id=88
'use strict';
// Why this works:
// prefix[i] is the sum of the first i values, with prefix[0] set to 0. The sum
// of nums[start..end) is then prefix[end] - prefix[start]: one subtraction, so
// O(n) to build the table and O(1) per query, exactly the split the header
// asks for.
// The leading zero is what makes an empty range natural. query(2,2) reads
// prefix[2] - prefix[2] = 0 with no special case, and query(0,0) works on an
// empty array because prefix is still [0].
// prefix is computed when rangeSumIndex is called, so it is a snapshot. The
// test writes input[0] = 999 after building the query and still expects
// query(0,1) to return 2.
// Bounds: `end` indexes into prefix, whose length is nums.length + 1, so the
// admissible range 0 <= start <= end <= nums.length is the same condition as
// end < prefix.length.
function rangeSumIndex(nums) {
  const prefix = [0];
  for (const value of nums) {
    prefix.push(prefix[prefix.length - 1] + value);
  }
  return function query(start, end) {
    if (!Number.isInteger(start) || !Number.isInteger(end)) {
      throw new RangeError('Invalid range');
    }
    if (start < 0 || end < start || end >= prefix.length) {
      throw new RangeError('Invalid range');
    }
    return prefix[end] - prefix[start];
  };
}
module.exports = rangeSumIndex;
