// Exercise 43 — Count primes (Sieve of Eratosthenes)
// Write countPrimes(n) — how many primes are strictly less than n.
// The sieve: build a boolean array, cross out multiples of each
// prime, count what survives. Nested loops are fine here — the
// sieve is O(n log log n) despite looking quadratic.
//
// Run with:  node 43-primes-sieve.js

function countPrimes(n) {
  // your code here
}

console.log(countPrimes(10));  // expected: 4   (2, 3, 5, 7)
console.log(countPrimes(0));   // expected: 0
console.log(countPrimes(1));   // expected: 0
console.log(countPrimes(100)); // expected: 25
