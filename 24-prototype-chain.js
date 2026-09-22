// Exercise 24 — Prototypes & `this` (classes, inheritance)
// Build a class hierarchy:
//   Animal  → constructor(name), describe() returns "NAME is an animal"
//   Dog     → extends Animal, describe() returns "NAME is a dog", plus bark() → "WOOF"
// BONUS: override describe() in Dog so it reuses Animal's via super()
//
// Run with:  node 24-prototype-chain.js

// your code here

// expected: Rex is a dog
console.log(/* describe a Dog named Rex */);

// expected: Rex is an animal
console.log(/* describe a plain Animal named Rex */);

// expected: true  (Dog extends Animal)
console.log(/* a Dog instance instanceof Animal */);
