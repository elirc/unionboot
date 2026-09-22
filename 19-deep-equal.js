// Exercise 19 — Deep equality (recursion)
// Write deepEqual(a, b) — true if the values are equal, comparing
// objects and arrays by CONTENT (recursively), everything else with ===.
// Order matters in arrays. null counts as an object in typeof — handle it.
//
// Run with:  node 19-deep-equal.js

function deepEqual(a, b) {
  // your code here
}

console.log(deepEqual({ x: 1, y: { z: 2 } }, { x: 1, y: { z: 2 } })); // expected: true
console.log(deepEqual({ x: 1 }, { x: 1, y: undefined }));             // expected: false
console.log(deepEqual([1, [2, 3]], [1, [2, 3]]));                     // expected: true
console.log(deepEqual([1, 2, 3], [3, 2, 1]));                         // expected: false
console.log(deepEqual(null, {}));                                     // expected: false
console.log(deepEqual("abc", "abc"));                                 // expected: true
