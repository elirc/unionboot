// 88: Build a range-sum query function
// Return query(start,end) summing nums[start..end), in O(1) per query after O(n) setup. Reject noninteger indices or bounds outside 0 <= start <= end <= length with RangeError. Capture a snapshot, not later input mutations.
// Hint: A prefix array with an initial zero makes empty ranges natural.
// Test starter: node js/batch-084-103/verify.cjs --starters --id=88
'use strict';
function rangeSumIndex(nums) {
  const prefix=[0]; for(const n of nums)prefix.push(prefix[prefix.length-1]+n);
  return (start,end)=>{
    if(!Number.isInteger(start)||!Number.isInteger(end)||start<0||end<start||end>=prefix.length)throw new RangeError('Invalid range');
    return prefix[end]-prefix[start];
  };
}
module.exports = rangeSumIndex;
