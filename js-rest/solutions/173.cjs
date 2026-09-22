// 173: Interpolated percentile 25
// Input finite-number array. Sort a copy. Return percentile 25 using linear interpolation at (length-1)*p/100; null if empty. Do not mutate input.
// Tests: node js-rest/verify.cjs --id=173 [--starters]
// Study tests/173.cjs for examples.
// Why this works:
// An empty list has no percentile, so null is returned before any sorting.
// The values are copied with a spread before sorting, because sort() reorders
// in place and the input must survive unchanged. The comparator (a, b) => a-b
// is required: the default sort compares values as strings.
// The percentile is located at the fractional index (n - 1) * p / 100, then
// the two neighbouring sorted values are blended in proportion to how far the
// index sits between them, which is linear interpolation.
// Policy 25: the index usually falls between two values, so this variant is
// the one that actually exercises the interpolation.
function solve(input) {
  if (input.length === 0) {
    return null;
  }
  const percentile = 25;
  const sorted = [...input].sort((a, b) => a - b);
  const position = (sorted.length - 1) * percentile / 100;
  const lowerIndex = Math.floor(position);
  const upperIndex = Math.ceil(position);
  const fraction = position - lowerIndex;
  return sorted[lowerIndex] + (sorted[upperIndex] - sorted[lowerIndex]) * fraction;
}
module.exports=solve;
