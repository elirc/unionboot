// Exercise 77 — A small explicit state machine
// Write createMachine(initial, transitions). transitions is a plain object
// mapping state -> {event: destinationState}; values are strings and all
// destination states exist as OWN keys. Throw Error for an unknown initial
// state or unknown destination. No getters, symbols or mutation by caller
// after construction. Return {getState(), can(event), send(event)}.
// Only OWN event keys are transitions. can returns boolean without moving.
// send moves and returns the new state; unsupported event throws Error
// WITHOUT changing state. Self-transitions and states with no events work.
// Hint: validate the whole graph before making the closure, and distinguish
// a missing event from an inherited property such as 'toString'.
// Run with: node 77-state-machine.js
const assert = require("node:assert/strict");
function createMachine(initial, transitions) {
  // your code here
  throw new Error("TODO: createMachine");
}
const machine = createMachine("idle", {
  idle: { start: "running" }, running: { finish: "done", cancel: "idle" }, done: {},
});
assert.equal(machine.can("start"), true);
assert.equal(machine.send("start"), "running");
assert.equal(machine.send("finish"), "done");
assert.throws(() => machine.send("start"), Error);
assert.equal(machine.getState(), "done");
console.log("77 sample checks passed");
