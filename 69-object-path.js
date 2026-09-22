// Exercise 69 — Own-property path lookup with a real missing sentinel
// Write getPath(root, path, fallback). path is an array of string keys or
// nonnegative integer indices (NOT a dotted string). Empty path -> root.
// Traverse only own properties of non-null objects/arrays; functions and
// primitives cannot be traversed. A missing step returns fallback, but an
// existing final property containing undefined/null/false returns that
// exact value. Do not mutate anything. Inputs have no getters or proxies.
// Hint: Object.hasOwn separates 'absent' from 'present but undefined';
// truthiness and optional chaining with ?? both lose that distinction.
// Run with: node 69-object-path.js
const assert = require("node:assert/strict");
function getPath(root, path, fallback) {
  // your code here
  throw new Error("TODO: getPath");
}
const data = { users: [{ name: "Ada", middle: undefined }], count: 0 };
assert.equal(getPath(data, ["users", 0, "name"], "missing"), "Ada");
assert.equal(getPath(data, ["users", 0, "middle"], "missing"), undefined);
assert.equal(getPath(data, ["toString"], "missing"), "missing");
assert.equal(getPath(data, [], "missing"), data);
console.log("69 sample checks passed");
