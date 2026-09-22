// Exercise 55 — Mini JSON database (class, files, JSON)
// Build a TinyDB class over a JSON file: constructor(path, defaults),
// get(key), set(key, value), save(), plus load-on-first-use.
// Every mutation should auto-save. Use node:fs synchronously
// (readFileSync / writeFileSync) — this is a learning exercise.
//
// Run with:  node 55-sqlite-free-json-db.js
// It creates db.json next to itself; delete it between runs for a clean slate.

const fs = require("node:fs");
const path = require("node:path");

class TinyDB {
  // your code here — constructor(path, defaults), get, set, save
}

// --- self-test (leave this code as is) ---
const file = path.join(__dirname, "db.json");
if (fs.existsSync(file)) fs.unlinkSync(file);

const db = new TinyDB(file, { visits: 0, users: [] });
console.log(db.get("visits"));       // expected: 0
db.set("visits", 1);
db.set("users", [{ id: 1, name: "Ada" }]);
console.log(db.get("users")[0].name); // expected: Ada

const db2 = new TinyDB(file, { visits: 0, users: [] });
console.log(db2.get("visits"));      // expected: 1  (loaded from disk!)
