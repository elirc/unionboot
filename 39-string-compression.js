// Exercise 39 — String compression (run-length encoding)
// Write compress(s) — "aaabbc" becomes "a3b2c1" (letter + count).
// If the compressed version is LONGER than the original, return the
// original instead (equal length is fine — keep the compressed one).
//
// Run with:  node 39-string-compression.js

function compress(s) {
  // your code here
}

console.log(compress("aaabbc")); // expected: a3b2c1  (6 chars, same as input — still counts)
console.log(compress("aab"));    // expected: aab    ("a2b1" would be longer)
console.log(compress("abc"));    // expected: abc
console.log(compress("aaaaaaaaaa")); // expected: a10
