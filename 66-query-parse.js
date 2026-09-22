// Exercise 66 — Parse a form-style query string
// Write parseQuery(text) returning a Map<string, string[]> in first-key
// appearance order. Remove one leading '?'; split on '&', ignore empty
// segments. Split each segment at its FIRST '='; absent '=' means value ''.
// In both key and value replace '+' with space, then decodeURIComponent.
// Repeated keys append values; empty keys are allowed. Keep case; do not
// strip '#', trim, or coerce values. Malformed percent encoding throws URIError.
// Do not use URLSearchParams. Hint: Map safely accepts any decoded key;
// splitting on every '=' would lose part of a value such as token=a=b.
// Run with: node 66-query-parse.js
const assert = require("node:assert/strict");
function parseQuery(text) {
  // your code here
  throw new Error("TODO: parseQuery");
}
assert.deepEqual([...parseQuery("?tag=js&tag=node&q=hello+world&flag")], [
  ["tag", ["js", "node"]], ["q", ["hello world"]], ["flag", [""]],
]);
assert.deepEqual([...parseQuery("x=a=b&&%61=1")], [["x", ["a=b"]], ["a", ["1"]]]);
assert.throws(() => parseQuery("bad=%ZZ"), URIError);
console.log("66 sample checks passed");
