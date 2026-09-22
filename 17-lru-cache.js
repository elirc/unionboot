// Exercise 17 — LRU-style cache (classes & Map ordering)
// Build a class LRUCache with constructor(capacity) and methods:
//   get(key)   → value or undefined
//   put(key, value)
// Evict the LEAST recently used item when over capacity.
// get/put both count as "use". A plain Map remembers insertion order —
// delete + re-set a key to make it the newest.
//
// Run with:  node 17-lru-cache.js

class LRUCache {
  constructor(capacity) {
    // your code here
  }
  get(key) {
    // your code here
  }
  put(key, value) {
    // your code here
  }
}

const cache = new LRUCache(2);
cache.put("a", 1);
cache.put("b", 2);
console.log(cache.get("a")); // expected: 1
cache.put("c", 3);           // capacity exceeded → "b" is least recently used → evicted
console.log(cache.get("b")); // expected: undefined
console.log(cache.get("a")); // expected: 1
console.log(cache.get("c")); // expected: 3
