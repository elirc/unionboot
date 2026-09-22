// Exercise 52 — Unique paths (dynamic programming grid)
// A robot on an m×n grid starts top-left and can only move RIGHT or
// DOWN. Write uniquePaths(m, n) — how many distinct paths to the
// bottom-right corner.
// DP insight: paths(x, y) = paths(x-1, y) + paths(x, y-1), and the
// whole grid can be one rolling row of numbers.
//
// Run with:  node 52-unique-paths.js

function uniquePaths(m, n) {
  // your code here
}

console.log(uniquePaths(3, 7)); // expected: 28
console.log(uniquePaths(3, 2)); // expected: 3
console.log(uniquePaths(1, 1)); // expected: 1
