// Exercise 74 — Rank common words with deterministic ties
// Write topKWords(text, k) returning up to k {word,count} records. A word
// is a maximal run of ASCII letters A-Z/a-z; lowercase before counting.
// Apostrophes, digits, accented letters and punctuation split runs.
// Sort by count DESC, then word ASC using code-unit string comparison.
// k must be an integer >= 0; throw RangeError otherwise. k=0 or no words
// -> []. A k above distinct-word count returns everything. No localeCompare.
// Hint: (text.toLowerCase().match(/[a-z]+/g) ?? []) handles punctuation-only
// input; count with a Map, then sort records with a two-level comparator.
// Run with: node 74-top-k-words.js
const assert = require("node:assert/strict");
function topKWords(text, k) {
  // your code here
  throw new Error("TODO: topKWords");
}
assert.deepEqual(topKWords("Tea, tea! coffee; coffee. water", 2), [
  { word: "coffee", count: 2 }, { word: "tea", count: 2 },
]);
assert.deepEqual(topKWords("42...", 3), []);
assert.throws(() => topKWords("a", -1), RangeError);
console.log("74 sample checks passed");
