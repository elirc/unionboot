// 90: Compact sorted duplicates in place
// Given a sorted dense array of finite numbers, remove duplicate values in place, truncate its length, and return the new length. Use O(1) extra space. Empty input stays empty.
// Hint: A write pointer advances only for a value unlike the previous retained value.
// Test starter: node js/batch-084-103/verify.cjs --starters --id=90
'use strict';
function compactSorted(nums) {
  let write=0;
  for(let read=0;read<nums.length;read++)if(write===0||nums[read]!==nums[write-1])nums[write++]=nums[read];
  nums.length=write; return write;
}
module.exports = compactSorted;
