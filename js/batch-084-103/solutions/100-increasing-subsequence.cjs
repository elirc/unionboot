// 100: Length of a strictly increasing subsequence
// Return the longest strictly increasing subsequence length of finite numbers (not necessarily contiguous). Equal values do not extend a sequence. Empty input returns 0. Target O(n log n).
// Hint: Track the smallest possible tail for each subsequence length using lower-bound search.
// Test starter: node js/batch-084-103/verify.cjs --starters --id=100
'use strict';
function lisLength(nums) {
  const tails=[];
  for(const n of nums){let lo=0,hi=tails.length;while(lo<hi){const mid=Math.floor((lo+hi)/2);if(tails[mid]<n)lo=mid+1;else hi=mid;}tails[lo]=n;}
  return tails.length;
}
module.exports = lisLength;
