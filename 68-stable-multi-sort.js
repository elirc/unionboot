// Exercise 68 — Stable sorting by several business rules
// Write multiSort(rows, rules). Each rule is {key, direction:'asc'|'desc'}.
// Return a new shallow array sorted by the rules in priority order. A tie
// on all rules preserves original order. Empty rules -> shallow copy.
// Each row is an object with every key as its own property; values for a
// given key are all finite numbers OR all strings. Compare strings with
// JS '<'/'>' (case-sensitive code-unit order), NOT localeCompare.
// Rules are valid; no missing values, nesting or coercion. Do not mutate
// rows, row objects or rules. Hint: return the first nonzero comparison;
// decorate with original index to make your final tie-break explicit.
// Run with: node 68-stable-multi-sort.js
const assert = require("node:assert/strict");
function multiSort(rows, rules) {
  // your code here
  throw new Error("TODO: multiSort");
}
const rows = [
  { id: "a", team: "b", score: 9 }, { id: "b", team: "a", score: 2 },
  { id: "c", team: "a", score: 5 }, { id: "d", team: "a", score: 5 },
];
assert.deepEqual(multiSort(rows, [{ key: "team", direction: "asc" }, { key: "score", direction: "desc" }]).map((r) => r.id), ["c", "d", "b", "a"]);
assert.deepEqual(rows.map((r) => r.id), ["a", "b", "c", "d"]);
assert.notEqual(multiSort(rows, []), rows);
console.log("68 sample checks passed");
