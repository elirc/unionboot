// Exercise 72 — Combine occupied calendar ranges
// Write mergeIntervals(intervals). Each interval is [start,end] with finite
// numbers and start <= end, representing a CLOSED range. Return sorted,
// nonoverlapping ranges; merge touching ranges too ([1,3]+[3,5] -> [1,5]).
// Include zero-length ranges. Empty input -> []. Input is valid; do not
// mutate either the outer array or inner pairs. Every output pair is new.
// Hint: sort a copy by start, then either extend your last output interval
// or append a new one. A contained interval must not shrink its container.
// Run with: node 72-merge-intervals.js
const assert = require("node:assert/strict");
function mergeIntervals(intervals) {
  // your code here
  throw new Error("TODO: mergeIntervals");
}
assert.deepEqual(mergeIntervals([[8, 10], [1, 3], [2, 6], [10, 10]]), [[1, 6], [8, 10]]);
assert.deepEqual(mergeIntervals([[1, 8], [2, 3], [8, 9]]), [[1, 9]]);
assert.deepEqual(mergeIntervals([]), []);
console.log("72 sample checks passed");
