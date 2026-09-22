// Exercise 27 — Memoize (closures + Map cache)
// Write memoize(fn) that returns a cached version of fn (one argument).
// Same argument → same result, computed only once. Argument can be
// ANY type (objects too) — Map keys handle that where object keys can't.
//
// Run with:  node 27-memoize.js

let slowCalls = 0;
function slowSquare(n) {
  slowCalls++;
  return n * n;
}

function memoize(fn) {
  // your code here
}

const fastSquare = memoize(slowSquare);
console.log(fastSquare(4));      // expected: 16
console.log(fastSquare(4));      // expected: 16 (cached)
console.log(fastSquare(5));      // expected: 25
console.log(fastSquare(4));      // expected: 16 (cached)
console.log(slowCalls);          // expected: 2 (only 4 and 5 ever computed)

// objects as keys (memoize must distinguish them):
const key1 = { id: 1 };
const key2 = { id: 1 };
const fn2 = memoize((k) => ({ id: k.id }));   // returns a NEW object each compute
console.log(fn2(key1) === fn2(key1)); // expected: true  (same object → cached)
console.log(fn2(key1) === fn2(key2)); // expected: false (different objects → computed twice)
