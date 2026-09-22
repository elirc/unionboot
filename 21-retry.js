// Exercise 21 — Retry with backoff (promises & timers)
// Write retry(fn, attempts, delayMs) that:
//   1. calls fn() (which returns a promise)
//   2. if it rejects, waits delayMs, then tries again
//   3. gives up after `attempts` total tries and re-throws the last error
//
// Run with:  node 21-retry.js
// Expect 3 failure logs then "succeeded on attempt 4".

let failCount = 0;
function flaky() {
  failCount++;
  if (failCount < 4) {
    console.log(`attempt ${failCount}: failed`);
    return Promise.reject(new Error("boom"));
  }
  return Promise.resolve("succeeded on attempt 4");
}

function retry(fn, attempts, delayMs) {
  // your code here
}

retry(flaky, 5, 200)
  .then(console.log)  // expected: succeeded on attempt 4
  .catch((err) => console.log("gave up:", err.message));
