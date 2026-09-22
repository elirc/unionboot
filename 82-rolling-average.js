// Exercise 82 — Rolling average over a live measurement feed
// Write createRollingAverage(windowSize). windowSize must be an integer >= 1
// (throw RangeError otherwise). Returns {push, average, size, reset}:
// push(number) stores the value and returns the current average as a
// number (NaN until at least one value is stored); average() as above;
// size is a read-only getter for stored values; reset() empties and
// returns undefined. Only the NEWEST windowSize values count; older ones
// stop affecting the average. Each instance is independent. Numbers may
// include negatives and duplicates but are finite.
// Hint: a ring buffer of fixed length plus a running sum makes push O(1);
// subtract the value leaving the window instead of re-summing each time.
// Run with: node 82-rolling-average.js
const assert = require("node:assert/strict");
function createRollingAverage(windowSize) {
  // your code here
  throw new Error("TODO: createRollingAverage");
}
const feed = createRollingAverage(3);
assert.equal(feed.push(10), 10);
assert.equal(feed.push(20), 15);
assert.equal(feed.push(30), 20);
assert.equal(feed.push(40), 30);
assert.equal(feed.size, 3);
feed.reset();
assert.ok(Number.isNaN(feed.average()));
assert.throws(() => createRollingAverage(0), RangeError);
console.log("82 sample checks passed");
