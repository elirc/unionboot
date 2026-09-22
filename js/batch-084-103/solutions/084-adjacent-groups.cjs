// 84: Group consecutive equal values
// Return arrays of consecutive equal primitive values using Object.is equality. Do not merge separated runs or mutate the input. Empty input returns [].
// Hint: Compare each value with the last value of the current run, not a global lookup.
// Test starter: node js/batch-084-103/verify.cjs --starters --id=84
'use strict';
// Why this works:
// A run is a maximal stretch of neighbouring equal values, so the only thing
// that decides where the next value goes is the value immediately before it.
// The last array pushed into `groups` is always the run still being built, so
// its final element is that predecessor. No lookup keyed by value is used,
// which is why two separated runs of the same value are never merged.
// Comparison uses Object.is rather than ===, because the test asserts that
// [NaN,NaN,0,-0] groups as [[NaN,NaN],[0],[-0]]: NaN must count as equal to
// NaN, and 0 must not count as equal to -0. Both are the opposite of ===.
// The input is only read, never written, so a frozen array is safe.
function groupRuns(values) {
  const groups = [];
  for (const value of values) {
    const currentRun = groups[groups.length - 1];
    if (currentRun && Object.is(currentRun[currentRun.length - 1], value)) {
      currentRun.push(value);
    } else {
      groups.push([value]);
    }
  }
  return groups;
}
module.exports = groupRuns;
