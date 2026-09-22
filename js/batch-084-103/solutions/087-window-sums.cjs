// 87: Rolling fixed-window sums
// Return the sum of every contiguous window of size k over finite numbers. k must be a positive integer or throw RangeError. k larger than input length returns []. Target O(n).
// Hint: Add the entering value and subtract the departing value.
// Test starter: node js/batch-084-103/verify.cjs --starters --id=87
'use strict';
function windowSums(nums,k) {
  if (!Number.isInteger(k)||k<1) throw new RangeError('Invalid window');
  const out=[]; let sum=0;
  for(let i=0;i<nums.length;i++) { sum+=nums[i]; if(i>=k)sum-=nums[i-k]; if(i>=k-1)out.push(sum); }
  return out;
}
module.exports = windowSums;
