// Exercise 73 — Peak simultaneous meetings (sweep line)
// Write peakOverlap(intervals), the maximum number of active meetings.
// Intervals are valid [start,end] finite numbers with start <= end, but
// here they are HALF-OPEN [start,end): a meeting ending at 10 does not
// overlap one starting at 10. Ignore zero-length meetings; [] -> 0.
// Do not mutate input. Aim for O(n log n), not checking every pair/time.
// Hint: convert to start/end events. At a shared timestamp process ends
// before starts, or sum all deltas before updating the peak.
// Run with: node 73-peak-overlap.js
const assert = require("node:assert/strict");
function peakOverlap(intervals) {
  // your code here
  throw new Error("TODO: peakOverlap");
}
assert.equal(peakOverlap([[0, 10], [5, 15], [10, 20]]), 2);
assert.equal(peakOverlap([[1, 2], [2, 3], [2, 2]]), 1);
assert.equal(peakOverlap([[4, 4]]), 0);
console.log("73 sample checks passed");
