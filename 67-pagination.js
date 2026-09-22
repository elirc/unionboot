// Exercise 67 — Paginate without off-by-one errors
// Write paginate(items, page, pageSize). page/pageSize must be positive
// integers (throw RangeError otherwise). Return {items, page, pageSize,
// totalItems, totalPages, hasPrevious, hasNext}. Returned items is a new
// shallow array. Pages are 1-based; empty input has totalPages=0, page=1.
// Clamp requested page to the last available page (or 1 if empty).
// hasPrevious means effective page > 1; hasNext means page < totalPages.
// Do not change input or clone the item objects. Dense input array.
// Hint: compute totalPages, then clamp, then compute the slice offset.
// Run with: node 67-pagination.js
const assert = require("node:assert/strict");
function paginate(items, page, pageSize) {
  // your code here
  throw new Error("TODO: paginate");
}
assert.deepEqual(paginate(["a", "b", "c", "d", "e"], 9, 2), {
  items: ["e"], page: 3, pageSize: 2, totalItems: 5, totalPages: 3,
  hasPrevious: true, hasNext: false,
});
assert.deepEqual(paginate([], 8, 2), {
  items: [], page: 1, pageSize: 2, totalItems: 0, totalPages: 0,
  hasPrevious: false, hasNext: false,
});
assert.throws(() => paginate([], 0, 2), RangeError);
console.log("67 sample checks passed");
