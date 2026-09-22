// Exercise 79 — A first-in-first-out queue with O(1) operations
// Implement class Queue with enqueue(value) (returns this), dequeue()
// (oldest value, or undefined when empty), peek(), size (read-only getter),
// and clear(). Correct FIFO order for any interleaving of operations.
// NO array.shift() in dequeue or peek — implement the head-index (or
// two-stack) technique so dequeue is amortized O(1) on large queues.
// Values may be anything, including undefined; peek/dequeue on an empty
// queue return undefined and never throw. clear() empties and returns this.
// Hint: a plain object or Map plus a head cursor works; recall that Map
// preserves insertion order, so 'first still-present key' is the head.
// Run with: node 79-queue-class.js
const assert = require("node:assert/strict");
class Queue {
  // your code here
}
const queue = new Queue();
queue.enqueue(1).enqueue(2).enqueue(3);
assert.equal(queue.dequeue(), 1);
queue.enqueue(4);
assert.deepEqual([queue.dequeue(), queue.dequeue(), queue.dequeue(), queue.dequeue()], [2, 3, 4, undefined]);
assert.equal(new Queue().peek(), undefined);
console.log("79 sample checks passed");
