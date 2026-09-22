// Exercise 64 — Bound a wait (timer lifecycle)
// Write withTimeout(value, ms), returning a promise adopting the supplied
// value/promise/thenable, unless a timer wins: reject Error("Timed out").
// ms must be a finite nonnegative number; invalid ms returns a promise
// rejected with RangeError. Clear the timer when the input settles first.
// Timeout does NOT cancel the underlying work. A later rejection must be
// handled, not become an unhandled rejection. At ms=0 an already-resolved
// input wins (promise microtasks run before the timer callback).
// Hint: attach both settlement handlers immediately and clear the same
// timer from both. Never leave a long timeout running after early success.
// Run with: node 64-with-timeout.js
const assert = require("node:assert/strict");

function withTimeout(value, ms) {
  // your code here
  throw new Error("TODO: withTimeout");
}

async function check() {
  assert.equal(await withTimeout(Promise.resolve("ready"), 0), "ready");
  await assert.rejects(withTimeout(new Promise(() => {}), 5), /^Error: Timed out$/);
  await assert.rejects(withTimeout(1, -1), RangeError);
  console.log("64 sample checks passed");
}
check().catch((error) => { console.error(error); process.exitCode = 1; });
