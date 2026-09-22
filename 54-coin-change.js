// Exercise 54 — Coin change (dynamic programming)
// Write coinChange(coins, amount) — the FEWEST coins summing to
// amount, or -1 if impossible. Unlimited supply of each coin.
// DP: ways[k] = fewest coins for amount k; try every coin for every k.
//
// Run with:  node 54-coin-change.js

function coinChange(coins, amount) {
  // your code here
}

console.log(coinChange([1, 2, 5], 11)); // expected: 3  (5+5+1)
console.log(coinChange([2], 3));        // expected: -1
console.log(coinChange([1], 0));        // expected: 0
console.log(coinChange([186, 419, 83, 408], 6249)); // expected: 20
