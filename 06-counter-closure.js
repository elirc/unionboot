// Exercise 6 — Make a counter (closures)
// Write makeCounter(start = 0) that returns a function.
// Each call bumps the count and returns it.
// The two counters must be fully independent.
//
// Run with:  node 06-counter-closure.js

function makeCounter(start = 0) {
  // your code here
}

const c1 = makeCounter();
console.log(c1()); // expected: 1
console.log(c1()); // expected: 2

const c2 = makeCounter(10);
console.log(c2()); // expected: 11
console.log(c2()); // expected: 12
console.log(c1()); // expected: 3  (c1 unaffected by c2)
