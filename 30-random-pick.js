// Exercise 30 — Random picker (closures + randomness)
// Write picker(items) that returns a function pick().
//   pick()        → a random item, WITHOUT repeating until all are used once
//   pick.reset()  → put all items back in play
// When every item has been used, reset automatically.
//
// Run with:  node 30-random-pick.js

function picker(items) {
  // your code here
}

const p = picker(["a", "b", "c"]);
const picks = [p(), p(), p()];
console.log([...picks].sort());     // expected: [ 'a', 'b', 'c' ] (all three, any order)
console.log(typeof p.reset);        // expected: function
