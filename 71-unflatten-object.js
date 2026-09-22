// Exercise 71 — Rebuild nested configuration with conflict detection
// Write unflattenObject(entries), accepting a Map<string, leaf>. Leaves are
// string/finite number/boolean/null or empty plain objects only. Split each
// path on '.' and create plain object containers. Empty Map -> {}. Clone
// empty-object leaves. Never mutate input. No arrays, getters or cycles.
// Throw Error for empty path/segment, or for a '__proto__', 'constructor',
// or 'prototype' segment. Throw Error for conflicting paths ('a' plus 'a.b')
// in EITHER insertion order, even when 'a' stores {}. Duplicate full paths
// cannot occur because input is a Map. Other input constraints are valid.
// Hint: validate all paths/prefixes first, then build; a Set of full paths
// distinguishes a declared empty-object leaf from an implicit container.
// Run with: node 71-unflatten-object.js
const assert = require("node:assert/strict");
function unflattenObject(entries) {
  // your code here
  throw new Error("TODO: unflattenObject");
}
assert.deepEqual(unflattenObject(new Map([["user.name", "Ada"], ["user.flags", {}], ["ok", true]])), {
  user: { name: "Ada", flags: {} }, ok: true,
});
assert.throws(() => unflattenObject(new Map([["a.b", 1], ["a", {}]])), Error);
assert.throws(() => unflattenObject(new Map([["a..b", 1]])), Error);
console.log("71 sample checks passed");
