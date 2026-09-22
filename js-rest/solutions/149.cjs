// 149: Interval membership: open
// Input {start,end,values}. Reject start>end with Error('Invalid interval'). Return values within open interval: start<x<end. Preserve order/duplicates.
// Tests: node js-rest/verify.cjs --id=149 [--starters]
// Study tests/149.cjs for examples.
// Why this works:
// The guard runs before any filtering, so a reversed interval reports
// Error('Invalid interval') even when values is empty.
// Array.prototype.filter builds a new array and visits the values in order,
// which preserves both the original order and any duplicates.
// Policy open: neither end belongs to the interval, start < x < end, so a
// degenerate interval where start === end admits nothing at all.
function solve(input) {
  const { start, end, values } = input;
  if (start > end) {
    throw new Error('Invalid interval');
  }
  return values.filter(value => value > start && value < end);
}
module.exports=solve;
