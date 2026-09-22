// 150: Interval membership: left-closed
// Input {start,end,values}. Reject start>end with Error('Invalid interval'). Return values within left-closed interval: start<=x<end. Preserve order/duplicates.
// Tests: node js-rest/verify.cjs --id=150 [--starters]
// Study tests/150.cjs for examples.
// Why this works:
// The guard runs before any filtering, so a reversed interval reports
// Error('Invalid interval') even when values is empty.
// Array.prototype.filter builds a new array and visits the values in order,
// which preserves both the original order and any duplicates.
// Policy left-closed: start belongs, end does not, start <= x < end. This is
// the half-open convention used by array slices and by the run exercises.
function solve(input) {
  const { start, end, values } = input;
  if (start > end) {
    throw new Error('Invalid interval');
  }
  return values.filter(value => value >= start && value < end);
}
module.exports=solve;
