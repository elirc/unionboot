// Exercise 78 — A shared history buffer for two editors
// Write createHistory(maxLength). It tracks ONE cursor over entries and is
// safe when several wrappers share it: every call sees the same cursor.
// API: push(entry) truncates redo entries, then appends, evicting from the
// FRONT when length exceeds max; canUndo(), undo(), canRedo(), redo().
// push returns the new length; undo/redo return the entry now under the
// cursor, or undefined when impossible; they never throw on empty history.
// max must be an integer >= 1 (throw RangeError). State must NOT be shared
// with other createHistory instances. Entries are arbitrary values.
// Hint: think 'cursor = last applied entry; undo moves cursor left; redo
// moves right'. 'past', 'future', and 'current' each need one boundary test.
// Run with: node 78-undo-redo.js
const assert = require("node:assert/strict");
function createHistory(max) {
  // your code here
  throw new Error("TODO: createHistory");
}
const history = createHistory(2);
history.push("a");
history.push("b");
history.push("c");
assert.equal(history.undo(), "b");
assert.equal(history.undo(), undefined); // 'a' was evicted; 'b' is the oldest retained entry
assert.equal(history.canUndo(), false);
assert.equal(history.redo(), "c");
assert.equal(history.push("d"), 2);
assert.equal(history.canRedo(), false);
assert.throws(() => createHistory(0), RangeError);
console.log("78 sample checks passed");
