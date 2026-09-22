// Exercise 48 — Throttle (timers & closures)
// Write throttle(fn, intervalMs) — the wrapper runs fn AT MOST once
// per intervalMs. Calls in between are dropped (simple version).
// First call runs immediately.
//
// Run with:  node 48-throttle.js

let count = 0;
const tick = () => count++;
const throttled = throttle(tick, 200);

throttled(); // runs (first call, immediate)
throttled(); // dropped (too soon)
setTimeout(throttled, 100);  // dropped (still inside first window)
setTimeout(throttled, 250);  // runs
setTimeout(throttled, 300);  // dropped

setTimeout(() => {
  console.log(count); // expected: 2
}, 500);

function throttle(fn, intervalMs) {
  // your code here
}
