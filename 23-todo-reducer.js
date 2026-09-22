// Exercise 23 — Todo reducer (pure functions & immutability)
// Write a reducer function todoReducer(state, action) that NEVER
// mutates its inputs. Every action returns a brand-new state object/array.
// Actions:
//   { type: "ADD", text }
//   { type: "TOGGLE", id }
//   { type: "REMOVE", id }
// A todo looks like { id, text, done }. State starts as [].
//
// Run with:  node 23-todo-reducer.js

function todoReducer(state, action) {
  // your code here
}

const s0 = [];
const s1 = todoReducer(s0, { type: "ADD", text: "learn closures" });
const s2 = todoReducer(s1, { type: "ADD", text: "learn promises" });
const s3 = todoReducer(s2, { type: "TOGGLE", id: 1 });
const s4 = todoReducer(s3, { type: "REMOVE", id: 2 });

console.log(s0); // expected: []                    (original untouched!)
console.log(s1); // expected: [{ id: 1, text: 'learn closures', done: false }]
console.log(s3); // expected: [{ id: 1, ..., done: true }, { id: 2, ..., done: false }]
console.log(s4); // expected: [{ id: 1, ..., done: true }]
console.log(s1 === s2 || s2 === s3); // expected: false (no shared references)
