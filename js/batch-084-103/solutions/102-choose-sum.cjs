// 102: Fixed-size combinations reaching a target
// Given distinct integers in input order, a nonnegative integer k and integer target, return all k-element combinations whose sum equals target. Use each position at most once; keep index order within combinations and lexicographic index order across results. Negative values are allowed. k=0,target=0 returns [[]].
// Hint: Backtrack with a start index; do not prune solely because a partial sum exceeds the target.
// Test starter: node js/batch-084-103/verify.cjs --starters --id=102
'use strict';
// Why this works:
// Backtracking over index positions. visit(start, sum) picks the next element
// from index `start` onwards, so no index is reused and the indices inside a
// combination stay ascending. Candidates are tried in increasing index order,
// which is what makes the finished combinations come out in lexicographic
// index order across the result.
// A branch is complete when `chosen` holds k elements. Only then is the
// running sum compared with the target, and a copy of `chosen` is pushed,
// because the later pop calls would otherwise rewrite the stored array.
// The loop bound stops as soon as too few positions remain to reach k:
// choosing index i leaves nums.length - 1 - i positions after it, and
// k - chosen.length - 1 more are still needed. That is a count-based cut, not
// a sum-based one. Pruning on the running sum would be wrong here, because
// negative values are allowed and a partial sum above the target can still
// come back down — the test's solve([5,-4,2],2,1) depends on that.
// k = 0 finishes at once with the empty combination, which matches target 0
// and gives [[]], and misses target 3 and gives [].
function chooseSum(nums, k, target) {
  const out = [];
  const chosen = [];
  function visit(start, sum) {
    if (chosen.length === k) {
      if (sum === target) {
        out.push([...chosen]);
      }
      return;
    }
    const stillNeeded = k - chosen.length;
    const lastUsableStart = nums.length - stillNeeded;
    for (let i = start; i <= lastUsableStart; i++) {
      chosen.push(nums[i]);
      visit(i + 1, sum + nums[i]);
      chosen.pop();
    }
  }
  visit(0, 0);
  return out;
}
module.exports = chooseSum;
