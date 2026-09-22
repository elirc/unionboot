// Exercise 18 — Event emitter (classes, callbacks, Map of arrays)
// Build a class Emitter with:
//   on(event, fn)      → register a listener
//   emit(event, ...args) → call every listener for that event with args
//   off(event, fn)     → remove one listener
// Listeners should fire in registration order. Emitting an event
// with no listeners must not throw.
//
// Run with:  node 18-event-emitter.js

class Emitter {
  // your code here
}

const bus = new Emitter();
const seen = [];
const shout = (msg) => seen.push(`shout: ${msg}`);
const log = (msg) => seen.push(`log: ${msg}`);

bus.on("message", shout);
bus.on("message", log);
bus.emit("message", "hi");      // both fire, in order
bus.off("message", log);
bus.emit("message", "again");   // only shout fires
bus.emit("nope");               // no listeners, must not throw

console.log(seen);
// expected: [ 'shout: hi', 'log: hi', 'shout: again' ]
