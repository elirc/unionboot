// Exercise 61 — A complete batch report (fulfilled vs rejected records)
// Write allSettled(values) for a dense ARRAY of values/promises/thenables.
// Always fulfill with records in input order: {status:"fulfilled", value}
// or {status:"rejected", reason}. Preserve exact values/reasons; [] -> [].
// Do not use Promise.all / allSettled / race / any or exercise 60's solution.
// Hint: both .then handlers count as a completed position; rejection is
// data for the report, not a reason to reject the outer promise.
// Run with: node 61-all-settled.js
const assert = require("node:assert/strict");

function allSettled(values) {
  // your code here
  throw new Error("TODO: allSettled");
}

async function check() {
  assert.deepEqual(await allSettled([2, Promise.reject("no"), Promise.resolve(4)]), [
    { status: "fulfilled", value: 2 },
    { status: "rejected", reason: "no" },
    { status: "fulfilled", value: 4 },
  ]);
  assert.deepEqual(await allSettled([]), []);
  console.log("61 sample checks passed");
}
check().catch((error) => { console.error(error); process.exitCode = 1; });
