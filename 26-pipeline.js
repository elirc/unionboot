// Exercise 26 — Pipeline (function composition)
// Write pipe(...fns) that returns a new function. Calling it runs
// each fn left-to-right, passing each result to the next:
//   pipe(f, g, h)(x)  ===  h(g(f(x)))
// Also write once(fn) that returns a version of fn that only
// actually runs on the FIRST call; later calls return that first result.
//
// Run with:  node 26-pipeline.js

function pipe(...fns) {
  // your code here
}

function once(fn) {
  // your code here
}

const double = (n) => n * 2;
const addFive = (n) => n + 5;
const toString = (n) => `result: ${n}`;

console.log(pipe(double, addFive, toString)(10)); // expected: result: 25
console.log(pipe(addFive, double)(10));           // expected: 30

let calls = 0;
const expensive = once(() => { calls++; return "expensive result"; });
console.log(expensive()); // expected: expensive result
console.log(expensive()); // expected: expensive result
console.log(expensive()); // expected: expensive result
console.log(calls);       // expected: 1
