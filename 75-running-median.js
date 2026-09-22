// Exercise 75 — Running median with sorted insertion
// Build RunningMedian: add(number) inserts a finite number and returns
// the new median; median() returns current median or undefined if empty;
// size is a read-only getter. Duplicates count. Even sizes average the two
// central values. Invalid add throws TypeError without changing the stream.
// For this exercise |number| <= 1e9 and at most 10000 inserts; no heaps needed.
// Keep a sorted internal array using binary-search insertion (no sort on
// every add). O(n) insertion and O(1) median are fine. Do not expose storage.
// Hint: binary search finds an insertion point, splice makes room, and the
// parity of size decides one middle element versus two.
// Run with: node 75-running-median.js
const assert = require("node:assert/strict");
class RunningMedian {
  // your code here — add(number), median(), get size()
}
const stream = new RunningMedian();
assert.equal(stream.median(), undefined);
assert.deepEqual([stream.add(5), stream.add(1), stream.add(9), stream.add(3)], [5, 3, 5, 4]);
assert.equal(stream.size, 4);
assert.throws(() => stream.add(NaN), TypeError);
console.log("75 sample checks passed");
