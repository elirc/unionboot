// Exercise 62 — Limit concurrent jobs (async scheduling)
// Write async mapLimit(items, limit, worker). Call worker(item, index) once
// per item, scheduling indices in ascending order, with <= limit unfinished
// calls. Return results in input order. Values and promises are accepted.
// On a worker throw/rejection, reject with that reason and start no more
// jobs AFTER that failure is observed. Already-started jobs may finish;
// handle their rejections too. Empty items -> []. Do not mutate items.
// limit must be a positive integer; otherwise reject with RangeError.
// Input is a dense array and worker is a function. No external libraries.
// Hint: share a next-index counter among async runners, plus a stopped flag.
// A worker slot is released only after its awaited result has settled.
// Run with: node 62-concurrency-pool.js
const assert = require("node:assert/strict");

async function mapLimit(items, limit, worker) {
  // your code here
  throw new Error("TODO: mapLimit");
}

async function check() {
  assert.deepEqual(await mapLimit([3, 1, 2], 2, async (n, i) => n * 10 + i), [30, 11, 22]);
  assert.deepEqual(await mapLimit([], 2, () => { throw new Error("not called"); }), []);
  await assert.rejects(mapLimit([1], 0, (n) => n), RangeError);
  console.log("62 sample checks passed");
}
check().catch((error) => { console.error(error); process.exitCode = 1; });
