// 84: Group consecutive equal values
// Return arrays of consecutive equal primitive values using Object.is equality. Do not merge separated runs or mutate the input. Empty input returns [].
// Hint: Compare each value with the last value of the current run, not a global lookup.
// Test starter: node js/batch-084-103/verify.cjs --starters --id=84
'use strict';
function groupRuns(values) {
  const out = [];
  for (const value of values) {
    const last = out[out.length - 1];
    if (last && Object.is(last[last.length - 1], value)) last.push(value);
    else out.push([value]);
  }
  return out;
}
module.exports = groupRuns;
