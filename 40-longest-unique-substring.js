// Exercise 40 — Longest substring without repeats (sliding window)
// Write lengthOfLongestSubstring(s) — the length of the longest run
// of characters where none repeats.
// The sliding-window pattern: two indices that move forward at
// different speeds. Never recompute from scratch.
//
// Run with:  node 40-longest-unique-substring.js

function lengthOfLongestSubstring(s) {
  // your code here
}

console.log(lengthOfLongestSubstring("abcabcbb")); // expected: 3  ("abc")
console.log(lengthOfLongestSubstring("bbbbb"));    // expected: 1
console.log(lengthOfLongestSubstring("pwwkew"));   // expected: 3  ("wke", not "pwke")
console.log(lengthOfLongestSubstring(""));         // expected: 0
