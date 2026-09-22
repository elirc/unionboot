// Exercise 38 — Integers → Roman numerals (greedy)
// Write intToRoman(num) for 1–3999. The greedy trick: keep a table of
// value/symbol pairs INCLUDING the subtractive ones (900 → "CM",
// 40 → "XL"...) and repeatedly peel off the biggest value that fits.
//
// Run with:  node 38-int-to-roman.js

function intToRoman(num) {
  // your code here
}

console.log(intToRoman(3));    // expected: III
console.log(intToRoman(58));   // expected: LVIII
console.log(intToRoman(1994)); // expected: MCMXCIV
console.log(intToRoman(3999)); // expected: MMMCMXCIX
