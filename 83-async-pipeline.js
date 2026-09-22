// Exercise 83 — Capstone: async pipeline with an error trap
// Write asyncPipeline(stages). stages is an array of pure stage functions
// (value => result); a stage may return a promise. Returns {run, use}.
// run(initial) chains stages: each output feeds the next; result of the
// LAST stage is the final value. use(trap) registers ONE error handler,
// replacing any previous trap. If a stage throws or rejects, the trap
// receives {error, stageIndex} and its return value becomes that stage's
// output, letting the pipeline continue; with NO trap the rejection
// propagates unchanged. Empty stages -> run returns the initial value.
// Do not mutate the stages array. run may be called multiple times.
// Hint: a for loop over stages with try/catch around one await gives you
// both the index and the recovered value — no reduce gymnastics needed.
// Run with: node 83-async-pipeline.js
const assert = require("node:assert/strict");
function asyncPipeline(stages) {
  // your code here
  throw new Error("TODO: asyncPipeline");
}
async function main() {
  const pipeline = asyncPipeline([(n) => n + 1, () => { throw new Error("boom"); }, (n) => n * 10]);
  pipeline.use(() => 0);
  assert.equal(await pipeline.run(1), 0);
  pipeline.use(({ stageIndex }) => stageIndex);
  assert.equal(await pipeline.run(5), 10);
  assert.equal(await asyncPipeline([]).run("x"), "x");
  console.log("83 sample checks passed");
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
