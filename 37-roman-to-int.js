// Exercise 37 — Roman numerals → integers (value tables + lookahead)
// Write romanToInt(s). The wrinkle: when a smaller value precedes a
// bigger one (IV, IX, XL...), it's SUBTRACTED, not added.
//
// Run with:  node 37-roman-to-int.js

function romanToInt(s) {
  // your code here
}

console.log(romanToInt("III"));     // expected: 3
console.log(romanToInt("LVIII"));   // expected: 58  (L=50, V=5, III=3)
console.log(romanToInt("MCMXCIV")); // expected: 1994 (M, CM, XC, IV)
