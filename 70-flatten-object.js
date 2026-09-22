// Exercise 70 — Flatten nested configuration into dotted paths
// Write flattenObject(root), returning a Map of dotted path -> leaf value.
// Root/nested containers are plain objects only; leaves are string, finite
// number, boolean or null. No arrays, undefined, symbols, getters or cycles.
// Keys are nonempty strings without '.'; no '__proto__', 'prototype', or
// 'constructor' segments. Inputs satisfy these constraints (no validation).
// Preserve Object.keys depth-first order. Preserve an empty nested object
// as a NEW {} leaf, so {a:{}} -> Map([['a',{}]]); empty root -> empty Map.
// Do not mutate input. Unlike exercise 10, this is a path representation,
// not array flattening. Hint: carry a path prefix down the recursion and
// treat a container with no keys as a special leaf.
// Run with: node 70-flatten-object.js
const assert = require("node:assert/strict");
function flattenObject(root) {
  // your code here
  throw new Error("TODO: flattenObject");
}
assert.deepEqual([...flattenObject({ user: { name: "Ada", flags: {} }, active: true })], [
  ["user.name", "Ada"], ["user.flags", {}], ["active", true],
]);
assert.deepEqual([...flattenObject({})], []);
assert.deepEqual([...flattenObject({ a: { b: null } })], [["a.b", null]]);
console.log("70 sample checks passed");
