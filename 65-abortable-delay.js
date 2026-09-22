// Exercise 65 — A cancellable pause (AbortSignal cleanup)
// Write abortableDelay(ms, signal?), returning a promise resolving undefined
// after ms. If signal is already aborted or aborts while waiting, reject
// with signal.reason by identity. No signal means a normal delay.
// ms must be finite and >= 0; reject RangeError otherwise (validate first).
// On abort clear the timer. On EVERY settlement remove any abort listener.
// Do not abort the caller's controller. signal, if supplied, is a native
// AbortSignal; built-in AbortController is available in Node 18+.
// Hint: check signal.aborted before allocating a timer; use one cleanup
// function for both paths so completed delays do not retain listeners.
// Run with: node 65-abortable-delay.js
const assert = require("node:assert/strict");

function abortableDelay(ms, signal) {
  // your code here
  throw new Error("TODO: abortableDelay");
}

async function check() {
  assert.equal(await abortableDelay(0), undefined);
  const controller = new AbortController();
  const reason = new Error("cancelled");
  const waiting = abortableDelay(1000, controller.signal);
  controller.abort(reason);
  await assert.rejects(waiting, (error) => error === reason);
  await assert.rejects(abortableDelay(-1), RangeError);
  console.log("65 sample checks passed");
}
check().catch((error) => { console.error(error); process.exitCode = 1; });
