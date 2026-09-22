// Exercise 57 — Linked list (pointers via object references)
// Implement a singly linked list:
//   class LinkedList { push(value), find(value), delete(value), toArray() }
// Nodes are { value, next }. delete on a missing value returns false,
// on success true. Keep a `head` reference; empty list head = null.
//
// Run with:  node 57-linked-list.js

class LinkedList {
  // your code here (plus a Node helper class or plain objects)
}

const list = new LinkedList();
list.push(1);
list.push(2);
list.push(3);
console.log(list.toArray());     // expected: [ 1, 2, 3 ]
console.log(list.find(2));       // expected: { value: 2, next: { value: 3, next: null } }
console.log(list.find(99));      // expected: null
console.log(list.delete(2));     // expected: true
console.log(list.toArray());     // expected: [ 1, 3 ]
console.log(list.delete(99));    // expected: false
console.log(list.delete(1));     // expected: true (deleting the head)
console.log(list.toArray());     // expected: [ 3 ]
