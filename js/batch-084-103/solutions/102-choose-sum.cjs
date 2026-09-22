// 102: Fixed-size combinations reaching a target
// Given distinct integers in input order, a nonnegative integer k and integer target, return all k-element combinations whose sum equals target. Use each position at most once; keep index order within combinations and lexicographic index order across results. Negative values are allowed. k=0,target=0 returns [[]].
// Hint: Backtrack with a start index; do not prune solely because a partial sum exceeds the target.
// Test starter: node js/batch-084-103/verify.cjs --starters --id=102
'use strict';
function chooseSum(nums,k,target) {
  const out=[],chosen=[];
  function visit(start,sum){
    if(chosen.length===k){if(sum===target)out.push([...chosen]);return;}
    for(let i=start;i<=nums.length-(k-chosen.length);i++){chosen.push(nums[i]);visit(i+1,sum+nums[i]);chosen.pop();}
  }visit(0,0);return out;
}
module.exports = chooseSum;
