"use strict";
// Read-only validation of chapters 09-16 against existing references.
// Bounded oracles check published claims; they do not grade learner code.
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
  assert.ok(code, "reference section exists: " + id);
  return new Function(code + "\nreturn " + name + ";")();
}
function* arrays(alphabet, maxLength, prefix = []) {
  yield prefix;
  if (prefix.length < maxLength) for (const item of alphabet) yield* arrays(alphabet, maxLength, [...prefix, item]);
}
function slowProducts(values) {
  return values.map((_, excluded) => values.reduce((product, value, i) => i === excluded ? product : product * value, 1));
}
test("C09 360 bounded product cases, signed zero treated mathematically", () => {
  let count = 0;
  for (const values of arrays([-2, 0, 3], 5)) {
    if (values.length < 2) continue;
    const expected = slowProducts(values), actual = refs[51](Object.freeze(values));
    assert.equal(actual.length, expected.length);
    actual.forEach((value, i) => assert.ok(value === expected[i], JSON.stringify(values)));
    count++;
  }
  assert.equal(count, 360);
  const actual = refs[51]([2, 0, -3, 4]);
  assert.ok(actual.every((v, i) => v === [0, -24, 0, 0][i]));
});
function slowPeak(intervals) {
  let peak = 0;
  for (const [time] of intervals) {
    peak = Math.max(peak, intervals.filter(([start, end]) => start <= time && time < end).length);
  }
  return peak;
}
test("C10 closed merge copies pairs and does not shrink containers", () => {
  const input = Object.freeze([[12, 12], [2, 3], [1, 8], [8, 9]].map(Object.freeze));
  const output = refs[72](input);
  assert.deepEqual(output, [[1, 9], [12, 12]]);
  for (const pair of output) assert.ok(!input.includes(pair));
  output[0][1] = 99;
  assert.equal(input[2][1], 8);
});
test("C10 100 ordered interval-pair peak cases", () => {
  const intervals = [];
  for (let start = 0; start <= 3; start++) for (let end = start; end <= 3; end++) intervals.push([start, end]);
  let cases = 0;
  for (const a of intervals) for (const b of intervals) {
    const input = Object.freeze([Object.freeze([...a]), Object.freeze([...b])]);
    assert.equal(refs[73](input), slowPeak(input)); cases++;
  }
  assert.equal(cases, 100);
  assert.equal(refs[73]([[0, 10], [5, 15], [10, 20]]), 2);
  assert.equal(refs[73]([[1, 2], [1, 2]]), 2);
});
test("C11 linked-list reachability and first-match reference behavior", () => {
  const list = new refs[57]();
  [4, 7, 9].forEach(v => list.push(v));
  const removed = list.find(7);
  assert.equal(list.delete(7), true); assert.deepEqual(list.toArray(), [4, 9]);
  assert.equal(removed.value, 7); assert.equal(removed.next.value, 9);
  assert.equal(list.delete(4), true); assert.equal(list.delete(9), true);
  assert.equal(list.head, null); assert.equal(list.delete(99), false);
  list.push(2); list.push(2); list.delete(2); assert.deepEqual(list.toArray(), [2]);
});
test("C11 queue occupancy, chaining, clearing and independent instances", () => {
  const queue = new later[79](), other = new later[79](), object = { id: 1 };
  assert.equal(queue.enqueue(undefined), queue); queue.enqueue(0).enqueue(false).enqueue(object);
  assert.equal(queue.peek(), undefined); assert.equal(queue.size, 4);
  assert.equal(queue.dequeue(), undefined); assert.equal(queue.size, 3);
  assert.equal(queue.dequeue(), 0); assert.equal(queue.dequeue(), false); assert.equal(queue.dequeue(), object);
  assert.equal(queue.size, 0); assert.equal(other.size, 0);
  queue.enqueue(8); assert.equal(queue.clear(), queue); assert.equal(queue.size, 0);
  queue.enqueue(9); assert.equal(queue.dequeue(), 9); assert.equal(queue.dequeue(), undefined);
});
test("C12 recursive sum and BST example", () => {
  const treeSum = early(28, "treeSum");
  const leaf = value => Object.freeze({ value, children: Object.freeze([]) });
  const tree = Object.freeze({ value: 5, children: Object.freeze([leaf(-2), Object.freeze({ value: 4, children: Object.freeze([leaf(3)]) })]) });
  assert.equal(treeSum(tree), 10); assert.equal(treeSum(null), 0); assert.equal(treeSum(leaf(6)), 6);
  const bst = new refs[58]();
  [8, 3, 10, 6, 1, 14, 4, 6].forEach(n => bst.insert(n));
  assert.deepEqual(bst.toArray(), [1, 3, 4, 6, 8, 10, 14]);
  assert.equal(bst.has(7), false); assert.equal(bst.has(4), true);
});
function explicitLadder(begin, end, dictionary) {
  if (!dictionary.includes(end)) return 0;
  const words = [...new Set([begin, ...dictionary])], distance = new Map([[begin, 1]]), queue = [begin];
  for (let head = 0; head < queue.length; head++) {
    const word = queue[head];
    if (word === end) return distance.get(word);
    for (const next of words) {
      if (next.length !== word.length || distance.has(next)) continue;
      let differences = 0;
      for (let i = 0; i < word.length; i++) if (word[i] !== next[i]) differences++;
      if (differences === 1) { distance.set(next, distance.get(word) + 1); queue.push(next); }
    }
  }
  return 0;
}
test("C13 explicit graph agrees on six ladder boundaries", () => {
  const ladder = early(33, "ladderLength");
  const cases = [
    ["cold", "warm", ["cord", "card", "ward", "word", "warm"], 5],
    ["cat", "cot", ["cot"], 2],
    ["cat", "dog", ["dog"], 0],
    ["cat", "dog", ["cot"], 0],
    ["hit", "hit", ["hit"], 1],
    ["hit", "hit", [], 0]
  ];
  for (const [begin, end, words, expected] of cases) {
    assert.equal(explicitLadder(begin, end, words), expected);
    assert.equal(ladder(begin, end, Object.freeze(words)), expected);
  }
});
function orders(values) {
  if (!values.length) return [[]];
  const out = [];
  for (let i = 0; i < values.length; i++) for (const rest of orders(values.filter((_, j) => i !== j))) out.push([values[i], ...rest]);
  return out;
}
function validOrder(order, edges) {
  const position = new Map(order.map((value, i) => [value, i]));
  return edges.every(([before, after]) => position.get(before) < position.get(after));
}
test("C14 64 small DAGs checked against lexicographically ordered permutations", () => {
  const nodes = ["d", "b", "a", "c"], possible = [];
  for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) possible.push([nodes[i], nodes[j]]);
  const candidates = orders([...nodes].sort());
  for (let mask = 0; mask < 64; mask++) {
    const edges = possible.filter((_, i) => mask & (1 << i));
    const expected = candidates.find(order => validOrder(order, edges));
    assert.deepEqual(later[81](Object.freeze([...nodes]), Object.freeze(edges.map(edge => Object.freeze([...edge])))), expected);
  }
  assert.deepEqual(later[81](["a", "b", "c"], [["a", "b"]]), ["a", "b", "c"]);
  assert.deepEqual(later[81](["a", "b"], [["a", "b"], ["a", "b"]]), ["a", "b"]);
});
test("C14 self, two-node and disconnected cycles reject", () => {
  assert.throws(() => later[81](["a"], [["a", "a"]]), /cycle/);
  assert.throws(() => later[81](["a", "b"], [["a", "b"], ["b", "a"]]), /cycle/);
  assert.throws(() => later[81](["a", "b", "c"], [["b", "c"], ["c", "b"]]), /cycle/);
  assert.deepEqual(later[81]([], []), []);
});
test("C15 subset membership, input order and independent result arrays", () => {
  const input = Object.freeze([3, 1, 2]), output = sequence.subsets(input);
  assert.equal(output.length, 8); assert.equal(new Set(output.map(row => JSON.stringify(row))).size, 8);
  for (const row of output) {
    let prior = -1;
    for (const item of row) { const index = input.indexOf(item); assert.ok(index > prior); prior = index; }
  }
  assert.equal(new Set(output).size, output.length);
  assert.deepEqual(sequence.subsets([]), [[]]);
});
test("C15 six distinct permutations and one empty ordering", () => {
  const output = sequence.permutations(Object.freeze([1, 2, 3]));
  assert.equal(output.length, 6); assert.equal(new Set(output.map(row => JSON.stringify(row))).size, 6);
  for (const row of output) assert.deepEqual([...row].sort(), [1, 2, 3]);
  assert.equal(new Set(output).size, output.length); assert.deepEqual(sequence.permutations([]), [[]]);
});
function enumerateStairs(remaining) {
  if (remaining === 0) return [[]];
  if (remaining < 0) return [];
  return [...enumerateStairs(remaining - 1).map(row => [1, ...row]), ...enumerateStairs(remaining - 2).map(row => [2, ...row])];
}
test("C16 cold/warm counts and bounded stair enumeration", () => {
  const suite = sequence.fibonacciSuite();
  assert.equal(suite.fibNaive(6), 8); assert.equal(suite.fibMemo(6), 8); assert.equal(suite.fibIter(6), 8);
  assert.deepEqual(suite.counts(), { naiveCalls: 25, memoCalls: 11 });
  suite.fibMemo(6); assert.equal(suite.counts().memoCalls, 12);
  for (let n = 0; n <= 10; n++) assert.equal(refs[53](n), enumerateStairs(n).length);
  assert.equal(refs[53](3), 3); assert.equal(refs[53](4), 5); assert.equal(refs[53](5), 8);
});
