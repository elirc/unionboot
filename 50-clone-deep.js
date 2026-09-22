// Exercise 50 — Deep clone (recursion, cycles, special types)
// Write deepClone(value) that copies objects/arrays ALL the way down.
// Requirements:
//   - nested objects and arrays are new objects (no shared references)
//   - Date instances come back as working Dates
//   - circular references must not crash (use a WeakMap of already-seen)
//   - primitives return as-is
//
// Run with:  node 50-clone-deep.js

function deepClone(value) {
  // your code here
}

const original = { a: 1, b: { c: [1, 2, { d: new Date("2026-01-01") }] } };
const copy = deepClone(original);
console.log(copy !== original);                    // expected: true
console.log(copy.b.c[2].d !== original.b.c[2].d);  // expected: true
console.log(copy.b.c[2].d.getFullYear());          // expected: 2026

const cyc = { name: "loop" };
cyc.self = cyc;
const cycCopy = deepClone(cyc);
console.log(cycCopy !== cyc && cycCopy.self === cycCopy); // expected: true
console.log(deepClone(42));                        // expected: 42
