// Exercise 45 — Permutations (backtracking)
// Write permutations(arr) — every possible ordering of the elements.
// 3 elements → 6 orderings. The backtracking pattern: pick an element,
// recurse on the rest, un-pick.
//
// Run with:  node 45-permutations.js

function permutations(arr) {
  // your code here
}

console.log(permutations([1, 2, 3]));
// expected: 6 arrays — [1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]
// (any order is fine; verify with the length check below)

console.log(permutations([1, 2, 3]).length); // expected: 6
console.log(permutations(["a"]).length);     // expected: 1
console.log(permutations([]).length);        // expected: 1  (the empty ordering)
