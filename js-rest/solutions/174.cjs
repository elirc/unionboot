// 174: Interpolated percentile 75
// Input finite-number array. Sort a copy. Return percentile 75 using linear interpolation at (length-1)*p/100; null if empty. Do not mutate input.
// Tests: node js-rest/verify.cjs --id=174 [--starters]
// Study tests/174.cjs for examples.
// Why this works:
// An empty list has no percentile, so null is returned before any sorting.
// The values are copied with a spread before sorting, because sort() reorders
// in place and the input must survive unchanged. The comparator (a, b) => a-b
// is required: the default sort compares values as strings.
// The percentile is located at the fractional index (n - 1) * p / 100, then
// the two neighbouring sorted values are blended in proportion to how far the
// index sits between them, which is linear interpolation.
// Policy 75: like 25, the index usually lands between two sorted values.
function solve(input) {
  if (input.length === 0) {
    return null;
  }
  const percentile = 75;
  const sorted = [...input].sort((a, b) => a - b);
  const position = (sorted.length - 1) * percentile / 100;
  const lowerIndex = Math.floor(position);
  const upperIndex = Math.ceil(position);
  const fraction = position - lowerIndex;
  return sorted[lowerIndex] + (sorted[upperIndex] - sorted[lowerIndex]) * fraction;
}
module.exports=solve;
