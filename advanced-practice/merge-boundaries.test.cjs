"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const solve = require("../js-capstones/solutions/3439.cjs");

// Deliberately defective teaching mutant: never used by an exercise or app.
function stringFallbackMutant(base, local, remote) {
  const read = (row, key) => row[key] ?? "absent";
  const entries = [], conflicts = [];
  for (const key of [...new Set([...Object.keys(base), ...Object.keys(local), ...Object.keys(remote)])].sort()) {
    const b = read(base, key), l = read(local, key), r = read(remote, key);
    let value;
    if (l === r) value = l;
    else if (l === b) value = r;
    else if (r === b) value = l;
    else { conflicts.push(key); value = l; }
    if (value !== "absent") entries.push([key, value]);
  }
  return { value: Object.fromEntries(entries), conflicts };
}

test("nullish coalescing preserves empty strings; OR does not", () => {
  assert.equal("" ?? "missing", "");
  assert.equal("" || "missing", "missing");
});
test("string fallback collision is a real counterexample", () => {
  const input = [{ a: "absent" }, {}, { a: "changed" }];
  const expected = { value: {}, conflicts: ["a"] };
  assert.deepEqual(solve(...input), expected);
  assert.notDeepEqual(stringFallbackMutant(...input), expected);
});
test("inherited values do not mean an own property is present", () => {
  const remote = Object.create({ a: "new" });
  assert.equal(Object.hasOwn(remote, "a"), false);
  const input = [{ a: "old" }, { a: "new" }, remote];
  const expected = { value: { a: "new" }, conflicts: ["a"] };
  assert.deepEqual(solve(...input), expected);
  assert.notDeepEqual(stringFallbackMutant(...input), expected);
});
test("string assignment to __proto__ does not create the required data key", () => {
  const special = JSON.parse('{"__proto__":"data","constructor":"ok"}');
  const output = solve({}, special, {}).value;
  assert.equal(Object.hasOwn(output, "__proto__"), true);
  assert.equal(output.__proto__, "data");
  const wrong = {};
  wrong.__proto__ = "data";
  assert.equal(Object.hasOwn(wrong, "__proto__"), false);
  assert.equal(Object.getPrototypeOf(wrong), Object.prototype);
});
test("undefined can encode absence within an own-string-only contract", () => {
  const read = (record, key) => Object.hasOwn(record, key) ? record[key] : undefined;
  assert.equal(read({}, "a"), undefined);
  assert.equal(read({ a: "" }, "a"), "");
  assert.equal(read({ a: "undefined" }, "a"), "undefined");
});
test("finite presence oracle independently checks 64 one-key triples", () => {
  const states = [{ present: false }, ...["", "x", "absent"].map(value => ({ present: true, value }))];
  const equal = (a, b) => a.present === b.present && (!a.present || a.value === b.value);
  const record = state => Object.freeze(state.present ? { a: state.value } : {});
  let checked = 0;
  for (const b of states) for (const l of states) for (const r of states) {
    let chosen, conflict = false;
    if (equal(l, r)) chosen = l;
    else if (equal(l, b)) chosen = r;
    else if (equal(r, b)) chosen = l;
    else { chosen = l; conflict = true; }
    assert.deepEqual(solve(record(b), record(l), record(r)), {
      value: chosen.present ? { a: chosen.value } : {}, conflicts: conflict ? ["a"] : []
    });
    checked++;
  }
  assert.equal(checked, 64);
});
test("frozen inputs, local deletion and lexicographic conflicts coexist", () => {
  const base = Object.freeze({ z: "old", a: "old" });
  const local = Object.freeze({ z: "local" });
  const remote = Object.freeze({ z: "remote", a: "remote" });
  assert.deepEqual(solve(base, local, remote), { value: { z: "local" }, conflicts: ["a", "z"] });
  assert.deepEqual(base, { z: "old", a: "old" });
});
