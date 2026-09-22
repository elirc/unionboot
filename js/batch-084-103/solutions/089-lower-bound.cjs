// 89: First valid insertion index
// For a sorted ascending array of finite numbers, return the first index whose value is >= target; return length if none. Duplicates must return their first position. O(log n), no mutation.
// Hint: Keep a half-open search interval [lo,hi).
// Test starter: node js/batch-084-103/verify.cjs --starters --id=89
'use strict';
function lowerBound(nums,target) {
  let lo=0,hi=nums.length;
  while(lo<hi) { const mid=lo+Math.floor((hi-lo)/2); if(nums[mid]<target)lo=mid+1;else hi=mid; }
  return lo;
}
module.exports = lowerBound;
