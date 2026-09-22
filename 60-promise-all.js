// Exercise 60 — Collect concurrent results (promise bookkeeping)
// Write promiseAll(values), an ARRAY-only version of Promise.all.
// Accept plain values, promises, and thenables. Resolve to a new array in
// INPUT order, regardless of completion order; [] resolves to []. Reject
// with the first observed rejection reason (not necessarily an Error).
// Do not use Promise.all / allSettled / race / any. Input is a dense array.
// Hint: Promise.resolve normalizes each entry; count completed positions,
// not results.length (an assignment to index 9 makes length become 10).
// Run with: node 60-promise-all.js
const assert = require("node:assert/strict");

function promiseAll(values) {
  // your code here
  throw new Error("TODO: promiseAll");
}

async function check() {
  assert.deepEqual(await promiseAll([Promise.resolve(3), 7]), [3, 7]);
  assert.deepEqual(await promiseAll([]), []);
  assert.deepEqual(await promiseAll([{ then: (resolve) => resolve("yes") }]), ["yes"]);
  await assert.rejects(promiseAll([Promise.reject(new Error("offline"))]), /offline/);
  console.log("60 sample checks passed");
}
check().catch((error) => { console.error(error); process.exitCode = 1; });
