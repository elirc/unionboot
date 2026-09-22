// Exercise 25 — groupBy (higher-order functions)
// Write groupBy(arr, keyFn) — groups elements by whatever
// keyFn(item) returns.
//
// Run with:  node 25-group-by.js

function groupBy(arr, keyFn) {
  // your code here
}

console.log(groupBy([1, 2, 3, 4], (n) => (n % 2 === 0 ? "even" : "odd")));
// expected: { odd: [ 1, 3 ], even: [ 2, 4 ] }

console.log(groupBy(["ant", "bee", "wasp", "ape"], (w) => w[0]));
// expected: { a: [ 'ant', 'ape' ], b: [ 'bee' ], w: [ 'wasp' ] }

console.log(groupBy([], (x) => x)); // expected: {}
