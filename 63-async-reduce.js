// Exercise 63 — Sequential async reduction (data-dependent steps)
// Write async asyncReduce(items, reducer, initial). The explicit initial
// value may be a promise. Await it, then call reducer(acc, item, index)
// in ascending order, awaiting each result before calling the next reducer.
// Empty items -> awaited initial. Stop on initial/reducer rejection or
// synchronous throw, preserving the exact reason. Do not mutate items.
// Dense array; reducer is a function. Unlike mapLimit, steps depend on the
// previous result, so parallel work would be incorrect.
// Hint: a for loop with await is clearer than an async forEach callback.
// Run with: node 63-async-reduce.js
const assert = require("node:assert/strict");

async function asyncReduce(items, reducer, initial) {
  // your code here
  throw new Error("TODO: asyncReduce");
}

async function check() {
  assert.equal(await asyncReduce([2, 3, 4], async (acc, n) => acc * n, Promise.resolve(1)), 24);
  assert.equal(await asyncReduce([], () => 99, 7), 7);
  assert.equal(await asyncReduce(["a", "b"], (acc, s, i) => acc + i + s, ""), "0a1b");
  console.log("63 sample checks passed");
}
check().catch((error) => { console.error(error); process.exitCode = 1; });
