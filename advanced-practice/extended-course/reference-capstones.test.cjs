"use strict";
// Read-only course/reference consistency checks, not a learner submission grader.
const assert = require("node:assert/strict");
const { test } = require("node:test");
const path = require("node:path");
const repo = path.resolve(__dirname, "../..");
const refs = require(path.join(repo, "solutions/round2-remaining.cjs"));
const later = require(path.join(repo, "solutions/missing-refs.cjs"));
const merge = require(path.join(repo, "js-capstones/solutions/3439.cjs"));
const replay = require(path.join(repo, "js-capstones/solutions/3440.cjs"));
const diff = require(path.join(repo, "js-capstones/solutions/3441.cjs"));
function gridRoutes(rows, columns, row = 0, column = 0) {
  if (row >= rows || column >= columns) return 0;
  if (row === rows - 1 && column === columns - 1) return 1;
  return gridRoutes(rows, columns, row + 1, column) + gridRoutes(rows, columns, row, column + 1);
}
test("C17 25 small grids against move enumeration", () => {
  let count = 0;
  for (let rows = 1; rows <= 5; rows++) for (let columns = 1; columns <= 5; columns++) {
    assert.equal(refs[52](rows, columns), gridRoutes(rows, columns));
    assert.equal(refs[52](rows, columns), refs[52](columns, rows)); count++;
  }
  assert.equal(count, 25); assert.equal(refs[52](3, 4), 10);
});
function fewestByBfs(coins, amount) {
  const queue = [[0, 0]], seen = new Set([0]);
  for (let head = 0; head < queue.length; head++) {
    const [sum, count] = queue[head];
    if (sum === amount) return count;
    for (const coin of coins) {
      const next = sum + coin;
      if (next <= amount && !seen.has(next)) { seen.add(next); queue.push([next, count + 1]); }
    }
  }
  return -1;
}
test("C18 39 coin cases against BFS, plus duplicate denomination", () => {
  let count = 0;
  for (const coins of [[1, 3, 4], [2, 4], [2, 5]]) for (let amount = 0; amount <= 12; amount++) {
    assert.equal(refs[54](Object.freeze(coins), amount), fewestByBfs(coins, amount)); count++;
  }
  assert.equal(count, 39); assert.equal(refs[54]([1, 3, 4], 6), 2); assert.equal(refs[54]([1, 3, 3, 4], 6), 2);
});
test("C19 empty leaves, round trip and both conflict insertion orders", () => {
  const flags = Object.freeze({});
  const input = Object.freeze({ user: Object.freeze({ name: "Ada", flags }), active: true });
  const flat = later[70](input), rebuilt = later[71](flat);
  assert.deepEqual([...flat], [["user.name", "Ada"], ["user.flags", {}], ["active", true]]);
  assert.notEqual(flat.get("user.flags"), flags);
  assert.deepEqual(rebuilt, input); assert.notEqual(rebuilt.user.flags, flat.get("user.flags"));
  for (const entries of [[["a", {}], ["a.b", 1]], [["a.b", 1], ["a", {}]]]) assert.throws(() => later[71](new Map(entries)));
  for (const invalid of ["", ".a", "a.", "a..b", "__proto__.x", "a.constructor", "prototype.x"]) assert.throws(() => later[71](new Map([[invalid, 1]])));
});
function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
test("C20 indexed completion waits for missing earlier positions", async () => {
  const a = deferred(), b = deferred(), c = deferred(); let finished = false;
  const aggregate = refs[60]([a.promise, b.promise, c.promise]);
  aggregate.then(() => { finished = true; });
  c.resolve("c"); await Promise.resolve(); assert.equal(finished, false);
  a.resolve("a"); b.resolve("b"); assert.deepEqual(await aggregate, ["a", "b", "c"]);
  assert.deepEqual(await refs[61]([2, Promise.reject("no")]), [{ status: "fulfilled", value: 2 }, { status: "rejected", reason: "no" }]);
});
test("C20 bounded pool stops after observed failure and handles late failure", async () => {
  const gates = [deferred(), deferred()], starts = [], reason = { failure: "first" }, late = { failure: "late" };
  const aggregate = refs[62]([0, 1, 2, 3], 2, (_, index) => { starts.push(index); return gates[index].promise; });
  const rejected = assert.rejects(aggregate, error => error === reason);
  assert.deepEqual(starts, [0, 1]); gates[1].reject(reason); await rejected;
  gates[0].reject(late); await Promise.resolve(); await Promise.resolve();
  assert.deepEqual(starts, [0, 1]);
});
test("C20 sequential reduction and stage recovery preserve their contracts", async () => {
  const seen = [];
  const result = await refs[63]([2, 3, 4], async (acc, value, index) => { seen.push([acc, index]); return acc * value; }, Promise.resolve(1));
  assert.equal(result, 24); assert.deepEqual(seen, [[1, 0], [2, 1], [6, 2]]);
  const pipeline = later[83]([n => n + 1, () => { throw Error("stage"); }, n => n * 10]);
  pipeline.use(({ stageIndex }) => stageIndex); assert.equal(await pipeline.run(5), 10);
  const initialReason = { initial: true }; await assert.rejects(pipeline.run(Promise.reject(initialReason)), e => e === initialReason);
});
test("C20 timeout does not cancel input and abort keeps reason identity", async () => {
  assert.equal(await refs[64](Promise.resolve("ready"), 0), "ready");
  const work = deferred(); await assert.rejects(refs[64](work.promise, 0), /Timed out/);
  work.resolve("later"); assert.equal(await work.promise, "later");
  const controller = new AbortController(), reason = { cancelled: true };
  const waiting = refs[65](1000, controller.signal), rejected = assert.rejects(waiting, e => e === reason);
  controller.abort(reason); await rejected;
  await assert.rejects(refs[65](-1, controller.signal), RangeError);
});
test("C21 multi-key decisions and asymmetric selections", () => {
  const base = Object.freeze({ title: "old", color: "blue", note: "keep", archived: "yes" });
  const local = Object.freeze({ title: "local", color: "blue", archived: "yes" });
  const remote = Object.freeze({ title: "remote", color: "green", note: "revised" });
  assert.deepEqual(merge(base, local, remote), { value: { color: "green", title: "local" }, conflicts: ["note", "title"] });
  assert.deepEqual(merge(base, base, remote), { value: remote, conflicts: [] });
  assert.deepEqual(merge(base, local, base), { value: local, conflicts: [] });
  const swapped = merge(base, remote, local);
  assert.deepEqual(swapped.conflicts, ["note", "title"]); assert.equal(swapped.value.title, "remote");
});
test("C22 validation precedes duplicate suppression; order and arithmetic reject", () => {
  const a = Object.freeze({ id: "a", revision: 1, delta: 5 }), b = Object.freeze({ id: "b", revision: 2, delta: -3 });
  assert.deepEqual(replay(10, Object.freeze([b, a, a])), { balance: 12, revision: 2, applied: ["a", "b"] });
  assert.throws(() => replay(0, [a, { id: "a", revision: 1, delta: 0.5 }]));
  assert.throws(() => replay(0, [{ id: "a", revision: 1, delta: 0 }, { id: "b", revision: 1, delta: 0 }]));
  assert.throws(() => replay(0, [{ id: "a", revision: 1, delta: -1 }, { id: "b", revision: 2, delta: 1 }]));
});
test("C23 pointer shape, atomic arrays and deep ownership", () => {
  assert.deepEqual(diff({ "a/b": 1, "~": true }, { "a/b": 2 }), [{ op: "replace", path: "/a~1b", value: 2 }, { op: "remove", path: "/~0" }]);
  const removal = diff({ a: 1 }, {})[0]; assert.equal(Object.hasOwn(removal, "value"), false);
  assert.deepEqual(diff({ "~/": 1 }, { "~/": 2 }), [{ op: "replace", path: "/~0~1", value: 2 }]);
  assert.deepEqual(diff({ "": 1 }, { "": 2 }), [{ op: "replace", path: "/", value: 2 }]);
  assert.deepEqual(diff([1], [1, 2]), [{ op: "replace", path: "", value: [1, 2] }]);
  assert.deepEqual(diff([{ a: 1, b: 2 }], [{ b: 2, a: 1 }]), []);
  const after = { n: { v: [1] } }, output = diff({}, after);
  output[0].value.v.push(2); assert.deepEqual(after.n.v, [1]);
});
test("C24 worked combined report keeps document and ledger domains separate", () => {
  const base = Object.freeze({ title: "old", note: "keep" }), local = Object.freeze({ title: "local" }), remote = Object.freeze({ title: "remote", note: "revised" });
  const merged = merge(base, local, remote), events = [{ id: "b", revision: 2, delta: -3 }, { id: "a", revision: 1, delta: 5 }, { id: "a", revision: 1, delta: 5 }];
  assert.deepEqual(merged, { value: { title: "local" }, conflicts: ["note", "title"] });
  assert.deepEqual(diff(base, merged.value), [{ op: "remove", path: "/note" }, { op: "replace", path: "/title", value: "local" }]);
  assert.deepEqual(replay(10, events), { balance: 12, revision: 2, applied: ["a", "b"] });
});
for (const id of [3439, 3440, 3441]) test("Existing capstone assertions " + id, () => {
  require(path.join(repo, "js-capstones/tests/" + id + ".cjs"))(require(path.join(repo, "js-capstones/solutions/" + id + ".cjs")));
});
