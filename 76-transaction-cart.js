// Exercise 76 — Atomic cart edits using integer cents
// Write applyCartBatch(cart, operations). cart is a valid array of unique
// {sku,priceCents,qty}; sku is a nonempty string, priceCents is integer >= 0,
// qty is integer >= 1. Supported operations (only these fields matter):
// {type:'add',sku,priceCents,qty}: add quantity; an existing SKU must have
// the same price. {type:'remove',sku,qty}: subtract qty, remove row at zero.
// Reject bad fields, unknown type/SKU, conflicting price or over-removal
// with Error. On success return {items,totalCents}, with entirely NEW rows.
// NEVER mutate cart or operations, even if a later operation fails.
// Existing row order remains; new/re-added SKUs append in operation order.
// All valid quantities/prices/totals stay within safe integer range; no tax.
// Hint: clone rows into a Map first and work on that draft, not the caller's
// array. Only return the draft after every operation has validated.
// Run with: node 76-transaction-cart.js
const assert = require("node:assert/strict");
function applyCartBatch(cart, operations) {
  // your code here
  throw new Error("TODO: applyCartBatch");
}
const cart = [{ sku: "tea", priceCents: 125, qty: 2 }];
assert.deepEqual(applyCartBatch(cart, [
  { type: "add", sku: "tea", priceCents: 125, qty: 1 },
  { type: "remove", sku: "tea", qty: 2 },
]), { items: [{ sku: "tea", priceCents: 125, qty: 1 }], totalCents: 125 });
assert.throws(() => applyCartBatch(cart, [{ type: "remove", sku: "tea", qty: 3 }]), Error);
assert.equal(cart[0].qty, 2);
console.log("76 sample checks passed");
