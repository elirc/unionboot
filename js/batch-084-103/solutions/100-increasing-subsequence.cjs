// 100: Length of a strictly increasing subsequence
// Return the longest strictly increasing subsequence length of finite numbers (not necessarily contiguous). Equal values do not extend a sequence. Empty input returns 0. Target O(n log n).
// Hint: Track the smallest possible tail for each subsequence length using lower-bound search.
// Test starter: node js/batch-084-103/verify.cjs --starters --id=100
'use strict';
// Why this works:
// tails[i] holds the smallest value that can end a strictly increasing
// subsequence of length i + 1 among the values processed so far. That array is
// always sorted ascending, which is what makes it searchable by bisection.
// For each incoming value, the inner loop finds the first slot whose tail is
// >= the value (a lower-bound search, the same routine as exercise 89) and
// overwrites that slot. Overwriting keeps the recorded tail for that length as
// small as possible, which can only make future values easier to append. If no
// slot qualifies, the index found is tails.length and the value extends the
// array by one.
// The comparison tails[mid] < value is strict, so a value equal to an existing
// tail lands on that slot and replaces it instead of extending the array. That
// is the rule the header states — equal values do not extend a sequence — and
// it is why solve([2,2,2]) is 1.
// tails is not itself a valid subsequence; only its length is meaningful, and
// that length is the answer. One binary search per element gives the
// O(n log n) target.
function lisLength(nums) {
  const tails = [];
  for (const value of nums) {
    let lo = 0;
    let hi = tails.length;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (tails[mid] < value) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    tails[lo] = value;
  }
  return tails.length;
}
module.exports = lisLength;
