"use strict";
// Read-only checks of course claims against existing reference implementations.
// This does not grade a learner's independent implementation.
const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const repo = path.resolve(__dirname, "../..");
const refs = require(path.join(repo, "solutions/round2-remaining.cjs"));
const sequence = require(path.join(repo, "solutions/round2-39-50.cjs"));
const later = require(path.join(repo, "solutions/missing-refs.cjs"));
const markdown = fs.readFileSync(path.join(repo, "SOLUTIONS.md"), "utf8");
function early(id, name) {
  const section = markdown.split(new RegExp("^## " + String(id).padStart(2, "0") + "\\b", "m"))[1]?.split(/^## /m)[0];
  const code = section?.match(/```js\r?\n([\s\S]*?)```/)?.[1];
  assert.ok(code, "reference section " + id + " exists");
  return new Function(code + "\nreturn " + name + ";")();
}
test("C01 distinct negatives and preservation", () => {
  const secondLargest = early(3, "secondLargest");
  const values = Object.freeze([-5, -2, -7, -2]);
  assert.equal(secondLargest(values), -5);
  assert.equal(secondLargest([9, 9, 4]), 4);
  assert.equal(secondLargest([5, 5]), undefined);
});
test("C02 path presence differs from traversability", () => {
  const absent = Symbol("absent");
  const root = { profile: { middle: undefined } };
  assert.equal(later[69](root, ["profile", "middle"], absent), undefined);
  assert.equal(later[69](root, ["profile", "middle", "initial"], absent), absent);
  assert.equal(later[69]({}, ["toString"], absent), absent);
  assert.equal(later[69](7, [], absent), 7);
});
test("C02 string-only merge collision fixture", () => {
  const merge = require(path.join(repo, "js-capstones/solutions/3439.cjs"));
  assert.deepEqual(merge({}, { a: "absent" }, { a: "x" }), { value: { a: "absent" }, conflicts: ["a"] });
});
test("C03 counting and grouping worked examples", () => {
  const unique = early(13, "firstUniqueChar");
  const anagrams = early(16, "areAnagrams");
  const group = early(25, "groupBy");
  assert.equal(unique("reappear"), -1);
  assert.equal(unique("reappearx"), 8);
  assert.equal(unique("cabac"), 2);
  assert.equal(anagrams("aab", "abb"), false);
  assert.deepEqual(group(["x", "y"], () => "constructor"), { constructor: ["x", "y"] });
});
test("C04 cached undefined and object identity", () => {
  const memoize = early(27, "memoize");
  let calls = 0;
  const missing = memoize(() => { calls++; return undefined; });
  missing(1); missing(1);
  assert.equal(calls, 1);
  const fresh = memoize(key => ({ id: key.id }));
  const a = { id: 1 }, b = { id: 1 };
  assert.equal(fresh(a), fresh(a));
  assert.notEqual(fresh(a), fresh(b));
});
test("C05 cache writes and undefined reads refresh recency", () => {
  const Cache = early(17, "LRUCache");
  const cache = new Cache(3);
  cache.put("a", 10); cache.put("b", 20); cache.put("c", 30);
  assert.equal(cache.get("a"), 10);
  cache.put("b", 21); cache.put("d", 40);
  assert.equal(cache.get("c"), undefined);
  assert.equal(cache.get("b"), 21);
  const undefinedCache = new Cache(2);
  undefinedCache.put("a", undefined); undefinedCache.put("b", 2);
  undefinedCache.get("a"); undefinedCache.put("c", 3);
  assert.equal(undefinedCache.get("b"), undefined);
});
test("C05 one listener removal preserves another registration", () => {
  const Emitter = early(18, "Emitter");
  const bus = new Emitter(), seen = [];
  const first = () => seen.push("first"), second = () => seen.push("second");
  bus.on("event", first); bus.on("event", second); bus.on("event", first);
  bus.emit("event"); bus.off("event", first); bus.emit("event"); bus.emit("missing");
  assert.deepEqual(seen, ["first", "second", "first", "second", "first"]);
});
test("C06 structural sharing and stable shallow sort", () => {
  const reducer = early(23, "todoReducer");
  const a = Object.freeze({ id: 1, text: "a", done: false });
  const b = Object.freeze({ id: 2, text: "b", done: false });
  const state = Object.freeze([a, b]);
  const next = reducer(state, { type: "TOGGLE", id: 1 });
  assert.notEqual(next, state); assert.notEqual(next[0], a);
  assert.equal(a.done, false); assert.equal(next[0].done, true); assert.equal(next[1], b);
  assert.notEqual(reducer(state, { type: "unknown" }), state);
  const rows = Object.freeze([Object.freeze({ id: "z", score: 2 }), Object.freeze({ id: "a", score: 2 })]);
  const sorted = later[68](rows, [{ key: "score", direction: "asc" }]);
  assert.deepEqual(sorted.map(row => row.id), ["z", "a"]);
  assert.notEqual(sorted, rows); assert.equal(sorted[0], rows[0]);
});
test("C07 merge multiplicity, in-place compaction and search", () => {
  assert.deepEqual(sequence.mergeSorted([1, 4, 4, 9], [2, 4, 8]), [1, 2, 4, 4, 4, 8, 9]);
  const values = [0, -2, 0, 3, -2];
  refs[35](values); assert.deepEqual(values, [-2, 3, -2, 0, 0]);
  assert.equal(refs[59]([1, 3, 5, 7], 1), 0);
  assert.equal(refs[59]([1, 3, 5, 7], 7), 3);
  assert.equal(refs[59]([1, 3, 5, 7], 4), -1);
  assert.equal(refs[59]([], 1), -1);
});
function* arrays(alphabet, maxLength, prefix = []) {
  yield prefix;
  if (prefix.length < maxLength) for (const value of alphabet) yield* arrays(alphabet, maxLength, [...prefix, value]);
}
function slowUnique(text) {
  let best = 0;
  for (let start = 0; start < text.length; start++) for (let end = start + 1; end <= text.length; end++) {
    const part = text.slice(start, end);
    if (new Set(part).size === part.length) best = Math.max(best, part.length);
  }
  return best;
}
function slowMaximum(values) {
  let best = -Infinity;
  for (let start = 0; start < values.length; start++) for (let end = start + 1; end <= values.length; end++) {
    const sum = values.slice(start, end).reduce((a, b) => a + b, 0);
    best = Math.max(best, sum);
  }
  return best;
}
test("C08 bounded independent oracle: 364 ASCII strings", () => {
  let cases = 0;
  for (const values of arrays(["a", "b", "c"], 5)) {
    const text = values.join("");
    assert.equal(sequence.lengthOfLongestSubstring(text), slowUnique(text), text); cases++;
  }
  assert.equal(cases, 364);
  assert.equal(sequence.lengthOfLongestSubstring("dvdf"), 3);
});
test("C08 bounded independent oracle: 363 nonempty arrays", () => {
  let cases = 0;
  for (const values of arrays([-2, 0, 3], 5)) {
    if (!values.length) continue;
    assert.equal(refs[36](values), slowMaximum(values), JSON.stringify(values)); cases++;
  }
  assert.equal(cases, 363);
  assert.equal(refs[36]([-4, 2, -1, 3, -5, 4]), 4);
});
