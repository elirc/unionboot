// Exercise 47 — Debounce (timers & closures) — the real debounce!
// Write debounce(fn, waitMs) that returns a wrapped function.
// Calling the wrapper RESETS a timer; only when the calls stop for
// `waitMs` does fn actually run, with the LAST received arguments.
//
// Run with:  node 47-debounce.js
// Expected output (over ~450ms): two lines — "search: a" never prints.

let log = [];
const search = (q) => log.push(`search: ${q}`);
const debounced = debounce(search, 200);

debounced("a");
setTimeout(() => debounced("ab"), 50);
setTimeout(() => debounced("abc"), 120); // 130ms after "ab" → resets timer

setTimeout(() => {
  console.log(log); // expected: [ 'search: abc' ]
}, 500);

function debounce(fn, waitMs) {
  // your code here
}
