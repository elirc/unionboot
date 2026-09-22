// Exercise 5 — FizzBuzz (loops & conditionals)
// Print numbers 1–30. For multiples of 3 print "Fizz",
// multiples of 5 print "Buzz", multiples of both print "FizzBuzz".
//
// Run with:  node 05-fizzbuzz.js
// First lines should be: 1, 2, Fizz, 4, Buzz, Fizz, 7 ...
// Line 15 should be: FizzBuzz

for (let i = 1; i <= 30; i++) {
  if (i % 15 === 0) console.log("FizzBuzz");
  else if (i % 3 === 0) console.log("Fizz");
  else if (i % 5 === 0) console.log("Buzz");
  else console.log(i);
}
