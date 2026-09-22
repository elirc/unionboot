// Exercise 22 — Balanced brackets (stack)
// Write isBalanced(str) — true if every bracket in the string closes
// correctly and in the right order. Brackets: () [] {}
//
// Run with:  node 22-stack-queue.js

function isBalanced(str) {
  // your code here
}

console.log(isBalanced("{[()]}"));      // expected: true
console.log(isBalanced("([)]"));        // expected: false (wrong order)
console.log(isBalanced("((()))"));      // expected: true
console.log(isBalanced("(()"));         // expected: false (unclosed)
console.log(isBalanced("no brackets")); // expected: true
console.log(isBalanced(")("));          // expected: false (closes before opens)
