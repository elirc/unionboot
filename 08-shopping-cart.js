// Exercise 8 — Shopping cart (reduce + business rules)
// Write checkout(cart) returning { subtotal, discount, total }.
// Discount rules on the subtotal:
//   subtotal > 1000 → 20% off
//   subtotal > 500  → 10% off
//   otherwise       → no discount
//
// Run with:  node 08-shopping-cart.js

const cart = [
  { name: "Keyboard", price: 80, qty: 1 },
  { name: "Cable", price: 5, qty: 4 },
  { name: "Monitor", price: 250, qty: 2 },
];

function checkout(cart) {
  // your code here
}

console.log(checkout(cart));
// expected: { subtotal: 600, discount: 60, total: 540 }

console.log(checkout([{ name: "Pen", price: 3, qty: 2 }]));
// expected: { subtotal: 6, discount: 0, total: 6 }
